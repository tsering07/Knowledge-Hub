import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Search, FileText, MessageCircle, User, Filter, ChevronRight,
  Clock, Eye, X, ChevronLeft, ChevronDown, File, Grid, List
} from 'lucide-react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [filters, setFilters] = useState({
    type: 'all',
    lastUpdated: 'any',
    author: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:5000/api/articles/search?q=${query}`);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const clearFilters = () => {
    setFilters({ type: 'all', lastUpdated: 'any', author: '' });
  };

  const filteredResults = results.filter(result => {
    if (filters.type !== 'all') {
      // Filter by type if implemented
    }
    return true;
  });

  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const contentTypes = [
    { id: 'all', label: 'All Types', count: results.length },
    { id: 'articles', label: 'Articles', count: results.length },
    { id: 'files', label: 'Files (PDF/Doc)', count: 0 },
    { id: 'discussions', label: 'Discussions', count: 0 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-5 left-20 w-16 h-16 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-5 right-10 w-24 h-24 bg-white/10 rounded-full animate-float animation-delay-200"></div>
          <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-white/5 rounded-full animate-bounce-slow"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
          <div className="text-center mb-6 animate-fade-in-down">
            <h1 className="text-3xl font-bold text-white mb-2">Search Knowledge Base</h1>
            <p className="text-blue-100">Find articles, guides, and documentation</p>
          </div>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto animate-fade-in-up animation-delay-100">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for articles, guides, and docs..."
                className="w-full pl-12 pr-4 py-4 bg-white border-0 rounded-xl shadow-lg outline-none focus:ring-4 focus:ring-white/30 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Search Tips Card */}
              <div className="card overflow-hidden animate-fade-in-left">
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=120&fit=crop"
                  alt="Search tips"
                  className="w-full h-24 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Search Tips</h3>
                  <p className="text-xs text-gray-500">Use quotes for exact phrases</p>
                </div>
              </div>

              <div className="card p-5 animate-fade-in-left animation-delay-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Reset all
                  </button>
                </div>

                {/* Content Type */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Content Type</h4>
                  <div className="space-y-2">
                    {contentTypes.map((type) => (
                      <label
                        key={type.id}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <input
                          type="radio"
                          name="type"
                          value={type.id}
                          checked={filters.type === type.id}
                          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                          className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">{type.label}</span>
                        <span className="text-xs text-gray-400 ml-auto">({type.count})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Last Updated */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Last Updated</h4>
                  <select
                    className="input text-sm"
                    value={filters.lastUpdated}
                    onChange={(e) => setFilters({ ...filters, lastUpdated: e.target.value })}
                  >
                    <option value="any">Any time</option>
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                    <option value="year">Past Year</option>
                  </select>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="tag tag-blue cursor-pointer hover-scale">Project Alpha</span>
                    <span className="tag tag-gray cursor-pointer hover-scale">deployment</span>
                    <span className="tag tag-gray cursor-pointer hover-scale">#engineering</span>
                  </div>
                </div>

                {/* Author */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Author</h4>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Find author..."
                      className="input pl-9 text-sm"
                      value={filters.author}
                      onChange={(e) => setFilters({ ...filters, author: e.target.value })}
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-2 hover-lift p-2 rounded-lg cursor-pointer">
                    <img 
                      src="https://i.pravatar.cc/32?img=5"
                      alt="Sarah Jenkins"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm text-gray-600">Sarah Jenkins</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6 animate-fade-in-up">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Search Results</h1>
                <p className="text-sm text-gray-500">
                  Showing {paginatedResults.length} of {results.length} results for "<span className="font-medium">{query}</span>"
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none">
                  <option>Sort by: Relevance</option>
                  <option>Most Recent</option>
                  <option>Most Viewed</option>
                </select>
                <div className="flex items-center bg-white border border-gray-200 rounded-lg">
                  <button className="p-2 text-blue-600 bg-blue-50">
                    <List className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400">
                    <Grid className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No Results Found</h2>
                <p className="text-gray-500 mb-6">
                  We couldn't find anything matching "{query}". Try different keywords.
                </p>
                <div className="flex justify-center gap-3">
                  <Link to="/wiki" className="btn btn-primary">Browse Wiki</Link>
                  <Link to="/qa" className="btn btn-outline">Ask a Question</Link>
                </div>
              </div>
            ) : (
              <>
                {/* Results List */}
                <div className="space-y-4">
                  {paginatedResults.map((result) => (
                    <Link
                      key={result._id}
                      to={`/wiki/${result.slug}`}
                      className="card card-hover p-5 block"
                    >
                      {/* Breadcrumb */}
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <span>Home</span>
                        <ChevronRight className="h-3 w-3" />
                        <span>{result.category?.name || 'Engineering'}</span>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-gray-600">Docs</span>
                      </div>

                      {/* Title with icon */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 shrink-0 mt-1">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-blue-600 mb-1">
                            {result.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                            <User className="h-3.5 w-3.5" />
                            {result.author?.username || 'Author'}
                            <span>•</span>
                            <Clock className="h-3.5 w-3.5" />
                            Updated {new Date(result.updatedAt).toLocaleDateString()}
                            <span>•</span>
                            <Eye className="h-3.5 w-3.5" />
                            {result.views || 0}
                          </p>

                          {/* Excerpt with highlighted query */}
                          <p className="text-gray-600 text-sm line-clamp-2"
                            dangerouslySetInnerHTML={{
                              __html: result.content?.replace(/<[^>]+>/g, '').substring(0, 200).replace(
                                new RegExp(`(${query})`, 'gi'),
                                '<mark class="bg-yellow-100 text-yellow-800 px-0.5 rounded">$1</mark>'
                              ) + '...'
                            }}
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Showing {(currentPage - 1) * resultsPerPage + 1} to {Math.min(currentPage * resultsPerPage, results.length)} of {results.length} results
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium ${currentPage === page
                              ? 'bg-blue-500 text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                          {page}
                        </button>
                      ))}
                      {totalPages > 5 && <span className="px-2 text-gray-400">...</span>}
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
