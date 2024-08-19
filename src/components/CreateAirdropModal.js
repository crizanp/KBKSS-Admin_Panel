import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #f9f9f9;
  padding: 40px;
  border-radius: 15px;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  max-height: 90vh;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #999;
  transition: color 0.3s;

  &:hover {
    color: #666;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  font-size: 16px;
  box-sizing: border-box;
  border: 2px solid #ddd;
  border-radius: 10px;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    outline: none;
    border-color: #2980b9;
    box-shadow: 0 0 10px rgba(41, 128, 185, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 14px;
  font-size: 16px;
  box-sizing: border-box;
  border: 2px solid #ddd;
  border-radius: 10px;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    outline: none;
    border-color: #2980b9;
    box-shadow: 0 0 10px rgba(41, 128, 185, 0.2);
  }
`;

const Button = styled.button`
  padding: 14px 30px;
  background-color: #2980b9;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s, transform 0.3s;
  margin-top: 20px;
  width: 100%;

  &:hover {
    background-color: #3498db;
    transform: translateY(-2px);
  }
`;

function CreateAirdropModal({ closeModal }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    reward: '',
    participants: '',
    winners: '',
    startDate: '',
    endDate: '',
    logo: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Submitting form data:', formData);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/airdrops`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('Airdrop created successfully!');
      closeModal();
    } catch (error) {
      console.error('Error creating airdrop:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <Title>Create New Airdrop</Title>
          <CloseButton onClick={closeModal}>&times;</CloseButton>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Airdrop Name</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter the name of the airdrop"
            />
          </FormGroup>
          <FormGroup>
            <Label>Description</Label>
            <TextArea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter a description for the airdrop"
            />
          </FormGroup>
          <FormGroup>
            <Label>Logo URL</Label>
            <Input
              type="text"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Reward</Label>
            <Input
              type="text"
              name="reward"
              value={formData.reward}
              onChange={handleChange}
              required
              placeholder="Enter the reward (e.g., 1000 BONK)"
            />
          </FormGroup>
          <FormGroup>
            <Label>Number of Winners</Label>
            <Input
              type="number"
              name="winners"
              value={formData.winners}
              onChange={handleChange}
              required
              placeholder="Enter the number of winners"
            />
          </FormGroup>
          <FormGroup>
            <Label>Total Participants</Label>
            <Input
              type="number"
              name="participants"
              value={formData.participants}
              onChange={handleChange}
              required
              placeholder="Enter the total number of participants"
            />
          </FormGroup>
          <FormGroup>
            <Label>Start Date</Label>
            <Input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>End Date</Label>
            <Input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <Button type="submit">Create Airdrop</Button>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default CreateAirdropModal;
