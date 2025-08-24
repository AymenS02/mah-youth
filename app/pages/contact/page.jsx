'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Globe, User, MessageSquare } from 'lucide-react';
import Header from "/components/header/Header";
import Image from 'next/image';
import Footer from '../../../components/footer/Footer';

const ContactPage = () => {
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    // Load GSAP dynamically
    const loadGSAP = async () => {
      if (typeof window !== 'undefined' && !window.gsap) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
        script.onload = () => {
          initAnimations();
        };
        document.head.appendChild(script);
      } else if (window.gsap) {
        initAnimations();
      }
    };

    const initAnimations = () => {
      // GSAP Animations
      const tl = window.gsap.timeline({ delay: 0.3 });

      window.gsap.set([headerRef.current, formRef.current, infoRef.current], {
        opacity: 0,
        y: 50
      });

      tl.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      })
      .to([formRef.current, infoRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2
      }, "-=0.4");
    };

    loadGSAP();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "info@ar-ribat.org",
      description: "Send us an email anytime",
      link: "mailto:info@ar-ribat.org"
    },
    {
      icon: Globe,
      title: "Website",
      details: "www.ar-ribat.org",
      description: "Explore our resources",
      link: "https://ar-ribat.org"
    }
  ];

  const quickLinks = [
    { title: "Submit Article", description: "Share your Islamic knowledge" },
    { title: "Request Prayer", description: "Ask for community prayers" },
    { title: "Report Issue", description: "Technical or content issues" },
    { title: "Partnership", description: "Collaborate with us" }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br bg-primary py-[200px]">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* Header Section */}
          <div ref={headerRef} className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="hidden md:block bg-white p-3 rounded-full">
                <MessageCircle className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-light">
                Get in <span className="text-accent">Touch</span>
              </h1>
            </div>
            <p className="text-xl text-light max-w-3xl mx-auto">
              Have questions, suggestions, or want to contribute? We'd love to hear from you. Reach out to the Ar-Ribat community.
            </p>
            <div className="w-24 h-1 bg-accent mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Contact Form */}
            <div ref={formRef} className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Send className="w-6 h-6 text-accent" />
                  <h2 className="text-2xl font-bold text-gray-800">Send Us a Message</h2>
                </div>

                {submitStatus === 'success' && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Thank you! Your message has been sent successfully. We'll get back to you soon.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                      placeholder="What is this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent hover:bg-primary text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
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
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div ref={infoRef} className="space-y-8">
              
              {/* Contact Details */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-accent" />
                  Contact Information
                </h3>
                
                <div className="space-y-4">
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <a
                        key={index}
                        href={info.link}
                        className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div className="bg-light p-3 rounded-full group-hover:bg-light transition-colors">
                          <IconComponent className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 group-hover:text-accent transition-colors">
                            {info.title}
                          </h4>
                          <p className="text-gray-600 font-medium">{info.details}</p>
                          <p className="text-sm text-gray-500">{info.description}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>



              {/* Additional Information */}
              <div className="mt-2 bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Other Ways to Connect</h3>
                  <p className="text-gray-600">Join our community and stay updated with our latest content</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6"> 
                  <a
                    href="https://x.com/RibatFoundation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center p-6 border border-gray-200 rounded-xl hover:border-light hover:bg-indigo-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-center mx-auto mb-4">
                      <Image src="/x.png" alt="Twitter" width={36} height={36} />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Twitter</h4>
                    <p className="text-sm text-gray-600">See our content on Twitter</p>
                  </a>
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