import React from 'react';
import { CardSize, OrderState } from '../../types.ts';
import { TEMPLATES } from '../../constants.ts';

interface PolaroidPreviewProps {
  order: OrderState;
}

const PolaroidPreview: React.FC<PolaroidPreviewProps> = ({ order }) => {
  const selectedTemplate = TEMPLATES.find(t => t.id === order.templateId) || TEMPLATES[0];

  const getSizeClasses = (size?: CardSize) => {
    switch (size) {
      case 'Small': return 'w-[240px] h-[330px]';
      case 'Medium': return 'w-[280px] h-[380px]';
      case 'Large': return 'w-[320px] h-[300px] flex-row';
      default: return 'w-[240px] h-[330px]';
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-8 bg-stone-100/50 rounded-3xl border border-stone-200">
      <div
        className={`${getSizeClasses(order.size)} ${selectedTemplate.style} polaroid-shadow p-4 transition-all duration-500 ease-in-out flex flex-col items-center animate-float overflow-hidden border border-stone-100`}
      >
        {/* Memory Space */}
        <div className="w-full aspect-square bg-stone-200 mb-4 overflow-hidden relative flex items-center justify-center">
          {order.imageUrl ? (
            <img src={order.imageUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : order.videoUrl ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-300 text-stone-500 p-4 text-center">
              <span className="text-xs font-medium uppercase tracking-widest">[ Video Preview Placeholder ]</span>
              <p className="text-[10px] mt-1">Video will play when scanned</p>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-stone-300 text-stone-400">
              <span className="text-xs italic">Your Memory Here</span>
            </div>
          )}
        </div>

        {/* Info Grid: QR Left, Text Right */}
        <div className="w-full flex gap-3 items-start">
          {/* QR Code Section */}
          <div className="flex-shrink-0 w-12 h-12 bg-white p-1 border border-stone-200 shadow-sm">
            <div className="w-full h-full bg-stone-800 flex items-center justify-center">
              <div className="w-full h-full grid grid-cols-3 gap-px p-1">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className={`bg-white ${i % 2 === 0 ? 'opacity-80' : 'opacity-20'}`}></div>
                ))}
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 text-left min-w-0 flex flex-col justify-center h-12">
            <h3 className={`font-serif text-sm leading-tight truncate font-bold ${selectedTemplate.id === 't4' ? 'text-white' : 'text-stone-800'}`}>
              {order.title || 'Your Memory Title'}
            </h3>
            <p className={`text-[9px] leading-tight line-clamp-1 opacity-70 ${selectedTemplate.id === 't4' ? 'text-stone-300' : 'text-stone-600'}`}>
              {order.description || 'Add a heartfelt description...'}
            </p>
            <div className="mt-0">
              <span className={`text-[7px] uppercase tracking-widest font-medium opacity-50 ${selectedTemplate.id === 't4' ? 'text-stone-400' : 'text-stone-500'}`}>
                {order.tagline || 'Forever in digital'}
              </span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-[7px] uppercase tracking-widest font-medium opacity-50">Just For Your Reference</p>
    </div>
  );
};

export default PolaroidPreview;