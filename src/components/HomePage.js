import React, { useState } from 'react';
import styled from 'styled-components';
import ChatBox from './ChatBox';
import ceramicImage1 from '../assets/b1.png';
import ceramicImage2 from '../assets/b2.png';

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  text-align: center;
  overflow: hidden;
  position: relative;
`;

const Header = styled.header`
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 0.3rem;
  }
`;

const Logo = styled.h1`
  color: #7d5a50;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 0.3rem;
  }
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
  max-width: 1200px;
  flex: 1;
  justify-content: center;
`;

const CeramicSection = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: flex-start;
    height: 80vh;
  }
`;

const CeramicImageContainer = styled.div`
  position: relative;
  z-index: 10;
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 280px;
    height: 280px;
    margin-bottom: 0;
  }
`;

const CeramicImg = styled.img`
  position: absolute;
  max-width: 100%;
  height: auto;
  object-fit: contain;
  animation: ${props => props.animation} 6s ease-in-out infinite;
  
  @keyframes float1 {
    0% {
      transform: translateY(0px) rotate(-2deg);
    }
    50% {
      transform: translateY(-15px) rotate(2deg);
    }
    100% {
      transform: translateY(0px) rotate(-2deg);
    }
  }
  
  @keyframes float2 {
    0% {
      transform: translateY(-10px) rotate(2deg);
    }
    50% {
      transform: translateY(5px) rotate(-2deg);
    }
    100% {
      transform: translateY(-10px) rotate(2deg);
    }
  }
`;

const CeramicImg1 = styled(CeramicImg)`
  width: 75%;
  z-index: 10;
  left: 0%;
  opacity: 0.95;
`;

const CeramicImg2 = styled(CeramicImg)`
  width: 80%;
  z-index: 11;
  right: 0%;
  filter: drop-shadow(0 0 5px rgba(0,0,0,0.2));
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  max-width: 800px;
  margin: 0 auto 1rem;
  color: #555;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 0.8rem;
  border-radius: 10px;
  z-index: 5;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.6rem;
    margin-bottom: 0.6rem;
    line-height: 1.4;
  }
`;

const InfoSection = styled.section`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 768px) {
    position: relative;
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 0.8rem;
    padding: 0 0.5rem;
  }
`;

const InfoCard = styled.div`
  background: rgba(125, 90, 80, 0.6);
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  width: 200px;
  position: absolute;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  color: white;
  
  &:hover {
    transform: scale(1.05);
    background: rgba(125, 90, 80, 0.8);
    z-index: 20;
  }
  
  h3 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.9rem;
  }
  
  &:nth-child(1) {
    top: 15%;
    right: 15%;
  }
  
  &:nth-child(2) {
    bottom: 15%;
    right: 20%;
  }
  
  &:nth-child(3) {
    top: 40%;
    left: 15%;
  }
  
  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    padding: 0.8rem;
    top: auto;
    right: auto;
    bottom: auto;
    left: auto;
    
    &:nth-child(1) {
      grid-column: 1;
      grid-row: 1;
      top: auto;
      right: auto;
    }
    
    &:nth-child(2) {
      grid-column: 2;
      grid-row: 1;
      bottom: auto;
      right: auto;
    }
    
    &:nth-child(3) {
      grid-column: 1 / span 2;
      grid-row: 2;
      top: auto;
      left: auto;
      max-width: 70%;
      margin: 0 auto;
    }
    
    &:nth-child(4) {
      grid-column: 1 / span 2;
      grid-row: 3;
      margin: 0 auto;
      z-index: 15;
    }
    
    h3 {
      font-size: 0.9rem;
      margin-bottom: 0.3rem;
    }
    
    p {
      font-size: 0.8rem;
    }
    
    &:hover {
      transform: none;
    }
  }
`;

const ChatContainerWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin-top: auto;
  margin-bottom: 1rem;
  z-index: 50;
  display: flex;
  justify-content: center;
`;

const ChatContainer = styled.div`
  display: flex;
  width: 100%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border-radius: 50px;
  overflow: hidden;
  background-color: white;
  position: relative;
  z-index: 2;
  padding: 3px;
  background: linear-gradient(
    90deg,
    #ffd700 0%,
    #ffffff 20%,
    #ffd700 40%,
    #ffffff 60%,
    #ffd700 80%,
    #ffffff 100%
  );
  background-size: 300% 100%;
  animation: shine-border 3s linear infinite;
  
  @keyframes shine-border {
    0% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  @media (max-width: 768px) {
    border-radius: 30px;
  }
`;

const ChatInputContainer = styled.div`
  display: flex;
  width: 100%;
  border-radius: 47px;
  overflow: hidden;
  background-color: white;
  
  @media (max-width: 768px) {
    border-radius: 27px;
  }
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 15px 20px;
  border: none;
  outline: none;
  font-size: 1rem;
  
  @media (max-width: 768px) {
    padding: 10px 15px;
    font-size: 0.9rem;
  }
`;

const ChatButton = styled.button`
  background-color: #7d5a50;
  color: white;
  border: none;
  padding: 15px 20px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #6a4c43;
  }
  
  @media (max-width: 768px) {
    padding: 10px 15px;
    font-size: 0.9rem;
  }
`;

const GlowingChatButton = styled(ChatButton)`
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 215, 0, 0.4) 0%,
      rgba(255, 215, 0, 0) 60%
    );
    animation: pulse-glow 2s ease-in-out infinite;
  }
  
  @keyframes pulse-glow {
    0% {
      transform: scale(0.8);
      opacity: 0.3;
    }
    50% {
      transform: scale(1);
      opacity: 0.6;
    }
    100% {
      transform: scale(0.8);
      opacity: 0.3;
    }
  }
`;

const HomePage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputText, setInputText] = useState('');

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <Container>
      <Header>
        <Logo>GOMTELLING</Logo>
      </Header>
      
      <Description>
        Chào mừng bạn đến với Gomtelling - Trợ lý thông minh hỗ trợ thông tin về nghề làm gốm truyền thống.
        Chúng tôi cung cấp kiến thức, kỹ thuật và cảm hứng để giúp bạn khám phá và thực hành nghệ thuật làm gốm.
      </Description>
      
      <MainContent>
        <CeramicSection>
          <InfoSection>
            <InfoCard>
              <h3>🏺 Kho tàng kiến thức</h3>
              <p>Tìm hiểu về lịch sử, kỹ thuật và bí quyết làm gốm từ các nghệ nhân truyền thống.</p>
            </InfoCard>
            
            <InfoCard>
              <h3>🧠 Trợ lý thông minh</h3>
              <p>Đặt câu hỏi và nhận được hướng dẫn chi tiết cho mọi thắc mắc về nghề làm gốm.</p>
            </InfoCard>
            
            <InfoCard>
              <h3>🎨 Sáng tạo không giới hạn</h3>
              <p>Khám phá các ý tưởng, mẫu thiết kế và kỹ thuật trang trí để tạo ra tác phẩm độc đáo.</p>
            </InfoCard>
            
            <CeramicImageContainer>
              <CeramicImg1 
                src={ceramicImage1} 
                alt="Bình gốm 1" 
                animation="float1"
              />
              <CeramicImg2 
                src={ceramicImage2} 
                alt="Bình gốm 2" 
                animation="float2"
              />
            </CeramicImageContainer>
          </InfoSection>
        </CeramicSection>
        
        <ChatContainerWrapper>
          <ChatContainer>
            <ChatInputContainer>
              <ChatInput 
                type="text" 
                placeholder="Nhập câu hỏi về làm gốm..." 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <GlowingChatButton onClick={handleOpenChat}>Bắt đầu chat</GlowingChatButton>
            </ChatInputContainer>
          </ChatContainer>
        </ChatContainerWrapper>
      </MainContent>
      
      <ChatBox isOpen={isChatOpen} onClose={handleCloseChat} />
    </Container>
  );
};

export default HomePage; 