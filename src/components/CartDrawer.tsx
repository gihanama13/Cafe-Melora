import React, { useState } from 'react';
import { CartItem, OrderMode } from '../types/cart';
import { useCafe } from '../context/CafeContext';
import { X, Trash2, Plus, Minus, ArrowRight, MessageCircle, Utensils, ShoppingBag, Bike, Check, Tag, CreditCard } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onOpenCheckoutModal: () => void;
  promoCode: string;
  setPromoCode: (code: string) => void;
  isPromoApplied: boolean;
  setIsPromoApplied: (applied: boolean) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenCheckoutModal,
  promoCode,
  setPromoCode,
  isPromoApplied,
  setIsPromoApplied,
}) => {
  const { settings } = useCafe();
  const [orderMode, setOrderMode] = useState<OrderMode>('takeaway');
  const [tableNumber, setTableNumber] = useState('Table 4');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  // Calculate pricing
  const discountPercent = settings.discountPercent || settings.studentDiscountPercent || 10;
  const activePromoCode = settings.promoCode || settings.studentPromoCode || 'MELORA10';
  const subtotal = items.reduce((sum, ci) => sum + ci.unitPrice * ci.quantity, 0);
  const discountAmount = isPromoApplied ? Math.round(subtotal * (discountPercent / 100)) : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === activePromoCode.toUpperCase() || promoCode.trim().toUpperCase() === 'MELORA10') {
      setIsPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError(`Invalid promo code. Use ${activePromoCode} for 10% off.`);
    }
  };

  const handleRemovePromo = () => {
    setIsPromoApplied(false);
    setPromoCode('');
    setPromoError('');
  };

  const handleWhatsAppOrder = () => {
    // Generate clean text order receipt for WhatsApp
    let text = `*🌿 ${settings.name.toUpperCase()} ORDER*\n`;
    text += `*Web:* ${settings.websiteUrl || 'www.cafemelora.lk'}\n`;
    text += `--------------------------------\n`;
    text += `*Service:* ${orderMode.toUpperCase()}\n`;
    if (orderMode === 'dine_in') {
      text += `*Location:* ${tableNumber}\n`;
    } else if (orderMode === 'takeaway') {
      text += `*Customer:* ${customerName || 'Takeaway Guest'} (${phone || 'No Phone'})\n`;
    } else {
      text += `*Delivery To:* ${address || 'Colombo Address'} (${customerName || 'Guest'}, ${phone || 'No Phone'})\n`;
    }
    text += `--------------------------------\n`;
    text += `*ITEMS:*\n`;

    items.forEach((ci) => {
      text += `• ${ci.quantity}x ${ci.item.name} — Rs. ${ci.unitPrice * ci.quantity}\n`;
      if (ci.customization) {
        const parts: string[] = [];
        if (ci.customization.sweetness) parts.push(ci.customization.sweetness);
        if (ci.customization.ice) parts.push(ci.customization.ice);
        if (ci.customization.toppings?.length) parts.push(`+${ci.customization.toppings.join(', ')}`);
        if (parts.length) text += `   ↳ ${parts.join(' | ')}\n`;
        if (ci.customization.notes) text += `   ↳ Note: ${ci.customization.notes}\n`;
      }
      if (ci.dealSelections) {
        const ds = ci.dealSelections;
        const dealParts: string[] = [];
        if (ds.beverage1) dealParts.push(ds.beverage1);
        if (ds.beverage2) dealParts.push(ds.beverage2);
        if (ds.snack) dealParts.push(ds.snack);
        if (dealParts.length) text += `   ↳ Included: ${dealParts.join(' + ')}\n`;
      }
    });

    text += `--------------------------------\n`;
    text += `Subtotal: Rs. ${subtotal}\n`;
    if (isPromoApplied && discountAmount > 0) {
      text += `Promo Discount (${discountPercent}%): -Rs. ${discountAmount}\n`;
    }
    text += `*Total Due: Rs. ${finalTotal}*\n`;
    text += `--------------------------------\n`;
    text += `Sent from Cafe Melora Online (${settings.websiteUrl || 'www.cafemelora.lk'})`;

    const rawWhatsApp = settings.whatsappPhone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${rawWhatsApp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#141311] border-l border-[#272420] text-stone-200 flex flex-col shadow-2xl">
          
          {/* Drawer Top Bar */}
          <div className="p-5 border-b border-[#24211D] flex items-center justify-between bg-[#181614]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h3 className="font-serif-display text-xl text-[#FAF7F2]">
                Your Order Bag
              </h3>
              <span className="text-xs bg-[#24211D] text-amber-300 font-mono font-semibold px-2 py-0.5 rounded-full border border-[#36322C]">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-stone-500 hover:text-stone-300 transition-colors p-1.5 cursor-pointer"
                  title="Empty Bag"
                >
                  Clear
                </button>
              )}
              <button
                onClick={onClose}
                aria-label="Close cart"
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#25221E] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 text-stone-500">
                <ShoppingBag className="w-12 h-12 mx-auto text-stone-700 mb-3" />
                <p className="text-sm font-medium text-stone-300">Your bag is empty</p>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Browse our iced coffees, boba bar, milkshakes, toasties, or Melora combos!
                </p>
              </div>
            ) : (
              items.map((ci) => (
                <div
                  key={ci.cartItemId}
                  className="p-4 bg-[#1B1917] rounded-xl border border-[#2B2723] space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-stone-100">
                        {ci.item.name}
                      </h4>
                      <div className="text-xs text-amber-400/90 font-mono tabular-nums">
                        Rs. {ci.unitPrice} each
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-[#FAF7F2] font-mono tabular-nums">
                        Rs. {ci.unitPrice * ci.quantity}
                      </div>
                    </div>
                  </div>

                  {/* Customization Details */}
                  {ci.customization && (
                    <div className="text-[11px] text-stone-300 bg-[#141311] p-2.5 rounded-lg border border-[#26231F] space-y-0.5 font-mono">
                      {ci.customization.sweetness && (
                        <div>Sugar: <span className="text-stone-100 font-semibold">{ci.customization.sweetness}</span></div>
                      )}
                      {ci.customization.ice && (
                        <div>Ice: <span className="text-stone-100 font-semibold">{ci.customization.ice}</span></div>
                      )}
                      {ci.customization.toppings && ci.customization.toppings.length > 0 && (
                        <div>Toppings: <span className="text-amber-300 font-semibold">{ci.customization.toppings.join(', ')}</span></div>
                      )}
                      {ci.customization.notes && (
                        <div className="italic text-stone-400">Note: {ci.customization.notes}</div>
                      )}
                    </div>
                  )}

                  {/* Deal Selections */}
                  {ci.dealSelections && (
                    <div className="text-[11px] text-stone-300 bg-[#141311] p-2.5 rounded-lg border border-[#26231F] space-y-0.5 font-mono">
                      {ci.dealSelections.beverage1 && (
                        <div>Drink 1: <span className="text-amber-300 font-semibold">{ci.dealSelections.beverage1}</span></div>
                      )}
                      {ci.dealSelections.beverage2 && (
                        <div>Drink 2: <span className="text-amber-300 font-semibold">{ci.dealSelections.beverage2}</span></div>
                      )}
                      {ci.dealSelections.snack && (
                        <div>Snack: <span className="text-amber-300 font-semibold">{ci.dealSelections.snack}</span></div>
                      )}
                    </div>
                  )}

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center border border-[#36322C] bg-[#141311] rounded-lg p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(ci.cartItemId, ci.quantity - 1)}
                        className="p-1 text-stone-400 hover:text-white cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center text-xs font-semibold text-stone-100 font-mono tabular-nums">
                        {ci.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(ci.cartItemId, ci.quantity + 1)}
                        className="p-1 text-stone-400 hover:text-white cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(ci.cartItemId)}
                      className="p-1.5 text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Bottom Controls & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#24211D] bg-[#171513] space-y-4">
              
              {/* Promo Code Input */}
              <div className="space-y-1.5">
                {isPromoApplied ? (
                  <div className="flex items-center justify-between text-xs bg-emerald-950/80 border border-emerald-700/60 p-2.5 rounded-lg text-emerald-300">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Check className="w-3.5 h-3.5" />
                      <span>{activePromoCode} applied ({discountPercent}% off)</span>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="text-stone-400 hover:text-white underline text-[11px] cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder={`Promo code (e.g. ${activePromoCode})`}
                          className="w-full pl-8 pr-3 py-2 bg-[#1B1917] border border-[#2E2A25] rounded-lg text-xs text-stone-100 placeholder:text-stone-500 uppercase tracking-wide focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <button
                        onClick={handleApplyPromo}
                        className="px-3.5 py-2 bg-[#25221E] hover:bg-[#302B26] text-amber-300 border border-[#38332C] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <div className="text-[11px] text-rose-400 mt-1">{promoError}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-400 pt-1 border-t border-[#23201D]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-stone-200">Rs. {subtotal}</span>
                </div>
                {isPromoApplied && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Promo Discount ({discountPercent}%)</span>
                    <span className="font-mono">-Rs. {discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-[#282521]">
                  <span>Total Amount</span>
                  <span className="font-mono text-amber-300 text-base">Rs. {finalTotal}</span>
                </div>
              </div>

              {/* Action Buttons: Instant Online Checkout & WhatsApp */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onOpenCheckoutModal();
                  }}
                  className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer text-sm"
                >
                  <CreditCard className="w-4 h-4 text-stone-950" />
                  <span>Proceed to Checkout (Rs. {finalTotal})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-2.5 px-4 bg-[#1B1917] hover:bg-[#25221E] text-stone-300 hover:text-white border border-[#2E2A25] font-medium rounded-xl transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Send Order directly to WhatsApp</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
