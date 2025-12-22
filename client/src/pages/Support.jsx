import { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
  Home, Search, User, Library, Users, Settings, HelpCircle,
  BookOpen, MessageSquare, Mail, Phone, Clock, ChevronRight,
  FileText, Video, Book, ExternalLink, Send, CheckCircle,
  BarChart3, Zap, Shield, Globe, Headphones, ShieldCheck
} from 'lucide-react';

const Support = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [contactForm, setContactForm] = useState({
    name: user?.username || '',
    email: user?.email || '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const sidebarLinks = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
  ];

  const allWorkspaceLinks = [
    { icon: User, label: 'My Profile', path: '/profile' },
    { icon: Library, label: 'My Library', path: '/bookmarks' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', hideForViewer: true },
    { icon: MessageSquare, label: 'Feedback', path: '/feedback' },
    { icon: Users, label: 'Team Directory', path: '/wiki', hideForViewer: true },
    { icon: ShieldCheck, label: 'Admin Panel', path: '/admin', adminOnly: true },
  ];
  
  const workspaceLinks = allWorkspaceLinks.filter(link => {
    if (link.adminOnly && user?.role !== 'admin' && user?.role !== 'editor') return false;
    if (link.hideForViewer && user?.role === 'viewer') return false;
    return true;
  });

  const bottomLinks = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Support', path: '/support' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitting(false);
    setSubmitted(true);
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const faqs = [
    {
      question: 'How do I create a new article?',
      answer: 'Navigate to "My Articles" and click the "New Article" button. You can use the rich text editor to format your content, add images, and organize with categories and tags.'
    },
    {
      question: 'How do I search for specific content?',
      answer: 'Use the search bar at the top of any page or go to the Search page. You can search by keywords, and results will include articles and Q&A posts.'
    },
    {
      question: 'How do I bookmark an article?',
      answer: 'Click the bookmark icon on any article card or within the article view. Bookmarked articles appear in your "My Library" section for quick access.'
    },
    {
      question: 'How do I ask a question in Q&A?',
      answer: 'Go to the Q&A section and click "Ask Question". Provide a clear title, detailed description, and relevant tags to get better answers.'
    },
    {
      question: 'How can I track my content performance?',
      answer: 'Visit the Analytics page from your profile sidebar. You\'ll see views, engagement rates, popular topics, and your top-performing articles.'
    },
    {
      question: 'How do I change my account settings?',
      answer: 'Click on your profile picture and select "Settings", or navigate directly to /settings. You can update your profile, notifications, security, and appearance preferences.'
    }
  ];

  const resources = [
    {
      icon: Book,
      title: 'Documentation',
      description: 'Comprehensive guides and tutorials',
      link: '/wiki',
      color: 'blue'
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Step-by-step video walkthroughs',
      link: '#',
      color: 'purple'
    },
    {
      icon: MessageSquare,
      title: 'Community Q&A',
      description: 'Ask questions, get answers',
      link: '/qa',
      color: 'green'
    },
    {
      icon: FileText,
      title: 'Release Notes',
      description: 'Latest updates and changes',
      link: '#',
      color: 'orange'
    }
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'support@knowledgeportal.com',
      action: 'Send Email',
      color: 'blue'
    },
    {
      icon: Headphones,
      title: 'Live Chat',
      description: 'Available 9 AM - 6 PM EST',
      action: 'Start Chat',
      color: 'green'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: '+1 (555) 123-4567',
      action: 'Call Now',
      color: 'purple'
    }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 h-full z-40">
        <div className="p-4 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Knowledge Portal</p>
              <p className="text-xs text-gray-500">Internal Wiki</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === link.path
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          ))}

          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Workspace</p>
          </div>

          {workspaceLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === link.path
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100 space-y-1">
          {bottomLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === link.path
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-56 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <HelpCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">How can we help you?</h1>
            <p className="text-gray-500 max-w-lg mx-auto">
              Find answers to common questions, browse our documentation, or reach out to our support team.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-4 gap-4 mb-12">
            {resources.map((resource, i) => (
              <Link
                key={i}
                to={resource.link}
                className="card p-5 hover:shadow-md transition-shadow group"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                  resource.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  resource.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                  resource.color === 'green' ? 'bg-green-100 text-green-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  <resource.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-500">{resource.description}</p>
              </Link>
            ))}
          </div>

          {/* FAQs */}
          <div className="card p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="p-4 text-gray-600">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="grid grid-cols-2 gap-8">
            {/* Contact Methods */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-4">
                {contactMethods.map((method, i) => (
                  <div key={i} className="card p-4 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      method.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      method.color === 'green' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      <method.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{method.title}</h3>
                      <p className="text-sm text-gray-500">{method.description}</p>
                    </div>
                    <button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      {method.action}
                    </button>
                  </div>
                ))}
              </div>

              {/* Support Hours */}
              <div className="card p-5 mt-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  Support Hours
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="text-gray-900 font-medium">9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="text-gray-900 font-medium">10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="text-gray-500">Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 mb-4">We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-blue-600 hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="account">Account Issues</option>
                      <option value="feedback">Feedback</option>
                      <option value="bug">Report a Bug</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Describe your issue or question..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn btn-primary flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              Need immediate assistance? Check our{' '}
              <Link to="/qa" className="text-blue-600 hover:underline">Q&A section</Link>
              {' '}or browse the{' '}
              <Link to="/wiki" className="text-blue-600 hover:underline">documentation</Link>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Support;
