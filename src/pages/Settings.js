// src/pages/Settings.js
import React from 'react';
import axios from 'axios';
import Logout from '../components/Logout';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
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
  margin: 10px;

  &:hover {
    background-color: #c0392b;
  }
`;

function Settings() {
  const deleteUsers = async (timeRange, type) => {
    try {
      const endpoint = type === 'referral' 
        ? `${process.env.REACT_APP_API_URL}/admin/delete-referral-zero-point-users/${timeRange}`
        : `${process.env.REACT_APP_API_URL}/admin/delete-zero-point-users/${timeRange}`;
        
      const response = await axios.delete(endpoint);
      alert(response.data.message);
    } catch (error) {
      console.error(`Error deleting ${type} users with ${timeRange}`, error);
      alert(`Failed to delete ${type} users for ${timeRange}`);
    }
  };

  return (
    <Container>
      <ButtonWrapper>
        <Logout />

        {/* General Users */}
        <h2>Delete General Users with 0 Points</h2>
        <Button onClick={() => deleteUsers('3hours', 'general')}>
          Delete General Users - 3 Hours Old
        </Button>
       

        {/* Referral Users */}
        <h2>Delete Referral Users with 0 Points</h2>
        <Button onClick={() => deleteUsers('3hours', 'referral')}>
          Delete Referral Users - 3 Hours Old
        </Button>
        
      </ButtonWrapper>
    </Container>
  );
}

export default Settings;
