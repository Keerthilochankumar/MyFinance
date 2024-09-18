import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

interface Message {
  user: string;
  message: string;
  timestamp: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const sendMessage = useCallback(async () => {
    if (!messageInput.trim()) return; // Prevent sending empty messages

    try {
      const headers = { Authorization: token };
      await axios.post('http://localhost:3000/api/chat', { message: messageInput }, { headers });
      const newMessage: Message = {
        user: 'You',
        message: messageInput,
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessageInput(''); // Clear input after sending
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [messageInput, token]);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const headers = { Authorization: token };
        const response = await axios.post('http://localhost:3000/auth/chat', { message: messageInput }, { headers });
        setMessages(response.data.messages); // Update state with initial messages
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [token]);

  return (
    <div className="flex">
      <Navbar />
    <div className="p-4 max-w-lg mx-auto mt-10 bg-white rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4">Chat</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col h-80 overflow-y-auto mb-4 border border-gray-300 rounded-lg p-2">
          {messages.map((message) => (
            <div
              key={message.timestamp}
              className={`p-2 mb-2 rounded-lg ${message.user === 'You' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}
            >
              {message.message}
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => (e.key === 'Enter' ? sendMessage() : null)}
          className="flex-1 p-2 border border-gray-300 rounded"
          aria-label="Type your message"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Send
        </button>
      </div>
    </div>
  </div>
  );
};

export default Chatbot;
