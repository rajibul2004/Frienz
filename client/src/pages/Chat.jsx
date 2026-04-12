import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

const Chat = () => {
  const [message, setMessage] = useState("");
  const [receivedMsg, setReceivedMsg] = useState("");

  useEffect(() => {
    // Listen for messages
    socket.on("receive_message", (data) => {
      setReceivedMsg(data);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    socket.emit("send_message", message);
  };
  return (
    <div className="flex-1 justify-center items-center m-auto h-screen">
      <input
        type="text"
        placeholder="Enter message"
        onChange={(e) => setMessage(e.target.value)}
        className="border-2 m-4"
      />

      <button onClick={sendMessage} className="bg-amber-400">Send</button>

      <h3>Received: {receivedMsg}</h3>
    </div>
  );
};

export default Chat;
