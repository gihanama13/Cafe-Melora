import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CraftShowcaseProps {
  onSelectCategory: (cat: string) => void;
}

export const CraftShowcase: React.FC<CraftShowcaseProps> = ({ onSelectCategory }) => {
  return (
    <section id="craft" className="py-14 sm:py-20 bg-[#161513] border-b border-[#24211E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 mb-1">
              Curated Craft
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#FAF7F2] tracking-tight">
              Three pillars of Melora indulgence
            </h2>
          </div>
          <p className="text-sm text-stone-400 max-w-md">
            Prepared fresh to order using Ceylon single-estate teas, double-shot espresso, Belgian cocoa, and artisanal milk bread.
          </p>
        </div>

        {/* 3-Column Craft Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1: Iced Coffee & Cold Brews */}
          <div className="group bg-[#1C1A18] rounded-2xl overflow-hidden border border-[#2D2A26] hover:border-amber-500/40 shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
            <div className="relative aspect-4/3 overflow-hidden bg-stone-900">
              <img
                src="/src/assets/images/melora_iced_coffee_1790458681204.jpg"
                alt="Aesthetic iced caramel coffee in glass tumbler with condensation"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-amber-300 text-[11px] font-mono font-medium px-2.5 py-1 rounded-md border border-white/10">
                Rs. 450 — 550
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1 justify-between">
              <div>
                <div className="text-xs text-amber-400/80 font-medium mb-1">Espresso & Cold Brews</div>
                <h3 className="font-serif-display text-2xl text-white mb-2">Iced Coffees & Refreshers</h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed mb-5">
                  Crisp, chilled, and balanced. From classic iced Americano to golden caramel swirls and sparkling fruit lemonades.
                </p>
              </div>
              <button
                onClick={() => onSelectCategory('coffee')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer group-hover:translate-x-1 duration-200"
              >
                <span>Browse Iced Coffees</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Boba Teas & Milkshakes */}
          <div className="group bg-[#1C1A18] rounded-2xl overflow-hidden border border-[#2D2A26] hover:border-amber-500/40 shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
            <div className="relative aspect-4/3 overflow-hidden bg-stone-900">
              <img
                src="/src/assets/images/melora_bubble_tea_1790458693625.jpg"
                alt="Aesthetic brown sugar and taro boba bubble teas with pearls"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-amber-300 text-[11px] font-mono font-medium px-2.5 py-1 rounded-md border border-white/10">
                Rs. 500 — 600
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1 justify-between">
              <div>
                <div className="text-xs text-amber-400/80 font-medium mb-1">Hand-Brewed & Spun</div>
                <h3 className="font-serif-display text-2xl text-white mb-2">Bubble Tea & Milkshakes</h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed mb-5">
                  Ceylon milk tea, brown sugar tigers, taro, and ceremonial matcha paired with warm chewy tapioca pearls or popping boba.
                </p>
              </div>
              <button
                onClick={() => onSelectCategory('boba')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer group-hover:translate-x-1 duration-200"
              >
                <span>Browse Bubble Teas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Toasties & Sweets */}
          <div className="group bg-[#1C1A18] rounded-2xl overflow-hidden border border-[#2D2A26] hover:border-amber-500/40 shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
            <div className="relative aspect-4/3 overflow-hidden bg-stone-900">
              <img
                src="/src/assets/images/melora_treats_bites_1790458706863.jpg"
                alt="Golden melted cheese toastie and warm dark chocolate brownie"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-amber-300 text-[11px] font-mono font-medium px-2.5 py-1 rounded-md border border-white/10">
                Rs. 200 — 350
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1 justify-between">
              <div>
                <div className="text-xs text-amber-400/80 font-medium mb-1">Oven-Fresh & Toasted</div>
                <h3 className="font-serif-display text-2xl text-white mb-2">Bites & Sweet Treats</h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed mb-5">
                  Triple-cheese toasties, loaded crunchy fries, warm fudgy brownies with cold ice cream scoops, and chocolate cakes.
                </p>
              </div>
              <button
                onClick={() => onSelectCategory('bites')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer group-hover:translate-x-1 duration-200"
              >
                <span>Browse Bites & Sweets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
