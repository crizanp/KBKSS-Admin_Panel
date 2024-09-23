import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
`;

const Button = styled.button`
  padding: 10px;
  margin: 10px;
  background-color: ${({ cancel }) => (cancel ? '#ccc' : '#3498db')};
  color: white;
  border: none;
  cursor: pointer;
`;

function ConfirmationModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <p>{message}</p>
        <Button onClick={onConfirm}>Confirm</Button>
        <Button cancel onClick={onCancel}>Cancel</Button>
      </ModalContent>
    </ModalOverlay>
  );
}

export default ConfirmationModal;
