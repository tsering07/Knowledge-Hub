import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
  Search, Users, FileText, Monitor, Package, TrendingUp,
  Clock, Eye, ChevronRight, Star, Plus, Bookmark, ArrowRight,
  Folder, HelpCircle, Settings, Zap
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
        const [catRes, artRes] = await Promise.all([
          axios.get('http://localhost:5000/api/categories'),
          axios.get('http://localhost:5000/api/articles')
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            How can we help you today?
          </h1>
          <p className="text-blue-100 mb-8">
            Search our knowledge base for guides, policies, and documentation.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for articles, guides, and docs..."
                className="w-full pl-12 pr-28 py-4 bg-white rounded-xl text-gray-900 placeholder:text-gray-400 outline-none shadow-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
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
            <h2 className="text-lg font-semibold text-gray-900">Knowledge Categories</h2>
            <Link to="/wiki" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((category) => {
              const { icon: Icon, color } = getIconConfig(category.name);
              return (
                <Link
                  key={category._id}
                  to={`/wiki?category=${category._id}`}
                  className="card card-hover p-5"
                >
                  <div className={`icon-box icon-box-${color} mb-3`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {category.description || 'Browse articles'}
                  </p>
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
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900">Popular Now</h2>
              </div>

              <div className="space-y-3">
                {popularArticles.map((article) => (
                  <Link
                    key={article._id}
                    to={`/wiki/${article.slug}`}
                    className="card card-hover p-4 flex items-start gap-4"
                  >
                    <div className="icon-box icon-box-blue shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                        {article.title}
                      </h3>
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
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Updates */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">Recent Updates</h2>
                </div>
                <Link to="/wiki" className="text-sm text-blue-600 hover:underline">View all</Link>
              </div>

              <div className="card divide-y divide-gray-100">
                {recentArticles.map((article) => (
                  <Link
                    key={article._id}
                    to={`/wiki/${article.slug}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                      {article.author?.username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Updated by {article.author?.username} • {new Date(article.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="tag tag-blue text-xs">
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
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-yellow-500" />
                <h3 className="font-semibold text-gray-900">My Shortcuts</h3>
              </div>
              <div className="space-y-2">
                {shortcuts.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                  >
                    <item.icon className="h-4 w-4 text-gray-400" />
                    {item.label}
                  </div>
                ))}
                <button className="flex items-center gap-2 text-sm text-blue-600 mt-3 hover:underline">
                  <Plus className="h-4 w-4" />
                  Add shortcut
                </button>
              </div>
            </div>

            {/* Top Contributors */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-gray-900">Top Contributors</h3>
              </div>
              <div className="space-y-3">
                {topContributors.map((person, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium">
                      {person.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{person.name}</p>
                      <p className="text-xs text-gray-500">{person.articles} articles</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4">
                See all other contributors improving our knowledge base
              </p>
            </div>

            {/* Need Help */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Need Help?</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Can't find what you're looking for? Our support team is here to assist.
              </p>
              <Link
                to="/qa"
                className="btn btn-outline w-full text-sm"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
