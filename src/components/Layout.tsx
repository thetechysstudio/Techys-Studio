
import React from 'react';
import Navbar from './Navbar.tsx';

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

      <footer className="px-6 md:px-12 lg:px-20 py-20 border-t border-stone-50 bg-stone-50/30 text-center w-full">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-stone-300">The Techys Studio</h2>
            <div className="w-8 h-px bg-stone-200"></div>
          </div>
          <p className="text-stone-400 text-[10px] font-medium tracking-[0.1em] uppercase">
            © 2024 THE TECHYS STUDIO • CRAFTED WITH CARE
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
