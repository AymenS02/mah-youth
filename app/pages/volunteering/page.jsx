'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from "gsap";
import { Users, Briefcase, Heart, GraduationCap, CheckCircle, ArrowRight } from 'lucide-react';
import Header from "/components/header/Header";
import Footer from "/components/footer/Footer";
import Swal from 'sweetalert2';

const VolunteeringPage = () => {
  const [activeSection, setActiveSection] = useState('exec');
  const [execPositions, setExecPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const headerRef = useRef(null);
  const contentRef = useRef(null);

  // Form states
  const [execForm, setExecForm] = useState({
    positionId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    questionAnswers: []
  });

  const [youthCommitteeForm, setYouthCommitteeForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    phone: '',
    email: '',
    gender: ''
  });

  const [volunteerHoursForm, setVolunteerHoursForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    phone: '',
    email: '',
    gender: '',
    highSchool: '',
    parentFirstName: '',
    parentLastName: '',
    parentPhone: '',
    parentEmail: ''
  });

  useEffect(() => {
    // GSAP animation
    if (headerRef.current && contentRef.current) {
      const tl = gsap.timeline({ delay: 0.3 });
      gsap.set([headerRef.current, contentRef.current], { opacity: 0, y: 50 });
      tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        .to(contentRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4");
      return () => tl.kill();
    }
  }, []);

  useEffect(() => {
    fetchExecPositions();
  }, []);

  const fetchExecPositions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/volunteering/exec-positions?active=true');
      const data = await response.json();
      if (response.ok) {
        setExecPositions(data.positions);
      }
    } catch (error) {
      console.error('Error fetching exec positions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecPositionSelect = (positionId) => {
    const position = execPositions.find(p => p._id === positionId);
    if (position) {
      setExecForm({
        ...execForm,
        positionId,
        questionAnswers: position.questions.map(q => ({
          questionId: q.id,
          questionText: q.text,
          questionType: q.type,
          answer: ''
        }))
      });
    }
  };

  const handleExecFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/volunteering/exec-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(execForm)
      });

      const data = await response.json();

      if (response.ok) {
        await Swal.fire({
          title: 'Success!',
          text: 'Your application has been submitted successfully. We will review it and get back to you soon!',
          icon: 'success',
          confirmButtonColor: '#1e3a8a',
          confirmButtonText: 'Great!'
        });
        
        setExecForm({
          positionId: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          questionAnswers: []
        });
      } else {
        await Swal.fire({
          title: 'Error',
          text: data.error || 'Failed to submit application',
          icon: 'error',
          confirmButtonColor: '#1e3a8a'
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      await Swal.fire({
        title: 'Error',
        text: 'An unexpected error occurred. Please try again.',
        icon: 'error',
        confirmButtonColor: '#1e3a8a'
      });
    }
  };

  const handleYouthCommitteeSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/volunteering/youth-committee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(youthCommitteeForm)
      });

      const data = await response.json();

      if (response.ok) {
        await Swal.fire({
          title: 'Success!',
          html: 'Your application has been submitted successfully!<br/><br/><strong>You will be added to our WhatsApp group soon.</strong>',
          icon: 'success',
          confirmButtonColor: '#1e3a8a',
          confirmButtonText: 'Great!'
        });
        
        setYouthCommitteeForm({
          firstName: '',
          lastName: '',
          age: '',
          phone: '',
          email: '',
          gender: ''
        });
      } else {
        await Swal.fire({
          title: 'Error',
          text: data.error || 'Failed to submit application',
          icon: 'error',
          confirmButtonColor: '#1e3a8a'
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      await Swal.fire({
        title: 'Error',
        text: 'An unexpected error occurred. Please try again.',
        icon: 'error',
        confirmButtonColor: '#1e3a8a'
      });
    }
  };

  const handleVolunteerHoursSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/volunteering/volunteer-hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(volunteerHoursForm)
      });

      const data = await response.json();

      if (response.ok) {
        await Swal.fire({
          title: 'Success!',
          text: 'Your application has been submitted successfully! We will contact you for upcoming volunteer opportunities.',
          icon: 'success',
          confirmButtonColor: '#1e3a8a',
          confirmButtonText: 'Great!'
        });
        
        setVolunteerHoursForm({
          firstName: '',
          lastName: '',
          age: '',
          phone: '',
          email: '',
          gender: '',
          highSchool: '',
          parentFirstName: '',
          parentLastName: '',
          parentPhone: '',
          parentEmail: ''
        });
      } else {
        await Swal.fire({
          title: 'Error',
          text: data.error || 'Failed to submit application',
          icon: 'error',
          confirmButtonColor: '#1e3a8a'
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      await Swal.fire({
        title: 'Error',
        text: 'An unexpected error occurred. Please try again.',
        icon: 'error',
        confirmButtonColor: '#1e3a8a'
      });
    }
  };

  const selectedPosition = execPositions.find(p => p._id === execForm.positionId);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-primary-dark via-primary-light to-primary pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">

          {/* Header Section */}
          <div ref={headerRef} className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-accent/10 to-accent-light/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-accent/30 shadow-lg">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
              <span className="text-sm font-bold text-accent tracking-wider uppercase">Join Our Team</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black mb-6 text-white leading-tight">
              Volunteering <span className="text-accent">Positions</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Make a difference in our community! Join us in various capacities and help shape the future of MAH Youth.
            </p>
          </div>

          {/* Section Selector */}
          <div ref={contentRef} className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveSection('exec')}
                className={`group p-8 rounded-2xl border-2 transition-all duration-300 ${
                  activeSection === 'exec'
                    ? 'bg-gradient-to-br from-accent to-accent-light border-accent shadow-xl shadow-accent/30'
                    : 'bg-gray-900/50 border-gray-700 hover:border-accent/50'
                }`}
              >
                <Briefcase className={`w-12 h-12 mb-4 mx-auto ${
                  activeSection === 'exec' ? 'text-white' : 'text-accent'
                }`} />
                <h3 className={`text-xl font-bold mb-2 ${
                  activeSection === 'exec' ? 'text-white' : 'text-gray-300'
                }`}>
                  Join the Exec Team
                </h3>
                <p className={`text-sm ${
                  activeSection === 'exec' ? 'text-white/80' : 'text-gray-400'
                }`}>
                  Apply for leadership positions
                </p>
              </button>

              <button
                onClick={() => setActiveSection('youth')}
                className={`group p-8 rounded-2xl border-2 transition-all duration-300 ${
                  activeSection === 'youth'
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600 border-purple-500 shadow-xl shadow-purple-500/30'
                    : 'bg-gray-900/50 border-gray-700 hover:border-purple-500/50'
                }`}
              >
                <Users className={`w-12 h-12 mb-4 mx-auto ${
                  activeSection === 'youth' ? 'text-white' : 'text-purple-400'
                }`} />
                <h3 className={`text-xl font-bold mb-2 ${
                  activeSection === 'youth' ? 'text-white' : 'text-gray-300'
                }`}>
                  Youth Committee
                </h3>
                <p className={`text-sm ${
                  activeSection === 'youth' ? 'text-white/80' : 'text-gray-400'
                }`}>
                  Be part of the planning team
                </p>
              </button>

              <button
                onClick={() => setActiveSection('hours')}
                className={`group p-8 rounded-2xl border-2 transition-all duration-300 ${
                  activeSection === 'hours'
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-500 shadow-xl shadow-emerald-500/30'
                    : 'bg-gray-900/50 border-gray-700 hover:border-emerald-500/50'
                }`}
              >
                <GraduationCap className={`w-12 h-12 mb-4 mx-auto ${
                  activeSection === 'hours' ? 'text-white' : 'text-emerald-400'
                }`} />
                <h3 className={`text-xl font-bold mb-2 ${
                  activeSection === 'hours' ? 'text-white' : 'text-gray-300'
                }`}>
                  Volunteer Hours
                </h3>
                <p className={`text-sm ${
                  activeSection === 'hours' ? 'text-white/80' : 'text-gray-400'
                }`}>
                  Earn high school volunteer hours
                </p>
              </button>
            </div>
          </div>

          {/* Exec Team Section */}
          {activeSection === 'exec' && (
            <div className="bg-gray-900/50 border-2 border-gray-700 rounded-3xl p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-4xl font-black text-white mb-4">Join the Exec Team</h2>
                <p className="text-gray-300 text-lg">
                  Apply for one of our open executive positions and help lead MAH Youth initiatives.
                </p>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white">Loading positions...</p>
                </div>
              ) : execPositions.length === 0 ? (
                <div className="text-center py-12 bg-gray-800/50 rounded-2xl border border-gray-700">
                  <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No positions are currently available.</p>
                  <p className="text-gray-500">Check back soon for new opportunities!</p>
                </div>
              ) : (
                <form onSubmit={handleExecFormSubmit} className="space-y-8">
                  {/* Position Selection */}
                  <div>
                    <label className="block text-white font-bold mb-3 text-lg">Select Position *</label>
                    <select
                      required
                      value={execForm.positionId}
                      onChange={(e) => handleExecPositionSelect(e.target.value)}
                      className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                    >
                      <option value="">Choose a position...</option>
                      {execPositions.map(position => (
                        <option key={position._id} value={position._id}>
                          {position.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedPosition && (
                    <>
                      {/* Position Description */}
                      <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-2">{selectedPosition.title}</h3>
                        <p className="text-gray-300 whitespace-pre-wrap">{selectedPosition.description}</p>
                      </div>

                      {/* Personal Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-white font-bold mb-3">First Name *</label>
                          <input
                            type="text"
                            required
                            value={execForm.firstName}
                            onChange={(e) => setExecForm({...execForm, firstName: e.target.value})}
                            className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-white font-bold mb-3">Last Name *</label>
                          <input
                            type="text"
                            required
                            value={execForm.lastName}
                            onChange={(e) => setExecForm({...execForm, lastName: e.target.value})}
                            className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-white font-bold mb-3">Email *</label>
                          <input
                            type="email"
                            required
                            value={execForm.email}
                            onChange={(e) => setExecForm({...execForm, email: e.target.value})}
                            className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-white font-bold mb-3">Phone *</label>
                          <input
                            type="tel"
                            required
                            value={execForm.phone}
                            onChange={(e) => setExecForm({...execForm, phone: e.target.value})}
                            className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                          />
                        </div>
                      </div>

                      {/* Custom Questions */}
                      {selectedPosition.questions && selectedPosition.questions.length > 0 && (
                        <div className="space-y-6">
                          <h3 className="text-2xl font-bold text-white">Application Questions</h3>
                          {selectedPosition.questions.map((question, index) => (
                            <div key={question.id}>
                              <label className="block text-white font-bold mb-3">
                                {question.text} {question.required && '*'}
                              </label>
                              {question.type === 'textarea' ? (
                                <textarea
                                  required={question.required}
                                  rows={4}
                                  value={execForm.questionAnswers[index]?.answer || ''}
                                  onChange={(e) => {
                                    const newAnswers = [...execForm.questionAnswers];
                                    newAnswers[index].answer = e.target.value;
                                    setExecForm({...execForm, questionAnswers: newAnswers});
                                  }}
                                  className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                                />
                              ) : question.type === 'select' ? (
                                <select
                                  required={question.required}
                                  value={execForm.questionAnswers[index]?.answer || ''}
                                  onChange={(e) => {
                                    const newAnswers = [...execForm.questionAnswers];
                                    newAnswers[index].answer = e.target.value;
                                    setExecForm({...execForm, questionAnswers: newAnswers});
                                  }}
                                  className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                                >
                                  <option value="">Select an option...</option>
                                  {question.options?.map(opt => (
                                    <option key={opt.id} value={opt.text}>{opt.text}</option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type={question.type}
                                  required={question.required}
                                  value={execForm.questionAnswers[index]?.answer || ''}
                                  onChange={(e) => {
                                    const newAnswers = [...execForm.questionAnswers];
                                    newAnswers[index].answer = e.target.value;
                                    setExecForm({...execForm, questionAnswers: newAnswers});
                                  }}
                                  className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-accent to-accent-light text-white px-8 py-5 rounded-xl hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-2 group"
                      >
                        Submit Application
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </>
                  )}
                </form>
              )}
            </div>
          )}

          {/* Youth Committee Section */}
          {activeSection === 'youth' && (
            <div className="bg-gray-900/50 border-2 border-gray-700 rounded-3xl p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-4xl font-black text-white mb-4">Join the Youth Committee</h2>
                <p className="text-gray-300 text-lg mb-6">
                  Be part of the team that plans and organizes events and activities for the youth community.
                </p>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
                  <p className="text-purple-200 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <strong>You will be added to our WhatsApp group after submitting this form!</strong>
                  </p>
                </div>
              </div>

              <form onSubmit={handleYouthCommitteeSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-bold mb-3">First Name *</label>
                    <input
                      type="text"
                      required
                      value={youthCommitteeForm.firstName}
                      onChange={(e) => setYouthCommitteeForm({...youthCommitteeForm, firstName: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-bold mb-3">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={youthCommitteeForm.lastName}
                      onChange={(e) => setYouthCommitteeForm({...youthCommitteeForm, lastName: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-bold mb-3">Age *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="120"
                      value={youthCommitteeForm.age}
                      onChange={(e) => setYouthCommitteeForm({...youthCommitteeForm, age: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-bold mb-3">Gender *</label>
                    <select
                      required
                      value={youthCommitteeForm.gender}
                      onChange={(e) => setYouthCommitteeForm({...youthCommitteeForm, gender: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                    >
                      <option value="">Select gender...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-bold mb-3">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={youthCommitteeForm.phone}
                      onChange={(e) => setYouthCommitteeForm({...youthCommitteeForm, phone: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-bold mb-3">Email *</label>
                    <input
                      type="email"
                      required
                      value={youthCommitteeForm.email}
                      onChange={(e) => setYouthCommitteeForm({...youthCommitteeForm, email: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-5 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-2 group"
                >
                  Submit Application
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>
            </div>
          )}

          {/* Volunteer Hours Section */}
          {activeSection === 'hours' && (
            <div className="bg-gray-900/50 border-2 border-gray-700 rounded-3xl p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-4xl font-black text-white mb-4">Volunteer Hours Team</h2>
                <p className="text-gray-300 text-lg">
                  Get your high school volunteer hours by helping at our events and programs. Perfect for students needing community service hours!
                </p>
              </div>

              <form onSubmit={handleVolunteerHoursSubmit} className="space-y-8">
                {/* Student Information */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Student Information</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-bold mb-3">First Name *</label>
                        <input
                          type="text"
                          required
                          value={volunteerHoursForm.firstName}
                          onChange={(e) => setVolunteerHoursForm({...volunteerHoursForm, firstName: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-bold mb-3">Last Name *</label>
                        <input
                          type="text"
                          required
                          value={volunteerHoursForm.lastName}
                          onChange={(e) => setVolunteerHoursForm({...volunteerHoursForm, lastName: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-bold mb-3">Age *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          max="120"
                          value={volunteerHoursForm.age}
                          onChange={(e) => setVolunteerHoursForm({...volunteerHoursForm, age: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-bold mb-3">Gender *</label>
                        <select
                          required
                          value={volunteerHoursForm.gender}
                          onChange={(e) => setVolunteerHoursForm({...volunteerHoursForm, gender: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        >
                          <option value="">Select gender...</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-bold mb-3">Phone *</label>
                        <input
                          type="tel"
                          required
                          value={volunteerHoursForm.phone}
                          onChange={(e) => setVolunteerHoursForm({...volunteerHoursForm, phone: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-bold mb-3">Email *</label>
                        <input
                          type="email"
                          required
                          value={volunteerHoursForm.email}
                          onChange={(e) => setVolunteerHoursForm({...volunteerHoursForm, email: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-bold mb-3">High School *</label>
                      <input
                        type="text"
                        required
                        value={volunteerHoursForm.highSchool}
                        onChange={(e) => setVolunteerHoursForm({...volunteerHoursForm, highSchool: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Parent Information */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Parent/Guardian Information</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-bold mb-3">Parent First Name *</label>
                        <input
                          type="text"
                          required
                          value={volunteerHoursForm.parentFirstName}
                          onChange={(e) => setVolunteerHoursForm({...volunteerHoursForm, parentFirstName: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-bold mb-3">Parent Last Name *</label>
                        <input
                          type="text"
                          required
                          value={volunteerHoursForm.parentLastName}
                          onChange={(e) => setVolunteerHoursForm({...volunteerHoursForm, parentLastName: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-bold mb-3">Parent Phone *</label>
                        <input
                          type="tel"
                          required
                          value={volunteerHoursForm.parentPhone}
                          onChange={(e) => setVolunteerHoursForm({...volunteerHoursForm, parentPhone: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-bold mb-3">Parent Email *</label>
                        <input
                          type="email"
                          required
                          value={volunteerHoursForm.parentEmail}
                          onChange={(e) => setVolunteerHoursForm({...volunteerHoursForm, parentEmail: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-2 group"
                >
                  Submit Application
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
};

export default VolunteeringPage;
