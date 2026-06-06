'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  role: string;
}

export default function Navbar({ user }: { user: User | null }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const getDashboardLink = () => {
    if (!user) return null;
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'FARMER') return '/farmer/dashboard';
    return '/buyer/dashboard';
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav id="navbar" className={isScrolled ? 'scrolled' : ''}>
        <Link href="/" className="nav-logo">
          <span className="logo-dot" /> Agriconnect
        </Link>
        <ul className="nav-links">
          <li>
            <a href="#how">How it works</a>
          </li>
          <li>
            <a href="#products">Products</a>
          </li>
          <li>
            <a href="#farmers">For Farmers</a>
          </li>
          {user ? (
            <li>
              <Link href={getDashboardLink() || '#'}>Dashboard</Link>
            </li>
          ) : (
            <li>
              <Link href="/login">Sign In</Link>
            </li>
          )}
        </ul>
        <Link href={user ? '/store' : '/login'} className="nav-cta">
          {user ? 'Go to Store' : 'Start Buying'}
        </Link>

        {/* Hamburger button — visible on mobile only via CSS */}
        <button
          className={`mobile-menu-btn ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Full-screen mobile menu overlay */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <a href="#how" onClick={closeMenu}>How it works</a>
        <a href="#products" onClick={closeMenu}>Products</a>
        <a href="#farmers" onClick={closeMenu}>For Farmers</a>
        {user ? (
          <Link href={getDashboardLink() || '#'} onClick={closeMenu}>
            Dashboard
          </Link>
        ) : (
          <Link href="/login" onClick={closeMenu}>
            Sign In
          </Link>
        )}
        <Link
          href={user ? '/store' : '/login'}
          className="mobile-cta"
          onClick={closeMenu}
        >
          {user ? 'Go to Store' : 'Start Buying'}
        </Link>
      </div>
    </>
  );
}
