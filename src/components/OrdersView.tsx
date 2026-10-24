import React, { useState } from 'react';
import { Order, OrderStatus } from '../types/ecommerce';
import { formatIDR } from '../services/midtransService';
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  CreditCard,
  MapPin,
  ExternalLink
} from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  onOpenPaymentModal: (order: Order) => void;
  onExploreProducts: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onOpenPaymentModal,
  onExploreProducts,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredOrders = orders.filter((ord) => {
    if (filterStatus === 'ALL') return true;
    return ord.status === filterStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu Pembayaran</span>
          </span>
        );
      case 'PAID_PACKING':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
            <Package className="w-3.5 h-3.5" />
            <span>Pembayaran Lunas · Perlu Dikirim</span>
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-md">
            <Truck className="w-3.5 h-3.5" />
            <span>Sedang Dikirim</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Pesanan Selesai</span>
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-md">
            <XCircle className="w-3.5 h-3.5" />
            <span>Waktu Bayar Habis (Restocked)</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-md">
            <XCircle className="w-3.5 h-3.5" />
            <span>Dibatalkan (Restocked)</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pesanan Saya</h1>
          <p className="text-xs text-slate-500">
            Pantau status pembayaran Midtrans dan pelacakan resi kurir UMKM Anda.
          </p>
        </div>
        <button
          onClick={onExploreProducts}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer self-start sm:self-auto"
        >
          Belanja Produk UMKM Baru →
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { label: 'Semua Pesanan', value: 'ALL' },
          { label: 'Menunggu Pembayaran', value: 'PENDING_PAYMENT' },
          { label: 'Perlu Dikirim', value: 'PAID_PACKING' },
          { label: 'Sedang Dikirim', value: 'SHIPPED' },
          { label: 'Selesai', value: 'COMPLETED' },
          { label: 'Expired / Batal', value: 'EXPIRED' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterStatus(tab.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              filterStatus === tab.value
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <Package className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800">Belum Ada Pesanan di Kategori Ini</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Semua pesanan yang Anda buat akan tercatat di sini lengkap dengan riwayat pembayaran dan status pengiriman.
          </p>
          <button
            onClick={onExploreProducts}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
          >
            Jelajahi Katalog UMKM
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isPending = order.status === 'PENDING_PAYMENT';

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5"
              >
                {/* Header: Order Number, Date, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">{order.createdAt}</span>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* Items */}
                <div className="divide-y divide-slate-100">
                  {order.items.map((item, i) => (
                    <div key={i} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <h4 className="font-semibold text-slate-900">{item.productName}</h4>
                        <div className="text-slate-500">
                          Varian: <span className="font-medium text-slate-700">{item.variantName}</span>
                        </div>
                        <div className="text-slate-400">
                          {item.quantity} barang x {formatIDR(item.price)}
                        </div>
                      </div>
                      <span className="font-mono font-bold text-slate-800 tabular-nums">
                        {formatIDR(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping & Courier Tracking */}
                <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 space-y-2 border border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        {order.shippingCourier.name} ({order.shippingCourier.service})
                      </span>
                    </div>

                    {order.trackingNumber ? (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Nomor Resi:</span>
                        <span className="font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                          {order.trackingNumber}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">
                        {isPending
                          ? 'Resi akan terbit setelah pembayaran lunas'
                          : 'Penjual sedang menyiapkan paket...'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-1.5 text-[11px] text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      Tujuan: {order.shippingAddress.recipientName} ({order.shippingAddress.phone}) · {order.shippingAddress.addressLine}, {order.shippingAddress.city}
                    </span>
                  </div>
                </div>

                {/* Footer: Total & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-slate-500">Total Pembayaran:</span>
                    <span className="text-base font-extrabold text-emerald-800 font-mono tabular-nums">
                      {formatIDR(order.totalAmount)}
                    </span>
                  </div>

                  {isPending && (
                    <button
                      onClick={() => onOpenPaymentModal(order)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Bayar Sekarang (Buka Midtrans Snap)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
