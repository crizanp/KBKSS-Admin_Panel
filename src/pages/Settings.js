// src/pages/Settings.js
import React from 'react';
import axios from 'axios';
import Logout from '../components/Logout';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height */
  background-color: #f4f4f4; /* Light background for better contrast */
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Button = styled.button`
  background-color: #e74c3c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;

  &:hover {
    background-color: #c0392b;
  }
`;

function Settings() {
  const handleDeleteUsers = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/admin/delete-zero-point-users`
      );
      alert(response.data.message);
    } catch (error) {
      console.error('Error deleting users with 0 points:', error);
      alert('Failed to delete users');
    }
  };

  return (
    <Container>
      <ButtonWrapper>
        <Logout />
        <Button onClick={handleDeleteUsers}>
          Delete All Users with 0 Points
        </Button>
      </ButtonWrapper>
    </Container>
  );
}

export default Settings;
