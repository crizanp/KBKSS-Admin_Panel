import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Modal from 'react-modal';

const AnalyticsContainer = styled.div`
  padding: 20px;
  background-color: #f0fbf0;
  border-radius: 8px;
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const TableHeader = styled.th`
  background-color: #f5f5f5;
  padding: 10px;
  border-bottom: 2px solid #ddd;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  text-align: center;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
`;

const ModalContent = styled.div`
  animation: fadeInScale 0.4s ease-out;
  @keyframes fadeInScale {
    0% {
      opacity: 0;
      transform: scale(0.7);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const AvatarAnalytics = () => {
  const [avatars, setAvatars] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/avatars`);
        setAvatars(response.data);
      } catch (error) {
        console.error('Error fetching avatars:', error);
      }
    };

    fetchAvatars();
  }, []);

  const handleUnlockClick = async (avatarId, avatarName) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/avatar/${avatarId}/unlocked-users`);
      setModalData(response.data);
      setModalTitle(`Users who unlocked ${avatarName}`);
      setModalIsOpen(true);
    } catch (error) {
      console.error('Error fetching unlocked users:', error);
    }
  };

  const handleActiveClick = async (avatarId, avatarName) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/avatar/${avatarId}/active-users`);
      setModalData(response.data);
      setModalTitle(`Users with ${avatarName} set as active`);
      setModalIsOpen(true);
    } catch (error) {
      console.error('Error fetching active users:', error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalData([]);
  };

  return (
    <AnalyticsContainer>
      <h3>Avatar Analytics</h3>
      <Table>
        <thead>
          <tr>
            <TableHeader>Avatar Name</TableHeader>
            <TableHeader>Unlocked By</TableHeader>
            <TableHeader>Active Users</TableHeader>
          </tr>
        </thead>
        <tbody>
          {avatars.map((avatar) => (
            <TableRow key={avatar._id}>
              <TableCell>{avatar.name}</TableCell>
              <TableCell onClick={() => handleUnlockClick(avatar._id, avatar.name)}>
                {avatar.unlockedByCount}
              </TableCell>
              <TableCell onClick={() => handleActiveClick(avatar._id, avatar.name)}>
                {avatar.activeUsersCount}
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      {modalIsOpen && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            },
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          }}
        >
          <ModalContent>
            <h2>{modalTitle}</h2>
            <button onClick={closeModal}>Close</button>
            <ul>
              {modalData.length ? (
                modalData.map((user) => (
                  <li key={user.userID}>{user.username || user.userID}</li>
                ))
              ) : (
                <p>No users found</p>
              )}
            </ul>
          </ModalContent>
        </Modal>
      )}
    </AnalyticsContainer>
  );
};

export default AvatarAnalytics;
