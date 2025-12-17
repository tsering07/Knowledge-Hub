import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
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
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/wiki" element={<Wiki />} />
            <Route path="/wiki/new" element={<ArticleEditor />} />
            <Route path="/wiki/:slug" element={<ArticleView />} />
            <Route path="/qa" element={<QA />} />
            <Route path="/qa/:id" element={<QuestionDetail />} />
            <Route path="/repo" element={<Repo />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/editor" element={<ArticleEditor />} />
            <Route path="/my-articles" element={<MyArticles />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/support" element={<Support />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
