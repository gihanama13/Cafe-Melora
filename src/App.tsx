import React, { useState, useMemo } from 'react';
import { CafeProvider, useCafe } from './context/CafeContext';
import { LiveCafeStatus } from './components/LiveCafeStatus';
import { PromoBanner } from './components/PromoBanner';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CraftShowcase } from './components/CraftShowcase';
import { DealsSection } from './components/DealsSection';
import { MenuSection } from './components/MenuSection';
import { ItemCustomizeModal } from './components/ItemCustomizeModal';
import { DealBuilderModal } from './components/DealBuilderModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { CafeStoryAndVisit } from './components/CafeStoryAndVisit';
import { Footer } from './components/Footer';
import { MenuItem, DealItem } from './data/menuData';
import { CartItem, CartCustomization } from './types/cart';
import { CustomerOrder } from './types/cafe';
import { ShoppingBag, ShieldCheck, Check, LogOut, ArrowRight, Clock } from 'lucide-react';

function CafeApp() {
  const { settings, isAdmin, adminLogout, orders } = useCafe();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);

  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  // Modals state
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [configuringDeal, setConfiguringDeal] = useState<DealItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Confirmed order modal
  const [confirmedOrder, setConfirmedOrder] = useState<CustomerOrder | null>(null);

  const activeOrdersCount = orders.filter((o) => ['pending', 'preparing'].includes(o.status)).length;

  // Cart counts by item id
  const cartItemCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    cartItems.forEach((ci) => {
      counts[ci.item.id] = (counts[ci.item.id] || 0) + ci.quantity;
    });
    return counts;
  }, [cartItems]);

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, ci) => sum + ci.unitPrice * ci.quantity, 0);
  }, [cartItems]);

  const discountPercent = settings.discountPercent || settings.studentDiscountPercent || 10;

  const discountAmount = useMemo(() => {
    return isPromoApplied ? Math.round(subtotal * (discountPercent / 100)) : 0;
  }, [subtotal, isPromoApplied, discountPercent]);

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Add regular item without extra customization
  const handleQuickAdd = (item: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => !ci.isDeal && ci.item.id === item.id && !ci.customization?.toppings?.length);
      if (existing) {
        return prev.map((ci) =>
          ci.cartItemId === existing.cartItemId
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        );
      }
      const newItem: CartItem = {
        cartItemId: `${item.id}-${Date.now()}`,
        item,
        quantity: 1,
        unitPrice: item.price,
      };
      return [...prev, newItem];
    });
    showToast(`Added ${item.name} to bag`);
  };

  // Add customized item
  const handleAddCustomizedItem = (
    item: MenuItem,
    customization: CartCustomization,
    quantity: number
  ) => {
    const toppingsPrice = customization.toppingsPrice || 0;
    const unitPrice = item.price + toppingsPrice;
    const newItem: CartItem = {
      cartItemId: `${item.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      item,
      quantity,
      unitPrice,
      customization,
    };
    setCartItems((prev) => [...prev, newItem]);
    showToast(`Added ${quantity}x ${item.name} to bag`);
  };

  // Add deal
  const handleAddDealToCart = (
    deal: DealItem,
    selections: { beverage1?: string; beverage2?: string; snack?: string }
  ) => {
    const newDealItem: CartItem = {
      cartItemId: `deal-${deal.id}-${Date.now()}`,
      isDeal: true,
      item: deal,
      quantity: 1,
      unitPrice: deal.price,
      dealSelections: selections,
    };
    setCartItems((prev) => [...prev, newDealItem]);
    showToast(`Added ${deal.name} deal (Rs. ${deal.price})`);
  };

  // Update item quantity
  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((ci) => (ci.cartItemId === cartItemId ? { ...ci, quantity: newQty } : ci))
    );
  };

  // Remove item
  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.cartItemId !== cartItemId));
  };

  // Clear cart
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Apply promo
  const handleApplyPromoCode = (code: string) => {
    setPromoCode(code);
    setIsPromoApplied(true);
    showToast(`Promo ${discountPercent}% Off Applied!`);
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === 'deals') {
      const dealsEl = document.getElementById('deals');
      if (dealsEl) dealsEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      const menuEl = document.getElementById('menu');
      if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // When order placed from CheckoutModal
  const handleOrderPlaced = (createdOrder: CustomerOrder) => {
    setCartItems([]);
    setConfirmedOrder(createdOrder);
    setIsCartOpen(false);
    showToast(`Order ${createdOrder.orderNumber} placed successfully!`);
  };

  // If in Admin Portal view
  if (isAdmin && isAdminView) {
    return <AdminPortal onBackToStorefront={() => setIsAdminView(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#121110] text-[#EDE8DF] flex flex-col font-sans selection:bg-amber-900/50 selection:text-amber-200">
      
      {/* Admin Quick Action Strip (if authenticated) */}
      {isAdmin && (
        <div className="bg-amber-950 text-amber-100 text-xs px-4 py-2 border-b border-amber-900/60 transition-all">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-medium">
                Admin Session Active: <strong className="text-white">Cafe Manager</strong>
              </span>
              {activeOrdersCount > 0 && (
                <span className="ml-2 bg-amber-500 text-stone-950 text-[10px] font-bold px-2 py-0.2 rounded-full">
                  {activeOrdersCount} Active Kitchen {activeOrdersCount === 1 ? 'Order' : 'Orders'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsAdminView(true)}
                className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-3 py-1 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Open Admin Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={adminLogout}
                className="text-amber-300 hover:text-white underline cursor-pointer text-xs"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Cafe Operational Status Strip (Alive status & audio ambiance) */}
      <LiveCafeStatus />

      {/* Modern Promotional Announcement Banner */}
      <PromoBanner onApplyCode={handleApplyPromoCode} />

      {/* Navigation Top Bar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onSelectCategory={handleSelectCategory}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminPortal={() => setIsAdminView(true)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <Hero
          onExploreMenu={() => handleSelectCategory('all')}
          onExploreDeals={() => handleSelectCategory('deals')}
        />

        {/* 3 Pillars Visual Craft Showcase */}
        <CraftShowcase onSelectCategory={handleSelectCategory} />

        {/* Melora Value Deals */}
        <DealsSection onConfigureDeal={(deal) => setConfiguringDeal(deal)} />

        {/* Full Interactive Menu Section */}
        <MenuSection
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onQuickAdd={handleQuickAdd}
          onCustomizeItem={(item) => setCustomizingItem(item)}
          cartItemCounts={cartItemCounts}
        />

        {/* Cafe Story, Atmosphere, Location & Hours */}
        <CafeStoryAndVisit />

      </main>

      {/* Footer */}
      <Footer
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminPortal={() => setIsAdminView(true)}
      />

      {/* Floating Quick Bag Pill on Mobile when items exist */}
      {totalCartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-4 sm:hidden z-30">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3.5 px-4 bg-[#1B1917] border border-amber-500/40 text-white rounded-2xl shadow-2xl flex items-center justify-between text-xs font-semibold active:scale-98 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>{totalCartCount} {totalCartCount === 1 ? 'item' : 'items'} in Bag</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-amber-300 font-bold tabular-nums">Rs. {subtotal}</span>
              <span className="text-stone-400">· Checkout →</span>
            </div>
          </button>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1816] text-stone-100 border border-amber-500/40 px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Customization Modal */}
      <ItemCustomizeModal
        item={customizingItem}
        onClose={() => setCustomizingItem(null)}
        onAddToCart={handleAddCustomizedItem}
      />

      {/* Deals Builder Modal */}
      <DealBuilderModal
        deal={configuringDeal}
        onClose={() => setConfiguringDeal(null)}
        onAddDealToCart={handleAddDealToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOpenCheckoutModal={() => setIsCheckoutOpen(true)}
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        isPromoApplied={isPromoApplied}
        setIsPromoApplied={setIsPromoApplied}
      />

      {/* Checkout Modal (Pickup / Delivery / Dine-In & Payment) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        subtotal={subtotal}
        discount={discountAmount}
        finalTotal={finalTotal}
        isPromoApplied={isPromoApplied}
        onOrderPlacedSuccess={handleOrderPlaced}
      />

      {/* Order Confirmation Receipt Modal */}
      <OrderConfirmationModal
        isOpen={!!confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        orderDetails={
          confirmedOrder
            ? {
                orderNumber: confirmedOrder.orderNumber,
                mode: confirmedOrder.mode,
                tableNumber: confirmedOrder.tableNumber || '',
                customerName: confirmedOrder.customerName,
                items: confirmedOrder.items.map((it) => ({
                  cartItemId: it.id,
                  item: {
                    id: it.id,
                    name: it.name,
                    price: it.unitPrice,
                    category: 'coffee',
                    description: '',
                  },
                  quantity: it.quantity,
                  unitPrice: it.unitPrice,
                  customization: {
                    sweetness: it.sweetness,
                    ice: it.ice,
                    toppings: it.toppings,
                  },
                })),
                subtotal: confirmedOrder.subtotal,
                discount: confirmedOrder.discount,
                total: confirmedOrder.total,
                notes: confirmedOrder.notes || '',
                createdAt: confirmedOrder.createdAt,
              }
            : null
        }
      />

      {/* Staff & Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => setIsAdminView(true)}
      />

      {/* Live Order Tracker Modal */}
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <CafeProvider>
      <CafeApp />
    </CafeProvider>
  );
}
