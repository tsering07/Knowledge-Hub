import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
  Search, MessageCircle, Plus, ThumbsUp, Eye, Clock,
  User, Filter, ChevronRight, TrendingUp, HelpCircle, Award, CheckCircle
} from 'lucide-react';

const QA = () => {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');
  const [showAskModal, setShowAskModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: '', body: '', tags: '' });
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/qa');
      setQuestions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/qa',
        {
          ...newQuestion,
          tags: newQuestion.tags.split(',').map(t => t.trim()).filter(Boolean)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowAskModal(false);
      setNewQuestion({ title: '', body: '', tags: '' });
      fetchQuestions();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'unanswered') return matchesSearch && q.answers.length === 0;
    if (activeTab === 'solved') return matchesSearch && q.solved;
    return matchesSearch;
  });

  const tabs = [
    { id: 'all', label: 'All Questions', count: questions.length },
    { id: 'unanswered', label: 'Unanswered', count: questions.filter(q => q.answers.length === 0).length },
    { id: 'solved', label: 'Solved', count: questions.filter(q => q.solved).length },
  ];

  const topContributors = [
    { name: 'Sarah Jenkins', answers: 45, avatar: 'SJ' },
    { name: 'Mike Chen', answers: 38, avatar: 'MC' },
    { name: 'Alex Rivera', answers: 32, avatar: 'AR' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-20 w-24 h-24 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-float animation-delay-200"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full animate-bounce-slow"></div>
          <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-white/5 rounded-full animate-bounce-slow animation-delay-300"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-pink-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg animate-pulse-glow">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h1 className="text-3xl font-bold">Questions & Answers</h1>
              </div>
              <p className="text-purple-100">Ask questions, share knowledge, help your team succeed</p>
            </div>
            <button
              onClick={() => user ? setShowAskModal(true) : navigate('/login')}
              className="btn bg-white text-purple-600 hover:bg-purple-50 flex items-center gap-2 shadow-lg hover-lift animate-fade-in-right"
            >
              <Plus className="h-4 w-4" />
              Ask Question
            </button>
          </div>

          {/* Search */}
          <div className="mt-8 max-w-2xl animate-fade-in-up animation-delay-200">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-300" />
              <input
                type="text"
                placeholder="Search questions..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-purple-200 outline-none focus:bg-white/20 focus:border-white/40 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg animate-fade-in-up animation-delay-300">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">{questions.length}</p>
              <p className="text-xs text-purple-200">Questions</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-300">{questions.filter(q => q.answers.length > 0).length}</p>
              <p className="text-xs text-purple-200">Answered</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-yellow-300">{questions.filter(q => q.solved).length}</p>
              <p className="text-xs text-purple-200">Solved</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Community Card */}
              <div className="card overflow-hidden animate-fade-in-left">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=150&fit=crop" 
                  alt="Community"
                  className="w-full h-28 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Join the Discussion</h3>
                  <p className="text-xs text-gray-500">Connect with {questions.length}+ questions</p>
                </div>
              </div>

              {/* Popular Tags */}
              <div className="card p-5 animate-fade-in-left animation-delay-100">
                <h3 className="font-semibold text-gray-900 mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="tag tag-purple cursor-pointer hover-scale">api</span>
                  <span className="tag tag-gray cursor-pointer hover-scale">deployment</span>
                  <span className="tag tag-gray cursor-pointer hover-scale">database</span>
                  <span className="tag tag-gray cursor-pointer hover-scale">authentication</span>
                  <span className="tag tag-gray cursor-pointer hover-scale">frontend</span>
                </div>
              </div>

              {/* Top Contributors */}
              <div className="card p-5 animate-fade-in-left animation-delay-200">
                <h3 className="font-semibold text-gray-900 mb-4">Top Contributors</h3>
                <div className="space-y-3">
                  {topContributors.map((contributor, i) => (
                    <div key={i} className={`flex items-center gap-3 hover-lift p-2 rounded-lg cursor-pointer animate-fade-in-up animation-delay-${(i + 1) * 100}`}>
                      <img 
                        src={`https://i.pravatar.cc/32?img=${i + 10}`}
                        alt={contributor.name}
                        className="w-8 h-8 rounded-full ring-2 ring-white shadow-sm"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{contributor.name}</p>
                        <p className="text-xs text-gray-500">{contributor.answers} answers</p>
                      </div>
                      {i === 0 && <Award className="h-4 w-4 text-yellow-500 animate-bounce-slow" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="flex items-center gap-4 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Questions List */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card p-6 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="card p-12 text-center">
                <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">No Questions Found</h2>
                <p className="text-gray-500 mb-6">
                  {search ? `No questions match "${search}"` : 'Be the first to ask a question!'}
                </p>
                <button
                  onClick={() => user ? setShowAskModal(true) : navigate('/login')}
                  className="btn btn-primary"
                >
                  Ask a Question
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuestions.map((question) => (
                  <Link
                    key={question._id}
                    to={`/qa/${question._id}`}
                    className="card card-hover p-5 block"
                  >
                    <div className="flex items-start gap-4">
                      {/* Stats */}
                      <div className="flex flex-col items-center gap-2 text-center shrink-0">
                        <div className={`px-3 py-1 rounded-lg ${
                          question.answers.length > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <p className="text-lg font-bold">{question.answers.length}</p>
                          <p className="text-xs">answers</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {question.votes || 0} votes
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                            {question.title}
                          </h3>
                          {question.solved && (
                            <span className="shrink-0 flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              <CheckCircle className="h-3 w-3" />
                              Solved
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {question.body?.replace(/<[^>]+>/g, '').substring(0, 150)}...
                        </p>

                        {/* Tags */}
                        {question.tags && question.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {question.tags.map((tag, i) => (
                              <span key={i} className="tag tag-blue">{tag}</span>
                            ))}
                          </div>
                        )}

                        {/* Meta */}
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            {question.author?.username || 'Anonymous'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(question.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            {question.views || 0} views
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Ask a Question</h2>
              <p className="text-sm text-gray-500 mt-1">
                Get help from the community by asking a clear, specific question
              </p>
            </div>
            <form onSubmit={handleAskQuestion} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Title
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="What's your question? Be specific."
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Details
                </label>
                <textarea
                  required
                  rows={5}
                  className="input resize-none"
                  placeholder="Include all the information someone would need to answer your question"
                  value={newQuestion.body}
                  onChange={(e) => setNewQuestion({ ...newQuestion, body: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. api, database, deployment"
                  value={newQuestion.tags}
                  onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QA;
