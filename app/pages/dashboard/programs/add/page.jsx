'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '/components/header/Header';
import { Repeat, ArrowLeft, Save, X, Clock, MapPin, User, FileText, Calendar, Upload, Image as ImageIcon } from 'lucide-react';

export default function AddProgram() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    host: '',
    location: '',
    startTime: '',
    endTime: '',
    recurrenceType: 'weekly',
    dayOfWeek: '',
    weekPattern: 'all',
    dayOfMonth: '',
    category: '',
    capacity: '',
    imageUrl: '',
    registrationLink: '',
    price: '0',
    notes: '',
    contactInfo: '',
    isActive: true,
  });

  const daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
        capacity: formData.capacity ? parseInt(formData.capacity) : 0,
        price: parseFloat(formData.price) || 0,
        dayOfWeek: formData.dayOfWeek !== '' ? parseInt(formData.dayOfWeek) : undefined,
        dayOfMonth: formData.dayOfMonth ? parseInt(formData.dayOfMonth) : undefined,
        createdBy: user?.id || null,
      };

      // Remove empty optional fields
      if (!submitData.dayOfWeek && submitData.dayOfWeek !== 0) delete submitData.dayOfWeek;
      if (!submitData.dayOfMonth) delete submitData.dayOfMonth;
      if (!submitData.category) delete submitData.category;
      if (!submitData.imageUrl) delete submitData.imageUrl;
      if (!submitData.registrationLink) delete submitData.registrationLink;
      if (!submitData.notes) delete submitData.notes;
      if (!submitData.contactInfo) delete submitData.contactInfo;

      const response = await fetch('/api/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Program added successfully! Redirecting...');
        setTimeout(() => {
          window.scrollTo(0, 0);
          router.push('/pages/dashboard/programs');
        }, 2000);
      } else {
        setError(result.error || 'Failed to add program');
      }
    } catch (err) {
      console.error('Add program error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      window.scrollTo(0, 0);
      router.push('/pages/dashboard/programs');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-primary-dark to-primary-light">
      <Header />

      <div className="pt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12">
          <button
            onClick={() => {
              window.scrollTo(0, 0);
              router.push('/pages/dashboard/programs');
            }}
            className="mb-6 flex items-center gap-2 text-gray-300 hover:text-emerald-500 transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="font-medium">Back to Programs</span>
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-emerald-500/10 rounded-xl">
              <Repeat className="w-10 h-10 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white">
                Add New Program
              </h1>
              <p className="text-xl text-gray-300 mt-2">Create a recurring program for your community</p>
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
              {/* Basic Information */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-emerald-500" />
                  Basic Information
                </h2>

                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                      Program Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      disabled={isLoading}
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all disabled:opacity-50"
                      placeholder="e.g., Youth Friday Night"
                    />
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
                      rows={4}
                      disabled={isLoading}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none disabled:opacity-50"
                      placeholder="Describe your program in detail..."
                    />
                  </div>

                  {/* Host & Category */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="host" className="block text-sm font-medium text-gray-300 mb-2">
                        Host/Instructor *
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          id="host"
                          name="host"
                          required
                          disabled={isLoading}
                          value={formData.host}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all disabled:opacity-50"
                          placeholder="e.g., Sheikh Ahmed"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        id="category"
                        name="category"
                        disabled={isLoading}
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all disabled:opacity-50"
                        placeholder="e.g., Education, Sports, Social"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule & Recurrence */}
              <div className="border-t border-gray-700 pt-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-emerald-500" />
                  Schedule & Recurrence
                </h2>

                <div className="space-y-6">
                  {/* Time */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="startTime" className="block text-sm font-medium text-gray-300 mb-2">
                        Start Time *
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="time"
                          id="startTime"
                          name="startTime"
                          required
                          disabled={isLoading}
                          value={formData.startTime}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="endTime" className="block text-sm font-medium text-gray-300 mb-2">
                        End Time *
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="time"
                          id="endTime"
                          name="endTime"
                          required
                          disabled={isLoading}
                          value={formData.endTime}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Recurrence Type */}
                  <div>
                    <label htmlFor="recurrenceType" className="block text-sm font-medium text-gray-300 mb-2">
                      Recurrence Pattern *
                    </label>
                    <select
                      id="recurrenceType"
                      name="recurrenceType"
                      required
                      disabled={isLoading}
                      value={formData.recurrenceType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none cursor-pointer transition-all disabled:opacity-50"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-Weekly (1st & 3rd OR 2nd & 4th)</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  {/* Weekly/Bi-Weekly Day Selection */}
                  {(formData.recurrenceType === 'weekly' || formData.recurrenceType === 'bi-weekly') && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-300 mb-2">
                          Day of Week *
                        </label>
                        <select
                          id="dayOfWeek"
                          name="dayOfWeek"
                          required
                          disabled={isLoading}
                          value={formData.dayOfWeek}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none cursor-pointer transition-all disabled:opacity-50"
                        >
                          <option value="">Select day</option>
                          {daysOfWeek.map((day) => (
                            <option key={day.value} value={day.value}>
                              {day.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {formData.recurrenceType === 'bi-weekly' && (
                        <div>
                          <label htmlFor="weekPattern" className="block text-sm font-medium text-gray-300 mb-2">
                            Week Pattern
                          </label>
                          <select
                            id="weekPattern"
                            name="weekPattern"
                            disabled={isLoading}
                            value={formData.weekPattern}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none cursor-pointer transition-all disabled:opacity-50"
                          >
                            <option value="1,3">1st & 3rd week</option>
                            <option value="2,4">2nd & 4th week</option>
                          </select>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Monthly Day Selection */}
                  {formData.recurrenceType === 'monthly' && (
                    <div>
                      <label htmlFor="dayOfMonth" className="block text-sm font-medium text-gray-300 mb-2">
                        Day of Month *
                      </label>
                      <input
                        type="number"
                        id="dayOfMonth"
                        name="dayOfMonth"
                        min="1"
                        max="31"
                        required
                        disabled={isLoading}
                        value={formData.dayOfMonth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all disabled:opacity-50"
                        placeholder="1-31"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Location Details */}
              <div className="border-t border-gray-700 pt-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-emerald-500" />
                  Location & Contact
                </h2>

                <div className="space-y-6">
                  <div>
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
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all disabled:opacity-50"
                        placeholder="e.g., MAH Main Hall"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-300 mb-2">
                      Contact Information
                    </label>
                    <input
                      type="text"
                      id="contactInfo"
                      name="contactInfo"
                      disabled={isLoading}
                      value={formData.contactInfo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all disabled:opacity-50"
                      placeholder="Email or phone number for inquiries"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Details */}
              <div className="border-t border-gray-700 pt-8">
                <h2 className="text-2xl font-bold text-white mb-6">Optional Details</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="capacity" className="block text-sm font-medium text-gray-300 mb-2">
                        Capacity (0 = Unlimited)
                      </label>
                      <input
                        type="number"
                        id="capacity"
                        name="capacity"
                        min="0"
                        disabled={isLoading}
                        value={formData.capacity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all disabled:opacity-50"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        min="0"
                        step="0.01"
                        disabled={isLoading}
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all disabled:opacity-50"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="registrationLink" className="block text-sm font-medium text-gray-300 mb-2">
                      Registration/Sign-up Link
                    </label>
                    <input
                      type="url"
                      id="registrationLink"
                      name="registrationLink"
                      disabled={isLoading}
                      value={formData.registrationLink}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all disabled:opacity-50"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      id="imageUrl"
                      name="imageUrl"
                      disabled={isLoading}
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all disabled:opacity-50"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      disabled={isLoading}
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none disabled:opacity-50"
                      placeholder="Any additional information..."
                    />
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-5 h-5 rounded border-gray-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-900"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-300 cursor-pointer">
                      Program is active (visible to users)
                    </label>
                  </div>
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
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding Program...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Add Program</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
