import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import sendMessageToOpenAI from '../services/openaiService';

const ChatModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease-in-out;
  z-index: 1000;
`;

const ChatContainer = styled.div`
  width: 90%;
  max-width: 500px;
  height: 70vh;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  transform: ${props => props.isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)'};
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: 95%;
    height: 85vh;
    max-height: 600px;
  }
`;

const ChatHeader = styled.div`
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f5f2;
  
  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const ChatTitle = styled.h3`
  margin: 0;
  color: #7d5a50;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #7d5a50;
  transition: transform 0.2s;
  
  &:hover {
    transform: rotate(90deg);
  }
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-color: white;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c9bcb1;
    border-radius: 10px;
  }
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Message = styled.div`
  margin-bottom: 10px;
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  background-color: ${props => props.isUser ? '#e8d7c5' : '#f4eee1'};
  color: #333;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  animation: ${props => props.isUser ? 'slideInRight' : 'slideInLeft'} 0.3s ease forwards;
  font-size: 0.95rem;
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 0.9rem;
    max-width: 85%;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  align-self: flex-start;
  
  span {
    width: 8px;
    height: 8px;
    margin: 0 2px;
    background-color: #c9bcb1;
    border-radius: 50%;
    display: inline-block;
    animation: bounce 1.4s infinite ease-in-out both;
    
    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
  
  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

const InputArea = styled.div`
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  background-color: #f9f5f2;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #e0d6cc;
  border-radius: 25px;
  outline: none;
  margin-right: 10px;
  font-size: 0.95rem;
  transition: all 0.2s;
  
  &:focus {
    border-color: #7d5a50;
    box-shadow: 0 0 0 2px rgba(125, 90, 80, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 0.9rem;
  }
`;

const SendButton = styled.button`
  padding: 10px 18px;
  border: none;
  border-radius: 25px;
  background-color: #7d5a50;
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  
  &:hover {
    background-color: #6a4c43;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 8px 14px;
    font-size: 0.9rem;
  }
`;

const ChatBox = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { text: 'Xin chào! Tôi là Gomtelling, tôi có thể giúp gì cho bạn về làm gốm?', isUser: false },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Log để debug
  useEffect(() => {
    console.log("Window env:", window.env);
    console.log("Process env:", process.env.REACT_APP_OPENAI_API_KEY ? "Có API key" : "Không có API key");
  }, []);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;
    
    // Thêm tin nhắn của người dùng
    const userMessage = { text: inputText, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    
    try {
      // Chuyển đổi tin nhắn sang định dạng OpenAI API yêu cầu
      const apiMessages = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }));
      
      // Thêm tin nhắn người dùng hiện tại
      apiMessages.push({ role: 'user', content: userMessage.text });
      
      console.log("Gửi tin nhắn đến API:", apiMessages);
      
      // Gọi API OpenAI
      const response = await sendMessageToOpenAI(apiMessages);
      
      // Thêm phản hồi từ bot
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
      setMessages(prev => [...prev, { 
        text: 'GomTelling xin chào. Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.', 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <ChatModal isOpen={isOpen}>
      <ChatContainer isOpen={isOpen}>
        <ChatHeader>
          <ChatTitle>Gomtelling - Trợ lý Gốm</ChatTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ChatHeader>
        <ChatMessages>
          {messages.map((message, index) => (
            <Message key={index} isUser={message.isUser}>
              {message.text}
            </Message>
          ))}
          {isLoading && (
            <Message isUser={false}>
              <em>Đang nhập...</em>
            </Message>
          )}
          <div ref={messagesEndRef} />
        </ChatMessages>
        <InputArea>
          <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%' }}>
            <Input 
              type="text" 
              placeholder="Nhập câu hỏi của bạn..." 
              value={inputText}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <SendButton type="submit" disabled={isLoading}>
              {isLoading ? 'Đang gửi...' : 'Gửi'}
            </SendButton>
          </form>
        </InputArea>
      </ChatContainer>
    </ChatModal>
  );
};

export default ChatBox; 