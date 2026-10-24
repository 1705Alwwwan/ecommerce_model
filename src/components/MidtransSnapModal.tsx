import React, { useState, useEffect } from 'react';
import { Order, PaymentTransaction } from '../types/ecommerce';
import { formatIDR } from '../services/midtransService';
import {
  X,
  Copy,
  Check,
  QrCode,
  Building2,
  Wallet,
  Clock,
  ShieldCheck,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface MidtransSnapModalProps {
  order: Order;
  payment: PaymentTransaction;
  onClose: () => void;
  onSimulateSettlement: (orderId: string) => void;
  onSimulateExpire: (orderId: string) => void;
  onSimulateCancel: (orderId: string) => void;
}

export const MidtransSnapModal: React.FC<MidtransSnapModalProps> = ({
  order,
  payment,
  onClose,
  onSimulateSettlement,
  onSimulateExpire,
  onSimulateCancel,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'qris' | 'va' | 'ewallet'>('qris');
  const [selectedBank, setSelectedBank] = useState<'bca' | 'mandiri' | 'bri' | 'bni'>('bca');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(15 * 60); // 15 mins timer

  // Countdown timer for realistic payment expiration
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Generate Bank VA code
  const getVaDetails = (bank: string) => {
    switch (bank) {
      case 'bca':
        return {
          name: 'BCA Virtual Account',
          number: payment.vaNumber || '7001298410293812',
          guide: [
            'Buka BCA mobile > m-Transfer > BCA Virtual Account',
            'Masukkan No. Virtual Account di atas',
            'Pastikan nama merchant: NusantaraMart UMKM dan nominal sesuai',
            'Masukkan PIN m-BCA Anda dan simpan bukti transfer'
          ]
        };
      case 'mandiri':
        return {
          name: 'Mandiri Bill Payment',
          billerCode: '70012',
          number: payment.billKey || '892019481928',
          guide: [
            'Buka Livin\' by Mandiri > Bayar > Cari Penyedia Jasa "Midtrans"',
            'Masukkan Kode Perusahaan: 70012',
            'Masukkan Nomor Pembayaran di atas',
            'Konfirmasi dan masukkan PIN Livin'
          ]
        };
      case 'bri':
        return {
          name: 'BRI BRIVA',
          number: '8801289192019281',
          guide: [
            'Buka BRImo > Pembayaran > BRIVA',
            'Masukkan No. BRIVA di atas',
            'Periksa detail tagihan, masukkan PIN BRImo Anda'
          ]
        };
      case 'bni':
        return {
          name: 'BNI Virtual Account',
          number: '9881273819281920',
          guide: [
            'Buka BNI Mobile Banking > Transfer > Virtual Account Billing',
            'Pilih Input Baru dan masukkan Nomor Virtual Account',
            'Masukkan password transaksi BNI'
          ]
        };
      default:
        return {
          name: 'Virtual Account',
          number: '7001298410293812',
          guide: []
        };
    }
  };

  const currentVa = getVaDetails(selectedBank);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* Midtrans Snap Top Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-blue-500 text-white font-black text-xs flex items-center justify-center">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wide uppercase text-blue-400">
                  Midtrans Snap
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono">
                  Sandbox Test
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Merchant: NusantaraMart UMKM</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Tutup Pop-up"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount & Expiry Timer Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between text-xs">
          <div>
            <span className="text-[11px] text-slate-500 block">Total Pembayaran</span>
            <span className="text-base font-extrabold text-slate-900 font-mono tabular-nums">
              {formatIDR(order.totalAmount)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-500 block flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>Selesaikan dalam</span>
            </span>
            <span className="text-sm font-bold font-mono text-amber-600 tabular-nums">
              {formatTimer(timeLeftSeconds)}
            </span>
          </div>
        </div>

        {/* Method Selector Tabs */}
        <div className="grid grid-cols-3 border-b border-slate-200 text-xs font-semibold bg-white">
          <button
            onClick={() => setSelectedMethod('qris')}
            className={`py-3 flex flex-col items-center gap-1 transition-colors cursor-pointer border-b-2 ${
              selectedMethod === 'qris'
                ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QRIS</span>
          </button>

          <button
            onClick={() => setSelectedMethod('va')}
            className={`py-3 flex flex-col items-center gap-1 transition-colors cursor-pointer border-b-2 ${
              selectedMethod === 'va'
                ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Virtual Account</span>
          </button>

          <button
            onClick={() => setSelectedMethod('ewallet')}
            className={`py-3 flex flex-col items-center gap-1 transition-colors cursor-pointer border-b-2 ${
              selectedMethod === 'ewallet'
                ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>E-Wallet</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: QRIS */}
          {selectedMethod === 'qris' && (
            <div className="space-y-4 text-center">
              <div className="inline-block p-4 bg-white rounded-xl border border-slate-200 shadow-sm mx-auto">
                {/* Dynamic SVG QRIS Code */}
                <div className="w-44 h-44 mx-auto relative bg-white flex items-center justify-center p-2 border border-slate-100 rounded-lg">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Corner squares standard QR */}
                    <rect x="5" y="5" width="25" height="25" fill="#1e293b" />
                    <rect x="8" y="8" width="19" height="19" fill="#ffffff" />
                    <rect x="11" y="11" width="13" height="13" fill="#1e293b" />

                    <rect x="70" y="5" width="25" height="25" fill="#1e293b" />
                    <rect x="73" y="8" width="19" height="19" fill="#ffffff" />
                    <rect x="76" y="11" width="13" height="13" fill="#1e293b" />

                    <rect x="5" y="70" width="25" height="25" fill="#1e293b" />
                    <rect x="8" y="73" width="19" height="19" fill="#ffffff" />
                    <rect x="11" y="76" width="13" height="13" fill="#1e293b" />

                    {/* QR Matrix Dots pattern */}
                    <rect x="35" y="8" width="6" height="6" fill="#1e293b" />
                    <rect x="45" y="8" width="6" height="6" fill="#1e293b" />
                    <rect x="55" y="8" width="6" height="6" fill="#1e293b" />
                    <rect x="35" y="18" width="6" height="6" fill="#1e293b" />
                    <rect x="50" y="22" width="8" height="8" fill="#1e293b" />
                    
                    <rect x="8" y="38" width="6" height="6" fill="#1e293b" />
                    <rect x="20" y="44" width="8" height="8" fill="#1e293b" />
                    <rect x="34" y="36" width="6" height="6" fill="#1e293b" />
                    <rect x="45" y="45" width="10" height="10" fill="#2563eb" />
                    <rect x="62" y="38" width="6" height="6" fill="#1e293b" />
                    <rect x="75" y="40" width="8" height="8" fill="#1e293b" />
                    
                    <rect x="36" y="65" width="8" height="8" fill="#1e293b" />
                    <rect x="52" y="70" width="6" height="6" fill="#1e293b" />
                    <rect x="68" y="62" width="6" height="6" fill="#1e293b" />
                    <rect x="80" y="74" width="8" height="8" fill="#1e293b" />
                  </svg>
                  {/* QRIS Center Badge */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                      QRIS
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-800 block">
                  Scan dengan GoPay, ShopeePay, BCA, OVO, Dana, LinkAja
                </span>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Buka aplikasi pembayaran favorit Anda, pilih menu Scan QR, lalu konfirmasi pembayaran.
                </p>
              </div>

              {/* Quick simulation button */}
              <button
                onClick={() => onSimulateSettlement(order.id)}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Simulasi Scan QRIS Lunas (Instant Settlement)</span>
              </button>
            </div>
          )}

          {/* TAB 2: VIRTUAL ACCOUNT */}
          {selectedMethod === 'va' && (
            <div className="space-y-4">
              {/* Bank selector pills */}
              <div className="grid grid-cols-4 gap-1.5">
                {(['bca', 'mandiri', 'bri', 'bni'] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBank(b)}
                    className={`py-2 px-1 text-center rounded-lg text-xs font-bold uppercase transition-all cursor-pointer border ${
                      selectedBank === b
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              {/* VA Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="text-[11px] text-slate-500 font-medium">
                  {currentVa.name}
                </div>

                {'billerCode' in currentVa && currentVa.billerCode && (
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Kode Perusahaan (Biller)</span>
                      <span className="text-sm font-mono font-bold text-slate-800">
                        {currentVa.billerCode}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(currentVa.billerCode!, 'biller')}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedText === 'biller' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedText === 'biller' ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Nomor Virtual Account</span>
                    <span className="text-lg font-mono font-extrabold text-blue-900 tracking-wider">
                      {currentVa.number}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(currentVa.number, 'va')}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedText === 'va' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText === 'va' ? 'Tersalin!' : 'Salin VA'}</span>
                  </button>
                </div>
              </div>

              {/* Step-by-step instructions */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <span className="font-semibold text-slate-800 block">Petunjuk Pembayaran:</span>
                <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-500">
                  {currentVa.guide.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              {/* Simulation button */}
              <button
                onClick={() => onSimulateSettlement(order.id)}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Simulasi Transfer VA Berhasil</span>
              </button>
            </div>
          )}

          {/* TAB 3: E-WALLET */}
          {selectedMethod === 'ewallet' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl border border-slate-200 bg-emerald-50/40 text-center space-y-2">
                  <span className="text-xs font-bold text-emerald-800 block">GoPay</span>
                  <p className="text-[11px] text-slate-500">Auto redirect ke aplikasi Gojek di HP Anda</p>
                  <button
                    onClick={() => onSimulateSettlement(order.id)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Bayar GoPay
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-amber-50/40 text-center space-y-2">
                  <span className="text-xs font-bold text-amber-800 block">ShopeePay</span>
                  <p className="text-[11px] text-slate-500">Buka aplikasi Shopee & konfirmasi PIN ShopeePay</p>
                  <button
                    onClick={() => onSimulateSettlement(order.id)}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Bayar ShopeePay
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Testing Controls (Expire & Cancel Sandbox Simulation) */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Midtrans Sandbox Controller</span>
            </span>
            <span className="text-slate-400 font-mono">Order: {order.orderNumber}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => onSimulateExpire(order.id)}
              className="py-2 px-3 bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Uji coba batas waktu bayar habis & pengembalian kuota stok produk otomatis"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Simulasi Expired (Restock)</span>
            </button>

            <button
              onClick={() => onSimulateCancel(order.id)}
              className="py-2 px-3 bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Batalkan transaksi dan kembalikan stok"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Batalkan Transaksi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
