import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.tsx';
import { OrderState, CustomerDetails } from '../../types.ts';
import { SIZES } from '../../constants.ts';
import { CreditCard, Truck, ShieldCheck, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface CheckoutProps {
  order: OrderState;
  onBack: () => void;
  onConfirm: (details: CustomerDetails) => void;
}
const BACKEND_URL = "https://api-techys-studios.loca.lt"

const Checkout: React.FC<CheckoutProps> = ({ order, onBack, onConfirm }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CustomerDetails>({
    doorNoAndStreet: '',
    district: '',
    city: '',
    pincode: '',
    state: ''
  });

  useEffect(() => {
    const storedOrder = localStorage.getItem('order');
    if (storedOrder != "srdtfyghjkresdtfghjdfgh") {
      navigate('/');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Create FormData manually to match the requested API
    const submissionData = new FormData();
    submissionData.append('doorNoAndStreet', formData.doorNoAndStreet);
    submissionData.append('district', formData.district);
    submissionData.append('city', formData.city);
    submissionData.append('pincode', formData.pincode);
    submissionData.append('state', formData.state);

    try {
      const response = await axios.post(`${BACKEND_URL}/delivery-details/`, {
        headers: {
          'bypass-tunnel-reminder': 'true'
        },
        body: submissionData
      });
      console.log(response.data)
      if (!response.data) {
        throw new Error('Failed to submit delivery details');
      }
      localStorage.setItem('orderConfirmed', "srdtffdfdgdgfyghjkresdtfghjdfgh");

      console.log('Delivery details submitted successfully');
      onConfirm(formData);
    } catch (err) {
      console.error('Submission failed', err);
      // Optional: Show error to user
      alert('Failed to submit delivery details. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = formData.doorNoAndStreet && formData.district && formData.city && formData.pincode && formData.state;

  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        console.log("Calling order summary")
        const response = await axios.get(`${BACKEND_URL}/order-summary/`, {
          headers: { 'bypass-tunnel-reminder': 'true' }
        });
        if (!response.data) throw new Error('Failed to fetch summary');
        console.log(response.data);
        setSummary(response.data);
      } catch (err) {
        console.error(err);
        setError('Could not load latest pricing. Using standard rates.');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const selectedSize = SIZES.find(s => s.label === order.size) || SIZES[0];
  const planAddon = order.plan?.id === 'plan-2' ? 10 : 0;

  // Use fetched summary if available, otherwise fallback to local calculation
  const unitPrice = summary?.unitPrice ?? (selectedSize.basePrice + planAddon);
  // API returns 'price' as subtotal before discount
  const subtotal = summary?.price ?? (unitPrice * order.quantity);
  // API returns 'offerPrice' as price after discount (so discount amount is price - offerPrice)
  const discountPercent = summary?.offerPercentage ?? (order.quantity > selectedSize.discountThreshold ? selectedSize.discountPercent : 0);
  const discountAmount = summary ? (summary.price - summary.offerPrice) : (order.quantity > selectedSize.discountThreshold ? (subtotal * (selectedSize.discountPercent / 100)) : 0);
  const deliveryCharge = summary?.deliveryCharge ?? 0;
  const finalTotal = summary?.totalAmount ?? (subtotal - discountAmount);

  const hasDiscount = discountAmount > 0;

  return (
    <Layout onBack={onBack}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h2 className="text-3xl font-serif">Delivery Address</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea name="doorNoAndStreet" value={formData.doorNoAndStreet} onChange={handleChange} required rows={2} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none resize-none" placeholder="Door No and Street" />
            <div className="grid grid-cols-2 gap-4">
              <input name="district" value={formData.district} onChange={handleChange} required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none" placeholder="District" />
              <input name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none" placeholder="City" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input name="pincode" value={formData.pincode} onChange={handleChange} required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none" placeholder="Pincode" />
              <input name="state" value={formData.state} onChange={handleChange} required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none" placeholder="State" />
            </div>
            <button type="submit" disabled={!isFormValid || submitting} className="w-full py-4 bg-stone-900 text-white rounded-xl font-medium shadow-xl disabled:opacity-50 flex items-center justify-center gap-2">
              <CreditCard size={20} /> {submitting ? 'Processing...' : "Confirm"}
              {/* <CreditCard size={20} /> {submitting ? 'Processing...' : `Pay ${Math.round(finalTotal)} rs`} */}
            </button>
          </form>
          <div className="flex items-center justify-center gap-6 opacity-40">
            <ShieldCheck size={20} /> <Truck size={20} />
          </div>
        </div>

        <div className="bg-stone-50 rounded-3xl p-8 space-y-8 border border-stone-100">
          <h3 className="text-xl font-serif">Order Summary</h3>
          {loading ? (
            <div className="space-y-8 animate-pulse">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-stone-200 rounded-lg"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-stone-200 rounded w-3/4"></div>
                  <div className="h-3 bg-stone-200 rounded w-1/2"></div>
                  <div className="h-4 bg-stone-200 rounded w-1/3 pt-2"></div>
                </div>
              </div>
              <div className="pt-6 border-t border-stone-200 space-y-3">
                <div className="flex justify-between"><div className="h-3 bg-stone-200 rounded w-1/4"></div><div className="h-3 bg-stone-200 rounded w-1/5"></div></div>
                <div className="flex justify-between"><div className="h-3 bg-stone-200 rounded w-1/3"></div><div className="h-3 bg-stone-200 rounded w-1/5"></div></div>
                <div className="flex justify-between"><div className="h-3 bg-stone-200 rounded w-1/4"></div><div className="h-3 bg-stone-200 rounded w-1/5"></div></div>
                <div className="flex justify-between pt-3 border-t border-stone-200"><div className="h-5 bg-stone-200 rounded w-1/4"></div><div className="h-5 bg-stone-200 rounded w-1/3"></div></div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-stone-200 rounded-lg overflow-hidden">
                  {(summary?.templateUrl || order.imageUrl) && <img src={summary?.templateUrl || order.imageUrl} className="w-full h-full object-cover" />}
                </div>
                <div>
                  <h4 className="font-medium">{summary?.planTitle }</h4>
                  <p className="text-xs text-stone-400">{summary?.size || order.size} Card • Qty: {summary?.quantity || order.quantity}</p>
                  <p className="text-stone-900 font-medium">{unitPrice} rs / unit</p>
                </div>
              </div>
              <div className="pt-6 border-t border-stone-200 space-y-3">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>{subtotal} rs</span></div>
                {hasDiscount && (
                  <div className="flex justify-between text-sm text-rose-500 font-bold">
                    <div className="flex items-center gap-1"><Tag size={12} /> <span>Discount ({discountPercent}%)</span></div>
                    <span>-{Math.round(discountAmount)} rs</span>
                  </div>
                )}
                {deliveryCharge > 0 && (
                  <div className="flex justify-between text-sm"><span>Delivery Charge</span><span>{deliveryCharge} rs</span></div>
                )}
                <div className="flex justify-between text-lg font-medium pt-3 border-t border-stone-200">
                  <span className="font-serif">Total</span><span className="font-serif text-2xl">{Math.round(finalTotal)} rs</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;