import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Modal, Spin, message } from 'antd'; // Ant Design modal and spinner for better user experience
import ConfirmationModal from '../components/ConfirmationModal';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const AdminContainer = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  min-height: 100vh;
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

const AvatarItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 15px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
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
  const [editModalOpen, setEditModalOpen] = useState(false); // For editing modal
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submission state

  useEffect(() => {
    fetchAvatars();
  }, []);

  const fetchAvatars = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/avatar`);
      setAvatars(response.data);
    } catch (error) {
      console.error('Error fetching avatars:', error);
      message.error('Failed to fetch avatars.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAvatar = async () => {
    if (!newAvatar.name || !newAvatar.image || !newAvatar.levelRequired || !newAvatar.gemsRequired) return;

    setIsSubmitting(true); // Show loading spinner while adding avatar
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/avatar/create`, newAvatar);
      setNewAvatar({ name: '', levelRequired: '', gemsRequired: '', image: '', availableToAllLevels: false });
      fetchAvatars(); // Reload the avatar list
      message.success('Avatar added successfully!');
    } catch (error) {
      console.error('Error adding avatar:', error);
      message.error('Failed to add avatar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAvatar = (avatar) => {
    setSelectedAvatar(avatar); // Set the avatar to be edited
    setEditModalOpen(true); // Open the edit modal
  };

  const confirmUpdateAvatar = async () => {
    if (!selectedAvatar.name || !selectedAvatar.image || !selectedAvatar.levelRequired || !selectedAvatar.gemsRequired) return;

    setIsSubmitting(true); // Show spinner while updating
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/avatar/${selectedAvatar._id}/update`, selectedAvatar);
      fetchAvatars(); // Reload the avatar list
      message.success('Avatar updated successfully!');
    } catch (error) {
      console.error('Error updating avatar:', error);
      message.error('Failed to update avatar.');
    } finally {
      setIsSubmitting(false);
      setEditModalOpen(false); // Close the edit modal
    }
  };

  const handleDeleteAvatar = (avatar) => {
    setModalMessage('Are you sure you want to delete this avatar?');
    setAction(() => () => confirmDeleteAvatar(avatar._id));
    setSelectedAvatar(avatar);
    setModalOpen(true);
  };

  const confirmDeleteAvatar = async (id) => {
    setIsSubmitting(true); // Show spinner while deleting
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/avatar/${id}/delete`);
      fetchAvatars();
      message.success('Avatar deleted successfully!');
    } catch (error) {
      console.error('Error deleting avatar:', error);
      message.error('Failed to delete avatar.');
    } finally {
      setIsSubmitting(false);
      setModalOpen(false);
    }
  };

  // Close the modals
  const closeModal = () => {
    setModalOpen(false);
    setSelectedAvatar(null);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedAvatar(null);
  };

  return (
    <AdminContainer>
      <Title>Manage Avatars</Title>
      Want to manage default avatar? 
      <Link to="/default-avatar-manage">
        <Button>Manage Default Avatar</Button>
      </Link>
      {/* Form to add a new avatar */}
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
      <Button onClick={handleAddAvatar} disabled={isSubmitting}>
        {isSubmitting ? <Spin size="small" /> : 'Add Avatar'}
      </Button>

      {/* Loading spinner while avatars are being fetched */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
        </div>
      ) : avatars.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>No avatars available.</div>
      ) : (
        avatars.map((avatar) => (
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
        ))
      )}

      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        message={modalMessage}
        onConfirm={action}
        onCancel={closeModal}
      />

      {/* Edit Avatar Modal */}
      <Modal
        title="Update Avatar"
        visible={editModalOpen}
        onCancel={closeEditModal}
        footer={null}
      >
        <Input
          type="text"
          value={selectedAvatar?.name || ''}
          onChange={(e) => setSelectedAvatar({ ...selectedAvatar, name: e.target.value })}
          placeholder="Enter avatar name"
        />
        <Input
          type="text"
          value={selectedAvatar?.levelRequired || ''}
          onChange={(e) => setSelectedAvatar({ ...selectedAvatar, levelRequired: e.target.value })}
          placeholder="Enter level required"
        />
        <Input
          type="text"
          value={selectedAvatar?.gemsRequired || ''}
          onChange={(e) => setSelectedAvatar({ ...selectedAvatar, gemsRequired: e.target.value })}
          placeholder="Enter gems required"
        />
        <Input
          type="text"
          value={selectedAvatar?.image || ''}
          onChange={(e) => setSelectedAvatar({ ...selectedAvatar, image: e.target.value })}
          placeholder="Enter avatar image URL"
        />
        <label>
          Available to all levels:
          <input
            type="checkbox"
            checked={selectedAvatar?.availableToAllLevels || false}
            onChange={(e) => setSelectedAvatar({ ...selectedAvatar, availableToAllLevels: e.target.checked })}
          />
        </label>
        <Button onClick={confirmUpdateAvatar} disabled={isSubmitting}>
          {isSubmitting ? <Spin size="small" /> : 'Update Avatar'}
        </Button>
      </Modal>
    </AdminContainer>
  );
}

export default AdminAvatarManager;
