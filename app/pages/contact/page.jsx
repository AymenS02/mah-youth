"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Mail, Phone, Send, MessageCircle, Globe, Youtube, Twitter } from 'lucide-react';
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
          }, 4000); // hide after 4 seconds
        }

        Swal.fire({ title: 'Success!', text: 'Your message has been sent successfully.', icon: 'success', confirmButtonColor: '#f59e0b' });
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      Swal.fire({ title: 'Error!', text: error.message, icon: 'error', confirmButtonColor: '#f59e0b' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Mail, title: "Email Us", details: "ar-ribat@tuta.com", description: "Send us an email anytime", link: "mailto:ar-ribat@tuta.com" },
    { icon: Globe, title: "Website", details: "www.ribatfoundation.org", description: "Explore our resources", link: "https://www.ribatfoundation.org" },
    { icon: Youtube, title: "YouTube", details: "Ar Ribat Foundation", description: "Watch our latest videos", link: "https://www.youtube.com/@RibatFoundation" },
    { icon: Twitter, title: "Twitter", details: "@RibatFoundation", description: "Follow us on Twitter", link: "https://x.com/RibatFoundation" },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br bg-primary py-[200px]">
        <div className="container mx-auto px-6 max-w-7xl">
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
            <div ref={formRef} className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Send className="w-6 h-6 text-accent" />
                  <h2 className="text-2xl font-bold text-gray-800">Send Us a Message</h2>
                </div>

                {/* Success Message */}
                {submitted && (
                  <div ref={successRef} className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Thank you! Your message has been sent successfully. We'll get back to you soon.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all" placeholder="Your full name" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all" placeholder="your.email@example.com" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input type="tel" id="number" name="number" value={formData.number} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all" placeholder="Your phone number" />
                  </div>

                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">Reason for Contact</label>
                    <select id="reason" name="reason" value={formData.reason} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all">
                      <option value="">Select a reason</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Report Issue">Report Issue</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={6} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all resize-none" placeholder="Tell us more..."></textarea>
                  </div>

                  {!submitted && (
                    <button type="submit" disabled={isSubmitting} className="w-full bg-accent hover:bg-primary text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  )}
                  {submitted && (
                    <p className="text-center text-accent mt-4">You've already submitted. Please wait 12 hours before submitting again.</p>
                  )}
                </form>
              </div>
            </div>

            <div ref={infoRef} className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-accent" /> Contact Information
                </h3>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <a key={index} href={info.link} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                        <div className="bg-light p-3 rounded-full group-hover:bg-light transition-colors">
                          <IconComponent className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 group-hover:text-accent transition-colors">{info.title}</h4>
                          <p className="text-gray-600 font-medium">{info.details}</p>
                          <p className="text-sm text-gray-500">{info.description}</p>
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
