import { ShippingCourier, MidtransWebhookPayload } from '../types/ecommerce';

export const MIDTRANS_MOCK_SERVER_KEY = 'SB-Mid-server-DemoUMKMSecretKey2026';
export const MIDTRANS_CLIENT_KEY = 'SB-Mid-client-DemoUMKMClientKey2026';

/**
 * Computes SHA-512 hexadecimal signature for Midtrans webhook verification
 * Formula: SHA512(order_id + status_code + gross_amount + ServerKey)
 */
export async function calculateMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string = MIDTRANS_MOCK_SERVER_KEY
): Promise<string> {
  const payload = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const hashBuffer = await crypto.subtle.digest('SHA-512', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates available shipping courier rates based on destination city and weight in grams
 */
export function calculateCourierRates(cityName: string, totalWeightGrams: number): ShippingCourier[] {
  const weightKg = Math.max(1, Math.ceil(totalWeightGrams / 1000));
  
  // Base rates according to geographic zones
  const isOuterIsland = cityName.includes('Medan') || cityName.includes('Makassar') || cityName.includes('Banjarmasin');
  const isNear = cityName.includes('Jakarta') || cityName.includes('Bandung') || cityName.includes('Yogyakarta');

  const baseJNE = isOuterIsland ? 32000 : isNear ? 12000 : 18000;
  const baseSiCepat = isOuterIsland ? 30000 : isNear ? 11000 : 17000;
  const baseJnT = isOuterIsland ? 31000 : isNear ? 11500 : 17500;
  const baseGoSend = isNear ? 24000 : 55000;

  return [
    {
      code: 'sicepat_reg',
      name: 'SiCepat Ekspres',
      service: 'REG (Reguler)',
      etd: isNear ? '1-2 Hari' : '2-4 Hari',
      cost: baseSiCepat * weightKg
    },
    {
      code: 'jne_reg',
      name: 'JNE',
      service: 'REG (Reguler Service)',
      etd: isNear ? '1-2 Hari' : '3-5 Hari',
      cost: baseJNE * weightKg
    },
    {
      code: 'jnt_ez',
      name: 'J&T Express',
      service: 'EZ (Standar)',
      etd: isNear ? '1-2 Hari' : '2-4 Hari',
      cost: baseJnT * weightKg
    },
    {
      code: 'gosend_instant',
      name: 'GoSend / GrabExpress',
      service: 'Instant (Sameday)',
      etd: isNear ? '3-6 Jam' : 'Tidak Tersedia',
      cost: baseGoSend
    }
  ];
}

/**
 * Generates an authentic Midtrans Snap Token and payment details
 */
export function generateSnapToken(orderId: string, grossAmount: number) {
  const timestamp = Date.now();
  const token = `SNAP-${timestamp}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const redirectUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${token}`;

  // Generate simulated Indonesian Virtual Account numbers
  const bcaVa = `70012${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  const mandiriBillKey = `${Math.floor(10000000000 + Math.random() * 90000000000)}`;
  const briVa = `88012${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  const bniVa = `98812${Math.floor(1000000000 + Math.random() * 9000000000)}`;

  return {
    token,
    redirectUrl,
    grossAmount,
    vaNumbers: {
      bca: bcaVa,
      mandiri: { billerCode: '70012', billKey: mandiriBillKey },
      bri: briVa,
      bni: bniVa
    }
  };
}

/**
 * Generates sample Midtrans webhook callback payload for simulation
 */
export async function createMockWebhookPayload(
  orderId: string,
  grossAmount: number,
  status: 'settlement' | 'expire' | 'cancel' | 'pending',
  paymentType: 'qris' | 'bank_transfer' | 'gopay' | 'shopeepay' = 'qris'
): Promise<MidtransWebhookPayload> {
  const statusCode = status === 'settlement' ? '200' : status === 'pending' ? '201' : '202';
  const grossAmountStr = `${grossAmount}.00`;
  const signatureKey = await calculateMidtransSignature(orderId, statusCode, grossAmountStr);

  return {
    order_id: orderId,
    transaction_id: `trx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    transaction_status: status,
    status_code: statusCode,
    gross_amount: grossAmountStr,
    payment_type: paymentType,
    signature_key: signatureKey,
    fraud_status: 'accept',
    transaction_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    settlement_time: status === 'settlement' ? new Date().toISOString().replace('T', ' ').substring(0, 19) : undefined,
    bank: paymentType === 'bank_transfer' ? 'bca' : undefined,
    va_numbers: paymentType === 'bank_transfer' ? [{ bank: 'bca', va_number: `70012${Date.now().toString().slice(-8)}` }] : undefined
  };
}

/**
 * Format IDR currency
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}
