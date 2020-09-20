import React, { useState, useEffect, useContext, useRef } from "react";
import { SocketContext } from "contexts.js";
import send from "./img/send.png";
import S from "./Chat.module.css";

const Chat = ({ user }) => {
  const endMsgRef = useRef();
  const socket = useContext(SocketContext);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (endMsgRef.current) {
      socket.on("message", (msg) => {
        setChat((chat) => [...chat, msg]);
        scrollToBottom();
      });
    }
  }, [endMsgRef]);

  const renderMessages = () =>
    chat.map(([name, msg, guess], i) => (
      <fieldset className={`${S.chatEntry} ${S[guess]}`}>
        <legend className={S.user}>{name}</legend>
        <div className={S.msg}>{msg}</div>
      </fieldset>
    ));

  const sendMsg = (e) => {
    e.preventDefault();
    if (message != "") socket.emit("message", [user, message]);
    setMessage("");
  };
  const setMsg = (e) => setMessage(e.target.value);

  const scrollToBottom = () => {
    endMsgRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={S.chat}>
      <div className={S.messageBox}>
        {renderMessages()}
        <div ref={endMsgRef} />
      </div>
      <form onSubmit={(e) => sendMsg(e)} className={S.inputBox}>
        <input
          value={message}
          className={S.input}
          onChange={(e) => setMsg(e)}
        />
        <button className={S.sendBtn}>
          <img className={S.img} src={send} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
