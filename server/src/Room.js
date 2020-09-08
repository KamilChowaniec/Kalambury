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
      this.wordlist = wordlist.length < 10 ? require("./wordlist") : wordlist;
      this.word = "";
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
        return;
      }
      this.round++;
      this.playerQueue = this.players.values();
      this.nextDrawer();
    }

    nextDrawer() {
      this.drawer = this.playerQueue.next().value;
      if (this.drawer == undefined) {
        io.to(this.id).emit("round end");
        this.nextRound();
      }
      setTimeout(() => {
        io.to(this.id).emit("drawing end", [...this.players]);
      }, this.time);
    }

    setEvents(sock) {
      sock.join(this.id);
      sock.on("votekick", () => {
        if (this.game.drawer != sock.id) io.to(this.id).emit("votekick");
      });

      sock.on("draw", (change) => {
        this.canvas.update(change);
      });

      sock.on("guess", (msg) => {
        if (sock.id != this.drawer.id && msg == this.word) {
          let p = getPlayer(sock.id)
          p.guessed = true
          p.guessTime 

        }
      });
    }

    getPlayer(id) {
      for (let p of this.players) if (p.id == id) return p;
      return undefined;
    }

    addPlayer(sock, name) {
      if (this.players.size == 0) this.root = sock.id;
      this.players.add(new Player(sock.id, name));
      this.setEvents(sock);
    }

    removePlayer(sock) {
      for (let p of this.players)
        if (p.id == sock.id) {
          this.players.delete(p);
          return;
        }
      if (this.root == sock.id) {
        if (this.players.size == 0) this.root = null;
        else this.root = this.players.values().next().value.id;
      }
    }

    info() {
      return {
        id: this.id,
        round: this.round,
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
        canvas: this.canvas.info(),
        rootId: this.root,
        players: [...this.players].map((p) => p.info()),
      };
    }
  }

  return Room;
};
