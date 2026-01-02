'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Acasă' },
    { href: '/anunturi-evenimente', label: 'Anunțuri Evenimente' },
    { href: '/anunturi-politie', label: 'Anunțuri Poliție' },
    { href: '/cerere-eveniment', label: 'Cerere Eveniment' },
    { href: '/ghiduri', label: 'Ghid-uri' },
  ];

  return (
    <header className="glass-navbar sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-14 h-14 flex-shrink-0">
              <Image
                src="/images/logo-politia.png"
                alt="Logo Inspectoratul de Poliție Județean Los Santos"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                sizes="56px"
              />
            </div>
            <div className="hidden sm:block">
              <div className="font-semibold text-sm text-[var(--text-primary)] leading-tight">
                Inspectoratul de Poliție
              </div>
              <div className="text-xs text-[var(--text-secondary)] leading-tight">
                Județean Los Santos
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors relative group rounded-lg hover:bg-[var(--hover-bg)]"
              >
                {item.label}
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[var(--primary)] transition-all group-hover:w-3/4 rounded-full"></span>
              </Link>
            ))}
            <div className="ml-4 pl-4 border-l border-[var(--glass-border)]">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="lg:hidden flex items-center space-x-3">
            <ThemeToggle />
            <button
              className="p-2 text-[var(--text-primary)] hover:bg-[var(--hover-bg)] rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden pb-4 space-y-1 overflow-hidden border-t border-[var(--glass-border)] mt-2 pt-4 glass-card"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-2.5 px-4 text-sm text-[var(--text-primary)] hover:text-[var(--primary)] hover:bg-[var(--hover-bg)] rounded-lg transition-colors mx-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
