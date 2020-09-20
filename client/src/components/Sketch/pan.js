/*eslint no-unused-vars: 0*/

import FabricCanvasTool from './fabrictool'

const fabric = require('fabric').fabric;

class Pan extends FabricCanvasTool {

  configureCanvas(props) {
    let canvas = this._canvas;
    canvas.isDrawingMode = canvas.selection = false;
    canvas.forEachObject((o) => o.selectable = o.evented = false);
    //Change the cursor to the move grabber
    canvas.defaultCursor = 'move';
  }

  doMouseDown(pointer) {
    let canvas = this._canvas;
    this.isDown = true;
    this.startX = pointer.x;
    this.startY = pointer.y;
  }

  doMouseMove(pointer) {
    if (!this.isDown) return;
    let canvas = this._canvas;

    canvas.relativePan({
      x: pointer.x - this.startX,
      y: pointer.y - this.startY
    });
    canvas.renderAll();
  }

  doMouseUp(pointer) {
    this.isDown = false;
  }

}

export default Pan;