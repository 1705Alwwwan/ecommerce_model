/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Product,
  ProductVariant,
  CartItem,
  Order,
  PaymentTransaction,
  OrderItem,
  ShippingAddress,
  ShippingCourier,
  MidtransWebhookPayload,
} from './types/ecommerce';
import { INITIAL_PRODUCTS } from './data/mockProducts';
import { generateSnapToken } from './services/midtransService';

import { Header } from './components/Header';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartView } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';
import { MidtransSnapModal } from './components/MidtransSnapModal';
import { OrdersView } from './components/OrdersView';
import { SellerAdminPanel } from './components/SellerAdminPanel';
import { WebhookInspectorModal } from './components/WebhookInspectorModal';
import { ArchitectureDocsView } from './components/ArchitectureDocsView';

export default function App() {
  // Products state (supports updates & stock decrement/restore)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      productId: INITIAL_PRODUCTS[0].id,
      variantId: INITIAL_PRODUCTS[0].variants[0].id,
      product: INITIAL_PRODUCTS[0],
      variant: INITIAL_PRODUCTS[0].variants[0],
      quantity: 1,
      isSelected: true,
    },
    {
      id: 'cart-init-2',
      productId: INITIAL_PRODUCTS[3].id,
      variantId: INITIAL_PRODUCTS[3].variants[0].id,
      product: INITIAL_PRODUCTS[3],
      variant: INITIAL_PRODUCTS[3].variants[0],
      quantity: 2,
      isSelected: true,
    },
  ]);

  // Initial Seed Orders
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-initial-1',
      orderNumber: 'ORD-20261024-8921',
      userId: 'user-farhan',
      status: 'PAID_PACKING',
      subtotal: 385000,
      shippingFee: 12000,
      discountAmount: 25000,
      serviceFee: 1000,
      totalAmount: 373000,
      voucherCode: 'DISKONUMKM',
      shippingAddress: {
        recipientName: 'Farhan Alwan',
        phone: '081298765432',
        addressLine: 'Jl. Merdeka No. 45, Kebayoran Baru',
        city: 'Jakarta Selatan, DKI Jakarta',
        province: 'DKI Jakarta',
        postalCode: '12150',
      },
      shippingCourier: {
        code: 'jne_reg',
        name: 'JNE',
        service: 'REG (Reguler Service)',
        etd: '1-2 Hari',
        cost: 12000,
      },
      items: [
        {
          id: 'item-init-1',
          orderId: 'ord-initial-1',
          productId: INITIAL_PRODUCTS[1].id,
          variantId: INITIAL_PRODUCTS[1].variants[0].id,
          productName: INITIAL_PRODUCTS[1].name,
          variantName: INITIAL_PRODUCTS[1].variants[0].name,
          price: 385000,
          quantity: 1,
          subtotal: 385000,
        },
      ],
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      createdAt: '24 Okt 2026, 09:15 WIB',
      updatedAt: '24 Okt 2026, 09:18 WIB',
    },
    {
      id: 'ord-initial-2',
      orderNumber: 'ORD-20261023-4102',
      userId: 'user-farhan',
      status: 'COMPLETED',
      subtotal: 195000,
      shippingFee: 11000,
      discountAmount: 0,
      serviceFee: 1000,
      totalAmount: 207000,
      shippingAddress: {
        recipientName: 'Farhan Alwan',
        phone: '081298765432',
        addressLine: 'Jl. Merdeka No. 45, Kebayoran Baru',
        city: 'Jakarta Selatan, DKI Jakarta',
        province: 'DKI Jakarta',
        postalCode: '12150',
      },
      shippingCourier: {
        code: 'sicepat_reg',
        name: 'SiCepat Ekspres',
        service: 'REG',
        etd: '1-2 Hari',
        cost: 11000,
      },
      trackingNumber: '004192849182',
      items: [
        {
          id: 'item-init-2',
          orderId: 'ord-initial-2',
          productId: INITIAL_PRODUCTS[2].id,
          variantId: INITIAL_PRODUCTS[2].variants[0].id,
          productName: INITIAL_PRODUCTS[2].name,
          variantName: INITIAL_PRODUCTS[2].variants[0].name,
          price: 195000,
          quantity: 1,
          subtotal: 195000,
        },
      ],
      expiresAt: new Date(Date.now() - 86400000).toISOString(),
      createdAt: '23 Okt 2026, 14:20 WIB',
      updatedAt: '23 Okt 2026, 16:40 WIB',
    },
  ]);

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<
    'catalog' | 'cart' | 'checkout' | 'orders' | 'seller' | 'architecture'
  >('catalog');

  // Checkout Session Items (populated from either Cart or Instant "Beli Sekarang")
  const [checkoutSessionItems, setCheckoutSessionItems] = useState<
    Array<{
      productId: string;
      variantId: string;
      productName: string;
      variantName: string;
      price: number;
      quantity: number;
      weightGram: number;
      image: string;
      sellerCity: string;
      fromCartItemIds?: string[];
    }>
  >([]);

  // Selected product for detail modal
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  // Active Midtrans Snap payment modal
  const [snapModalData, setSnapModalData] = useState<{
    order: Order;
    payment: PaymentTransaction;
  } | null>(null);

  // Midtrans Webhook Inspector Modal
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);

  // Notification Banner
  const [appNotification, setAppNotification] = useState<{
    message: string;
    type: 'success' | 'info' | 'warning';
  } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setAppNotification({ message, type });
    setTimeout(() => setAppNotification(null), 4500);
  };

  // -------------------------------------------------------------
  // CART ACTIONS
  // -------------------------------------------------------------
  const handleAddToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.variantId === variant.id);
      if (existing) {
        return prev.map((item) =>
          item.variantId === variant.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, variant.stock) }
            : item
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          productId: product.id,
          variantId: variant.id,
          product,
          variant,
          quantity,
          isSelected: true,
        },
      ];
    });
    showNotification(`Berhasil menambahkan ${quantity}x ${product.name} ke keranjang!`, 'success');
  };

  const handleToggleSelectCart = (itemId: string) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, isSelected: !item.isSelected } : item))
    );
  };

  const handleToggleSelectAllCart = () => {
    const allSelected = cartItems.every((item) => item.isSelected);
    setCartItems((prev) => prev.map((item) => ({ ...item, isSelected: !allSelected })));
  };

  const handleUpdateCartQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    showNotification('Produk dihapus dari keranjang belanja.', 'info');
  };

  // -------------------------------------------------------------
  // CHECKOUT FLOWS: "BELI SEKARANG" (SHOPEE STYLE) & CART CHECKOUT
  // -------------------------------------------------------------
  const handleBuyNowInstant = (product: Product, variant: ProductVariant, quantity: number) => {
    // Instant direct checkout: isolates this single item without affecting the general cart!
    setCheckoutSessionItems([
      {
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        variantName: variant.name,
        price: variant.price,
        quantity,
        weightGram: variant.weightGram || 250,
        image: product.images[0],
        sellerCity: product.sellerCity,
      },
    ]);
    setModalProduct(null);
    setCurrentTab('checkout');
    showNotification(
      'Membuka alur checkout instan "Beli Sekarang". Pilih alamat & kurir pengiriman.',
      'info'
    );
  };

  const handleProceedCartCheckout = () => {
    const selected = cartItems.filter((it) => it.isSelected);
    if (selected.length === 0) return;

    setCheckoutSessionItems(
      selected.map((it) => ({
        productId: it.productId,
        variantId: it.variantId,
        productName: it.product.name,
        variantName: it.variant.name,
        price: it.variant.price,
        quantity: it.quantity,
        weightGram: it.variant.weightGram || 250,
        image: it.product.images[0],
        sellerCity: it.product.sellerCity,
        fromCartItemIds: [it.id],
      }))
    );
    setCurrentTab('checkout');
  };

  // -------------------------------------------------------------
  // ATOMIC ORDER CREATION & MIDTRANS SNAP TOKEN REQUEST
  // -------------------------------------------------------------
  const handleInitiatePayment = (orderData: {
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    shippingCourier: ShippingCourier;
    subtotal: number;
    shippingFee: number;
    discountAmount: number;
    serviceFee: number;
    totalAmount: number;
    voucherCode?: string;
  }) => {
    const orderId = `ord-${Date.now()}`;
    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    // 1. ATOMIC STOCK DECREMENT: Check and decrement stock immediately
    let stockError = false;
    setProducts((prevProducts) =>
      prevProducts.map((prod) => {
        const hasVariant = prod.variants.some((v) =>
          orderData.items.some((it) => it.variantId === v.id)
        );
        if (!hasVariant) return prod;

        return {
          ...prod,
          soldCount: prod.soldCount + orderData.items.filter((it) => it.productId === prod.id).length,
          variants: prod.variants.map((v) => {
            const matchedItem = orderData.items.find((it) => it.variantId === v.id);
            if (matchedItem) {
              if (v.stock < matchedItem.quantity) {
                stockError = true;
              }
              return {
                ...v,
                stock: Math.max(0, v.stock - matchedItem.quantity),
              };
            }
            return v;
          }),
        };
      })
    );

    if (stockError) {
      showNotification('Maaf, stok varian tidak mencukupi untuk pesanan ini.', 'warning');
      return;
    }

    // 2. Generate Midtrans Snap Token
    const snapResult = generateSnapToken(orderId, orderData.totalAmount);

    const paymentTrx: PaymentTransaction = {
      id: `trx-${Date.now()}`,
      orderId,
      snapToken: snapResult.token,
      paymentType: 'qris',
      transactionStatus: 'pending',
      grossAmount: orderData.totalAmount,
      vaNumber: snapResult.vaNumbers.bca,
      bank: 'bca',
      billKey: snapResult.vaNumbers.mandiri.billKey,
      billerCode: snapResult.vaNumbers.mandiri.billerCode,
      signatureKey: `mock-sig-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      userId: 'user-farhan',
      status: 'PENDING_PAYMENT',
      subtotal: orderData.subtotal,
      shippingFee: orderData.shippingFee,
      discountAmount: orderData.discountAmount,
      serviceFee: orderData.serviceFee,
      totalAmount: orderData.totalAmount,
      voucherCode: orderData.voucherCode,
      shippingAddress: orderData.shippingAddress,
      shippingCourier: orderData.shippingCourier,
      items: orderData.items.map((it) => ({ ...it, orderId })),
      payment: paymentTrx,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 mins expiry
      createdAt: 'Baru saja',
      updatedAt: 'Baru saja',
    };

    // 3. Save order to state
    setOrders((prev) => [newOrder, ...prev]);

    // 4. Remove checked items from cart if checkout came from cart
    const purchasedVariantIds = new Set(orderData.items.map((it) => it.variantId));
    setCartItems((prev) => prev.filter((item) => !purchasedVariantIds.has(item.variantId)));

    // 5. Open Midtrans Snap pop-up
    setSnapModalData({ order: newOrder, payment: paymentTrx });
    showNotification('Pesanan berhasil dibuat! Pop-up Midtrans Snap dibuka.', 'success');
  };

  // -------------------------------------------------------------
  // MIDTRANS SIMULATION HANDLERS (SETTLEMENT, EXPIRE, CANCEL)
  // -------------------------------------------------------------
  const handleSimulateSettlement = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'PAID_PACKING',
              updatedAt: 'Pembayaran Lunas via Midtrans',
              payment: o.payment ? { ...o.payment, transactionStatus: 'settlement' } : undefined,
            }
          : o
      )
    );
    setSnapModalData(null);
    setCurrentTab('orders');
    showNotification(
      'Pembayaran LUNAS (Settlement)! Pesanan masuk ke status "Perlu Dikirim" bagi UMKM.',
      'success'
    );
  };

  const handleSimulateExpire = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    // ATOMIC STOCK RESTORE: When order expires, automatically replenish stock!
    setProducts((prevProducts) =>
      prevProducts.map((prod) => ({
        ...prod,
        variants: prod.variants.map((v) => {
          const itemToRestore = targetOrder.items.find((it) => it.variantId === v.id);
          if (itemToRestore) {
            return {
              ...v,
              stock: v.stock + itemToRestore.quantity,
            };
          }
          return v;
        }),
      }))
    );

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'EXPIRED',
              updatedAt: 'Expired - Stok dikembalikan otomatis',
              payment: o.payment ? { ...o.payment, transactionStatus: 'expire' } : undefined,
            }
          : o
      )
    );
    setSnapModalData(null);
    showNotification(
      'Pembayaran KADALUARSA (Expired). Kuota stok produk otomatis dikembalikan ke inventaris toko!',
      'warning'
    );
  };

  const handleSimulateCancel = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    // ATOMIC STOCK RESTORE
    setProducts((prevProducts) =>
      prevProducts.map((prod) => ({
        ...prod,
        variants: prod.variants.map((v) => {
          const itemToRestore = targetOrder.items.find((it) => it.variantId === v.id);
          if (itemToRestore) {
            return {
              ...v,
              stock: v.stock + itemToRestore.quantity,
            };
          }
          return v;
        }),
      }))
    );

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'CANCELLED',
              updatedAt: 'Dibatalkan',
              payment: o.payment ? { ...o.payment, transactionStatus: 'cancel' } : undefined,
            }
          : o
      )
    );
    setSnapModalData(null);
    showNotification('Pesanan dibatalkan. Kuota stok telah dipulihkan.', 'info');
  };

  // -------------------------------------------------------------
  // WEBHOOK PROCESSOR (IDEMPOTENT & SIGNATURE-VERIFIED)
  // -------------------------------------------------------------
  const handleProcessWebhook = (payload: MidtransWebhookPayload) => {
    const targetOrder = orders.find((o) => o.id === payload.order_id);
    if (!targetOrder) return;

    if (payload.transaction_status === 'settlement' || payload.transaction_status === 'capture') {
      handleSimulateSettlement(payload.order_id);
    } else if (payload.transaction_status === 'expire') {
      handleSimulateExpire(payload.order_id);
    } else if (payload.transaction_status === 'cancel') {
      handleSimulateCancel(payload.order_id);
    }
  };

  // -------------------------------------------------------------
  // SELLER ADMIN ACTIONS
  // -------------------------------------------------------------
  const handleUpdateStock = (productId: string, variantId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              variants: p.variants.map((v) => (v.id === variantId ? { ...v, stock: newStock } : v)),
            }
          : p
      )
    );
    showNotification('Stok produk berhasil diperbarui!', 'success');
  };

  const handleShipOrder = (orderId: string, trackingNumber: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'SHIPPED',
              trackingNumber,
              updatedAt: 'Sedang Dikirim',
            }
          : o
      )
    );
    showNotification(
      `Nomor resi ${trackingNumber} berhasil disimpan. Status berubah menjadi "Sedang Dikirim"!`,
      'success'
    );
  };

  const handleCompleteOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'COMPLETED',
              updatedAt: 'Pesanan Selesai',
            }
          : o
      )
    );
    showNotification('Pesanan ditandai selesai. Terima kasih!', 'success');
  };

  const handleAddNewProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    showNotification(`Produk "${newProd.name}" berhasil ditambahkan ke katalog UMKM!`, 'success');
  };

  // Re-open snap modal for pending orders
  const handleReopenSnapPayment = (order: Order) => {
    if (!order.payment) return;
    setSnapModalData({ order, payment: order.payment });
  };

  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING_PAYMENT').length;
  const cartTotalItems = cartItems.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Header
        currentTab={currentTab === 'checkout' ? 'cart' : currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        cartCount={cartTotalItems}
        pendingOrdersCount={pendingOrdersCount}
        onOpenWebhookModal={() => setIsWebhookModalOpen(true)}
      />

      {/* Global Notification Toast */}
      {appNotification && (
        <div className="sticky top-16 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
          <div
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-xs ${
              appNotification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : appNotification.type === 'warning'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-blue-50 text-blue-800 border-blue-200'
            }`}
          >
            <span>{appNotification.message}</span>
            <button
              onClick={() => setAppNotification(null)}
              className="ml-3 text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'catalog' && (
          <ProductCatalog
            products={products}
            onSelectProduct={(p) => setModalProduct(p)}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNowInstant}
          />
        )}

        {currentTab === 'cart' && (
          <CartView
            cartItems={cartItems}
            onToggleSelect={handleToggleSelectCart}
            onToggleSelectAll={handleToggleSelectAllCart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onProceedCheckout={handleProceedCartCheckout}
            onContinueShopping={() => setCurrentTab('catalog')}
          />
        )}

        {currentTab === 'checkout' && (
          <CheckoutView
            checkoutItems={checkoutSessionItems}
            onInitiatePayment={handleInitiatePayment}
            onBack={() => setCurrentTab(checkoutSessionItems[0]?.fromCartItemIds ? 'cart' : 'catalog')}
          />
        )}

        {currentTab === 'orders' && (
          <OrdersView
            orders={orders}
            onOpenPaymentModal={handleReopenSnapPayment}
            onExploreProducts={() => setCurrentTab('catalog')}
          />
        )}

        {currentTab === 'seller' && (
          <SellerAdminPanel
            products={products}
            orders={orders}
            onUpdateStock={handleUpdateStock}
            onShipOrder={handleShipOrder}
            onCompleteOrder={handleCompleteOrder}
            onAddNewProduct={handleAddNewProduct}
          />
        )}

        {currentTab === 'architecture' && <ArchitectureDocsView />}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={modalProduct}
        onClose={() => setModalProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNowInstant}
      />

      {/* Midtrans Snap Modal */}
      {snapModalData && (
        <MidtransSnapModal
          order={snapModalData.order}
          payment={snapModalData.payment}
          onClose={() => setSnapModalData(null)}
          onSimulateSettlement={handleSimulateSettlement}
          onSimulateExpire={handleSimulateExpire}
          onSimulateCancel={handleSimulateCancel}
        />
      )}

      {/* Webhook Inspector Modal */}
      <WebhookInspectorModal
        orders={orders}
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
        onProcessWebhook={handleProcessWebhook}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="font-bold text-slate-800">
              NusantaraMart UMKM — E-Commerce & Checkout Instan
            </div>
            <p>
              Arsitektur e-commerce terintegrasi Midtrans Snap (QRIS, VA, E-Wallet) dengan kalkulasi ongkir real-time dan manajemen inventaris stok atomik.
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-medium shrink-0">
            <button
              onClick={() => setCurrentTab('architecture')}
              className="hover:text-emerald-700 cursor-pointer transition-colors"
            >
              Lihat Prisma Schema
            </button>
            <span>·</span>
            <button
              onClick={() => setIsWebhookModalOpen(true)}
              className="hover:text-emerald-700 cursor-pointer transition-colors"
            >
              Midtrans Sandbox
            </button>
            <span>·</span>
            <button
              onClick={() => setCurrentTab('seller')}
              className="hover:text-emerald-700 cursor-pointer transition-colors"
            >
              Seller Center
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
