'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, Search, Filter, Clock, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';
import Header from "/components/header/Header";

const ArticlesPage = () => {
  const headerRef = useRef(null);
  const articlesGridRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // GSAP Animations
    const tl = window.gsap.timeline({ delay: 0.3 });

    window.gsap.set([headerRef.current, articlesGridRef.current], {
      opacity: 0,
      y: 50
    });

    tl.to(headerRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    })
    .to(articlesGridRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4");

    return () => tl.kill();
  }, []);

  const articles = [
    {
      id: 1,
      title: "The Importance of Prayer in Islam",
      author: "Dr. Ahmad Hassan",
      category: "Worship",
      readTime: "8 min read",
      publishDate: "2023-12-10",
      excerpt: "Explore the significance of Salah in a Muslim's daily life and its spiritual benefits. Understanding the five daily prayers and their impact on personal development.",
      tags: ["Prayer", "Salah", "Worship", "Spirituality"],
      slug: "importance-of-prayer-in-islam",
      featured: true
    },
    {
      id: 2,
      title: "Understanding Islamic Finance Principles",
      author: "Prof. Sarah Ahmed",
      category: "Finance",
      readTime: "12 min read",
      publishDate: "2023-12-05",
      excerpt: "A comprehensive guide to Islamic banking and finance principles, including Sharia-compliant investment options and avoiding Riba (interest).",
      tags: ["Finance", "Banking", "Halal", "Investment"],
      slug: "islamic-finance-principles",
      featured: false
    },
    {
      id: 3,
      title: "The Art of Dhikr: Remembrance of Allah",
      author: "Sheikh Muhammad Ali",
      category: "Spirituality",
      readTime: "6 min read",
      publishDate: "2023-11-28",
      excerpt: "Learn about different forms of Dhikr and how remembrance of Allah can bring peace and tranquility to your heart and mind.",
      tags: ["Dhikr", "Remembrance", "Peace", "Heart"],
      slug: "art-of-dhikr-remembrance",
      featured: true
    },
    {
      id: 4,
      title: "Raising Children with Islamic Values",
      author: "Dr. Fatima Ibrahim",
      category: "Family",
      readTime: "10 min read",
      publishDate: "2023-11-20",
      excerpt: "Practical guidance for Muslim parents on instilling Islamic values in children while navigating modern challenges and maintaining cultural identity.",
      tags: ["Parenting", "Children", "Values", "Family"],
      slug: "raising-children-islamic-values",
      featured: false
    },
    {
      id: 5,
      title: "The Science of Wudu: Spiritual and Physical Benefits",
      author: "Dr. Omar Suleiman",
      category: "Science",
      readTime: "7 min read",
      publishDate: "2023-11-15",
      excerpt: "Discover the scientific benefits of ablution (Wudu) and how this Islamic practice promotes both physical hygiene and spiritual purification.",
      tags: ["Wudu", "Science", "Health", "Purification"],
      slug: "science-of-wudu-benefits",
      featured: false
    },
    {
      id: 6,
      title: "Seeking Knowledge: The Islamic Perspective",
      author: "Prof. Yasmin Khan",
      category: "Education",
      readTime: "9 min read",
      publishDate: "2023-11-08",
      excerpt: "Understanding the Islamic emphasis on education and knowledge-seeking, from the Quran and Sunnah to contemporary applications.",
      tags: ["Knowledge", "Education", "Learning", "Wisdom"],
      slug: "seeking-knowledge-islamic-perspective",
      featured: true
    },
    {
      id: 7,
      title: "Halal Food: More Than Just Dietary Laws",
      author: "Chef Abdullah Rahman",
      category: "Lifestyle",
      readTime: "5 min read",
      publishDate: "2023-10-30",
      excerpt: "Explore the deeper meaning behind Halal food guidelines and how they promote ethical consumption and mindful eating.",
      tags: ["Halal", "Food", "Ethics", "Lifestyle"],
      slug: "halal-food-dietary-laws",
      featured: false
    },
    {
      id: 8,
      title: "Building Strong Muslim Communities",
      author: "Imam Hassan Malik",
      category: "Community",
      readTime: "11 min read",
      publishDate: "2023-10-25",
      excerpt: "Learn how to strengthen bonds within Muslim communities through mutual support, shared values, and collective action for positive change.",
      tags: ["Community", "Unity", "Support", "Brotherhood"],
      slug: "building-strong-muslim-communities",
      featured: false
    }
  ];

  const categories = ['all', 'Worship', 'Finance', 'Spirituality', 'Family', 'Science', 'Education', 'Lifestyle', 'Community'];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-12">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* Header Section */}
          <div ref={headerRef} className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-emerald-100 p-3 rounded-full">
                <BookOpen className="w-8 h-8 text-emerald-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">
                Islamic <span className="text-emerald-600">Articles</span>
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Read insightful articles on Islamic topics, contemporary issues, and practical guidance for Muslim life
            </p>
            <div className="w-24 h-1 bg-emerald-600 mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles, authors, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white"
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
              Showing {filteredArticles.length} of {articles.length} articles
            </div>
          </div>

          {/* Articles Grid */}
          <div ref={articlesGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`}>
                <div className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group cursor-pointer relative ${article.featured ? 'ring-2 ring-emerald-200' : ''}`}>
                  
                  {/* Featured Badge */}
                  {article.featured && (
                    <div className="absolute top-4 right-4 z-10 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      FEATURED
                    </div>
                  )}

                  {/* Article Header */}
                  <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-6 relative">
                    <div className="mb-4">
                      <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {article.title}
                    </h3>

                    {/* Author and Read Time */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="text-gray-400 text-xs">+{article.tags.length - 3} more</span>
                      )}
                    </div>

                    {/* Article Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(article.publishDate)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm group-hover:gap-3 transition-all">
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Hover shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"></div>
                </div>
              </Link>
            ))}
          </div>

          {/* No Results */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>

        {/* GSAP Scripts */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
      </div>
    </>

  );
};

export default ArticlesPage;