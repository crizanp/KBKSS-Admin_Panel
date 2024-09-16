import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AirdropRow from './AirdropRow';
import axios from 'axios';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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

function AirdropTable() {
  const [airdrops, setAirdrops] = useState([]);

  useEffect(() => {
    const fetchAirdrops = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/airdrops`);
        setAirdrops(response.data);
      } catch (error) {
        console.error('Error fetching airdrops:', error);
      }
    };

    fetchAirdrops();
  }, []);

  return (
    <Table>
      <Thead>
        <tr>
          <Th>Logo</Th>
          <Th>Name</Th>
          <Th>Description</Th>
          <Th>Airdrop Link</Th>
          <Th>Reward</Th>
          <Th>Participants</Th>
          <Th>Winners</Th>
          <Th>Start Date</Th>
          <Th>End Date</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
        </tr>
      </Thead>
      <Tbody>
        {airdrops.map((airdrop) => (
          <AirdropRow key={airdrop._id} airdrop={airdrop} />
        ))}
      </Tbody>
    </Table>
  );
}

export default AirdropTable;
