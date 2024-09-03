import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

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

const ReferralTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
`;

const Thead = styled.thead`
  background-color: #2c3e50;
  color: white;
`;

const Th = styled.th`
  padding: 15px;
  text-align: left;
  font-weight: bold;
`;

const Tbody = styled.tbody`
  & > tr:nth-child(even) {
    background-color: #f4f4f4;
  }
`;

const Td = styled.td`
  padding: 15px;
  vertical-align: middle;
`;

const NoUsername = styled.span`
  color: red;
`;

function ReferralTracking() {
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/referrals/all-referrals`);
        setReferrals(response.data);
      } catch (error) {
        console.error('Error fetching referrals:', error);
      }
    };

    fetchReferrals();
  }, []);

  return (
    <Container>
      <Title>Referral Tracking</Title>
      <ReferralTable>
        <Thead>
          <tr>
            <Th>Referrer ID</Th>
            <Th>Referrer Username</Th>
            <Th>Referred ID</Th>
            <Th>Referred Username</Th>
            <Th>Points Awarded</Th>
            <Th>Referral Date</Th>
          </tr>
        </Thead>
        <Tbody>
          {referrals.map((referral, index) => (
            <tr key={index}>
              <Td>{referral.referrerID}</Td>
              <Td>
                {referral.referrerUsername ? (
                  referral.referrerUsername
                ) : (
                  <NoUsername>No Username</NoUsername>
                )}
              </Td>
              <Td>{referral.referredID}</Td>
              <Td>
                {referral.referredUsername ? (
                  referral.referredUsername
                ) : (
                  <NoUsername>No Username</NoUsername>
                )}
              </Td>
              <Td>{referral.pointsAwarded}</Td>
              <Td>{new Date(referral.createdAt).toLocaleDateString()}</Td>
            </tr>
          ))}
        </Tbody>
      </ReferralTable>
    </Container>
  );
}

export default ReferralTracking;
