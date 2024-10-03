import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Modal from 'react-modal';

const Container = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  min-height: 100vh;
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  color: #34495e;
  font-size: 20px;
  margin-bottom: 10px;
`;

const CountText = styled.p`
  color: #34495e;
  font-size: 16px;
  margin-bottom: 20px;
`;

const DeleteButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #e74c3c;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
  &:hover {
    background-color: #c0392b;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const ModalTitle = styled.h2`
  margin-bottom: 20px;
`;

const DeleteList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
  max-height: 600px;
  overflow-y: auto;
`;

const DeleteItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #f9f9f9;
  margin: 5px 0;
  border-radius: 5px;
`;

const ConfirmButton = styled.button`
  padding: 10px;
  margin-top: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #2980b9;
  }
`;

const CloseButton = styled.button`
  padding: 10px;
  margin-top: 10px;
  background-color: #95a5a6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #7f8c8d;
  }
`;

const ConfirmModalContent = styled.div`
  text-align: center;
`;

function Settings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmBulkDeleteOpen, setIsConfirmBulkDeleteOpen] = useState(false);
  const [usersWithZeroPoints, setUsersWithZeroPoints] = useState([]);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isConfirmReferralBulkDeleteOpen, setIsConfirmReferralBulkDeleteOpen] = useState(false);
  const [referralsWithZeroPoints, setReferralsWithZeroPoints] = useState([]);

  // Fetch users and referrals when the component mounts
  useEffect(() => {
    fetchZeroPointsUsers();
    fetchZeroPointsReferrals();
  }, []);

  const fetchZeroPointsUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin-setting/users/zero-points`);
      setUsersWithZeroPoints(response.data);
    } catch (error) {
      console.error('Error fetching users with zero points', error);
    }
  };

  const fetchZeroPointsReferrals = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin-setting/referrals/zero-points`);
      setReferralsWithZeroPoints(response.data);
    } catch (error) {
      console.error('Error fetching referrals with zero points awarded', error);
    }
  };

  const deleteUser = async (userID) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/admin-setting/users/${userID}`);
      setUsersWithZeroPoints(usersWithZeroPoints.filter(user => user.userID !== userID));
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const deleteReferral = async (referralID) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/admin-setting/referrals/${referralID}`);
      setReferralsWithZeroPoints(referralsWithZeroPoints.filter(referral => referral._id !== referralID));
    } catch (error) {
      console.error('Error deleting referral', error);
    }
  };

  const deleteAllUsers = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/admin-setting/users/zero-points`);
      setUsersWithZeroPoints([]);
      setIsConfirmBulkDeleteOpen(false); // Close the bulk delete confirmation modal
    } catch (error) {
      console.error('Error deleting all users', error);
    }
  };

  const deleteAllReferrals = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/admin-setting/referrals/zero-points`);
      setReferralsWithZeroPoints([]);
      setIsConfirmReferralBulkDeleteOpen(false); // Close the bulk delete confirmation modal
    } catch (error) {
      console.error('Error deleting all referrals', error);
    }
  };

  return (
    <Container>
      <Title>Admin Settings</Title>

      {/* User Management Section */}
      <SectionTitle>Delete Users with 0 Points</SectionTitle>
      <CountText>Total users with 0 points: {usersWithZeroPoints.length}</CountText>
      <DeleteButton onClick={() => setIsModalOpen(true)}>Delete Users with 0 Points</DeleteButton>

      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} ariaHideApp={false}>
        <ModalContent>
          <ModalTitle>Users with 0 Points</ModalTitle>
          <DeleteList>
            {usersWithZeroPoints.map(user => (
              <DeleteItem key={user.userID}>
                {user.username || 'Unnamed User'} (ID: {user.userID})
                <DeleteButton onClick={() => deleteUser(user.userID)}>Delete</DeleteButton>
              </DeleteItem>
            ))}
          </DeleteList>
          {usersWithZeroPoints.length > 0 && (
            <ConfirmButton onClick={() => setIsConfirmBulkDeleteOpen(true)}>Delete All</ConfirmButton>
          )}
          <CloseButton onClick={() => setIsModalOpen(false)}>Close</CloseButton>
        </ModalContent>
      </Modal>

      {/* Confirm Bulk Delete Users Modal */}
      <Modal isOpen={isConfirmBulkDeleteOpen} onRequestClose={() => setIsConfirmBulkDeleteOpen(false)} ariaHideApp={false}>
        <ModalContent>
          <ConfirmModalContent>
            <ModalTitle>Are you sure you want to delete all users with 0 points?</ModalTitle>
            <ConfirmButton onClick={deleteAllUsers}>Yes, Delete All</ConfirmButton>
            <CloseButton onClick={() => setIsConfirmBulkDeleteOpen(false)}>No, Cancel</CloseButton>
          </ConfirmModalContent>
        </ModalContent>
      </Modal>

      {/* Referral Management Section */}
      <SectionTitle>Delete Referrals with 0 Points Awarded</SectionTitle>
      <CountText>Total referrals with 0 points awarded: {referralsWithZeroPoints.length}</CountText>
      <DeleteButton onClick={() => setIsReferralModalOpen(true)}>Delete Referrals with 0 Points</DeleteButton>

      <Modal isOpen={isReferralModalOpen} onRequestClose={() => setIsReferralModalOpen(false)} ariaHideApp={false}>
        <ModalContent>
          <ModalTitle>Referrals with 0 Points Awarded</ModalTitle>
          <DeleteList>
            {referralsWithZeroPoints.map(referral => (
              <DeleteItem key={referral._id}>
                Referrer: {referral.referrerID} | Referred: {referral.referredID} (ID: {referral._id})
                <DeleteButton onClick={() => deleteReferral(referral._id)}>Delete</DeleteButton>
              </DeleteItem>
            ))}
          </DeleteList>
          {referralsWithZeroPoints.length > 0 && (
            <ConfirmButton onClick={() => setIsConfirmReferralBulkDeleteOpen(true)}>Delete All</ConfirmButton>
          )}
          <CloseButton onClick={() => setIsReferralModalOpen(false)}>Close</CloseButton>
        </ModalContent>
      </Modal>

      {/* Confirm Bulk Delete Referrals Modal */}
      <Modal isOpen={isConfirmReferralBulkDeleteOpen} onRequestClose={() => setIsConfirmReferralBulkDeleteOpen(false)} ariaHideApp={false}>
        <ModalContent>
          <ConfirmModalContent>
            <ModalTitle>Are you sure you want to delete all referrals with 0 points awarded?</ModalTitle>
            <ConfirmButton onClick={deleteAllReferrals}>Yes, Delete All</ConfirmButton>
            <CloseButton onClick={() => setIsConfirmReferralBulkDeleteOpen(false)}>No, Cancel</CloseButton>
          </ConfirmModalContent>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default Settings;
