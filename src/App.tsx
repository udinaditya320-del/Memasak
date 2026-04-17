import React, { useState, useMemo } from 'react';
import { Coins, ShoppingCart, ChefHat, Store, Package, CheckCircle2, AlertCircle, ArrowRight, Utensils, Search } from 'lucide-react';

import { INGREDIENTS, RECIPES, Ingredient, Recipe } from './data';

// Calculate recipe stats
const getRecipeCost = (recipe: Recipe) => {
  let cost = 0;
  for (const [ingId, qty] of Object.entries(recipe.ingredients)) {
    const ing = INGREDIENTS.find(i => i.id === ingId);
    if (ing) cost += ing.price * qty;
  }
  return cost;
};

const getRecipeProfit = (recipe: Recipe) => {
  return recipe.sellPrice - getRecipeCost(recipe);
};

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function App() {
  const [money, setMoney] = useState(50000);
  const [activeTab, setActiveTab] = useState<'market' | 'kitchen' | 'shop'>('kitchen');
  
  // States to hold quantities
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [cookedItems, setCookedItems] = useState<Record<string, number>>({});

  const [searchMarket, setSearchMarket] = useState('');
  const [searchKitchen, setSearchKitchen] = useState('');
  const [searchShop, setSearchShop] = useState('');
  
  const filteredMarket = useMemo(() => INGREDIENTS.filter(i => i.name.toLowerCase().includes(searchMarket.toLowerCase())), [searchMarket]);
  const filteredKitchen = useMemo(() => RECIPES.filter(r => r.name.toLowerCase().includes(searchKitchen.toLowerCase())), [searchKitchen]);
  const filteredShop = useMemo(() => RECIPES.filter(r => r.name.toLowerCase().includes(searchShop.toLowerCase())), [searchShop]);
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const buyIngredient = (ing: Ingredient) => {
    if (money >= ing.price) {
      setMoney(prev => prev - ing.price);
      setInventory(prev => ({ ...prev, [ing.id]: (prev[ing.id] || 0) + 1 }));
      showToast(`Berhasil membeli ${ing.name}`, 'success');
    } else {
      showToast(`Uang tidak cukup untuk membeli ${ing.name}!`, 'error');
    }
  };

  const canCook = (recipe: Recipe) => {
    for (const [ingId, qty] of Object.entries(recipe.ingredients)) {
      if ((inventory[ingId] || 0) < qty) return false;
    }
    return true;
  };

  const cookRecipe = (recipe: Recipe) => {
    if (!canCook(recipe)) {
      showToast('Bahan masakan tidak lengkap!', 'error');
      return;
    }

    // Deduct ingredients
    const newInv = { ...inventory };
    for (const [ingId, qty] of Object.entries(recipe.ingredients)) {
      newInv[ingId] -= qty;
    }
    setInventory(newInv);

    // Add cooked item
    setCookedItems(prev => ({
      ...prev,
      [recipe.id]: (prev[recipe.id] || 0) + 1,
    }));

    showToast(`Berhasil memasak ${recipe.name}!`, 'success');
  };

  const sellFood = (recipe: Recipe) => {
    if ((cookedItems[recipe.id] || 0) > 0) {
      setCookedItems(prev => ({
        ...prev,
        [recipe.id]: prev[recipe.id] - 1,
      }));
      setMoney(prev => prev + recipe.sellPrice);
      showToast(`Terjual ${recipe.name} seharga ${formatMoney(recipe.sellPrice)}`, 'success');
    } else {
      showToast('Stok makanan habis!', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#34495E] font-['Helvetica_Neue',Helvetica,Arial,sans-serif] pb-24 md:pb-0 flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center px-4 py-3 rounded shadow-lg text-white font-bold text-[12px] uppercase tracking-wider animate-in fade-in slide-in-from-top-5 ${toast.type === 'success' ? 'bg-[#27AE60]' : 'bg-[#E74C3C]'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 mr-3" /> : <AlertCircle className="w-5 h-5 mr-3" />}
          {toast.message}
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#2C3E50] text-white border-b-[4px] border-[#E67E22] px-6 lg:px-10 py-5 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-3">
          <Utensils className="w-6 h-6 text-[#E67E22]" />
          <h1 className="text-[20px] lg:text-[24px] uppercase tracking-widest font-bold hidden md:block">Culinara Dashboard</h1>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right flex items-center gap-4">
            <div className="text-[10px] md:text-[12px] uppercase opacity-80 tracking-widest text-[#D5D8DC]">Saldo Dapur</div>
            <div className="font-bold text-[18px] md:text-[22px] text-[#E67E22] font-mono tracking-tight">
              {formatMoney(money)}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:grid md:grid-cols-[280px_1fr] flex-grow">
        
        {/* Navigation Sidebar */}
        <aside className="fixed bottom-0 left-0 w-full bg-[#F2F3F4] border-t border-[#D5D8DC] flex justify-around p-3 md:relative md:flex-col md:justify-start md:border-t-0 md:border-r md:p-6 md:gap-4 z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:shadow-[2px_0_10px_rgba(0,0,0,0.05)]">
          <button
            onClick={() => setActiveTab('market')}
            className={`text-left p-3 md:p-4 rounded-md transition-transform duration-100 shadow-[0_2px_4px_rgba(0,0,0,0.05)] border-l-[5px] flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-2 md:gap-3 ${
              activeTab === 'market' ? 'border-[#E67E22] bg-[#FFF9F3]' : 'border-[#D5D8DC] bg-white hover:-translate-y-0.5'
            }`}
          >
            <ShoppingCart className={`w-6 h-6 md:w-5 md:h-5 ${activeTab === 'market' ? 'text-[#E67E22]' : 'text-[#7F8C8D]'}`} />
            <div>
              <h3 className={`text-[11px] md:text-[16px] font-bold ${activeTab === 'market' ? 'text-[#34495E]' : 'text-[#7F8C8D]'}`}>Pasar Bahan</h3>
              <p className="text-[12px] text-[#7F8C8D] hidden md:block">Beli persediaan dapur</p>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('kitchen')}
            className={`text-left p-3 md:p-4 rounded-md transition-transform duration-100 shadow-[0_2px_4px_rgba(0,0,0,0.05)] border-l-[5px] flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-2 md:gap-3 ${
              activeTab === 'kitchen' ? 'border-[#E67E22] bg-[#FFF9F3]' : 'border-[#D5D8DC] bg-white hover:-translate-y-0.5'
            }`}
          >
            <ChefHat className={`w-6 h-6 md:w-5 md:h-5 ${activeTab === 'kitchen' ? 'text-[#E67E22]' : 'text-[#7F8C8D]'}`} />
            <div>
              <h3 className={`text-[11px] md:text-[16px] font-bold ${activeTab === 'kitchen' ? 'text-[#34495E]' : 'text-[#7F8C8D]'}`}>Dapur Utama</h3>
              <p className="text-[12px] text-[#7F8C8D] hidden md:block">Masak menu pelanggan</p>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`text-left p-3 md:p-4 rounded-md transition-transform duration-100 shadow-[0_2px_4px_rgba(0,0,0,0.05)] border-l-[5px] flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-2 md:gap-3 ${
              activeTab === 'shop' ? 'border-[#E67E22] bg-[#FFF9F3]' : 'border-[#D5D8DC] bg-white hover:-translate-y-0.5'
            }`}
          >
            <Store className={`w-6 h-6 md:w-5 md:h-5 ${activeTab === 'shop' ? 'text-[#E67E22]' : 'text-[#7F8C8D]'}`} />
            <div>
              <h3 className={`text-[11px] md:text-[16px] font-bold ${activeTab === 'shop' ? 'text-[#34495E]' : 'text-[#7F8C8D]'}`}>Area Kasir</h3>
              <p className="text-[12px] text-[#7F8C8D] hidden md:block">Penjualan menu siap</p>
            </div>
          </button>
          
          {/* Inventory Overview Widget (Desktop Only) */}
          <div className="hidden md:flex mt-6 bg-white p-5 rounded-md border-l-[5px] border-[#2C3E50] shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex-col">
            <h4 className="text-[12px] uppercase tracking-widest text-[#95A5A6] font-bold mb-4 flex items-center gap-2">
              <Package className="w-4 h-4" /> Gudang Cadangan
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {INGREDIENTS.map(ing => (
                <div key={ing.id} className="flex flex-col border-b border-[#F9F7F2] pb-2">
                  <span className="font-bold text-[#34495E] text-[11px] truncate flex justify-between items-center bg-[#F9F7F2] px-1 rounded">
                    {ing.name} <span>{ing.icon}</span>
                  </span>
                  <span className="font-mono text-[14px] font-bold text-[#27AE60] mt-1 text-center bg-[#FDFBF7] px-1">{inventory[ing.id] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white md:bg-transparent p-5 md:p-8 lg:p-12">
          
          <div className="max-w-[1200px] mx-auto bg-white md:rounded-lg md:shadow-[0_4px_12px_rgba(0,0,0,0.02)] md:p-8 min-h-[500px]">
            {/* TAB: PASAR */}
            {activeTab === 'market' && (
              <div className="animate-in fade-in">
                <div className="border-b-[2px] border-[#F9F7F2] pb-5 mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-2">
                  <div>
                    <div className="text-[12px] text-[#E67E22] font-bold uppercase tracking-widest mb-1">Misi Bisnis • Pemasok</div>
                    <h2 className="text-[28px] md:text-[32px] font-bold text-[#2C3E50]">Pembelian Bahan Baku</h2>
                  </div>
                  <div className="relative w-full md:max-w-[250px] mt-3 md:mt-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-[#BDC3C7]" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Cari bahan baku..." 
                      value={searchMarket}
                      onChange={(e) => setSearchMarket(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-[#D5D8DC] rounded-md leading-5 bg-white placeholder-[#95A5A6] focus:outline-none focus:ring-1 focus:ring-[#E67E22] focus:border-[#E67E22] sm:text-[13px] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {filteredMarket.map(ing => (
                    <div key={ing.id} className="bg-white rounded-md border text-center relative overflow-hidden border-l-[4px] border-[#D5D8DC] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-transform">
                      <div className="text-4xl md:text-5xl mb-4 py-2">{ing.icon}</div>
                      <h3 className="font-bold text-[#34495E] text-[14px] md:text-[15px] mb-1">{ing.name}</h3>
                      <p className="text-[#E67E22] font-mono text-[16px] font-bold mb-4">{formatMoney(ing.price)}</p>
                      
                      <div className="w-full border-t border-b border-[#F9F7F2] py-2 mb-5 flex justify-between items-center px-1">
                        <span className="text-[10px] uppercase tracking-wider text-[#7F8C8D] font-bold">Stok:</span>
                        <span className="text-[14px] font-mono font-bold text-[#2C3E50]">{inventory[ing.id] || 0}</span>
                      </div>
                      
                      <button 
                        onClick={() => buyIngredient(ing)}
                        className="w-full bg-white border border-[#2C3E50] text-[#2C3E50] py-2 px-2 rounded-[4px] font-bold uppercase text-[11px] tracking-wider hover:bg-[#2C3E50] hover:text-white transition-colors"
                      >
                        + Beli Item
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: KITCHEN */}
            {activeTab === 'kitchen' && (
              <div className="animate-in fade-in">
                <div className="border-b-[2px] border-[#F9F7F2] pb-5 mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-2">
                  <div>
                    <div className="text-[12px] text-[#E67E22] font-bold uppercase tracking-widest mb-1">Operasional • Dapur</div>
                    <h2 className="text-[28px] md:text-[32px] font-bold text-[#2C3E50]">Dapur Produksi</h2>
                  </div>
                  <div className="relative w-full md:max-w-[250px] mt-3 md:mt-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-[#BDC3C7]" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Cari resep makanan..." 
                      value={searchKitchen}
                      onChange={(e) => setSearchKitchen(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-[#D5D8DC] rounded-md leading-5 bg-white placeholder-[#95A5A6] focus:outline-none focus:ring-1 focus:ring-[#E67E22] focus:border-[#E67E22] sm:text-[13px] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
                  {filteredKitchen.map(recipe => {
                    const cost = getRecipeCost(recipe);
                    const profit = getRecipeProfit(recipe);
                    const isCookable = canCook(recipe);

                    return (
                      <div key={recipe.id} className="bg-white rounded-md border text-left border-[#D5D8DC] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col relative">
                        
                        <div className="absolute top-0 right-0 bg-[#27AE60] text-white px-3 py-1.5 rounded-bl-[8px] rounded-tr-[4px] text-[11px] font-bold tracking-wider flex items-center">
                          + {formatMoney(profit)} PROJ. LABA
                        </div>

                        <div className="flex justify-between items-start mb-5 pb-4 border-b border-[#F9F7F2]">
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-4xl">{recipe.icon}</span>
                            <div>
                              <h3 className="text-[18px] md:text-[20px] font-bold text-[#2C3E50]">{recipe.name}</h3>
                              <div className="flex gap-2">
                                <span className="text-[11px] font-mono text-[#95A5A6] font-bold mt-1 bg-[#F9F7F2] px-2 py-0.5 rounded">HPP: {formatMoney(cost)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex-grow mb-6">
                          <h4 className="text-[12px] uppercase tracking-widest text-[#95A5A6] font-bold mb-3 border-b border-[#F9F7F2] pb-2">Daftar Bahan Baku</h4>
                          <table className="w-full text-[13px] border-collapse">
                            <tbody>
                              {Object.entries(recipe.ingredients).map(([ingId, qty]) => {
                                const ing = INGREDIENTS.find(i => i.id === ingId);
                                const owned = inventory[ingId] || 0;
                                const hasEnough = owned >= qty;
                                return (
                                  <tr key={ingId}>
                                    <td className="py-2 border-b border-[#F9F7F2] text-[#34495E] flex items-center gap-2">
                                      {ing?.icon} {ing?.name}
                                    </td>
                                    <td className="py-2 border-b border-[#F9F7F2] text-right font-mono text-[12px]">
                                      <span className={`${hasEnough ? 'text-[#34495E]' : 'text-[#E74C3C] font-bold'}`}>{owned}</span> / {qty} unit
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        <div className="bg-[#FDFBF7] p-5 border-t border-[#D5D8DC] -mx-5 -mb-5 rounded-b-[4px] flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 mt-auto">
                          <div className="flex flex-col text-center sm:text-left w-full sm:w-auto">
                            <span className="text-[11px] uppercase text-[#7F8C8D] tracking-wider font-bold mb-1">Harga Jual Estimasi</span>
                            <span className="font-mono text-[18px] font-bold text-[#E67E22]">{formatMoney(recipe.sellPrice)}</span>
                          </div>
                          <button 
                            onClick={() => cookRecipe(recipe)}
                            disabled={!isCookable}
                            className={`w-full sm:w-auto py-2.5 px-6 rounded-[4px] font-bold uppercase text-[12px] tracking-wider transition-all border-none ${
                              isCookable 
                                ? 'bg-[#E67E22] text-white shadow-[0_4px_0_#D35400] active:shadow-none active:translate-y-1 hover:bg-[#D35400]' 
                                : 'bg-[#D5D8DC] text-[#7F8C8D] cursor-not-allowed'
                            }`}
                          >
                            Mulai Memasak
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: SHOP */}
            {activeTab === 'shop' && (
              <div className="animate-in fade-in">
                <div className="border-b-[2px] border-[#F9F7F2] pb-5 mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-2">
                  <div>
                    <div className="text-[12px] text-[#E67E22] font-bold uppercase tracking-widest mb-1">Manajemen • Kasir</div>
                    <h2 className="text-[28px] md:text-[32px] font-bold text-[#2C3E50]">Etalase Makanan</h2>
                  </div>
                  <div className="relative w-full md:max-w-[250px] mt-3 md:mt-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-[#BDC3C7]" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Cari di etalase..." 
                      value={searchShop}
                      onChange={(e) => setSearchShop(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-[#D5D8DC] rounded-md leading-5 bg-white placeholder-[#95A5A6] focus:outline-none focus:ring-1 focus:ring-[#E67E22] focus:border-[#E67E22] sm:text-[13px] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredShop.map(recipe => {
                    const stock = cookedItems[recipe.id] || 0;
                    const hasStock = stock > 0;

                    return (
                      <div key={recipe.id} className={`bg-white rounded-md border-l-[5px] ${hasStock ? 'border-[#E67E22]' : 'border-[#D5D8DC]'} p-5 flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative`}>
                        {hasStock && (
                          <div className="absolute -top-3 -right-3 bg-[#E67E22] text-white font-mono font-bold w-8 h-8 text-[13px] rounded-full flex items-center justify-center shadow-md border-2 border-white">
                            {stock}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#F9F7F2]">
                          <div className={`text-4xl ${hasStock ? '' : 'grayscale opacity-50'}`}>{recipe.icon}</div>
                          <div>
                            <h3 className="font-bold text-[#34495E] text-[15px]">{recipe.name}</h3>
                            <p className="text-[#27AE60] text-[10px] font-bold uppercase tracking-wider mt-1.5 bg-[#E9F7EF] inline-block px-1.5 py-0.5 rounded">Margin: {formatMoney(getRecipeProfit(recipe))}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-5 border-b border-[#F9F7F2] pb-4">
                          <span className="text-[11px] text-[#7F8C8D] uppercase font-bold tracking-wider">Nilai Jual</span>
                          <span className="text-[#2C3E50] font-mono font-bold text-[18px]">{formatMoney(recipe.sellPrice)}</span>
                        </div>

                        <button 
                          onClick={() => sellFood(recipe)}
                          disabled={!hasStock}
                          className={`w-full py-2.5 px-4 rounded-[4px] font-bold uppercase text-[12px] tracking-wider transition-all border-none ${
                            hasStock 
                              ? 'bg-[#E67E22] text-white shadow-[0_4px_0_#D35400] active:translate-y-1 active:shadow-none hover:bg-[#D35400]' 
                              : 'bg-[#F2F3F4] text-[#95A5A6] cursor-not-allowed'
                          }`}
                        >
                          Jual Ke Pelanggan
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                {/* Financial Summary */}
                <div className="mt-12">
                  <h4 className="text-[13px] uppercase font-bold tracking-widest text-[#95A5A6] mb-4">Laporan Keuangan</h4>
                  <div className="bg-[#2C3E50] text-[#F9F7F2] p-6 md:p-8 rounded-[12px] flex flex-col gap-4 shadow-[#2C3E50]/20 shadow-xl">
                    <div className="flex justify-between items-center border-b border-dashed border-[#F9F7F2]/20 pb-4">
                      <span className="text-[12px] opacity-70 uppercase tracking-widest">Aset Tunai</span>
                      <span className="font-mono text-[18px] text-[#E67E22] font-bold">{formatMoney(money)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-dashed border-[#F9F7F2]/20 pb-4">
                      <span className="text-[12px] opacity-70 uppercase tracking-widest">Total Porsi Siap Jual</span>
                      <span className="font-mono text-[18px]">{Object.values(cookedItems).reduce((a, b) => a + b, 0)} Porsi</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[12px] opacity-70 uppercase tracking-widest">Potensi Pendapatan Optimal</span>
                      <span className="bg-[#27AE60] text-white px-3 py-1.5 rounded-[4px] font-bold font-mono text-[16px]">
                        + {formatMoney(RECIPES.reduce((sum, r) => sum + ((cookedItems[r.id] || 0) * r.sellPrice), 0))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
