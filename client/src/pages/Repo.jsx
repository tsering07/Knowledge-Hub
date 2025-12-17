import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
  Upload, FileText, Folder, Download, Trash2, Search, Grid, List,
  File, FileImage, FileVideo, FileArchive, ChevronRight, Eye, Clock, User
} from 'lucide-react';

const Repo = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/upload');
      setFiles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      fetchFiles();
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this file?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/upload/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(files.filter((f) => f._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const getFileIcon = (filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const videoExts = ['mp4', 'webm', 'mov', 'avi'];
    const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz'];
    const docExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];

    if (imageExts.includes(ext)) return { icon: FileImage, color: 'text-purple-600', bg: 'bg-purple-100' };
    if (videoExts.includes(ext)) return { icon: FileVideo, color: 'text-red-600', bg: 'bg-red-100' };
    if (archiveExts.includes(ext)) return { icon: FileArchive, color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (docExts.includes(ext)) return { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' };
    return { icon: File, color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter((file) =>
    file.filename?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">File Repository</h1>
            <p className="text-gray-500 mt-1">Upload and manage your files</p>
          </div>
          {user && (
            <label className="btn btn-primary flex items-center gap-2 cursor-pointer">
              <Upload className="h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload File'}
              <input
                type="file"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
          )}
        </div>

        {/* Search and View Toggle */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                className="input pl-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Files */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="card p-12 text-center">
            <Folder className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Files Found</h2>
            <p className="text-gray-500 mb-6">
              {search ? `No files match "${search}"` : 'Upload your first file to get started'}
            </p>
            {user && (
              <label className="btn btn-primary cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Upload File
                <input type="file" className="hidden" onChange={handleUpload} />
              </label>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredFiles.map((file) => {
              const fileType = getFileIcon(file.filename);
              const FileIcon = fileType.icon;
              return (
                <div key={file._id} className="card card-hover p-5">
                  <div className={`w-12 h-12 ${fileType.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <FileIcon className={`h-6 w-6 ${fileType.color}`} />
                  </div>
                  <h3 className="font-medium text-gray-900 truncate mb-1" title={file.filename}>
                    {file.filename}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {formatFileSize(file.size)}
                  </p>
                  <div className="flex items-center gap-2">
                    <a
                      href={`http://localhost:5000/uploads/${file.filename}`}
                      download
                      className="flex-1 btn btn-outline text-sm py-2 flex items-center justify-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                    {user && (
                      <button
                        onClick={() => handleDelete(file._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">File Name</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-6 py-4 hidden sm:table-cell">Size</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-6 py-4 hidden md:table-cell">Uploaded</th>
                  <th className="text-right text-sm font-medium text-gray-500 px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredFiles.map((file) => {
                  const fileType = getFileIcon(file.filename);
                  const FileIcon = fileType.icon;
                  return (
                    <tr key={file._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${fileType.bg} rounded-lg flex items-center justify-center shrink-0`}>
                            <FileIcon className={`h-5 w-5 ${fileType.color}`} />
                          </div>
                          <span className="font-medium text-gray-900 truncate max-w-xs">
                            {file.filename}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-sm text-gray-500">{formatFileSize(file.size)}</span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-sm text-gray-500">
                          {new Date(file.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`http://localhost:5000/uploads/${file.filename}`}
                            download
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                          {user && (
                            <button
                              onClick={() => handleDelete(file._id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="card p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <File className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{files.length}</p>
                <p className="text-sm text-gray-500">Total Files</p>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileImage className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {files.filter(f => ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(f.filename?.split('.').pop()?.toLowerCase())).length}
                </p>
                <p className="text-sm text-gray-500">Images</p>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {files.filter(f => ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(f.filename?.split('.').pop()?.toLowerCase())).length}
                </p>
                <p className="text-sm text-gray-500">Documents</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Repo;
