'use client';

import React, { useEffect } from 'react';
import './Header.css';
import runHeaderAnimations from '../animations/header';
import Link from 'next/link';

const Header = () => {
  useEffect(() => {
    // Ensure code runs after DOM is ready
    const id = requestAnimationFrame(() => {
      runHeaderAnimations();
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <nav>
        <div className="menu-bar">
          <div className="menu-logo">
            <a className='links' href="/"><img className="image" src="/logoB.png" alt="logo" /></a>
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
              <img className="image" src="/logo.png" alt="menu media" />
            </div>
            <div className="menu-content-wrapper">
              <div className="menu-content-main">
                <div className="menu-col">
                  <div className="menu-link">
                    <Link className="links" href="/">Home</Link>
                  </div>
                  <div className="menu-link">
                    <Link className="links" href="/pages/books/">Books</Link>
                  </div>
                  <div className="menu-link">
                    <Link className="links" href="/pages/articles/">Articles</Link>
                  </div>
                  <div className="menu-link">
                    <Link className="links" href="/pages/videos/">Videos</Link>
                  </div>
                  <div className="menu-link">
                    <Link className="links" href="/pages/contact">Contact Us</Link>
                  </div>
                </div>

                <div className="menu-col">
                  {/* <div className="menu-tag"><Link className='links' href="#">Web Animations</Link></div>
                  <div className="menu-tag"><Link className='links' href="#">Interactive Media</Link></div>
                  <div className="menu-tag"><Link className='links' href="#">Motion Craft</Link></div> */}
                </div>
              </div>
              <div className="menu-footer">
                <div className="menu-col">
                  <p className='paragraph'></p>
                </div>
                <div className="menu-col">
                  <p className='paragraph'>info@ar-ribat.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
