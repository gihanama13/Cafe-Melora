import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, Globe } from 'lucide-react';
import { useCafe } from '../context/CafeContext';

interface PromoBannerProps {
  onApplyCode: (code: string) => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onApplyCode }) => {
  const { settings } = useCafe();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const promoCode = settings.promoCode || settings.studentPromoCode || 'MELORA10';
  const discountPercent = settings.discountPercent || settings.studentDiscountPercent || 10;
  const webUrl = settings.websiteUrl || 'www.cafemelora.lk';

  return (
    <div className="bg-[#171513] text-stone-200 text-xs px-4 py-2.5 transition-all border-b border-[#292522]">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 truncate">
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-700/50 text-amber-300 text-[11px] font-mono">
            <Globe className="w-3 h-3 text-amber-400" />
            <span>{webUrl}</span>
          </div>

          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          
          <span className="font-medium text-stone-300 truncate">
            Welcome to Cafe Melora: <span className="text-amber-300 font-semibold">{discountPercent}% off online orders</span> with code <code className="bg-[#24211D] border border-[#38332C] px-1.5 py-0.5 rounded text-amber-300 font-mono tracking-wider font-semibold">{promoCode}</code>
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onApplyCode(promoCode)}
            className="text-amber-300 hover:text-amber-200 underline underline-offset-2 flex items-center gap-1 font-semibold cursor-pointer text-xs"
          >
            <span>Apply 10% Off</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="text-stone-500 hover:text-stone-300 transition-colors p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
