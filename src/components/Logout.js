// src/components/Logout.js
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #e74c3c; /* Red color for logout */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c0392b; /* Darker red on hover */
  }
`;

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout logic here, e.g., removing token from localStorage
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <Button onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default Logout;
