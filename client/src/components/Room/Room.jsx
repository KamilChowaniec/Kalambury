import React, { useState, useEffect } from "react";
import useSocket from "use-socket.io-client";
import { useParams } from "components/Router";
import Chat from "components/Chat";
import Players from "components/Players";
import Canvas from "components/Canvas";
import { SocketContext } from "contexts.js";
import history from "urlHistory";
import S from "./Room.module.css";

const Header = () => <div className={S.header}>Round:1</div>;

const Room = () => {
  const { roomId } = useParams();
  const [round, setRound] = useState();
  const [gameState, setGameState] = useState();
  const [socket] = useSocket("/");

  useEffect(() => {
    socket.emit("join room", roomId);
    socket.on("room doesnt exist", () => {
      history.push("/");
    });

    return () => socket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <div className={S.room}>
        <Header />
        <div className={S.game}>
          <Players />
          <Canvas />
          <Chat />
        </div>
      </div>
    </SocketContext.Provider>
  );
};

export default Room;
