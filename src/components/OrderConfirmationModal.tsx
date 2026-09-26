import React from 'react';
import { CartItem, OrderMode } from '../types/cart';
import { CheckCircle2, Clock, Wifi, MapPin, Copy, Check, X, Globe, ShoppingBag } from 'lucide-react';
import { useCafe } from '../context/CafeContext';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: {
    orderNumber: string;
    mode: OrderMode;
    tableNumber: string;
    customerName: string;
    items: CartItem[];
    subtotal: number;
    discount: number;
    total: number;
    notes: string;
    createdAt: string;
  } | null;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  orderDetails,
}) => {
  const { settings } = useCafe();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !orderDetails) return null;

  const handleCopyReceipt = () => {
    let text = `CAFE MELORA ORDER RECEIPT\n`;
    text += `Web: ${settings.websiteUrl || 'www.cafemelora.lk'}\n`;
    text += `Order: ${orderDetails.orderNumber}\n`;
    text += `Service: ${orderDetails.mode.toUpperCase()} ${orderDetails.tableNumber ? `(${orderDetails.tableNumber})` : ''}\n`;
    text += `Time: ${orderDetails.createdAt}\n`;
    text += `---------------------------------\n`;
    orderDetails.items.forEach((ci) => {
      text += `${ci.quantity}x ${ci.item.name} — Rs. ${ci.unitPrice * ci.quantity}\n`;
    });
    if (orderDetails.discount > 0) {
      text += `Promo Discount: -Rs. ${orderDetails.discount}\n`;
    }
    text += `Total: Rs. ${orderDetails.total}\n`;
    text += `Wi-Fi: ${settings.wifiSsid} / ${settings.wifiPass}\n`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#141311] rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#2B2723] overflow-hidden text-stone-200">
        
        {/* Header */}
        <div className="p-6 bg-[#181614] border-b border-[#24211D] text-center relative">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-semibold">
            Order Sent to Cafe Kitchen
          </div>
          <h3 className="font-serif-display text-2xl sm:text-3xl text-white mt-1">
            {orderDetails.orderNumber}
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Thank you, <strong className="text-stone-200">{orderDetails.customerName || 'Guest'}</strong>! We are preparing your order.
          </p>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-stone-300">
          
          {/* Estimated prep time box */}
          <div className="p-4 bg-[#1B1917] rounded-xl border border-[#2B2723] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <div>
                <div className="font-semibold text-stone-200">Estimated Ready Time</div>
                <div className="text-stone-400 text-[11px]">10–14 minutes from order placement</div>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-amber-300 bg-amber-950/80 border border-amber-700/60 px-2.5 py-1 rounded-md">
              Fresh & Chilled
            </span>
          </div>

          {/* Fulfillment details */}
          <div className="p-4 bg-[#181614] rounded-xl border border-[#26231F] space-y-2">
            <div className="flex justify-between">
              <span className="text-stone-400">Order Service:</span>
              <span className="font-medium text-stone-200 capitalize">
                {orderDetails.mode.replace('_', ' ')} {orderDetails.tableNumber ? `(${orderDetails.tableNumber})` : ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Pickup / Location:</span>
              <span className="font-medium text-stone-200">24 Garden Walk, Colombo 07</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Website:</span>
              <span className="font-mono text-amber-400 font-semibold">{settings.websiteUrl || 'www.cafemelora.lk'}</span>
            </div>
          </div>

          {/* Items breakdown */}
          <div className="border border-[#26231F] rounded-xl p-4 bg-[#181614] space-y-2.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 pb-1 border-b border-[#24211D]">
              Ordered Items
            </div>
            
            {orderDetails.items.map((ci) => (
              <div key={ci.cartItemId} className="flex justify-between items-start text-xs">
                <div>
                  <span className="font-medium text-stone-200">{ci.quantity}x {ci.item.name}</span>
                  {ci.customization && (
                    <div className="text-[11px] text-stone-400">
                      {[ci.customization.sweetness, ci.customization.ice, ci.customization.toppings?.join(', ')]
                        .filter(Boolean)
                        .join(' · ')}
                    </div>
                  )}
                </div>
                <span className="font-mono text-stone-200 tabular-nums">
                  Rs. {ci.unitPrice * ci.quantity}
                </span>
              </div>
            ))}

            <div className="pt-2 border-t border-[#24211D] space-y-1">
              <div className="flex justify-between text-stone-400">
                <span>Subtotal</span>
                <span className="font-mono">Rs. {orderDetails.subtotal}</span>
              </div>
              {orderDetails.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo Discount</span>
                  <span className="font-mono">-Rs. {orderDetails.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-[#282521]">
                <span>Total Paid / Due</span>
                <span className="font-mono text-amber-300">Rs. {orderDetails.total}</span>
              </div>
            </div>
          </div>

          {/* Guest Wi-Fi banner */}
          <div className="p-3 bg-[#191715] rounded-xl border border-[#272420] text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-stone-200 font-semibold">
              <Wifi className="w-3.5 h-3.5 text-amber-400" />
              <span>Complimentary Guest Fiber Wi-Fi</span>
            </div>
            <div className="text-[11px] text-stone-400">
              Network: <code className="font-mono text-stone-200 font-bold">{settings.wifiSsid}</code> · Password: <code className="font-mono text-amber-300 font-bold">{settings.wifiPass}</code>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-[#24211D] bg-[#181614] flex items-center gap-3">
          <button
            onClick={handleCopyReceipt}
            className="flex-1 py-2.5 px-4 bg-[#1E1C19] hover:bg-[#282521] text-stone-200 border border-[#322E28] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Receipt Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Receipt</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="py-2.5 px-6 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
