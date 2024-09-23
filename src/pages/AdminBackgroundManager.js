import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ConfirmationModal from '../components/ConfirmationModal'; // Import the modal

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
  margin: 10px;
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
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [action, setAction] = useState(null); // The action to confirm
  const [selectedBackground, setSelectedBackground] = useState(null); // Selected background for confirmation

  useEffect(() => {
    fetchBackgrounds();
  }, []);

  const fetchBackgrounds = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/background`);
      setBackgrounds(response.data); // The backend now returns the sorted list
    } catch (error) {
      console.error('Error fetching backgrounds:', error);
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const handleAddBackground = async () => {
    if (!newBackgroundUrl) return;

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/background`, { url: newBackgroundUrl });
      setNewBackgroundUrl('');
      fetchBackgrounds();
    } catch (error) {
      console.error('Error adding background:', error);
    }
  };

  const handleSetActive = (background) => {
    const activeBackground = backgrounds.find((bg) => bg.status === 'active');
    if (activeBackground) {
      setModalMessage(`There is already an active background. Please deactivate it first.`);
      setAction(null);
    } else {
      setModalMessage('Are you sure you want to make this background active?');
      setAction(() => () => confirmSetActive(background._id));
    }
    setSelectedBackground(background);
    setModalOpen(true);
  };

  const confirmSetActive = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/background/set-active/${id}`, { status: 'active' }); // Pass status: 'active'
      fetchBackgrounds();
    } catch (error) {
      console.error('Error setting background as active:', error);
    }
    setModalOpen(false);
  };
  

  const handleDeleteBackground = (background) => {
    setModalMessage('Are you sure you want to delete this background?');
    setAction(() => () => confirmDeleteBackground(background._id));
    setSelectedBackground(background);
    setModalOpen(true);
  };

  const confirmDeleteBackground = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/background/${id}`);
      fetchBackgrounds();
    } catch (error) {
      console.error('Error deleting background:', error);
    }
    setModalOpen(false);
  };

  const handleSetInactive = (background) => {
    setModalMessage('Are you sure you want to make this background inactive?');
    setAction(() => () => confirmSetInactive(background._id));
    setSelectedBackground(background);
    setModalOpen(true);
  };

  const confirmSetInactive = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/background/set-active/${id}`, { status: 'inactive' }); // Pass status: 'inactive'
      fetchBackgrounds();
    } catch (error) {
      console.error('Error setting background as inactive:', error);
    }
    setModalOpen(false);
  };
  
  

  // Close the modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedBackground(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
              <Button onClick={() => handleSetActive(bg)}>Set Active</Button>
            )}
            {bg.status === 'active' && (
              <Button onClick={() => handleSetInactive(bg)}>Set Inactive</Button>
            )}
            <Button onClick={() => handleDeleteBackground(bg)}>Delete</Button>
          </div>
        </BackgroundItem>
      ))}

      <ConfirmationModal
        isOpen={modalOpen}
        message={modalMessage}
        onConfirm={action}
        onCancel={closeModal}
      />
    </AdminContainer>
  );
}

export default AdminBackgroundManager;
