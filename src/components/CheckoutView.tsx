import React, { useState, useMemo } from 'react';
import {
  OrderItem,
  ShippingAddress,
  ShippingCourier,
  Voucher
} from '../types/ecommerce';
import { AVAILABLE_VOUCHERS, INDONESIAN_CITIES } from '../data/mockProducts';
import { calculateCourierRates, formatIDR } from '../services/midtransService';
import {
  MapPin,
  Truck,
  Ticket,
  ShieldCheck,
  Check,
  CreditCard
} from 'lucide-react';

interface CheckoutViewProps {
  checkoutItems: Array<{
    productId: string;
    variantId: string;
    productName: string;
    variantName: string;
    price: number;
    quantity: number;
    weightGram: number;
    image: string;
    sellerCity: string;
  }>;
  onInitiatePayment: (orderData: {
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    shippingCourier: ShippingCourier;
    subtotal: number;
    shippingFee: number;
    discountAmount: number;
    serviceFee: number;
    totalAmount: number;
    voucherCode?: string;
  }) => void;
  onBack: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  checkoutItems,
  onInitiatePayment,
  onBack,
}) => {
  // Shipping Address state
  const [address, setAddress] = useState<ShippingAddress>({
    recipientName: 'Farhan Alwan',
    phone: '081298765432',
    addressLine: 'Jl. Merdeka No. 45, RT 03 / RW 07, Kebayoran',
    city: INDONESIAN_CITIES[0].name,
    province: 'DKI Jakarta',
    postalCode: '12150',
  });

  // Calculate total weight
  const totalWeightGrams = useMemo(() => {
    return checkoutItems.reduce((acc, it) => acc + (it.weightGram || 250) * it.quantity, 0);
  }, [checkoutItems]);

  // Available Courier options
  const availableCouriers = useMemo(() => {
    return calculateCourierRates(address.city, totalWeightGrams);
  }, [address.city, totalWeightGrams]);

  // Selected courier
  const [selectedCourier, setSelectedCourier] = useState<ShippingCourier>(availableCouriers[0]);

  // Voucher state
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);

  // Calculations
  const subtotal = useMemo(() => {
    return checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [checkoutItems]);

  const discountAmount = useMemo(() => {
    if (!appliedVoucher) return 0;
    if (subtotal < appliedVoucher.minOrder) return 0;

    if (appliedVoucher.discountType === 'FIXED') {
      return appliedVoucher.discountValue;
    } else {
      const calculated = (subtotal * appliedVoucher.discountValue) / 100;
      return appliedVoucher.maxDiscount ? Math.min(calculated, appliedVoucher.maxDiscount) : calculated;
    }
  }, [appliedVoucher, subtotal]);

  const serviceFee = 1000; // Biaya Layanan & Penanganan UMKM
  const shippingFee = selectedCourier.cost;
  const totalPayment = Math.max(0, subtotal + shippingFee + serviceFee - discountAmount);

  // Voucher apply handler
  const handleApplyVoucher = (code: string) => {
    setVoucherError(null);
    const found = AVAILABLE_VOUCHERS.find(
      (v) => v.code.toUpperCase() === code.trim().toUpperCase()
    );

    if (!found) {
      setVoucherError('Kode voucher tidak ditemukan atau sudah habis.');
      return;
    }

    if (subtotal < found.minOrder) {
      setVoucherError(`Minimal belanja untuk voucher ini adalah ${formatIDR(found.minOrder)}`);
      return;
    }

    setAppliedVoucher(found);
    setVoucherCodeInput(found.code);
  };

  const handlePayNow = () => {
    const formattedOrderItems: OrderItem[] = checkoutItems.map((it) => ({
      id: `ord-item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      orderId: '',
      productId: it.productId,
      variantId: it.variantId,
      productName: it.productName,
      variantName: it.variantName,
      price: it.price,
      quantity: it.quantity,
      subtotal: it.price * it.quantity,
    }));

    onInitiatePayment({
      items: formattedOrderItems,
      shippingAddress: address,
      shippingCourier: selectedCourier,
      subtotal,
      shippingFee,
      discountAmount,
      serviceFee,
      totalAmount: totalPayment,
      voucherCode: appliedVoucher?.code,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Alur Checkout</h1>
          <p className="text-xs text-slate-500">
            Periksa kembali alamat tujuan, kurir ekspedisi, dan voucher sebelum membuka Midtrans Snap.
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-xs font-medium text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          ← Kembali
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Alamat Pengiriman */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Alamat Pengiriman</h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Alamat Utama
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nama Penerima</label>
                <input
                  type="text"
                  value={address.recipientName}
                  onChange={(e) => setAddress({ ...address, recipientName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Nomor Telepon / WA</label>
                <input
                  type="text"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-medium mb-1">Kota / Kabupaten Tujuan</label>
                <select
                  value={address.city}
                  onChange={(e) => {
                    const newCity = e.target.value;
                    setAddress({ ...address, city: newCity });
                    // recalculate couriers
                    const updatedCouriers = calculateCourierRates(newCity, totalWeightGrams);
                    setSelectedCourier(updatedCouriers[0]);
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600"
                >
                  {INDONESIAN_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-medium mb-1">Alamat Lengkap & Patokan</label>
                <textarea
                  rows={2}
                  value={address.addressLine}
                  onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 resize-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Produk yang Dipesan */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Daftar Produk ({checkoutItems.length} Produk)
            </h3>

            <div className="divide-y divide-slate-100">
              {checkoutItems.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={item.image}
                        alt={item.productName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 line-clamp-1">
                        {item.productName}
                      </h4>
                      <div className="text-slate-500">
                        Varian: <span className="font-medium text-slate-700">{item.variantName}</span>
                      </div>
                      <div className="text-slate-400">
                        {item.quantity} x {formatIDR(item.price)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono font-bold text-emerald-800 tabular-nums">
                    {formatIDR(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Pilihan Ekspedisi & Ongkir Otomatis */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Pilihan Jasa Kirim</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Total Berat: {totalWeightGrams} gram
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableCouriers.map((courier) => {
                const isSelected = selectedCourier.code === courier.code;
                return (
                  <button
                    key={courier.code}
                    onClick={() => setSelectedCourier(courier)}
                    className={`p-3 rounded-lg text-left text-xs border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">{courier.name}</div>
                        <div className="text-slate-500 text-[11px]">{courier.service}</div>
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Estimasi {courier.etd}</span>
                      <span className="font-mono font-bold text-slate-800">
                        {formatIDR(courier.cost)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Voucher & Payment Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Voucher Box */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Ticket className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Voucher Diskon & Ongkir</h3>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Masukkan kode voucher"
                value={voucherCodeInput}
                onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono uppercase focus:outline-none focus:border-emerald-600"
              />
              <button
                onClick={() => handleApplyVoucher(voucherCodeInput)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Terapkan
              </button>
            </div>

            {voucherError && (
              <p className="text-[11px] text-rose-600 font-medium">{voucherError}</p>
            )}

            {appliedVoucher && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-800 flex items-center justify-between">
                <div>
                  <span className="font-bold">{appliedVoucher.code}</span>
                  <p className="text-[11px] text-emerald-700">{appliedVoucher.description}</p>
                </div>
                <button
                  onClick={() => {
                    setAppliedVoucher(null);
                    setVoucherCodeInput('');
                  }}
                  className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            )}

            {/* Quick apply chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-slate-400 block font-medium">Voucher Tersedia:</span>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_VOUCHERS.map((v) => (
                  <button
                    key={v.code}
                    onClick={() => handleApplyVoucher(v.code)}
                    className="text-[11px] font-mono px-2 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    {v.code} ({v.discountType === 'FIXED' ? formatIDR(v.discountValue) : `${v.discountValue}%`})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Transparent Cost Breakdown */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 shadow-xs sticky top-20">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Rincian Pembayaran
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal Produk ({checkoutItems.length} item)</span>
                <span className="font-semibold text-slate-800 font-mono tabular-nums">
                  {formatIDR(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Ongkos Kirim ({selectedCourier.name})</span>
                <span className="font-semibold text-slate-800 font-mono tabular-nums">
                  {formatIDR(shippingFee)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Biaya Layanan & Penanganan UMKM</span>
                <span className="font-semibold text-slate-800 font-mono tabular-nums">
                  {formatIDR(serviceFee)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-semibold">
                  <span>Diskon Voucher ({appliedVoucher?.code})</span>
                  <span className="font-mono tabular-nums">-{formatIDR(discountAmount)}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-xs font-semibold text-slate-700 block">Total Tagihan</span>
                  <span className="text-[11px] text-slate-400">Termasuk PPN & Biaya Midtrans</span>
                </div>
                <span className="text-xl font-extrabold text-emerald-800 font-mono tabular-nums">
                  {formatIDR(totalPayment)}
                </span>
              </div>

              <button
                onClick={handlePayNow}
                className="w-full py-3.5 px-4 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <CreditCard className="w-4 h-4" />
                <span>Bayar Sekarang (Midtrans Snap)</span>
              </button>
            </div>

            {/* Midtrans Trust Banner */}
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/80 text-[11px] text-slate-600 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pembayaran Aman via Midtrans Snap</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Mendukung QRIS instan otomatis terverifikasi, Virtual Account BCA, Mandiri, BRI, BNI dengan verifikasi signature SHA-512 real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
