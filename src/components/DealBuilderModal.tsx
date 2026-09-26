import React, { useState } from 'react';
import { DealItem, MENU_ITEMS } from '../data/menuData';
import { X, Sparkles, Check } from 'lucide-react';

interface DealBuilderModalProps {
  deal: DealItem | null;
  onClose: () => void;
  onAddDealToCart: (deal: DealItem, selections: { beverage1?: string; beverage2?: string; snack?: string }) => void;
}

export const DealBuilderModal: React.FC<DealBuilderModalProps> = ({
  deal,
  onClose,
  onAddDealToCart,
}) => {
  if (!deal) return null;

  // Options lists
  const milkshakes = MENU_ITEMS.filter((i) => i.category === 'milkshakes');
  const bobaList = MENU_ITEMS.filter((i) => i.category === 'boba');
  const allBeverages = MENU_ITEMS.filter((i) =>
    ['coffee', 'milkshakes', 'boba', 'refreshers'].includes(i.category)
  );
  const allSnacks = MENU_ITEMS.filter((i) =>
    ['bites', 'sweets'].includes(i.category)
  );

  // States
  const [selectedMilkshake, setSelectedMilkshake] = useState(milkshakes[0]?.name || 'Oreo Crush Milkshake');
  const [selectedBoba, setSelectedBoba] = useState(bobaList[0]?.name || 'Brown Sugar Boba');
  const [bev1, setBev1] = useState(allBeverages[0]?.name || 'Classic Iced Coffee');
  const [bev2, setBev2] = useState(allBeverages[4]?.name || 'Brown Sugar Boba');
  const [selectedSnack, setSelectedSnack] = useState(allSnacks[0]?.name || 'Cheese Toastie');

  const handleAdd = () => {
    let selections = {};
    if (deal.type === 'sweet_break') {
      selections = {
        beverage1: selectedMilkshake,
        snack: 'Fudge Brownie',
      };
    } else if (deal.type === 'boba_break') {
      selections = {
        beverage1: selectedBoba,
        snack: 'Choc Chip Cookie',
      };
    } else if (deal.type === 'melora_duo') {
      selections = {
        beverage1: bev1,
        beverage2: bev2,
        snack: selectedSnack,
      };
    }

    onAddDealToCart(deal, selections);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#141311] rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#2B2723] overflow-hidden text-stone-200">
        
        {/* Header */}
        <div className="p-5 border-b border-[#24211D] flex items-center justify-between bg-[#181614]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-700/60 text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-amber-400 font-medium uppercase tracking-wider">Configure Combo</div>
              <h3 className="text-lg sm:text-xl font-serif-display text-[#FAF7F2]">
                {deal.name} — Rs. {deal.price}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close deal builder"
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#25221E] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs sm:text-sm text-stone-300">
          
          <div className="flex items-center justify-between bg-[#1B1917] p-3 rounded-xl border border-[#2B2723]">
            <span className="text-stone-300">{deal.description}</span>
            <span className="font-mono text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded text-xs">
              Save ~Rs. {deal.savings}
            </span>
          </div>

          {/* Deal 1: Sweet Break (Milkshake + Brownie) */}
          {deal.type === 'sweet_break' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-200 uppercase tracking-wider mb-2">
                  1. Select Your Milkshake Flavor
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {milkshakes.map((item) => {
                    const isSel = selectedMilkshake === item.name;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedMilkshake(item.name)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSel
                            ? 'border-amber-400 bg-[#25211B] text-white font-medium shadow-xs'
                            : 'border-[#2B2723] bg-[#1A1816] hover:border-[#38332C] text-stone-300'
                        }`}
                      >
                        <span>{item.name}</span>
                        {isSel && <Check className="w-4 h-4 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-200 uppercase tracking-wider mb-2">
                  2. Included Bakery Treat
                </label>
                <div className="p-3 bg-[#1B1917] rounded-xl border border-[#2B2723] text-stone-300 flex items-center justify-between">
                  <span className="font-medium text-stone-100">Fudge Brownie (Warm Dark Chocolate)</span>
                  <span className="text-xs text-amber-300 font-mono">Included</span>
                </div>
              </div>
            </div>
          )}

          {/* Deal 2: Boba Break (Bubble Tea + Cookie) */}
          {deal.type === 'boba_break' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-200 uppercase tracking-wider mb-2">
                  1. Select Your Bubble Tea
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {bobaList.map((item) => {
                    const isSel = selectedBoba === item.name;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedBoba(item.name)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSel
                            ? 'border-amber-400 bg-[#25211B] text-white font-medium shadow-xs'
                            : 'border-[#2B2723] bg-[#1A1816] hover:border-[#38332C] text-stone-300'
                        }`}
                      >
                        <span>{item.name}</span>
                        {isSel && <Check className="w-4 h-4 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-200 uppercase tracking-wider mb-2">
                  2. Included Bakery Treat
                </label>
                <div className="p-3 bg-[#1B1917] rounded-xl border border-[#2B2723] text-stone-300 flex items-center justify-between">
                  <span className="font-medium text-stone-100">Artisan Chocolate Chip Cookie</span>
                  <span className="text-xs text-amber-300 font-mono">Included</span>
                </div>
              </div>
            </div>
          )}

          {/* Deal 3: Melora Duo (2 Drinks + 1 Snack) */}
          {deal.type === 'melora_duo' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-200 uppercase tracking-wider mb-1.5">
                  1. Select First Beverage
                </label>
                <select
                  value={bev1}
                  onChange={(e) => setBev1(e.target.value)}
                  className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                >
                  {allBeverages.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} ({b.category.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-200 uppercase tracking-wider mb-1.5">
                  2. Select Second Beverage
                </label>
                <select
                  value={bev2}
                  onChange={(e) => setBev2(e.target.value)}
                  className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                >
                  {allBeverages.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} ({b.category.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-200 uppercase tracking-wider mb-1.5">
                  3. Select 1 Snack or Sweet Treat
                </label>
                <select
                  value={selectedSnack}
                  onChange={(e) => setSelectedSnack(e.target.value)}
                  className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                >
                  {allSnacks.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.category.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom CTA */}
        <div className="p-5 border-t border-[#24211D] bg-[#171513] flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-stone-400">Total Combo Price</div>
            <div className="font-mono text-xl font-bold text-amber-300">
              Rs. {deal.price}
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 py-3 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer text-xs sm:text-sm"
          >
            <span>Add Combo to Bag</span>
            <Check className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
