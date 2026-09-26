import { MenuItem, DealItem } from '../data/menuData';

export interface CafeSettings {
  name: string;
  websiteUrl: string;
  tagline: string;
  phone: string;
  whatsappPhone: string;
  email: string;
  address: string;
  landmark: string;
  weekdayHours: string;
  weekendHours: string;
  wifiSsid: string;
  wifiPass: string;
  promoCode: string;
  discountPercent: number;
  studentPromoCode?: string;
  studentDiscountPercent?: number;
  adminPin: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type PaymentMethod = 'counter' | 'cod' | 'bank_transfer';

export interface CustomerOrder {
  orderId: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  mode: 'dine_in' | 'takeaway' | 'delivery';
  tableNumber?: string;
  customerName: string;
  phone: string;
  email?: string;
  deliveryAddress?: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid';
  items: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    customizationSummary?: string;
    toppings?: string[];
    sweetness?: string;
    ice?: string;
    dealSummary?: string;
  }[];
  subtotal: number;
  discount: number;
  total: number;
}
