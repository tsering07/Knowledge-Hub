import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ChevronRight, Clock, Eye, User, Tag, Bookmark, Share2, Printer,
  Edit, CheckCircle, FileText, MessageCircle, Heart, Send, ThumbsUp,
  ThumbsDown, Download, Link as LinkIcon, AlertCircle, Trash2
} from 'lucide-react';
import AuthContext from '../context/AuthContext';

const ArticleView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [helpfulFeedback, setHelpfulFeedback] = useState(null); // 'yes', 'no', or null
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // Include token for internal/private articles
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        
        const { data } = await axios.get(`http://localhost:5000/api/articles/${slug}`, config);
        setArticle(data);
        setLikesCount(data.likes?.length || 0);
        setLiked(data.likes?.includes(user?._id));
        setBookmarked(data.bookmarks?.includes(user?._id));
        setComments(data.comments || []);

        // Fetch related articles
        const allArticles = await axios.get('http://localhost:5000/api/articles', config);
        setRelatedArticles(
          allArticles.data
            .filter(a => a._id !== data._id && a.category?._id === data.category?._id)
            .slice(0, 3)
        );
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug, user]);

  const handleLike = async () => {
    if (!user) return alert('Please login to like');
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`http://localhost:5000/api/articles/${article._id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLiked(data.liked);
      setLikesCount(data.likes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBookmark = async () => {
    if (!user) return alert('Please login to bookmark');
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`http://localhost:5000/api/articles/${article._id}/bookmark`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarked(data.bookmarked);
    } catch (error) {
      console.error(error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to comment');
    if (!comment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`http://localhost:5000/api/articles/${article._id}/comments`,
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(data);
      setComment('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleHelpfulFeedback = async (helpful) => {
    if (!user) return alert('Please login to provide feedback');
    if (helpfulFeedback !== null) return; // Already submitted
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/articles/${article._id}/helpful`,
        { helpful },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHelpfulFeedback(helpful ? 'yes' : 'no');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/articles/${article._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Article deleted successfully');
      navigate('/wiki');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to delete article');
    }
  };

  // Check if user can delete this article
  const canDelete = user && (
    user.role === 'admin' || 
    (user.role === 'contributor' && article?.author?._id === user._id)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Article Not Found</h2>
          <p className="text-gray-500 mb-6">The article you're looking for doesn't exist.</p>
          <Link to="/wiki" className="btn btn-primary">Back to Wiki</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/wiki" className="hover:text-blue-600">{article.category?.name || 'Wiki'}</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 truncate max-w-xs">{article.title}</span>
        </nav>

        <div className="flex gap-8">
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Article Header */}
            <div className="mb-6">
              {/* Verified Badge */}
              {article.isVerified && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full mb-4">
                  <CheckCircle className="h-4 w-4" />
                  Verified Guide
                </div>
              )}
              <span className="text-sm text-gray-500 ml-3">5 min read</span>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 mb-4">
                {article.title}
              </h1>

              {/* Author & Meta */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-medium">
                    {article.author?.username?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{article.author?.username || 'Author'}</p>
                    <p className="text-sm text-gray-500">Senior IT Support • Updated {new Date(article.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 ml-auto">
                  {/* Edit Button - Show for admin/editor OR if user is the author */}
                  {user && (
                    ['admin', 'editor'].includes(user.role) || 
                    (user.role === 'contributor' && article.author?._id === user._id)
                  ) && (
                    <Link
                      to={`/editor/${article._id}`}
                      className="flex items-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Edit Article"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="text-sm font-medium">Edit</span>
                    </Link>
                  )}
                  {/* Delete Button - Show for admin OR contributor who owns the article */}
                  {canDelete && (
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete Article"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="text-sm font-medium">Delete</span>
                    </button>
                  )}
                  <button
                    onClick={handleBookmark}
                    className={`p-2 rounded-lg transition-colors ${bookmarked ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                    title="Bookmark"
                  >
                    <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg" title="Share">
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button onClick={() => window.print()} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg" title="Print">
                    <Printer className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            {article.coverImage && (
              <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={`http://localhost:5000${article.coverImage}`}
                  alt={article.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
              </div>
            )}

            {/* Attached Resources - PDF/Documents shown prominently */}
            {article.attachments && article.attachments.filter(a => !a.mimetype?.startsWith('image/')).length > 0 && (
              <div className="card p-5 mb-8 bg-gradient-to-r from-red-50 to-pink-50 border border-red-100">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-xl">📎</span>
                  Attached Resources
                </h3>
                <div className="space-y-3">
                  {article.attachments.filter(a => !a.mimetype?.startsWith('image/')).map((file, index) => {
                    const isPdf = file.mimetype === 'application/pdf';
                    const fileSize = file.size ? (file.size / 1024 < 1024 
                      ? `${(file.size / 1024).toFixed(1)} KB` 
                      : `${(file.size / 1024 / 1024).toFixed(1)} MB`) : '';
                    
                    return (
                      <a
                        key={index}
                        href={`http://localhost:5000${file.path}`}
                        download={file.originalName}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-md transition-all group"
                      >
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                          <Download className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 group-hover:text-red-600 transition-colors truncate">
                            {file.originalName}
                          </p>
                          <p className="text-sm text-gray-500">{isPdf ? 'PDF' : 'Document'}, {fileSize}</p>
                        </div>
                        <div className="shrink-0 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-sm font-medium group-hover:bg-red-500 group-hover:text-white transition-colors">
                          Download
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description Box */}
            {article.description && (
              <div className="callout callout-info mb-8">
                <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm">{article.description}</p>
              </div>
            )}

            {/* Article Content */}
            <article className="card p-6 md:p-8 mb-8">
              <div className="prose-article" dangerouslySetInnerHTML={{ __html: article.content }} />

              {/* Image Attachments - Show inline */}
              {article.attachments && article.attachments.filter(a => a.mimetype?.startsWith('image/')).length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Images</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {article.attachments.filter(a => a.mimetype?.startsWith('image/')).map((file, index) => (
                      <a
                        key={index}
                        href={`http://localhost:5000${file.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg overflow-hidden border border-gray-200 hover:border-blue-300 transition-colors"
                      >
                        <img
                          src={`http://localhost:5000${file.path}`}
                          alt={file.originalName}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-2 bg-gray-50 text-xs text-gray-500 truncate">
                          {file.originalName}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <Link
                        key={index}
                        to={`/search?q=${tag}`}
                        className="tag tag-gray hover:tag-blue transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Feedback */}
            <div className="card p-6 mb-8">
              <div className="flex items-center justify-between">
                <p className="text-gray-700">Was this article helpful?</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleHelpfulFeedback(true)}
                    disabled={helpfulFeedback !== null}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      helpfulFeedback === 'yes' 
                        ? 'bg-green-100 text-green-600 cursor-default' 
                        : helpfulFeedback !== null 
                          ? 'bg-gray-50 text-gray-400 cursor-default'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    <ThumbsUp className={`h-4 w-4 ${helpfulFeedback === 'yes' ? 'fill-current' : ''}`} />
                    Yes {likesCount > 0 && `(${likesCount})`}
                  </button>
                  <button 
                    onClick={() => handleHelpfulFeedback(false)}
                    disabled={helpfulFeedback !== null}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      helpfulFeedback === 'no' 
                        ? 'bg-orange-100 text-orange-600 cursor-default' 
                        : helpfulFeedback !== null 
                          ? 'bg-gray-50 text-gray-400 cursor-default'
                          : 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                  >
                    <ThumbsDown className={`h-4 w-4 ${helpfulFeedback === 'no' ? 'fill-current' : ''}`} />
                    No
                  </button>
                </div>
              </div>
              {helpfulFeedback && (
                <p className="text-sm text-gray-500 mt-3">Thank you for your feedback!</p>
              )}
            </div>

            {/* Comments Section */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-gray-400" />
                Comments ({comments.length})
              </h3>

              {user ? (
                <form onSubmit={handleComment} className="mb-6">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="input resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end mt-2">
                        <button type="submit" className="btn btn-primary text-sm">
                          <Send className="h-4 w-4" />
                          Post Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center mb-6">
                  <p className="text-gray-600">
                    <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link> to leave a comment
                  </p>
                </div>
              )}

              {comments.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No comments yet. Be the first!</p>
              ) : (
                <div className="space-y-4">
                  {comments.map((c, idx) => (
                    <div key={idx} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium shrink-0">
                        {c.user?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{c.user?.username || 'User'}</span>
                          <span className="text-sm text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-600">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-20 space-y-6">
              {/* Related Articles - Same Category */}
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Related Articles</h3>
                <div className="space-y-3">
                  {relatedArticles.length > 0 ? (
                    relatedArticles.map((related) => (
                      <Link
                        key={related._id}
                        to={`/wiki/${related.slug}`}
                        className="block p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-colors"
                      >
                        <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 hover:text-blue-600">
                          {related.title}
                        </p>
                        <p className="text-xs text-gray-500">{related.views || 0} views</p>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No related articles found</p>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              {user && (user.role === 'editor' || user._id === article.author?._id) && (
                <Link
                  to={`/wiki/edit/${article._id}`}
                  className="btn btn-outline w-full"
                >
                  <Edit className="h-4 w-4" />
                  Edit Article
                </Link>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ArticleView;
