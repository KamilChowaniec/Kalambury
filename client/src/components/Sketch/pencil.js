import FabricCanvasTool from "./fabrictool";

class Pencil extends FabricCanvasTool {
  configureCanvas(props) {
    this._canvas.isDrawingMode = true;
    this._canvas.freeDrawingBrush.width = props.lineWidth;
    this._canvas.freeDrawingBrush.color = props.lineColor;
    this._isDrawing = false;
  }

  doMouseUp(pointer) {
    this._isDrawing = false;
    this._canvas.freeDrawingBrush.onMouseUp(pointer);
  }

  doMouseDown(pointer) {
    this._isDrawing = true;
    this._canvas.freeDrawingBrush.onMouseDown(pointer);
  }

  doMouseMove(pointer) {
    if (this._isDrawing) this._canvas.freeDrawingBrush.onMouseMove(pointer);
  }
}

export default Pencil;
