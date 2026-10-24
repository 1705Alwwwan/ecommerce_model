import React, { useState, useMemo } from 'react';
import { Product, ProductVariant } from '../types/ecommerce';
import { formatIDR } from '../services/midtransService';
import { Search, Star, ShoppingCart, Zap, Filter, MapPin, CheckCircle2 } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onBuyNow: (product: Product, variant: ProductVariant, quantity: number) => void;
}

const CATEGORIES = [
  'Semua Kategori',
  'Kopi & Minuman',
  'Batik & Tenun',
  'Kerajinan Kulit',
  'Kuliner & Sambal',
  'Herbal & Perawatan',
];

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price_low' | 'price_high' | 'rating'>('popular');
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'Semua Kategori' || p.category === selectedCategory;
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sellerCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = p.basePrice <= maxPrice;
        return matchesCategory && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.soldCount - a.soldCount;
        if (sortBy === 'price_low') return a.basePrice - b.basePrice;
        if (sortBy === 'price_high') return b.basePrice - a.basePrice;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy, maxPrice]);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const defaultVariant = product.variants[0];
    if (defaultVariant && defaultVariant.stock > 0) {
      onAddToCart(product, defaultVariant, 1);
      setAddedToast(`Berhasil menambahkan ${product.name} ke keranjang!`);
      setTimeout(() => setAddedToast(null), 2500);
    } else {
      onSelectProduct(product);
    }
  };

  const handleQuickBuy = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const defaultVariant = product.variants[0];
    if (defaultVariant && defaultVariant.stock > 0) {
      onBuyNow(product, defaultVariant, 1);
    } else {
      onSelectProduct(product);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 text-sm border border-slate-700 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{addedToast}</span>
        </div>
      )}

      {/* Hero Banner Showcase for UMKM */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-md">
            <span>Bangga Buatan Indonesia</span>
            <span>·</span>
            <span>100% Produk Asli UMKM Nusantara</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
            Belanja Langsung dari Pengrajin & Petani Lokal Indonesia
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Dukung jutaan pelaku UMKM lokal. Nikmati alur belanja kilat "Beli Sekarang", kalkulasi ongkos kirim otomatis, serta pembayaran instan QRIS dan Virtual Account via Midtrans Snap.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Search & Sort Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kopi gayo, kemeja batik parang, sambal roa, kulit garut..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
            />
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              aria-label="Urutkan Produk"
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="popular">Paling Terlaris</option>
              <option value="rating">Rating Tertinggi</option>
              <option value="price_low">Harga: Rendah ke Tinggi</option>
              <option value="price_high">Harga: Tinggi ke Rendah</option>
            </select>
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Maks:</span>
            <div className="flex-1 flex items-center gap-2">
              <input
                type="range"
                min={50000}
                max={500000}
                step={25000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                aria-label="Filter Rentang Harga Maksimal"
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-xs font-mono font-medium text-slate-700 tabular-nums whitespace-nowrap">
                {formatIDR(maxPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Category Tabs (Interactive Segmented Buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Counter & Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          Menampilkan <span className="font-semibold text-slate-800">{filteredProducts.length}</span> produk UMKM terkurasi
        </div>
        <div className="flex items-center gap-2">
          <span>Pengiriman dari Sabang sampai Merauke</span>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <Filter className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800">Tidak ada produk yang cocok</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Coba gunakan kata kunci lain atau sesuaikan filter rentang harga dan kategori di atas.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('Semua Kategori');
              setSearchQuery('');
              setMaxPrice(500000);
            }}
            className="px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const primaryVariant = product.variants[0];
            const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group bg-white rounded-xl border border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
              >
                {/* Product Image Container with Zero-Broken-Image Fallback */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback visually if unsplash image fails to load
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const fallback = target.parentElement?.querySelector('.fallback-container');
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                  {/* Fallback container with rich gradient & icon */}
                  <div className="fallback-container hidden absolute inset-0 bg-gradient-to-br from-amber-50 via-stone-100 to-emerald-50 flex flex-col items-center justify-center p-4 text-center">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                      {product.category}
                    </span>
                    <span className="text-sm font-semibold text-slate-800 line-clamp-2">
                      {product.name}
                    </span>
                  </div>

                  {/* Badges / Origin Tag */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 bg-white/95 text-slate-800 rounded shadow-xs backdrop-blur-xs">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{product.sellerCity}</span>
                    </span>
                  </div>

                  {totalStock <= 5 && totalStock > 0 && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="text-[11px] font-bold px-2 py-0.5 bg-rose-600 text-white rounded shadow-xs">
                        Sisa {totalStock} item!
                      </span>
                    </div>
                  )}

                  {totalStock === 0 && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
                      <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded">
                        Stok Habis
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Category & Seller */}
                    <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between mb-1">
                      <span>{product.category}</span>
                      <span>{product.sellerName}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                      {product.name}
                    </h3>

                    {/* Rating & Sold count */}
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                      <div className="flex items-center text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="ml-1 font-semibold text-slate-700 font-mono tabular-nums">
                          {product.rating}
                        </span>
                      </div>
                      <span>·</span>
                      <span className="font-mono tabular-nums">{product.soldCount} terjual</span>
                      <span>·</span>
                      <span className="text-emerald-600 font-medium">Stok: {totalStock}</span>
                    </div>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Mulai dari</span>
                        <span className="text-base font-bold text-emerald-700 font-mono tabular-nums">
                          {formatIDR(product.basePrice)}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {product.variants.length} pilihan varian
                      </span>
                    </div>

                    {/* Dual Action Buttons (Shopee Style) */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        disabled={totalStock === 0}
                        className="w-full py-2 px-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        title="Tambah ke Keranjang Belanja"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span className="truncate">+ Keranjang</span>
                      </button>

                      <button
                        onClick={(e) => handleQuickBuy(e, product)}
                        disabled={totalStock === 0}
                        className="w-full py-2 px-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        title="Langsung Beli Sekarang seperti Shopee"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                        <span className="truncate">Beli Sekarang</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
