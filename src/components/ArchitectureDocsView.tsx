import React, { useState } from 'react';
import {
  PRISMA_SCHEMA_CONTENT,
  ARCHITECTURE_EXPLANATION,
  SAMPLE_ROUTE_HANDLERS
} from '../data/prismaSchemaString';
import {
  Database,
  FileCode,
  Layers,
  Copy,
  Check,
  Server,
  Lock,
  GitFork
} from 'lucide-react';

export const ArchitectureDocsView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'schema' | 'architecture' | 'api'>('schema');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Arsitektur Sistem & Skema Basis Data UMKM
          </h1>
          <p className="text-xs text-slate-500">
            Dokumentasi lengkap Prisma ORM (PostgreSQL), alur atomik Midtrans Snap, dan Route Handlers Next.js / Express.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('schema')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'schema'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Prisma Schema (ERD)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('architecture')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'architecture'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Alur Arsitektur</span>
          </button>

          <button
            onClick={() => setActiveSubTab('api')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'api'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-purple-600" />
            <span>Implementasi API Backend</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: PRISMA SCHEMA */}
      {activeSubTab === 'schema' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Desain Relasional Skema Basis Data (PostgreSQL + Prisma ORM)
                </h3>
                <p className="text-xs text-slate-500">
                  Mencakup model: <code>User</code>, <code>Product</code>, <code>ProductVariant</code>, <code>Cart</code>, <code>CartItem</code>, <code>Order</code>, <code>OrderItem</code>, <code>PaymentTransaction</code>, <code>ShippingAddress</code>, dan <code>Voucher</code>.
                </p>
              </div>

              <button
                onClick={() => handleCopy(PRISMA_SCHEMA_CONTENT, 'schema')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedType === 'schema' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'schema' ? 'Tersalin!' : 'Salin Schema.prisma'}</span>
              </button>
            </div>

            <pre className="bg-slate-950 text-slate-200 p-5 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 max-h-[600px]">
              {PRISMA_SCHEMA_CONTENT}
            </pre>
          </div>
        </div>
      )}

      {/* SUBTAB 2: ARCHITECTURE OVERVIEW */}
      {activeSubTab === 'architecture' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="text-sm font-bold text-slate-900">Belanja Kilat "Beli Sekarang"</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Membypass keranjang utama layaknya Shopee. Mengisolasi varian dan kuantitas produk terpilih ke dalam sesi checkout instan tanpa menghapus item yang sudah ada di keranjang reguler pengguna.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="text-sm font-bold text-slate-900">Transaksi Atomik & Kunci Stok</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Saat token Midtrans Snap di-request, backend menjalankan Prisma Interactive Transaction (\`prisma.$transaction\`) untuk mengurangi stok varian secara atomik demi mencegah <em>overselling</em>.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="text-sm font-bold text-slate-900">Auto-Restock & Signature Key</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Webhook Midtrans diverifikasi via SHA-512 signature. Jika pembayaran berstatus <strong>expire</strong> atau <strong>cancel</strong>, kuota inventaris varian secara otomatis dipulihkan ke database.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <GitFork className="w-4 h-4 text-emerald-600" />
              <span>Detail Siklus Transaksi E-Commerce UMKM</span>
            </h3>

            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
                <span className="font-bold text-slate-900 block">
                  A. Status Pesanan (Order Status State Machine):
                </span>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>
                    <code>PENDING_PAYMENT</code>: Pesanan dibuat, Snap token aktif, menunggu pembayaran dari pembeli (masa berlaku 15 menit).
                  </li>
                  <li>
                    <code>PAID_PACKING</code>: Midtrans mengirim webhook status <code>settlement</code>. Penjual UMKM memproses dan mengemas pesanan.
                  </li>
                  <li>
                    <code>SHIPPED</code>: Penjual menginput nomor resi (AWB) kurir (SiCepat/JNE/J&T/GoSend). Paket dalam perjalanan.
                  </li>
                  <li>
                    <code>COMPLETED</code>: Paket sampai dan dikonfirmasi pembeli.
                  </li>
                  <li>
                    <code>EXPIRED / CANCELLED</code>: Waktu bayar habis atau dibatalkan. Kuantitas stok otomatis dikembalikan ke produk varian.
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
                <span className="font-bold text-slate-900 block">
                  B. Validasi Signature SHA-512 Midtrans Webhook:
                </span>
                <p>
                  Rumus resmi Midtrans: <code>SHA512(order_id + status_code + gross_amount + ServerKey)</code>.
                  Jika hash dari webhook tidak sama persis dengan hasil perhitungan server, request ditolak dengan HTTP 401 Unauthorized.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: API IMPLEMENTATION */}
      {activeSubTab === 'api' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Kode Implementasi Route Handler (Next.js App Router / Express)
                </h3>
                <p className="text-xs text-slate-500">
                  Mencakup pembuatan Snap Token dengan Prisma transaction dan Webhook verification handler.
                </p>
              </div>

              <button
                onClick={() => handleCopy(SAMPLE_ROUTE_HANDLERS, 'api')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedType === 'api' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'api' ? 'Tersalin!' : 'Salin Kode API'}</span>
              </button>
            </div>

            <pre className="bg-slate-950 text-slate-200 p-5 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 max-h-[600px]">
              {SAMPLE_ROUTE_HANDLERS}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
