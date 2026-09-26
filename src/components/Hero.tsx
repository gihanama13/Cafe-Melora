import React from 'react';
import { ArrowDown, Sparkles, Clock, MapPin, Wifi, CheckCircle2 } from 'lucide-react';
import { useCafe } from '../context/CafeContext';

interface HeroProps {
  onExploreMenu: () => void;
  onExploreDeals: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreMenu, onExploreDeals }) => {
  const { settings } = useCafe();

  return (
    <section className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 bg-[#121110] border-b border-[#24211E]">
      {/* Subtle warm ambient glow behind hero */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Brand Headline & CTAs */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            
            {/* Clean unboxed metadata kicker */}
            <div className="flex items-center gap-2 text-xs text-stone-400 font-medium tracking-wide">
              <span className="text-amber-400/90">Warm</span>
              <span aria-hidden="true" className="text-stone-700">·</span>
              <span>Minimal</span>
              <span aria-hidden="true" className="text-stone-700">·</span>
              <span>Sweet</span>
              <span aria-hidden="true" className="text-stone-700">·</span>
              <span className="font-mono text-stone-400">{settings.websiteUrl || 'www.cafemelora.lk'}</span>
            </div>

            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-[#FAF7F2] tracking-tight leading-[1.08] text-balance">
              Curated sips, artisan bakery & everyday comfort.
            </h1>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              Specialty iced espressos, hand-spun Ceylon milk teas, thick dessert milkshakes, and melted skillet toasties. Prepared fresh to order for dine-in, takeaway, and neighborhood delivery in Colombo.
            </p>

            {/* Quick Pricing & Amenity Notes */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-stone-400 pt-1">
              <span className="font-medium text-stone-200">Beverages Rs. 450–550</span>
              <span aria-hidden="true" className="text-stone-700">·</span>
              <span className="font-medium text-stone-200">Bites & Sweets Rs. 200–350</span>
              <span aria-hidden="true" className="text-stone-700">·</span>
              <span className="inline-flex items-center gap-1.5 text-stone-300">
                <Wifi className="w-3.5 h-3.5 text-amber-400" />
                High-Speed Fiber Wi-Fi
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreMenu}
                className="px-5 py-2.5 text-sm font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-md active:scale-98 flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Full Menu</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreDeals}
                className="px-5 py-2.5 text-sm font-medium text-amber-200 bg-[#1D1B18] hover:bg-[#25221E] border border-[#332E28] rounded-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Melora Combos (From Rs. 700)</span>
              </button>
            </div>

            {/* Trust Markers */}
            <div className="pt-4 border-t border-[#23201D] flex flex-wrap items-center gap-6 text-xs text-stone-400">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400/90" />
                <span>{settings.weekdayHours}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-amber-400/90 shrink-0" />
                <span className="truncate">{settings.address}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#2F2B27] bg-[#181614] aspect-16/10 sm:aspect-16/11 group">
              <img
                src="/src/assets/images/cafe_melora_hero_1790458669217.jpg"
                alt="Cafe Melora warm minimalist interior with oak tables and soft sunlight"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold">The Melora Atmosphere</p>
                  <p className="text-sm sm:text-base font-medium text-stone-200 mt-0.5">Warm oak wood, natural light & relaxed beats</p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Baristas on duty
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

