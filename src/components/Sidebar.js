// src/components/Sidebar.js
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import {
  FaBars,
  FaHome,
  FaCoins,
  FaTasks,
  FaUsers,
  FaCog,
} from "react-icons/fa";

const SidebarContainer = styled.div`
  width: ${(props) => (props.isOpen ? "250px" : "60px")};
  height: 100vh;
  background-color: #2c3e50;
  padding: 20px;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  transition: width 0.3s ease;

  @media (max-width: 768px) {
    width: ${(props) => (props.isOpen ? "200px" : "50px")};
    padding: 15px;
  }
`;

const SidebarToggle = styled.div`
  display: flex;
  justify-content: ${(props) => (props.isOpen ? "flex-end" : "center")};
  cursor: pointer;
  margin-bottom: 20px;
`;

const SidebarItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  color: white;
  text-decoration: none;
  margin-bottom: 10px;
  font-size: 18px;
  transition: background 0.3s, padding 0.3s;
  justify-content: ${(props) => (props.isOpen ? "flex-start" : "center")};

  &.active {
    background-color: #2980b9;
  }

  &:hover {
    background-color: #34495e;
  }

  svg {
    margin-right: ${(props) => (props.isOpen ? "10px" : "0")};
    font-size: 24px;
  }

  span {
    display: ${(props) => (props.isOpen ? "inline" : "none")};
  }
`;

const Logo = styled.div`
  font-size: 24px;
  text-align: center;
  margin-bottom: 30px;
`;

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarToggle isOpen={isOpen} onClick={toggleSidebar}>
        <FaBars />
      </SidebarToggle>
      <Logo>{isOpen ? "🌟 Admin" : "🌟"}</Logo>
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

      <SidebarItem to="/settings" isOpen={isOpen}>
        <FaCog /> <span>Settings</span>
      </SidebarItem>
    </SidebarContainer>
  );
}

export default Sidebar;
