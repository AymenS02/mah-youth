'use client';

import React, { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setMessage('🎉 You’re subscribed!');
      setEmail('');
    } catch (err) {
      setError('Please enter a valid email address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen py-24 bg-gradient-to-b from-primary-light to-primary text-center relative text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Decorative dots pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute top-20 right-20 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-2 h-2 bg-white rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Icon badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Stay Updated
          </h2>
          
          <p className="text-xl opacity-90 text-white/60 mb-10 leading-relaxed max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest updates, events, and announcements delivered straight to your inbox.
          </p>

          {/* Newsletter form */}
          <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-8">
            <div className={`relative bg-white/10 backdrop-blur-md rounded-2xl p-2 border-2 transition-all duration-300 ${
              isFocused ? 'border-accent-light shadow-xl shadow-accent-light/20' : 'border-white/20'
            }`}>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative text-primary">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Enter your email address"
                    className="w-full px-6 py-4 rounded-xl bg-white focus:outline-none shadow-sm"
                    required
                  />
                  {/* Floating label effect */}

                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="group relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 overflow-hidden flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <span className="relative z-10">
                    {loading ? 'Subscribing...' : 'Subscribe'}
                  </span>
                </button>
              </div>
            </div>

            {/* Decorative corner elements */}
            <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-white/20 rounded-tl-lg"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-white/20 rounded-br-lg"></div>
          </form>

          {message && (
            <p className="text-green-400 font-medium m-4">
              {message}
            </p>
          )}

          {error && (
            <p className="text-red-400 font-medium m-4">
              {error}
            </p>
          )}

          {/* Features */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 /90">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Weekly Updates</span>
            </div>
            <div className="flex items-center gap-2 /90">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Exclusive Events</span>
            </div>
            <div className="flex items-center gap-2 /90">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">No Spam</span>
            </div>
          </div>

          {/* Privacy text with icon */}
          <div className="flex items-center justify-center gap-2 /70 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p>
              We respect your privacy. You can unsubscribe anytime.
            </p>
          </div>

          {/* Social proof */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <div className="flex items-center justify-center gap-2 /80">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white/20"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white/20"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white/20"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white/20"></div>
              </div>
              <span className="text-sm font-medium ml-2">
                Join <span className="font-bold">2,000+</span> community members
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;