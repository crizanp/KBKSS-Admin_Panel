// src/components/AirdropActions.js
import React from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

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
  const handleView = () => {
    alert(`View details of airdrop ${airdropId}`);
  };

  const handleEdit = () => {
    alert(`Edit airdrop ${airdropId}`);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete airdrop ${airdropId}?`)) {
      alert(`Airdrop ${airdropId} deleted.`);
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
