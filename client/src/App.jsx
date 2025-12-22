import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';

import Login from './pages/Login';
import Register from './pages/Register';
import ArticleEditor from './pages/ArticleEditor';

import Wiki from './pages/Wiki';
import ArticleView from './pages/ArticleView';
import QA from './pages/QA';
import QuestionDetail from './pages/QuestionDetail';
import Repo from './pages/Repo';
import SearchPage from './pages/SearchPage';
import MyArticles from './pages/MyArticles';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Feedback from './pages/Feedback';
import Support from './pages/Support';
import Admin from './pages/Admin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <Routes>
            {/* Public Routes - Accessible without login */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/wiki" element={<Wiki />} />
            <Route path="/wiki/:slug" element={<ArticleView />} />
            <Route path="/search" element={<SearchPage />} />
            
            {/* Protected Routes - Require login */}
            <Route path="/wiki/new" element={<ProtectedRoute><ArticleEditor /></ProtectedRoute>} />
            <Route path="/editor" element={<ProtectedRoute><ArticleEditor /></ProtectedRoute>} />
            <Route path="/editor/:id" element={<ProtectedRoute><ArticleEditor /></ProtectedRoute>} />
            <Route path="/qa" element={<ProtectedRoute><QA /></ProtectedRoute>} />
            <Route path="/qa/:id" element={<ProtectedRoute><QuestionDetail /></ProtectedRoute>} />
            <Route path="/repo" element={<ProtectedRoute><Repo /></ProtectedRoute>} />
            <Route path="/my-articles" element={<ProtectedRoute><MyArticles /></ProtectedRoute>} />
            <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
            <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
