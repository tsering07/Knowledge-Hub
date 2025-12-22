import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, User, BookOpen, ArrowRight, Users, FileText, HelpCircle, CheckCircle, Eye, Edit3 } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('viewer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    const result = await register(username, email, password, role);
    setLoading(false);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const features = [
    'Create and share articles',
    'Ask questions and get answers',
    'Bookmark your favorite content',
    'Collaborate with your team'
  ];

  const roleOptions = [
    {
      id: 'viewer',
      title: 'Viewer',
      description: 'Read articles and bookmark content',
      icon: Eye,
      features: ['Read all articles', 'Bookmark favorites', 'Ask questions']
    },
    {
      id: 'contributor',
      title: 'Contributor',
      description: 'Create and publish your own articles',
      icon: Edit3,
      features: ['All Viewer features', 'Write articles', 'Edit your articles']
    }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-40 right-20 w-48 h-48 bg-white/10 rounded-full animate-float animation-delay-200"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full animate-float animation-delay-400"></div>
          <div className="absolute top-1/4 right-1/3 w-16 h-16 bg-white/5 rounded-full animate-bounce-slow"></div>
          <div className="absolute bottom-1/3 left-1/4 w-20 h-20 bg-white/5 rounded-full animate-bounce-slow animation-delay-300"></div>
        </div>

        {/* Decorative Shapes */}
        <div className="absolute top-10 right-10 w-40 h-40 border-4 border-white/10 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 border-4 border-white/10 rounded-xl rotate-45 animate-pulse"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8 animate-fade-in-down">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm animate-pulse-glow">
              <BookOpen className="h-8 w-8" />
            </div>
            <span className="text-2xl font-bold">Knowledge Hub</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 leading-tight animate-fade-in-up">
            Join Your Team's
            <span className="block bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">Knowledge Community</span>
          </h1>
          
          <p className="text-purple-100 text-lg mb-8 leading-relaxed animate-fade-in-up animation-delay-100">
            Create an account to start contributing and accessing your team's shared knowledge.
          </p>

          {/* Illustration */}
          <div className="relative mb-8 animate-fade-in-up animation-delay-200">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop" 
              alt="Team working together"
              className="rounded-2xl shadow-2xl border-4 border-white/20 hover-lift"
            />
            <div className="absolute -top-4 -left-4 bg-white rounded-xl p-3 shadow-lg animate-bounce-slow">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-800 font-medium text-sm">Join 1000+ users</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {features.map((feature, i) => (
              <div key={i} className={`flex items-center gap-3 text-purple-100 animate-fade-in-left animation-delay-${(i + 3) * 100}`}>
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover-scale">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="p-2 bg-blue-500 rounded-xl">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-blue-600">Knowledge Base</span>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-500">Join the knowledge base community</p>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm text-center border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    className="input pl-12"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    className="input pl-12"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    className="input pl-12"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    className="input pl-12"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">I want to join as</label>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setRole(option.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        role === option.id
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          role === option.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <option.icon className="h-4 w-4" />
                        </div>
                        <span className={`font-semibold ${role === option.id ? 'text-blue-700' : 'text-gray-700'}`}>
                          {option.title}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  * Admin can upgrade your role later if needed
                </p>
              </div>
              
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </label>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or sign up with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="btn btn-outline py-2.5 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
                Google
              </button>
              <button className="btn btn-outline py-2.5 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>
          </div>
          
          <p className="text-center mt-6 text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
