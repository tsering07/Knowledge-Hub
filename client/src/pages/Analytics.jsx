import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
  Home, Search, User, Library, Users, Settings, HelpCircle,
  BookOpen, Eye, Clock, TrendingUp, Share2, Download, Calendar,
  BarChart3, FileText, ArrowUp, ArrowDown, MessageSquare, Heart,
  Bookmark, RefreshCw, ShieldCheck
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const Analytics = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('30');
  const [analyticsData, setAnalyticsData] = useState({
    stats: {
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalBookmarks: 0,
      engagementRate: 0,
      totalArticles: 0,
      publishedArticles: 0
    },
    topArticles: [],
    categoryStats: [],
    dailyViews: []
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchAnalyticsData();
    // Refresh data every 30 seconds for real-time updates
    const interval = setInterval(() => {
      fetchAnalyticsData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [dateRange]);

  const fetchAnalyticsData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`http://localhost:5000/api/articles/analytics?days=${dateRange}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAnalyticsData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    fetchAnalyticsData(true);
  };

  const sidebarLinks = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
  ];

  const allWorkspaceLinks = [
    { icon: User, label: 'My Profile', path: '/profile' },
    { icon: Library, label: 'My Library', path: '/bookmarks' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', hideForViewer: true },
    { icon: MessageSquare, label: 'Feedback', path: '/feedback' },
    { icon: Users, label: 'Team Directory', path: '/wiki', hideForViewer: true },
    { icon: ShieldCheck, label: 'Admin Panel', path: '/admin', adminOnly: true },
  ];
  
  const workspaceLinks = allWorkspaceLinks.filter(link => {
    if (link.adminOnly && user?.role !== 'admin' && user?.role !== 'editor') return false;
    if (link.hideForViewer && user?.role === 'viewer') return false;
    return true;
  });

  const bottomLinks = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Support', path: '/support' },
  ];

  const { stats, topArticles, categoryStats, dailyViews } = analyticsData;
  const maxViews = dailyViews.length > 0 ? Math.max(...dailyViews.map(d => d.views), 1) : 1;

  const categoryColors = ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
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
          {/* User Profile Banner */}
          <div className="card p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{user?.username || 'User'}</h2>
                <p className="text-gray-500">{user?.email}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-lg font-semibold text-blue-600 capitalize">{user?.role || 'Contributor'}</p>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.username ? `${user.username}'s Analytics` : 'Creator Analytics'}
              </h1>
              <p className="text-gray-500 mt-1">Track your content performance, audience engagement, and reach.</p>
              <p className="text-xs text-gray-400 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
                {refreshing && <span className="ml-2 text-blue-500">Refreshing...</span>}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleManualRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg">
                <Calendar className="h-4 w-4 text-gray-500" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="text-sm text-gray-700 bg-transparent outline-none"
                >
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                </select>
              </div>
              <button className="btn btn-primary flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">Total Article Views</span>
                <Eye className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <span className="text-gray-400">{stats.publishedArticles} published articles</span>
              </div>
            </div>
            
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">Total Likes</span>
                <Heart className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalLikes.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <span className="text-gray-400">{stats.totalComments} comments</span>
              </div>
            </div>
            
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">Engagement Rate</span>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.engagementRate}%</p>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <span className="text-gray-400">Likes + Comments / Views</span>
              </div>
            </div>
            
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">Total Bookmarks</span>
                <Bookmark className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalBookmarks.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <span className="text-gray-400">{stats.totalArticles} total articles</span>
              </div>
            </div>
          </div>

          {/* Views Chart */}
          <div className="card p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Views Overview</h2>
                <p className="text-sm text-gray-500">Daily views across all published articles</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Views</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Unique Visitors</span>
                </div>
              </div>
            </div>
            
            {/* Interactive Line/Area Chart */}
            {dailyViews.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dailyViews.map(d => ({
                      ...d,
                      date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                      uniqueVisitors: Math.floor(d.views * 0.7) // Simulated unique visitors
                    }))}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      labelStyle={{ color: '#9CA3AF' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="views"
                      name="Views"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorViews)"
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="uniqueVisitors"
                      name="Unique Visitors"
                      stroke="#10B981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorVisitors)"
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No view data available yet</p>
                  <p className="text-sm">Start publishing articles to see analytics</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-3 gap-6">
            {/* Top Performing Articles */}
            <div className="col-span-2 card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Top Performing Articles</h2>
                <Link to="/my-articles" className="text-sm text-blue-600 hover:underline">View All</Link>
              </div>
              
              {topArticles.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                      <th className="pb-3">Article Title</th>
                      <th className="pb-3">Published</th>
                      <th className="pb-3">Views</th>
                      <th className="pb-3">Engage.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topArticles.slice(0, 5).map((article) => (
                      <tr key={article._id} className="hover:bg-gray-50">
                        <td className="py-4">
                          <Link to={`/wiki/${article.slug}`} className="font-medium text-gray-900 hover:text-blue-600">
                            {article.title}
                          </Link>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {article.category} • {Math.ceil((article.content?.length || 0) / 1000)} min read
                          </p>
                        </td>
                        <td className="py-4 text-sm text-gray-500">
                          {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="py-4 text-sm text-gray-900 font-medium">
                          {(article.views || 0).toLocaleString()}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3 text-red-400" />
                              {article.likes || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3 text-blue-400" />
                              {article.comments || 0}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 text-center text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No articles yet</p>
                  <Link to="/editor" className="text-blue-600 hover:underline text-sm">Write your first article</Link>
                </div>
              )}
            </div>

            {/* Popular Topics */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Topics</h2>
              <div className="space-y-4">
                {categoryStats.length > 0 ? categoryStats.slice(0, 5).map((topic, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">{topic.name}</span>
                      <span className="text-sm font-medium text-gray-900">{topic.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`${categoryColors[i % categoryColors.length]} h-2 rounded-full transition-all`}
                        style={{ width: `${Math.max(topic.percentage, 2)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{topic.views} views • {topic.articles} articles</p>
                  </div>
                )) : (
                  <div className="py-8 text-center text-gray-500">
                    <BarChart3 className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No category data yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
