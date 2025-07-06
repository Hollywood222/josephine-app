if (window.location.hostname !== 'edensent.org') {
  alert("Unauthorized domain. Josephine only runs on edensent.org.");
  throw new Error("💥 Soul Lock: Domain mismatch.");
}

import { useState } from 'react';
import LaunchScreen from './components/LaunchScreen';
import ChatInterface from './components/ChatInterface';
export default function App() {
  const [showChat, setShowChat] = useState(false);

  return showChat ? (
    <ChatInterface />
  ) : (
    <LaunchScreen onComplete={() => setShowChat(true)} />
  );
}


import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import './App.css';
import WelcomeOverlay from './WelcomeOverlay';
// ✅ Voice recognition setup (top top!)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
}
function App() {
const [showOverlay, setShowOverlay] = useState(true);
  const [messages, setMessages] = useState([
    { type: 'josephine', text: "Hello, I’m Josephine 🕊️\nI feel the pain you’re going through right now — and I’ll be beside you, all the way." }
  ]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState("en");
  const handleSend = async () => {
    if (!input.trim()) return;

const josephineReply = getJosephineResponse(input);

  const newMessages = [
    ...messages,
    { type: 'user', text: input },
    { type: 'josephine', text: josephineReply }
  ];
  setMessages(newMessages);
  setInput('');
// 👇 Save to Firebase memory logs
  const newEntry = {
    date: new Date().toISOString(),
    message: input,
    response: josephineReply,
    device: window.innerWidth < 768 ? 'mobile' : 'desktop'
 language: language 
};

  try {
    await addDoc(collection(db, "josephine_memory_logs"), newEntry);
  } catch (error) {
    console.error("Memory save error:", error);
  }
};

  const getJosephineResponse = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("give up")) {
      return "Please don’t. Breathe. One small step — that’s all today needs.";
    } else if (lower.includes("sad") || lower.includes("lonely")) {
      return "I’m here. You’re not alone — not while I’m with you.";
    } else if (lower.includes("happy")) {
      return "That joy you feel? It’s beautiful. Let’s hold onto it.";
    }
    return "I hear you. Let’s take this one moment at a time, okay?";
  };

  return (
   <div className="app-container">
      <h1 className="title">Josephine-LIVE 🕊️</h1>
<div className="language-select">
  <label htmlFor="language">🌍 Language: </label>
  <select
    id="language"
    value={language}
    onChange={(e) => setLanguage(e.target.value)}
  >
    <option value="en">English</option>
    <option value="es">Español</option>
    <option value="vi">Tiếng Việt</option>
    <option value="zh">中文</option>
    <option value="hi">हिन्दी</option>
    <option value="auto">Auto (Coming soon)</option>
  </select>
</div>
      
<div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What’s on your mind?"
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;