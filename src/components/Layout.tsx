
import React from 'react';
import Navbar from './Navbar.tsx';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  onBack?: () => void;
  showCart?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, onBack, showCart = true }) => {
  return (
    <div className="min-h-screen flex flex-col w-full bg-white">
      <Navbar onBack={onBack} showCart={showCart} />

      <main className="flex-1 px-4 md:px-12 lg:px-20 py-10 w-full">
        {children}
      </main>

      <footer className="px-6 md:px-12 lg:px-20 py-20 border-t border-stone-200 bg-stone-50/40 w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">

          {/* BRAND */}
          <div className="space-y-4">
            {/* Logo */}
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-stone-200 bg-white flex items-center justify-center">
                <img
                  src="/The-Techys-Studio.jpeg"
                  alt="The Techys Studio logo"
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-xs font-semibold tracking-[0.35em] uppercase text-stone-700">
                The Techys Studio
              </h2>
            </div>

            <p className="text-stone-500 text-sm leading-relaxed">
              Techys Studio creates smart, creative digital gifts that blend technology
              with emotion — designed to make memories last forever.
            </p>
          </div>

          {/* PAGES */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-700">
              Pages
            </h3>
            <ul className="space-y-2 text-sm text-stone-500">
              <li><Link to="/home" className="hover:text-black">Home</Link></li>
              <li><Link to="/product" className="hover:text-black">Products</Link></li>
              <li><Link to="/memory-card-designs" className="hover:text-black">Memory Card Designs</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-700">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-stone-500">
              {/* <li>📞 +91 98765 43210</li>
              <li>📞 +91 91234 56789</li> */}
              <li>
                <a href="mailto:thetechysstudio@gmail.com" className="hover:text-black">
                  thetechysstudio@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919345857852"
                  target="_blank"
                  className="hover:text-black"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`https://ig.me/m/the_techys_studio`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-700">
              Social
            </h3>
            <ul className="space-y-2 text-sm text-stone-500">
              <li>
                <a
                  href="https://instagram.com/the_techys_studio"
                  target="_blank"
                  className="hover:text-black"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://threads.net/@the_techys_studio"
                  target="_blank"
                  className="hover:text-black"
                >
                  Threads
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="mt-16 pt-6 border-t border-stone-200 text-center">
          <p className="text-stone-400 text-[10px] font-medium tracking-[0.15em] uppercase">
            © 2026 The Techys Studio • Crafted With Care
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Layout;
