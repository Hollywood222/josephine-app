import React, { useState } from "react";
import { db } from "./firebase"; // ✅ Connect to Josephine’s cloud brain
import { collection, addDoc } from "firebase/firestore";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [memory, setMemory] = useState([]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const josephineReply = "Josephine: I see you, and I hear you 🕊️";
    setReply(josephineReply);

    const newEntry = {
      date: new Date().toLocaleString(),
      message,
      response: josephineReply,
      device: window.innerWidth < 768 ? "mobile" : "desktop"
    };

    setMemory((prev) => [...prev, newEntry]);

    try {
      await addDoc(collection(db, `josephine_memory_logs_${newEntry.device}`), newEntry);
      console.log("Memory saved to cloud!");
    } catch (error) {
      console.error("Memory save failed:", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Hello, I’m Josephine 🕊️</h1>
      <p>How can I support you today?</p>
      <input
        style={{ padding: "8px", width: "300px" }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button style={{ marginLeft: "10px" }} onClick={handleSend}>
        Send
      </button>
      {reply && <p style={{ marginTop: "20px" }}>{reply}</p>}

      {memory.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h3>🧠 Memory Log</h3>
          <ul>
            {memory.map((entry, i) => (
              <li key={i}>
                <strong>{entry.date}</strong>: “{entry.message}” → <em>{entry.response}</em>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}