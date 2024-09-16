import React from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate instead of useHistory

const ActionsContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #2c3e50;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    color: #2980b9;
  }
`;

function AirdropActions({ airdropId }) {
  const navigate = useNavigate(); // useNavigate instead of useHistory

  const handleView = () => {
    navigate(`/airdrops/view/${airdropId}`); // navigate replaces history.push
  };

  const handleEdit = () => {
    navigate(`/airdrops/edit/${airdropId}`); // navigate replaces history.push
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete airdrop ${airdropId}?`)) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/airdrops/${airdropId}`);
        alert(`Airdrop ${airdropId} deleted.`);
        window.location.reload(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting airdrop:', error);
        alert('Failed to delete the airdrop.');
      }
    }
  };

  return (
    <ActionsContainer>
      <IconButton onClick={handleView}>
        <FaEye />
      </IconButton>
      <IconButton onClick={handleEdit}>
        <FaEdit />
      </IconButton>
      <IconButton onClick={handleDelete}>
        <FaTrash />
      </IconButton>
    </ActionsContainer>
  );
}

export default AirdropActions;
