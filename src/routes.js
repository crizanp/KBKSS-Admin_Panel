import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AirdropList from "./pages/AirdropList";
import TaskList from "./pages/TaskList";
import UserAnalytics from "./pages/UserAnalytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import IGHAirdropTasks from './pages/IGH_AirdropTasks';
import QuizManagement from "./pages/QuizManagement";
import ReferralTracking from "./pages/ReferralTracking"; 
import NotFound from "./pages/NotFound"; 
import AdminTreasureHuntSettings from "./pages/TresureHunt";
import EditAirdrop from './pages/EditAirdrop';  // Import EditAirdrop page

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
      
      {/* Add Edit Airdrop Route */}
      <Route
        path="/airdrops/edit/:id"
        element={
          <PrivateRoute>
            <EditAirdrop />
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
      <Route
        path="/igh-airdrop"
        element={
          <PrivateRoute>
            <IGHAirdropTasks />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route
        path="/quiz-management"
        element={
          <PrivateRoute>
            <QuizManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="/referrals"
        element={
          <PrivateRoute>
            <ReferralTracking />
          </PrivateRoute>
        }
      />
       <Route
        path="/tresure-hunt"
        element={
          <PrivateRoute>
            <AdminTreasureHuntSettings />
          </PrivateRoute>
        }
      />

      {/* Catch-all Route for Undefined Paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
