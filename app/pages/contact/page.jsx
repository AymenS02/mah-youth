"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Mail, Phone, Send, MessageCircle, MapPin, Instagram, Check } from 'lucide-react';
import Header from "/components/header/Header";
import Footer from '../../../components/footer/Footer';
import Swal from 'sweetalert2';

const web3formsKey = '4811c4ac-102d-47ca-98eb-fb475f877a96';
const twelveHours = 12 * 60 * 60 * 1000;

const ContactPage = () => {
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const successRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    reason: '',
    number: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const lastSubmitted = localStorage.getItem('contactFormSubmittedAt');
      if (lastSubmitted && Date.now() - parseInt(lastSubmitted, 10) < twelveHours) {
        setSubmitted(true);
      }
    }
  }, []);

  useEffect(() => {
    const loadGSAP = async () => {
      if (typeof window !== 'undefined' && !window.gsap) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
        script.onload = initAnimations;
        document.head.appendChild(script);
      } else if (typeof window !== 'undefined' && window.gsap) {
        initAnimations();
      }
    };

    const initAnimations = () => {
      const tl = window.gsap.timeline({ delay: 0.3 });
      window.gsap.set([headerRef.current, formRef.current, infoRef.current], { opacity: 0, y: 50 });
      tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        .to([formRef.current, infoRef.current], { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.2 }, "-=0.4");
    };

    loadGSAP();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: web3formsKey, ...formData })
      });

      const result = await response.json();
      if (result.success) {
        localStorage.setItem('contactFormSubmittedAt', Date.now());
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '', reason: '', number: '' });

        if (successRef.current && window.gsap) {
          window.gsap.fromTo(
            successRef.current,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
          );

          setTimeout(() => {
            window.gsap.to(successRef.current, { opacity: 0, y: -20, duration: 0.6, ease: "power3.in" });
          }, 4000);
        }

        Swal.fire({ 
          title: 'Success!', 
          text: 'Your message has been sent successfully.', 
          icon: 'success', 
          confirmButtonColor: '#10b981'
        });
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      Swal.fire({ 
        title: 'Error!', 
        text: error.message, 
        icon: 'error', 
        confirmButtonColor: '#10b981'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { 
      icon: Mail, 
      title: "Email Us", 
      details: "youth@mah.ca", 
      description: "Send us an email anytime", 
      link: "mailto:youth@mah.ca",
      color: "from-blue-500 to-blue-600"
    },
    { 
      icon: Phone, 
      title: "Call Us", 
      details: "(905) 555-YOUTH", 
      description: "Mon-Fri, 9AM-5PM EST", 
      link: "tel:+19055559684",
      color: "from-emerald-500 to-emerald-600"
    },
    { 
      icon: MapPin, 
      title: "Visit Us", 
      details: "Muslim Association of Hamilton", 
      description: "1545 Stone Church Rd E, Hamilton, ON", 
      link: "https://maps.google.com",
      color: "from-purple-500 to-purple-600"
    },
    { 
      icon: Instagram, 
      title: "Instagram", 
      details: "@mahyouth", 
      description: "Follow us for updates", 
      link: "https://instagram.com/mahyouth",
      color: "from-pink-500 to-rose-600"
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen pt-32 pb-20 bg-gradient-to-b from-primary-dark via-primary-light to-primary">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          
          {/* Header Section */}
          <div ref={headerRef} className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-accent/10 to-accent-light/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-accent/30 shadow-lg">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
              <span className="text-sm font-bold text-accent tracking-wider uppercase">
                Contact Us
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Get in Touch
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light mb-8">
              Have questions, suggestions, or want to get involved? We'd love to hear from you.
            </p>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <div className="w-24 h-1 bg-gradient-to-r from-accent via-accent-light to-accent rounded-full"></div>
              <div className="w-2 h-2 bg-accent-light rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Form Section */}
            <div ref={formRef} className="lg:col-span-2">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Send className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Send Us a Message</h2>
                </div>

                {/* Success Message */}
                {submitted && (
                  <div 
                    ref={successRef} 
                    className="px-4 py-3 rounded-xl mb-6 flex items-center gap-3 bg-emerald-500/20 border border-emerald-500/50"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-emerald-100 text-sm">Thank you! Your message has been sent successfully. We'll get back to you soon.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">
                        Full Name *
                      </label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all" 
                        placeholder="John Doe" 
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                        Email Address *
                      </label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all" 
                        placeholder="john@example.com" 
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="number" className="block text-sm font-medium mb-2 text-gray-300">
                      Phone Number *
                    </label>
                    <input 
                      type="tel" 
                      id="number" 
                      name="number" 
                      value={formData.number} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all" 
                      placeholder="(555) 123-4567" 
                    />
                  </div>

                  {/* Reason */}
                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium mb-2 text-gray-300">
                      Reason for Contact *
                    </label>
                    <select 
                      id="reason" 
                      name="reason" 
                      value={formData.reason} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-gray-900">Select a reason</option>
                      <option value="General Inquiry" className="bg-gray-900">General Inquiry</option>
                      <option value="Event Information" className="bg-gray-900">Event Information</option>
                      <option value="Volunteer Opportunity" className="bg-gray-900">Volunteer Opportunity</option>
                      <option value="Youth Leadership" className="bg-gray-900">Youth Leadership</option>
                      <option value="Other" className="bg-gray-900">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-300">
                      Message *
                    </label>
                    <textarea 
                      id="message" 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      required 
                      rows={6} 
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all resize-none" 
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  {!submitted && (
                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="w-full bg-gradient-to-r from-accent to-accent-light text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  )}
                  
                  {submitted && (
                    <div className="text-center py-4 px-6 bg-accent/10 rounded-xl border border-accent/30">
                      <p className="text-accent font-medium">
                        You've already submitted. Please wait 12 hours before submitting again.
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Contact Info Section */}
            <div ref={infoRef} className="space-y-6">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 shadow-2xl border-2 border-gray-700/50">
                <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  Contact Information
                </h3>
                
                <div className="space-y-4">
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <a 
                        key={index} 
                        href={info.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-4 p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/60 border border-gray-700/50 hover:border-accent/50 transition-all duration-300"
                      >
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${info.color} shadow-lg`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white group-hover:text-accent transition-colors mb-1">
                            {info.title}
                          </h4>
                          <p className="font-medium text-gray-300 mb-1 break-words">
                            {info.details}
                          </p>
                          <p className="text-sm text-gray-400">
                            {info.description}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-gradient-to-br from-accent/10 to-accent-light/10 rounded-2xl p-6 border border-accent/30">
                <h4 className="text-lg font-bold text-white mb-3">💡 Quick Tips</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>We typically respond within 24-48 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>For urgent matters, please call us directly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Follow us on Instagram for instant updates</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;