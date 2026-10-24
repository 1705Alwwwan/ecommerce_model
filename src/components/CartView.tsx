import React from 'react';
import { CartItem } from '../types/ecommerce';
import { formatIDR } from '../services/midtransService';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, CheckSquare, Square } from 'lucide-react';

interface CartViewProps {
  cartItems: CartItem[];
  onToggleSelect: (itemId: string) => void;
  onToggleSelectAll: () => void;
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cartItems,
  onToggleSelect,
  onToggleSelectAll,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout,
  onContinueShopping,
}) => {
  const allSelected = cartItems.length > 0 && cartItems.every((item) => item.isSelected);
  const selectedItems = cartItems.filter((item) => item.isSelected);

  const selectedSubtotal = selectedItems.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );

  const totalSelectedItemsCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center max-w-2xl mx-auto space-y-4 my-8">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Keranjang Belanja Anda Kosong</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Belum ada produk UMKM yang dimasukkan ke dalam keranjang. Yuk temukan kopi nusantara, kemeja batik tulis, atau kerajinan tangan lokal favoritmu!
        </p>
        <button
          onClick={onContinueShopping}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
        >
          <span>Mulai Belanja Produk UMKM</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Keranjang Belanja</h1>
          <p className="text-xs text-slate-500">
            Centang produk yang ingin Anda checkout sekarang seperti di Shopee.
          </p>
        </div>
        <button
          onClick={onContinueShopping}
          className="text-xs font-medium text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer self-start sm:self-auto"
        >
          ← Tambah Produk Lain
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cart Items Table / List (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Header Bar with Select All checkbox */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
            <button
              onClick={onToggleSelectAll}
              className="flex items-center gap-3 cursor-pointer hover:text-slate-900"
            >
              {allSelected ? (
                <CheckSquare className="w-5 h-5 text-emerald-600" />
              ) : (
                <Square className="w-5 h-5 text-slate-300" />
              )}
              <span>Pilih Semua ({cartItems.length} Produk)</span>
            </button>
            <span className="hidden sm:inline text-slate-400 font-normal">
              Harga Satuan & Subtotal
            </span>
          </div>

          {/* Items List */}
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {cartItems.map((item) => {
              const itemTotal = item.variant.price * item.quantity;
              const isMaxStock = item.quantity >= item.variant.stock;

              return (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                    item.isSelected ? 'bg-white' : 'bg-slate-50/50 opacity-80'
                  }`}
                >
                  {/* Left: Checkbox & Product Image + Info */}
                  <div className="flex items-start sm:items-center gap-3 flex-1">
                    <button
                      onClick={() => onToggleSelect(item.id)}
                      className="mt-1 sm:mt-0 cursor-pointer p-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                      aria-label="Pilih item untuk checkout"
                    >
                      {item.isSelected ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300" />
                      )}
                    </button>

                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="text-[11px] font-medium text-emerald-700">
                        {item.product.sellerName} ({item.product.sellerCity})
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <div className="text-xs text-slate-500">
                        Varian:{' '}
                        <span className="font-medium text-slate-700">{item.variant.name}</span>
                      </div>
                      <div className="text-xs font-mono font-bold text-emerald-700 sm:hidden">
                        {formatIDR(item.variant.price)}
                      </div>
                    </div>
                  </div>

                  {/* Right: Quantity Stepper, Subtotal, & Delete Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="hidden sm:block text-right">
                      <div className="text-xs font-mono text-slate-500">
                        {formatIDR(item.variant.price)}
                      </div>
                      <div className="text-sm font-bold font-mono text-emerald-800">
                        {formatIDR(itemTotal)}
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors text-xs font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-semibold font-mono tabular-nums text-slate-800 min-w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={isMaxStock}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors text-xs font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50 cursor-pointer"
                      title="Hapus dari keranjang"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Checkout Summary Box (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 space-y-4 sticky top-20 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Ringkasan Keranjang
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Total Barang Terpilih</span>
              <span className="font-semibold text-slate-900 font-mono tabular-nums">
                {totalSelectedItemsCount} barang
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal Produk</span>
              <span className="font-semibold text-slate-900 font-mono tabular-nums">
                {formatIDR(selectedSubtotal)}
              </span>
            </div>

            <div className="text-[11px] text-slate-400 pt-1">
              *Ongkos kirim dan diskon voucher akan dikalkulasi di langkah checkout berikutnya.
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-xs font-semibold text-slate-700">Subtotal Sementara</span>
              <span className="text-lg font-extrabold text-emerald-800 font-mono tabular-nums">
                {formatIDR(selectedSubtotal)}
              </span>
            </div>

            <button
              onClick={onProceedCheckout}
              disabled={selectedItems.length === 0}
              className="w-full py-3 px-4 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Lanjut ke Checkout ({selectedItems.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Checkout Aman Terverifikasi</span>
            </div>
            <p>
              Mendukung integrasi Midtrans Snap: QRIS instan, Virtual Account BCA, Mandiri, BRI, BNI, dan e-wallet GoPay/ShopeePay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
