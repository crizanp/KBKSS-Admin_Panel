import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

// Styled Components for the form
const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f4f4f4;
  border-radius: 10px;
`;

const Title = styled.h1`
  text-align: center;
  color: #2c3e50;
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
  width: 100%;

  &:hover {
    background-color: #3498db;
    transform: translateY(-2px);
  }
`;

// Edit Airdrop Component
function EditAirdrop() {
  const { id } = useParams(); // Get the airdrop ID from the URL
  const [airdropData, setAirdropData] = useState({
    name: '',
    description: '',
    reward: '',
    participants: '',
    winners: '',
    startDate: '',
    endDate: '',
    logo: '',
    airdropLink: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // For redirecting after saving

  // Fetch the airdrop details by ID when the component mounts
  useEffect(() => {
    const fetchAirdrop = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/airdrops/${id}`);
        setAirdropData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching airdrop data');
        setLoading(false);
      }
    };

    fetchAirdrop();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAirdropData({ ...airdropData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/airdrops/${id}`, airdropData);
      alert('Airdrop updated successfully');
      navigate('/airdrops'); // Redirect to the airdrop list page
    } catch (err) {
      setError('Error updating airdrop');
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <Title>Edit Airdrop - {airdropData.name}</Title>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Airdrop Name</Label>
          <Input
            type="text"
            name="name"
            value={airdropData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Description</Label>
          <TextArea
            name="description"
            rows="4"
            value={airdropData.description}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Reward</Label>
          <Input
            type="text"
            name="reward"
            value={airdropData.reward}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Participants</Label>
          <Input
            type="number"
            name="participants"
            value={airdropData.participants}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Winners</Label>
          <Input
            type="number"
            name="winners"
            value={airdropData.winners}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Start Date</Label>
          <Input
            type="date"
            name="startDate"
            value={airdropData.startDate.split('T')[0]} // Format date for input
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>End Date</Label>
          <Input
            type="date"
            name="endDate"
            value={airdropData.endDate.split('T')[0]} // Format date for input
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Logo URL</Label>
          <Input
            type="text"
            name="logo"
            value={airdropData.logo}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Airdrop Link</Label>
          <Input
            type="text"
            name="airdropLink"
            value={airdropData.airdropLink}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <Button type="submit">Save Changes</Button>
      </form>
    </Container>
  );
}

export default EditAirdrop;
