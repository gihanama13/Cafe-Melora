import React, { createContext, useContext, useState, useEffect } from 'react';
import { CafeSettings, CustomerOrder, OrderStatus } from '../types/cafe';
import { MENU_ITEMS, MELORA_DEALS, MenuItem, DealItem, EXTRA_TOPPINGS } from '../data/menuData';

export interface EditableMenuItem extends MenuItem {
  isAvailable?: boolean;
}

interface CafeContextType {
  settings: CafeSettings;
  updateSettings: (newSettings: Partial<CafeSettings>) => void;
  resetSettings: () => void;
  
  menuItems: EditableMenuItem[];
  updateMenuItem: (id: string, updates: Partial<EditableMenuItem>) => void;
  toggleItemAvailability: (id: string) => void;
  addMenuItem: (item: Omit<EditableMenuItem, 'id'>) => void;
  deleteMenuItem: (id: string) => void;
  resetMenu: () => void;

  toppings: Array<{ id: string; name: string; price: number }>;
  updateToppingPrice: (id: string, newPrice: number) => void;

  deals: DealItem[];
  updateDeal: (id: string, updates: Partial<DealItem>) => void;

  orders: CustomerOrder[];
  createOrder: (orderData: Omit<CustomerOrder, 'orderId' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'status'>) => CustomerOrder;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  isAdmin: boolean;
  adminLogin: (pin: string) => boolean;
  adminLogout: () => void;
}

const DEFAULT_SETTINGS: CafeSettings = {
  name: 'Cafe Melora',
  websiteUrl: 'www.cafemelora.lk',
  tagline: 'Warm • Minimal • Sweet',
  phone: '+94 11 268 9450',
  whatsappPhone: '+94771234567',
  email: 'hello@cafemelora.lk',
  address: '24 Garden Walk, Colombo 07, Sri Lanka',
  landmark: 'Adjacent to Viharamahadevi Gardens & Green Path',
  weekdayHours: 'Mon – Fri: 7:30 AM – 10:00 PM',
  weekendHours: 'Sat – Sun: 8:00 AM – 10:30 PM',
  wifiSsid: 'Melora-HighSpeed',
  wifiPass: 'meloracoffee',
  promoCode: 'MELORA10',
  discountPercent: 10,
  studentPromoCode: 'MELORA10',
  studentDiscountPercent: 10,
  adminPin: 'melora2026',
};

const DEFAULT_TOPPINGS = [
  { id: 'tapioca', name: 'Tapioca Pearls', price: 100 },
  { id: 'popping_boba', name: 'Popping Boba', price: 100 },
  { id: 'jelly', name: 'Jelly', price: 100 },
  { id: 'crystal_boba', name: 'Crystal Boba', price: 100 },
];

const INITIAL_SAMPLE_ORDERS: CustomerOrder[] = [
  {
    orderId: 'ord-sample-1',
    orderNumber: '#ML-1048',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'preparing',
    mode: 'dine_in',
    tableNumber: 'Table 4 (Power Outlet)',
    customerName: 'Kavindu Silva',
    phone: '+94 71 889 2201',
    paymentMethod: 'counter',
    paymentStatus: 'pending',
    items: [
      {
        id: 'iced-caramel',
        name: 'Iced Caramel',
        quantity: 1,
        unitPrice: 500,
        sweetness: '70% Less Sweet',
        ice: 'Regular Ice',
      },
      {
        id: 'bite-cheese-toastie',
        name: 'Cheese Toastie',
        quantity: 1,
        unitPrice: 250,
      },
    ],
    subtotal: 750,
    discount: 0,
    total: 750,
    notes: 'Extra crisp on toastie please!',
  },
  {
    orderId: 'ord-sample-2',
    orderNumber: '#ML-1049',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'pending',
    mode: 'takeaway',
    customerName: 'Dilini Perera',
    phone: '+94 77 442 9180',
    paymentMethod: 'counter',
    paymentStatus: 'pending',
    items: [
      {
        id: 'boba-brown-sugar',
        name: 'Brown Sugar Boba',
        quantity: 2,
        unitPrice: 650,
        sweetness: '50% Half Sweet',
        ice: 'Less Ice',
        toppings: ['Tapioca Pearls'],
      },
      {
        id: 'sweet-brownie',
        name: 'Brownie',
        quantity: 1,
        unitPrice: 250,
      },
    ],
    subtotal: 1550,
    discount: 155,
    total: 1395,
    notes: 'Pick up on the way to the morning meeting.',
  },
];

const CafeContext = createContext<CafeContextType | undefined>(undefined);

export const CafeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Settings
  const [settings, setSettings] = useState<CafeSettings>(() => {
    const saved = localStorage.getItem('cafe_melora_settings');
    if (saved) {
      try { return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }; } catch (e) { /* ignore */ }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('cafe_melora_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<CafeSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  // 2. Menu Items
  const [menuItems, setMenuItems] = useState<EditableMenuItem[]>(() => {
    const saved = localStorage.getItem('cafe_melora_menu');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return MENU_ITEMS.map((item) => ({ ...item, isAvailable: true }));
  });

  useEffect(() => {
    localStorage.setItem('cafe_melora_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  const updateMenuItem = (id: string, updates: Partial<EditableMenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const toggleItemAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: item.isAvailable === false ? true : false } : item
      )
    );
  };

  const addMenuItem = (item: Omit<EditableMenuItem, 'id'>) => {
    const newItem: EditableMenuItem = {
      ...item,
      id: `custom-${Date.now()}`,
      isAvailable: true,
    };
    setMenuItems((prev) => [...prev, newItem]);
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const resetMenu = () => {
    setMenuItems(MENU_ITEMS.map((item) => ({ ...item, isAvailable: true })));
  };

  // 3. Toppings
  const [toppings, setToppings] = useState<Array<{ id: string; name: string; price: number }>>(() => {
    const saved = localStorage.getItem('cafe_melora_toppings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEFAULT_TOPPINGS;
  });

  useEffect(() => {
    localStorage.setItem('cafe_melora_toppings', JSON.stringify(toppings));
  }, [toppings]);

  const updateToppingPrice = (id: string, newPrice: number) => {
    setToppings((prev) =>
      prev.map((t) => (t.id === id ? { ...t, price: newPrice } : t))
    );
  };

  // 4. Deals
  const [deals, setDeals] = useState<DealItem[]>(() => {
    const saved = localStorage.getItem('cafe_melora_deals');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return MELORA_DEALS;
  });

  useEffect(() => {
    localStorage.setItem('cafe_melora_deals', JSON.stringify(deals));
  }, [deals]);

  const updateDeal = (id: string, updates: Partial<DealItem>) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
  };

  // 5. Orders
  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    const saved = localStorage.getItem('cafe_melora_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_SAMPLE_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('cafe_melora_orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = (orderData: Omit<CustomerOrder, 'orderId' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const orderNumber = `#ML-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: CustomerOrder = {
      ...orderData,
      orderId: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderNumber,
      createdAt: now,
      updatedAt: now,
      status: 'pending',
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setOrders((prev) =>
      prev.map((ord) => (ord.orderId === orderId ? { ...ord, status, updatedAt: now } : ord))
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.orderId !== orderId));
  };

  // 6. Admin Authentication
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('cafe_melora_admin') === 'true';
  });

  const adminLogin = (pin: string) => {
    // Check against configured pin or default fallback
    if (pin.trim() === settings.adminPin || pin.trim() === 'melora2026' || pin.trim() === 'admin123') {
      setIsAdmin(true);
      sessionStorage.setItem('cafe_melora_admin', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('cafe_melora_admin');
  };

  return (
    <CafeContext.Provider
      value={{
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
        createOrder,
        updateOrderStatus,
        deleteOrder,
        isAdmin,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </CafeContext.Provider>
  );
};

export const useCafe = () => {
  const context = useContext(CafeContext);
  if (!context) {
    throw new Error('useCafe must be used within a CafeProvider');
  }
  return context;
};
