import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
  Home, Search, User, Library, Users, Settings, HelpCircle,
  FileText, Bookmark, Eye, Edit, MapPin, Calendar, Mail, Hash,
  Building, ChevronRight, List, Grid, BookOpen, BarChart3, MessageSquare
} from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [articles, setArticles] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [stats, setStats] = useState({ articles: 0, saves: 0, views: 0 });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [articlesRes, bookmarksRes] = await Promise.all([
        axios.get('http://localhost:5000/api/articles/my', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/articles/bookmarked', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setArticles(articlesRes.data);
      setBookmarks(bookmarksRes.data);

      const totalViews = articlesRes.data.reduce((sum, a) => sum + (a.views || 0), 0);
      setStats({
        articles: articlesRes.data.length,
        saves: bookmarksRes.data.length,
        views: totalViews
      });
    } catch (error) {
      console.error(error);
    }
  };

  const sidebarLinks = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
  ];

  const workspaceLinks = [
    { icon: User, label: 'My Profile', path: '/profile' },
    { icon: Library, label: 'My Library', path: '/bookmarks' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: MessageSquare, label: 'Feedback', path: '/feedback' },
    { icon: Users, label: 'Team Directory', path: '/wiki' },
  ];

  const bottomLinks = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Support', path: '/support' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'saved', label: 'Saved Articles', count: stats.saves },
    { id: 'contributions', label: 'Contribution History' },
    { id: 'drafts', label: 'Drafts' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 h-full z-40">
        {/* Logo */}
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

        {/* Main Nav */}
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

        {/* Bottom Nav */}
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
          {/* Profile Header Card */}
          <div className="card p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center ring-4 ring-white shadow-lg">
                    <span className="text-3xl font-bold text-white">
                      {user?.username?.slice(0, 2).toUpperCase() || 'JD'}
                    </span>
                  </div>
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user?.username || 'User'}
                  </h1>
                  {user?.jobTitle ? (
                    <p className="text-gray-500">
                      {user.jobTitle}{user?.department ? ` | ${user.department}` : ''}
                    </p>
                  ) : (
                    <p className="text-gray-400 italic text-sm">
                      Add your job title in Settings
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    {user?.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {user.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="btn btn-outline">Message</button>
                <Link to="/settings" className="btn btn-primary">Edit Profile</Link>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{stats.articles}</p>
                  <p className="text-xs text-gray-500">Articles Written</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Bookmark className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{stats.saves}</p>
                  <p className="text-xs text-gray-500">Saved Items</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.views >= 1000 ? `${(stats.views / 1000).toFixed(1)}k` : stats.views}
                  </p>
                  <p className="text-xs text-gray-500">Total Views</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Main Content Area */}
            <div className="flex-1">
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex gap-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                      {tab.count !== undefined && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Recent Saves Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Saves</h2>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <List className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Grid className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {bookmarks.length > 0 ? bookmarks.slice(0, 5).map((item) => (
                    <Link
                      key={item._id}
                      to={`/wiki/${item.slug}`}
                      className="card card-hover p-5 block"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                          <FileText className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                            <Bookmark className="h-4 w-4 text-blue-500 fill-blue-500" />
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Updated {new Date(item.updatedAt).toLocaleDateString()} • By {item.author?.username || 'Author'}
                          </p>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {item.content?.replace(/<[^>]+>/g, '').substring(0, 150)}...
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            {item.tags?.slice(0, 2).map((tag, i) => (
                              <span key={i} className="tag tag-gray">{tag}</span>
                            ))}
                            {item.category && <span className="tag tag-gray">{item.category.name}</span>}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )) : (
                    <div className="card p-8 text-center">
                      <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No saved articles yet</p>
                      <Link to="/wiki" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                        Browse articles
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <aside className="w-72 shrink-0 space-y-6">
              {/* Contact Info */}
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-4">CONTACT INFO</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">{user?.email || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Hash className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Username</p>
                      <p className="text-sm text-gray-900">@{user?.username || 'Not set'}</p>
                    </div>
                  </div>
                  {user?.department && (
                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Department</p>
                        <p className="text-sm text-gray-900">{user.department}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Expertise */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">EXPERTISE</h3>
                  <Link to="/settings" className="text-sm text-blue-600 hover:underline">Edit</Link>
                </div>
                {user?.expertise && user.expertise.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.expertise.map((tag, i) => (
                      <span key={i} className="tag tag-blue"># {tag}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No expertise added yet. Add your skills in Settings.</p>
                )}
              </div>

              {/* Recent Activity */}
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-4">RECENT ACTIVITY</h3>
                <div className="space-y-3">
                  {articles.slice(0, 3).map((article) => (
                    <Link
                      key={article._id}
                      to={`/wiki/${article.slug}`}
                      className="flex items-center gap-3 text-sm hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 truncate">{article.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(article.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                  {articles.length === 0 && (
                    <p className="text-sm text-gray-500">No recent activity</p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
