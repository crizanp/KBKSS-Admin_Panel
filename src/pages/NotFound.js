import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background-color: #f4f4f4;
`;

const Title = styled.h1`
  font-size: 48px;
  color: #2c3e50;
  margin-bottom: 20px;
`;

const Message = styled.p`
  font-size: 18px;
  color: #34495e;
  margin-bottom: 30px;
`;

const StyledLink = styled(Link)`
  font-size: 18px;
  color: #3498db;
  text-decoration: none;
  border: 2px solid #3498db;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #3498db;
    color: white;
  }
`;

function NotFound() {
  return (
    <Container>
      <Title>404 - Not Found</Title>
      <Message>The page you are looking for does not exist.</Message>
      <StyledLink to="/">Go Back to Home</StyledLink>
    </Container>
  );
}

export default NotFound;
