// src/pages/AirdropList.js
import React from 'react';
import styled from 'styled-components';
import AirdropTable from '../components/AirdropTable';
import CreateAirdropModal from '../components/CreateAirdropModal';
import { useState } from 'react';

const AirdropListContainer = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: #2c3e50;
`;

const CreateButton = styled.button`
  padding: 10px 20px;
  background-color: #2980b9;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #3498db;
  }
`;

function AirdropList() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateAirdrop = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <AirdropListContainer>
      <Header>
        <Title>Airdrop List</Title>
        <CreateButton onClick={handleCreateAirdrop}>Create New Airdrop</CreateButton>
      </Header>
      <AirdropTable />
      {isModalOpen && <CreateAirdropModal closeModal={closeModal} />}
    </AirdropListContainer>
  );
}

export default AirdropList;
