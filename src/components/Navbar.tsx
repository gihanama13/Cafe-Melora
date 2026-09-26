import React from 'react';
import { ShoppingBag, Coffee, Sparkles, ShieldCheck, Lock, Clock, Globe } from 'lucide-react';
import { useCafe } from '../context/CafeContext';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onSelectCategory: (categoryId: string) => void;
  onOpenAdminLogin: () => void;
  onOpenAdminPortal: () => void;
  onOpenTrackOrder: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onSelectCategory,
  onOpenAdminLogin,
  onOpenAdminPortal,
  onOpenTrackOrder,
}) => {
  const { settings, isAdmin, orders } = useCafe();
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <header className="sticky top-0 z-40 bg-[#121110]/95 backdrop-blur-md border-b border-[#252320] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark with domain mark */}
        <a
          href="#"
          className="flex items-baseline gap-2.5 group"
        >
          <span className="font-serif-display text-2xl sm:text-3xl tracking-tight text-[#FAF7F2] group-hover:text-amber-200 transition-colors">
            {settings.name}
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono text-stone-500 group-hover:text-amber-400 transition-colors tracking-tight">
            {settings.websiteUrl || 'www.cafemelora.lk'}
          </span>
        </a>

        {/* Zone 2: Clean modern navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-stone-400">
          <a
            href="#menu"
            onClick={() => onSelectCategory('all')}
            className="hover:text-white transition-colors"
          >
            Menu
          </a>
          <a
            href="#deals"
            onClick={() => onSelectCategory('deals')}
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Pairings</span>
          </a>
          <a
            href="#craft"
            className="hover:text-white transition-colors"
          >
            Craft
          </a>
          <a
            href="#story"
            className="hover:text-white transition-colors"
          >
            The Space
          </a>
          <a
            href="#visit"
            className="hover:text-white transition-colors"
          >
            Location & Hours
          </a>
          <button
            onClick={onOpenTrackOrder}
            className="text-stone-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Track Order</span>
          </button>
        </nav>

        {/* Zone 3: Primary actions + Admin trigger */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Track order mobile icon */}
          <button
            onClick={onOpenTrackOrder}
            className="md:hidden p-2 text-stone-400 hover:text-amber-300 hover:bg-[#1C1A18] rounded-lg transition-colors cursor-pointer"
            title="Track Order Status"
          >
            <Clock className="w-4 h-4 text-amber-400" />
          </button>

          {/* Admin toggle */}
          {isAdmin ? (
            <button
              onClick={onOpenAdminPortal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-200 bg-amber-950/70 hover:bg-amber-900/90 rounded-lg transition-colors cursor-pointer border border-amber-700/60 shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin Portal</span>
              {pendingOrdersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-stone-400 hover:text-white hover:bg-[#1E1C19] border border-transparent hover:border-[#2D2A26] rounded-lg transition-colors cursor-pointer"
              title="Staff & Management Login"
            >
              <Lock className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Staff</span>
            </button>
          )}

          <a
            href="#menu"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold tracking-wide text-stone-200 bg-[#1E1C19] hover:bg-[#272421] border border-[#2F2B27] rounded-lg transition-colors whitespace-nowrap"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-400" />
            <span>Order Online</span>
          </a>

          <button
            onClick={onOpenCart}
            aria-label="Shopping bag"
            className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-sm active:scale-95 whitespace-nowrap cursor-pointer font-medium"
          >
            <ShoppingBag className="w-4 h-4 text-stone-950" />
            <span className="hidden xs:inline">Bag</span>
            {cartCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-stone-950 text-amber-300 rounded text-[11px] font-bold tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
