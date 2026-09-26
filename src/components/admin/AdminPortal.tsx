import React, { useState } from 'react';
import { useCafe, EditableMenuItem } from '../../context/CafeContext';
import { CustomerOrder, OrderStatus, CafeSettings } from '../../types/cafe';
import {
  Coffee,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Settings,
  UtensilsCrossed,
  HelpCircle,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Check,
  Search,
  Phone,
  MapPin,
  Wifi,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Globe,
  Bike,
  Utensils,
  CreditCard,
  Banknote,
  QrCode,
  DollarSign
} from 'lucide-react';

interface AdminPortalProps {
  onBackToStorefront: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToStorefront }) => {
  const {
    settings,
    updateSettings,
    resetSettings,
    menuItems,
    updateMenuItem,
    toggleItemAvailability,
    addMenuItem,
    deleteMenuItem,
    resetMenu,
    toppings,
    updateToppingPrice,
    deals,
    updateDeal,
    orders,
    updateOrderStatus,
    deleteOrder,
    adminLogout,
  } = useCafe();

  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'settings' | 'guide'>('orders');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [menuCatFilter, setMenuCatFilter] = useState<string>('all');
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<CafeSettings>({ ...settings });

  // Add Item Modal state
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EditableMenuItem | null>(null);
  const [newItem, setNewItem] = useState<{
    name: string;
    price: number;
    category: 'coffee' | 'milkshakes' | 'boba' | 'refreshers' | 'bites' | 'sweets';
    description: string;
    isPopular: boolean;
  }>({
    name: '',
    price: 500,
    category: 'coffee',
    description: '',
    isPopular: false,
  });

  const showSuccessFeedback = (msg: string) => {
    setSavedFeedback(msg);
    setTimeout(() => {
      setSavedFeedback(null);
    }, 2800);
  };

  const handleSaveEditItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    updateMenuItem(editingItem.id, {
      name: editingItem.name.trim(),
      category: editingItem.category,
      price: Number(editingItem.price) || 0,
      description: editingItem.description.trim(),
      isPopular: editingItem.isPopular,
      isAvailable: editingItem.isAvailable,
      options: ['coffee', 'boba', 'refreshers'].includes(editingItem.category)
        ? { hasSweetness: true, hasIce: true, hasToppings: editingItem.category === 'boba' }
        : undefined,
    });
    showSuccessFeedback(`Updated "${editingItem.name}" successfully!`);
    setEditingItem(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    showSuccessFeedback('Cafe settings and contact info updated successfully!');
  };

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    addMenuItem({
      name: newItem.name.trim(),
      price: Number(newItem.price) || 450,
      category: newItem.category,
      description: newItem.description.trim(),
      isPopular: newItem.isPopular,
      isAvailable: true,
      options: ['coffee', 'boba', 'refreshers'].includes(newItem.category)
        ? { hasSweetness: true, hasIce: true, hasToppings: newItem.category === 'boba' }
        : undefined,
    });
    setNewItem({
      name: '',
      price: 500,
      category: 'coffee',
      description: '',
      isPopular: false,
    });
    setIsAddItemOpen(false);
    showSuccessFeedback(`Added "${newItem.name}" to menu!`);
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  // Filtered menu items
  const filteredMenuItems = menuItems.filter((i) => {
    if (menuCatFilter !== 'all' && i.category !== menuCatFilter) return false;
    if (menuSearchQuery.trim()) {
      const q = menuSearchQuery.toLowerCase();
      return i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q);
    }
    return true;
  });

  // Quick stats
  const activeOrdersCount = orders.filter((o) => ['pending', 'preparing', 'ready'].includes(o.status)).length;
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-[#0D0C0B] text-stone-200 flex flex-col font-sans">
      
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-[#141311] border-b border-[#25221F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStorefront}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#201D1A] transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Storefront View</span>
            </button>
            <div className="h-4 w-px bg-stone-800 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-display text-xl sm:text-2xl text-white">
                  {settings.name} Manager
                </span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] uppercase font-semibold px-2 py-0.5 rounded">
                  Admin Portal
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <span className="animate-pulse bg-rose-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{pendingCount} New Order{pendingCount === 1 ? '' : 's'}</span>
              </span>
            )}
            <button
              onClick={adminLogout}
              className="text-stone-400 hover:text-white p-2 rounded-lg hover:bg-[#201D1A] text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Log out of Admin"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Exit Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sub-Tabs & Notification Toast */}
      <div className="bg-[#121110] border-b border-[#22201D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 scrollbar-none text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-white hover:bg-[#1A1816]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Live Kitchen Orders</span>
              {activeOrdersCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === 'orders' ? 'bg-stone-950 text-amber-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {activeOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'menu'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-white hover:bg-[#1A1816]'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Menu & Pricing Manager</span>
              <span className="text-stone-500 text-[11px]">({menuItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-white hover:bg-[#1A1816]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Cafe Details & Contacts</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-white hover:bg-[#1A1816]'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Admin Guide & FAQ</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Floating Save / Action Toast */}
      {savedFeedback && (
        <div className="fixed top-20 right-6 z-50 bg-[#1D1B18] border border-emerald-500/50 text-white px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{savedFeedback}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full">
        
        {/* ============================================================== */}
        {/* TAB 1: LIVE ORDERS PIPELINE */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Header & Order Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#161513] p-4 rounded-xl border border-[#272421]">
                <div className="text-xs text-stone-400">Orders in Kitchen</div>
                <div className="text-2xl font-bold font-mono text-[#FAF7F2] mt-1">
                  {activeOrdersCount}
                </div>
                <div className="text-[11px] text-amber-400 mt-1">Pending, Brewing or Ready</div>
              </div>

              <div className="bg-[#161513] p-4 rounded-xl border border-[#272421]">
                <div className="text-xs text-stone-400">Total Orders Logged</div>
                <div className="text-2xl font-bold font-mono text-[#FAF7F2] mt-1">
                  {orders.length}
                </div>
                <div className="text-[11px] text-stone-500 mt-1">Dine-in, Pickup & Delivery</div>
              </div>

              <div className="bg-[#161513] p-4 rounded-xl border border-[#272421]">
                <div className="text-xs text-stone-400">Total Order Volume</div>
                <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
                  Rs. {totalRevenue.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-400 mt-1">Active Storefront Volume</div>
              </div>
            </div>

            {/* Filter Pipeline Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#161513] p-3 rounded-xl border border-[#272421]">
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {(['all', 'pending', 'preparing', 'ready', 'completed', 'cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer font-medium ${
                      orderStatusFilter === st
                        ? 'bg-amber-400 text-stone-950 font-bold'
                        : 'text-stone-400 hover:text-white hover:bg-[#201D1A]'
                    }`}
                  >
                    {st === 'all' ? 'All Orders' : st}
                  </button>
                ))}
              </div>

              <div className="text-xs text-stone-400 font-mono">
                Showing {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
              </div>
            </div>

            {/* Order Cards Grid */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-20 bg-[#161513] rounded-2xl border border-[#272421] text-stone-500 space-y-2">
                <ShoppingBag className="w-10 h-10 mx-auto text-stone-700" />
                <p className="text-sm font-medium text-stone-300">No orders found in this filter</p>
                <p className="text-xs text-stone-500">
                  New orders placed through the customer storefront or checkout will appear here in real time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredOrders.map((order) => {
                  const isPending = order.status === 'pending';
                  const isPrep = order.status === 'preparing';
                  const isReady = order.status === 'ready';
                  const isCompleted = order.status === 'completed';
                  const isCancelled = order.status === 'cancelled';

                  return (
                    <div
                      key={order.orderId}
                      className={`bg-[#181614] rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-lg ${
                        isPending
                          ? 'border-amber-500/70 ring-1 ring-amber-500/30'
                          : isPrep
                          ? 'border-blue-500/40'
                          : isReady
                          ? 'border-emerald-500/40'
                          : 'border-[#282521] opacity-80'
                      }`}
                    >
                      {/* Order Card Header */}
                      <div className="p-4 border-b border-[#24211D] bg-[#141311] flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif-display text-lg text-white font-bold tracking-tight">
                              {order.orderNumber}
                            </span>
                            <span
                              className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full font-mono ${
                                isPending
                                  ? 'bg-amber-950 text-amber-300 border border-amber-600/60 animate-pulse'
                                  : isPrep
                                  ? 'bg-blue-950 text-blue-300 border border-blue-600/60'
                                  : isReady
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/60'
                                  : isCompleted
                                  ? 'bg-stone-900 text-stone-400'
                                  : 'bg-rose-950 text-rose-300'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5 font-mono">
                            <Clock className="w-3 h-3 text-stone-500" />
                            <span>{order.createdAt}</span>
                          </div>
                        </div>

                        {/* Service mode badge */}
                        <div className="text-right">
                          <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wide bg-[#201D1A] px-2.5 py-1 rounded-lg border border-[#2E2A25] inline-flex items-center gap-1">
                            {order.mode === 'delivery' && <Bike className="w-3 h-3 text-amber-400" />}
                            {order.mode === 'dine_in' && <Utensils className="w-3 h-3 text-amber-400" />}
                            {order.mode === 'takeaway' && <ShoppingBag className="w-3 h-3 text-amber-400" />}
                            <span>{order.mode.replace('_', ' ')}</span>
                          </span>
                          {order.tableNumber && (
                            <div className="text-[11px] text-stone-400 font-medium mt-0.5">
                              {order.tableNumber}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Customer & Location */}
                      <div className="p-4 flex-1">
                        <div className="text-xs mb-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-stone-400">Customer:</span>
                            <span className="font-semibold text-stone-200">{order.customerName}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-stone-400">Phone:</span>
                            <a
                              href={`tel:${order.phone}`}
                              className="font-mono text-amber-400 hover:underline"
                            >
                              {order.phone}
                            </a>
                          </div>
                          {order.deliveryAddress && (
                            <div className="pt-1">
                              <span className="text-stone-400 block text-[11px]">Delivery Drop-off:</span>
                              <span className="text-stone-300 text-[11px] bg-[#141311] p-1.5 rounded border border-[#26231F] block mt-0.5">
                                {order.deliveryAddress}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-stone-400">Payment:</span>
                            <span className="font-mono text-stone-300 uppercase text-[11px]">
                              {order.paymentMethod} ({order.paymentStatus})
                            </span>
                          </div>
                        </div>

                        {/* Itemized Order Items */}
                        <div className="space-y-2 mb-4 bg-[#141311] p-3 rounded-xl border border-[#24211D]">
                          <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                            Kitchen Items ({order.items.length})
                          </div>
                          {order.items.map((it, idx) => (
                            <div key={idx} className="text-xs border-b border-[#22201D] pb-1.5 last:border-0 last:pb-0">
                              <div className="flex justify-between font-medium text-stone-100">
                                <span>{it.quantity}x {it.name}</span>
                                <span className="font-mono text-stone-300">Rs. {it.unitPrice * it.quantity}</span>
                              </div>
                              {/* Customization Details */}
                              <div className="text-[11px] text-stone-400 pl-2 mt-0.5 space-y-0.5">
                                {it.sweetness && <div>Sugar: <span className="text-stone-200">{it.sweetness}</span></div>}
                                {it.ice && <div>Ice: <span className="text-stone-200">{it.ice}</span></div>}
                                {it.toppings && it.toppings.length > 0 && (
                                  <div>Toppings: <span className="text-amber-300 font-medium">{it.toppings.join(', ')}</span></div>
                                )}
                                {it.dealSummary && <div>Deal: {it.dealSummary}</div>}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Notes */}
                        {order.notes && (
                          <div className="text-xs bg-amber-950/40 p-2.5 rounded-lg border border-amber-700/50 text-amber-200 italic mb-4">
                            Note: "{order.notes}"
                          </div>
                        )}

                        {/* Pricing Summary */}
                        <div className="flex items-baseline justify-between text-xs pt-1 border-t border-[#24211D] mb-4">
                          <span className="text-stone-400">Order Total:</span>
                          <span className="text-base font-bold text-amber-300 font-mono tabular-nums">
                            Rs. {order.total}
                          </span>
                        </div>
                      </div>

                      {/* Action Pipeline Buttons */}
                      <div className="p-4 bg-[#141311] border-t border-[#24211D] space-y-2">
                        {isPending && (
                          <button
                            onClick={() => {
                              updateOrderStatus(order.orderId, 'preparing');
                              showSuccessFeedback(`Order ${order.orderNumber} sent to Kitchen!`);
                            }}
                            className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Coffee className="w-3.5 h-3.5" />
                            <span>Accept & Start Brewing</span>
                          </button>
                        )}

                        {isPrep && (
                          <button
                            onClick={() => {
                              updateOrderStatus(order.orderId, 'ready');
                              showSuccessFeedback(`Order ${order.orderNumber} marked Ready for Pickup!`);
                            }}
                            className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Ready for Pickup / Table</span>
                          </button>
                        )}

                        {isReady && (
                          <button
                            onClick={() => {
                              updateOrderStatus(order.orderId, 'completed');
                              showSuccessFeedback(`Order ${order.orderNumber} Completed!`);
                            }}
                            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Complete & Archive Order</span>
                          </button>
                        )}

                        <div className="flex items-center justify-between pt-1 text-[11px]">
                          {order.status !== 'cancelled' && order.status !== 'completed' && (
                            <button
                              onClick={() => {
                                if (window.confirm('Cancel this order?')) {
                                  updateOrderStatus(order.orderId, 'cancelled');
                                  showSuccessFeedback(`Order ${order.orderNumber} cancelled.`);
                                }
                              }}
                              className="text-stone-500 hover:text-rose-400 cursor-pointer"
                            >
                              Cancel Order
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (window.confirm('Permanently delete this order record?')) {
                                deleteOrder(order.orderId);
                                showSuccessFeedback(`Order ${order.orderNumber} deleted.`);
                              }
                            }}
                            className="text-stone-600 hover:text-rose-400 ml-auto cursor-pointer"
                          >
                            Delete Record
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: MENU & PRICING MANAGER */}
        {/* ============================================================== */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#161513] p-4 rounded-2xl border border-[#272421]">
              <div className="flex-1 max-w-md relative">
                <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={menuSearchQuery}
                  onChange={(e) => setMenuSearchQuery(e.target.value)}
                  placeholder="Search item to edit price or availability..."
                  className="w-full pl-9 pr-4 py-2 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddItemOpen(true)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4 text-stone-950" />
                  <span>Add New Menu Item</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Reset menu items to default Cafe Melora list?')) {
                      resetMenu();
                      showSuccessFeedback('Menu reset to defaults!');
                    }
                  }}
                  className="px-3 py-2 bg-[#1B1917] hover:bg-[#25221E] text-stone-400 border border-[#2E2A25] rounded-xl text-xs transition-colors cursor-pointer"
                  title="Reset to original prices"
                >
                  Reset Defaults
                </button>
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'coffee', label: 'Iced Coffee' },
                { id: 'milkshakes', label: 'Milkshakes' },
                { id: 'boba', label: 'Bubble Tea' },
                { id: 'refreshers', label: 'Refreshers' },
                { id: 'bites', label: 'Bites' },
                { id: 'sweets', label: 'Sweets' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setMenuCatFilter(c.id)}
                  className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer font-medium ${
                    menuCatFilter === c.id
                      ? 'bg-amber-400 text-stone-950 font-bold'
                      : 'bg-[#181614] text-stone-400 hover:text-white border border-[#282521]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Menu Items List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 bg-[#181614] rounded-2xl border transition-all flex flex-col justify-between ${
                    item.isAvailable === false
                      ? 'border-rose-900/40 bg-[#141311] opacity-60'
                      : 'border-[#282521] hover:border-[#38332C]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-amber-400 tracking-wider">
                          {item.category}
                        </span>
                        <h4 className="font-semibold text-sm text-stone-100">
                          {item.name}
                        </h4>
                      </div>

                      {/* Stock availability toggle */}
                      <button
                        onClick={() => {
                          toggleItemAvailability(item.id);
                          showSuccessFeedback(
                            `${item.name} marked as ${item.isAvailable === false ? 'Available' : 'Sold Out'}`
                          );
                        }}
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          item.isAvailable === false
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                            : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                        }`}
                      >
                        {item.isAvailable === false ? 'Sold Out' : 'In Stock'}
                      </button>
                    </div>

                    <p className="text-xs text-stone-400 line-clamp-2 mb-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Price Edit & Controls */}
                  <div className="pt-3 border-t border-[#24211D] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-stone-400 font-mono">Rs.</span>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          updateMenuItem(item.id, { price: val });
                        }}
                        className="w-20 p-1.5 bg-[#141311] border border-[#2E2A25] rounded-lg text-xs font-mono font-bold text-amber-300 text-right focus:outline-none focus:border-amber-400"
                        title="Directly edit price in Rupees"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingItem({ ...item })}
                        className="p-1.5 rounded-lg text-xs text-stone-400 hover:text-white hover:bg-[#25221E] transition-colors cursor-pointer"
                        title="Edit all product details (name, category, price, description)"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                      </button>

                      <button
                        onClick={() => {
                          updateMenuItem(item.id, { isPopular: !item.isPopular });
                          showSuccessFeedback(`Updated popular flag for ${item.name}`);
                        }}
                        className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          item.isPopular
                            ? 'text-amber-300 bg-amber-950/80 border border-amber-700/60'
                            : 'text-stone-500 hover:text-stone-300'
                        }`}
                        title={item.isPopular ? 'Featured Specialty' : 'Mark as Specialty'}
                      >
                        ★
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${item.name}" from menu?`)) {
                            deleteMenuItem(item.id);
                            showSuccessFeedback(`Deleted ${item.name}`);
                          }
                        }}
                        className="p-1.5 text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Boba Topping Prices Editor */}
            <div className="p-6 bg-[#161513] rounded-2xl border border-[#272421] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-display text-xl text-white">
                    Bubble Tea Topping Prices
                  </h3>
                  <p className="text-xs text-stone-400">
                    Adjust the additional add-on cost for Boba, Jelly, and Tapioca.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {toppings.map((top) => (
                  <div
                    key={top.id}
                    className="p-3 bg-[#1B1917] rounded-xl border border-[#2B2723] flex items-center justify-between"
                  >
                    <span className="text-xs font-semibold text-stone-200">{top.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-stone-400 font-mono">+Rs.</span>
                      <input
                        type="number"
                        value={top.price}
                        onChange={(e) => updateToppingPrice(top.id, Number(e.target.value))}
                        className="w-16 p-1 bg-[#141311] border border-[#2E2A25] rounded text-xs font-mono font-bold text-amber-300 text-right focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: CAFE DETAILS, CONTACTS & SETTINGS */}
        {/* ============================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* Core Brand & Web Domain Card */}
              <div className="p-6 bg-[#161513] rounded-2xl border border-[#272421] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif-display text-xl text-white">
                      Brand & Official Website Domain
                    </h3>
                    <p className="text-xs text-stone-400">
                      Configure your cafe title, tagline, and custom domain name.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Cafe Name</label>
                    <input
                      type="text"
                      value={settingsForm.name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                      className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-stone-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Website Domain</label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={settingsForm.websiteUrl || 'www.cafemelora.lk'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, websiteUrl: e.target.value })}
                        placeholder="www.cafemelora.lk"
                        className="w-full pl-9 pr-3 py-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Tagline</label>
                    <input
                      type="text"
                      value={settingsForm.tagline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                      className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-stone-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information & WhatsApp */}
              <div className="p-6 bg-[#161513] rounded-2xl border border-[#272421] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif-display text-xl text-white">
                      Contact Numbers & Customer WhatsApp
                    </h3>
                    <p className="text-xs text-stone-400">
                      When customers click "Send to WhatsApp", messages are sent to this WhatsApp number.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Telephone Hotline</label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">WhatsApp Order Number</label>
                    <input
                      type="text"
                      value={settingsForm.whatsappPhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappPhone: e.target.value })}
                      placeholder="+94771234567"
                      className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-[10px] text-stone-500 mt-1 block">Include country code +94</span>
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-stone-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Physical Address & Operating Hours */}
              <div className="p-6 bg-[#161513] rounded-2xl border border-[#272421] space-y-4">
                <h3 className="font-serif-display text-xl text-white">
                  Location, Landmark & Operating Hours
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Physical Address</label>
                    <input
                      type="text"
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-stone-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Nearby Landmark</label>
                    <input
                      type="text"
                      value={settingsForm.landmark}
                      onChange={(e) => setSettingsForm({ ...settingsForm, landmark: e.target.value })}
                      className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-stone-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Weekday Hours</label>
                    <input
                      type="text"
                      value={settingsForm.weekdayHours}
                      onChange={(e) => setSettingsForm({ ...settingsForm, weekdayHours: e.target.value })}
                      className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-stone-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Weekend Hours</label>
                    <input
                      type="text"
                      value={settingsForm.weekendHours}
                      onChange={(e) => setSettingsForm({ ...settingsForm, weekendHours: e.target.value })}
                      className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-stone-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Guest Wi-Fi & Promo Code Settings */}
              <div className="p-6 bg-[#161513] rounded-2xl border border-[#272421] space-y-4">
                <h3 className="font-serif-display text-xl text-white">
                  Lounge Wi-Fi, Online Promo Code & Admin Passcode
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Guest Wi-Fi SSID</label>
                    <input
                      type="text"
                      value={settingsForm.wifiSsid}
                      onChange={(e) => setSettingsForm({ ...settingsForm, wifiSsid: e.target.value })}
                      className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Guest Wi-Fi Password</label>
                    <input
                      type="text"
                      value={settingsForm.wifiPass}
                      onChange={(e) => setSettingsForm({ ...settingsForm, wifiPass: e.target.value })}
                      className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Online Promo Code</label>
                    <input
                      type="text"
                      value={settingsForm.promoCode || 'MELORA10'}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        setSettingsForm({ ...settingsForm, promoCode: val, studentPromoCode: val });
                      }}
                      className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-stone-100 font-mono font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Admin Security PIN</label>
                    <input
                      type="text"
                      value={settingsForm.adminPin || 'melora2026'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                      className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button Row */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset all cafe settings to original defaults?')) {
                      resetSettings();
                      setSettingsForm({ ...settings });
                      showSuccessFeedback('Settings reset to defaults');
                    }
                  }}
                  className="px-4 py-2.5 bg-[#1B1917] hover:bg-[#25221E] text-stone-400 border border-[#2E2A25] rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Reset Defaults
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-stone-950" />
                  <span>Save All Settings & Updates</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: COMPREHENSIVE ADMIN GUIDE & FAQ */}
        {/* ============================================================== */}
        {activeTab === 'guide' && (
          <div className="space-y-6 max-w-4xl">
            
            <div className="p-6 bg-[#161513] rounded-2xl border border-[#272421] space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <HelpCircle className="w-5 h-5" />
                <h3 className="font-serif-display text-2xl text-white">
                  Cafe Melora Owner & Staff Operating Guide
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Welcome to your cafe management console for <strong className="text-white">www.cafemelora.lk</strong>. Below is your complete step-by-step walkthrough for processing online orders, adjusting menu items and pricing, and updating contact details.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Guide 1: How to get admin permissions */}
              <div className="p-5 bg-[#181614] rounded-2xl border border-[#282521] space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-950/80 border border-amber-600/50 text-amber-300 flex items-center justify-center font-bold text-xs font-mono">
                    1
                  </div>
                  <h4 className="font-semibold text-stone-100 text-sm">
                    How to get Admin Access & Permissions?
                  </h4>
                </div>
                <div className="text-xs text-stone-400 space-y-1.5 pl-9 leading-relaxed">
                  <p>• Click the <strong className="text-white">"Staff"</strong> or <strong className="text-white">"Staff & Management Portal"</strong> button at the top navbar or footer.</p>
                  <p>• Enter your security PIN passcode (Default: <code className="text-amber-300 font-mono font-bold bg-[#141311] px-1.5 py-0.5 rounded">melora2026</code>).</p>
                  <p>• Once authenticated, you will immediately have manager rights to accept live kitchen orders, edit prices, and update store info.</p>
                  <p>• You can customize this PIN anytime in the <strong>"Cafe Details & Contacts"</strong> tab.</p>
                </div>
              </div>

              {/* Guide 2: How to process online orders */}
              <div className="p-5 bg-[#181614] rounded-2xl border border-[#282521] space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-950/80 border border-amber-600/50 text-amber-300 flex items-center justify-center font-bold text-xs font-mono">
                    2
                  </div>
                  <h4 className="font-semibold text-stone-100 text-sm">
                    How to Process Online Orders?
                  </h4>
                </div>
                <div className="text-xs text-stone-400 space-y-1.5 pl-9 leading-relaxed">
                  <p>• Switch to the <strong className="text-white">"Live Kitchen Orders"</strong> tab.</p>
                  <p>• When a customer submits an order, it lands in <strong className="text-amber-300">"Pending"</strong> status.</p>
                  <p>• Click <strong className="text-white">"Accept & Start Brewing"</strong> to move it into <span className="text-blue-300">"Preparing"</span>.</p>
                  <p>• Once drinks & toasties are ready, click <strong className="text-white">"Mark Ready for Pickup"</strong>.</p>
                  <p>• When collected or delivered, click <strong className="text-white">"Complete & Archive Order"</strong>.</p>
                </div>
              </div>

              {/* Guide 3: Changing menu items & prices */}
              <div className="p-5 bg-[#181614] rounded-2xl border border-[#282521] space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-950/80 border border-amber-600/50 text-amber-300 flex items-center justify-center font-bold text-xs font-mono">
                    3
                  </div>
                  <h4 className="font-semibold text-stone-100 text-sm">
                    How to Edit Menu Items & Prices?
                  </h4>
                </div>
                <div className="text-xs text-stone-400 space-y-1.5 pl-9 leading-relaxed">
                  <p>• Navigate to the <strong className="text-white">"Menu & Pricing Manager"</strong> tab.</p>
                  <p>• To change a price, simply type a new value in the <strong className="text-amber-300 font-mono">Rs. [price]</strong> input box. It updates live on the website.</p>
                  <p>• To mark an item sold out for the day, toggle the <strong className="text-emerald-400">"In Stock"</strong> button to <span className="text-rose-400">"Sold Out"</span>.</p>
                  <p>• To add a new drink or snack, click <strong className="text-white">"+ Add New Menu Item"</strong>.</p>
                </div>
              </div>

              {/* Guide 4: Changing contact numbers, address & website */}
              <div className="p-5 bg-[#181614] rounded-2xl border border-[#282521] space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-950/80 border border-amber-600/50 text-amber-300 flex items-center justify-center font-bold text-xs font-mono">
                    4
                  </div>
                  <h4 className="font-semibold text-stone-100 text-sm">
                    How to Change Contacts & Store Address?
                  </h4>
                </div>
                <div className="text-xs text-stone-400 space-y-1.5 pl-9 leading-relaxed">
                  <p>• Go to the <strong className="text-white">"Cafe Details & Contacts"</strong> tab.</p>
                  <p>• Update the <strong className="text-white">Telephone Hotline</strong>, <strong className="text-white">WhatsApp Order Number</strong>, or <strong className="text-white">Physical Address</strong>.</p>
                  <p>• You can also update your custom domain name (e.g. <code className="text-amber-300 font-mono">www.cafemelora.lk</code>), opening hours, and Wi-Fi credentials.</p>
                  <p>• Click <strong className="text-white">"Save All Settings & Updates"</strong>. All customer-facing pages and WhatsApp receipts sync automatically!</p>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Add New Item Modal */}
      {isAddItemOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs">
          <div className="bg-[#141311] rounded-2xl max-w-md w-full shadow-2xl border border-[#2B2723] p-6 space-y-4 text-stone-200">
            <div className="flex items-center justify-between border-b border-[#24211D] pb-3">
              <h3 className="font-serif-display text-xl text-white">
                Add New Menu Item
              </h3>
              <button
                onClick={() => setIsAddItemOpen(false)}
                className="text-stone-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-300 mb-1 font-medium">Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cold Brew Oat Tonic"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                    className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-stone-100 capitalize focus:outline-none focus:border-amber-400"
                  >
                    <option value="coffee">Iced Coffee</option>
                    <option value="milkshakes">Milkshakes</option>
                    <option value="boba">Bubble Tea</option>
                    <option value="refreshers">Refreshers</option>
                    <option value="bites">Bites</option>
                    <option value="sweets">Sweets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Single-origin cold brew lightly carbonated with natural yuzu citrus."
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="popularCheck"
                  checked={newItem.isPopular}
                  onChange={(e) => setNewItem({ ...newItem, isPopular: e.target.checked })}
                  className="rounded text-amber-400 accent-amber-400"
                />
                <label htmlFor="popularCheck" className="text-stone-300 cursor-pointer">
                  Feature as House Specialty / Popular Item
                </label>
              </div>

              <div className="pt-3 border-t border-[#24211D] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddItemOpen(false)}
                  className="px-3.5 py-2 text-stone-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl cursor-pointer shadow-md"
                >
                  Add to Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Existing Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs">
          <div className="bg-[#141311] rounded-2xl max-w-md w-full shadow-2xl border border-[#2B2723] p-6 space-y-4 text-stone-200">
            <div className="flex items-center justify-between border-b border-[#24211D] pb-3">
              <h3 className="font-serif-display text-xl text-white">
                Edit Menu Product: {editingItem.name}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-stone-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-300 mb-1 font-medium">Product Name *</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                    className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-stone-100 capitalize focus:outline-none focus:border-amber-400"
                  >
                    <option value="coffee">Iced Coffee</option>
                    <option value="milkshakes">Milkshakes</option>
                    <option value="boba">Bubble Tea</option>
                    <option value="refreshers">Refreshers</option>
                    <option value="bites">Bites</option>
                    <option value="sweets">Sweets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Product Description</label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full p-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isAvailable !== false}
                    onChange={(e) => setEditingItem({ ...editingItem, isAvailable: e.target.checked })}
                    className="rounded text-emerald-400 accent-emerald-400"
                  />
                  <span className="text-stone-300">In Stock & Orderable</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingItem.isPopular}
                    onChange={(e) => setEditingItem({ ...editingItem, isPopular: e.target.checked })}
                    className="rounded text-amber-400 accent-amber-400"
                  />
                  <span className="text-stone-300">★ Specialty Item</span>
                </label>
              </div>

              <div className="pt-3 border-t border-[#24211D] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3.5 py-2 text-stone-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl cursor-pointer shadow-md"
                >
                  Save Product Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
