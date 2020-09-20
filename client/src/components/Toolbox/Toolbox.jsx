import React from "react";
import { Tools } from "components/Sketch";
import S from "./Toolbox.module.css";

const tools = [Tools.Pencil, Tools.Line, Tools.Rectangle, Tools.Circle];

const Toolbox = ({ chosen, onChange }) => (
  <ul className={S.toolbox}>
    {tools.map((tool, i) => (
      <li
        key={i}
        className={S.tool + " " + (tool === chosen ? S.chosen : "")}
        onClick={() => onChange(tool)}
      >
        <img className={S.img} src={require(`./img/${tool}.png`)} />
      </li>
    ))}
  </ul>
);

export default Toolbox;
