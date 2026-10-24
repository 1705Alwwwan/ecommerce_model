import React, { useState } from 'react';
import { Product, ProductVariant, Order } from '../types/ecommerce';
import { formatIDR } from '../services/midtransService';
import {
  DollarSign,
  Package,
  AlertTriangle,
  TrendingUp,
  Plus,
  Edit2,
  Truck,
  CheckCircle2,
  X,
  Search
} from 'lucide-react';

interface SellerAdminPanelProps {
  products: Product[];
  orders: Order[];
  onUpdateStock: (productId: string, variantId: string, newStock: number) => void;
  onShipOrder: (orderId: string, trackingNumber: string) => void;
  onCompleteOrder: (orderId: string) => void;
  onAddNewProduct: (newProd: Product) => void;
}

export const SellerAdminPanel: React.FC<SellerAdminPanelProps> = ({
  products,
  orders,
  onUpdateStock,
  onShipOrder,
  onCompleteOrder,
  onAddNewProduct,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');
  const [orderFilter, setOrderFilter] = useState<string>('PAID_PACKING');
  
  // Tracking number input modal state
  const [shippingModalOrder, setShippingModalOrder] = useState<Order | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');

  // Add Product modal state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<Product['category']>('Kopi & Minuman');
  const [newProductPrice, setNewProductPrice] = useState(75000);
  const [newProductStock, setNewProductStock] = useState(25);
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductVariantName, setNewProductVariantName] = useState('Standard 250g');

  // Metrics calculations
  const totalOmset = orders
    .filter((o) => o.status === 'PAID_PACKING' || o.status === 'SHIPPED' || o.status === 'COMPLETED')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const needShippingCount = orders.filter((o) => o.status === 'PAID_PACKING').length;
  const inDeliveryCount = orders.filter((o) => o.status === 'SHIPPED').length;

  const lowStockVariants = products.flatMap((p) =>
    p.variants
      .filter((v) => v.stock <= 5)
      .map((v) => ({ product: p, variant: v }))
  );

  const handleOpenShipModal = (order: Order) => {
    setShippingModalOrder(order);
    const prefix = order.shippingCourier.code.includes('jne')
      ? 'JNE'
      : order.shippingCourier.code.includes('sicepat')
      ? '004'
      : 'JP';
    setTrackingNumberInput(`${prefix}${Math.floor(1000000000 + Math.random() * 9000000000)}`);
  };

  const handleConfirmShipping = () => {
    if (!shippingModalOrder || !trackingNumberInput.trim()) return;
    onShipOrder(shippingModalOrder.id, trackingNumberInput.trim());
    setShippingModalOrder(null);
    setTrackingNumberInput('');
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const prodId = `prod-${Date.now()}`;
    const variantId = `var-${Date.now()}`;

    const newProduct: Product = {
      id: prodId,
      sellerId: 'seller-umkm-main',
      sellerName: 'Kolektif UMKM Berdikari',
      sellerCity: 'Bandung',
      name: newProductName,
      slug: newProductName.toLowerCase().replace(/\s+/g, '-'),
      description: newProductDesc || 'Produk lokal berkualitas tinggi dibuat oleh pengrajin UMKM binaan nusantara.',
      category: newProductCategory,
      basePrice: Number(newProductPrice),
      isPublished: true,
      images: [
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'
      ],
      rating: 5.0,
      reviewCount: 0,
      soldCount: 0,
      badges: ['Produk UMKM Baru', '100% Asli'],
      variants: [
        {
          id: variantId,
          productId: prodId,
          name: newProductVariantName,
          sku: `SKU-${Date.now().toString().slice(-6)}`,
          price: Number(newProductPrice),
          stock: Number(newProductStock),
          weightGram: 300,
          attributes: {}
        }
      ],
      reviews: []
    };

    onAddNewProduct(newProduct);
    setIsAddProductOpen(false);
    setNewProductName('');
    setNewProductDesc('');
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'ALL') return true;
    return o.status === orderFilter;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Panel Pengelolaan UMKM (Seller Center)
            </h1>
            <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
              Verified Merchant
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Kelola inventaris stok, proses pengiriman paket, dan pantau status transaksi Midtrans pelanggan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk Baru</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Omset Lunas</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-800 tabular-nums">
            {formatIDR(totalOmset)}
          </div>
          <div className="text-[11px] text-slate-400">Pembayaran terverifikasi</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Perlu Dikirim</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold font-mono text-blue-700 tabular-nums">
            {needShippingCount} Pesanan
          </div>
          <div className="text-[11px] text-slate-400">Sudah bayar, siap dipacking</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Sedang Dikirim</span>
            <Truck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-bold font-mono text-purple-700 tabular-nums">
            {inDeliveryCount} Pesanan
          </div>
          <div className="text-[11px] text-slate-400">Resi kurir sudah aktif</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Stok Kritis (≤ 5)</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-bold font-mono text-rose-700 tabular-nums">
            {lowStockVariants.length} Varian
          </div>
          <div className="text-[11px] text-slate-400">Perlu re-stock segera</div>
        </div>
      </div>

      {/* Main Tabs (Orders vs Inventory) */}
      <div className="flex border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2.5 px-4 border-b-2 cursor-pointer transition-colors flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Manajemen Pesanan Masuk ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-2.5 px-4 border-b-2 cursor-pointer transition-colors flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Inventaris & Stok Produk ({products.length})</span>
        </button>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Subfilter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {[
              { label: 'Semua Status', value: 'ALL' },
              { label: 'Perlu Dikirim (Siap Resi)', value: 'PAID_PACKING' },
              { label: 'Sedang Dikirim', value: 'SHIPPED' },
              { label: 'Menunggu Bayar', value: 'PENDING_PAYMENT' },
              { label: 'Selesai', value: 'COMPLETED' },
              { label: 'Expired / Batal', value: 'EXPIRED' }
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setOrderFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  orderFilter === f.value
                    ? 'bg-emerald-700 text-white font-semibold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
              Tidak ada pesanan pada filter ini.
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
              {filteredOrders.map((order) => {
                const canShip = order.status === 'PAID_PACKING';
                const canComplete = order.status === 'SHIPPED';

                return (
                  <div key={order.id} className="p-4 sm:p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs sm:text-sm text-slate-900">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500">{order.createdAt}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-800 tabular-nums">
                          {formatIDR(order.totalAmount)}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1.5 border border-slate-100">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-slate-700">
                          <span>
                            {it.quantity}x {it.productName} ({it.variantName})
                          </span>
                          <span className="font-mono text-slate-900 font-medium">
                            {formatIDR(it.subtotal)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Shipping & Recipient details */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
                      <div>
                        Penerima: <span className="font-semibold text-slate-800">{order.shippingAddress.recipientName}</span> ({order.shippingAddress.phone}) · {order.shippingAddress.city}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-medium">
                          Kurir: {order.shippingCourier.name}
                        </span>
                        {order.trackingNumber && (
                          <span className="font-mono font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            Resi: {order.trackingNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Seller Actions */}
                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                      {canShip && (
                        <button
                          onClick={() => handleOpenShipModal(order)}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Input Nomor Resi & Kirim</span>
                        </button>
                      )}

                      {canComplete && (
                        <button
                          onClick={() => onCompleteOrder(order.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Tandai Selesai Diterima</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INVENTORY & STOCK */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Daftar Inventaris Varian Produk
              </span>
              <span className="text-xs text-slate-500">
                Stok otomatis berkurang saat order dibuat & otomatis kembali jika expired/batal.
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {products.map((prod) => (
                <div key={prod.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-emerald-700 uppercase">
                        {prod.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{prod.name}</h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700">
                      Mulai {formatIDR(prod.basePrice)}
                    </span>
                  </div>

                  {/* Variants list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {prod.variants.map((v) => {
                      const isLow = v.stock <= 5;
                      return (
                        <div
                          key={v.id}
                          className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex flex-col justify-between space-y-2"
                        >
                          <div>
                            <span className="font-semibold text-slate-800 block">{v.name}</span>
                            <span className="text-[11px] text-slate-400 font-mono">SKU: {v.sku}</span>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-200/80">
                            <span className="font-mono font-bold text-emerald-800">
                              {formatIDR(v.price)}
                            </span>

                            <div className="flex items-center gap-1.5">
                              <span
                                className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                                  isLow ? 'bg-rose-100 text-rose-700' : 'bg-white text-slate-700 border'
                                }`}
                              >
                                Stok: {v.stock}
                              </span>

                              {/* Quick stock stepper */}
                              <button
                                onClick={() => onUpdateStock(prod.id, v.id, Math.max(0, v.stock - 1))}
                                className="w-5 h-5 bg-white border border-slate-300 rounded flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                              >
                                -
                              </button>
                              <button
                                onClick={() => onUpdateStock(prod.id, v.id, v.stock + 5)}
                                className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-300 rounded text-[10px] font-bold text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                                title="Tambah 5 stok"
                              >
                                +5
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: INPUT RESI PENGIRIMAN */}
      {shippingModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Input Nomor Resi Pengiriman</h3>
              </div>
              <button
                onClick={() => setShippingModalOrder(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Paket untuk pesanan <span className="font-mono font-bold text-slate-800">{shippingModalOrder.orderNumber}</span> akan dikirim menggunakan:
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-semibold text-slate-800">
                {shippingModalOrder.shippingCourier.name} ({shippingModalOrder.shippingCourier.service})
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Nomor Resi / AWB Ekspedisi:
                </label>
                <input
                  type="text"
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShippingModalOrder(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmShipping}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Konfirmasi Kirim Paket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD PRODUCT */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Tambah Produk UMKM Baru</h3>
              </div>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kopi Robusta Temanggung Fine Robusta"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Kategori</label>
                  <select
                    value={newProductCategory}
                    onChange={(e: any) => setNewProductCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Kopi & Minuman">Kopi & Minuman</option>
                    <option value="Batik & Tenun">Batik & Tenun</option>
                    <option value="Kerajinan Kulit">Kerajinan Kulit</option>
                    <option value="Kuliner & Sambal">Kuliner & Sambal</option>
                    <option value="Herbal & Perawatan">Herbal & Perawatan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nama Varian Awal</label>
                  <input
                    type="text"
                    value={newProductVariantName}
                    onChange={(e) => setNewProductVariantName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Harga (IDR)</label>
                  <input
                    type="number"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Stok Awal</label>
                  <input
                    type="number"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Deskripsi & Cerita Produk</label>
                <textarea
                  rows={2}
                  placeholder="Ceritakan keunikan produk buatan tangan lokal ini..."
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Simpan Produk ke Toko
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
