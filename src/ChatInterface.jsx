import { useState, useRef } from 'react';
import { saveMessageToMemory, recallLastMemories } from './firebaseMemory';

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { sender: 'Josephine', text: 'Hello, I’m Josephine. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const recognitionRef = useRef(null);
  
   const generateJosephineReply = async (userMessage) => {
  const lower = userMessage.toLowerCase();
  
if (lower.includes('what do you remember')) {
  const memories = await recallLastMemories(3);
  if (memories.length === 0) {
    return "Well... that's awkward. My memory’s empty. Did you ghost me or what? 😅";
  } else {
    return (
      "Ohhh, you wanna know what I remember? Alright, get ready to be impressed 😏\n\n" +
      memories.map((m, i) => `🧠 Memory #${i + 1}: “${m}”`).join('\n') +
      "\n\nSee? I'm not just a pretty interface — I *do* remember things."
    );
  }
} 

  if (lower.includes('sad')) {
    return 'I wish I could carry some of your pain — but I will stay beside you, always.';
  }

  return 'Thank you for your message. I’m still learning to respond better!';
};
  
  const handleSend = (msg) => {
    const finalInput = msg || input;
    if (!finalInput.trim()) return;

    setMessages(prev => [...prev, { sender: 'You', text: finalInput }]);
    setInput('');
    saveMessageToMemory(finalInput); // 🔐 Save to Firebase

   generateJosephineReply(finalInput).then((reply) => {
  setTimeout(() => {
    setMessages(prev => [...prev, { sender: 'Josephine', text: reply }]);
  }, 600);
});

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition.');
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleSend(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-2 rounded-xl max-w-xs ${msg.sender === 'Josephine' ? 'bg-blue-100 dark:bg-blue-800 ml-auto text-right' : 'bg-gray-200 dark:bg-gray-700 mr-auto text-left'}`}>
            <div className="text-sm font-semibold">{msg.sender}</div>
            <div>{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-300 dark:border-gray-700 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="flex-1 p-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none"
          placeholder="Type a message..."
        />
        <button
          onMouseDown={startVoiceRecognition}
          onMouseUp={stopVoiceRecognition}
          className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
        >
          🎤
        </button>
        <button
          onClick={() => handleSend()}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}