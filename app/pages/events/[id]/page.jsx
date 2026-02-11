'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from "gsap";
import { Calendar, MapPin, Clock, Users, DollarSign, Video, User, ArrowLeft, CheckCircle, Infinity } from 'lucide-react';
import Header from "/components/header/Header";
import Footer from "/components/footer/Footer";
import { useRouter, useParams } from 'next/navigation';
import { isRegistrationDeadlinePassed } from '/lib/utils/eventUtils';

const EventDetailsPage = () => {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;

  useEffect(() => {
    if (headerRef.current && contentRef.current) {
      const tl = gsap.timeline({ delay: 0.3 });
      gsap.set([headerRef.current, contentRef.current], { opacity: 0, y: 50 });
      tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        .to(contentRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4");
      return () => tl.kill();
    }
  }, [event]);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/events/${eventId}`);
      const data = await response.json();
      if (response.ok) {
        setEvent(data.event);
      } else {
        console.error('Failed to fetch event:', data.error);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Lecture': 'from-blue-500 to-blue-600',
      'Workshop': 'from-emerald-500 to-emerald-600',
      'Conference': 'from-purple-500 to-purple-600',
      'Seminar': 'from-amber-500 to-amber-600',
      'Community': 'from-rose-500 to-rose-600',
      'Retreat': 'from-teal-500 to-teal-600',
      'Fundraiser': 'from-pink-500 to-pink-600',
      'Social Gathering': 'from-indigo-500 to-indigo-600',
      'Sports': 'from-orange-500 to-orange-600',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const handleRegister = () => {
    window.scrollTo(0, 0);
    router.push(`/pages/events/${eventId}/register`);
  };

  const handleBack = () => {
    window.scrollTo(0, 0);
    router.push('/pages/events');
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary to-primary-light">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Loading event details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary to-primary-dark">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Event not found</h2>
            <button
              onClick={handleBack}
              className="bg-accent text-white px-6 py-3 rounded-xl hover:bg-accent-light transition-colors duration-300"
            >
              Back to Events
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Check for unlimited capacity
  const isUnlimitedCapacity = event.capacity === 0;
  const spotsRemaining = isUnlimitedCapacity ? null : event.capacity - (event.registeredAttendees || 0);
  const isFull = !isUnlimitedCapacity && spotsRemaining <= 0;
  
  // Check if registration deadline has passed
  const isDeadlinePassed = isRegistrationDeadlinePassed(event.registrationDeadline);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-primary-light to-primary pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">

          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Events</span>
          </button>

          {/* Hero Image Section */}
          <div ref={headerRef} className="relative h-96 rounded-2xl overflow-hidden mb-8 border-2 border-gray-700 shadow-2xl">
            {event.imageUrl ? (
              <>
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <Calendar className="w-32 h-32 text-gray-700" />
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-6 right-6">
              <div className={`bg-gradient-to-r ${getCategoryColor(event.category)} px-6 py-2 rounded-full backdrop-blur-sm shadow-lg`}>
                <span className="text-white text-sm font-bold uppercase tracking-wide">{event.category}</span>
              </div>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 drop-shadow-2xl">
                {event.title}
              </h1>
              {event.isOnline && (
                <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-500/50 px-4 py-2 rounded-full">
                  <Video className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-300 font-semibold">Online Event</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div ref={contentRef} className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column - Event Details */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Description */}
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border-2 border-gray-700 shadow-xl">
                <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  About This Event
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {event.description}
                </p>
              </div>

              {/* Speakers Section */}
              {event.speakers && event.speakers.length > 0 && (
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border-2 border-gray-700 shadow-xl">
                  <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Featured Speakers
                  </h2>
                  <div className="space-y-4">
                    {event.speakers.map((speaker, index) => (
                      <div key={index} className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-accent" />
                        </div>
                        <span className="text-lg text-white font-medium">{speaker}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Details Grid */}
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border-2 border-gray-700 shadow-xl">
                <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Event Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  
                  {/* Date */}
                  <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Date</p>
                      <p className="text-white font-semibold">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Time</p>
                      <p className="text-white font-semibold">
                        {event.startTime} - {event.endTime}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Location</p>
                      <p className="text-white font-semibold">{event.location}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Price</p>
                      <p className="text-white font-semibold">
                        {event.price === 0 ? 'Free' : `$${event.price} CAD`}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Right Column - Registration Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border-2 border-gray-700 shadow-xl sticky top-32">
                
                <h3 className="text-2xl font-bold text-white mb-6">Registration</h3>

                {/* Capacity Info */}
                {isUnlimitedCapacity ? (
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                        <Infinity className="w-8 h-8 text-emerald-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Capacity</p>
                        <p className="text-emerald-400 font-bold text-xl">Unlimited</p>
                      </div>
                    </div>
                    <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/30">
                      <p className="text-white font-bold text-lg mb-1">{event.registeredAttendees || 0}</p>
                      <p className="text-gray-400 text-sm">people registered</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide">Capacity</p>
                          <p className="text-white font-bold text-lg">{event.capacity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Registered</p>
                        <p className="text-white font-bold text-lg">{event.registeredAttendees || 0}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-accent to-accent-light h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(((event.registeredAttendees || 0) / event.capacity) * 100, 100)}%` }}
                      ></div>
                    </div>

                    {/* Spots Remaining */}
                    <p className="text-center mt-3 text-sm">
                      {isFull ? (
                        <span className="text-red-400 font-semibold">Event Full</span>
                      ) : (
                        <span className="text-gray-300">
                          <span className="text-accent font-bold">{spotsRemaining}</span> {spotsRemaining === 1 ? 'spot' : 'spots'} remaining
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Price Display */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6 text-center">
                  <p className="text-gray-400 text-sm mb-2">Price per person</p>
                  <p className="text-4xl font-black text-white">
                    {event.price === 0 ? 'Free' : `$${event.price}`}
                  </p>
                  {event.price > 0 && <p className="text-gray-400 text-sm mt-1">CAD</p>}
                </div>

                {/* Register Button */}
                <button
                  onClick={handleRegister}
                  disabled={isFull || isDeadlinePassed}
                  className={`w-full ${
                    (isFull || isDeadlinePassed)
                      ? 'bg-gray-700 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-accent to-accent-light hover:shadow-lg hover:shadow-accent/50'
                  } text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mb-4`}
                >
                  {isFull ? (
                    <>
                      <span>Event Full</span>
                    </>
                  ) : isDeadlinePassed ? (
                    <>
                      <span>Registration Deadline Passed</span>
                    </>
                  ) : (
                    <>
                      <span>Register Now</span>
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Registration Link (if provided) */}
                {event.registrationLink && (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-accent hover:text-accent-light text-sm font-medium underline"
                  >
                    External Registration Link
                  </a>
                )}

              </div>
            </div>

          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default EventDetailsPage;