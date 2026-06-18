import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import DashboardClass10 from './pages/DashboardClass10.jsx';
import DashboardClass12 from './pages/DashboardClass12.jsx';
import SubjectDetail from './pages/SubjectDetail.jsx';
import AIAssistant from './pages/AIAssistant.jsx';
import AIPlanner from './pages/AIPlanner.jsx';
import MockTests from './pages/MockTests.jsx';
import BoardPapers from './pages/BoardPapers.jsx';
import DoubtForum from './pages/DoubtForum.jsx';
import Achievements from './pages/Achievements.jsx';
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import CommunityGroups from './components/CommunityGroups.jsx';
import ScholarshipHub from './pages/ScholarshipHub.jsx';
import VideoUniverse from './pages/VideoUniverse.jsx';
import WatchLater from './pages/WatchLater.jsx';
import RevisionShorts from './pages/RevisionShorts.jsx';

const Layout = ({ children }) => {
  const location = useLocation();
  const isPublic = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <div className="flex flex-1">
        {!isPublic && <Sidebar />}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Doubt Forum (Accessible to all authenticated/public readers) */}
          <Route path="/forum" element={<DoubtForum />} />

          {/* Class 10 Dashboard */}
          <Route
            path="/dashboard/class10"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardClass10 />
              </ProtectedRoute>
            }
          />

          {/* Class 12 Dashboard */}
          <Route
            path="/dashboard/class12"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardClass12 />
              </ProtectedRoute>
            }
          />

          {/* Subject Detail Page */}
          <Route
            path="/subjects/:subjectId"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <SubjectDetail />
              </ProtectedRoute>
            }
          />

          {/* AI Tools */}
          <Route
            path="/ai-assistant"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <AIAssistant />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-planner"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <AIPlanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mock-tests"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MockTests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/papers"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <BoardPapers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <CommunityGroups />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scholarships"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <ScholarshipHub />
              </ProtectedRoute>
            }
          />

          {/* YouTube Learning Routes */}
          <Route
            path="/watch/:videoId"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <VideoUniverse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watch-later"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <WatchLater />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shorts-reels"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <RevisionShorts />
              </ProtectedRoute>
            }
          />

          {/* Gamification Achievements */}
          <Route
            path="/achievements"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Achievements />
              </ProtectedRoute>
            }
          />

          {/* Teacher Pages */}
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Pages */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
