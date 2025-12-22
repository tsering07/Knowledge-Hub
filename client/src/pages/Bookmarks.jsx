import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
  Bookmark, BookmarkX, Search, FileText, Clock, Eye, User,
  Folder, Filter, Grid, List, ChevronRight
} from 'lucide-react';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/articles/bookmarked', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (articleId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/articles/${articleId}/bookmark`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookmarks(bookmarks.filter(b => b._id !== articleId));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(search.toLowerCase())
  );

  // Group bookmarks by category
  const groupedBookmarks = filteredBookmarks.reduce((acc, bookmark) => {
    const category = bookmark.category?.name || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(bookmark);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header with Animation */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-10 right-20 w-32 h-32 bg-white/10 rounded-full animate-float animation-delay-200"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/5 rounded-full animate-bounce-slow"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg animate-bounce-slow">
                  <Bookmark className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">My Bookmarks</h1>
              </div>
              <p className="text-amber-100">
                {bookmarks.length} saved {bookmarks.length === 1 ? 'article' : 'articles'} • Your personal reading list
              </p>
            </div>
            <Link to="/wiki" className="btn bg-white text-orange-600 hover:bg-orange-50 flex items-center gap-2 w-fit animate-fade-in-right shadow-lg hover-lift">
              <FileText className="h-4 w-4" />
              Browse Articles
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Search and View Toggle */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookmarks..."
                className="input pl-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bookmarks */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <div className="card p-12 text-center animate-fade-in-up">
            <div className="relative inline-block mb-6">
              <img 
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200&h=200&fit=crop" 
                alt="Empty bookmarks"
                className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center animate-bounce-slow">
                <Bookmark className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Bookmarks Yet</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {search ? `No bookmarks match "${search}"` : 'Start building your reading list by bookmarking articles you find interesting!'}
            </p>
            <Link to="/wiki" className="btn btn-primary hover-lift">
              Explore Articles
            </Link>
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-6">
            {Object.entries(groupedBookmarks).map(([category, items], catIndex) => (
              <div key={category} className={`animate-fade-in-up animation-delay-${catIndex * 100}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Folder className="h-5 w-5 text-gray-400" />
                  <h2 className="font-semibold text-gray-900">{category}</h2>
                  <span className="text-sm text-gray-500">({items.length})</span>
                </div>
                <div className="space-y-3">
                  {items.map((bookmark, index) => (
                    <div key={bookmark._id} className={`card card-hover p-5 hover-lift animate-fade-in-up animation-delay-${index * 100}`}>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/wiki/${bookmark.slug}`}
                            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {bookmark.title}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {bookmark.content?.replace(/<[^>]+>/g, '').substring(0, 120)}...
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              {bookmark.author?.username}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {new Date(bookmark.updatedAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3.5 w-3.5" />
                              {bookmark.views || 0} views
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveBookmark(bookmark._id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove bookmark"
                        >
                          <BookmarkX className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBookmarks.map((bookmark) => (
              <div key={bookmark._id} className="card card-hover overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-blue-500 to-blue-600 p-4 flex items-end">
                  <span className="tag bg-white/20 text-white border-0">
                    {bookmark.category?.name || 'General'}
                  </span>
                </div>
                <div className="p-5">
                  <Link
                    to={`/wiki/${bookmark.slug}`}
                    className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                  >
                    {bookmark.title}
                  </Link>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {bookmark.content?.replace(/<[^>]+>/g, '').substring(0, 80)}...
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                        {bookmark.author?.username?.slice(0, 1).toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-500">{bookmark.author?.username}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveBookmark(bookmark._id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <BookmarkX className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
