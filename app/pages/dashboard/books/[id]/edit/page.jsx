// app/pages/dashboard/books/edit/[id]/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from "/components/header/Header";
import { BookOpen, ArrowLeft, Save, X, Loader } from 'lucide-react';

export default function EditBook() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookNotFound, setBookNotFound] = useState(false);
  const router = useRouter();
  const params = useParams();
  const bookId = params.id;

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    pages: '',
    description: '',
    publishYear: '',
    language: 'English',
    size: '',
    coverUrl: '',
    downloadUrl: ''
  });

  const categories = [
    'Aqeedah', 'Fiqh', 'Hadith', 'Quran', 'Seerah', 'Islamic History',
    'Dua & Dhikr', 'Islamic Literature', 'Comparative Religion', 'Other'
  ];

  const languages = [
    'English', 'Arabic', 'Urdu', 'French', 'Spanish', 'Turkish', 'Malay', 'Other'
  ];

  // Load existing book data
  useEffect(() => {
    const fetchBookData = async () => {
      if (!bookId) {
        setError('No book ID provided');
        setIsLoadingData(false);
        return;
      }

      try {
        const response = await fetch(`/api/books/${bookId}`);
        
        if (response.ok) {
          const book = await response.json();
          setFormData({
            title: book.title || '',
            author: book.author || '',
            category: book.category || '',
            pages: book.pages?.toString() || '',
            description: book.description || '',
            publishYear: book.publishYear?.toString() || '',
            language: book.language || 'English',
            size: book.size || '',
            coverUrl: book.coverUrl || '',
            downloadUrl: book.downloadUrl || ''
          });
        } else if (response.status === 404) {
          setBookNotFound(true);
        } else {
          const result = await response.json();
          setError(result.error || 'Failed to load book data');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        console.error('Fetch book error:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchBookData();
  }, [bookId]);

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
        pages: parseInt(formData.pages),
        publishYear: parseInt(formData.publishYear),
        updatedBy: user?.id || null
      };

      const response = await fetch(`/api/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Book updated successfully! Redirecting...');
        setTimeout(() => {
          router.push('/pages/dashboard/books');
        }, 2000);
      } else {
        setError(result.error || 'Failed to update book');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Update book error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      router.push('/pages/dashboard/books');
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
              <p className="text-gray-600">Loading book data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Book not found state
  if (bookNotFound) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-[200px] max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Not Found</h2>
            <p className="text-gray-600 mb-6">The book you're trying to edit doesn't exist or may have been deleted.</p>
            <button
              onClick={() => router.push('/pages/dashboard/books')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 font-medium"
            >
              Back to Books
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
              onClick={() => router.push('/pages/dashboard/books')}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition duration-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BookOpen className="w-8 h-8 mr-3 text-blue-600" />
                Edit Book
              </h1>
              <p className="text-gray-600">Update book information</p>
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
                    Book Title *
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
                    placeholder="Enter book title"
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
                    placeholder="Enter author name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                    Language *
                  </label>
                  <select
                    id="language"
                    name="language"
                    required
                    disabled={isLoading}
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-2">
                    Pages *
                  </label>
                  <input
                    type="number"
                    id="pages"
                    name="pages"
                    required
                    min="1"
                    disabled={isLoading}
                    value={formData.pages}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    placeholder="Number of pages"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="publishYear" className="block text-sm font-medium text-gray-700 mb-2">
                    Publish Year *
                  </label>
                  <input
                    type="number"
                    id="publishYear"
                    name="publishYear"
                    required
                    min="1900"
                    max={new Date().getFullYear()}
                    disabled={isLoading}
                    value={formData.publishYear}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    placeholder="Publication year"
                  />
                </div>

                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                    File Size *
                  </label>
                  <input
                    type="text"
                    id="size"
                    name="size"
                    required
                    disabled={isLoading}
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    placeholder="e.g., 2.5 MB"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  disabled={isLoading}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  placeholder="Enter book description"
                />
              </div>

              {/* File URLs */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">File Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="downloadUrl" className="block text-sm font-medium text-gray-700 mb-2">
                      Download URL *
                    </label>
                    <input
                      type="url"
                      id="downloadUrl"
                      name="downloadUrl"
                      required
                      disabled={isLoading}
                      value={formData.downloadUrl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      placeholder="e.g., /books/fundamentals-tawheed.pdf"
                    />
                  </div>

                  <div>
                    <label htmlFor="coverUrl" className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      id="coverUrl"
                      name="coverUrl"
                      disabled={isLoading}
                      value={formData.coverUrl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      placeholder="e.g., /images/tawheed.jpg"
                    />
                  </div>
                </div>
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
                  {isLoading ? 'Updating Book...' : 'Update Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}