export type ProductVariant = {
  id: string;
  productId: string;
  name: string; // e.g. "Hitam - Ukuran L", "Biji Utuh 250g"
  sku: string;
  price: number;
  stock: number;
  weightGram: number;
  attributes: {
    color?: string;
    size?: string;
    grindSize?: string;
    packaging?: string;
  };
};

export type Product = {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerCity: string;
  name: string;
  slug: string;
  description: string;
  category: 'Kopi & Minuman' | 'Batik & Tenun' | 'Kerajinan Kulit' | 'Kuliner & Sambal' | 'Herbal & Perawatan';
  basePrice: number;
  isPublished: boolean;
  images: string[];
  rating: number;
  reviewCount: number;
  soldCount: number;
  variants: ProductVariant[];
  badges: string[];
  reviews: {
    id: string;
    userName: string;
    userCity: string;
    rating: number;
    date: string;
    variantName: string;
    comment: string;
  }[];
};

export type CartItem = {
  id: string;
  productId: string;
  variantId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  isSelected: boolean;
};

export type ShippingCourier = {
  code: string;
  name: string;
  service: string;
  etd: string; // e.g. "1-2 Hari"
  cost: number;
};

export type ShippingAddress = {
  recipientName: string;
  phone: string;
  addressLine: string;
  city: string;
  province: string;
  postalCode: string;
};

export type Voucher = {
  code: string;
  title: string;
  discountType: 'FIXED' | 'PERCENTAGE';
  discountValue: number; // e.g. 25000 or 15 (percent)
  minOrder: number;
  maxDiscount?: number;
  description: string;
};

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID_PACKING'
  | 'SHIPPED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED';

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export type PaymentTransaction = {
  id: string;
  orderId: string;
  snapToken: string;
  paymentType: 'qris' | 'bank_transfer' | 'gopay' | 'shopeepay' | 'cstore';
  transactionStatus: 'pending' | 'settlement' | 'expire' | 'cancel' | 'deny';
  grossAmount: number;
  vaNumber?: string;
  bank?: string;
  billKey?: string;
  billerCode?: string;
  qrCodeUrl?: string;
  signatureKey: string;
  settlementTime?: string;
  createdAt: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  serviceFee: number;
  totalAmount: number;
  voucherCode?: string;
  shippingAddress: ShippingAddress;
  shippingCourier: ShippingCourier;
  trackingNumber?: string;
  notes?: string;
  items: OrderItem[];
  payment?: PaymentTransaction;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
};

export type MidtransWebhookPayload = {
  order_id: string;
  transaction_id: string;
  transaction_status: 'capture' | 'settlement' | 'pending' | 'deny' | 'cancel' | 'expire' | 'refund';
  status_code: string;
  gross_amount: string;
  payment_type: string;
  signature_key: string;
  fraud_status?: string;
  transaction_time: string;
  settlement_time?: string;
  bank?: string;
  va_numbers?: Array<{
    bank: string;
    va_number: string;
  }>;
};
