const Canvas = require("./Canvas");
const Player = require("./Player");

module.exports = (io) => {
  class Room {
    constructor(id, rounds, time, wordlist = []) {
      this.id = id;
      this.canvas = new Canvas();
      this.players = new Set();
      this.playerQueue = null;
      this.root = null;
      this.drawer = null;
      this.chat = [];
      this.state = "Lobby";
      this.votekick = 0;
      this.round = 0;
      this.maxRounds = rounds;
      this.timePerDraw = time;
      this.drawStartTime = null;
      this.wordlist = wordlist.length < 10 ? require("./wordlist") : wordlist;
      this.word = "";
      this.drawingTimeout = null;
      this.roundDrawers = [];
    }

    startGame() {
      this.nextRound();
    }

    nextRound() {
      if (this.round >= this.maxRounds) {
        io.to(this.id).emit(
          "game end",
          [...this.players]
            .map((p) => p.info())
            .sort((p1, p2) => p2.points - p1.points)
        );
        this.round = 0;
        this.state = "End";
        return;
      }
      this.round++;
      this.roundDrawers = Array.from(this.players);
      this.playerQueue = this.roundDrawers.values();
      this.nextDrawer();
    }

    nextDrawer() {
      while (true) {
        this.drawer = this.playerQueue.next().value;
        if (this.players.has(this.drawer) || this.drawer == undefined) break;
      }
      if (this.drawer == undefined) {
        io.to(this.id).emit("round end");
        this.nextRound();
        return;
      }
      this.words = Array.from({ length: 3 }, (v) => this.wordlist.pop());
      io.to(this.drawer.id).emit("word choice", words);
      this.wordChoosingTimeout = setTimeout(() => {
        io.to(this.drawer.id).emit("chosen word", words[1]);
      }, 15);
    }

    setEvents(sock) {
      sock.join(this.id);
      sock.on("votekick", () => {
        if (this.game.drawer != sock.id)
          io.to(this.id).emit("votekick", this.getPlayer(sock.id).name);
      });

      sock.on("draw", (change) => {
        this.canvas.update(change);
      });

      sock.on("guess", (msg) => {
        if (sock.id != this.drawer.id && msg == this.word) {
          let p = getPlayer(sock.id);
          p.guessed = true;
          p.guessTime;
        }
      });

      sock.on("choose word", (word) => {
        if (
          this.drawer.id == sock.id &&
          !this.wordChoosingTimeout._destroyed &&
          this.words.includes(word)
        ) {
          clearTimeout(this.wordChoosingTimeout);
          this.word = word;
          sock.to(this.id).emit("guess time", word);
        }
      });
      this.drawingTimeout = setTimeout(() => {
        io.to(this.id).emit("drawing end", [...this.players]);
      }, this.time);
    }

    getPlayer(id) {
      for (let p of this.players) if (p.id == id) return p;
      return undefined;
    }

    addPlayer(sock, name) {
      let p = new Player(sock.id, name);
      if (this.players.size == 0) this.root = p;
      this.players.add(p);
      this.setEvents(sock);
      this.reEmitPlayers();
    }

    removePlayer(sock) {
      let p = this.getPlayer(sock.id);
      this.players.delete(p);
      this.reEmitPlayers();
      if (this.root.id == sock.id) {
        if (this.players.size == 0) this.root = null;
        else this.root = this.players.values().next().value;
      }
      if (this.drawer.id == sock.id) {
        this.nextDrawer();
      }
    }

    reEmitPlayers() {
      io.to(this.id).emit("players", {
        root: this.root.id,
        drawer: this.drawer.id,
        players: [...this.players].map((p) => p.info()),
      });
    }

    info() {
      return {
        id: this.id,
        round: this.round,
        state: this.state,
        rounds: this.maxRounds,
        drawTime: this.timePerDraw,
        players: this.players.size,
      };
    }

    details() {
      return {
        id: this.id,
        round: this.round,
        rounds: this.maxRounds,
        drawTime: this.timePerDraw,
        state: this.state,
        canvas: this.canvas.info(),
        root: this.root.id,
        drawer: this.drawer.id,
        players: [...this.players].map((p) => p.info()),
      };
    }
  }

  return Room;
};
