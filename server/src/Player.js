class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.points = 0;
    this.guessed = false;
    this.guessTime = 0;
  }

  info() {
    return {
      id: this.id,
      name: this.name,
      points: this.points,
      guessed: this.guessed,
    };
  }
}

module.exports = Player;
