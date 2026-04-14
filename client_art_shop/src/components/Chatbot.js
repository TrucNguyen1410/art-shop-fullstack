import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const SYSTEM_PROMPT = "Bạn là trợ lý ảo của trang web bán hàng Art Shop. Bạn phải luôn trả lời bằng tiếng Việt, ngắn gọn, thân thiện và lịch sự. Nếu được hỏi về trang web, hãy cung cấp thông tin liên quan đến các sản phẩm nghệ thuật, tranh, đồ thủ công, chính sách giao hàng và đổi trả.";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Chào bạn! Mình có thể giúp gì cho bạn hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  // Cuộn xuống cuối tin nhắn mỗi khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Ẩn chatbot ở trang đăng nhập, đăng ký, quên mật khẩu
  const hiddenRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Chuẩn bị lịch sử hội thoại cho API
      const contents = newMessages.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));
      
      // Chèn system prompt vào nội dung đầu tiên để hướng dẫn AI
      const apiContents = [
        { role: 'user', parts: [{ text: `SYSTEM INSTRUCTION: ${SYSTEM_PROMPT}` }] },
        { role: 'model', parts: [{ text: 'Vâng, tôi đã hiểu. Tôi sẽ đóng vai trợ lý Art Shop.' }] },
        ...contents
      ];

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contents: apiContents })
      });

      const data = await response.json();
      
      if (data && data.candidates && data.candidates.length > 0) {
        const botReply = data.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, { role: 'model', text: botReply }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: 'Xin lỗi, hệ thống đang bận. Bạn vui lòng thử lại sau nhé.' }]);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Xin lỗi, đã xảy ra lỗi kết nối. Hãy thử lại.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Cửa sổ chat */}
      <div className={`chat-window ${isOpen ? 'active' : ''}`}>
        <div className="chat-header">
          <h5>Art Shop Assistant</h5>
          <button className="close-btn" onClick={toggleChat}>&times;</button>
        </div>
        <div className="chat-body">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.role}`}>
              <div className="message-content">
                {/* Lọc bỏ ký tự markdown thừa nếu có */}
                {msg.text.replace(/\*\*/g, '').replace(/\*/g, '')}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="chat-message model">
              <div className="message-content typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-footer">
          <form onSubmit={sendMessage} className="chat-form">
            <input 
              type="text" 
              placeholder="Nhập tin nhắn..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Nút Toggle */}
      <button className={`chat-toggle-btn ${isOpen ? 'hide' : ''}`} onClick={toggleChat}>
        <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path>
        </svg>
      </button>
    </div>
  );
};

export default Chatbot;
