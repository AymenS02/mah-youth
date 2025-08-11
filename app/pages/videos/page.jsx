'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Search, Filter, Clock, Eye, Calendar, Youtube } from 'lucide-react';
import Header from "/components/header/Header";

const VideosPage = () => {
  const headerRef = useRef(null);
  const videosGridRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    // GSAP Animations
    const tl = window.gsap.timeline({ delay: 0.3 });

    window.gsap.set([headerRef.current, videosGridRef.current], {
      opacity: 0,
      y: 50
    });

    tl.to(headerRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    })
    .to(videosGridRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4");

    return () => tl.kill();
  }, []);

  const videos = [
    {
      id: 1,
      title: "Understanding Tawheed - The Oneness of Allah",
      speaker: "Sheikh Blah Blah",
      category: "Aqeedah",
      duration: "45:32",
      views: "125K",
      uploadDate: "2023-11-15",
      youtubeId: "GLBBKj2Z5x0", // Replace with actual YouTube video IDs
      description: "A comprehensive explanation of Islamic monotheism and its importance in a Muslim's life.",
      thumbnail: "https://www.youtube.com/watch?v=GLBBKj2Z5x0"
    },
    {
      id: 2,
      title: "The Beautiful Names of Allah (99 Names)",
      speaker: "Dr. Bilal Philips",
      category: "Aqeedah",
      duration: "1:23:45",
      views: "89K",
      uploadDate: "2023-10-22",
      youtubeId: "GLBBKj2Z5x0",
      description: "Learn about the 99 beautiful names of Allah and their meanings in our daily worship.",
      thumbnail: "https://www.youtube.com/watch?v=GLBBKj2Z5x0"
    },
    {
      id: 3,
      title: "Quran Recitation - Surah Al-Mulk",
      speaker: "Sheikh Mishary Rashid",
      category: "Quran",
      duration: "15:20",
      views: "234K",
      uploadDate: "2023-12-01",
      youtubeId: "GLBBKj2Z5x0",
      description: "Beautiful recitation of Surah Al-Mulk with English translation and commentary.",
      thumbnail: "https://www.youtube.com/watch?v=GLBBKj2Z5x0"
    },
    {
      id: 4,
      title: "Life of Prophet Muhammad (PBUH) - Part 1",
      speaker: "Sheikh Omar Suleiman",
      category: "Seerah",
      duration: "52:18",
      views: "156K",
      uploadDate: "2023-09-30",
      youtubeId: "GLBBKj2Z5x0",
      description: "First part of the comprehensive series on the life and teachings of Prophet Muhammad (PBUH).",
      thumbnail: "https://www.youtube.com/watch?v=GLBBKj2Z5x0"
    },
    {
      id: 5,
      title: "How to Perform Wudu (Ablution) Correctly",
      speaker: "Sheikh Muhammad Hassan",
      category: "Fiqh",
      duration: "12:45",
      views: "67K",
      uploadDate: "2023-11-08",
      youtubeId: "GLBBKj2Z5x0",
      description: "Step-by-step guide on performing wudu according to Islamic teachings.",
      thumbnail: "https://www.youtube.com/watch?v=GLBBKj2Z5x0"
    },
    {
      id: 6,
      title: "Islamic Ethics in Modern Times",
      speaker: "Dr. Ingrid Mattson",
      category: "Akhlaq",
      duration: "38:22",
      views: "43K",
      uploadDate: "2023-10-15",
      youtubeId: "GLBBKj2Z5x0",
      description: "Applying Islamic moral principles and ethics in contemporary society.",
      thumbnail: "https://www.youtube.com/watch?v=GLBBKj2Z5x0"
    }
  ];

  const categories = ['all', 'Aqeedah', 'Quran', 'Seerah', 'Fiqh', 'Akhlaq', 'Dawah'];

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const playVideo = (video) => {
    setSelectedVideo(video);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 py-12">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* Header Section */}
          <div ref={headerRef} className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-red-100 p-3 rounded-full">
                <Play className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">
                Islamic <span className="text-red-600">Videos</span>
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch educational Islamic videos, lectures, and Quran recitations from renowned scholars
            </p>
            <div className="w-24 h-1 bg-red-600 mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search videos, speakers, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white"
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
              <div key={video.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group cursor-pointer">
                
                {/* Video Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-red-500 to-pink-600 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      onClick={() => playVideo(video)}
                      className="bg-white/90 hover:bg-white rounded-full p-4 transform hover:scale-110 transition-all duration-300 shadow-lg"
                    >
                      <Play className="w-8 h-8 text-red-600 ml-1" />
                    </div>
                  </div>
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                    {video.duration}
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {video.category}
                  </div>
                </div>

                {/* Video Details */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {video.title}
                  </h3>
                  
                  <p className="text-gray-600 font-medium mb-3">{video.speaker}</p>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {video.description}
                  </p>

                  {/* Video Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{video.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(video.uploadDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Play Button */}
                  <button
                    onClick={() => playVideo(video)}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg"
                  >
                    <Youtube className="w-5 h-5" />
                    <span>Watch on YouTube</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredVideos.length === 0 && (
            <div className="text-center py-16">
              <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No videos found</h3>
              <p className="text-gray-500">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closeVideo}>
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">{selectedVideo.title}</h3>
                  <button
                    onClick={closeVideo}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                
                {/* YouTube Embed */}
                <div className="aspect-video mb-4">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-xl"
                  ></iframe>
                </div>
                
                <div className="text-gray-600">
                  <p className="font-medium mb-2">Speaker: {selectedVideo.speaker}</p>
                  <p className="text-sm">{selectedVideo.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GSAP Scripts */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
      </div>
    </>
  );
};

export default VideosPage;