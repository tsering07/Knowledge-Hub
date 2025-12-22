import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
  Home, Search, User, Library, Users, Settings, HelpCircle,
  Bell, Shield, Palette, Link2, Camera, Mail, Phone, MapPin, Hash,
  BookOpen, Save, BarChart3, MessageSquare, ShieldCheck, Upload, CheckCircle
} from 'lucide-react';

const SettingsPage = () => {
  const { user, updateUser } = useContext(AuthContext);
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('profile');
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || null);
  const [uploading, setUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    jobTitle: user?.jobTitle || '',
    bio: user?.bio || '',
    email: user?.email || '',
    phone: user?.phone || '',
    slack: user?.username || '',
    location: user?.location || '',
  });

  // Load user profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const { data } = await axios.get('http://localhost:5000/api/upload/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (data) {
          setProfilePhoto(data.profilePhoto);
          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            jobTitle: data.jobTitle || '',
            bio: data.bio || '',
            email: data.email || '',
            phone: data.phone || '',
            slack: data.username || '',
            location: data.location || '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  // Handle profile photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('http://localhost:5000/api/upload/profile-photo', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setProfilePhoto(data.profilePhoto);
      // Update AuthContext user data
      if (updateUser) {
        updateUser({ profilePhoto: data.profilePhoto });
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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

  const settingsSections = [
    { id: 'profile', label: 'General Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Link2 },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);
    
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/upload/profile', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        jobTitle: formData.jobTitle,
        bio: formData.bio,
        phone: formData.phone,
        location: formData.location,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 h-full z-40">
        {/* Logo */}
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

        {/* Main Nav */}
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

        {/* Bottom Nav */}
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
          {/* Header with Image */}
          <div className="card overflow-hidden mb-8 animate-fade-in-up">
            <div className="h-32 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 relative">
              <div className="absolute inset-0">
                <div className="absolute top-4 left-10 w-12 h-12 bg-white/10 rounded-full animate-float"></div>
                <div className="absolute bottom-4 right-20 w-16 h-16 bg-white/10 rounded-full animate-float animation-delay-200"></div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=150&fit=crop"
                alt="Settings banner"
                className="w-full h-full object-cover opacity-30"
              />
            </div>
            <div className="p-6 -mt-8 relative">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-xl flex items-center justify-center ring-4 ring-white shadow-lg animate-scale-in">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <div className="animate-fade-in-up animation-delay-100">
                  <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                  <p className="text-gray-500">Manage your profile, notifications, and security</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Settings Navigation */}
            <aside className="w-56 shrink-0">
              <nav className="space-y-1 animate-fade-in-left">
                {settingsSections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all hover-lift animation-delay-${index * 100} ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-600 font-medium shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <section.icon className="h-5 w-5" />
                    {section.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Settings Content */}
            <div className="flex-1 animate-fade-in-up animation-delay-200">
              {activeSection === 'profile' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Success Message */}
                  {saveSuccess && (
                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3 border border-green-200">
                      <CheckCircle className="h-5 w-5" />
                      <span>Profile saved successfully!</span>
                    </div>
                  )}

                  {/* Public Profile */}
                  <div className="card p-6 hover-lift">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Public Profile</h2>
                    
                    <div className="flex items-start gap-6 mb-6">
                      <div className="relative group">
                        {profilePhoto ? (
                          <img 
                            src={`http://localhost:5000${profilePhoto}`}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center transition-transform group-hover:scale-105">
                            <span className="text-2xl font-bold text-white">
                              {(formData.firstName?.charAt(0) || user?.username?.charAt(0) || 'U').toUpperCase()}{(formData.lastName?.charAt(0) || user?.username?.charAt(1) || '').toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div 
                          className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {uploading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Camera className="h-6 w-6 text-white" />
                          )}
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </div>
                      <div>
                        <button 
                          type="button" 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="text-blue-600 hover:underline text-sm font-medium disabled:opacity-50"
                        >
                          {uploading ? 'Uploading...' : 'Change Avatar'}
                        </button>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG max 2MB</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Enter your first name"
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Enter your last name"
                          className="input"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                      <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        placeholder="e.g. Software Engineer, Product Manager"
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        maxLength={260}
                        placeholder="Tell us about yourself..."
                        className="input resize-none"
                      />
                      <p className="text-right text-sm text-gray-400 mt-1">
                        {260 - (formData.bio?.length || 0)} characters left
                      </p>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="card p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h2>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@company.com"
                            className="input pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 123-4567"
                            className="input pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Slack Handle</label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="slack"
                            value={formData.slack}
                            onChange={handleChange}
                            placeholder="username"
                            className="input pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="City, Country"
                            className="input pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="card p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Preferences</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Email Notifications</p>
                          <p className="text-sm text-gray-500">Receive email updates about your activity</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Weekly Digest</p>
                          <p className="text-sm text-gray-500">Get a summary of activity every week</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Show Profile Publicly</p>
                          <p className="text-sm text-gray-500">Allow other users to see your profile</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {activeSection === 'notifications' && (
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                  <div className="space-y-4">
                    {['New article in your department', 'Comments on your articles', 'Answers to your questions', 'Mentions', 'System updates'].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <span className="text-gray-700">{item}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={i < 3} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'security' && (
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Change Password</h3>
                      <p className="text-sm text-gray-500 mb-4">Update your password to keep your account secure</p>
                      <div className="space-y-3 max-w-md">
                        <input type="password" placeholder="Current password" className="input" />
                        <input type="password" placeholder="New password" className="input" />
                        <input type="password" placeholder="Confirm new password" className="input" />
                      </div>
                      <button className="btn btn-primary mt-4">Update Password</button>
                    </div>
                    <hr />
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500 mb-4">Add an extra layer of security to your account</p>
                      <button className="btn btn-outline">Enable 2FA</button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'appearance' && (
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Appearance</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">Theme</h3>
                      <div className="flex gap-4">
                        <button className="flex-1 p-4 border-2 border-blue-500 rounded-xl bg-white">
                          <div className="w-full h-20 bg-gray-100 rounded-lg mb-2"></div>
                          <p className="text-sm font-medium text-gray-900">Light</p>
                        </button>
                        <button className="flex-1 p-4 border border-gray-200 rounded-xl bg-white hover:border-gray-300">
                          <div className="w-full h-20 bg-gray-800 rounded-lg mb-2"></div>
                          <p className="text-sm font-medium text-gray-900">Dark</p>
                        </button>
                        <button className="flex-1 p-4 border border-gray-200 rounded-xl bg-white hover:border-gray-300">
                          <div className="w-full h-20 bg-gradient-to-b from-gray-100 to-gray-800 rounded-lg mb-2"></div>
                          <p className="text-sm font-medium text-gray-900">System</p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'integrations' && (
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Integrations</h2>
                  <div className="space-y-4">
                    {[
                      { name: 'Slack', desc: 'Get notifications in Slack', connected: true },
                      { name: 'Google Drive', desc: 'Import files from Drive', connected: false },
                      { name: 'Notion', desc: 'Sync with Notion workspace', connected: false },
                      { name: 'GitHub', desc: 'Link code repositories', connected: true },
                    ].map((integration, i) => (
                      <div key={i} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900">{integration.name}</p>
                          <p className="text-sm text-gray-500">{integration.desc}</p>
                        </div>
                        <button className={`btn ${integration.connected ? 'btn-outline' : 'btn-primary'}`}>
                          {integration.connected ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
