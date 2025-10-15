"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Mail, Phone, Send, MessageCircle, MapPin, Instagram } from 'lucide-react';
import Header from "/components/header/Header";
import Footer from '../../../components/footer/Footer';
import Swal from 'sweetalert2';

const web3formsKey = '4811c4ac-102d-47ca-98eb-fb475f877a96'; // Replace with your actual key
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

  // Start with false; update later in useEffect
  const [submitted, setSubmitted] = useState(false);

  // ✅ Safe check in the browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const lastSubmitted = localStorage.getItem('contactFormSubmittedAt');
      if (lastSubmitted && Date.now() - parseInt(lastSubmitted, 10) < twelveHours) {
        setSubmitted(true);
      }
    }
  }, []);

  useEffect(() => {
    // Load GSAP dynamically
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

        // Animate success message using GSAP
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
          confirmButtonColor: 'var(--color-accent)' 
        });
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      Swal.fire({ 
        title: 'Error!', 
        text: error.message, 
        icon: 'error', 
        confirmButtonColor: 'var(--color-accent)' 
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
      link: "mailto:youth@mah.ca" 
    },
    { 
      icon: Phone, 
      title: "Call Us", 
      details: "(905) 555-YOUTH", 
      description: "Mon-Fri, 9AM-5PM EST", 
      link: "tel:+19055559684" 
    },
    { 
      icon: MapPin, 
      title: "Visit Us", 
      details: "Muslim Association of Hamilton", 
      description: "1545 Stone Church Rd E, Hamilton, ON", 
      link: "https://maps.google.com" 
    },
    { 
      icon: Instagram, 
      title: "Instagram", 
      details: "@mahyouth", 
      description: "Follow us for updates", 
      link: "https://instagram.com/mahyouth" 
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen py-[200px]" style={{background: 'var(--gradient-primary)'}}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div ref={headerRef} className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="hidden md:block p-3 rounded-full" style={{backgroundColor: 'var(--color-light)'}}>
                <MessageCircle className="w-8 h-8" style={{color: 'var(--color-accent)'}} />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold" style={{color: 'var(--color-light)'}}>
                Get in <span style={{color: 'var(--color-accent)'}}>Touch</span>
              </h1>
            </div>
            <p className="text-xl max-w-3xl mx-auto" style={{color: 'var(--color-light)'}}>
              Have questions, suggestions, or want to get involved? We'd love to hear from you. Reach out to the MAH Youth community.
            </p>
            <div className="w-24 h-1 mx-auto mt-6 rounded-full" style={{backgroundColor: 'var(--color-accent)'}}></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div ref={formRef} className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8" style={{boxShadow: 'var(--shadow-lg)'}}>
                <div className="flex items-center gap-3 mb-6">
                  <Send className="w-6 h-6" style={{color: 'var(--color-accent)'}} />
                  <h2 className="text-2xl font-bold" style={{color: 'var(--color-primary)'}}>Send Us a Message</h2>
                </div>

                {/* Success Message */}
                {submitted && (
                  <div 
                    ref={successRef} 
                    className="px-4 py-3 rounded-xl mb-6 flex items-center gap-2"
                    style={{
                      backgroundColor: 'var(--color-success)',
                      color: 'var(--color-light)',
                      border: '1px solid var(--color-success)'
                    }}
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--color-light)'}}>
                      <span style={{color: 'var(--color-success)'}} className="text-xs font-bold">✓</span>
                    </div>
                    <span>Thank you! Your message has been sent successfully. We'll get back to you soon.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2" style={{color: 'var(--color-primary)'}}>
                        Full Name
                      </label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-4 py-3 rounded-xl outline-none transition-all" 
                        style={{
                          border: '1px solid var(--border-color)',
                          color: 'var(--color-primary)'
                        }}
                        placeholder="Your full name" 
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2" style={{color: 'var(--color-primary)'}}>
                        Email Address
                      </label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-4 py-3 rounded-xl outline-none transition-all" 
                        style={{
                          border: '1px solid var(--border-color)',
                          color: 'var(--color-primary)'
                        }}
                        placeholder="your.email@example.com" 
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="number" className="block text-sm font-medium mb-2" style={{color: 'var(--color-primary)'}}>
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      id="number" 
                      name="number" 
                      value={formData.number} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all" 
                      style={{
                        border: '1px solid var(--border-color)',
                        color: 'var(--color-primary)'
                      }}
                      placeholder="Your phone number" 
                    />
                  </div>

                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium mb-2" style={{color: 'var(--color-primary)'}}>
                      Reason for Contact
                    </label>
                    <select 
                      id="reason" 
                      name="reason" 
                      value={formData.reason} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all" 
                      style={{
                        border: '1px solid var(--border-color)',
                        color: 'var(--color-primary)'
                      }}
                    >
                      <option value="">Select a reason</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Event Information">Event Information</option>
                      <option value="Volunteer Opportunity">Volunteer Opportunity</option>
                      <option value="Youth Leadership">Youth Leadership</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2" style={{color: 'var(--color-primary)'}}>
                      Message
                    </label>
                    <textarea 
                      id="message" 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      required 
                      rows={6} 
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all resize-none" 
                      style={{
                        border: '1px solid var(--border-color)',
                        color: 'var(--color-primary)'
                      }}
                      placeholder="Tell us more..."
                    ></textarea>
                  </div>

                  {!submitted && (
                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="w-full font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: 'var(--btn-primary-bg)',
                        color: 'var(--btn-primary-fg)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--btn-primary-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--btn-primary-bg)'}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  )}
                  {submitted && (
                    <p className="text-center mt-4" style={{color: 'var(--color-accent)'}}>
                      You've already submitted. Please wait 12 hours before submitting again.
                    </p>
                  )}
                </form>
              </div>
            </div>

            <div ref={infoRef} className="space-y-8">
              <div className="bg-white rounded-2xl p-6" style={{boxShadow: 'var(--shadow-lg)'}}>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{color: 'var(--color-primary)'}}>
                  <Phone className="w-5 h-5" style={{color: 'var(--color-accent)'}} /> Contact Information
                </h3>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <a 
                        key={index} 
                        href={info.link} 
                        className="flex items-start gap-4 p-4 rounded-xl transition-colors group"
                        style={{backgroundColor: 'transparent'}}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-light-gray)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div 
                          className="p-3 rounded-full transition-colors"
                          style={{backgroundColor: 'var(--color-light-gray)'}}
                        >
                          <IconComponent className="w-5 h-5" style={{color: 'var(--color-accent)'}} />
                        </div>
                        <div>
                          <h4 className="font-semibold transition-colors" style={{color: 'var(--color-primary)'}}>
                            {info.title}
                          </h4>
                          <p className="font-medium" style={{color: 'var(--color-primary)', opacity: 0.8}}>
                            {info.details}
                          </p>
                          <p className="text-sm" style={{color: 'var(--color-medium-gray)'}}>
                            {info.description}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
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