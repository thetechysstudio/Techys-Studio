import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.tsx';
import { CheckCircle, Home, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useErrorStatus } from '../services/errorStatus.ts';

interface ConfirmationData {
  productTitle: string;
  planTitle: string;
  size: string;
  quantity: number;
  totalAmount: number;
  doorNoAndStreet: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}
const BACKEND_URL = "https://api.shop.drmcetit.com/api"
const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ConfirmationData | null>(null);
  const [loading, setLoading] = useState(true);
  const { errorStatus } = useErrorStatus();

  useEffect(() => {
    const fetchOrderSummary = async () => {
      const accessToken = localStorage.getItem('accessToken');
      try {
        const token1 = localStorage.getItem('orderConfirmed');
        const token2 = localStorage.getItem('order');

        if (
          token1 !== 'srdtffdfdgdgfyghjkresdtfghjdfgh' ||
          token2 !== 'srdtfyghjkresdtfghjdfgh'
        ) {
          navigate('/');
          return;
        }

        const response = await axios.get(
          `${BACKEND_URL}/order-confirmation/`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        );

        const result = response.data;
        console.log(result);
        setData(result);
        setLoading(false);
        const data = result;
        sendWhatsApp(data)

      } catch (error) {
        console.error(error?.response?.data || error.message || error);
        errorStatus(error);
        // navigate('/');
      }
    };

    fetchOrderSummary();
  }, [navigate]);

  const sendWhatsApp = (data: any) => {
    //     const phone = 9345857852;

    //     const message = `
    // Order Confirmed ✅

    // Product: ${data.productTitle}
    // Plan: ${data.planTitle}
    // Size: ${data.size}
    // Quantity: ${data.quantity}
    // Total Amount: ${data.totalAmount}


    // Shipping Address:
    // ${data.doorNoAndStreet}, ${data.city}, ${data.district}, ${data.state}, ${data.pincode}

    // – The Techys Studio
    //   `.trim();

    //     const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    //     window.open(url, "_blank");

    const instaUsername = "the_techys_studio"; // without @

    const message = `
Order Confirmed ✅

Product: ${data.productTitle}
Plan: ${data.planTitle}
Size: ${data.size}
Quantity: ${data.quantity}
Total Amount: ${data.totalAmount}

Shipping Address:
${data.doorNoAndStreet}, ${data.city}, ${data.district}, ${data.state}, ${data.pincode}

– The Techys Studio
`.trim();

    const url = `https://ig.me/m/${instaUsername}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");

  };

  // useEffect(() => {
  //   if (data?.whatsapp) {
  //     sendWhatsApp(data);
  //   }
  // }, [data]);


  if (loading || !data) {
    return (
      <Layout showCart={false}>
        <div className="py-20 text-center text-stone-500">
          Loading order details...
        </div>
      </Layout>
    );
  }

  return (
    <Layout showCart={false}>
      <div className="w-full flex flex-col items-center text-center space-y-8 py-12 animate-in fade-in zoom-in-95 duration-700">

        <div className="w-20 h-20 bg-emerald-50 flex items-center justify-center text-emerald-500">
          <CheckCircle size={40} strokeWidth={1.5} />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-serif">Order Confirmed</h1>
          <p className="text-stone-500 font-light capitalize">
            {data.planTitle} ({data.size})
          </p>
        </div>

        <div className="w-full max-w-2xl bg-stone-50 border border-stone-100 rounded-md p-8 space-y-6 text-left">

          <div>
            <h3 className="text-xs uppercase tracking-widest text-stone-400 font-bold mb-4">
              Order Summary
            </h3>
            <div className="flex justify-between pb-4 border-b border-stone-200">
              <span className="text-sm text-stone-600">
                {data.productTitle} – {data.planTitle}
              </span>
              <span className="text-sm font-medium">
                x{data.quantity}
              </span>
            </div>
            <div className="flex justify-between pt-4 text-sm font-medium">
              <span>Total Amount</span>
              <span>₹{data.totalAmount}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-stone-300 mt-0.5" />
              <div className="text-sm capitalize">
                <p className="font-medium">Shipping Address</p>
                <p className="text-stone-500">
                  {data.doorNoAndStreet}, {data.city}, {data.district},
                  <br />
                  {data.state} – {data.pincode}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar size={18} className="text-stone-300 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">What’s Next?</p>
                <p className="text-stone-400 text-xs">
                  We’ll reach out to you shortly. Please check your email for updates and details about your order.
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem('orderConfirmed');
            localStorage.removeItem('order');
            sendWhatsApp(data)
            navigate('/home');
          }}
          className="w-full max-w-md py-3 cursor-pointer bg-stone-900 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-xl"
        >
          <Home size={18} /> Back to Home
        </button>

      </div>
    </Layout>
  );
};

export default Confirmation;
