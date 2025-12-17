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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bookmarks</h1>
            <p className="text-gray-500 mt-1">
              {bookmarks.length} saved {bookmarks.length === 1 ? 'article' : 'articles'}
            </p>
          </div>
          <Link to="/wiki" className="btn btn-outline flex items-center gap-2 w-fit">
            <FileText className="h-4 w-4" />
            Browse Articles
          </Link>
        </div>

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
          <div className="card p-12 text-center">
            <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Bookmarks</h2>
            <p className="text-gray-500 mb-6">
              {search ? `No bookmarks match "${search}"` : 'Articles you bookmark will appear here'}
            </p>
            <Link to="/wiki" className="btn btn-primary">
              Explore Articles
            </Link>
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-6">
            {Object.entries(groupedBookmarks).map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <Folder className="h-5 w-5 text-gray-400" />
                  <h2 className="font-semibold text-gray-900">{category}</h2>
                  <span className="text-sm text-gray-500">({items.length})</span>
                </div>
                <div className="space-y-3">
                  {items.map((bookmark) => (
                    <div key={bookmark._id} className="card card-hover p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
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
