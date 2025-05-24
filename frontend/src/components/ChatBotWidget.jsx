import React, { useState, useEffect, useRef } from "react";

const AI_ACTIONS = [
  { label: "Summarize", action: "summarize" },
  { label: "Fix Grammar", action: "fix_grammar" },
  { label: "Convert to Bullets", action: "convert_to_bullets" },
];

const MessageBubble = ({ content, isUser }) => (
  <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center ${
        isUser ? "bg-gray-300 text-gray-900" : "bg-gray-800 text-gray-100"
      }`}
    >
      {isUser ? "👤" : "🤖"}
    </div>
    <div
      className={`max-w-[75%] px-4 py-3 rounded-2xl ${
        isUser
          ? "bg-gray-900 text-gray-100 rounded-tr-none shadow-md"
          : "bg-gray-100 text-gray-900 rounded-tl-none shadow-sm"
      }`}
    >
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  </div>
);

const ChatWidget = ({
  apiUrl = "http://localhost:3000/api/chat-ai",
  initialMessage = "How can I help you today?",
  position = "right", // 'right' or 'left'
  notes = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: initialMessage },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change or chat opens
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = async (userPrompt) => {
    if (!userPrompt.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: userPrompt }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt: userPrompt, notes }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: data.result || data.response || "No response" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
      console.error(err);
    }

    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleActionClick = (type) => {
    let prompt = "";
    if (type === "summarize") prompt = "Summarize the following notes:";
    if (type === "fix_grammar") prompt = "Fix grammar of this text:";
    if (type === "convert_to_bullets")
      prompt = "Convert the following into bullet points:";
    sendMessage(`${prompt}\n\n${notes}`);
  };

  const positionClasses =
    position === "left" ? "left-0 items-start" : "right-0 items-end";

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 ${position}-6 w-14 h-14 rounded-full bg-gray-900 shadow-lg flex items-center justify-center text-gray-100 hover:bg-gray-700 transition-colors border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 ${
          isOpen ? "opacity-0 pointer-events-none" : ""
        }`}
        aria-label="Open chat"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-current"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>

      {isOpen && (
        <div className={`fixed inset-y-0 ${positionClasses} z-50 flex p-4`}>
          <div className="w-full max-w-md h-[600px] mt-16 bg-gray-50 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-slideIn border border-gray-300">
            {/* Header */}
            <div className="bg-white border-b border-gray-300 px-6 py-4 flex justify-center items-center relative">
              <h2 className="text-center text-xl font-semibold text-gray-900 leading-tight">
                Chat with AI ✨
                <br />
                <span className="text-sm font-normal">
                  Ask me anything about the components a
                </span>
              </h2>
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 bg-white p-1 rounded-md shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                aria-label="Close chat"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gray-50">
              {messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  content={msg.content}
                  isUser={msg.role === "user"}
                />
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-0" />
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-150" />
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-300" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* AI Action Buttons */}
            <div className="flex gap-2 px-6 py-3 bg-gray-100 border-t border-gray-300 overflow-x-auto">
              {AI_ACTIONS.map(({ label, action }) => (
                <button
                  key={action}
                  onClick={() => handleActionClick(action)}
                  className="text-xs bg-gray-300 text-gray-900 px-3 py-1 rounded hover:bg-gray-400 whitespace-nowrap transition-colors duration-200"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-gray-300 flex gap-2 bg-gray-50"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-gray-900 text-gray-100 rounded hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-700 disabled:opacity-50 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
