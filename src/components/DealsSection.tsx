import React from 'react';
import { MELORA_DEALS, DealItem } from '../data/menuData';
import { Sparkles, Plus } from 'lucide-react';

interface DealsSectionProps {
  onConfigureDeal: (deal: DealItem) => void;
}

export const DealsSection: React.FC<DealsSectionProps> = ({ onConfigureDeal }) => {
  return (
    <section id="deals" className="py-14 sm:py-20 bg-[#141311] border-b border-[#24211E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300 bg-amber-950/80 border border-amber-700/50 px-3.5 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Curated Pairings</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#FAF7F2] tracking-tight">
            Melora Pairings & Combos
          </h2>
          <p className="text-stone-400 text-sm sm:text-base mt-2">
            Pair your favorite beverage with an artisan bakery treat. Order online for pickup or direct delivery.
          </p>
        </div>

        {/* 3 Combo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MELORA_DEALS.map((deal) => {
            return (
              <div
                key={deal.id}
                className="bg-[#1A1816] rounded-2xl p-6 border border-[#2D2A26] hover:border-amber-500/40 shadow-xl transition-all flex flex-col justify-between relative group hover:-translate-y-1"
              >
                {/* Savings tag */}
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-medium text-emerald-300 bg-emerald-950/80 border border-emerald-700/50 px-2.5 py-0.5 rounded-full font-mono">
                    Save ~Rs. {deal.savings}
                  </span>
                  <span className="text-xs text-stone-500 font-mono">
                    Est. Rs. {deal.originalValueEstimate}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif-display text-2xl text-white mb-1">
                    {deal.name}
                  </h3>
                  <div className="text-xs font-semibold uppercase tracking-wide text-amber-400/90 mb-3">
                    {deal.description}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-400 leading-relaxed mb-6">
                    {deal.type === 'sweet_break' && 'Pick any thick milkshake (Oreo, Caramel Biscuit, Chocolate, etc.) paired with our signature dark fudge brownie.'}
                    {deal.type === 'boba_break' && 'Choose your choice of fresh bubble tea (Brown Sugar, Matcha, Taro, etc.) with a warm chocolate chip cookie.'}
                    {deal.type === 'melora_duo' && 'The classic duo: pick any 2 beverages across our menu plus 1 hot savory toastie or bakery treat.'}
                  </p>
                </div>

                <div className="pt-5 border-t border-[#272421] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-500 block">Bundle Price</span>
                    <span className="text-xl sm:text-2xl font-bold text-amber-300 font-mono tabular-nums">
                      Rs. {deal.price}
                    </span>
                  </div>

                  <button
                    onClick={() => onConfigureDeal(deal)}
                    className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Choose Flavors</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Note underneath */}
        <div className="mt-8 text-center text-xs text-stone-500">
          Combos are available for dine-in seating, pickup counter, and neighborhood delivery.
        </div>

      </div>
    </section>
  );
};
