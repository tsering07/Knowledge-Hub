import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
  Home, Search, User, Library, Users, Settings, HelpCircle,
  BookOpen, Shield, UserCheck, UserX, Edit, Trash2, MoreVertical,
  BarChart3, FileText, MessageSquare, TrendingUp, AlertCircle,
  ChevronDown, Check, X, RefreshCw, Crown, Eye, PenTool
} from 'lucide-react';

const Admin = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [articleStatusFilter, setArticleStatusFilter] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Check if user is admin or editor
    if (user && !['admin', 'editor'].includes(user.role)) {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, usersRes, articlesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/stats', { headers }),
        axios.get('http://localhost:5000/api/admin/users', { headers }),
        axios.get('http://localhost:5000/api/admin/articles', { headers })
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setArticles(articlesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      if (error.response?.status === 403) {
        navigate('/');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      setEditingUser(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeleteArticle = async (articleId, title) => {
    if (!window.confirm(`Are you sure you want to delete article "${title}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/articles/${articleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(articles.filter(a => a._id !== articleId));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete article');
    }
  };

  const handleToggleArticleStatus = async (articleId, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/articles/${articleId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setArticles(articles.map(a => a._id === articleId ? { ...a, status: newStatus } : a));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update article status');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredArticles = articles.filter(a => {
    const matchesSearch = a.title?.toLowerCase().includes(articleSearchQuery.toLowerCase()) ||
                         a.author?.username?.toLowerCase().includes(articleSearchQuery.toLowerCase());
    const matchesStatus = articleStatusFilter === 'all' || a.status === articleStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const sidebarLinks = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
  ];

  const workspaceLinks = [
    { icon: User, label: 'My Profile', path: '/profile' },
    { icon: Library, label: 'My Library', path: '/bookmarks' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: MessageSquare, label: 'Feedback', path: '/feedback' },
    { icon: Shield, label: 'Admin Panel', path: '/admin' },
  ];

  const bottomLinks = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Support', path: '/support' },
  ];

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'editor': return <PenTool className="h-4 w-4 text-purple-500" />;
      case 'contributor': return <Edit className="h-4 w-4 text-blue-500" />;
      default: return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      editor: 'bg-purple-100 text-purple-700 border-purple-200',
      contributor: 'bg-blue-100 text-blue-700 border-blue-200',
      viewer: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${styles[role] || styles.viewer}`}>
        {getRoleIcon(role)}
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 h-full z-40">
        <div className="p-4 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Knowledge Portal</p>
              <p className="text-xs text-gray-500">Internal Wiki</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === link.path
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          ))}

          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Workspace</p>
          </div>

          {workspaceLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === link.path
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100 space-y-1">
          {bottomLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === link.path
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-56 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with Image */}
          <div className="card overflow-hidden mb-8 animate-fade-in-up">
            <div className="h-28 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 relative">
              <div className="absolute inset-0">
                <div className="absolute top-4 left-10 w-12 h-12 bg-white/10 rounded-full animate-float"></div>
                <div className="absolute bottom-4 right-20 w-16 h-16 bg-white/10 rounded-full animate-float animation-delay-200"></div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=150&fit=crop"
                alt="Admin banner"
                className="w-full h-full object-cover opacity-30"
              />
            </div>
            <div className="p-6 -mt-8 relative flex items-end justify-between">
              <div className="flex items-end gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center ring-4 ring-white shadow-lg animate-scale-in">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="mb-2 animate-fade-in-up animation-delay-100">
                  <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-gray-500">Manage users, content, and platform settings</p>
                </div>
              </div>
              <button
                onClick={() => fetchData(true)}
                disabled={refreshing}
                className="btn btn-outline flex items-center gap-2 hover-lift animate-fade-in-right"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex gap-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'users', label: 'User Management' },
                { id: 'articles', label: 'Article Management' },
              ].map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 text-sm font-medium border-b-2 transition-all animate-fade-in-up animation-delay-${index * 100} ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {activeTab === 'overview' && stats && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="card p-5 hover-lift animate-fade-in-up">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.stats.totalUsers}</p>
                      <p className="text-sm text-gray-500">Total Users</p>
                    </div>
                  </div>
                </div>

                <div className="card p-5 hover-lift animate-fade-in-up animation-delay-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.stats.totalArticles}</p>
                      <p className="text-sm text-gray-500">Total Articles</p>
                    </div>
                  </div>
                </div>

                <div className="card p-5 hover-lift animate-fade-in-up animation-delay-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.stats.totalQuestions}</p>
                      <p className="text-sm text-gray-500">Total Questions</p>
                    </div>
                  </div>
                </div>

                <div className="card p-5 hover-lift animate-fade-in-up animation-delay-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.stats.totalQuestions > 0 
                          ? Math.round((stats.stats.solvedQuestions / stats.stats.totalQuestions) * 100) 
                          : 0}%
                      </p>
                      <p className="text-sm text-gray-500">Questions Solved</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Users by Role */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Role</h3>
                  <div className="space-y-4">
                    {[
                      { role: 'admin', count: stats.usersByRole.admins, color: 'bg-yellow-500' },
                      { role: 'editor', count: stats.usersByRole.editors, color: 'bg-purple-500' },
                      { role: 'contributor', count: stats.usersByRole.contributors, color: 'bg-blue-500' },
                      { role: 'viewer', count: stats.usersByRole.viewers, color: 'bg-gray-500' },
                    ].map((item) => (
                      <div key={item.role} className="flex items-center gap-4">
                        <div className="flex items-center gap-2 w-28">
                          {getRoleIcon(item.role)}
                          <span className="text-sm text-gray-600 capitalize">{item.role}s</span>
                        </div>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.color} rounded-full transition-all duration-500`}
                            style={{ width: `${stats.stats.totalUsers > 0 ? (item.count / stats.stats.totalUsers) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-xl">
                      <p className="text-2xl font-bold text-green-700">{stats.stats.publishedArticles}</p>
                      <p className="text-sm text-green-600">Published Articles</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-xl">
                      <p className="text-2xl font-bold text-yellow-700">{stats.stats.draftArticles}</p>
                      <p className="text-sm text-yellow-600">Draft Articles</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <p className="text-2xl font-bold text-blue-700">{stats.stats.solvedQuestions}</p>
                      <p className="text-sm text-blue-600">Solved Questions</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-xl">
                      <p className="text-2xl font-bold text-orange-700">
                        {stats.stats.totalQuestions - stats.stats.solvedQuestions}
                      </p>
                      <p className="text-sm text-orange-600">Open Questions</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
                  <div className="space-y-3">
                    {stats.recentUsers.map((u) => (
                      <div key={u._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {u.username.slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{u.username}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                        </div>
                        {getRoleBadge(u.role)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Articles</h3>
                  <div className="space-y-3">
                    {stats.recentArticles?.slice(0, 5).map((a) => (
                      <Link
                        key={a._id}
                        to={`/wiki/${a.slug}`}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{a.title}</p>
                            <p className="text-xs text-gray-500">by {a.author?.username || 'Unknown'}</p>
                          </div>
                        </div>
                        <span className={`tag ${a.status === 'published' ? 'tag-green' : 'tag-yellow'}`}>
                          {a.status}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contributors and Viewers Lists */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Contributors ({stats.contributorsList?.length || 0})</h3>
                    <PenTool className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {stats.contributorsList?.length > 0 ? stats.contributorsList.map((u) => (
                      <div key={u._id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-700">
                              {u.username.slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{u.username}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )) : (
                      <p className="text-sm text-gray-500 text-center py-4">No contributors yet</p>
                    )}
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Viewers ({stats.viewersList?.length || 0})</h3>
                    <Eye className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {stats.viewersList?.length > 0 ? stats.viewersList.map((u) => (
                      <div key={u._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {u.username.slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{u.username}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )) : (
                      <p className="text-sm text-gray-500 text-center py-4">No viewers yet</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Recently Edited Articles */}
              <div className="card p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recently Edited Articles</h3>
                  <Edit className="h-5 w-5 text-purple-500" />
                </div>
                <div className="space-y-3">
                  {stats.recentlyEditedArticles?.length > 0 ? stats.recentlyEditedArticles.slice(0, 5).map((a) => (
                    <Link
                      key={a._id}
                      to={`/wiki/${a.slug}`}
                      className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                          <Edit className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">{a.title}</p>
                          <p className="text-xs text-gray-500">by {a.author?.username || 'Unknown'} • {a.versions?.length || 0} edits</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(a.updatedAt).toLocaleDateString()}
                      </span>
                    </Link>
                  )) : (
                    <p className="text-sm text-gray-500 text-center py-4">No edited articles yet</p>
                  )}
                </div>
              </div>

              {/* Total Views Card */}
              <div className="card p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center">
                    <Eye className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{stats.stats.totalViews || 0}</p>
                    <p className="text-sm text-gray-500">Total Article Views</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <>
              {/* Search and Filters */}
              <div className="card p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      className="input pl-12"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select
                    className="input w-auto"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admins</option>
                    <option value="editor">Editors</option>
                    <option value="contributor">Contributors</option>
                    <option value="viewer">Viewers</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">User</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Email</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Role</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Joined</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {u.username.slice(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">{u.username}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{u.email}</td>
                        <td className="px-6 py-4">
                          {editingUser === u._id ? (
                            <div className="flex items-center gap-2">
                              <select
                                className="input py-1.5 text-sm"
                                defaultValue={u.role}
                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              >
                                <option value="viewer">Viewer</option>
                                <option value="contributor">Contributor</option>
                                <option value="editor">Editor</option>
                                {user?.role === 'admin' && <option value="admin">Admin</option>}
                              </select>
                              <button
                                onClick={() => setEditingUser(null)}
                                className="p-1.5 text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            getRoleBadge(u.role)
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {user?.role === 'admin' && u._id !== user._id && (
                              <>
                                <button
                                  onClick={() => setEditingUser(u._id)}
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Change Role"
                                >
                                  <UserCheck className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u._id, u.username)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete User"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            {u._id === user._id && (
                              <span className="text-xs text-gray-400 italic">You</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No users found</p>
                  </div>
                )}
              </div>

              {/* Role Permissions Info */}
              <div className="card p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  Role Permissions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900">Viewer</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Read articles</li>
                      <li>• Ask questions</li>
                      <li>• Like & comment</li>
                      <li>• Bookmark content</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Edit className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-gray-900">Contributor</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• All Viewer rights</li>
                      <li>• Create articles</li>
                      <li>• Edit own articles</li>
                      <li>• Delete own articles</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <PenTool className="h-4 w-4 text-purple-500" />
                      <span className="font-medium text-gray-900">Editor</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• All Contributor rights</li>
                      <li>• Edit any article</li>
                      <li>• Delete any article</li>
                      <li>• View admin stats</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium text-gray-900">Admin</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• All Editor rights</li>
                      <li>• Manage users</li>
                      <li>• Change user roles</li>
                      <li>• Delete users</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'articles' && (
            <>
              {/* Search and Filters */}
              <div className="card p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search articles by title or author..."
                      className="input pl-12"
                      value={articleSearchQuery}
                      onChange={(e) => setArticleSearchQuery(e.target.value)}
                    />
                  </div>
                  <select
                    className="input w-auto"
                    value={articleStatusFilter}
                    onChange={(e) => setArticleStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Articles Table */}
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Article</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Author</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Category</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Views</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Created</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredArticles.map((article) => (
                      <tr key={article._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <FileText className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="max-w-xs">
                              <p className="font-medium text-gray-900 truncate">{article.title || 'Untitled'}</p>
                              <p className="text-xs text-gray-500 truncate">/wiki/{article.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">
                                {article.author?.username?.charAt(0).toUpperCase() || '?'}
                              </span>
                            </div>
                            <span className="text-sm text-gray-700">{article.author?.username || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-500">{article.category?.name || 'Uncategorized'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`tag ${article.status === 'published' ? 'tag-green' : 'tag-yellow'}`}>
                            {article.status || 'draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Eye className="h-4 w-4" />
                            {article.views || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/wiki/${article.slug}`}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Article"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/editor/${article._id}`}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit Article"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleToggleArticleStatus(article._id, article.status)}
                              className={`p-2 rounded-lg transition-colors ${
                                article.status === 'published'
                                  ? 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                                  : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                              }`}
                              title={article.status === 'published' ? 'Unpublish' : 'Publish'}
                            >
                              {article.status === 'published' ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(article._id, article.title)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Article"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredArticles.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No articles found</p>
                  </div>
                )}
              </div>

              {/* Article Stats Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="card p-5 bg-gradient-to-br from-green-50 to-green-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-700">
                        {articles.filter(a => a.status === 'published').length}
                      </p>
                      <p className="text-sm text-green-600">Published</p>
                    </div>
                  </div>
                </div>
                <div className="card p-5 bg-gradient-to-br from-yellow-50 to-yellow-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <Edit className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-700">
                        {articles.filter(a => a.status === 'draft').length}
                      </p>
                      <p className="text-sm text-yellow-600">Drafts</p>
                    </div>
                  </div>
                </div>
                <div className="card p-5 bg-gradient-to-br from-blue-50 to-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Eye className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-700">
                        {articles.reduce((sum, a) => sum + (a.views || 0), 0)}
                      </p>
                      <p className="text-sm text-blue-600">Total Views</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
