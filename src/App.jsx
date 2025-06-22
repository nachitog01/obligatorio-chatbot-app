import { useState } from "react";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!question.trim()) return;
    setLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
    const path = "/ask";
    const res = await fetch(apiUrl + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        chat_history: chatHistory.map(({ question, answer }) => [
          question,
          answer,
        ]),
      }),
    });
    const data = await res.json();
    setChatHistory([...chatHistory, { question, answer: data.answer }]);
    setQuestion("");
    setLoading(false);
  };

  return (
    <div className="app">
      <h1>🧠 Chatbot – Tienda Alemana</h1>

      <div
        className="chat-history"
        style={{ maxHeight: "400px", overflowY: "auto", marginBottom: "1rem" }}
      >
        {[...chatHistory].reverse().map((entry, index) => (
          <div key={index} className="chat-entry">
            <p>
              <strong>👤 Usuario:</strong> {entry.question}
            </p>
            <p>
              <strong>🤖 Bot:</strong> {entry.answer}
            </p>
            <hr />
          </div>
        ))}
      </div>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Escribí tu pregunta..."
      />
      <button onClick={ask} disabled={loading}>
        {loading ? "Consultando..." : "Preguntar"}
      </button>
    </div>
  );
}

export default App;
