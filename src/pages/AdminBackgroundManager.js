import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const AdminContainer = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  min-height: 100vh;
`;

const Title = styled.h1`
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  width: 100%;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
`;

const BackgroundItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 15px;
  background-color: white;
  border: 1px solid #ccc;
`;

function AdminBackgroundManager() {
  const [backgrounds, setBackgrounds] = useState([]);
  const [newBackgroundUrl, setNewBackgroundUrl] = useState('');
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    fetchBackgrounds();
  }, []);

  const fetchBackgrounds = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/background`); // Make sure this endpoint is correct
      setBackgrounds(response.data); // Assuming response.data is the array of backgrounds
    } catch (error) {
      console.error('Error fetching backgrounds:', error);
    } finally {
      setLoading(false); // Ensure loading state is turned off after data fetch
    }
  };

  const handleAddBackground = async () => {
    if (!newBackgroundUrl) return;

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/background`, { url: newBackgroundUrl });
      setNewBackgroundUrl('');
      fetchBackgrounds(); // Refresh the list
    } catch (error) {
      console.error('Error adding background:', error);
    }
  };

  const handleSetActive = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/background/set-active/${id}`);
      fetchBackgrounds(); // Refresh the list
    } catch (error) {
      console.error('Error setting background as active:', error);
    }
  };

  const handleDeleteBackground = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/background/${id}`);
      fetchBackgrounds(); // Refresh the list
    } catch (error) {
      console.error('Error deleting background:', error);
    }
  };

  // Return a loading state if data is still being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // If backgrounds is not an array, prevent map from running
  if (!Array.isArray(backgrounds)) {
    return <div>No backgrounds available.</div>;
  }

  return (
    <AdminContainer>
      <Title>Manage Backgrounds</Title>

      <Input
        type="text"
        value={newBackgroundUrl}
        onChange={(e) => setNewBackgroundUrl(e.target.value)}
        placeholder="Enter background image URL"
      />
      <Button onClick={handleAddBackground}>Add Background</Button>

      {backgrounds.map((bg) => (
        <BackgroundItem key={bg._id}>
          <div>
            <img src={bg.url} alt="Background" width="100" />
            <p>Status: {bg.status}</p>
          </div>
          <div>
            {bg.status === 'inactive' && (
              <Button onClick={() => handleSetActive(bg._id)}>Set Active</Button>
            )}
            <Button onClick={() => handleDeleteBackground(bg._id)}>Delete</Button>
          </div>
        </BackgroundItem>
      ))}
    </AdminContainer>
  );
}

export default AdminBackgroundManager;
