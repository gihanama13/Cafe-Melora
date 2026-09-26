import React, { useState } from 'react';
import { MenuItem, SWEETNESS_LEVELS, ICE_LEVELS } from '../data/menuData';
import { useCafe } from '../context/CafeContext';
import { CartCustomization } from '../types/cart';
import { X, Plus, Minus, Check, Sparkles } from 'lucide-react';

interface ItemCustomizeModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, customization: CartCustomization, quantity: number) => void;
}

export const ItemCustomizeModal: React.FC<ItemCustomizeModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  const { toppings } = useCafe();

  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedSweetness, setSelectedSweetness] = useState<string>('70% Less Sweet');
  const [selectedIce, setSelectedIce] = useState<string>('Regular Ice');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const toggleTopping = (toppingName: string) => {
    if (selectedToppings.includes(toppingName)) {
      setSelectedToppings(selectedToppings.filter((t) => t !== toppingName));
    } else {
      setSelectedToppings([...selectedToppings, toppingName]);
    }
  };

  const toppingsPrice = selectedToppings.reduce((sum, topName) => {
    const found = toppings.find((t) => t.name === topName);
    return sum + (found ? found.price : 100);
  }, 0);

  const unitPrice = item.price + toppingsPrice;
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    onAddToCart(
      item,
      {
        sweetness: item.options?.hasSweetness ? selectedSweetness : undefined,
        ice: item.options?.hasIce ? selectedIce : undefined,
        toppings: item.options?.hasToppings ? selectedToppings : undefined,
        toppingsPrice: item.options?.hasToppings ? toppingsPrice : 0,
        notes: notes.trim() || undefined,
      },
      quantity
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#141311] rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#2B2723] overflow-hidden text-stone-200">
        
        {/* Header */}
        <div className="p-5 border-b border-[#24211D] flex items-center justify-between bg-[#181614]">
          <div>
            <div className="text-xs text-amber-400 font-medium capitalize tracking-wide">{item.category}</div>
            <h3 className="text-lg sm:text-xl font-serif-display text-[#FAF7F2]">
              Customize {item.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close customization"
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#25221E] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs sm:text-sm text-stone-300">
          
          <p className="text-xs text-stone-400 leading-relaxed bg-[#191715] p-3 rounded-xl border border-[#272420]">
            {item.description}
          </p>

          {/* Sweetness Selector if applicable */}
          {item.options?.hasSweetness && (
            <div>
              <label className="block text-xs font-semibold text-stone-200 uppercase tracking-wider mb-2">
                Sweetness Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SWEETNESS_LEVELS.map((lvl) => {
                  const isSel = selectedSweetness === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedSweetness(lvl)}
                      className={`px-3 py-2 text-xs rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSel
                          ? 'border-amber-400 bg-[#25211B] text-white font-medium shadow-xs'
                          : 'border-[#2B2723] bg-[#1A1816] hover:border-[#38332C] text-stone-300'
                      }`}
                    >
                      <span>{lvl}</span>
                      {isSel && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ice Level if applicable */}
          {item.options?.hasIce && (
            <div>
              <label className="block text-xs font-semibold text-stone-200 uppercase tracking-wider mb-2">
                Ice Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ICE_LEVELS.map((lvl) => {
                  const isSel = selectedIce === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedIce(lvl)}
                      className={`px-3 py-2 text-xs rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSel
                          ? 'border-amber-400 bg-[#25211B] text-white font-medium shadow-xs'
                          : 'border-[#2B2723] bg-[#1A1816] hover:border-[#38332C] text-stone-300'
                      }`}
                    >
                      <span>{lvl}</span>
                      {isSel && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Boba Extra Toppings (Rs. 100 each) */}
          {item.options?.hasToppings && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-stone-200 uppercase tracking-wider">
                  Add Extra Boba & Toppings
                </label>
                <span className="text-[11px] text-amber-400 font-mono">
                  +Rs. 100 each
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {toppings.map((top) => {
                  const isChecked = selectedToppings.includes(top.name);
                  return (
                    <button
                      key={top.id}
                      type="button"
                      onClick={() => toggleTopping(top.name)}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'border-amber-400 bg-[#25211B] text-white font-medium shadow-xs'
                          : 'border-[#2B2723] bg-[#1A1816] hover:border-[#38332C] text-stone-300'
                      }`}
                    >
                      <span className="text-xs">{top.name}</span>
                      <span className="text-[11px] font-mono text-amber-300 font-semibold">
                        +Rs. {top.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Barista special note */}
          <div>
            <label className="block text-xs font-semibold text-stone-200 uppercase tracking-wider mb-1.5">
              Special Instructions for Barista
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra hot, oat milk substitute, light syrup..."
              className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-lg text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
            />
          </div>

        </div>

        {/* Modal Bottom CTA */}
        <div className="p-5 border-t border-[#24211D] bg-[#171513] flex items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-[#36322C] bg-[#141311] rounded-lg p-0.5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1.5 text-stone-400 hover:text-white cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-xs font-semibold text-stone-100 font-mono tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1.5 text-stone-400 hover:text-white cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-between text-xs sm:text-sm active:scale-98 cursor-pointer"
          >
            <span>Add to Bag</span>
            <span className="font-mono tabular-nums font-bold">
              Rs. {totalPrice}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
