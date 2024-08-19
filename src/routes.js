// src/routes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AirdropList from "./pages/AirdropList";
import TaskList from "./pages/TaskList";
import UserAnalytics from "./pages/UserAnalytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login"; // Import the Login page
import PrivateRoute from "./components/PrivateRoute"; // Import the PrivateRoute component
import IGHAirdropTasks from './pages/IGH_AirdropTasks';


function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/airdrops"
        element={
          <PrivateRoute>
            <AirdropList />
          </PrivateRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <PrivateRoute>
            <TaskList />
          </PrivateRoute>
        }
      />
      <Route
        path="/users"
        element={
          <PrivateRoute>
            <UserAnalytics />
          </PrivateRoute>
        }
      />
      <Route path="/igh-airdrop" element={<IGHAirdropTasks />} />

      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
