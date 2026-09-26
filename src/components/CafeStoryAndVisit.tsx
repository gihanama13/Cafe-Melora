import React from 'react';
import { MapPin, Clock, Wifi, Zap, Coffee, ShieldCheck, Phone, MessageCircle, ExternalLink, Globe } from 'lucide-react';
import { useCafe } from '../context/CafeContext';

export const CafeStoryAndVisit: React.FC = () => {
  const { settings } = useCafe();
  const rawWhatsApp = settings.whatsappPhone.replace(/[^0-9]/g, '');

  return (
    <div className="bg-[#121110] text-[#EDE8DF]">
      {/* Story & Modern Lounge Atmosphere Section */}
      <section id="story" className="py-14 sm:py-20 border-b border-[#24211E]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-400/90">
                The Melora Philosophy
              </div>
              <h2 className="font-serif-display text-3xl sm:text-4xl text-[#FAF7F2] tracking-tight leading-tight">
                Contemporary coffee, slow afternoons, and uncompromised taste.
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Founded in Colombo 07, {settings.name} marries minimalist design with artisanal beverage craft. We believe high-grade espresso roasts, slow-brewed Ceylon single-origin teas, handcrafted boba pearls, and hot skillet toasties should be delicious, modern, and accessible every day.
              </p>
              
              {/* Feature grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#181715] rounded-xl border border-[#2A2724] hover:border-amber-500/30 transition-all">
                  <div className="flex items-center gap-2 text-stone-100 font-semibold text-xs mb-1">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Power & Connectivity</span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Dedicated AC & USB charging docks at banquette tables for effortless remote work or meetings.
                  </p>
                </div>

                <div className="p-4 bg-[#181715] rounded-xl border border-[#2A2724] hover:border-amber-500/30 transition-all">
                  <div className="flex items-center gap-2 text-stone-100 font-semibold text-xs mb-1">
                    <Wifi className="w-4 h-4 text-amber-400" />
                    <span>High-Speed Fiber Wi-Fi</span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Complimentary guest fiber access (<code className="font-mono text-amber-300 font-bold">{settings.wifiPass}</code>) on <code className="font-mono text-stone-200">{settings.wifiSsid}</code>.
                  </p>
                </div>

                <div className="p-4 bg-[#181715] rounded-xl border border-[#2A2724] hover:border-amber-500/30 transition-all">
                  <div className="flex items-center gap-2 text-stone-100 font-semibold text-xs mb-1">
                    <Coffee className="w-4 h-4 text-amber-400" />
                    <span>Specialty Roasted Beans</span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Locally roasted small-batch Arabica blends, poured with velvety micro-foam or served over crystal ice.
                  </p>
                </div>

                <div className="p-4 bg-[#181715] rounded-xl border border-[#2A2724] hover:border-amber-500/30 transition-all">
                  <div className="flex items-center gap-2 text-stone-100 font-semibold text-xs mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Pure Artisan Ingredients</span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Fresh Ceylon dairy, authentic brown sugar boba, pure matcha, and rich Belgian dark cocoa.
                  </p>
                </div>
              </div>

            </div>

            {/* Authentic Cafe Standards & Craftsmanship */}
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 mb-2">
                Our Quality Standards
              </div>

              <div className="bg-[#181715] p-5 rounded-xl border border-[#2A2724] shadow-lg space-y-2 hover:border-[#38332C] transition-all">
                <div className="flex items-center gap-2 text-stone-100 font-semibold text-xs">
                  <Coffee className="w-4 h-4 text-amber-400" />
                  <span>Freshly Pulled on Order</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                  Every iced coffee and espresso beverage is calibrated and freshly pulled to order. No batch-brewed coffees, ensuring crisp crema and pure aromatic notes.
                </p>
              </div>

              <div className="bg-[#181715] p-5 rounded-xl border border-[#2A2724] shadow-lg space-y-2 hover:border-[#38332C] transition-all">
                <div className="flex items-center gap-2 text-stone-100 font-semibold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Fresh Ceylon Single-Origin Tea</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                  Our milk teas and fruit refreshers use whole-leaf teas sourced directly from Sri Lankan tea gardens, slow-infused for rich flavor without artificial powders.
                </p>
              </div>

              <div className="bg-[#181715] p-5 rounded-xl border border-[#2A2724] shadow-lg space-y-2 hover:border-[#38332C] transition-all">
                <div className="flex items-center gap-2 text-stone-100 font-semibold text-xs">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Fresh Daily Boba & Artisanal Skillets</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                  Tapioca pearls slow-simmered in dark brown sugar every 4 hours for the perfect chewy texture, alongside hot toasted melts made with fresh bakery loaves.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Location, Hours & Direct Contact */}
      <section id="visit" className="py-14 sm:py-20 bg-[#0F0E0D]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left: Contact Info */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 mb-1">
                  Visit The Cafe
                </div>
                <h2 className="font-serif-display text-3xl sm:text-4xl text-[#FAF7F2] tracking-tight">
                  Colombo 07 Lounge
                </h2>
                <div className="flex items-center gap-2 mt-1 text-xs text-stone-400 font-mono">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>{settings.websiteUrl || 'www.cafemelora.lk'}</span>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-stone-300">
                <div className="flex items-start gap-3 p-3.5 bg-[#171513] rounded-xl border border-[#272421]">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-stone-100">Address</div>
                    <p className="text-stone-400 mt-0.5">{settings.address}</p>
                    <p className="text-xs text-amber-400/80 mt-1 font-medium">{settings.landmark}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#171513] rounded-xl border border-[#272421]">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-stone-100">Operating Hours</div>
                    <p className="text-stone-400 mt-0.5">{settings.weekdayHours}</p>
                    <p className="text-stone-400">{settings.weekendHours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#171513] rounded-xl border border-[#272421]">
                  <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-stone-100">Phone & Hotline</div>
                    <p className="font-mono text-stone-300 mt-0.5">{settings.phone}</p>
                    <p className="text-stone-500 text-xs">For pre-orders, takeaway pickup, and table reservations</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={`https://wa.me/${rawWhatsApp}?text=${encodeURIComponent('Hello Cafe Melora, I would like to place an order or inquire about table seating.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Direct (+94)</span>
                </a>

                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="px-4 py-2.5 bg-[#1F1D1A] hover:bg-[#282521] text-stone-200 border border-[#332E28] rounded-lg text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Call Us</span>
                </a>
              </div>
            </div>

            {/* Right: Map / Atmosphere Card */}
            <div className="lg:col-span-7">
              <div className="bg-[#181614] rounded-2xl border border-[#2B2723] overflow-hidden shadow-2xl p-6 sm:p-8 flex flex-col justify-between h-full relative">
                
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-mono tracking-widest text-amber-400 font-semibold">
                      Colombo 07 Location
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Open & Brewing
                    </span>
                  </div>

                  <h3 className="font-serif-display text-2xl sm:text-3xl text-white">
                    Drop in for a freshly pulled espresso or boba break.
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                    Conveniently situated right off Green Path in Cinnamon Gardens, Colombo 07. Peaceful indoor air-conditioned banquettes with ambient acoustic playlist, plus our tranquil alfresco garden patio.
                  </p>

                  <div className="p-4 rounded-xl bg-[#121110] border border-[#262320] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400">Seating Capacity:</span>
                      <span className="font-semibold text-stone-200">38 indoor seats + 14 garden patio seats</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400">Parking:</span>
                      <span className="font-semibold text-stone-200">Dedicated street bays & valet assist</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400">Payment:</span>
                      <span className="font-semibold text-stone-200">Cash, Visa, Mastercard & LankaQR</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400">Official Web:</span>
                      <span className="font-mono text-amber-400 font-semibold">{settings.websiteUrl || 'www.cafemelora.lk'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#262320] flex items-center justify-between text-xs text-stone-500 relative">
                  <span>© {new Date().getFullYear()} {settings.name}. All rights reserved.</span>
                  <a
                    href="#menu"
                    className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                  >
                    <span>Order Online Now</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
