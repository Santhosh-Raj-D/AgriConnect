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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getDashboardLink = () => {
    if (!user) return null;
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'FARMER') return '/farmer/dashboard';
    return '/buyer/dashboard';
  };

  return (
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
    </nav>
  );
}
