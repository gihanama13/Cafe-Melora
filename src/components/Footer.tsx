import React from 'react';
import { useCafe } from '../context/CafeContext';
import { Lock, ShieldCheck, Globe, Coffee, ArrowUpRight, Heart } from 'lucide-react';

interface FooterProps {
  onOpenAdminLogin: () => void;
  onOpenAdminPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminLogin, onOpenAdminPortal }) => {
  const { settings, isAdmin } = useCafe();

  return (
    <footer className="bg-[#0A0908] border-t border-[#201D1A] py-12 sm:py-16 text-xs text-stone-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Brand */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-serif-display text-2xl sm:text-3xl text-[#FAF7F2] block">
                {settings.name}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-stone-500 font-mono text-[11px]">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings.websiteUrl || 'www.cafemelora.lk'}</span>
            </div>

            <div className="text-amber-400/90 font-medium text-xs">
              {settings.tagline}
            </div>

            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              Contemporary coffeehouse and artisan beverage bar in Colombo 07. Handcrafted specialty coffees, shaken bubble teas, fresh fruit refreshers, melted skillet sandwiches, and fresh desserts.
            </p>

            <div className="pt-2 text-[11px] text-stone-500">
              Colombo, Sri Lanka · Dine-In · Takeaway · Direct Express Delivery
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-2.5">
            <div className="font-semibold text-stone-200 uppercase tracking-wider text-[11px]">
              Menu Collections
            </div>
            <ul className="space-y-2">
              <li><a href="#menu" className="text-stone-400 hover:text-amber-300 transition-colors">Iced Coffee</a></li>
              <li><a href="#menu" className="text-stone-400 hover:text-amber-300 transition-colors">Milkshakes</a></li>
              <li><a href="#menu" className="text-stone-400 hover:text-amber-300 transition-colors">Bubble Tea</a></li>
              <li><a href="#menu" className="text-stone-400 hover:text-amber-300 transition-colors">Fruit Refreshers</a></li>
              <li><a href="#menu" className="text-stone-400 hover:text-amber-300 transition-colors">Warm Bites & Sweets</a></li>
            </ul>
          </div>

          {/* Value Deals & Offers */}
          <div className="md:col-span-3 space-y-2.5">
            <div className="font-semibold text-stone-200 uppercase tracking-wider text-[11px]">
              Curated Pairings
            </div>
            <ul className="space-y-2">
              <li><a href="#deals" className="text-stone-400 hover:text-amber-300 transition-colors">Sweet Break — Rs. 700</a></li>
              <li><a href="#deals" className="text-stone-400 hover:text-amber-300 transition-colors">Boba Break — Rs. 700</a></li>
              <li><a href="#deals" className="text-stone-400 hover:text-amber-300 transition-colors">Melora Duo — Rs. 950</a></li>
              <li className="pt-2">
                <span className="text-stone-500 text-[11px] block">Online Promo Code:</span>
                <span className="font-mono text-amber-300 bg-[#171513] px-2 py-0.5 rounded border border-[#2B2723] inline-block mt-1 font-semibold">
                  {settings.promoCode || settings.studentPromoCode || 'MELORA10'}
                </span>
              </li>
            </ul>
          </div>

          {/* Visit & Timings & Staff Portal */}
          <div className="md:col-span-3 space-y-2.5">
            <div className="font-semibold text-stone-200 uppercase tracking-wider text-[11px]">
              Store & Operating Hours
            </div>
            <p className="text-stone-400 leading-relaxed text-xs">
              {settings.address}<br />
              {settings.weekdayHours}<br />
              {settings.weekendHours}
            </p>
            <p className="text-stone-400 pt-1 font-mono text-xs">
              Hotline: <span className="text-stone-200">{settings.phone}</span>
            </p>
            <p className="text-stone-400 font-mono text-xs">
              Email: <span className="text-stone-200">{settings.email}</span>
            </p>
            
            {/* Staff / Management access */}
            <div className="pt-3 border-t border-[#1C1A17]">
              {isAdmin ? (
                <button
                  onClick={onOpenAdminPortal}
                  className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 font-medium cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open Cafe Manager Portal</span>
                </button>
              ) : (
                <button
                  onClick={onOpenAdminLogin}
                  className="flex items-center gap-1.5 text-[11px] text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-stone-500" />
                  <span>Staff & Management Portal</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[#1A1816] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
          <div>
            © {new Date().getFullYear()} {settings.name} ({settings.websiteUrl || 'www.cafemelora.lk'}). All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#menu" className="hover:text-stone-300 transition-colors">Online Ordering</a>
            <span aria-hidden="true" className="text-stone-700">·</span>
            <a href="#deals" className="hover:text-stone-300 transition-colors">Melora Deals</a>
            <span aria-hidden="true" className="text-stone-700">·</span>
            <a href="#visit" className="hover:text-stone-300 transition-colors">Colombo 07</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
