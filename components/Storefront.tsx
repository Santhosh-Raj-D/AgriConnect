'use client';

import { useState, useTransition } from 'react';
import { placeOrder } from '@/lib/actions/buyerActions';
import { logout } from '@/lib/actions/authActions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  unit: string;
  category: 'VEGETABLES' | 'FRUITS' | 'DAIRY';
  emoji: string;
  farmer: {
    name: string;
    farmName: string | null;
    address: string | null;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface StorefrontProps {
  products: Product[];
  user: User;
}

export default function Storefront({ products, user }: StorefrontProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'VEGETABLES' | 'FRUITS' | 'DAIRY'>('ALL');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

  // Cart logic
  const addToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const updateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      const updated = { ...cart };
      delete updated[productId];
      setCart(updated);
    } else {
      setCart((prev) => ({
        ...prev,
        [productId]: qty,
      }));
    }
  };

  const clearCart = () => setCart({});

  const cartItems = Object.entries(cart).map(([id, quantity]) => {
    const product = products.find((p) => p.id === id)!;
    return { product, quantity };
  });

  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    setMessage(null);
    const checkoutPayload = cartItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    startTransition(async () => {
      const res = await placeOrder(checkoutPayload);
      if (res.success) {
        setMessage({ success: true, text: 'Order placed successfully! Redirecting...' });
        clearCart();
        setTimeout(() => {
          router.push('/buyer/dashboard');
        }, 1500);
      } else {
        setMessage({ success: false, text: res.error || 'Checkout failed.' });
      }
    });
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
    router.refresh();
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'ALL' || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.farmer.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.farmer.address && p.farmer.address.toLowerCase().includes(search.toLowerCase())) ||
      (p.farmer.farmName && p.farmer.farmName.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-forest text-[#F2EDE4] font-sans flex flex-col">
      {/* Store Header */}
      <header className="sticky top-0 bg-forest/90 backdrop-filter blur-md border-b border-solid border-fern/25 z-40 px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="nav-logo text-lg sm:text-xl font-serif text-cream flex items-center gap-2">
          <span className="logo-dot" /> Agriconnect
        </Link>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="text-xs text-mist hidden sm:inline">
            Logged in as <strong className="text-cream">{user.name}</strong> ({user.role.toLowerCase()})
          </span>
          {user.role === 'BUYER' && (
            <Link href="/buyer/dashboard" className="text-xs text-gold hover:underline font-mono uppercase tracking-wider">
              Purchases
            </Link>
          )}
          {user.role === 'FARMER' && (
            <Link href="/farmer/dashboard" className="text-xs text-gold hover:underline font-mono uppercase tracking-wider">
              Dashboard
            </Link>
          )}
          {user.role === 'ADMIN' && (
            <Link href="/admin/dashboard" className="text-xs text-gold hover:underline font-mono uppercase tracking-wider">
              Admin Suite
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="text-xs border border-solid border-fern/60 text-mist hover:text-cream px-3 py-1.5 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Marketplace Grid */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="font-serif text-3xl text-cream">Direct Marketplace</h1>
              <p className="text-sm text-mist mt-1">Buy straight from the fields, support local growers.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search produce, farmer, or region..."
                className="bg-canopy border border-solid border-fern/40 focus:border-gold outline-none text-xs px-4 py-2.5 text-cream w-full sm:w-[240px]"
              />

              <div className="flex flex-wrap border border-solid border-fern/40">
                {(['ALL', 'VEGETABLES', 'FRUITS', 'DAIRY'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[10px] tracking-wider uppercase font-mono px-3 py-2.5 transition-colors ${
                      activeCategory === cat
                        ? 'bg-fern text-cream'
                        : 'bg-transparent text-mist hover:text-cream'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-fern/20 text-mist rounded-sm">
              <p className="text-lg font-serif">No products match your filters.</p>
              <p className="text-xs mt-1">Try resetting your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-canopy border border-solid border-fern/20 p-6 rounded-sm flex flex-col justify-between hover:border-gold/40 transition-colors group relative"
                >
                  <span className="text-4xl mb-4 block group-hover:scale-110 group-hover:rotate-[-5deg] transition-transform w-fit">
                    {p.emoji}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg text-cream mb-1">{p.name}</h3>
                    <p className="text-xs text-mist line-clamp-2 mb-3 min-h-[2rem]">
                      {p.description || 'No description provided.'}
                    </p>
                    <div className="border-t border-solid border-fern/10 pt-3 mb-4">
                      <div className="text-xs text-gold font-medium">
                        {p.farmer.farmName || p.farmer.name}
                      </div>
                      <div className="text-[10px] text-mist font-mono uppercase tracking-widest mt-0.5">
                        📍 {p.farmer.address || 'India'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-mono text-base text-gold">
                      ₹{p.price} <span className="text-[10px] font-sans text-mist">/ {p.unit}</span>
                    </span>
                    {user.role === 'BUYER' && (
                      <button
                        onClick={() => addToCart(p.id)}
                        className="bg-fern hover:bg-gold text-cream hover:text-forest px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all"
                      >
                        + Add
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Shopping Cart Drawer */}
        {user.role === 'BUYER' && (
          <aside className="w-full lg:w-[350px] bg-canopy border-t lg:border-t-0 lg:border-l border-solid border-fern/25 p-4 sm:p-6 flex flex-col justify-between lg:sticky lg:top-[65px] lg:h-[calc(100vh-65px)] lg:overflow-y-auto">
            <div>
              <h2 className="font-serif text-xl text-cream mb-6 flex items-center justify-between">
                <span>Basket</span>
                <span className="font-mono text-xs text-gold bg-gold/10 px-2.5 py-1 rounded-full">
                  {cartItems.length} items
                </span>
              </h2>

              {message && (
                <div
                  className={`border border-solid p-3 rounded-sm mb-6 text-xs font-sans ${
                    message.success
                      ? 'bg-green-900/40 border-green-700/60 text-green-200'
                      : 'bg-red-900/40 border-red-700/60 text-red-200'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {cartItems.length === 0 ? (
                <div className="text-center py-20 text-mist border border-dashed border-fern/15 rounded-sm">
                  <span className="text-3xl">🛒</span>
                  <p className="text-xs font-mono uppercase tracking-wider mt-3">Your basket is empty</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[calc(100vh-360px)] overflow-y-auto pr-1">
                  {cartItems.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between border-b border-solid border-fern/10 pb-3"
                    >
                      <div>
                        <div className="text-sm font-medium flex items-center gap-1.5 text-cream">
                          <span>{product.emoji}</span>
                          <span>{product.name}</span>
                        </div>
                        <div className="text-[10px] text-mist font-mono mt-0.5">
                          ₹{product.price} / {product.unit}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQty(product.id, quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center bg-forest border border-solid border-fern/60 text-mist text-xs hover:text-cream transition-colors"
                        >
                          -
                        </button>
                        <span className="font-mono text-xs w-6 text-center text-cream">{quantity}</span>
                        <button
                          onClick={() => updateCartQty(product.id, quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center bg-forest border border-solid border-fern/60 text-mist text-xs hover:text-cream transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-solid border-fern/20 pt-6 mt-6 space-y-4">
                <div className="flex items-center justify-between font-mono text-sm">
                  <span className="text-mist">Subtotal:</span>
                  <span className="text-lg text-gold font-bold">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isPending}
                  className="w-full py-3 bg-gold hover:bg-gold/90 text-forest font-medium tracking-wider text-xs uppercase font-mono transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isPending ? 'Processing Order...' : 'Confirm Checkout'}
                </button>

                <button
                  onClick={clearCart}
                  disabled={isPending}
                  className="w-full py-2 bg-transparent border border-solid border-red-900/40 text-red-400 hover:bg-red-950/10 text-[10px] tracking-wider uppercase font-mono transition-all disabled:opacity-50"
                >
                  Empty Basket
                </button>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
