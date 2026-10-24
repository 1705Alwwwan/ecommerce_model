import React, { useState } from 'react';
import { Product, ProductVariant } from '../types/ecommerce';
import { formatIDR } from '../services/midtransService';
import {
  X,
  Star,
  MapPin,
  ShieldCheck,
  Truck,
  ShoppingCart,
  Zap,
  Check,
  AlertCircle
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onBuyNow: (product: Product, variant: ProductVariant, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    if (quantity > variant.stock) {
      setQuantity(Math.max(1, variant.stock));
    }
  };

  const handleIncrement = () => {
    if (quantity < selectedVariant.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (selectedVariant.stock <= 0) return;
    onAddToCart(product, selectedVariant, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleBuyNow = () => {
    if (selectedVariant.stock <= 0) return;
    onBuyNow(product, selectedVariant, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{product.category}</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">{product.sellerName}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Tutup Detail"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Gallery Column (5 Cols) */}
            <div className="md:col-span-5 space-y-3">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust markers */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Jaminan 100% Produk Asli Buatan UMKM Lokal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kirim dari {product.sellerCity} ke Seluruh Indonesia</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dukungan logistik SiCepat, JNE, J&T, & GoSend</span>
                </div>
              </div>
            </div>

            {/* Purchase & Variant Column (7 Cols) */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {product.name}
                </h2>

                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 font-bold text-slate-800 font-mono tabular-nums">
                      {product.rating}
                    </span>
                  </div>
                  <span>·</span>
                  <span>{product.reviewCount} Ulasan Pembeli</span>
                  <span>·</span>
                  <span className="font-mono tabular-nums">{product.soldCount} Terjual</span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-emerald-800 font-medium block">Harga Varian Terpilih</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-mono tabular-nums">
                    {formatIDR(selectedVariant.price)}
                  </span>
                </div>
                <span className="text-xs font-mono bg-white px-2.5 py-1 rounded border border-emerald-200 text-emerald-700">
                  SKU: {selectedVariant.sku}
                </span>
              </div>

              {/* Variant Picker */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Pilih Varian:</span>
                  <span className="text-slate-500 font-medium">
                    {selectedVariant.weightGram} gram / item
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant.id === v.id;
                    const isOutOfStock = v.stock === 0;

                    return (
                      <button
                        key={v.id}
                        onClick={() => handleVariantChange(v)}
                        disabled={isOutOfStock}
                        className={`p-3 rounded-lg text-left text-xs border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                            : isOutOfStock
                            ? 'border-slate-200 bg-slate-100/70 text-slate-400 opacity-60 cursor-not-allowed'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="font-semibold text-slate-900 mb-1 pr-4">{v.name}</div>
                        <div className="flex items-center justify-between font-mono">
                          <span className="font-bold text-emerald-700">{formatIDR(v.price)}</span>
                          <span
                            className={`text-[11px] ${
                              v.stock <= 5 ? 'text-rose-600 font-bold' : 'text-slate-500'
                            }`}
                          >
                            Stok: {v.stock}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper & Stock status */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-800 block">Kuantitas:</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-semibold font-mono tabular-nums text-slate-800 min-w-10 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= selectedVariant.stock}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer text-sm font-bold"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-xs text-slate-500">
                    Tersedia{' '}
                    <span className="font-semibold font-mono text-slate-800">
                      {selectedVariant.stock}
                    </span>{' '}
                    buah
                    {selectedVariant.stock <= 5 && (
                      <span className="ml-2 text-rose-600 font-semibold inline-flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Stok menipis!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons (Shopee Style) */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={selectedVariant.stock <= 0}
                    className="py-3 px-4 text-xs sm:text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{addedSuccess ? 'Ditambahkan! ✓' : 'Tambah ke Keranjang'}</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={selectedVariant.stock <= 0}
                    className="py-3 px-4 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>Beli Sekarang</span>
                  </button>
                </div>
                <p className="text-[11px] text-center text-slate-400">
                  Klik "Beli Sekarang" untuk langsung menuju ringkasan ongkir dan checkout Midtrans tanpa mengubah keranjang belanja.
                </p>
              </div>

              {/* Description */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Deskripsi Produk
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Reviews Preview */}
              {product.reviews.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Ulasan Pembeli Terverifikasi
                    </h4>
                    <span className="text-xs text-emerald-700 font-medium">Lihat Semua</span>
                  </div>

                  <div className="space-y-2">
                    {product.reviews.map((rev) => (
                      <div key={rev.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800">{rev.userName} ({rev.userCity})</span>
                          <span className="text-[11px] text-slate-400">{rev.date}</span>
                        </div>
                        <div className="flex items-center text-amber-500 gap-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                          <span className="text-[11px] text-slate-400 ml-1.5">Varian: {rev.variantName}</span>
                        </div>
                        <p className="text-slate-600 italic">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
