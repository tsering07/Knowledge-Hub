import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { 
  Search, LogOut, User, BookOpen, Menu, X, FileText, 
  HelpCircle, FolderOpen, ChevronDown, Bell, Plus,
  Home, Bookmark, Settings, PenSquare, MessageSquare, Heart, ThumbsUp, ThumbsDown, UserCog
} from 'lucide-react';

const MainLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications for all logged-in users
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/notifications/unread-count', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'comment': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'comment_reply': return <MessageSquare className="h-4 w-4 text-indigo-500" />;
      case 'like': return <Heart className="h-4 w-4 text-red-500" />;
      case 'helpful_yes': return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case 'helpful_no': return <ThumbsDown className="h-4 w-4 text-orange-500" />;
      case 'role_change': return <UserCog className="h-4 w-4 text-purple-500" />;
      case 'new_article': return <Bell className="h-4 w-4 text-blue-500" />;
      case 'question_answer': return <MessageSquare className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  // Pages that have their own sidebar and don't need the main header
  const pagesWithSidebar = ['/profile', '/settings', '/analytics', '/feedback', '/support', '/admin'];
  const hideMainLayout = pagesWithSidebar.includes(location.pathname);

  // If page has its own sidebar, just render children without main layout
  if (hideMainLayout) {
    return <>{children}</>;
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  // Navigation links - some require authentication and specific roles
  const publicNavLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/wiki', label: 'Categories', icon: FolderOpen },
  ];

  // My Articles only for users who can create articles (contributor, editor, admin)
  const canCreateArticles = user && ['contributor', 'editor', 'admin'].includes(user.role);
  
  const protectedNavLinks = canCreateArticles
    ? [{ path: '/my-articles', label: 'My Articles', icon: FileText }]
    : [];

  // Combine nav links based on auth status and role
  const navLinks = [...publicNavLinks, ...protectedNavLinks];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-14 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 hidden sm:block">Knowledge Hub</span>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  {/* Write Article Button */}
                  {(user.role === 'contributor' || user.role === 'editor') && (
                    <Link
                      to="/wiki/new"
                      className="hidden sm:flex items-center gap-2 px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Write Article
                    </Link>
                  )}

                  {/* Notifications - for all users */}
                  <div className="relative">
                    <button 
                      onClick={() => {
                        setNotificationMenuOpen(!notificationMenuOpen);
                        if (!notificationMenuOpen) fetchNotifications();
                      }}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg relative"
                    >
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>

                    {notificationMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setNotificationMenuOpen(false)} />
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-lg z-20 max-h-96 overflow-hidden">
                          <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                            {unreadCount > 0 && (
                              <button 
                                onClick={markAllAsRead}
                                className="text-xs text-blue-600 hover:text-blue-700"
                              >
                                Mark all as read
                              </button>
                            )}
                          </div>
                          <div className="overflow-y-auto max-h-72">
                            {notifications.length > 0 ? notifications.map((notification) => (
                              <div 
                                key={notification._id}
                                onClick={() => {
                                  if (!notification.read) markAsRead(notification._id);
                                  if (notification.article) {
                                    navigate(`/wiki/${notification.article.slug}`);
                                  } else if (notification.question) {
                                    navigate(`/qa/${notification.question._id}`);
                                  }
                                  setNotificationMenuOpen(false);
                                }}
                                className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex items-start gap-3 ${!notification.read ? 'bg-blue-50' : ''}`}
                              >
                                <div className="mt-0.5">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-800 line-clamp-2">{notification.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {new Date(notification.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                  )}
                                </div>
                              )) : (
                                <div className="p-6 text-center text-gray-500">
                                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                  <p className="text-sm">No notifications yet</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500 hidden sm:block" />
                    </button>

                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-2 z-20">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="font-medium text-gray-900">{user.username}</p>
                            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                          </div>
                          <div className="py-1">
                            <Link
                              to="/profile"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <User className="h-4 w-4" />
                              Profile
                            </Link>
                            {canCreateArticles && (
                              <Link
                                to="/my-articles"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <PenSquare className="h-4 w-4" />
                                My Articles
                              </Link>
                            )}
                            <Link
                              to="/bookmarks"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Bookmark className="h-4 w-4" />
                              Bookmarks
                            </Link>
                            <Link
                              to="/settings"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Settings className="h-4 w-4" />
                              Settings
                            </Link>
                          </div>
                          <div className="border-t border-gray-100 pt-1">
                            <button
                              onClick={() => { logout(); setUserMenuOpen(false); }}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                            >
                              <LogOut className="h-4 w-4" />
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-2">
              <form onSubmit={handleSearch} className="mb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive(path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">© 2024 Knowledge Hub Inc.</p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-700">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-700">Terms of Service</Link>
              <Link to="/help" className="text-sm text-gray-500 hover:text-gray-700">Help Center</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
