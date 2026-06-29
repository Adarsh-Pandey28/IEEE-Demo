import { motion } from 'framer-motion';

const links = {
  Explore: [
    { label: 'About Us',       id: 'home' },
    { label: 'IEEE Legacy',    id: 'legacy' },
    { label: 'Our Chapters',   id: 'chapters' },
    { label: 'Events',         id: 'events' },
    { label: 'Executive Board',id: 'board' },
    { label: 'Achievements',   id: 'achievements' },
  ],
  Connect: [
    { label: 'IEEE Official Site', href: 'https://www.ieee.org/' },
    { label: 'Join IEEE',          href: 'https://www.ieee.org/membership/join/' },
    { label: 'SRM University-AP',  href: 'https://srmap.edu.in/' },
  ],
};

export default function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      className="relative overflow-hidden bg-ieee-deep text-ieee-light"
      style={{ borderTop: '1px solid rgba(10,102,194,0.3)' }}
    >
      {/* Top gradient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px"
        style={{ background: 'linear-gradient(90deg,transparent,#0A66C2,#00C2FF,#0A66C2,transparent)' }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-32 blur-[80px] opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle,#0A66C2 0%,transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 pt-20 pb-12">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">

          {/* Brand column */}
          <div className="md:col-span-1">
            <h2 className="text-4xl font-display font-bold tracking-tighter text-white mb-2">
              IEEE
              <span className="text-ieee-cyan"> SRM</span>
            </h2>
            <p className="text-xs font-sans font-medium uppercase tracking-widest mb-6" style={{ color: '#00C2FF', opacity: 0.7 }}>
              Student Branch · SRM University-AP
            </p>
            <p className="font-sans text-ieee-light/60 leading-relaxed text-sm">
              The IEEE Student Branch at SRM University-AP enhances the student learning experience through technical and social events, offering access to valuable membership benefits. It also provides vital networking opportunities with global peers, academicians, and professional engineers.
            </p>

            {/* Social / CTA */}
            <div className="mt-8">
              <a
                href="https://www.ieee.org/membership/join/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-sans font-semibold transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg,#0A66C2,#00C2FF)',
                  color: '#fff',
                  boxShadow: '0 4px 24px rgba(10,102,194,0.4)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Join IEEE
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <span
                className="block text-xs font-sans font-bold uppercase tracking-widest mb-6"
                style={{ color: '#00C2FF' }}
              >
                {section}
              </span>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item.label}>
                    {item.id ? (
                      <button
                        onClick={() => scrollTo(item.id)}
                        className="text-ieee-light/60 font-sans text-sm hover:text-white transition-colors text-left group flex items-center gap-2"
                      >
                        <span className="w-0 group-hover:w-3 h-px transition-all duration-300" style={{ background: '#00C2FF' }} />
                        {item.label}
                      </button>
                    ) : (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ieee-light/60 font-sans text-sm hover:text-white transition-colors group flex items-center gap-2"
                      >
                        <span className="w-0 group-hover:w-3 h-px transition-all duration-300" style={{ background: '#00C2FF' }} />
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px w-full mb-8" style={{ background: 'linear-gradient(90deg,transparent,rgba(10,102,194,0.5),transparent)' }} />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-sans text-ieee-light/40">
          <span>
            &copy; {new Date().getFullYear()} IEEE Student Branch, SRM University-AP. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-default transition-colors">Privacy Policy</span>
            <span className="w-px h-4 opacity-30" style={{ background: '#00C2FF' }} />
            <span className="hover:text-white cursor-default transition-colors">Terms of Service</span>
            <span className="w-px h-4 opacity-30" style={{ background: '#00C2FF' }} />
            <a href="https://www.ieee.org/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              IEEE.org
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
