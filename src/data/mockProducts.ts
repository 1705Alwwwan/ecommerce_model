import { Product, Voucher } from '../types/ecommerce';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-kopi-gayo',
    sellerId: 'seller-aceh-roastery',
    sellerName: 'Kopi Tanah Rencong',
    sellerCity: 'Aceh Tengah',
    name: 'Kopi Arabika Gayo Single Origin Specialty Grade 1',
    slug: 'kopi-arabika-gayo-single-origin',
    description: 'Biji kopi pilihan dipetik tangan dari ketinggian 1.500 mdpl di dataran tinggi Takengon Gayo, Aceh. Melalui proses Full Washed dengan cupping notes cokelat hitam, karamel, aroma floral rempah tropis, dan keasaman seimbang yang lembut.',
    category: 'Kopi & Minuman',
    basePrice: 85000,
    isPublished: true,
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    reviewCount: 342,
    soldCount: 1840,
    badges: ['100% Arabika Asli', 'Petani Lokal Binaan', 'Fresh Roast'],
    variants: [
      {
        id: 'var-kopi-250-biji',
        productId: 'prod-kopi-gayo',
        name: 'Biji Utuh 250g (Whole Beans)',
        sku: 'GYO-WB-250',
        price: 85000,
        stock: 45,
        weightGram: 280,
        attributes: { grindSize: 'Biji Utuh', packaging: '250g' }
      },
      {
        id: 'var-kopi-250-halus',
        productId: 'prod-kopi-gayo',
        name: 'Bubuk Halus 250g (Espresso / Tubruk)',
        sku: 'GYO-FG-250',
        price: 85000,
        stock: 32,
        weightGram: 280,
        attributes: { grindSize: 'Halus', packaging: '250g' }
      },
      {
        id: 'var-kopi-250-sedang',
        productId: 'prod-kopi-gayo',
        name: 'Bubuk Sedang 250g (V60 / Pour Over)',
        sku: 'GYO-MG-250',
        price: 85000,
        stock: 28,
        weightGram: 280,
        attributes: { grindSize: 'Sedang', packaging: '250g' }
      },
      {
        id: 'var-kopi-500-biji',
        productId: 'prod-kopi-gayo',
        name: 'Biji Utuh 500g (Kemasan Hemat)',
        sku: 'GYO-WB-500',
        price: 155000,
        stock: 15,
        weightGram: 550,
        attributes: { grindSize: 'Biji Utuh', packaging: '500g' }
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        userName: 'Budi Santoso',
        userCity: 'Jakarta Selatan',
        rating: 5,
        date: '22 Okt 2026',
        variantName: 'Biji Utuh 250g (Whole Beans)',
        comment: 'Aromanya harum sekali waktu kemasan dibuka! Diseduh dengan V60 keluar note fruity dan manis karamelnya. Pengiriman cepat!'
      },
      {
        id: 'rev-2',
        userName: 'Rina Kusuma',
        userCity: 'Bandung',
        rating: 5,
        date: '18 Okt 2026',
        variantName: 'Bubuk Sedang 250g (V60 / Pour Over)',
        comment: 'Cocok banget untuk ngopi pagi. Kualitas roasting sangat konsisten, tidak ada biji gosong. Sukses selalu UMKM lokal!'
      }
    ]
  },
  {
    id: 'prod-batik-tulis',
    sellerId: 'seller-jogja-batik',
    sellerName: 'Batik Tulis Sekar Kencana',
    sellerCity: 'Yogyakarta',
    name: 'Kemeja Batik Tulis Asli Sutra Halus Motif Parang Barong',
    slug: 'kemeja-batik-tulis-parang-barong',
    description: 'Karya seni adiluhung perajin canting Desa Giriloyo Yogyakarta. Dibuat manual dengan lilin malam malam dingin di atas kain katun primissima super lapis furing sutra hero yang adem dan nyaman digunakan seharian pada acara formal.',
    category: 'Batik & Tenun',
    basePrice: 385000,
    isPublished: true,
    images: [
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.95,
    reviewCount: 189,
    soldCount: 512,
    badges: ['Batik Canting Manual', 'Pewarna Alami', 'Jahitan Tailor'],
    variants: [
      {
        id: 'var-batik-m-klasik',
        productId: 'prod-batik-tulis',
        name: 'Cokelat Klasik - Ukuran M (LD 104cm)',
        sku: 'BTK-PRG-M',
        price: 385000,
        stock: 8,
        weightGram: 350,
        attributes: { color: 'Cokelat Klasik', size: 'M' }
      },
      {
        id: 'var-batik-l-klasik',
        productId: 'prod-batik-tulis',
        name: 'Cokelat Klasik - Ukuran L (LD 110cm)',
        sku: 'BTK-PRG-L',
        price: 385000,
        stock: 12,
        weightGram: 360,
        attributes: { color: 'Cokelat Klasik', size: 'L' }
      },
      {
        id: 'var-batik-xl-klasik',
        productId: 'prod-batik-tulis',
        name: 'Cokelat Klasik - Ukuran XL (LD 116cm)',
        sku: 'BTK-PRG-XL',
        price: 410000,
        stock: 5,
        weightGram: 380,
        attributes: { color: 'Cokelat Klasik', size: 'XL' }
      },
      {
        id: 'var-batik-l-indigo',
        productId: 'prod-batik-tulis',
        name: 'Biru Indigo Alami - Ukuran L (LD 110cm)',
        sku: 'BTK-IND-L',
        price: 425000,
        stock: 3,
        weightGram: 360,
        attributes: { color: 'Biru Indigo', size: 'L' }
      }
    ],
    reviews: [
      {
        id: 'rev-batik-1',
        userName: 'Hendra Wijaya',
        userCity: 'Surabaya',
        rating: 5,
        date: '15 Okt 2026',
        variantName: 'Cokelat Klasik - Ukuran L (LD 110cm)',
        comment: 'Jahitan sangat rapi, motif nyambung di bagian kancing depan. Bahannya jatuh dan dingin dipakai saat rapat resmi. Bangga buatan Indonesia!'
      }
    ]
  },
  {
    id: 'prod-dompet-kulit',
    sellerId: 'seller-garut-leather',
    sellerName: 'Kriya Kulit Garut Heritage',
    sellerCity: 'Garut',
    name: 'Dompet Pria Kulit Sapi Asli Pull-Up Handstitched Vintage',
    slug: 'dompet-pria-kulit-sapi-pullup',
    description: 'Terbuat dari 100% kulit sapi nabati jenis pull-up premium asal Sukaregang Garut. Dijahit tangan dengan benang waxed polyester kokoh anti putus. Memiliki 8 slot kartu, 2 kompartemen uang tunai, dan 1 slot foto mika.',
    category: 'Kerajinan Kulit',
    basePrice: 195000,
    isPublished: true,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556774687-0e2fdd0116c0?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.88,
    reviewCount: 410,
    soldCount: 2200,
    badges: ['100% Genuine Leather', 'Jahit Tangan Tahan Lama', 'Garansi 1 Tahun'],
    variants: [
      {
        id: 'var-kulit-tan',
        productId: 'prod-dompet-kulit',
        name: 'Cokelat Muda / Tan Natural',
        sku: 'WLT-PU-TAN',
        price: 195000,
        stock: 22,
        weightGram: 200,
        attributes: { color: 'Tan Natural' }
      },
      {
        id: 'var-kulit-darkbrown',
        productId: 'prod-dompet-kulit',
        name: 'Cokelat Gelap / Havanna Brown',
        sku: 'WLT-PU-DBR',
        price: 195000,
        stock: 18,
        weightGram: 200,
        attributes: { color: 'Havanna Brown' }
      },
      {
        id: 'var-kulit-black',
        productId: 'prod-dompet-kulit',
        name: 'Hitam Doff / Midnight Black',
        sku: 'WLT-PU-BLK',
        price: 195000,
        stock: 14,
        weightGram: 200,
        attributes: { color: 'Midnight Black' }
      }
    ],
    reviews: [
      {
        id: 'rev-kulit-1',
        userName: 'Ahmad Fauzi',
        userCity: 'Semarang',
        rating: 5,
        date: '10 Okt 2026',
        variantName: 'Cokelat Muda / Tan Natural',
        comment: 'Tekstur kulitnya sangat mewah, baunya wangi kulit asli bukan sintetis. Seiring dipakai warnanya makin bagus patina-nya.'
      }
    ]
  },
  {
    id: 'prod-sambal-roa',
    sellerId: 'seller-manado-spices',
    sellerName: 'Dapur Roa Oma Manado',
    sellerCity: 'Manado',
    name: 'Sambal Ikan Roa Asap Khas Manado Asli Tanpa Pengawet 200g',
    slug: 'sambal-ikan-roa-manado',
    description: 'Diracik dari ikan roa pilihan yang diasap tradisional selama 18 jam dengan kayu khusus di pesisir Sulawesi Utara. Dipadukan dengan cabai rawit merah segar, bawang merah Brebes, dan minyak kelapa murni. Halal, higienis, dan gurih pedas nendang!',
    category: 'Kuliner & Sambal',
    basePrice: 48000,
    isPublished: true,
    images: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.92,
    reviewCount: 820,
    soldCount: 4500,
    badges: ['Ikan Roa Asap Asli', 'Tanpa MSG & Pengawet', 'Kemasan Segel Alumunium'],
    variants: [
      {
        id: 'var-sambal-pedas-sedang',
        productId: 'prod-sambal-roa',
        name: 'Level 1: Pedas Sedang (Ramah Lambung)',
        sku: 'ROA-LV1-200',
        price: 48000,
        stock: 50,
        weightGram: 240,
        attributes: { packaging: 'Jar 200g' }
      },
      {
        id: 'var-sambal-pedas-gila',
        productId: 'prod-sambal-roa',
        name: 'Level 3: Pedas Nampol (Ekstra Rawit)',
        sku: 'ROA-LV3-200',
        price: 52000,
        stock: 35,
        weightGram: 240,
        attributes: { packaging: 'Jar 200g' }
      },
      {
        id: 'var-sambal-paket-3',
        productId: 'prod-sambal-roa',
        name: 'Paket Hemat 3 Jar (Mix Level)',
        sku: 'ROA-PKT-3',
        price: 135000,
        stock: 20,
        weightGram: 720,
        attributes: { packaging: 'Paket 3 Jar' }
      }
    ],
    reviews: [
      {
        id: 'rev-sambal-1',
        userName: 'Siti Rahmawati',
        userCity: 'Depok',
        rating: 5,
        date: '20 Okt 2026',
        variantName: 'Level 3: Pedas Nampol (Ekstra Rawit)',
        comment: 'Daging roa-nya berasa banget, ikannya tidak amis sama sekali, aroma asapnya mantap! Makan nasi hangat sama kerupuk langsung nambah 2 piring.'
      }
    ]
  },
  {
    id: 'prod-madu-hutan',
    sellerId: 'seller-sumbawa-honey',
    sellerName: 'Madu Hutan Rimba Flores',
    sellerCity: 'Sumbawa Besar',
    name: 'Madu Hutan Murni Liar Odeng Raw Forest Honey 500ml',
    slug: 'madu-hutan-murni-liar-odeng',
    description: 'Dipanen langsung dari sarang lebah raksasa Apis Dorsata di pedalaman hutan Sumbawa. Madu mentah (raw honey) tanpa proses pemanasan atau pasteurisasi sehingga kandungan enzim diastase, royal jelly, dan antioksidan tetap terjaga 100%.',
    category: 'Herbal & Perawatan',
    basePrice: 120000,
    isPublished: true,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.89,
    reviewCount: 260,
    soldCount: 950,
    badges: ['Raw Pure Honey', 'Uji Lab Lolos SNI', 'Botol Kaca Ekstra Bubble'],
    variants: [
      {
        id: 'var-madu-350',
        productId: 'prod-madu-hutan',
        name: 'Botol Kaca 350ml',
        sku: 'MD-RAW-350',
        price: 120000,
        stock: 25,
        weightGram: 600,
        attributes: { packaging: '350ml' }
      },
      {
        id: 'var-madu-650',
        productId: 'prod-madu-hutan',
        name: 'Botol Kaca 650ml (Ukuran Jumbo)',
        sku: 'MD-RAW-650',
        price: 195000,
        stock: 12,
        weightGram: 1050,
        attributes: { packaging: '650ml' }
      }
    ],
    reviews: [
      {
        id: 'rev-madu-1',
        userName: 'dr. Satria Pratama',
        userCity: 'Malang',
        rating: 5,
        date: '12 Okt 2026',
        variantName: 'Botol Kaca 350ml',
        comment: 'Rasa manisnya ada sedikit sentuhan asam floral khas madu hutan liar. Sangat bagus untuk menjaga imun keluarga.'
      }
    ]
  },
  {
    id: 'prod-tas-anyaman-purun',
    sellerId: 'seller-banjar-craft',
    sellerName: 'Anyaman Purun Lestari',
    sellerCity: 'Banjarmasin',
    name: 'Tas Tote Anyaman Purun Gambut Alami Aksen Kulit Nabati',
    slug: 'tas-tote-anyaman-purun-gambut',
    description: 'Karya perajin perempuan desa gambut Kalimantan Selatan dari tanaman purun rawa yang ramah lingkungan. Dilengkapi pegangan kulit sapi nabati premium dan ritsleting dalam anti karat.',
    category: 'Kerajinan Kulit',
    basePrice: 165000,
    isPublished: true,
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.85,
    reviewCount: 94,
    soldCount: 310,
    badges: ['Eco Friendly', 'Pemberdayaan Wanita', 'Kokoh & Ringan'],
    variants: [
      {
        id: 'var-tas-medium-natural',
        productId: 'prod-tas-anyaman-purun',
        name: 'Ukuran Medium (35 x 28 x 12 cm) Natural',
        sku: 'PRN-MD-NAT',
        price: 165000,
        stock: 9,
        weightGram: 450,
        attributes: { size: 'Medium', color: 'Natural Purun' }
      },
      {
        id: 'var-tas-large-natural',
        productId: 'prod-tas-anyaman-purun',
        name: 'Ukuran Large (42 x 34 x 15 cm) Natural',
        sku: 'PRN-LG-NAT',
        price: 195000,
        stock: 4,
        weightGram: 550,
        attributes: { size: 'Large', color: 'Natural Purun' }
      }
    ],
    reviews: [
      {
        id: 'rev-tas-1',
        userName: 'Dewi Lestari',
        userCity: 'Tangerang',
        rating: 5,
        date: '08 Okt 2026',
        variantName: 'Ukuran Medium (35 x 28 x 12 cm) Natural',
        comment: 'Sangat estetik buat jalan-jalan ke pantai atau ngantor! Anyamannya padat dan tidak mudah robek.'
      }
    ]
  }
];

export const AVAILABLE_VOUCHERS: Voucher[] = [
  {
    code: 'DISKONUMKM',
    title: 'Diskon Pejuang UMKM',
    discountType: 'FIXED',
    discountValue: 25000,
    minOrder: 100000,
    description: 'Potongan Rp 25.000 untuk belanja produk UMKM lokal min. Rp 100.000'
  },
  {
    code: 'GRATISONGKIR',
    title: 'Subsidi Bebas Ongkir',
    discountType: 'FIXED',
    discountValue: 15000,
    minOrder: 50000,
    description: 'Potongan ongkos kirim hingga Rp 15.000 ke seluruh Indonesia'
  },
  {
    code: 'BANGGA20',
    title: 'Bangga Buatan RI 20%',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minOrder: 150000,
    maxDiscount: 40000,
    description: 'Diskon 20% (maksimal Rp 40.000) untuk pesanan min. Rp 150.000'
  }
];

export const INDONESIAN_CITIES = [
  { name: 'Jakarta Selatan, DKI Jakarta', baseZone: 1 },
  { name: 'Jakarta Barat, DKI Jakarta', baseZone: 1 },
  { name: 'Bandung, Jawa Barat', baseZone: 1 },
  { name: 'Surabaya, Jawa Timur', baseZone: 2 },
  { name: 'Yogyakarta, D.I. Yogyakarta', baseZone: 1 },
  { name: 'Semarang, Jawa Tengah', baseZone: 2 },
  { name: 'Medan, Sumatera Utara', baseZone: 3 },
  { name: 'Denpasar, Bali', baseZone: 2 },
  { name: 'Makassar, Sulawesi Selatan', baseZone: 3 },
  { name: 'Banjarmasin, Kalimantan Selatan', baseZone: 3 }
];
