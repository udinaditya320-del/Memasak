export interface Ingredient {
  id: string;
  name: string;
  price: number;
  icon: string;
}

export interface Recipe {
  id: string;
  name: string;
  icon: string;
  ingredients: Record<string, number>;
  sellPrice: number;
}

export const INGREDIENTS: Ingredient[] = [
  { id: 'nasi', name: 'Nasi Putih', price: 3000, icon: '🍚' },
  { id: 'telur', name: 'Telur Ayam', price: 2000, icon: '🥚' },
  { id: 'ayam', name: 'Daging Ayam', price: 5000, icon: '🍗' },
  { id: 'bawang', name: 'Bumbu & Bawang', price: 1000, icon: '🧅' },
  { id: 'mie', name: 'Mie Kuning', price: 3000, icon: '🍜' },
  { id: 'kecap', name: 'Kecap Manis', price: 1000, icon: '🧴' },
  { id: 'sayur', name: 'Sayuran Segar', price: 2000, icon: '🥬' },
  { id: 'sapi', name: 'Daging Sapi', price: 10000, icon: '🥩' },
  { id: 'cabe', name: 'Cabai Spesial', price: 1500, icon: '🌶️' },
  { id: 'tahu', name: 'Tahu Segar', price: 1000, icon: '🟨' },
  { id: 'tempe', name: 'Tempe Kedelai', price: 1000, icon: '🟫' },
  { id: 'udang', name: 'Udang Laut', price: 8000, icon: '🦐' },
  { id: 'cumi', name: 'Cumi-cumi', price: 7000, icon: '🦑' },
  { id: 'ikan', name: 'Ikan Segar', price: 6000, icon: '🐟' },
  { id: 'kacang', name: 'Kacang Tanah', price: 2000, icon: '🥜' },
  { id: 'tepung', name: 'Tepung Terigu', price: 1500, icon: '🥡' },
  { id: 'air', name: 'Air Mineral', price: 1000, icon: '💧' },
  { id: 'es', name: 'Es Batu', price: 500, icon: '🧊' },
  { id: 'gula', name: 'Gula Pasir', price: 1000, icon: '🧂' },
  { id: 'teh', name: 'Daun Teh', price: 1500, icon: '🍃' },
  { id: 'kopi', name: 'Biji Kopi', price: 3000, icon: '🫘' },
  { id: 'susu', name: 'Susu Segar', price: 4000, icon: '🥛' },
  { id: 'jeruk', name: 'Jeruk Peras', price: 2000, icon: '🍊' },
  { id: 'melon', name: 'Buah Melon', price: 3000, icon: '🍈' },
  { id: 'alpukat', name: 'Buah Alpukat', price: 4000, icon: '🥑' },
  { id: 'minyak', name: 'Minyak Goreng', price: 2000, icon: '🛢️' },
  { id: 'roti', name: 'Roti Tawar', price: 2000, icon: '🍞' },
  { id: 'keju', name: 'Keju Cheddar', price: 3000, icon: '🧀' },
  { id: 'cokelat', name: 'Cokelat Blok', price: 3000, icon: '🍫' },
  { id: 'pisang', name: 'Pisang Manis', price: 2000, icon: '🍌' },
];

export const RECIPES: Recipe[] = [];

// Helper structure for programmatic generation
const R = (id: string, name: string, icon: string, ingredients: Record<string, number>, sellPrice: number): Recipe => ({ id, name, icon, ingredients, sellPrice });

const toppings = [
  { id: 'biasa', name: 'Biasa', priceMode: 1, ing: {} },
  { id: 'telur', name: 'Telur', priceMode: 1.5, ing: { telur: 1 } },
  { id: 'ayam', name: 'Ayam', priceMode: 2, ing: { ayam: 1 } },
  { id: 'sapi', name: 'Sapi', priceMode: 3, ing: { sapi: 1 } },
  { id: 'seafood', name: 'Seafood', priceMode: 3, ing: { udang: 1, cumi: 1 } },
  { id: 'spesial', name: 'Spesial (Komplit)', priceMode: 3.5, ing: { telur: 1, ayam: 1, sapi: 1 } },
  { id: 'gila', name: 'Gila (Pedas Komplit)', priceMode: 4, ing: { telur: 1, ayam: 1, cabe: 2 } },
  { id: 'ikan', name: 'Ikan Laut', priceMode: 2.5, ing: { ikan: 1 } },
  { id: 'kampung', name: 'Khas Kampung', priceMode: 2, ing: { bawang: 1, sayur: 1 } },
  { id: 'daging', name: 'Spesial Daging', priceMode: 2.2, ing: { sapi: 1 } },
];

// 1. NASI GORENG (30 variants)
toppings.forEach(t => {
  ['Biasa', 'Pedas', 'Ekstra Pedas'].forEach((level, i) => {
    RECIPES.push(R(`nasgor_${t.id}_${i}`, `Nasi Goreng ${t.name} ${level}`, level === 'Biasa' ? '🍛' : '🌶️', { nasi: 1, bawang: 1, minyak: 1, kecap: 1, ...(level !== 'Biasa' ? { cabe: i } : {}), ...t.ing }, 14000 + (t.priceMode * 4000) + (i * 2000)));
  });
});

// 2. MIE GORENG (30 variants)
toppings.forEach(t => {
  ['Biasa', 'Pedas', 'Gila'].forEach((level, i) => {
    RECIPES.push(R(`miegor_${t.id}_${i}`, `Mie Goreng ${t.name} ${level}`, level === 'Biasa' ? '🍝' : '🍜', { mie: 1, bawang: 1, minyak: 1, kecap: 1, sayur: 1, ...(level !== 'Biasa' ? { cabe: i+1 } : {}), ...t.ing }, 13000 + (t.priceMode * 4000) + (i * 2000)));
  });
});

// 3. MIE REBUS (20 variants)
toppings.forEach(t => {
  ['Biasa', 'Pedas'].forEach((level, i) => {
    RECIPES.push(R(`mierebus_${t.id}_${i}`, `Mie Kuah ${t.name} ${level}`, '🍜', { mie: 1, bawang: 1, air: 1, sayur: 1, ...(i === 1 ? { cabe: 1 } : {}), ...t.ing }, 13000 + (t.priceMode * 4000) + (i * 2000)));
  });
});

// 4. PAKET NASI (15 variants)
const lauks = [
  { id: 'ayam', name: 'Ayam', ing: { ayam: 1 } },
  { id: 'sapi', name: 'Sapi', ing: { sapi: 1 } },
  { id: 'ikan', name: 'Ikan', ing: { ikan: 1 } },
  { id: 'udang', name: 'Udang', ing: { udang: 2 } },
  { id: 'cumi', name: 'Cumi', ing: { cumi: 2 } },
];
lauks.forEach(l => {
  RECIPES.push(R(`nasi_${l.id}_goreng`, `Nasi ${l.name} Goreng`, '🍱', { nasi: 1, minyak: 1, bawang: 1, ...l.ing }, 18000));
  RECIPES.push(R(`nasi_${l.id}_bakar`, `Nasi ${l.name} Bakar Madu`, '🍱', { nasi: 1, kecap: 1, bawang: 1, ...l.ing }, 19000));
  RECIPES.push(R(`nasi_${l.id}_sambal`, `Nasi ${l.name} Sambal Pedas`, '🌶️', { nasi: 1, cabe: 2, bawang: 1, minyak: 1, ...l.ing }, 20000));
});

// 5. MINUMAN STANDAR (20 variants)
const baseDrink = [
  { id: 'teh', name: 'Teh', icon: '🍵', ing: { teh: 1 } },
  { id: 'kopi', name: 'Kopi', icon: '☕', ing: { kopi: 1 } },
  { id: 'jeruk', name: 'Jeruk', icon: '🍊', ing: { jeruk: 1 } },
  { id: 'susu', name: 'Susu', icon: '🥛', ing: { susu: 1 } },
  { id: 'sirup', name: 'Air Gula Manis', icon: '🍹', ing: { gula: 2 } },
];
baseDrink.forEach(d => {
  RECIPES.push(R(`panas_tawar_${d.id}`, `${d.name} Tawar Panas`, d.icon, { air: 1, ...d.ing }, 5000));
  RECIPES.push(R(`panas_manis_${d.id}`, `${d.name} Manis Panas`, d.icon, { air: 1, gula: 1, ...d.ing }, 7000));
  RECIPES.push(R(`es_tawar_${d.id}`, `Es ${d.name} Tawar`, '🧊', { air: 1, es: 1, ...d.ing }, 6000));
  RECIPES.push(R(`es_manis_${d.id}`, `Es ${d.name} Manis`, '🥤', { air: 1, es: 1, gula: 1, ...d.ing }, 8000));
});

// 6. JUS BUAH (10 variants)
const fruits = [
  { id: 'jeruk', name: 'Jeruk', icon: '🍊', ing: { jeruk: 2 } },
  { id: 'melon', name: 'Melon', icon: '🍈', ing: { melon: 1 } },
  { id: 'alpukat', name: 'Alpukat', icon: '🥑', ing: { alpukat: 1 } },
  { id: 'pisang', name: 'Pisang', icon: '🍌', ing: { pisang: 1 } },
  { id: 'mix', name: 'Buah Campur', icon: '🍹', ing: { melon: 1, alpukat: 1, jeruk: 1 } }
];
fruits.forEach(f => {
  RECIPES.push(R(`jus_${f.id}`, `Jus ${f.name} Asli`, f.icon, { air: 1, es: 1, gula: 1, ...f.ing }, 15000));
  RECIPES.push(R(`jus_${f.id}_susu`, `Jus ${f.name} Susu`, f.icon, { air: 1, es: 1, gula: 1, susu: 1, ...f.ing }, 18000));
});

// 7. ROTI BAKAR (12 variants)
const rotiTop = [
  { id: 'cokelat', name: 'Cokelat', icon: '🍫', ing: { cokelat: 1 } },
  { id: 'keju', name: 'Keju', icon: '🧀', ing: { keju: 1 } },
  { id: 'pisang', name: 'Pisang', icon: '🍌', ing: { pisang: 1 } },
  { id: 'cokelat_keju', name: 'Cokelat Keju', icon: '🥪', ing: { cokelat: 1, keju: 1 } },
  { id: 'pisang_cokelat', name: 'Pisang Cokelat', icon: '🥪', ing: { pisang: 1, cokelat: 1 } },
  { id: 'komplit', name: 'Super Komplit', icon: '🥪', ing: { pisang: 1, cokelat: 1, keju: 1, susu: 1 } },
];
rotiTop.forEach(r => {
  RECIPES.push(R(`roti_bakar_${r.id}`, `Roti Bakar ${r.name}`, r.icon, { roti: 2, minyak: 1, ...r.ing }, 12000 + (Object.keys(r.ing).length * 4000)));
  RECIPES.push(R(`roti_kukus_${r.id}`, `Roti Kukus ${r.name}`, '🍞', { roti: 2, susu: 1, air: 1, ...r.ing }, 14000 + (Object.keys(r.ing).length * 4000)));
});

// 8. SOUP / KUAH LAINNYA (15 variants)
const soups = [
  { id: 'soto_ayam', name: 'Soto Ayam', icon: '🥣', ing: { ayam: 1, bawang: 2, air: 2, sayur: 1 } },
  { id: 'soto_sapi', name: 'Soto Daging Sapi', icon: '🥣', ing: { sapi: 1, bawang: 2, air: 2, sayur: 1 } },
  { id: 'sop_sayur', name: 'Sayur Sop Bening', icon: '🍲', ing: { sayur: 2, bawang: 1, air: 2 } },
  { id: 'sop_ikan', name: 'Sop Ikan Laut', icon: '🍲', ing: { ikan: 1, sayur: 1, bawang: 2, air: 2 } },
  { id: 'tomyam', name: 'Mie Seafood Tomyam', icon: '🍜', ing: { udang: 1, cumi: 1, cabe: 2, mie: 1, bawang: 2, air: 2 } },
];
soups.forEach(s => {
  RECIPES.push(R(`kuah_${s.id}`, s.name, s.icon, s.ing, 24000));
  RECIPES.push(R(`kuah_${s.id}_nasi`, `${s.name} + Nasi`, s.icon, { nasi: 1, ...s.ing }, 28000));
  RECIPES.push(R(`kuah_${s.id}_pedas`, `${s.name} Extra Pedas`, '🌶️', { cabe: 3, ...s.ing }, 27000));
});

// 9. GORENGAN / CAMILAN (14 variants)
const snacks = [
  { id: 'tahu_crispy', name: 'Tahu Goreng Crispy', icon: '🟨', ing: { tahu: 2, tepung: 1, minyak: 1, bawang: 1 } },
  { id: 'tempe_mendoan', name: 'Tempe Mendoan', icon: '🟫', ing: { tempe: 2, tepung: 1, minyak: 1, bawang: 1, sayur: 1 } },
  { id: 'bakwan', name: 'Bakwan Sayur', icon: '🧆', ing: { sayur: 2, tepung: 1, minyak: 1, bawang: 1 } },
  { id: 'pisang_goreng', name: 'Pisang Manis Tepung', icon: '🍌', ing: { pisang: 2, tepung: 1, minyak: 1, gula: 1 } },
  { id: 'cumi_ring', name: 'Cumi Goreng Tepung', icon: '🦑', ing: { cumi: 2, tepung: 2, minyak: 1, bawang: 1 } },
  { id: 'udang_rambutan', name: 'Udang Rambutan', icon: '🦐', ing: { udang: 2, mie: 1, tepung: 1, minyak: 1 } },
  { id: 'kacang_bawang', name: 'Kacang Bawang', icon: '🥜', ing: { kacang: 2, bawang: 2, minyak: 1 } },
];
snacks.forEach(s => {
  RECIPES.push(R(`snack_${s.id}`, s.name, s.icon, s.ing, 12000 + (Object.keys(s.ing).length * 2000)));
  RECIPES.push(R(`snack_${s.id}_keju`, `${s.name} Tabur Keju`, '🧀', { keju: 1, ...s.ing }, 16000 + (Object.keys(s.ing).length * 2000)));
});

// 10. ANEKA TELUR DADAR / OMELETTE (12 variants)
const telurTop = [
  { id: 'polos', name: 'Polos Sederhana', ing: {} },
  { id: 'sayur', name: 'Isi Sayuran', ing: { sayur: 1 } },
  { id: 'keju', name: 'Isi Mozzarella', ing: { keju: 1 } },
  { id: 'daging', name: 'Isi Daging Sapi', ing: { sapi: 1 } },
  { id: 'seafood', name: 'Isi Seafood', ing: { udang: 1 } },
  { id: 'komplit', name: 'Isi Komplit', ing: { udang: 1, sapi: 1, sayur: 1, keju: 1 } },
];
telurTop.forEach(t => {
  RECIPES.push(R(`telur_${t.id}`, `Telur Dadar ${t.name}`, '🍳', { telur: 2, minyak: 1, ...t.ing }, 12000 + (Object.keys(t.ing).length * 5000)));
  RECIPES.push(R(`telur_${t.id}_nasi`, `Nasi Telur Dadar ${t.name}`, '🍛', { nasi: 1, telur: 2, minyak: 1, ...t.ing }, 16000 + (Object.keys(t.ing).length * 5000)));
});

// 11. BUMBU BALADO / PADANG (21 variants)
const baladoLauk = [
  { id: 'telur', name: 'Telur', icon: '🥚', ing: { telur: 2 } },
  { id: 'ayam', name: 'Ayam', icon: '🍗', ing: { ayam: 1 } },
  { id: 'sapi', name: 'Sapi', icon: '🥩', ing: { sapi: 1 } },
  { id: 'ikan', name: 'Ikan', icon: '🐟', ing: { ikan: 1 } },
  { id: 'udang', name: 'Udang', icon: '🦐', ing: { udang: 2 } },
  { id: 'cumi', name: 'Cumi', icon: '🦑', ing: { cumi: 2 } },
  { id: 'tahu_tempe', name: 'Tahu Tempe', icon: '🟫', ing: { tahu: 1, tempe: 1 } },
];
baladoLauk.forEach(l => {
  RECIPES.push(R(`balado_${l.id}`, `${l.name} Bumbu Balado`, l.icon, { cabe: 2, bawang: 2, minyak: 1, ...l.ing }, 22000));
  RECIPES.push(R(`rica_${l.id}`, `${l.name} Rica-rica`, l.icon, { cabe: 3, bawang: 1, minyak: 1, kecap: 1, ...l.ing }, 24000));
  RECIPES.push(R(`saustiram_${l.id}`, `${l.name} Saus Tiram`, l.icon, { bawang: 2, kecap: 2, minyak: 1, ...l.ing }, 25000));
});

// 12. SULTAN MENU (1 variant)
RECIPES.push(R('sultan_platter', 'Sultan Seafood & Meat Platter', '👑', {
  sapi: 2, ayam: 2, udang: 2, cumi: 2, ikan: 2, bawang: 3, kecap: 3, cabe: 3, minyak: 2
}, 300000));
