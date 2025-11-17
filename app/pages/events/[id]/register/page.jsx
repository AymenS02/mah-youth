'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from "gsap";
import { Calendar, MapPin, Clock, User, Mail, Phone, ArrowLeft, CheckCircle, AlertCircle, Infinity } from 'lucide-react';
import Header from "/components/header/Header";
import Footer from "/components/footer/Footer";
import { useRouter, useParams } from 'next/navigation';

const EventRegistrationPage = () => {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dietaryRestrictions: '',
    emergencyContact: '',
    emergencyPhone: '',
    additionalNotes: ''
  });

  useEffect(() => {
    if (headerRef.current && formRef.current) {
      const tl = gsap.timeline({ delay: 0.3 });
      gsap.set([headerRef.current, formRef.current], { opacity: 0, y: 50 });
      tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        .to(formRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4");
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          dietaryRestrictions: '',
          emergencyContact: '',
          emergencyPhone: '',
          additionalNotes: ''
        });
        
        setTimeout(() => {
          window.scrollTo(0, 0);
          router.push(`/pages/events/${eventId}`);
        }, 3000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Failed to register. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('An error occurred. Please try again.');
      console.error('Error submitting registration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    window.scrollTo(0, 0);
    router.push(`/pages/events/${eventId}`);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary to-primary-light">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Loading registration...</p>
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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary to-primary-light">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Event not found</h2>
            <button
              onClick={() => router.push('/pages/events')}
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

  // Check if event has unlimited capacity (capacity === 0)
  const hasUnlimitedCapacity = event.capacity === 0;
  const spotsRemaining = hasUnlimitedCapacity ? null : event.capacity - event.registeredAttendees;
  const isFull = !hasUnlimitedCapacity && spotsRemaining <= 0;

  if (isFull) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary to-primary-light px-4">
          <div className="text-center max-w-md">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-12 border-2 border-gray-700">
              <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Event Full</h2>
              <p className="text-gray-300 mb-6">Sorry, this event has reached its capacity.</p>
              <button
                onClick={handleBack}
                className="bg-accent text-white px-6 py-3 rounded-xl hover:bg-accent-light transition-colors duration-300"
              >
                Back to Event Details
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-primary to-primary-light pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">

          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Event Details</span>
          </button>

          {/* Header */}
          <div ref={headerRef} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Register for Event
              </span>
            </h1>
            <p className="text-xl text-gray-300">{event.title}</p>
            
            {/* Event Quick Info */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                <span>{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                <span>{event.startTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent" />
                <span>{event.location}</span>
              </div>
            </div>

            {/* Spots Remaining Alert */}
            <div className="inline-block mt-6 bg-accent/10 border border-accent/30 rounded-full px-6 py-2">
              {hasUnlimitedCapacity ? (
                <span className="text-accent font-semibold flex items-center gap-2">
                  <Infinity className="w-5 h-5" />
                  Unlimited spots available
                </span>
              ) : (
                <span className="text-accent font-semibold">
                  {spotsRemaining} {spotsRemaining === 1 ? 'spot' : 'spots'} remaining
                </span>
              )}
            </div>
          </div>

          {/* Registration Form */}
          <div ref={formRef}>
            <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border-2 border-gray-700 shadow-2xl">
              
              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <div>
                    <p className="text-green-400 font-semibold">Registration Successful!</p>
                    <p className="text-gray-300 text-sm">You might receive emails regarding registration updates. Redirecting...</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                  <div>
                    <p className="text-red-400 font-semibold">Registration Failed</p>
                    <p className="text-gray-300 text-sm">{errorMessage}</p>
                  </div>
                </div>
              )}

              <h2 className="text-2xl font-bold text-white mb-6">Your Information</h2>

              <div className="space-y-6">
                
                {/* Full Name */}
                <div>
                  <label className="block text-gray-300 font-medium mb-2" htmlFor="fullName">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-300 font-medium mb-2" htmlFor="email">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-300 font-medium mb-2" htmlFor="phone">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all duration-300"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>

                {/* Dietary Restrictions */}
                <div>
                  <label className="block text-gray-300 font-medium mb-2" htmlFor="dietaryRestrictions">
                    Dietary Restrictions
                  </label>
                  <input
                    type="text"
                    id="dietaryRestrictions"
                    name="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all duration-300"
                    placeholder="Any dietary restrictions or allergies"
                  />
                </div>

                {/* Emergency Contact Section */}
                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-xl font-bold text-white mb-4">Emergency Contact</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 font-medium mb-2" htmlFor="emergencyContact">
                        Emergency Contact Name
                      </label>
                      <input
                        type="text"
                        id="emergencyContact"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all duration-300"
                        placeholder="Emergency contact full name"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-2" htmlFor="emergencyPhone">
                        Emergency Contact Phone
                      </label>
                      <input
                        type="tel"
                        id="emergencyPhone"
                        name="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all duration-300"
                        placeholder="Emergency contact phone"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-gray-300 font-medium mb-2" htmlFor="additionalNotes">
                    Additional Notes
                  </label>
                  <textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all duration-300 resize-none"
                    placeholder="Any additional information or special requirements"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full ${
                    isSubmitting 
                      ? 'bg-gray-700 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-accent to-accent-light hover:shadow-lg hover:shadow-accent/50'
                  } text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-gray-400 text-sm text-center">
                  By registering, you agree to receive event updates and reminders via email.
                </p>

              </div>
            </form>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default EventRegistrationPage;