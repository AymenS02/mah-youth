'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from "gsap";
import { Play, ExternalLink, Search, Filter, Video, User, Calendar } from 'lucide-react';
import Header from "/components/header/Header";

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const headerRef = useRef(null);
  const videosGridRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Check if refs are available before animating
    if (headerRef.current && videosGridRef.current) {
      const tl = gsap.timeline({ delay: 0.3 });
      gsap.set([headerRef.current, videosGridRef.current], { opacity: 0, y: 50 });

      tl.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }).to(videosGridRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4");

      return () => tl.kill();
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/videos');
      const data = await response.json();

      if (response.ok) {
        setVideos(data.videos);
      } else {
        console.error('Failed to fetch videos:', data.error);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['all', 'Aqeedah', 'Quran', 'Hadith', 'Akhlaq', 'Seerah', 'Fiqh'];

  const filteredVideos = videos.filter(video => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleWatchVideo = (video) => {
    if (video.videoUrl) {
      window.open(video.videoUrl, '_blank');
    } else {
      alert("This video is not yet available.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
          <div className="text-gray-600">Loading videos...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12">
        <div className="container mx-auto px-6 max-w-7xl">

          {/* Header Section */}
          <div ref={headerRef} className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-full">
                <Video className="w-8 h-8 text-purple-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">
                Islamic <span className="text-purple-600">Videos</span>
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch educational Islamic videos, lectures, and scholarly content to enhance your knowledge of Islam
            </p>
            <div className="w-24 h-1 bg-purple-600 mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search videos, authors, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredVideos.length} of {videos.length} videos
            </div>
          </div>

          {/* Videos Grid */}
          <div ref={videosGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map((video) => (
              <div key={video._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 h-48 flex items-center justify-center relative overflow-hidden">
                  <Play className="w-16 h-16 text-white opacity-80" />
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-white text-sm font-medium">{video.category}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{video.author}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{video.description}</p>
                  <div className="grid grid-cols-1 gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Added {formatDate(video.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      <span>Video Content</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleWatchVideo(video)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Watch Video</span>
                  </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredVideos.length === 0 && (
            <div className="text-center py-16">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No videos found</h3>
              <p className="text-gray-500">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VideosPage;