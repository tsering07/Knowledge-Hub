import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  User, MessageSquare, ArrowLeft, Check, Clock, Eye, ThumbsUp,
  Share2, Flag, ChevronRight, Send, HelpCircle, CheckCircle, Award
} from 'lucide-react';
import AuthContext from '../context/AuthContext';

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/qa/${id}`);
      setQuestion(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/qa/${id}/answers`,
        { content: newAnswer },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewAnswer('');
      fetchQuestion();
    } catch (error) {
      alert('Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkSolved = async (answerId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/qa/${id}/solve`,
        { answerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchQuestion();
    } catch (error) {
      console.error(error);
    }
  };

  const handleVote = async (answerId, type) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/qa/${id}/answers/${answerId}/vote`,
        { type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchQuestion();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Question Not Found</h2>
          <Link to="/qa" className="text-blue-600 hover:underline">Back to Q&A</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/qa" className="hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Q&A
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 truncate max-w-md">{question.title}</span>
        </div>

        {/* Question */}
        <div className="card p-6 mb-6">
          <div className="flex items-start gap-2 mb-4">
            <h1 className="text-2xl font-bold text-gray-900 flex-1">{question.title}</h1>
            {question.solved && (
              <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                <CheckCircle className="h-4 w-4" />
                Solved
              </span>
            )}
          </div>

          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags.map((tag, i) => (
                <span key={i} className="tag tag-blue">{tag}</span>
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {question.author?.username?.slice(0, 1).toUpperCase()}
                </span>
              </div>
              <span className="font-medium text-gray-900">{question.author?.username}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {new Date(question.createdAt).toLocaleDateString()}
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {question.views || 0} views
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{question.body}</p>
          </div>
        </div>

        {/* Answers */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {question.answers?.length || 0} {question.answers?.length === 1 ? 'Answer' : 'Answers'}
          </h2>

          {question.answers?.length === 0 ? (
            <div className="card p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No Answers Yet</h3>
              <p className="text-gray-500">Be the first to answer this question!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {question.answers.map((answer, index) => (
                <div
                  key={answer._id || index}
                  className={`card p-6 ${answer.isAccepted ? 'border-2 border-green-500' : ''}`}
                >
                  <div className="flex gap-4">
                    {/* Votes */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleVote(answer._id, 'up')}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <ThumbsUp className="h-5 w-5" />
                      </button>
                      <span className="text-lg font-bold text-gray-900">{answer.votes || 0}</span>
                      {answer.isAccepted && (
                        <div className="mt-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-700 whitespace-pre-wrap mb-4">{answer.content}</p>

                      {/* Answer Meta */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">
                              {answer.author?.username?.slice(0, 1).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{answer.author?.username}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500">
                            {new Date(answer.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Accept Button */}
                        {user && question.author?._id === user.id && !question.solved && (
                          <button
                            onClick={() => handleMarkSolved(answer._id)}
                            className="btn btn-outline text-sm py-1.5 flex items-center gap-1"
                          >
                            <Check className="h-4 w-4" />
                            Mark as Answer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Answer Form */}
        {user ? (
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Your Answer</h3>
            <form onSubmit={handleSubmitAnswer}>
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Write your answer here..."
                rows={5}
                className="input resize-none mb-4"
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !newAnswer.trim()}
                  className="btn btn-primary flex items-center gap-2"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Post Answer
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="card p-6 text-center">
            <p className="text-gray-500 mb-4">Sign in to answer this question</p>
            <Link to="/login" className="btn btn-primary">Sign In</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;
