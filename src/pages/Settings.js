import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Logout from '../components/Logout';
import Modal from 'react-modal';

const Container = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  min-height: 100vh;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Section = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  text-align: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background-color: #c0392b;
  }
`;

const CloseButton = styled(Button)`
  background-color: #ccc;
  color: black;
  margin-left: 10px;
  &:hover {
    background-color: #bbb;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

function Settings() {
  const [usersWithZeroPoints, setUsersWithZeroPoints] = useState(0);
  const [referralsWithZeroPoints, setReferralsWithZeroPoints] = useState(0);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [referralModalOpen, setReferralModalOpen] = useState(false);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const usersResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/user-info/users-with-zero-points`
        );
        const referralsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/user-info/referrals-with-zero-points`
        );
        setUsersWithZeroPoints(usersResponse.data.count);
        setReferralsWithZeroPoints(referralsResponse.data.count);
      } catch (error) {
        console.error('Error fetching zero-point counts:', error);
      }
    };

    fetchCounts();
  }, []);

  const handleDeleteUsers = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/user-info/delete-users-with-zero-points`
      );
      alert(response.data.message);
      setUsersWithZeroPoints(0); // Reset count after deletion
      setUserModalOpen(false);
    } catch (error) {
      console.error('Error deleting users:', error);
    }
  };

  const handleDeleteReferrals = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/user-info/delete-referrals-with-zero-points`
      );
      alert(response.data.message);
      setReferralsWithZeroPoints(0); // Reset count after deletion
      setReferralModalOpen(false);
    } catch (error) {
      console.error('Error deleting referrals:', error);
    }
  };

  return (
    <Container>
      <Title>Settings</Title>

      {/* Section for Users with zero points */}
      <Section>
        <h3>Users with 0 Points: {usersWithZeroPoints}</h3>
        <Button onClick={() => setUserModalOpen(true)}>Delete Users</Button>
      </Section>

      {/* Modal for deleting users with zero points */}
      {userModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <h2>Are you sure you want to delete all users with 0 points?</h2>
            <Button onClick={handleDeleteUsers}>Yes, Delete</Button>
            <CloseButton onClick={() => setUserModalOpen(false)}>No, Cancel</CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Section for Referrals with zero pointsAwarded */}
      <Section>
        <h3>Referrals with 0 Points Awarded: {referralsWithZeroPoints}</h3>
        <Button onClick={() => setReferralModalOpen(true)}>Delete Referrals</Button>
      </Section>

      {/* Modal for deleting referrals with zero pointsAwarded */}
      {referralModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <h2>Are you sure you want to delete all referrals with 0 points awarded?</h2>
            <Button onClick={handleDeleteReferrals}>Yes, Delete</Button>
            <CloseButton onClick={() => setReferralModalOpen(false)}>No, Cancel</CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Logout Section */}
      <Section>
        <Logout />
      </Section>
    </Container>
  );
}

export default Settings;
