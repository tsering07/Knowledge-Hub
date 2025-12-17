import { useState, useContext, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import {
  Save, AlertCircle, ArrowLeft, FileText, Tag, Folder, Eye,
  ChevronRight, Upload, X, Globe, Lock, Users, Clock, User
} from 'lucide-react';

const ArticleEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState('published');
  const [visibility, setVisibility] = useState('public');
  const [description, setDescription] = useState('');
  const [autoSaveTime, setAutoSaveTime] = useState(null);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/categories');
        if (data && data.length > 0) {
          setCategories(data);
        } else {
          setError('No categories found. Please contact admin to add categories.');
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setError('Failed to load categories. Make sure the server is running.');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (title) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }, [title]);

  // Auto-save simulation
  useEffect(() => {
    if (title || content) {
      const timer = setTimeout(() => {
        setAutoSaveTime(new Date().toLocaleTimeString());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [title, content]);

  const handleSubmit = async (publishStatus = 'published') => {
    setError('');

    if (!title || !content || !slug || !category) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const articleData = {
        title,
        slug: slug.toLowerCase().replace(/ /g, '-'),
        content,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        category,
        status: publishStatus
      };

      await axios.post('http://localhost:5000/api/articles', articleData, config);
      navigate(publishStatus === 'draft' ? '/my-articles' : '/wiki');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish article');
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <div className="sticky top-14 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-14 flex items-center justify-between">
            {/* Left - Breadcrumb */}
            <div className="flex items-center gap-3">
              <Link
                to="/wiki"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <nav className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <Link to="/wiki" className="hover:text-blue-600">Knowledge Base</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900">New Article</span>
              </nav>
            </div>

            {/* Center - Auto-save status */}
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
              {autoSaveTime && (
                <>
                  <Clock className="h-4 w-4" />
                  Draft saved just now
                </>
              )}
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${preview ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <Eye className="h-4 w-4 inline mr-2" />
                Preview
              </button>
              <button
                onClick={() => handleSubmit('draft')}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Save Draft
              </button>
              <button
                onClick={() => handleSubmit('published')}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center gap-3 border border-red-100">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-8">
          {/* Main Editor */}
          <main className="flex-1 min-w-0">
            {preview ? (
              /* Preview Mode */
              <div className="card p-8">
                <div className="tag tag-blue mb-4">
                  {categories.find(c => c._id === category)?.name || 'Category'}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  {title || 'Untitled Article'}
                </h1>
                <article className="prose-article">
                  <div dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-400">Start writing to see preview...</p>' }} />
                </article>
                {tags && (
                  <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
                    {tags.split(',').filter(t => t.trim()).map((tag, i) => (
                      <span key={i} className="tag tag-gray">#{tag.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Editor Mode */
              <div className="space-y-6">
                {/* Title Input */}
                <div className="card p-6">
                  <input
                    type="text"
                    placeholder="Getting Started with Microservices"
                    className="w-full text-2xl font-bold text-gray-900 placeholder:text-gray-300 outline-none border-none bg-transparent"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Content Editor */}
                <div className="card overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    placeholder="Start writing your article content here..."
                    className="bg-white"
                  />
                </div>

                {/* Note callout example */}
                <div className="callout callout-info">
                  <AlertCircle className="h-5 w-5 text-blue-500 shrink-0" />
                  <p className="text-sm">
                    <strong>Tip:</strong> Moving from a monolith to microservices increases complexity in deployment and monitoring.
                  </p>
                </div>
              </div>
            )}
          </main>

          {/* Right Sidebar - Publish Settings */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-36 space-y-6">
              {/* Publish Settings */}
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Publish Settings</h3>

                {/* Visibility */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Visibility</label>
                  <div className="space-y-2">
                    {[
                      { id: 'public', icon: Globe, label: 'Public', desc: 'Visible to everyone' },
                      { id: 'internal', icon: Users, label: 'Internal', desc: 'Only logged in employees' },
                      { id: 'private', icon: Lock, label: 'Private', desc: 'Only you via link' },
                    ].map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${visibility === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        <input
                          type="radio"
                          name="visibility"
                          value={option.id}
                          checked={visibility === option.id}
                          onChange={(e) => setVisibility(e.target.value)}
                          className="sr-only"
                        />
                        <option.icon className={`h-5 w-5 mt-0.5 ${visibility === option.id ? 'text-blue-500' : 'text-gray-400'}`} />
                        <div>
                          <p className="font-medium text-gray-900">{option.label}</p>
                          <p className="text-sm text-gray-500">{option.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 py-4 border-t border-gray-100">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Author</p>
                    <p className="font-medium text-gray-900">{user?.username || 'User'}</p>
                  </div>
                </div>
              </div>

              {/* Organization */}
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Organization</h3>

                {/* Category */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                  <select
                    className="input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Tags</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="microservices, architecture"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                  <p className="text-xs text-gray-400 mt-1">Add a tag...</p>
                  {tags && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.split(',').filter(t => t.trim()).map((tag, i) => (
                        <span key={i} className="tag tag-blue">{tag.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Short Description */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Short Description / Excerpt</label>
                  <textarea
                    className="input resize-none"
                    rows={3}
                    placeholder="Write a brief summary for search results..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">{description.length} characters left</p>
                </div>
              </div>

              {/* Attachments */}
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Attachments</h3>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-blue-600 font-medium">Click to upload</p>
                  <p className="text-xs text-gray-400">or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, DOCX, JPG (MAX. 10MB)</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;
