import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { IeeeLogo } from './ui/hero-odyssey';

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Chapters', path: '/chapters' },
    { name: 'Events', path: '/events' },
    { name: 'Board', path: '/executive-board' },
    { name: 'Achievements', path: '/achievements' }
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 bg-black/30 backdrop-blur-md border-b border-white/5 text-white"
      >
        {/* Left Side: Brand Logo and Title */}
        <div className="flex items-center gap-3 relative z-50">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
            <IeeeLogo className="w-8 h-8 drop-shadow-[0_0_8px_rgba(0,194,255,0.4)]" />
            <span className="font-display font-bold text-lg tracking-wider text-white">
              IEEE <span className="text-ieee-cyan italic">SRM</span>
            </span>
          </Link>
        </div>
        
        {/* Center: Pill-shaped Desktop Menu (Matching Screenshot) */}
        <div className="hidden lg:flex items-center bg-white/5 border border-white/5 rounded-full px-2 py-1 text-xs font-display font-semibold tracking-wider uppercase">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={`relative px-4 py-2 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/10 text-white border border-white/10 shadow-[0_0_12px_rgba(255,255,255,0.05)]' 
                    : 'text-white/70 hover:text-ieee-cyan hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right Side: Join button */}
        <div className="hidden lg:flex items-center gap-4">
          <a 
            href="https://www.ieee.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 bg-white text-black font-display font-bold text-xs uppercase tracking-wider rounded-full hover:bg-ieee-cyan hover:text-black transition-all flex items-center gap-2 group shadow-[0_0_12px_rgba(255,255,255,0.1)]"
          >
            <span className="w-2 h-2 bg-black rounded-full group-hover:animate-ping"></span>
            JOIN IEEE
          </a>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="lg:hidden relative z-50 text-white p-2 hover:text-ieee-cyan transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
           {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-black/95 text-white flex flex-col items-center justify-center pt-20"
          >
            <div className="flex flex-col gap-6 text-center w-full max-w-xs px-6">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link 
                    key={link.path} 
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`py-3 rounded-full text-lg font-display font-medium border transition-colors ${
                      isActive 
                        ? 'text-ieee-cyan border-ieee-cyan/30 bg-ieee-cyan/5' 
                        : 'text-white/80 border-transparent hover:text-ieee-cyan'
                    }`}
                  >
                    <motion.span
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + (i * 0.05), duration: 0.4 }}
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                );
              })}
              
              <a 
                href="https://www.ieee.org/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-6 py-3 bg-white text-black font-display font-bold text-center text-sm uppercase tracking-wider rounded-full shadow-lg hover:bg-ieee-cyan hover:text-black transition-colors"
              >
                JOIN IEEE
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
