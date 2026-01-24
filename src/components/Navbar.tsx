import React, { useEffect, useState } from 'react';
import { ShoppingBag, ChevronLeft, Menu, X } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface NavbarProps {
  onBack?: () => void;
  showCart?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onBack, showCart = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [isLogined, setIsLogined] = useState(false) // Change to flase to test login button

  const isHome = location.pathname === '/';
  const isProducts = location.pathname.startsWith('/product');

  useEffect(() => {
    if(localStorage.getItem("accessToken")){
      setIsLogined(true)
    }
  })

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when menu open
  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-stone-100 px-4 md:px-12 lg:px-16 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6 lg:gap-14">
          {/* Back Button + Branding */}
          <div className="flex items-center gap-4">
            {/* {onBack && !isMenuOpen && (
              <button
                onClick={onBack}
                className="p-1 -ml-1 text-stone-900 hover:opacity-60 transition-opacity"
                aria-label="Go back"
              >
                <ChevronLeft size={22} strokeWidth={2.5} />
              </button>
            )} */}

            <Link
              to="/"
              className="text-lg md:text-xl font-bold tracking-tight uppercase whitespace-nowrap"
            >
              THE TECHYS
              <span className="font-light italic text-stone-400 normal-case ml-1">
                Studio
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10 lg:gap-12">
            <Link
              to="/home"
              className={`text-[11px] uppercase tracking-[0.25em] font-bold transition-all relative py-1 ${
                isHome
                  ? 'text-stone-900'
                  : 'text-stone-400 hover:text-stone-900'
              }`}
            >
              Home
              {isHome && (
                <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-stone-900" />
              )}
            </Link>

            <div className="flex items-center gap-8 lg:gap-10">
              <Link
                to="/product"
                className={`text-[11px] uppercase tracking-[0.25em] font-bold transition-all relative py-1 ${
                  isProducts
                    ? 'text-stone-900'
                    : 'text-stone-400 hover:text-stone-900'
                }`}
              >
                Products
                {isProducts && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-stone-900" />
                )}
              </Link>
            </div>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            className="p-1 mr-2 md:hidden text-stone-800 relative z-[60]"
            aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {isLogined && (
            <Link
              to="/orders"
              className="relative p-2 text-stone-900 hover:scale-105 transition-transform group"
            >
              <ShoppingBag size={24} strokeWidth={1.2} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-400 rounded-full border border-white" />
            </Link>
          )}

          {!isLogined && (
            <Link
              to="/login"
              className="bg-stone-900 text-white px-6 py-2 rounded-md relative p-2 text-stone-900 hover:scale-105 transition-transform group font-medium"
            >
              <p className="text-white">Login</p>
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay (outside header) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[55] bg-white md:hidden pt-24 px-8 flex flex-col justify-between pb-12">
          {/* Close button inside overlay too (optional but nice) */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-4 p-2 text-stone-800"
            aria-label="Close Menu"
          >
            <X size={22} />
          </button>

          <nav className="flex flex-col gap-10">
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.4em] text-stone-300 font-bold">
                Navigate
              </p>

              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`text-5xl font-serif text-left block w-full ${
                  isHome ? 'text-stone-900 italic' : 'text-stone-200'
                }`}
              >
                Home
              </Link>

              <Link
                to="/product"
                onClick={() => setIsMenuOpen(false)}
                className={`text-5xl font-serif text-left block w-full ${
                  isProducts ? 'text-stone-900 italic' : 'text-stone-200'
                }`}
              >
                Products
              </Link>
            </div>
          </nav>

          <div className="space-y-6">
            <div className="w-12 h-px bg-stone-100" />
            <p className="text-stone-400 text-sm font-light italic leading-relaxed max-w-[240px]">
              "Bridging the physical and the digital, one memory at a time."
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
