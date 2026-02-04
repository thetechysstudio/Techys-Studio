import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.tsx';
import PolaroidPreview from '../components/PolaroidPreview.tsx';
import { OrderState, CardSize } from '../../types.ts';
import { fetchSizes, fetchTemplates, submitPersonalization, SizeOption, TemplateOption } from '../services/api.ts';
import { Upload, ChevronRight, Check, Tag } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { showToast } from '../components/toast.ts';
import { useScrollToTopOnReload, useScrollToTopOnReloadOnCLick } from '../components/reload.ts';

interface CustomizationProps {
  order: OrderState;
  onBack: () => void;
  onNext: (order: OrderState) => void;
}
const BACKEND_URL = "https://api.shop.drmcetit.com"
const Customization: React.FC<CustomizationProps> = ({ order, onBack, onNext }) => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [localOrder, setLocalOrder] = useState<OrderState>(order);
  const [sizes, setSizes] = useState<SizeOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [templates, setTemplates] = useState<TemplateOption[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [errorTemplates, setErrorTemplates] = useState<string | null>(null);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll to top on reload
  useScrollToTopOnReload();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
    }
  }, [navigate]);

useEffect(() => {
  const isReload = sessionStorage.getItem("isReload");

  if (isReload === "true") {
    navigate("/plans/1", { replace: true });
    sessionStorage.removeItem("isReload");
  } else {
    sessionStorage.setItem("isReload", "true");
  }
}, [navigate]);



  React.useEffect(() => {
    const loadSizes = async () => {
      if (!planId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSizes(planId);
        setSizes(data);
      } catch (err) {
        setError('Failed to load sizes. Please try again.');
        // Fallback to static SIZES if fetch fails? 
        // For now, let's keep it simple and just show error or empty.
        // Or un-comment below to fallback:
        // setSizes(SIZES);
      } finally {
        setLoading(false);
      }
    };
    loadSizes();
  }, [planId]);

  const handleUpdate = (updates: Partial<OrderState>) => {
    setLocalOrder(prev => ({ ...prev, ...updates }));
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'video' | 'image'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_VIDEO_SIZE = 25 * 1024 * 1024; // 25MB
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024;  // 5MB

    if (type === 'video' && file.size > MAX_VIDEO_SIZE) {
      showToast("Video size must be less than 25MB", "alert");
      e.target.value = '';
      return;
    }

    if (type === 'image' && file.size > MAX_IMAGE_SIZE) {
      showToast("Image size must be less than 5MB", "alert");
      e.target.value = '';
      return;
    }

    const url = URL.createObjectURL(file);

    if (type === 'video') {
      handleUpdate({ videoUrl: url });
      setVideoFile(file);
    } else {
      handleUpdate({ imageUrl: url });
      setImageFile(file);
    }
  };


  const isStep1Valid = !!localOrder.size;
  const isStep2Valid = !!localOrder.templateId;
  const isStep3Valid = !!localOrder.title && !!localOrder.description && localOrder.quantity > 0;

  const planAddon = localOrder.plan?.id === 'plan-2' ? 10 : 0;

  return (
    <Layout onBack={onBack}>
      <div className="max-w-6xl mx-auto flex flex-col space-y-8 md:space-y-12">
        <div className="w-full max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between relative">
            {[1, 2, 3].map((s, idx) => (
              <React.Fragment key={s}>
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500 ${step === s
                    ? 'bg-stone-900 text-white shadow-lg'
                    : step > s
                      ? 'bg-emerald-50 text-emerald-500'
                      : 'bg-stone-100 text-stone-400'
                    }`}>
                    {step > s ? <Check size={18} strokeWidth={3} /> : <span className="text-sm font-bold">{s}</span>}
                  </div>
                  <span className={`absolute top-12 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap ${step === s ? 'text-stone-900' : 'text-stone-400'}`}>
                    {s === 1 ? 'Size' : s === 2 ? 'Style' : 'Details'}
                  </span>
                </div>
                {idx < 2 && (
                  <div className="flex-1 h-[2px] mx-2 bg-stone-100 relative -top-0 mt-0">
                    <div
                      className="absolute inset-0 bg-emerald-300 transition-all duration-700 ease-in-out"
                      style={{ width: step > s ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start pt-8">
          <div className="lg:order-2 lg:sticky lg:top-24 space-y-6">
            <PolaroidPreview order={localOrder} />
          </div>

          <div className="lg:order-1 space-y-8 lg:space-y-12">
            <div className="space-y-8 min-h-[400px]">
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-3xl font-serif">Select Your Size</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {loading && <div className="text-center py-8">Loading sizes...</div>}
                    {error && <div className="text-center py-8 text-red-500">{error}</div>}
                    {!loading && !error && sizes.map(s => (
                      <button
                        key={s.label}
                        onClick={() => handleUpdate({ size: s.label as CardSize })}
                        className={`relative cursor-pointer flex flex-col p-6 rounded-2xl border transition-all text-left ${localOrder.size === s.label
                          ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                          : 'border-stone-100 hover:border-stone-300'
                          }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <p className="font-bold text-lg">{s.label}</p>
                            <p className="text-xs text-stone-400">{s.width} x {s.height}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-stone-900 font-serif text-2xl font-bold">{s.price} rs</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-2 text-rose-500">
                          <Tag size={12} />
                          <span className="text-[11px] font-bold uppercase tracking-tight">
                            Offer: {s.offer}% OFF on orders {">"} {s.minQuantity} items
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-3xl font-serif">Choose a Template</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {loadingTemplates && <div className="col-span-2 text-center py-8">Loading templates...</div>}
                    {errorTemplates && <div className="col-span-2 text-center py-8 text-red-500">{errorTemplates}</div>}
                    {!loadingTemplates && !errorTemplates && templates.map(t => (
                      <button
                        key={t.id}
                        onClick={() => handleUpdate({ templateId: t.id })}
                        className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${localOrder.templateId === t.id
                          ? 'border-stone-900 shadow-xl'
                          : 'border-transparent  hover:opacity-100'
                          }`}
                      >
                        <img src={BACKEND_URL + t.image} alt={t.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-stone-900/60 backdrop-blur-sm p-2 text-white text-[10px] text-center uppercase tracking-widest">
                          {t.title}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-3xl font-serif">Personalize Your Card</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {localOrder.plan?.features?.some(f => f.toLowerCase().includes('video')) && (
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-stone-500 font-medium">Video Memory</label>
                          <div className="relative group cursor-pointer border-2 border-dashed border-stone-200 rounded-xl p-4 flex flex-col items-center justify-center bg-stone-50 hover:bg-stone-100 transition-colors">
                            <input type="file" accept="video/mp4" onChange={(e) => handleFileUpload(e, 'video')} className="absolute inset-0 opacity-0 cursor-pointer" />
                            <Upload size={20} className="text-stone-400 mb-2" />
                            <span className="text-[10px] text-stone-500">{localOrder.videoUrl ? 'Uploaded ✓' : 'Upload Video'}</span>
                          </div>
                        </div>
                      )}
                      {localOrder.plan?.features?.some(f => f.toLowerCase().includes('image')) && (
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-stone-500 font-medium">Cover Photo</label>
                          <div className="relative group cursor-pointer border-2 border-dashed border-stone-200 rounded-xl p-4 flex flex-col items-center justify-center bg-stone-50 hover:bg-stone-100 transition-colors">
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} className="absolute inset-0 opacity-0 cursor-pointer" />
                            <Upload size={20} className="text-stone-400 mb-2" />
                            <span className="text-[10px] text-stone-500">{localOrder.imageUrl ? 'Uploaded ✓' : 'Upload Photo'}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <input type="text" value={localOrder.title} onChange={(e) => handleUpdate({ title: e.target.value })} placeholder="Title" className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl outline-none" />
                      <textarea rows={2} value={localOrder.description} onChange={(e) => handleUpdate({ description: e.target.value })} placeholder="Description" className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl outline-none resize-none" />
                      <input type="text" value={localOrder.tagline} onChange={(e) => handleUpdate({ tagline: e.target.value })} placeholder="Tagline" className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl outline-none" />
                      <input type="number" value={localOrder.quantity} onChange={(e) => handleUpdate({ quantity: parseInt(e.target.value) })} className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl outline-none" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-stone-100">
              <button onClick={() => step === 1 ? onBack() : setStep(step - 1)} className="text-stone-400 cursor-pointer hover:text-stone-800 transition-colors text-sm">
                {step === 1 ? 'Cancel' : 'Go Back'}
              </button>
              <button
                disabled={
                  isSubmitting || // disable while loading
                  (step === 1 ? !isStep1Valid :
                    step === 2 ? !isStep2Valid :
                      !isStep3Valid)
                }
                onClick={async () => {
                  useScrollToTopOnReloadOnCLick()
                  if (isSubmitting) return; // safety guard
                  setIsSubmitting(true); // start loading

                  try {
                    if (step < 3) {
                      
                      if (step === 1) {
                        const selectedSize = sizes.find(s => s.label === localOrder.size);
                        if (selectedSize) {
                          setLoadingTemplates(true);
                          setErrorTemplates(null);
                          setTemplates([]);

                          const data = await fetchTemplates(selectedSize.id);
                          setTemplates(data);
                          setStep(step + 1);
                        }
                      }
                      else if (step === 2) {
                        const selectedTemplate = templates.find(t => t.id === localOrder.templateId);
                        localStorage.setItem('selectedTemplate', JSON.stringify(selectedTemplate));
                        setStep(step + 1);
                      }
                    }
                    else {
                      // STEP 3 SUBMISSION
                      const formData = new FormData();
                      formData.append('title', localOrder.title);
                      formData.append('description', localOrder.description);
                      formData.append('quantity', localOrder.quantity.toString());
                      formData.append('tagline', localOrder.tagline);
                      const selectedTemplate = JSON.parse(localStorage.getItem('selectedTemplate') || '{}');
                      formData.append('templateUrl', selectedTemplate?.image);

                      if (videoFile) formData.append('video', videoFile);
                      if (imageFile) formData.append('image', imageFile);

                      const response = await submitPersonalization(formData);
                      console.log('Personalization submitted:', response);
                      onNext(localOrder);
                    }
                  } catch (err) {
                    console.error('Action failed', err);
                    alert('Something went wrong. Please try again.');
                  } finally {
                    setIsSubmitting(false); // stop loading
                    setLoadingTemplates(false);
                  }
                }}
                className="px-8 py-3 cursor-pointer bg-stone-900 text-white rounded-full font-medium flex items-center gap-2 disabled:opacity-30 hover:bg-stone-800 transition-all shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    Processing...
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  </>
                ) : (
                  <>
                    {step === 3 ? 'Proceed' : 'Continue'}
                    <ChevronRight size={18} />
                  </>
                )}
              </button>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Customization;