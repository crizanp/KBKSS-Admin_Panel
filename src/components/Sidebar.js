// src/components/Sidebar.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaHome, FaCoins, FaTasks, FaUsers, FaCog, FaQuestion } from 'react-icons/fa';

const SidebarContainer = styled.div`
  width: ${(props) => (props.isOpen ? '200px' : '60px')};
  height: 100vh;
  background-color: #2c3e50;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isOpen ? 'flex-start' : 'center')};
  transition: width 0.3s ease, padding 0.3s ease;
  padding: ${(props) => (props.isOpen ? '20px 10px' : '15px 5px')};
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  z-index: 100; /* Ensure the sidebar is above other content */
`;

const SidebarToggle = styled.div`
  display: flex;
  justify-content: ${(props) => (props.isOpen ? 'flex-end' : 'center')};
  cursor: pointer;
  font-size: 22px;
  margin-bottom: 20px;
  color: white;

  &:hover {
    color: #3498db;
  }
`;

const SidebarItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: ${(props) => (props.isOpen ? '10px 15px' : '10px 5px')};
  color: white;
  text-decoration: none;
  margin-bottom: 10px;
  font-size: ${(props) => (props.isOpen ? '16px' : '20px')};
  border-radius: 5px;
  transition: background 0.3s, padding 0.3s, font-size 0.3s;
  width: 100%; /* Ensure the item takes the full width */
  box-sizing: border-box; /* Include padding and border in the width calculation */

  &.active {
    background-color: #2980b9;
  }

  &:hover {
    background-color: #34495e;
  }

  svg {
    margin-right: ${(props) => (props.isOpen ? '10px' : '0')};
    font-size: ${(props) => (props.isOpen ? '18px' : '22px')};
  }

  span {
    display: ${(props) => (props.isOpen ? 'inline' : 'none')};
    font-size: ${(props) => (props.isOpen ? '14px' : '0')};
  }
`;

const Logo = styled.div`
  font-size: ${(props) => (props.isOpen ? '20px' : '24px')};
  text-align: center;
  margin-bottom: 30px;
  color: #ecf0f1;

  @media (max-width: 768px) {
    font-size: ${(props) => (props.isOpen ? '18px' : '20px')};
  }
`;

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarToggle isOpen={isOpen} onClick={toggleSidebar}>
        <FaBars />
      </SidebarToggle>
      <Logo isOpen={isOpen}>{isOpen ? "🌟 Admin" : "🌟"}</Logo>
      <SidebarItem to="/" exact isOpen={isOpen}>
        <FaHome /> <span>Dashboard</span>
      </SidebarItem>
      <SidebarItem to="/airdrops" isOpen={isOpen}>
        <FaCoins /> <span>Airdrops</span>
      </SidebarItem>
      <SidebarItem to="/tasks" isOpen={isOpen}>
        <FaTasks /> <span>Tasks</span>
      </SidebarItem>
      <SidebarItem to="/users" isOpen={isOpen}>
        <FaUsers /> <span>Users</span>
      </SidebarItem>
      <SidebarItem to="/igh-airdrop" isOpen={isOpen}>
        <FaTasks /> <span>IGH Airdrop</span>
      </SidebarItem>
      <SidebarItem to="/quiz-management" isOpen={isOpen}>
        <FaQuestion /> <span>Quiz Management</span>
      </SidebarItem>
      <SidebarItem to="/settings" isOpen={isOpen}>
        <FaCog /> <span>Settings</span>
      </SidebarItem>
    </SidebarContainer>
  );
}

export default Sidebar;
