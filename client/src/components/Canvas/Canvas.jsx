import React, { useCallback, useState, useContext } from "react";
import { SketchField, Tools } from "components/Sketch";
import { SocketContext } from "contexts";
import Toolbox from "components/Toolbox";
import S from "./Canvas.module.css";

let timeBetweenSendingEvents = (4096 / 192) * 2;
let events = [];
let sendEventsInterval;

const Canvas = () => {
  const [tool, setTool] = useState(Tools.Pencil);
  const socket = useContext(SocketContext);

  const ref = useCallback((node) => {
    if (node !== null) {
      socket.on("drawing", (eventArray) => {
        for (let [ev, pointer, tool] of eventArray) {
          switch (ev) {
            case "d":
              setTool(tool);
              node._onMouseDown(pointer, true);
              break;
            case "u":
              node._onMouseUp(pointer, true);
              break;
            case "m":
              node._onMouseMove(pointer, true);
              break;
            case "o":
              node._onMouseOut(pointer, true);
              break;
            default:
              break;
          }
        }
      });
    }

    sendEventsInterval = setInterval(() => {
      if (events.length > 0) {
        socket.emit("drawing", events);
        events = [];
      }
    }, timeBetweenSendingEvents);
  }, []);

  const drawEvent = (ev, data) => events.push([ev, ...data]);

  return (
    <div className={S.canvasBox}>
      <div className={S.canvas}>
        <SketchField
          ref={ref}
          tool={tool}
          width="100%"
          height="100%"
          onMouseDown={(pointer) => drawEvent("d", [pointer, tool])}
          onMouseUp={(pointer) => drawEvent("u", [pointer])}
          onMouseMove={(pointer) => drawEvent("m", [pointer])}
          onMouseOut={(pointer) => drawEvent("o", [pointer])}
        />
      </div>
      <div style={{ position: "absolute" }}>
        <Toolbox chosen={tool} onChange={(tool) => setTool(tool)} />
      </div>
    </div>
  );
};

export default Canvas;

// let getTimeout = (() => {
//   let _setTimeout = setTimeout,
//     map = {};

//   setTimeout = (callback, delay) => {
//     let id = _setTimeout(callback, delay);
//     map[id] = Date.now() + delay;
//     return id;
//   };

//   return (id) => {
//     return map[id] ? Math.max(map[id] - Date.now(), 0) : 0;
//   };
// })();
