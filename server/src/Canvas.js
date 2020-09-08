class Canvas {
  constructor() {
    this.canvas = [];
    this.clear();
  }

  clear() {
    this.canvas = Array.from({ length: 600 }, (v) =>
      Array.from({ length: 800 }, (v) => 255)
    );
  }

  apply(change) {}

  info() {
    return this.canvas;
  }
}

module.exports = Canvas;
