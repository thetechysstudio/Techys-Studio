
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.tsx';
import { ApiProduct } from '../../types.ts';
import { Check, Loader2, ArrowRight, Camera, Video, Sparkles, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useErrorStatus } from '../services/errorStatus.ts';

interface ProductDetailProps {
  onBack: () => void;
  singleMode?: boolean;
}
const BACKEND_URL = "https://api.shop.drmcetit.com/api"
const ProductDetail: React.FC<ProductDetailProps> = ({ onBack, singleMode = false }) => {
  const { errorStatus } = useErrorStatus();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/products/`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.data) throw new Error('Failed to fetch products');

        const data: ApiProduct[] = response.data;
        setProducts(data);
      } catch (err) {
        console.error(err);
        errorStatus(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  if (loading) {
    return (
      <Layout onBack={onBack}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <Loader2 className="animate-spin text-stone-200" size={32} />
          <p className="text-stone-400 font-serif text-2xl italic">Preparing the collection...</p>
        </div>
      </Layout>
    );
  }

  const displayedProducts = singleMode ? products.slice(0, 1) : products;

  return (
    <Layout onBack={onBack}>
      <div className="max-w-7xl mx-auto pb-32">
        {!singleMode && (
          <div className="text-center space-y-6 max-w-3xl mx-auto mb-32 pt-12 animate-in fade-in slide-in-from-top-4 duration-1000">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-serif text-stone-900 tracking-tight">The Collection</h1>
            <p className="text-stone-400 font-light leading-relaxed text-lg md:text-xl max-w-2xl mx-auto">
              Heirloom digital keepsakes. Bridging your most cherished moments between the physical and the infinite.
            </p>
          </div>
        )}

        <div className="space-y-48">
          {displayedProducts.map((product, index) => (
            <div
              key={product.id}
              className={`flex flex-col lg:flex-row items-center gap-5 ${index % 2 !== 0 && !singleMode ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className="w-full lg:w-1/2 flex justify-center">
                <div className="relative group w-full max-w-lg">
                  <div className="bg-white p-5 pb-24 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.12)] border border-stone-100 transition-all duration-1000 hover:-rotate-1 hover:scale-[1.01]">
                    <div className="aspect-square bg-stone-50 overflow-hidden relative">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${product.id}/1200/1200`; }}
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-stone-100 rounded-full blur-[100px] opacity-40 -z-10" />
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-50 rounded-full blur-[100px] opacity-30 -z-10" />
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <div className="space-y-10">

                  {/* Title + Price */}
                  <div>
                    <h2 className="text-[44px] md:text-[44px] lg:text-[42px] font-serif text-stone-900 leading-[1.05] tracking-tight">
                      {product.title}
                    </h2>

                    <p className="text-xl md:text-2xl text-stone-600 font-light font-serif italic">
                      {product.priceRange ? product.priceRange : "Starts from ₹49"}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="space-y-6 max-w-xl">
                    <p className="text-stone-500 font-light leading-relaxed text-[17px]">
                      {product.description}
                    </p>

                    {/* <p className="text-stone-500 font-light leading-relaxed text-[17px]">
                      {product.description2 ||
                        "Crafted with premium 300gsm textured cardstock, these aren't just gifts—they are experiences that last a lifetime."}
                    </p> */}
                  </div>

                  {/* WHY YOU'LL LOVE IT */}
                  <div className="space-y-6">
                    <p className="text-[11px] uppercase tracking-[0.35em] text-stone-400 font-semibold">
                      Why you'll love it
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
                      {(product.features?.length
                        ? product.features
                        : [
                          "Instant Video Playback",
                          "Secure Memory Vault",
                          "Eco-friendly Material",
                          "Matte Fine-Art Finish",
                          "Custom Typography",
                          "Global Shipping",
                        ]
                      ).map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
                            <Check size={14} className="text-stone-600" strokeWidth={3} />
                          </span>

                          <span className="text-[15px] text-stone-700 font-medium">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="space-y-4 pt-2">
                    <button
                      onClick={() => {
                        navigate(`/plans/${product.id}`);
                      }}
                      className="w-full py-5 cursor-pointer rounded-2xl bg-stone-900 text-white font-semibold text-base md:text-lg shadow-lg hover:bg-stone-800 active:scale-[0.99] transition-all"
                    >
                      Choose Your Plan
                    </button>

                    <p className="text-center text-xs text-stone-400">
                      {product.note || "Free shipping on orders over 500 rs. No subscription required."}
                    </p>
                  </div>

                </div>
              </div>


            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
