import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Spin, message } from 'antd';

const FallbackContainer = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FallbackSection = styled.div`
  padding: 20px;
  background-color: #ffffff;
  margin: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  text-align: center;
`;

const Input = styled.input`
  padding: 10px;
  width: 100%;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border 0.3s ease;

  &:focus {
    border-color: #3498db;
  }
`;

const Button = styled.button`
  padding: 10px;
  margin: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

function FallbackImageManager() {
  const [fallbackImage, setFallbackImage] = useState('');
  const [fallbackId, setFallbackId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFallbackImage();
  }, []);

  const fetchFallbackImage = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/fallback-avatar`);
      const fallback = response.data[0]; // Assuming there's only one fallback image
      if (fallback) {
        setFallbackImage(fallback.fallbackAvatarUrl);
        setFallbackId(fallback._id);
      }
    } catch (error) {
      console.error('Error fetching fallback image:', error);
      message.error('Failed to fetch fallback image.');
    }
  };

  const handleFallbackUpdate = async () => {
    setIsSubmitting(true);
    try {
      if (fallbackId) {
        await axios.put(`${process.env.REACT_APP_API_URL}/fallback-avatar/${fallbackId}/update`, {
          fallbackAvatarUrl: fallbackImage,
        });
        message.success('Fallback image updated successfully!');
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/fallback-avatar/create`, {
          fallbackAvatarUrl: fallbackImage,
        });
        message.success('Fallback image created successfully!');
      }
    } catch (error) {
      console.error('Error updating fallback image:', error);
      message.error('Failed to update fallback image.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFallback = async () => {
    if (!fallbackId) return;

    setIsSubmitting(true);
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/fallback-avatar/${fallbackId}/delete`);
      setFallbackImage('');
      setFallbackId(null);
      message.success('Fallback image deleted successfully!');
    } catch (error) {
      console.error('Error deleting fallback image:', error);
      message.error('Failed to delete fallback image.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FallbackContainer>
      <FallbackSection>
        <Title>Manage Fallback Image</Title>
        <Input
          type="text"
          value={fallbackImage}
          onChange={(e) => setFallbackImage(e.target.value)}
          placeholder="Enter fallback image URL"
        />
        <Button onClick={handleFallbackUpdate} disabled={isSubmitting}>
          {isSubmitting ? <Spin size="small" /> : 'Update Fallback Image'}
        </Button>
        {fallbackId && (
          <Button onClick={handleDeleteFallback} disabled={isSubmitting}>
            {isSubmitting ? <Spin size="small" /> : 'Delete Fallback Image'}
          </Button>
        )}
      </FallbackSection>
    </FallbackContainer>
  );
}

export default FallbackImageManager;
