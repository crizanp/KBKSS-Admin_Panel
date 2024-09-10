import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled Components for the form and its elements
const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f7fc;
  padding: 20px;
`;

const Form = styled.form`
  background-color: #ffffff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 40px;
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-family: 'Arial', sans-serif;
`;

const Input = styled.input`
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  margin-bottom: 20px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #0088cc;
    box-shadow: 0 0 5px rgba(0, 136, 204, 0.5);
  }
`;

const Button = styled.button`
  padding: 14px;
  background-color: #0088cc;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #005f99;
  }

  &:disabled {
    background-color: grey;
    cursor: not-allowed;
  }
`;

const Label = styled.label`
  font-size: 16px;
  color: #555;
  margin-bottom: 8px;
  font-weight: bold;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-bottom: 20px;
`;

const LoadingMessage = styled.p`
  color: #555;
  text-align: center;
  font-size: 18px;
`;

const AdminTreasureHuntSettings = () => {
  const [settings, setSettings] = useState({
    description: '',
    shortDescription: '',
    link: '',
    correctCode: '',
    startTime: '',
    endTime: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/treasure-hunt-settings`);
        setSettings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching treasure hunt settings:', error);
        setError('Error fetching treasure hunt settings.');
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (settings._id) {
        await axios.put(`${process.env.REACT_APP_API_URL}/treasure-hunt-settings/${settings._id}`, settings);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/treasure-hunt-settings`, settings);
      }
      alert('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      setError('Failed to update settings');
    }
  };

  if (loading) return <LoadingMessage>Loading...</LoadingMessage>;

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <Title>Treasure Hunt Settings</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Label htmlFor="description">Description</Label>
        <Input
          type="text"
          name="description"
          value={settings.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />

        <Label htmlFor="shortDescription">Short Description</Label>
        <Input
          type="text"
          name="shortDescription"
          value={settings.shortDescription}
          onChange={handleChange}
          placeholder="Short Description"
          required
        />

        <Label htmlFor="link">Link</Label>
        <Input
          type="url"
          name="link"
          value={settings.link}
          onChange={handleChange}
          placeholder="Link"
          required
        />

        <Label htmlFor="correctCode">Correct Code</Label>
        <Input
          type="text"
          name="correctCode"
          value={settings.correctCode}
          onChange={handleChange}
          placeholder="Correct Code"
          required
        />

        <Label htmlFor="startTime">Start Time</Label>
        <Input
          type="datetime-local"
          name="startTime"
          value={settings.startTime}
          onChange={handleChange}
          required
        />

        <Label htmlFor="endTime">End Time</Label>
        <Input
          type="datetime-local"
          name="endTime"
          value={settings.endTime}
          onChange={handleChange}
          required
        />

        <Button type="submit">Save Settings</Button>
      </Form>
    </FormContainer>
  );
};

export default AdminTreasureHuntSettings;
