import React, { useState, useEffect } from 'react';
import { Order, MidtransWebhookPayload } from '../types/ecommerce';
import {
  MIDTRANS_MOCK_SERVER_KEY,
  calculateMidtransSignature,
  createMockWebhookPayload
} from '../services/midtransService';
import {
  X,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Copy,
  Terminal,
  KeyRound
} from 'lucide-react';

interface WebhookInspectorModalProps {
  orders: Order[];
  isOpen: boolean;
  onClose: () => void;
  onProcessWebhook: (payload: MidtransWebhookPayload) => void;
}

export const WebhookInspectorModal: React.FC<WebhookInspectorModalProps> = ({
  orders,
  isOpen,
  onClose,
  onProcessWebhook,
}) => {
  if (!isOpen) return null;

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders[0]?.id || ''
  );
  const [selectedStatus, setSelectedStatus] = useState<'settlement' | 'expire' | 'cancel' | 'pending'>('settlement');
  const [paymentType, setPaymentType] = useState<'qris' | 'bank_transfer' | 'gopay'>('qris');
  const [generatedPayload, setGeneratedPayload] = useState<MidtransWebhookPayload | null>(null);
  const [signatureFormula, setSignatureFormula] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [lastDispatchedInfo, setLastDispatchedInfo] = useState<string | null>(null);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  useEffect(() => {
    if (!selectedOrder) return;

    createMockWebhookPayload(
      selectedOrder.id,
      selectedOrder.totalAmount,
      selectedStatus,
      paymentType
    ).then((payload) => {
      setGeneratedPayload(payload);
      setSignatureFormula(
        `SHA512("${payload.order_id}" + "${payload.status_code}" + "${payload.gross_amount}" + "${MIDTRANS_MOCK_SERVER_KEY}")`
      );
    });
  }, [selectedOrder, selectedStatus, paymentType]);

  const handleDispatch = () => {
    if (!generatedPayload) return;
    onProcessWebhook(generatedPayload);
    setLastDispatchedInfo(
      `Webhook berhasil dikirim! Status pesanan #${selectedOrder?.orderNumber} diperbarui menjadi: ${
        selectedStatus === 'settlement'
          ? 'PAID_PACKING (Lunas)'
          : selectedStatus === 'expire'
          ? 'EXPIRED (Stok dipulihkan)'
          : 'CANCELLED (Stok dipulihkan)'
      }`
    );
    setTimeout(() => setLastDispatchedInfo(null), 4000);
  };

  const handleCopyJSON = () => {
    if (!generatedPayload) return;
    navigator.clipboard.writeText(JSON.stringify(generatedPayload, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                <span>Midtrans Webhook Simulator & Signature Inspector</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Uji validasi HMAC SHA-512 signature key & mutasi status transaksi atomik
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Dispatch Toast */}
          {lastDispatchedInfo && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{lastDispatchedInfo}</span>
            </div>
          )}

          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Pilih Pesanan Target</label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-[11px] focus:outline-none focus:border-blue-600"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.orderNumber} ({o.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Event Callback Midtrans</label>
              <select
                value={selectedStatus}
                onChange={(e: any) => setSelectedStatus(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold text-[11px] focus:outline-none focus:border-blue-600"
              >
                <option value="settlement">settlement (Pembayaran Sukses)</option>
                <option value="expire">expire (Batas Waktu Habis)</option>
                <option value="cancel">cancel (Dibatalkan)</option>
                <option value="pending">pending (Menunggu Pembayaran)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Metode Pembayaran</label>
              <select
                value={paymentType}
                onChange={(e: any) => setPaymentType(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-[11px] focus:outline-none focus:border-blue-600"
              >
                <option value="qris">QRIS (GoPay/ShopeePay/BCA)</option>
                <option value="bank_transfer">Virtual Account (BCA/Mandiri)</option>
                <option value="gopay">GoPay Deeplink</option>
              </select>
            </div>
          </div>

          {/* Signature Verification Explanation Box */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-800 text-xs">
              <KeyRound className="w-4 h-4 text-amber-600" />
              <span>Verifikasi Signature Key Midtrans</span>
            </div>

            <div className="font-mono text-[11px] bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700 space-y-1">
              <div className="text-slate-400">// Rumus Standar Midtrans:</div>
              <div className="text-blue-700 font-bold break-all">{signatureFormula}</div>
              <div className="pt-1 text-slate-400">// Hasil SHA-512 Hex:</div>
              <div className="text-emerald-700 font-bold break-all">
                {generatedPayload?.signature_key || '...'}
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Backend memverifikasi signature key sebelum memperbarui database agar webhook tidak dapat dipalsukan pihak ketiga.
            </p>
          </div>

          {/* JSON Payload Viewer */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 text-xs">
                Payload HTTP POST Callback (application/json):
              </span>
              <button
                onClick={handleCopyJSON}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{isCopied ? 'Tersalin!' : 'Salin JSON'}</span>
              </button>
            </div>

            <pre className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-56 leading-relaxed border border-slate-800">
              {generatedPayload ? JSON.stringify(generatedPayload, null, 2) : 'Loading...'}
            </pre>
          </div>

          {/* Atomic Stock Behavior Note */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3 text-[11px] text-amber-900 space-y-1">
            <span className="font-bold block flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>Mekanisme Restock Otomatis (Anti-Overselling):</span>
            </span>
            <p>
              Jika memilih event <strong>expire</strong> atau <strong>cancel</strong>, kuota inventaris untuk varian produk pada pesanan ini akan secara atomik dikembalikan ke database (\`stock = stock + quantity\`).
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>

          <button
            onClick={handleDispatch}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim Simulasi Webhook ke Server</span>
          </button>
        </div>
      </div>
    </div>
  );
};
