'use client';

import React, { useEffect } from 'react';
import './Header.css';
import runHeaderAnimations from '../animations/header';
import Link from 'next/link';

const Header = () => {
  useEffect(() => {
    // Ensure code runs after DOM is ready
    let cleanup;
    const id = requestAnimationFrame(() => {
      cleanup = runHeaderAnimations();
    });
    return () => {
      cancelAnimationFrame(id);
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div className="header-component">
      <nav>
        <div className="menu-bar">
          <div className="menu-logo">
            <a className='links' href="/"><img className="image" src="/logoA.png" alt="MAH Youth Logo" /></a>
          </div>
          <div className="menu-toggle-btn">
            <div className="menu-toggle-label">
              <p className='paragraph-icon'>Menu</p>
            </div>
            <div className="menu-hamburger-icon">
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <div className="menu-overlay">
          <div className="menu-overlay-content">
            <div className="menu-media-wrapper">
              <img className="image" src="/logo.png" alt="MAH Youth" />
            </div>
            <div className="menu-content-wrapper">
              <div className="menu-content-main">
                <div className="menu-col">
                  <div className="menu-link">
                    <Link className="links" href="/">Home</Link>
                  </div>
                  <div className="menu-link">
                    <Link className="links" href="/pages/events">Events</Link>
                  </div>
                  <div className="menu-link">
                    <Link className="links" href="/pages/programs">Programs</Link>
                  </div>
                  <div className="menu-link">
                    <Link className="links" href="/pages/volunteering">Volunteering</Link>
                  </div>
                  {/* <div className="menu-link">
                    <Link className="links" href="/about">About Us</Link>
                  </div> */}
                  <div className="menu-link">
                    <Link className="links" href="/pages/contact">Contact</Link>
                  </div>
                </div>

                <div className="menu-col">
                  {/* Additional menu items can go here */}
                </div>
              </div>
              <div className="menu-footer">
                <div className="menu-col">
                  <p className='paragraph'>Muslim Association of Hamilton Youth</p>
                </div>
                <div className="menu-col">
                  <p className='paragraph'>youth@hamiltonmosque.com</p>
                </div>
                <div className="menu-col">
                  <Link className="links" href="/pages/login">Admin Portal</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;