
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.tsx';
import { ApiPlan } from '../../types.ts';
import { Check, ArrowRight, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { fetchCookies } from '../services/cookies.ts';
import axios from 'axios';

interface PlansProps {
  onBack: () => void;
  onSelectPlan: (plan: ApiPlan) => void;
}
const BACKEND_URL = "https://api.shop.drmcetit.com/api"
const Plans: React.FC<PlansProps> = ({ onBack, onSelectPlan }) => {
  const { id } = useParams<{ id: string }>();
  const [plans, setPlans] = useState<ApiPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCookies();
  }, []);

  useEffect(() => {
    console.log('Plan ID:', id);
    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/plans/${id}/`,
          {
            headers: {
              'Content-Type': 'application/json',
              //'credentials': 'include', // keep if backend uses cookies/session
            },
          }
        );
        console.log(response.data);
        if (!response.data) throw new Error('Failed to fetch plans');

        const data: ApiPlan[] = response.data;
        setPlans(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <Layout onBack={onBack}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="animate-spin text-stone-300" size={40} />
          <p className="text-stone-400 font-light font-serif text-xl italic">Calculating the best plans for you...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout onBack={onBack}>
      <div className="w-full space-y-16 pb-20">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif">Select Your Plan</h1>
          <p className="text-stone-500 font-light leading-relaxed">Choose how you want your story to be told.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {Array.isArray(plans) &&
            plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col p-10 rounded-[2.5rem] border transition-all duration-500 group ${plan.mostPopular
                  ? 'border-rose-200 bg-rose-50/20 shadow-2xl shadow-rose-100 ring-2 ring-rose-100 scale-105 z-10'
                  : 'border-stone-100 bg-white hover:border-stone-200 shadow-xl shadow-stone-100'
                  }`}
              >
                {plan.mostPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full flex items-center gap-2 whitespace-nowrap shadow-lg">
                    <Sparkles size={12} />
                    Most Popular
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-3xl font-serif mb-3 capitalize">{plan.title}</h3>
                  <p className="text-stone-400 text-sm font-light leading-relaxed min-h-[3rem]">{plan.description}</p>
                </div>
                <div className="flex items-baseline gap-1 mb-10 border-b border-stone-100 pb-8">
                  <span className="text-4xl font-serif text-stone-900">{plan.startingPrice}</span>
                </div>
                <div className="space-y-5 mb-12 flex-1">
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-stone-600">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.mostPopular ? 'bg-rose-100 text-rose-500' : 'bg-stone-50 text-stone-400'}`}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => onSelectPlan(plan)}
                  className={`w-full py-4 cursor-pointer rounded-2xl font-medium flex items-center justify-center gap-3 transition-all active:scale-95 ${plan.custom
                    ? 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                    : plan.mostPopular
                      ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-xl '
                      : 'bg-stone-900 text-white hover:bg-stone-800'
                    }`}
                >
                  {plan.custom ? <><MessageSquare size={20} />Contact Support</> : <>Select {plan.title}<ArrowRight size={20} /></>}
                </button>
              </div>
            ))
          }
        </div>
      </div>
    </Layout>
  );
};

export default Plans;
