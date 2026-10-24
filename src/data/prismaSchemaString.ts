export const PRISMA_SCHEMA_CONTENT = `// This is your Prisma schema file for UMKM E-Commerce Platform
// Learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  BUYER
  SELLER_ADMIN
}

enum OrderStatus {
  PENDING_PAYMENT // Menunggu Pembayaran
  PAID_PACKING    // Pembayaran Berhasil, UMKM Menyiapkan Paket
  SHIPPED         // Paket Diserahkan ke Kurir (Resi Terbit)
  COMPLETED       // Pesanan Diterima Pembeli
  CANCELLED       // Dibatalkan Pembeli / Penjual
  EXPIRED         // Batas Waktu Bayar Habis (Stok Dikembalikan)
}

enum PaymentType {
  QRIS
  BANK_TRANSFER
  GOPAY
  SHOPEEPAY
  CSTORE
}

enum TransactionStatus {
  PENDING
  SETTLEMENT
  EXPIRE
  CANCEL
  DENY
}

enum DiscountType {
  FIXED
  PERCENTAGE
}

model User {
  id            String            @id @default(uuid())
  email         String            @unique
  name          String
  phone         String?
  role          Role              @default(BUYER)
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt

  addresses     ShippingAddress[]
  orders        Order[]
  cart          Cart?
  products      Product[]         @relation("SellerProducts")
  reviews       Review[]

  @@map("users")
}

model ShippingAddress {
  id            String    @id @default(uuid())
  userId        String
  recipientName String
  phone         String
  addressLine   String
  city          String
  province      String
  postalCode    String
  isDefault     Boolean   @default(false)
  createdAt     DateTime  @default(now())

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  orders        Order[]

  @@map("shipping_addresses")
}

model Product {
  id            String           @id @default(uuid())
  sellerId      String
  name          String
  slug          String           @unique
  description   String           @db.Text
  category      String
  basePrice     Decimal          @db.Decimal(12, 2)
  isPublished   Boolean          @default(true)
  images        String[]         // Array URL foto produk
  rating        Float            @default(0.0)
  reviewCount   Int              @default(0)
  soldCount     Int              @default(0)
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt

  seller        User             @relation("SellerProducts", fields: [sellerId], references: [id])
  variants      ProductVariant[]
  reviews       Review[]
  orderItems    OrderItem[]

  @@index([category, isPublished])
  @@map("products")
}

model ProductVariant {
  id            String     @id @default(uuid())
  productId     String
  name          String     // Contoh: "Hitam - Ukuran L", "Biji Utuh 250g"
  sku           String     @unique
  price         Decimal    @db.Decimal(12, 2)
  stock         Int        @default(0)
  weightGram    Int        @default(250)
  attributes    Json?      // e.g. { "color": "Hitam", "size": "L" }
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  product       Product    @relation(fields: [productId], references: [id], onDelete: Cascade)
  cartItems     CartItem[]
  orderItems    OrderItem[]

  @@map("product_variants")
}

model Cart {
  id            String     @id @default(uuid())
  userId        String     @unique
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  user          User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items         CartItem[]

  @@map("carts")
}

model CartItem {
  id            String         @id @default(uuid())
  cartId        String
  variantId     String
  quantity      Int            @default(1)
  isSelected    Boolean        @default(true) // Centang sebagian seperti Shopee
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  cart          Cart           @relation(fields: [cartId], references: [id], onDelete: Cascade)
  variant       ProductVariant @relation(fields: [variantId], references: [id], onDelete: Cascade)

  @@unique([cartId, variantId])
  @@map("cart_items")
}

model Order {
  id                String              @id @default(uuid())
  orderNumber       String              @unique // Contoh: ORD-20261024-8921
  userId            String
  shippingAddressId String
  status            OrderStatus         @default(PENDING_PAYMENT)
  
  subtotal          Decimal             @db.Decimal(12, 2)
  shippingFee       Decimal             @db.Decimal(12, 2)
  discountAmount    Decimal             @default(0.00) @db.Decimal(12, 2)
  serviceFee        Decimal             @default(1000.00) @db.Decimal(12, 2) // Biaya penanganan
  totalAmount       Decimal             @db.Decimal(12, 2)
  
  courierCode       String              // e.g. "sicepat_reg", "jne_reg"
  courierService    String              // e.g. "REG"
  trackingNumber    String?             // Nomor Resi yang diinput UMKM
  notes             String?
  voucherCode       String?
  
  expiresAt         DateTime            // Batas bayar Midtrans (15m - 24 jam)
  paidAt            DateTime?
  shippedAt         DateTime?
  completedAt       DateTime?
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt

  user              User                @relation(fields: [userId], references: [id])
  shippingAddress   ShippingAddress     @relation(fields: [shippingAddressId], references: [id])
  items             OrderItem[]
  payment           PaymentTransaction?

  @@index([userId, status])
  @@map("orders")
}

model OrderItem {
  id            String         @id @default(uuid())
  orderId       String
  productId     String
  variantId     String
  productName   String
  variantName   String
  price         Decimal        @db.Decimal(12, 2)
  quantity      Int
  subtotal      Decimal        @db.Decimal(12, 2)

  order         Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product       Product        @relation(fields: [productId], references: [id])
  variant       ProductVariant @relation(fields: [variantId], references: [id])

  @@map("order_items")
}

model PaymentTransaction {
  id                String            @id @default(uuid())
  orderId           String            @unique
  snapToken         String            @unique
  transactionId     String?           @unique // ID dari Midtrans API
  paymentType       PaymentType?
  transactionStatus TransactionStatus @default(PENDING)
  grossAmount       Decimal           @db.Decimal(12, 2)
  
  vaNumber          String?
  bank              String?
  billKey           String?
  billerCode        String?
  qrCodeUrl         String?
  
  signatureKey      String?
  rawCallback       Json?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  order             Order             @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@map("payment_transactions")
}

model Review {
  id            String    @id @default(uuid())
  userId        String
  productId     String
  rating        Int       @default(5)
  comment       String    @db.Text
  createdAt     DateTime  @default(now())

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  product       Product   @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@map("reviews")
}

model Voucher {
  id            String       @id @default(uuid())
  code          String       @unique
  title         String
  discountType  DiscountType
  discountValue Decimal      @db.Decimal(12, 2)
  minOrder      Decimal      @db.Decimal(12, 2)
  maxDiscount   Decimal?     @db.Decimal(12, 2)
  quota         Int          @default(100)
  expiresAt     DateTime
  isActive      Boolean      @default(true)

  @@map("vouchers")
}
`;

export const ARCHITECTURE_EXPLANATION = `
### Arsitektur Alur Transaksi & Integrasi Midtrans Snap UMKM

1. **Alur "Beli Sekarang" (Instant Checkout seperti Shopee)**:
   - Pembeli memilih varian produk (misal: Warna/Ukuran/Gilingan) dan klik **"Beli Sekarang"**.
   - Sistem membypass keranjang umum dan langsung membuat sesi *checkout instan* dengan item terpilih.
   - Mengambil estimasi ongkos kirim real-time berdasarkan berat total varian (gram) dan kota tujuan.

2. **Pembuatan Token Snap & Pengurangan Stok Atomik**:
   - Saat checkout dikonfirmasi, backend menjalankan **Prisma Interactive Transaction** (\`prisma.$transaction\`):
     a. Memverifikasi ketersediaan stok varian.
     b. Mengurangi stok: \`stock = stock - qty\` secara atomik guna mencegah *overselling / race condition*.
     c. Menyimpan record \`Order\` dengan status \`PENDING_PAYMENT\` dan batas waktu bayar (contoh: 15 menit).
     d. Memanggil Midtrans API \`POST /snap/v1/transactions\` dengan menyertakan \`order_id\`, \`gross_amount\`, dan \`customer_details\`.
     e. Menyimpan \`snapToken\` ke tabel \`PaymentTransaction\`.

3. **Penanganan Webhook Midtrans (Idempotent & Signature Verification)**:
   - Endpoint \`POST /api/payment/midtrans-webhook\` memverifikasi keaslian payload:
     \`\`\`typescript
     const calculatedSignature = crypto
       .createHash('sha512')
       .update(order_id + status_code + gross_amount + MIDTRANS_SERVER_KEY)
       .digest('hex');

     if (calculatedSignature !== signature_key) {
       return res.status(401).json({ error: 'Invalid Signature' });
     }
     \`\`\`
   - **Logika Perubahan Status Status Transisi**:
     - \`settlement\` / \`capture\` (accept) ➜ Ubah Order jadi \`PAID_PACKING\`. Penjual UMKM mendapat notifikasi untuk menyiapkan paket.
     - \`expire\` / \`cancel\` / \`deny\` ➜ Ubah Order jadi \`EXPIRED\` / \`CANCELLED\`.
     - **PENTING: Automatic Stock Restoration**: Jika pembayaran kadaluarsa atau dibatalkan, sistem secara atomik mengembalikan kuota stok ke \`ProductVariant\` (\`stock = stock + qty\`).
`;

export const SAMPLE_ROUTE_HANDLERS = `
// ========================================================
// 1. ENDPOINT: BUAT TOKEN SNAP MIDTRANS (Next.js App Router)
// File: src/app/api/checkout/snap-token/route.ts
// ========================================================
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import midtransClient from 'midtrans-client';

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, items, shippingAddressId, courierCode, courierFee, voucherCode } = body;

    // Menjalankan transaksi atomik di database
    const result = await prisma.$transaction(async (tx) => {
      let subtotal = 0;

      // 1. Cek stok dan kurangi secara atomik
      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
        });

        if (!variant || variant.stock < item.quantity) {
          throw new Error(\`Stok varian \${variant?.name || ''} tidak mencukupi!\`);
        }

        // Kurangi stok
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });

        subtotal += Number(variant.price) * item.quantity;
      }

      // 2. Kalkulasi Diskon & Total
      const discount = 0; // opsional: cek voucher
      const serviceFee = 1000;
      const totalAmount = subtotal + courierFee + serviceFee - discount;
      const orderNumber = \`ORD-\${Date.now()}-\${Math.floor(1000 + Math.random() * 9000)}\`;

      // 3. Simpan Pesanan
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          shippingAddressId,
          subtotal,
          shippingFee: courierFee,
          discountAmount: discount,
          serviceFee,
          totalAmount,
          courierCode,
          courierService: 'REG',
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 menit
          items: {
            create: items.map((it: any) => ({
              productId: it.productId,
              variantId: it.variantId,
              productName: it.productName,
              variantName: it.variantName,
              price: it.price,
              quantity: it.quantity,
              subtotal: it.price * it.quantity,
            })),
          },
        },
      });

      // 4. Request Midtrans Snap Token
      const parameter = {
        transaction_details: {
          order_id: order.id,
          gross_amount: totalAmount,
        },
        customer_details: {
          first_name: 'Pembeli UMKM',
          email: 'pembeli@example.com',
        },
      };

      const snapResponse = await snap.createTransaction(parameter);

      // 5. Simpan Payment Transaction
      await tx.paymentTransaction.create({
        data: {
          orderId: order.id,
          snapToken: snapResponse.token,
          grossAmount: totalAmount,
          transactionStatus: 'PENDING',
        },
      });

      return { order, snapToken: snapResponse.token, redirectUrl: snapResponse.redirect_url };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// ========================================================
// 2. ENDPOINT: MIDTRANS WEBHOOK CALLBACK HANDLER
// File: src/app/api/webhooks/midtrans/route.ts
// ========================================================
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { order_id, status_code, gross_amount, signature_key, transaction_status } = payload;

    // 1. Validasi SHA512 Signature
    const expectedSignature = crypto
      .createHash('sha512')
      .update(order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY)
      .digest('hex');

    if (expectedSignature !== signature_key) {
      return NextResponse.json({ message: 'Invalid Signature' }, { status: 401 });
    }

    // 2. Proses Pembaruan Status Secara Atomik
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: order_id },
        include: { items: true },
      });

      if (!order) return;

      if (transaction_status === 'settlement' || transaction_status === 'capture') {
        // Pembayaran Sukses
        await tx.order.update({
          where: { id: order_id },
          data: { status: 'PAID_PACKING', paidAt: new Date() },
        });

        await tx.paymentTransaction.update({
          where: { orderId: order_id },
          data: {
            transactionStatus: 'SETTLEMENT',
            rawCallback: payload,
          },
        });
      } else if (transaction_status === 'expire' || transaction_status === 'cancel') {
        // Pembayaran Kadaluarsa / Batal -> Kembalikan Stok!
        await tx.order.update({
          where: { id: order_id },
          data: { status: transaction_status === 'expire' ? 'EXPIRED' : 'CANCELLED' },
        });

        for (const item of order.items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
        }

        await tx.paymentTransaction.update({
          where: { orderId: order_id },
          data: {
            transactionStatus: transaction_status === 'expire' ? 'EXPIRE' : 'CANCEL',
            rawCallback: payload,
          },
        });
      }
    });

    return NextResponse.json({ status: 'OK' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;
