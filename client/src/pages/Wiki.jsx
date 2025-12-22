import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Folder, FileText, Plus, ChevronRight, Search, Clock, Eye, User,
  Monitor, Users, TrendingUp, Package, Grid, List, Filter,
  Star, ChevronDown, Layers, Code, Database, Shield
} from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Wiki = () => {
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Topics');
  const [browseMode, setBrowseMode] = useState('all'); // 'all', 'popular', 'recent'
  const [sortBy, setSortBy] = useState('relevance');
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    const popularFromUrl = searchParams.get('popular');
    const recentFromUrl = searchParams.get('recent');
    
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      setBrowseMode('all');
    } else if (popularFromUrl === 'true') {
      setBrowseMode('popular');
      setSelectedCategory(null);
    } else if (recentFromUrl === 'true') {
      setBrowseMode('recent');
      setSelectedCategory(null);
    }
  }, [searchParams]);

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
        setCategories(catRes.data);
        setArticles(artRes.data);
      } catch (error) {
        console.error('Error fetching wiki data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter articles based on category, search query, and active tab
  const filteredArticles = articles.filter(article => {
    const matchesCategory = !selectedCategory || article.category?._id === selectedCategory;
    const matchesSearch = !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by active tab
    let matchesTab = true;
    if (activeTab !== 'All Topics') {
      const tabMapping = {
        'API Docs': ['api', 'documentation', 'api docs'],
        'Database': ['database', 'db', 'sql', 'mongodb'],
        'Security': ['security', 'authentication', 'auth']
      };
      const keywords = tabMapping[activeTab] || [];
      matchesTab = keywords.some(keyword => 
        article.title?.toLowerCase().includes(keyword) ||
        article.tags?.some(tag => tag.toLowerCase().includes(keyword)) ||
        article.category?.name?.toLowerCase().includes(keyword)
      );
    }
    
    return matchesCategory && matchesSearch && matchesTab;
  });

  // Sort articles based on browse mode or sort selection
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (browseMode === 'popular' || sortBy === 'views') {
      return (b.views || 0) - (a.views || 0);
    } else if (browseMode === 'recent' || sortBy === 'recent') {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
    return 0; // default order
  });

  const currentCategory = categories.find(c => c._id === selectedCategory);

  const tabs = ['All Topics', 'API Documentation', 'Database', 'Security', 'Deployment'];

  // Get top 3 most viewed articles for Quick Access
  const quickAccessArticles = [...articles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 3);

  // Calculate estimated read time based on content length
  const getReadTime = (content) => {
    if (!content) return '2 min read';
    const text = content.replace(/<[^>]+>/g, '');
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const contributors = [
    { name: 'Sarah Jenkins', articles: 24 },
    { name: 'Mike Chen', articles: 18 },
  ];

  const getCategoryIcon = (name) => {
    const icons = {
      'General': Folder,
      'Engineering': Monitor,
      'Human Resources': Users,
      'Marketing': TrendingUp,
    };
    return icons[name] || Folder;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 shrink-0">
        <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
          {/* Sidebar Header Image */}
          <div className="mb-4 rounded-xl overflow-hidden animate-fade-in-down">
            <img 
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=300&h=100&fit=crop"
              alt="Knowledge library"
              className="w-full h-20 object-cover"
            />
          </div>

          {/* Search in sidebar */}
          <div className="relative mb-6 animate-fade-in-up">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search all topics..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Browse Section */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Browse</h3>
            <nav className="space-y-1">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setBrowseMode('all');
                }}
                className={`sidebar-link w-full hover-lift ${!selectedCategory && browseMode === 'all' ? 'sidebar-link-active' : ''}`}
              >
                <Layers className="h-4 w-4" />
                All Categories
              </button>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setBrowseMode('popular');
                }}
                className={`sidebar-link w-full hover-lift ${browseMode === 'popular' ? 'sidebar-link-active' : ''}`}
              >
                <Star className="h-4 w-4" />
                Most Popular
              </button>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setBrowseMode('recent');
                }}
                className={`sidebar-link w-full hover-lift ${browseMode === 'recent' ? 'sidebar-link-active' : ''}`}
              >
                <Clock className="h-4 w-4" />
                Recently Updated
              </button>
            </nav>
          </div>

          {/* Departments */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Departments</h3>
            <nav className="space-y-1">
              {categories.map((category, index) => {
                const Icon = getCategoryIcon(category.name);
                return (
                  <button
                    key={category._id}
                    onClick={() => {
                      setSelectedCategory(category._id);
                      setBrowseMode('all');
                    }}
                    className={`sidebar-link w-full justify-between hover-lift animate-fade-in-left animation-delay-${index * 100} ${selectedCategory === category._id ? 'sidebar-link-active' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{category.name}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Need Help Card */}
          <div className="bg-gray-50 rounded-xl p-4 mt-auto">
            <p className="text-sm text-gray-600 mb-3">
              Can't find what you're looking for?
            </p>
            <Link to="/qa" className="text-sm text-blue-600 font-medium hover:underline">
              Request Article →
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="h-4 w-4" />
            {currentCategory ? (
              <>
                <Link to="/wiki" className="hover:text-blue-600">Categories</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900">{currentCategory.name}</span>
              </>
            ) : browseMode === 'popular' ? (
              <>
                <Link to="/wiki" className="hover:text-blue-600">Categories</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900">Most Popular</span>
              </>
            ) : browseMode === 'recent' ? (
              <>
                <Link to="/wiki" className="hover:text-blue-600">Categories</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900">Recently Updated</span>
              </>
            ) : (
              <span className="text-gray-900">All Categories</span>
            )}
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {currentCategory ? currentCategory.name : 
               browseMode === 'popular' ? 'Most Popular Articles' :
               browseMode === 'recent' ? 'Recently Updated Articles' :
               'All Categories'}
            </h1>
            <p className="text-gray-500">
              {currentCategory?.description ? currentCategory.description :
               browseMode === 'popular' ? 'Browse the most viewed and popular articles in our knowledge base.' :
               browseMode === 'recent' ? 'See the latest updates and newly published articles.' :
               'Browse all articles across all categories and departments.'}
            </p>
          </div>

          {/* View Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {['All Topics', 'API Docs', 'Database', 'Security'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* View Toggle & Sort */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white border border-gray-200 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              <select 
                className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="recent">Most Recent</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
          </div>

          {/* Topics Count */}
          <p className="text-sm text-gray-500 mb-4">
            TOPICS ({sortedArticles.length})
          </p>

          {/* Articles Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card p-5 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : sortedArticles.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? `No articles match "${searchQuery}"` : 
                 activeTab !== 'All Topics' ? `No articles found in ${activeTab}` :
                 'No articles available in this category yet.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('All Topics');
                  setSelectedCategory(null);
                  setBrowseMode('all');
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedArticles.map((article, index) => {
                const hasPdf = article.attachments?.some(a => a.mimetype === 'application/pdf');
                
                return (
                <Link
                  key={article._id}
                  to={`/wiki/${article.slug}`}
                  className={`card card-hover overflow-hidden hover-lift animate-fade-in-up animation-delay-${(index % 6) * 100}`}
                >
                  {/* Cover Image */}
                  {article.coverImage && (
                    <div className="h-36 overflow-hidden">
                      <img
                        src={`http://localhost:5000${article.coverImage}`}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="tag tag-green">
                        {article.views || 0} Views
                      </span>
                      {hasPdf && (
                        <span className="tag tag-red text-xs">📄 PDF Attached</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p
                      className="text-sm text-gray-500 mb-4 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: article.content?.replace(/<[^>]+>/g, '').substring(0, 100) + '...'
                      }}
                    />
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="h-3.5 w-3.5" />
                      Updated {new Date(article.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              );
              })}

              {/* Add New Topic Card */}
              {user && (user.role === 'contributor' || user.role === 'editor' || user.role === 'admin') && (
                <Link
                  to="/wiki/new"
                  className="card border-dashed border-2 border-gray-300 p-5 flex flex-col items-center justify-center text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all hover-scale animate-fade-in-up"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-3">
                    <Plus className="h-6 w-6 text-blue-500" />
                  </div>
                  <p className="font-medium text-gray-600">Propose New Topic</p>
                  <p className="text-sm text-gray-400">Found a gap in our docs?</p>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {sortedArticles.map((article) => {
                const hasPdf = article.attachments?.some(a => a.mimetype === 'application/pdf');
                
                return (
                <Link
                  key={article._id}
                  to={`/wiki/${article.slug}`}
                  className="card card-hover p-4 flex items-start gap-4"
                >
                  {/* Cover Image or Icon */}
                  {article.coverImage ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={`http://localhost:5000${article.coverImage}`}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="icon-box icon-box-blue shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {article.title}
                      </h3>
                      {hasPdf && (
                        <span className="tag tag-red text-xs">📄 PDF</span>
                      )}
                    </div>
                    <p
                      className="text-sm text-gray-500 line-clamp-1 mb-2"
                      dangerouslySetInnerHTML={{
                        __html: article.content?.replace(/<[^>]+>/g, '').substring(0, 150)
                      }}
                    />
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{article.category?.name}</span>
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
                  <ChevronRight className="h-5 w-5 text-gray-300 shrink-0" />
                </Link>
              );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="hidden xl:block w-72 bg-white border-l border-gray-200 shrink-0">
        <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
          {/* Quick Access */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Access</h3>
            <div className="space-y-3">
              {quickAccessArticles.length > 0 ? (
                quickAccessArticles.map((article) => (
                  <Link
                    key={article._id}
                    to={`/wiki/${article.slug}`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">{article.title}</p>
                    <p className="text-xs text-gray-500">{article.category?.name || 'General'} • {getReadTime(article.content)}</p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-gray-500">No articles available yet</p>
              )}
            </div>
          </div>

          {/* Top Contributors */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Top Contributors</h3>
            <div className="space-y-3">
              {contributors.map((person, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{person.name}</p>
                    <p className="text-xs text-gray-500">{person.articles} articles</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Wiki;
