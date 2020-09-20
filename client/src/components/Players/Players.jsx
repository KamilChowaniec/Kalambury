import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "contexts";
import S from "./Players.module.css";

const Players = () => {
  const [players, setPlayers] = useState({});
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on("player joined", (id, name) => {
      setPlayers((players) => ({ ...players, [id]: { name, points: 0 } }));
    });
    socket.on("player disconnected", (id) => {
      setPlayers((players) => {
        delete players[id];
        return players;
      });
    });
  }, []);

  const renderPlayers = () => (
    <ul className={S.playerList}>
      {Object.values(players).map(({ name, points }, i) => (
        <li key={i} className={S.player}>
          <div className={S.name}>{name}</div>
          <div className={S.points}>{points}</div>
        </li>
      ))}
    </ul>
  );

  return <div className={S.playerBox}>{renderPlayers()}</div>;
};

export default Players;
