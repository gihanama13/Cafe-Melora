import React, { useState } from 'react';
import { X, Search, Clock, CheckCircle2, ShoppingBag, Bike, Utensils, AlertCircle } from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { CustomerOrder } from '../types/cafe';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderNumber?: string;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  initialOrderNumber = '',
}) => {
  const { orders, settings } = useCafe();
  const [searchQuery, setSearchQuery] = useState(initialOrderNumber);
  const [searchedOrder, setSearchedOrder] = useState<CustomerOrder | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const cleaned = searchQuery.trim().toUpperCase();
    const found = orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === cleaned ||
        o.orderNumber.toUpperCase() === `#${cleaned}` ||
        o.phone.includes(searchQuery.trim())
    );
    setSearchedOrder(found || null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#141311] rounded-2xl max-w-md w-full shadow-2xl border border-[#2B2723] overflow-hidden text-stone-200">
        
        {/* Header */}
        <div className="p-5 border-b border-[#24211D] flex items-center justify-between bg-[#181614]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="font-serif-display text-xl text-[#FAF7F2]">
              Live Order Tracker
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#25221E] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-5 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Order # (e.g. ML-1048) or Phone"
                className="w-full pl-9 pr-3 py-2 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-xs text-stone-100 placeholder:text-stone-500 uppercase tracking-wide focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Track
            </button>
          </form>

          {/* Result */}
          {searchedOrder ? (
            <div className="p-4 bg-[#181614] rounded-xl border border-[#2B2723] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-serif-display text-lg text-white font-bold">
                    {searchedOrder.orderNumber}
                  </span>
                  <div className="text-[11px] text-stone-400">
                    {searchedOrder.customerName} · {searchedOrder.createdAt}
                  </div>
                </div>

                <span className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                  searchedOrder.status === 'pending'
                    ? 'bg-amber-950 text-amber-300 border border-amber-600/60'
                    : searchedOrder.status === 'preparing'
                    ? 'bg-blue-950 text-blue-300 border border-blue-600/60'
                    : searchedOrder.status === 'ready'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/60'
                    : 'bg-stone-900 text-stone-400'
                }`}>
                  {searchedOrder.status}
                </span>
              </div>

              {/* Step indicator */}
              <div className="grid grid-cols-4 gap-1 text-center text-[10px] pt-1">
                <div className={`p-1.5 rounded font-semibold ${
                  ['pending', 'preparing', 'ready', 'completed'].includes(searchedOrder.status)
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/60'
                    : 'bg-[#1F1D1A] text-stone-600'
                }`}>
                  1. Placed
                </div>
                <div className={`p-1.5 rounded font-semibold ${
                  ['preparing', 'ready', 'completed'].includes(searchedOrder.status)
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-600/60'
                    : 'bg-[#1F1D1A] text-stone-600'
                }`}>
                  2. Brewing
                </div>
                <div className={`p-1.5 rounded font-semibold ${
                  ['ready', 'completed'].includes(searchedOrder.status)
                    ? 'bg-blue-950/80 text-blue-300 border border-blue-600/60'
                    : 'bg-[#1F1D1A] text-stone-600'
                }`}>
                  3. Ready
                </div>
                <div className={`p-1.5 rounded font-semibold ${
                  searchedOrder.status === 'completed'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/60'
                    : 'bg-[#1F1D1A] text-stone-600'
                }`}>
                  4. Enjoy
                </div>
              </div>

              {/* Items */}
              <div className="pt-2 border-t border-[#24211D] space-y-1 text-xs">
                {searchedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-stone-300">
                    <span>{it.quantity}x {it.name}</span>
                    <span className="font-mono text-stone-400">Rs. {it.unitPrice * it.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-white pt-1">
                  <span>Total Amount</span>
                  <span className="font-mono text-amber-300">Rs. {searchedOrder.total}</span>
                </div>
              </div>
            </div>
          ) : hasSearched ? (
            <div className="p-4 bg-[#181614] rounded-xl border border-rose-900/40 text-center text-xs text-rose-300 space-y-1">
              <AlertCircle className="w-5 h-5 mx-auto text-rose-400" />
              <p>No active order found with that number or phone.</p>
              <p className="text-[11px] text-stone-500">Please check your receipt or contact the cafe hotline at {settings.phone}.</p>
            </div>
          ) : (
            <div className="p-4 bg-[#181614] rounded-xl border border-[#272421] text-xs text-stone-400 text-center">
              Enter your order number from your receipt (e.g. <strong className="text-amber-300 font-mono">#ML-1048</strong>) to see its live kitchen status.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
