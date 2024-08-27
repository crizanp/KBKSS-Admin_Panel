import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const TableContainer = styled.div`
  background-color: #f0fbf0;
  padding: 20px;
  border-radius: 15px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background-color: #f5f5f5;
  text-align: left;
  padding: 10px;
  border-bottom: 2px solid #ddd;
  font-weight: bold;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

function TopUserTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/fetchdata`);
        const sortedUsers = response.data.sort((a, b) => b.points - a.points).slice(0, 10); // Top 10 users
        setUsers(sortedUsers);
      } catch (error) {
        console.error('Error fetching top users:', error);
      }
    };

    fetchTopUsers();
  }, []);

  return (
    <TableContainer>
      <h3>Top Users</h3>
      <Table>
        <thead>
          <tr>
            <TableHeader>Rank</TableHeader>
            <TableHeader>User ID</TableHeader>
            <TableHeader>Points</TableHeader>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <TableRow key={user.userID}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{user.userID}</TableCell>
              <TableCell>{user.points.toFixed(2)}</TableCell> {/* Fixed to two decimal places */}
            </TableRow>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}

export default TopUserTable;
