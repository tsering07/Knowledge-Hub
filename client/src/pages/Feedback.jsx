import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
  Home, Search, User, Library, Users, Settings, HelpCircle,
  BookOpen, MessageSquare, Download, Plus, Filter,
  Clock, MoreVertical, CheckCircle, AlertCircle,
  BarChart3, X, RefreshCw, Eye, ExternalLink, Send, Reply, ShieldCheck
} from 'lucide-react';

const Feedback = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const itemsPerPage = 5;

  // Answer modal state
  const [answerModal, setAnswerModal] = useState({ open: false, question: null });
  const [answerContent, setAnswerContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Stats calculated from real data
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolvedToday: 0,
    avgResponseTime: '0h 0m'
  });

  useEffect(() => {
    fetchFeedbackData();
    // Real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchFeedbackData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchFeedbackData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const token = localStorage.getItem('token');
      
      // Fetch questions as feedback items
      const { data: questions } = await axios.get('http://localhost:5000/api/qa', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      // Transform questions into feedback format
      const feedbackItems = questions.map((q) => ({
        _id: q._id,
        user: {
          name: q.author?.username || 'Anonymous',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(q.author?.username || 'A')}&background=3b82f6&color=fff`
        },
        title: q.title,
        message: q.body || q.title,
        tags: q.tags || [],
        category: getCategoryFromTags(q.tags),
        context: q.title?.substring(0, 25) + (q.title?.length > 25 ? '...' : '') || 'General',
        priority: getPriorityFromQuestion(q),
        status: getStatusFromQuestion(q),
        views: q.views || 0,
        answersCount: q.answers?.length || 0,
        solved: q.solved || false,
        createdAt: q.createdAt
      }));

      setFeedbackList(feedbackItems);
      setLastUpdated(new Date());

      // Calculate stats from real data
      const total = feedbackItems.length;
      const pending = feedbackItems.filter(f => f.status === 'New' || f.status === 'In Progress').length;
      const today = new Date().toDateString();
      const resolvedToday = feedbackItems.filter(f => 
        f.solved && new Date(f.createdAt).toDateString() === today
      ).length;
      
      // Calculate average response time from answered questions
      const answeredQuestions = feedbackItems.filter(f => f.answersCount > 0);
      let avgHours = 0;
      if (answeredQuestions.length > 0) {
        // Estimate based on question age and answer count
        avgHours = Math.floor(answeredQuestions.reduce((sum, q) => {
          const ageHours = (Date.now() - new Date(q.createdAt).getTime()) / (1000 * 60 * 60);
          return sum + (ageHours / Math.max(q.answersCount, 1));
        }, 0) / answeredQuestions.length);
      }

      setStats({
        total,
        pending,
        resolvedToday,
        avgResponseTime: avgHours > 0 ? `${Math.floor(avgHours)}h ${Math.floor((avgHours % 1) * 60)}m` : 'N/A'
      });
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getCategoryFromTags = (tags) => {
    if (!tags || tags.length === 0) return 'General';
    const tag = tags[0]?.toLowerCase() || '';
    if (tag.includes('bug') || tag.includes('error') || tag.includes('issue')) return 'Bug';
    if (tag.includes('feature') || tag.includes('request')) return 'Feature';
    if (tag.includes('ux') || tag.includes('ui') || tag.includes('design')) return 'UX Issue';
    if (tag.includes('doc') || tag.includes('help') || tag.includes('guide')) return 'Documentation';
    if (tag.includes('praise') || tag.includes('thanks')) return 'Praise';
    return 'General';
  };

  const getPriorityFromQuestion = (question) => {
    // Higher priority for unanswered questions with more views
    if (question.answers?.length === 0) {
      if (question.views > 10) return 'High';
      if (question.views > 5) return 'Medium';
    }
    if (question.solved) return 'Low';
    return 'Medium';
  };

  const getStatusFromQuestion = (question) => {
    if (question.solved) return 'Resolved';
    if (question.answers?.length > 0) return 'In Progress';
    const hoursOld = (Date.now() - new Date(question.createdAt).getTime()) / (1000 * 60 * 60);
    if (hoursOld < 24) return 'New';
    return 'In Progress';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Documentation': 'bg-orange-100 text-orange-700',
      'UX Issue': 'bg-purple-100 text-purple-700',
      'Bug': 'bg-red-100 text-red-700',
      'Praise': 'bg-green-100 text-green-700',
      'Feature': 'bg-blue-100 text-blue-700',
      'General': 'bg-gray-100 text-gray-700'
    };
    return colors[category] || colors['General'];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'New':
        return <span className="flex items-center gap-1 text-blue-600"><AlertCircle className="h-3 w-3" /> New</span>;
      case 'In Progress':
        return <span className="flex items-center gap-1 text-yellow-600"><Clock className="h-3 w-3" /> In Progress</span>;
      case 'Resolved':
        return <span className="flex items-center gap-1 text-green-600"><CheckCircle className="h-3 w-3" /> Resolved</span>;
      default:
        return status;
    }
  };

  const getPriorityDot = (priority) => {
    const colors = {
      'High': 'bg-red-500',
      'Medium': 'bg-yellow-500',
      'Low': 'bg-green-500'
    };
    return <span className={`inline-block w-2 h-2 rounded-full ${colors[priority] || 'bg-gray-500'} mr-1`}></span>;
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const handleManualRefresh = () => {
    fetchFeedbackData(true);
  };

  // Open answer modal
  const openAnswerModal = (question) => {
    if (!user) {
      alert('Please login to answer questions');
      navigate('/login');
      return;
    }
    setAnswerModal({ open: true, question });
    setAnswerContent('');
  };

  // Close answer modal
  const closeAnswerModal = () => {
    setAnswerModal({ open: false, question: null });
    setAnswerContent('');
  };

  // Submit answer
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerContent.trim()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/qa/${answerModal.question._id}/answers`,
        { content: answerContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      closeAnswerModal();
      fetchFeedbackData(true); // Refresh to show updated answer count
      alert('Answer submitted successfully!');
    } catch (error) {
      console.error('Failed to submit answer:', error);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Get unique categories for filter
  const uniqueCategories = ['All', ...new Set(feedbackList.map(item => item.category))];

  // Filter feedback
  const filteredFeedback = feedbackList.filter(item => {
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;
    if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
    if (priorityFilter !== 'All' && item.priority !== priorityFilter) return false;
    if (searchQuery && !item.message.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage);
  const paginatedFeedback = filteredFeedback.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feedback...</p>
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
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Feedback Inbox</h1>
              <p className="text-gray-500 mt-1">Manage and respond to user questions and issues.</p>
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
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
                <Download className="h-4 w-4" />
                Export
              </button>
              <Link to="/qa" className="btn btn-primary flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ask Question
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Total Questions</span>
                <MessageSquare className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.total.toLocaleString()}</p>
              <span className="text-xs text-gray-400">All time</span>
            </div>
            
            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Pending Review</span>
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              <span className="text-xs text-orange-500">Needs attention</span>
            </div>
            
            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Resolved Today</span>
                <CheckCircle className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.resolvedToday}</p>
              <span className="text-xs text-green-500">Completed</span>
            </div>
            
            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Avg Response Time</span>
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.avgResponseTime}</p>
              <span className="text-xs text-gray-400">Per question</span>
            </div>
          </div>

          {/* Filters */}
          <div className="card p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by user, keyword, or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">Status: All</option>
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                
                <select
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat === 'All' ? 'Category: All' : cat}</option>
                  ))}
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">Priority: All</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                {(statusFilter !== 'All' || categoryFilter !== 'All' || priorityFilter !== 'All') && (
                  <button 
                    onClick={() => { setStatusFilter('All'); setCategoryFilter('All'); setPriorityFilter('All'); }}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Feedback Table */}
          <div className="card overflow-hidden">
            {paginatedFeedback.length > 0 ? (
              <>
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </th>
                      <th className="px-6 py-3">User & Question</th>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Stats</th>
                      <th className="px-6 py-3">Priority</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedFeedback.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.user.avatar}
                              alt={item.user.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900">{item.user.name}</p>
                              <p className="text-sm text-gray-600 truncate max-w-xs">{item.title}</p>
                              <p className="text-xs text-gray-400">{formatTimeAgo(item.createdAt)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {item.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {item.answersCount}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center text-sm text-gray-700">
                            {getPriorityDot(item.priority)}
                            {item.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {getStatusIcon(item.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => openAnswerModal(item)}
                              className="p-2 hover:bg-green-50 rounded-lg text-green-600"
                              title="Reply to Question"
                            >
                              <Reply className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => navigate(`/qa/${item._id}`)}
                              className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                              title="View Question"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredFeedback.length)} of {filteredFeedback.length} results
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-2 text-sm text-gray-600">
                      Page {currentPage} of {totalPages || 1}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-16 text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No questions found</p>
                <p className="text-sm mt-1">
                  {searchQuery || statusFilter !== 'All' || categoryFilter !== 'All' 
                    ? 'Try adjusting your filters' 
                    : 'Questions from the Q&A section will appear here'}
                </p>
                <Link to="/qa" className="inline-block mt-4 text-blue-600 hover:underline text-sm">
                  Go to Q&A →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Answer Modal */}
      {answerModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Reply className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Reply to Question</h3>
                  <p className="text-sm text-gray-500">Your answer will be visible to everyone</p>
                </div>
              </div>
              <button 
                onClick={closeAnswerModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Question Preview */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-start gap-3">
                <img
                  src={answerModal.question?.user?.avatar}
                  alt={answerModal.question?.user?.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{answerModal.question?.user?.name}</p>
                  <p className="text-sm text-gray-700 font-medium mt-1">{answerModal.question?.title}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">{answerModal.question?.message}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>{formatTimeAgo(answerModal.question?.createdAt)}</span>
                    <span className={`px-2 py-0.5 rounded-full ${getCategoryColor(answerModal.question?.category)}`}>
                      {answerModal.question?.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Answer Form */}
            <form onSubmit={handleSubmitAnswer} className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Answer
              </label>
              <textarea
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="Write your answer here... Be helpful and provide detailed information."
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Markdown formatting is supported. Be respectful and provide accurate information.
              </p>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeAnswerModal}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !answerContent.trim()}
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Answer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
