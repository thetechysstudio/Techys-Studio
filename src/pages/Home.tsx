
import React from 'react';
import Layout from '../components/Layout.tsx';
import { ArrowRight } from 'lucide-react';

interface HomeProps {
  onShopNow: () => void;
  onSeePlans: () => void;
}

const Home: React.FC<HomeProps> = ({ onShopNow, onSeePlans }) => {
  return (
    <Layout>
      <div className="flex flex-col items-center text-center pt-16 pb-16 space-y-12 max-w-5xl mx-auto">
        <div className="max-w-4xl space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.1]">
            The New Way to <br />
            <span className="italic font-serif font-normal text-stone-400">Save Your Memories</span>
          </h1>

          <p className="max-w-2xl mx-auto text-stone-500 font-light leading-relaxed text-lg md:text-xl">
            Experience the "Memory Card" — a physical Polaroid that bridges the gap between your digital world and physical keepsakes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto px-4">
          <button
            onClick={onShopNow}
            className="px-12 py-3 cursor-pointer bg-[#33302e] text-white rounded-full font-medium hover:bg-stone-800 transition-all flex items-center justify-center gap-3 group shadow-xl shadow-stone-200"
          >
            <span className="text-base">View Product</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => window.location.href = '/#/memory-card-designs'}
            className="px-12 py-3 cursor-pointer bg-white border border-stone-200 text-stone-800 rounded-full font-medium hover:bg-stone-50 transition-all shadow-sm"
          >
            <span className="text-base">Explore Designs</span>
          </button>
        </div>

        {/* Featured Product Preview */}
        <div className="mt-16 w-full max-w-sm mx-auto group cursor-pointer" onClick={onShopNow}>
          <div className="relative bg-white p-4 pb-12 polaroid-shadow transition-transform group-hover:scale-[1.02] duration-500">
            <div className="aspect-square bg-stone-100 overflow-hidden">
              <img
                src="https://picsum.photos/seed/techys/800/800"
                alt="Memory Card Preview"
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="mt-5 text-left px-2">
              <h3 className="font-serif text-3xl text-stone-800">Polaroids</h3>
              <p className="text-stone-400 text-sm mt-1">Starting from 49 rs</p>
            </div>
            <div className="absolute bottom-5 right-5 w-8 h-8 opacity-20 group-hover:opacity-40 transition-opacity">
              <div className="w-full h-full border border-stone-800 flex items-center justify-center p-1.5">
                <div className="w-full h-full bg-stone-800"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
