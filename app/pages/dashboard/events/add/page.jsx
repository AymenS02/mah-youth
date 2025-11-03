'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '/components/header/Header';
import { CalendarPlus, ArrowLeft, Save, X, Upload, Image as ImageIcon, Clock, MapPin, Tag, FileText } from 'lucide-react';

export default function AddEvent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    date: '',
    time: '',
    imageUrl: '',
  });

  const categories = [
    'Retreat',
    'Lecture',
    'Workshop',
    'Fundraiser',
    'Social Gathering',
    'Sports',
    'Other',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;

      const submitData = {
        ...formData,
        createdBy: user?.id || null,
      };

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Event added successfully! Redirecting...');
        setTimeout(() => {
          router.push('/pages/dashboard/events');
        }, 2000);
      } else {
        setError(result.error || 'Failed to add event');
      }
    } catch (err) {
      console.error('Add event error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      router.push('/pages/dashboard/events');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-primary-dark to-primary-light">
      <Header />

      <div className="pt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12">
          <button
            onClick={() => router.push('/pages/dashboard/events')}
            className="mb-6 flex items-center gap-2 text-gray-300 hover:text-accent transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="font-medium">Back to Events</span>
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-accent/10 rounded-xl">
              <CalendarPlus className="w-10 h-10 text-accent" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white">
                Add New Event
              </h1>
              <p className="text-xl text-gray-300 mt-2">Create a new event for your community</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl border-2 border-gray-700/50 overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="w-4 h-4 text-white" />
                </div>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-xl flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Save className="w-4 h-4 text-white" />
                </div>
                <p className="text-emerald-400 text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-accent" />
                  Basic Information
                </h2>

                <div className="space-y-6">
                  {/* Title & Category */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        disabled={isLoading}
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all disabled:opacity-50"
                        placeholder="e.g., Youth Friday Night"
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                        Category *
                      </label>
                      <div className="relative">
                        <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                        <select
                          id="category"
                          name="category"
                          required
                          disabled={isLoading}
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-10 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none appearance-none cursor-pointer transition-all disabled:opacity-50"
                        >
                          <option value="" className="bg-gray-900">Select category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat} className="bg-gray-900">
                              {cat}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows={5}
                      disabled={isLoading}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all resize-none disabled:opacity-50"
                      placeholder="Describe your event in detail..."
                    />
                  </div>
                </div>
              </div>

              {/* Event Details Section */}
              <div className="border-t border-gray-700 pt-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-accent" />
                  Event Details
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Date */}
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      required
                      disabled={isLoading}
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all disabled:opacity-50"
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      required
                      disabled={isLoading}
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all disabled:opacity-50"
                    />
                  </div>

                  {/* Location */}
                  <div className="lg:col-span-2">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                      Location *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        id="location"
                        name="location"
                        required
                        disabled={isLoading}
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all disabled:opacity-50"
                        placeholder="e.g., Toronto Masjid Main Hall"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="border-t border-gray-700 pt-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <ImageIcon className="w-6 h-6 text-accent" />
                  Event Image
                </h2>

                <div className="space-y-4">
                  <label
                    htmlFor="image"
                    className={`block w-full border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-accent transition-all duration-300 cursor-pointer group ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      disabled={isLoading}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setIsLoading(true);
                        const formData = new FormData();
                        formData.append('file', file);

                        try {
                          const res = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData,
                          });
                          const data = await res.json();
                          if (res.ok) {
                            setFormData((prev) => ({
                              ...prev,
                              imageUrl: data.url,
                            }));
                            setSuccess('Image uploaded successfully!');
                            setTimeout(() => setSuccess(''), 3000);
                          } else {
                            setError(data.error || 'Failed to upload image');
                          }
                        } catch (err) {
                          console.error(err);
                          setError('Image upload failed. Please try again.');
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      className="hidden"
                    />
                    <Upload className="w-12 h-12 text-gray-400 group-hover:text-accent mx-auto mb-4 transition-colors" />
                    <p className="text-gray-300 font-medium mb-2">
                      Click to upload event image
                    </p>
                    <p className="text-gray-500 text-sm">
                      PNG, JPG or WEBP (MAX. 5MB)
                    </p>
                  </label>

                  {/* Image Preview */}
                  {formData.imageUrl && (
                    <div className="relative rounded-xl overflow-hidden border-2 border-accent/50">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <p className="text-white text-sm font-medium">Image uploaded successfully</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-8 py-4 bg-gray-800/50 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 hover:border-gray-600 transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-4 bg-gradient-to-r from-accent to-accent-light text-white rounded-xl hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding Event...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Add Event</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 bg-gradient-to-br from-accent/10 to-accent-light/10 rounded-xl p-6 border border-accent/30">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            💡 Tips for Creating Great Events
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Use clear, descriptive titles that explain what the event is about</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Include specific location details to help attendees find the venue</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Upload high-quality images that represent your event well</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Double-check the date and time to avoid confusion</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}