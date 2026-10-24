import React from 'react';
import { ShoppingBag, Store, FileCode2, Package, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentTab: 'catalog' | 'cart' | 'orders' | 'seller' | 'architecture';
  onSelectTab: (tab: 'catalog' | 'cart' | 'orders' | 'seller' | 'architecture') => void;
  cartCount: number;
  pendingOrdersCount: number;
  onOpenWebhookModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  cartCount,
  pendingOrdersCount,
  onOpenWebhookModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => onSelectTab('catalog')}
            className="text-left group cursor-pointer"
          >
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                N
              </span>
              <span>NusantaraMart</span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded">
                UMKM Lokal
              </span>
            </span>
          </button>

          {/* Zone 2: 4-5 clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onSelectTab('catalog')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                currentTab === 'catalog'
                  ? 'border-emerald-600 text-emerald-700 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Katalog Produk
            </button>

            <button
              onClick={() => onSelectTab('cart')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                currentTab === 'cart'
                  ? 'border-emerald-600 text-emerald-700 font-semibold'
                  : 'border-transparent'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Keranjang</span>
              {cartCount > 0 && (
                <span className="bg-amber-500 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('orders')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                currentTab === 'orders'
                  ? 'border-emerald-600 text-emerald-700 font-semibold'
                  : 'border-transparent'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Pesanan Saya</span>
              {pendingOrdersCount > 0 && (
                <span className="bg-emerald-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('seller')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                currentTab === 'seller'
                  ? 'border-emerald-600 text-emerald-700 font-semibold'
                  : 'border-transparent'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Panel Seller UMKM</span>
            </button>

            <button
              onClick={() => onSelectTab('architecture')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                currentTab === 'architecture'
                  ? 'border-emerald-600 text-emerald-700 font-semibold'
                  : 'border-transparent'
              }`}
            >
              <FileCode2 className="w-4 h-4" />
              <span>Skema & API</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenWebhookModal}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              title="Buka Midtrans Webhook Inspector & Sandbox Tool"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Midtrans Webhook Tool</span>
              <span className="sm:hidden">Midtrans Tool</span>
            </button>

            <button
              onClick={() => onSelectTab('cart')}
              className="md:hidden relative p-2 text-slate-700 hover:text-slate-900"
              aria-label="Keranjang"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav subbar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 bg-white py-2 px-1 text-xs font-medium text-slate-600">
        <button
          onClick={() => onSelectTab('catalog')}
          className={`px-2 py-1 ${currentTab === 'catalog' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Katalog
        </button>
        <button
          onClick={() => onSelectTab('cart')}
          className={`px-2 py-1 ${currentTab === 'cart' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Keranjang ({cartCount})
        </button>
        <button
          onClick={() => onSelectTab('orders')}
          className={`px-2 py-1 ${currentTab === 'orders' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Pesanan ({pendingOrdersCount})
        </button>
        <button
          onClick={() => onSelectTab('seller')}
          className={`px-2 py-1 ${currentTab === 'seller' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Seller Center
        </button>
        <button
          onClick={() => onSelectTab('architecture')}
          className={`px-2 py-1 ${currentTab === 'architecture' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Arsitektur
        </button>
      </div>
    </header>
  );
};
