import React, { useState } from 'react';
import { CartItem } from '../../types/cart';
import { CustomerOrder, OrderStatus, PaymentMethod } from '../../types/cafe';
import { useCafe } from '../../context/CafeContext';
import {
  X,
  ShoppingBag,
  Bike,
  Utensils,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle2,
  Clock,
  MessageCircle,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Phone,
  Globe
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  discount: number;
  finalTotal: number;
  isPromoApplied: boolean;
  onOrderPlacedSuccess: (createdOrder: CustomerOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  subtotal,
  discount,
  finalTotal,
  isPromoApplied,
  onOrderPlacedSuccess,
}) => {
  const { settings, createOrder } = useCafe();

  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');

  // Customer order fields
  const [orderType, setOrderType] = useState<'takeaway' | 'delivery' | 'dine_in'>('takeaway');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [tableNumber, setTableNumber] = useState('Table 3');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('counter');
  
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Confirmed order state
  const [placedOrder, setPlacedOrder] = useState<CustomerOrder | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  if (!isOpen) return null;

  const validateDetails = () => {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) {
      newErrors.customerName = 'Please enter your name';
    }
    if (!phone.trim() || phone.trim().length < 8) {
      newErrors.phone = 'Please provide a valid contact number (e.g. +94 77 123 4567)';
    }
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Please enter your street address or apartment details in Colombo';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDetails()) {
      setStep('payment');
    }
  };

  const handleConfirmOrder = () => {
    // Generate order item models
    const orderItems = cartItems.map((ci) => {
      let custSummary = '';
      if (ci.customization) {
        const parts = [];
        if (ci.customization.sweetness) parts.push(ci.customization.sweetness);
        if (ci.customization.ice) parts.push(ci.customization.ice);
        if (ci.customization.toppings?.length) parts.push(ci.customization.toppings.join(', '));
        custSummary = parts.join(' • ');
      }
      return {
        id: ci.item.id,
        name: ci.item.name,
        quantity: ci.quantity,
        unitPrice: ci.unitPrice,
        customizationSummary: custSummary || undefined,
        toppings: ci.customization?.toppings,
        sweetness: ci.customization?.sweetness,
        ice: ci.customization?.ice,
        dealSummary: ci.dealSelections
          ? [ci.dealSelections.beverage1, ci.dealSelections.beverage2, ci.dealSelections.snack]
              .filter(Boolean)
              .join(' + ')
          : undefined,
      };
    });

    const newOrder = createOrder({
      mode: orderType,
      tableNumber: orderType === 'dine_in' ? tableNumber : undefined,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
      notes: notes.trim() || undefined,
      paymentMethod,
      paymentStatus: paymentMethod === 'counter' ? 'pending' : 'pending',
      items: orderItems,
      subtotal,
      discount,
      total: finalTotal,
    });

    setPlacedOrder(newOrder);
    setStep('confirmed');
    onOrderPlacedSuccess(newOrder);
  };

  const handleCopyReceipt = () => {
    if (!placedOrder) return;
    let text = `*CAFE MELORA ORDER RECEIPT*\n`;
    text += `*Web:* ${settings.websiteUrl || 'www.cafemelora.lk'}\n`;
    text += `*Order:* ${placedOrder.orderNumber}\n`;
    text += `*Status:* Preparing in Kitchen\n`;
    text += `*Mode:* ${placedOrder.mode.toUpperCase()}${placedOrder.tableNumber ? ` (${placedOrder.tableNumber})` : ''}\n`;
    text += `*Customer:* ${placedOrder.customerName} (${placedOrder.phone})\n`;
    if (placedOrder.deliveryAddress) {
      text += `*Delivery To:* ${placedOrder.deliveryAddress}\n`;
    }
    text += `---------------------------------\n`;
    placedOrder.items.forEach((it) => {
      text += `${it.quantity}x ${it.name} — Rs. ${it.unitPrice * it.quantity}\n`;
      if (it.customizationSummary) text += `   ↳ ${it.customizationSummary}\n`;
      if (it.dealSummary) text += `   ↳ ${it.dealSummary}\n`;
    });
    text += `---------------------------------\n`;
    text += `Subtotal: Rs. ${placedOrder.subtotal}\n`;
    if (placedOrder.discount > 0) text += `Promo Discount: -Rs. ${placedOrder.discount}\n`;
    text += `*Total: Rs. ${placedOrder.total}*\n`;
    text += `Payment: ${placedOrder.paymentMethod.toUpperCase()}\n`;
    text += `Est. Ready: 12-16 minutes\n`;

    navigator.clipboard.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2000);
  };

  const handleSendToWhatsApp = () => {
    if (!placedOrder) return;
    let text = `*🌿 CAFE MELORA ORDER (${placedOrder.orderNumber})*\n`;
    text += `*Web:* ${settings.websiteUrl || 'www.cafemelora.lk'}\n`;
    text += `---------------------------------\n`;
    text += `Customer: ${placedOrder.customerName} (${placedOrder.phone})\n`;
    text += `Service: ${placedOrder.mode.toUpperCase()}${placedOrder.tableNumber ? ` - ${placedOrder.tableNumber}` : ''}\n`;
    if (placedOrder.deliveryAddress) {
      text += `Delivery Address: ${placedOrder.deliveryAddress}\n`;
    }
    text += `---------------------------------\n`;
    placedOrder.items.forEach((it) => {
      text += `• ${it.quantity}x ${it.name} - Rs. ${it.unitPrice * it.quantity}\n`;
      if (it.customizationSummary) text += `   ↳ ${it.customizationSummary}\n`;
    });
    text += `---------------------------------\n`;
    text += `Total: Rs. ${placedOrder.total} (${placedOrder.paymentMethod})\n`;
    if (placedOrder.notes) text += `Note: ${placedOrder.notes}\n`;

    const rawWhatsApp = settings.whatsappPhone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${rawWhatsApp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#141311] rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#2B2723] overflow-hidden text-stone-200">
        
        {/* Modal Top Header */}
        <div className="p-5 border-b border-[#24211D] flex items-center justify-between bg-[#181614]">
          <div>
            <div className="text-[11px] uppercase font-semibold text-amber-400/90 tracking-wider">
              {step === 'details' && 'Step 1 of 2: Fulfillment & Contact'}
              {step === 'payment' && 'Step 2 of 2: Payment Method'}
              {step === 'confirmed' && 'Order Received • Preparing'}
            </div>
            <h3 className="font-serif-display text-xl sm:text-2xl text-[#FAF7F2]">
              {step === 'confirmed' ? 'Order Confirmed!' : 'Cafe Melora Checkout'}
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#25221E] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-stone-300">
          
          {/* ============================================================== */}
          {/* STEP 1: DETAILS & FULFILLMENT MODE */}
          {/* ============================================================== */}
          {step === 'details' && (
            <form id="detailsForm" onSubmit={handleProceedToPayment} className="space-y-5">
              
              {/* Service Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-200 uppercase tracking-wider mb-2">
                  1. Fulfillment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType('takeaway')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      orderType === 'takeaway'
                        ? 'border-amber-400 bg-[#25211B] text-white shadow-xs'
                        : 'border-[#2B2723] bg-[#1A1816] hover:border-[#38332C] text-stone-400'
                    }`}
                  >
                    <ShoppingBag className={`w-4 h-4 mb-2 ${orderType === 'takeaway' ? 'text-amber-400' : 'text-stone-500'}`} />
                    <div>
                      <span className="font-semibold block text-xs text-stone-100">Pickup / Takeaway</span>
                      <span className={`text-[10px] ${orderType === 'takeaway' ? 'text-amber-300' : 'text-stone-500'}`}>
                        Ready in 10-15m
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('dine_in')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      orderType === 'dine_in'
                        ? 'border-amber-400 bg-[#25211B] text-white shadow-xs'
                        : 'border-[#2B2723] bg-[#1A1816] hover:border-[#38332C] text-stone-400'
                    }`}
                  >
                    <Utensils className={`w-4 h-4 mb-2 ${orderType === 'dine_in' ? 'text-amber-400' : 'text-stone-500'}`} />
                    <div>
                      <span className="font-semibold block text-xs text-stone-100">Dine-In Table</span>
                      <span className={`text-[10px] ${orderType === 'dine_in' ? 'text-amber-300' : 'text-stone-500'}`}>
                        Table service
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      orderType === 'delivery'
                        ? 'border-amber-400 bg-[#25211B] text-white shadow-xs'
                        : 'border-[#2B2723] bg-[#1A1816] hover:border-[#38332C] text-stone-400'
                    }`}
                  >
                    <Bike className={`w-4 h-4 mb-2 ${orderType === 'delivery' ? 'text-amber-400' : 'text-stone-500'}`} />
                    <div>
                      <span className="font-semibold block text-xs text-stone-100">Direct Delivery</span>
                      <span className={`text-[10px] ${orderType === 'delivery' ? 'text-amber-300' : 'text-stone-500'}`}>
                        Colombo 01-15
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Table Number if Dine In */}
              {orderType === 'dine_in' && (
                <div className="p-3 bg-[#1A1816] rounded-xl border border-[#2B2723] space-y-2">
                  <label className="block text-xs font-semibold text-stone-200">
                    Table or Booth Number:
                  </label>
                  <select
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full p-2.5 bg-[#141311] border border-[#302B25] rounded-lg text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Table 1 (Window)">Table 1 (Window)</option>
                    <option value="Table 2 (Window)">Table 2 (Window)</option>
                    <option value="Table 3 (Oak Center)">Table 3 (Oak Center)</option>
                    <option value="Table 4 (Power Outlet Banquette)">Table 4 (Power Outlet Banquette)</option>
                    <option value="Table 5 (Lounge Sofa)">Table 5 (Lounge Sofa)</option>
                    <option value="Patio Table A (Garden)">Patio Table A (Garden)</option>
                    <option value="Patio Table B (Garden)">Patio Table B (Garden)</option>
                    <option value="Bar Counter Stool">Bar Counter Stool</option>
                  </select>
                </div>
              )}

              {/* Customer Contact Details */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-stone-200 uppercase tracking-wider">
                  2. Contact Information
                </label>
                
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Kavindu Silva"
                    className={`w-full p-2.5 bg-[#1B1917] border rounded-lg text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none ${
                      errors.customerName ? 'border-rose-500' : 'border-[#2E2A25] focus:border-amber-400'
                    }`}
                  />
                  {errors.customerName && (
                    <span className="text-[11px] text-rose-400 mt-0.5 block">{errors.customerName}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+94 77 123 4567"
                      className={`w-full p-2.5 bg-[#1B1917] border rounded-lg text-xs text-stone-100 placeholder:text-stone-600 font-mono focus:outline-none ${
                        errors.phone ? 'border-rose-500' : 'border-[#2E2A25] focus:border-amber-400'
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-[11px] text-rose-400 mt-0.5 block">{errors.phone}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Email (Optional Receipt)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="hello@example.com"
                      className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-lg text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Delivery Address if delivery */}
                {orderType === 'delivery' && (
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">
                      Delivery Address in Colombo *
                    </label>
                    <textarea
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Apartment / suite, building name, street address, Colombo 03 / 07 / etc."
                      className={`w-full p-2.5 bg-[#1B1917] border rounded-lg text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none ${
                        errors.deliveryAddress ? 'border-rose-500' : 'border-[#2E2A25] focus:border-amber-400'
                      }`}
                    />
                    {errors.deliveryAddress && (
                      <span className="text-[11px] text-rose-400 mt-0.5 block">{errors.deliveryAddress}</span>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">Barista or Kitchen Notes (Optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Extra napkins, less sweet, or delivery gate code"
                    className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-lg text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Order Summary Snapshot */}
              <div className="p-3.5 bg-[#181614] rounded-xl border border-[#2A2724] space-y-1.5">
                <div className="flex justify-between text-xs text-stone-400">
                  <span>{cartItems.reduce((s, i) => s + i.quantity, 0)} Items Selected</span>
                  <span className="font-mono text-stone-200">Rs. {subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-400">
                    <span>Promo Discount Applied</span>
                    <span className="font-mono">-Rs. {discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-bold text-white pt-1 border-t border-[#26231F]">
                  <span>Total Amount</span>
                  <span className="font-mono text-amber-300">Rs. {finalTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <span>Continue to Payment Method</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ============================================================== */}
          {/* STEP 2: PAYMENT METHOD SELECTION */}
          {/* ============================================================== */}
          {step === 'payment' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-stone-200 uppercase tracking-wider mb-2">
                  Select Payment Option
                </label>
                
                <div className="space-y-2.5">
                  
                  {/* Option 1: Pay at Counter */}
                  <label
                    onClick={() => setPaymentMethod('counter')}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'counter'
                        ? 'border-amber-400 bg-[#25211B] text-white'
                        : 'border-[#2B2723] bg-[#1A1816] hover:border-[#38332C] text-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'counter'}
                      onChange={() => setPaymentMethod('counter')}
                      className="mt-1 accent-amber-400"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-amber-400" />
                        <span className="font-semibold text-xs text-stone-100">Pay at Counter (Cash or Card)</span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-1">
                        Settle by cash, Visa, or Mastercard when collecting your items at 24 Garden Walk.
                      </p>
                    </div>
                  </label>

                  {/* Option 2: Cash on Delivery */}
                  {orderType === 'delivery' && (
                    <label
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-amber-400 bg-[#25211B] text-white'
                          : 'border-[#2B2723] bg-[#1A1816] hover:border-[#38332C] text-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-1 accent-amber-400"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-emerald-400" />
                          <span className="font-semibold text-xs text-stone-100">Cash on Delivery (COD)</span>
                        </div>
                        <p className="text-[11px] text-stone-400 mt-1">
                          Pay directly to our delivery rider upon receiving your order in Colombo.
                        </p>
                      </div>
                    </label>
                  )}

                  {/* Option 3: Online Bank Transfer / LankaQR */}
                  <label
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-amber-400 bg-[#25211B] text-white'
                        : 'border-[#2B2723] bg-[#1A1816] hover:border-[#38332C] text-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mt-1 accent-amber-400"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-amber-400" />
                        <span className="font-semibold text-xs text-stone-100">Online Banking / LankaQR Transfer</span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-1">
                        Commercial Bank / HNB / Sampath / BOC instant transfer or LankaQR scan.
                      </p>
                    </div>
                  </label>

                </div>
              </div>

              {/* Bank Details Display if Selected */}
              {paymentMethod === 'bank_transfer' && (
                <div className="p-3.5 bg-[#171513] rounded-xl border border-amber-600/40 text-stone-300 space-y-1.5 font-mono text-[11px]">
                  <div className="text-amber-300 font-semibold font-sans text-xs">
                    Melora Bank Account Details:
                  </div>
                  <div>Bank: <span className="text-white font-bold">Commercial Bank of Ceylon</span></div>
                  <div>Account Name: <span className="text-white font-bold">Cafe Melora (Pvt) Ltd</span></div>
                  <div>Account Number: <span className="text-amber-300 font-bold">8002 9182 4501</span></div>
                  <div>Branch: <span className="text-white">Colombo 07 Cinnamon Gardens</span></div>
                  <div className="text-[10px] text-stone-400 font-sans pt-1">
                    Please use your order number or phone as the transfer reference.
                  </div>
                </div>
              )}

              {/* Order Final Summary */}
              <div className="p-3.5 bg-[#181614] rounded-xl border border-[#2B2723] space-y-1.5">
                <div className="flex justify-between text-xs text-stone-400">
                  <span>Customer:</span>
                  <span className="font-medium text-stone-200">{customerName} ({phone})</span>
                </div>
                <div className="flex justify-between text-xs text-stone-400">
                  <span>Fulfillment:</span>
                  <span className="font-medium text-amber-300 capitalize">
                    {orderType.replace('_', ' ')} {orderType === 'dine_in' ? `(${tableNumber})` : ''}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-stone-400">
                  <span>Total Due:</span>
                  <span className="font-bold text-amber-300 text-sm font-mono">Rs. {finalTotal}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-4 py-2.5 bg-[#1E1C19] hover:bg-[#282521] text-stone-300 border border-[#322E28] rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-stone-950" />
                  <span>Confirm Order (Rs. {finalTotal})</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 3: ORDER CONFIRMED RECEIPT & LIVE STATUS */}
          {/* ============================================================== */}
          {step === 'confirmed' && placedOrder && (
            <div className="space-y-5 animate-in fade-in duration-300">
              
              {/* Receipt Header Card */}
              <div className="text-center p-6 bg-gradient-to-b from-[#1C1A17] to-[#161513] rounded-2xl border border-emerald-600/40 space-y-2">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-500/40">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                  Kitchen Has Received Your Order
                </div>
                <h4 className="font-serif-display text-3xl text-white tracking-tight">
                  {placedOrder.orderNumber}
                </h4>
                <div className="flex items-center justify-center gap-2 text-xs text-stone-400">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Estimated Ready: <strong className="text-white font-mono">12–15 Minutes</strong></span>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="p-4 bg-[#181614] rounded-xl border border-[#2B2723] space-y-3">
                <div className="text-xs font-semibold text-stone-200 flex items-center justify-between">
                  <span>Order Status Pipeline</span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Active in Kitchen
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
                  <div className="p-2 rounded bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 font-bold">
                    1. Received
                  </div>
                  <div className="p-2 rounded bg-amber-950/80 border border-amber-600/60 text-amber-300 font-bold">
                    2. Brewing
                  </div>
                  <div className="p-2 rounded bg-[#1F1D1A] border border-[#2D2A26] text-stone-500">
                    3. Ready
                  </div>
                  <div className="p-2 rounded bg-[#1F1D1A] border border-[#2D2A26] text-stone-500">
                    4. Done
                  </div>
                </div>
              </div>

              {/* Order Info Details */}
              <div className="p-4 bg-[#181614] rounded-xl border border-[#2B2723] space-y-2 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>Service:</span>
                  <span className="font-semibold text-stone-100 capitalize">
                    {placedOrder.mode.replace('_', ' ')} {placedOrder.tableNumber ? `— ${placedOrder.tableNumber}` : ''}
                  </span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Guest:</span>
                  <span className="font-semibold text-stone-100">{placedOrder.customerName}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Contact:</span>
                  <span className="font-mono text-stone-200">{placedOrder.phone}</span>
                </div>
                {placedOrder.deliveryAddress && (
                  <div className="flex justify-between text-stone-400">
                    <span>Delivery Address:</span>
                    <span className="font-medium text-stone-200 text-right max-w-[200px] truncate">{placedOrder.deliveryAddress}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#26231F] space-y-1">
                  {placedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-stone-300">
                      <span>{it.quantity}x {it.name}</span>
                      <span className="font-mono text-stone-200">Rs. {it.unitPrice * it.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#26231F]">
                  <span>Total Amount</span>
                  <span className="font-mono text-amber-300">Rs. {placedOrder.total}</span>
                </div>
              </div>

              {/* Guest Wi-Fi & Lounge Note */}
              <div className="p-3 bg-[#171513] rounded-xl border border-[#282521] text-xs text-stone-400 space-y-1">
                <div className="flex items-center gap-2 text-stone-200 font-semibold">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>{settings.websiteUrl || 'www.cafemelora.lk'}</span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Lounge Guest Wi-Fi: <code className="text-amber-300 font-mono font-bold">{settings.wifiPass}</code> on <span className="text-stone-300">{settings.wifiSsid}</span>
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleSendToWhatsApp}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer text-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Receipt to Cafe Melora WhatsApp</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyReceipt}
                    className="flex-1 py-2.5 bg-[#1E1C19] hover:bg-[#282521] text-stone-300 border border-[#322E28] rounded-xl font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs"
                  >
                    {copiedReceipt ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Receipt</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl transition-all cursor-pointer text-xs"
                  >
                    Done
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
