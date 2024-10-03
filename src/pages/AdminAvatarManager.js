import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ConfirmationModal from '../components/ConfirmationModal'; // Import the modal component

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

const AvatarItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 15px;
  background-color: white;
  border: 1px solid #ccc;
`;

function AdminAvatarManager() {
  const [avatars, setAvatars] = useState([]);
  const [newAvatar, setNewAvatar] = useState({
    name: '',
    levelRequired: '',
    gemsRequired: '',
    image: '',
    availableToAllLevels: false,
  });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [action, setAction] = useState(null); // The action to confirm
  const [selectedAvatar, setSelectedAvatar] = useState(null); // Selected avatar for confirmation

  useEffect(() => {
    fetchAvatars();
  }, []);

  const fetchAvatars = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/avatar`);
      setAvatars(response.data);
    } catch (error) {
      console.error('Error fetching avatars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAvatar = async () => {
    if (!newAvatar.name || !newAvatar.image || !newAvatar.levelRequired || !newAvatar.gemsRequired) return;

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/avatar/create`, newAvatar);
      setNewAvatar({ name: '', levelRequired: '', gemsRequired: '', image: '', availableToAllLevels: false });
      fetchAvatars();
    } catch (error) {
      console.error('Error adding avatar:', error);
    }
  };

  const handleUpdateAvatar = (avatar) => {
    setModalMessage('Are you sure you want to update this avatar?');
    setAction(() => () => confirmUpdateAvatar(avatar._id));
    setSelectedAvatar(avatar);
    setModalOpen(true);
  };

  const confirmUpdateAvatar = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/avatar/${id}/update`, selectedAvatar);
      fetchAvatars();
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
    setModalOpen(false);
  };

  const handleDeleteAvatar = (avatar) => {
    setModalMessage('Are you sure you want to delete this avatar?');
    setAction(() => () => confirmDeleteAvatar(avatar._id));
    setSelectedAvatar(avatar);
    setModalOpen(true);
  };

  const confirmDeleteAvatar = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/avatar/${id}/delete`);
      fetchAvatars();
    } catch (error) {
      console.error('Error deleting avatar:', error);
    }
    setModalOpen(false);
  };

  // Close the modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedAvatar(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!Array.isArray(avatars) || avatars.length === 0) {
    return <div>No avatars available.</div>;
  }

  return (
    <AdminContainer>
      <Title>Manage Avatars</Title>

      <Input
        type="text"
        value={newAvatar.name}
        onChange={(e) => setNewAvatar({ ...newAvatar, name: e.target.value })}
        placeholder="Enter avatar name"
      />
      <Input
        type="text"
        value={newAvatar.levelRequired}
        onChange={(e) => setNewAvatar({ ...newAvatar, levelRequired: e.target.value })}
        placeholder="Enter level required"
      />
      <Input
        type="text"
        value={newAvatar.gemsRequired}
        onChange={(e) => setNewAvatar({ ...newAvatar, gemsRequired: e.target.value })}
        placeholder="Enter gems required"
      />
      <Input
        type="text"
        value={newAvatar.image}
        onChange={(e) => setNewAvatar({ ...newAvatar, image: e.target.value })}
        placeholder="Enter avatar image URL"
      />
      <label>
        Available to all levels:
        <input
          type="checkbox"
          checked={newAvatar.availableToAllLevels}
          onChange={(e) => setNewAvatar({ ...newAvatar, availableToAllLevels: e.target.checked })}
        />
      </label>
      <Button onClick={handleAddAvatar}>Add Avatar</Button>

      {avatars.map((avatar) => (
        <AvatarItem key={avatar._id}>
          <div>
            <img src={avatar.image} alt={avatar.name} width="100" />
            <p>Name: {avatar.name}</p>
            <p>Level Required: {avatar.levelRequired}</p>
            <p>Gems Required: {avatar.gemsRequired}</p>
          </div>
          <div>
            <Button onClick={() => handleUpdateAvatar(avatar)}>Update</Button>
            <Button onClick={() => handleDeleteAvatar(avatar)}>Delete</Button>
          </div>
        </AvatarItem>
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

export default AdminAvatarManager;
