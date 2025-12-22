import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
  Search, Users, FileText, Monitor, Package, TrendingUp,
  Clock, Eye, ChevronRight, Star, Plus, Bookmark, ArrowRight,
  Folder, HelpCircle, Settings, Zap, BookOpen, Sparkles, Rocket
} from 'lucide-react';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Include token to fetch internal articles for logged-in users
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        
        const [catRes, artRes] = await Promise.all([
          axios.get('http://localhost:5000/api/categories'),
          axios.get('http://localhost:5000/api/articles', config)
        ]);
        setCategories(catRes.data || []);
        const articles = artRes.data || [];
        setPopularArticles(articles.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5));
        setRecentArticles(articles.slice(0, 5));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const categoryIcons = {
    'General': { icon: Folder, color: 'blue' },
    'Engineering': { icon: Monitor, color: 'purple' },
    'Human Resources': { icon: Users, color: 'green' },
    'Marketing': { icon: TrendingUp, color: 'orange' },
  };

  const getIconConfig = (name) => {
    return categoryIcons[name] || { icon: Folder, color: 'blue' };
  };

  const shortcuts = [
    { label: 'Project Time Documentation', icon: FileText },
    { label: 'Leave Request Form', icon: FileText },
    { label: 'Q4 Objectives (OKRs)', icon: FileText },
  ];

  const topContributors = [
    { name: 'Sarah J.', articles: 24 },
    { name: 'Mike R.', articles: 18 },
    { name: 'Emily K.', articles: 15 },
  ];

  // Feature cards with images
  const featureCards = [
    {
      title: 'Quick Documentation',
      description: 'Find answers instantly with our powerful search',
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop',
      icon: BookOpen,
      color: 'blue'
    },
    {
      title: 'Team Collaboration',
      description: 'Work together to build knowledge',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Stay Updated',
      description: 'Get notified about new articles',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
      icon: Sparkles,
      color: 'green'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float animation-delay-200"></div>
          <div className="absolute top-40 right-1/4 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl animate-float animation-delay-400"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-16 text-center relative z-10">
          {/* Floating icons */}
          <div className="absolute top-8 left-1/4 animate-bounce-slow animation-delay-100">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <BookOpen className="h-6 w-6 text-white/80" />
            </div>
          </div>
          <div className="absolute top-12 right-1/4 animate-bounce-slow animation-delay-300">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Rocket className="h-5 w-5 text-white/80" />
            </div>
          </div>
          
          <div className="animate-fade-in-down">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-6">
              <Sparkles className="h-4 w-4" />
              Welcome to Knowledge Hub
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
            How can we help you today?
          </h1>
          <p className="text-blue-100 mb-8 text-lg animate-fade-in-up animation-delay-100">
            Search our knowledge base for guides, policies, and documentation.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for articles, guides, and docs..."
                  className="w-full pl-14 pr-32 py-5 bg-white rounded-xl text-gray-900 placeholder:text-gray-400 outline-none shadow-2xl transition-all duration-300 focus:ring-4 focus:ring-blue-500/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Quick stats */}
          <div className="flex justify-center gap-8 mt-10 animate-fade-in-up animation-delay-300">
            <div className="text-center">
              <p className="text-3xl font-bold">{popularArticles.length * 20}+</p>
              <p className="text-blue-200 text-sm">Articles</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{categories.length}</p>
              <p className="text-blue-200 text-sm">Categories</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">24/7</p>
              <p className="text-blue-200 text-sm">Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards with Images */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureCards.map((feature, idx) => (
            <div
              key={idx}
              className={`card overflow-hidden hover-lift animate-fade-in-up animation-delay-${(idx + 1) * 100}`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="h-40 overflow-hidden relative">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className={`absolute bottom-3 left-3 w-10 h-10 bg-${feature.color}-500 rounded-lg flex items-center justify-center shadow-lg`}>
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
        </div>

        {/* Knowledge Categories */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Folder className="h-5 w-5 text-blue-500" />
              Knowledge Categories
            </h2>
            <Link to="/wiki" className="text-sm text-blue-600 hover:underline flex items-center gap-1 group">
              View all <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((category, idx) => {
              const { icon: Icon, color } = getIconConfig(category.name);
              return (
                <Link
                  key={category._id}
                  to={`/wiki?category=${category._id}`}
                  className="card card-hover hover-lift p-5 group"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className={`icon-box icon-box-${color} mb-3 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {category.description || 'Browse articles'}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Popular Articles */}
          <div className="lg:col-span-2 space-y-8">
            {/* Popular Now */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Popular Now</h2>
              </div>

              <div className="space-y-3">
                {popularArticles.map((article, idx) => {
                  const hasPdf = article.attachments?.some(a => a.mimetype === 'application/pdf');
                  
                  return (
                  <Link
                    key={article._id}
                    to={`/wiki/${article.slug}`}
                    className="card card-hover hover-lift p-4 flex items-start gap-4 group"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    {/* Cover Image or Icon */}
                    {article.coverImage ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={`http://localhost:5000${article.coverImage}`}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <div className="icon-box icon-box-blue shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <FileText className="h-5 w-5" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {article.title}
                        </h3>
                        {hasPdf && (
                          <span className="tag tag-red text-xs">📄 PDF</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-2"
                        dangerouslySetInnerHTML={{
                          __html: article.content?.replace(/<[^>]+>/g, '').substring(0, 120) + '...'
                        }}
                      />
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          {article.views || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(article.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-300 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </Link>
                );
                })}
              </div>
            </div>

            {/* Recent Updates */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-400 animate-pulse" />
                  <h2 className="text-lg font-semibold text-gray-900">Recent Updates</h2>
                </div>
                <Link to="/wiki" className="text-sm text-blue-600 hover:underline group flex items-center gap-1">
                  View all <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="card divide-y divide-gray-100 overflow-hidden">
                {recentArticles.map((article, idx) => (
                  <Link
                    key={article._id}
                    to={`/wiki/${article.slug}`}
                    className="flex items-center gap-4 p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium shadow-lg transition-transform duration-300 group-hover:scale-110">
                      {article.author?.username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Updated by {article.author?.username} • {new Date(article.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="tag tag-blue text-xs animate-pulse">
                      {article.status === 'published' ? 'New' : article.status}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* My Shortcuts */}
            <div className="card p-5 hover-lift">
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-yellow-500 animate-pulse" />
                <h3 className="font-semibold text-gray-900">My Shortcuts</h3>
              </div>
              <div className="space-y-2">
                {shortcuts.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gradient-to-r hover:from-yellow-50 hover:to-transparent cursor-pointer text-sm text-gray-700 transition-all duration-300 group"
                  >
                    <item.icon className="h-4 w-4 text-gray-400 group-hover:text-yellow-500 transition-colors" />
                    <span className="group-hover:text-gray-900 transition-colors">{item.label}</span>
                  </div>
                ))}
                <button className="flex items-center gap-2 text-sm text-blue-600 mt-3 hover:underline group">
                  <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                  Add shortcut
                </button>
              </div>
            </div>

            {/* Top Contributors */}
            <div className="card p-5 hover-lift">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-gray-900">Top Contributors</h3>
              </div>
              <div className="space-y-3">
                {topContributors.map((person, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300 group cursor-pointer">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md transition-transform duration-300 group-hover:scale-110">
                      {person.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{person.name}</p>
                      <p className="text-xs text-gray-500">{person.articles} articles</p>
                    </div>
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Star className="h-3 w-3 text-yellow-500" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4">
                See all other contributors improving our knowledge base
              </p>
            </div>

            {/* Need Help */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-100 hover-lift relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200/50 to-purple-200/50 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <HelpCircle className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Need Help?</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Can't find what you're looking for? Our support team is here to assist.
                </p>
                <Link
                  to="/qa"
                  className="btn btn-primary w-full text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Zap className="h-4 w-4" />
                  Contact Support
                </Link>
              </div>
            </div>

            {/* Decorative Image Card */}
            <div className="card overflow-hidden hover-lift">
              <div className="h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative">
                <img 
                  src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&h=200&fit=crop" 
                  alt="Office workspace"
                  className="w-full h-full object-cover mix-blend-overlay opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Rocket className="h-8 w-8 mx-auto mb-2 animate-bounce-slow" />
                    <p className="font-semibold">Start Contributing</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600">Share your knowledge with the team</p>
                {user?.role === 'viewer' ? (
                  <button 
                    onClick={() => alert('⚠️ Viewers cannot write articles. Please contact an admin to upgrade your role to Contributor.')}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-2 group cursor-pointer"
                  >
                    Write an article <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <Link to="/editor" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-2 group">
                    Write an article <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
