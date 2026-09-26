import React, { useState, useMemo } from 'react';
import { MENU_CATEGORIES, MenuItem } from '../data/menuData';
import { useCafe } from '../context/CafeContext';
import { Search, Plus, Sparkles } from 'lucide-react';

interface MenuSectionProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onQuickAdd: (item: MenuItem) => void;
  onCustomizeItem: (item: MenuItem) => void;
  cartItemCounts: Record<string, number>;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  onQuickAdd,
  onCustomizeItem,
  cartItemCounts,
}) => {
  const { menuItems, toppings } = useCafe();
  const [searchQuery, setSearchQuery] = useState('');
  const [budgetFilter, setBudgetFilter] = useState<'all' | 'under300' | 'under500' | 'popular'>('all');

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && selectedCategory !== 'deals' && item.category !== selectedCategory) {
        return false;
      }
      // Budget filter
      if (budgetFilter === 'under300' && item.price > 300) return false;
      if (budgetFilter === 'under500' && item.price > 500) return false;
      if (budgetFilter === 'popular' && !item.isPopular) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [menuItems, selectedCategory, budgetFilter, searchQuery]);

  // Group items by category if 'all' is selected
  const categoriesToShow = useMemo(() => {
    if (selectedCategory === 'all') {
      return ['coffee', 'milkshakes', 'boba', 'refreshers', 'bites', 'sweets'] as const;
    }
    if (selectedCategory === 'deals') {
      return [] as const;
    }
    return [selectedCategory] as const;
  }, [selectedCategory]);

  const categoryTitles: Record<string, { title: string; subtitle: string }> = {
    coffee: { title: '🧊 Iced Coffee', subtitle: 'Rich espresso poured over cold milk & crystal ice' },
    milkshakes: { title: '🥤 Milkshakes', subtitle: 'Handcrafted thick shakes with premium creams & cookies' },
    boba: { title: '🧋 Bubble Tea', subtitle: 'Artisanal milk teas with chewy tapioca & fruity jellies' },
    refreshers: { title: '🍓 Refreshers', subtitle: 'Sparkling lemonades & Ceylon iced fruit infusions' },
    bites: { title: '🥪 Bites', subtitle: 'Warm toasted artisan sandwiches & golden loaded fries' },
    sweets: { title: '🍰 Sweets', subtitle: 'Decadent bakery brownies, fresh cakes & cookies' },
  };

  return (
    <section id="menu" className="py-14 sm:py-20 bg-[#121110]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 mb-1">
            Handcrafted Menu
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#FAF7F2] tracking-tight">
            Curated sips & oven-fresh bites
          </h2>
          <p className="text-stone-400 text-sm mt-2">
            Specialty coffees, authentic Ceylon milk teas, and fresh artisan toasties. Customize sugar, ice, and add-ons to your taste.
          </p>
        </div>

        {/* Filter Bar: Segmented category buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
          {MENU_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                    : 'bg-[#1C1A18] text-stone-400 hover:bg-[#25221E] hover:text-white border border-[#2D2A26]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Controls row: Search + Quick filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-[#23201D]">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search iced coffees, boba, shakes, toasties..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#191715] border border-[#2C2925] rounded-lg text-xs sm:text-sm text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-500/60 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Budget / Quick Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#1A1816] p-1 rounded-lg border border-[#2A2825] self-start sm:self-auto overflow-x-auto">
            <button
              onClick={() => setBudgetFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                budgetFilter === 'all' ? 'bg-stone-800 text-white shadow-xs font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              All Prices
            </button>
            <button
              onClick={() => setBudgetFilter('under300')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                budgetFilter === 'under300' ? 'bg-stone-800 text-white shadow-xs font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              ≤ Rs. 300
            </button>
            <button
              onClick={() => setBudgetFilter('under500')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                budgetFilter === 'under500' ? 'bg-stone-800 text-white shadow-xs font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              ≤ Rs. 500
            </button>
            <button
              onClick={() => setBudgetFilter('popular')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                budgetFilter === 'popular' ? 'bg-amber-400 text-stone-950 font-bold shadow-xs' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              ★ House Favorites
            </button>
          </div>

        </div>

        {/* Extra Toppings Spotlight if Boba or All is selected */}
        {(selectedCategory === 'all' || selectedCategory === 'boba') && (
          <div className="mb-10 bg-[#1A1815] border border-amber-900/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
                <span>🧋 Boba Customization</span>
                <span aria-hidden="true" className="text-amber-700">·</span>
                <span className="text-amber-300">Extra Toppings</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-300">
                Enhance your bubble tea or iced drinks with chewy warm toppings:
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {toppings.map((top) => (
                <span
                  key={top.id}
                  className="text-xs bg-[#24211D] border border-amber-800/50 px-3 py-1.5 rounded-lg text-amber-200 font-medium"
                >
                  {top.name} <span className="text-amber-400 font-mono">(+Rs. {top.price})</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Empty Search Result State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-[#181614] rounded-2xl border border-[#282522] p-6">
            <p className="text-base font-medium text-stone-200">No menu items matched your filter.</p>
            <p className="text-xs text-stone-400 mt-1">Try resetting the search bar or choosing another category.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setBudgetFilter('all');
                onSelectCategory('all');
              }}
              className="mt-4 px-4 py-2 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Menu Items Rendered By Categories */}
        <div className="space-y-12">
          {categoriesToShow.map((catKey) => {
            const catItems = filteredItems.filter((i) => i.category === catKey);
            if (catItems.length === 0) return null;
            const meta = categoryTitles[catKey] || { title: catKey, subtitle: '' };

            return (
              <div key={catKey} className="space-y-4">
                {/* Category Header */}
                <div className="border-b border-[#24211E] pb-3 flex items-baseline justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif-display text-white">
                      {meta.title}
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">{meta.subtitle}</p>
                  </div>
                  <span className="text-xs text-stone-500 font-medium tabular-nums font-mono">
                    {catItems.length} items
                  </span>
                </div>

                {/* Grid of items */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {catItems.map((item) => {
                    const isAvailable = (item as any).isAvailable !== false;
                    const countInCart = cartItemCounts[item.id] || 0;
                    const canCustomize = item.options?.hasToppings || item.options?.hasSweetness || item.options?.hasIce;

                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                          !isAvailable
                            ? 'opacity-55 border-stone-800 bg-[#161513]'
                            : 'bg-[#191715] hover:bg-[#1E1C19] border-[#2A2723] hover:border-amber-500/40 shadow-lg hover:-translate-y-0.5'
                        }`}
                      >
                        <div>
                          {/* Item Kicker and Popular indicator (Clean unboxed text) */}
                          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                            <span className="capitalize text-stone-400">{item.category}</span>
                            {!isAvailable ? (
                              <span className="text-rose-400 font-medium text-[11px]">
                                Sold Out Today
                              </span>
                            ) : item.isPopular ? (
                              <span className="text-amber-400 font-medium flex items-center gap-1 text-[11px]">
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                House Favorite
                              </span>
                            ) : null}
                          </div>

                          {/* Item Title & Price */}
                          <div className="flex items-start justify-between gap-3 mb-1.5">
                            <h4 className="text-base font-semibold text-white">
                              {item.name}
                            </h4>
                            <span className="text-base font-bold text-amber-300 font-mono tabular-nums shrink-0">
                              Rs. {item.price}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-stone-400 leading-relaxed mb-4 line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-3 border-t border-[#262320] flex items-center justify-between gap-2">
                          {!isAvailable ? (
                            <span className="text-xs text-stone-500 italic">Unavailable</span>
                          ) : canCustomize ? (
                            <button
                              onClick={() => onCustomizeItem(item)}
                              className="text-xs text-amber-300/90 hover:text-amber-200 font-medium underline underline-offset-2 cursor-pointer"
                            >
                              Customize
                            </button>
                          ) : (
                            <span className="text-[11px] text-stone-500">Fresh made</span>
                          )}

                          <div className="flex items-center gap-1.5">
                            {!isAvailable ? (
                              <button
                                disabled
                                className="px-3 py-1.5 text-xs font-semibold text-stone-500 bg-stone-900 rounded-lg cursor-not-allowed border border-stone-800"
                              >
                                Sold Out
                              </button>
                            ) : canCustomize ? (
                              <button
                                onClick={() => onCustomizeItem(item)}
                                className="px-3 py-1.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-sm active:scale-95"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add</span>
                                {countInCart > 0 && (
                                  <span className="ml-1 px-1 bg-stone-900 text-amber-300 rounded text-[10px] tabular-nums font-bold">
                                    {countInCart}
                                  </span>
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={() => onQuickAdd(item)}
                                className="px-3 py-1.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1 active:scale-95 shadow-sm"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add</span>
                                {countInCart > 0 && (
                                  <span className="ml-1 px-1 bg-stone-900 text-amber-300 rounded text-[10px] tabular-nums font-bold">
                                    {countInCart}
                                  </span>
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

