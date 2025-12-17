import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
  FileText, Plus, Edit, Eye, Clock, Trash2, Search,
  MoreHorizontal, Globe, Lock, Users, Filter
} from 'lucide-react';

const MyArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchMyArticles();
  }, []);

  const fetchMyArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/articles/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(articles.filter(a => a._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'published') return matchesSearch && article.status === 'published';
    if (activeTab === 'drafts') return matchesSearch && article.status === 'draft';
    return matchesSearch;
  });

  const tabs = [
    { id: 'all', label: 'All', count: articles.length },
    { id: 'published', label: 'Published', count: articles.filter(a => a.status === 'published').length },
    { id: 'drafts', label: 'Drafts', count: articles.filter(a => a.status === 'draft').length },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <span className="tag tag-green">Published</span>;
      case 'draft':
        return <span className="tag tag-yellow">Draft</span>;
      default:
        return <span className="tag tag-gray">{status}</span>;
    }
  };

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case 'public':
        return <Globe className="h-4 w-4 text-green-500" />;
      case 'internal':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'private':
        return <Lock className="h-4 w-4 text-gray-500" />;
      default:
        return <Globe className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Articles</h1>
            <p className="text-gray-500 mt-1">Manage your knowledge base contributions</p>
          </div>
          <Link to="/editor" className="btn btn-primary flex items-center gap-2 w-fit">
            <Plus className="h-4 w-4" />
            New Article
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                className="input pl-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="card p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Articles Found</h2>
            <p className="text-gray-500 mb-6">
              {search ? `No articles match "${search}"` : 'Start writing your first article'}
            </p>
            <Link to="/editor" className="btn btn-primary">
              Write Your First Article
            </Link>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">Title</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-6 py-4 hidden md:table-cell">Status</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-6 py-4 hidden lg:table-cell">Category</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-6 py-4 hidden sm:table-cell">Updated</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-6 py-4 hidden md:table-cell">Views</th>
                  <th className="text-right text-sm font-medium text-gray-500 px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredArticles.map((article) => (
                  <tr key={article._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            to={article.status === 'draft' ? `/editor/${article._id}` : `/wiki/${article.slug}`}
                            className="font-medium text-gray-900 hover:text-blue-600 truncate block"
                          >
                            {article.title || 'Untitled'}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            {getVisibilityIcon(article.visibility)}
                            <span className="text-xs text-gray-500 capitalize">{article.visibility || 'public'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      {getStatusBadge(article.status)}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-600">{article.category?.name || 'Uncategorized'}</span>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-500">
                        {new Date(article.updatedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Eye className="h-4 w-4" />
                        {article.views || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/editor/${article._id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(article._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="card p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
                <p className="text-sm text-gray-500">Total Articles</p>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {articles.filter(a => a.status === 'published').length}
                </p>
                <p className="text-sm text-gray-500">Published</p>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {articles.reduce((sum, a) => sum + (a.views || 0), 0)}
                </p>
                <p className="text-sm text-gray-500">Total Views</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyArticles;
