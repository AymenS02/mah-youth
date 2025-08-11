// app/pages/dashboard/videos/edit/[id]/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from "/components/header/Header";
import { Video, ArrowLeft, Save, X, Loader } from 'lucide-react';

export default function EditVideo() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [videoNotFound, setVideoNotFound] = useState(false);
  const router = useRouter();
  const params = useParams();
  const videoId = params.id;

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    videoUrl: '',
    description: '',
  });

  const categories = [
    'Aqeedah', 'Fiqh', 'Hadith', 'Quran', 'Seerah', 'Islamic History',
    'Dua & Dhikr', 'Islamic Literature', 'Comparative Religion', 'Other'
  ];

  // Load existing video data
  useEffect(() => {
    const fetchVideoData = async () => {
      if (!videoId) {
        setError('No video ID provided');
        setIsLoadingData(false);
        return;
      }

      try {
        const response = await fetch(`/api/videos/${videoId}`);
        
        if (response.ok) {
          const video = await response.json();
          setFormData({
            title: video.title || '',
            author: video.author || '',
            category: video.category || '',
            videoUrl: video.videoUrl || '',
            description: video.description || '',
          });
        } else if (response.status === 404) {
          setVideoNotFound(true);
        } else {
          const result = await response.json();
          setError(result.error || 'Failed to load video data');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        console.error('Fetch video error:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchVideoData();
  }, [videoId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Get current user
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;

      const submitData = {
        ...formData,
        updatedBy: user?.id || null
      };

      const response = await fetch(`/api/videos/${videoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Video updated successfully! Redirecting...');
        setTimeout(() => {
          router.push('/pages/dashboard/videos');
        }, 2000);
      } else {
        setError(result.error || 'Failed to update video');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Update video error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      router.push('/pages/dashboard/videos');
    }
  };

  // Loading state
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-[200px] max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading video data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Video not found state
  if (videoNotFound) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-[200px] max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Video Not Found</h2>
            <p className="text-gray-600 mb-6">The video you're trying to edit doesn't exist or may have been deleted.</p>
            <button
              onClick={() => router.push('/pages/dashboard/videos')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 font-medium"
            >
              Back to Videos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-[200px] max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => router.push('/pages/dashboard/videos')}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition duration-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Video className="w-8 h-8 mr-3 text-blue-600" />
                Edit Video
              </h1>
              <p className="text-gray-600">Update video information</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-8 py-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    disabled={isLoading}
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    placeholder="Enter video title"
                  />
                </div>

                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    required
                    disabled={isLoading}
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    placeholder="e.g., Dr. Bilal Philips"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    disabled={isLoading}
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL *
                  </label>
                  <input
                    type="url"
                    id="videoUrl"
                    name="videoUrl"
                    required
                    disabled={isLoading}
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  disabled={isLoading}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  placeholder="Enter video description (optional)"
                />
              </div>

              {/* Form Actions */}
              <div className="border-t pt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 font-medium disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Updating Video...' : 'Update Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}