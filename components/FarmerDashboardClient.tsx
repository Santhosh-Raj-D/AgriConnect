'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  updateOrderStatus,
  updateFarmProfile,
} from '@/lib/actions/farmerActions';
import { logout } from '@/lib/actions/authActions';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  unit: string;
  category: 'VEGETABLES' | 'FRUITS' | 'DAIRY';
  emoji: string;
  isBlocked: boolean;
}

interface OrderItem {
  id: string;
  quantity: number;
  priceAtPurchase: number;
  order: {
    id: string;
    createdAt: Date;
    status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    buyer: {
      name: string;
      address: string | null;
    };
  };
}

interface FarmerUser {
  id: string;
  name: string;
  email: string;
  farmName: string | null;
  farmDetails: string | null;
  address: string | null;
}

interface FarmerDashboardClientProps {
  products: Product[];
  orders: OrderItem[];
  user: FarmerUser;
}

export default function FarmerDashboardClient({
  products,
  orders,
  user,
}: FarmerDashboardClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Modals & Forms State
  const [activeTab, setActiveTab] = useState<'listings' | 'orders' | 'profile'>('listings');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [error, setError] = useState('');

  // Stats calculation
  const totalProducts = products.length;
  const totalEarnings = orders
    .filter((item) => item.order.status !== 'CANCELLED')
    .reduce((sum, item) => sum + item.quantity * item.priceAtPurchase, 0);
  const activeOrdersCount = orders.filter(
    (item) => item.order.status === 'PENDING' || item.order.status === 'SHIPPED'
  ).length;

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createProduct(null, formData);
      if (res.success) {
        setShowAddModal(false);
        router.refresh();
      } else {
        setError(res.error || 'Failed to list product.');
      }
    });
  };

  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;
    setError('');
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateProduct(editingProduct.id, null, formData);
      if (res.success) {
        setEditingProduct(null);
        router.refresh();
      } else {
        setError(res.error || 'Failed to update product.');
      }
    });
  };

  const handleDeleteProduct = (productId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    startTransition(async () => {
      const res = await deleteProduct(productId);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || 'Failed to delete product.');
      }
    });
  };

  const handleUpdateStatus = (orderId: string, status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED') => {
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, status);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || 'Failed to update status.');
      }
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateFarmProfile(null, formData);
      if (res.success) {
        setShowProfileModal(false);
        router.refresh();
      } else {
        setError(res.error || 'Failed to update details.');
      }
    });
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-forest text-cream font-sans flex flex-col">
      {/* Header */}
      <header className="bg-forest border-b border-solid border-fern/25 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="nav-logo text-xl font-serif text-cream flex items-center gap-2">
          <span className="logo-dot" /> Farmer Operations
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/store" className="text-xs text-gold hover:underline font-mono uppercase tracking-wider">
            Marketplace
          </Link>
          <span className="text-xs text-mist">
            Farm: <strong className="text-cream">{user.farmName || user.name}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="text-xs border border-solid border-fern/60 text-mist hover:text-cream px-3 py-1.5 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8 flex-1">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-canopy border border-solid border-fern/20 p-6 rounded-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-mist">Active Listings</span>
            <div className="text-3xl font-serif text-gold mt-2">{totalProducts}</div>
            <p className="text-[10px] text-mist mt-1">Products currently available in marketplace.</p>
          </div>

          <div className="bg-canopy border border-solid border-fern/20 p-6 rounded-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-mist">Total Farm Revenue</span>
            <div className="text-3xl font-mono text-gold font-bold mt-2">
              ₹{totalEarnings.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-mist mt-1">Excludes cancelled transactions.</p>
          </div>

          <div className="bg-canopy border border-solid border-fern/20 p-6 rounded-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-mist">Active Shipments</span>
            <div className="text-3xl font-serif text-gold mt-2">{activeOrdersCount}</div>
            <p className="text-[10px] text-mist mt-1">Orders awaiting shipping or delivery.</p>
          </div>
        </div>

        {/* Dashboard Tabs & Navigation */}
        <div className="flex border-b border-solid border-fern/20 gap-4">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-4 px-2 text-xs font-mono uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'listings'
                ? 'border-gold text-gold'
                : 'border-transparent text-mist hover:text-cream'
            }`}
          >
            Manage Listings
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-2 text-xs font-mono uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-gold text-gold'
                : 'border-transparent text-mist hover:text-cream'
            }`}
          >
            Order Manager
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-2 text-xs font-mono uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-gold text-gold'
                : 'border-transparent text-mist hover:text-cream'
            }`}
          >
            Farm Details
          </button>
        </div>

        {/* TAB 1: PRODUCT LISTINGS */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl">Listed Produce</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gold text-forest font-mono text-xs uppercase tracking-wider px-4 py-2 hover:bg-gold/90 transition-all"
              >
                + Add New Product
              </button>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20 bg-canopy border border-dashed border-fern/20 rounded-sm text-mist">
                <p className="font-serif text-lg">No products listed on this farm yet.</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 bg-fern hover:bg-fern/80 text-cream px-6 py-2 text-xs font-mono uppercase"
                >
                  List First Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-canopy border border-solid border-fern/20 p-5 rounded-sm flex flex-col justify-between hover:border-gold/30 transition-all relative"
                  >
                    {p.isBlocked && (
                      <div className="absolute top-2 left-2 bg-red-950/80 border border-solid border-red-700/60 text-red-200 text-[8px] tracking-wider uppercase font-mono px-2 py-0.5 rounded-sm">
                        Flagged / Blocked
                      </div>
                    )}
                    <span className="text-3xl mb-3 block">{p.emoji}</span>
                    <div className="space-y-1 mb-4">
                      <h3 className="font-serif text-base text-cream flex items-center justify-between">
                        <span>{p.name}</span>
                        <span className="text-[10px] tracking-widest text-gold font-mono uppercase bg-gold/10 px-2 py-0.5 rounded-full">
                          {p.category.toLowerCase()}
                        </span>
                      </h3>
                      <p className="text-xs text-mist font-light">
                        {p.description || 'No description added.'}
                      </p>
                      <div className="font-mono text-sm text-gold pt-2">
                        ₹{p.price} <span className="text-[10px] text-mist">/ {p.unit}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-solid border-fern/10">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="bg-transparent border border-solid border-fern/60 hover:border-cream text-xs py-1.5 transition-all text-cream"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="bg-red-950/30 hover:bg-red-900/40 text-red-400 text-xs py-1.5 transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ORDER MANAGER */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="font-serif text-xl">Incoming Direct Orders</h2>

            {orders.length === 0 ? (
              <div className="text-center py-20 bg-canopy border border-dashed border-fern/20 rounded-sm text-mist">
                <p className="font-serif text-lg">No orders received yet.</p>
                <p className="text-xs mt-1">Once buyers check out your items, they will show up here.</p>
              </div>
            ) : (
              <div className="bg-canopy border border-solid border-fern/20 rounded-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-forest border-b border-solid border-fern/20 font-mono uppercase tracking-widest text-mist">
                        <th className="p-4">Date</th>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Item Ordered</th>
                        <th className="p-4">Item Total</th>
                        <th className="p-4">Current Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-solid divide-fern/10">
                      {orders.map((item) => (
                        <tr key={item.id} className="hover:bg-forest/40 transition-colors">
                          <td className="p-4 font-mono text-mist">
                            {new Date(item.order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-cream">{item.order.buyer.name}</div>
                            <div className="text-[10px] text-mist max-w-[200px] truncate">
                              📍 {item.order.buyer.address || 'No Address'}
                            </div>
                          </td>
                          <td className="p-4 font-mono text-cream">
                            {item.quantity} Qty
                          </td>
                          <td className="p-4 font-mono text-gold font-bold">
                            ₹{(item.quantity * item.priceAtPurchase).toLocaleString('en-IN')}
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-[9px] tracking-wider uppercase font-mono px-2 py-1 border border-solid rounded-sm ${
                                item.order.status === 'PENDING'
                                  ? 'bg-amber-900/30 border-amber-700/40 text-amber-200'
                                  : item.order.status === 'SHIPPED'
                                  ? 'bg-blue-900/30 border-blue-700/40 text-blue-200'
                                  : item.order.status === 'DELIVERED'
                                  ? 'bg-emerald-900/30 border-emerald-700/40 text-emerald-200'
                                  : 'bg-zinc-900/40 border-zinc-700/30 text-zinc-400'
                              }`}
                            >
                              {item.order.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                            {item.order.status === 'PENDING' && (
                              <button
                                onClick={() => handleUpdateStatus(item.order.id, 'SHIPPED')}
                                className="bg-fern hover:bg-gold hover:text-forest text-cream px-2 py-1 text-[9px] font-mono uppercase tracking-wider transition-colors"
                              >
                                Ship Item
                              </button>
                            )}
                            {item.order.status === 'SHIPPED' && (
                              <button
                                onClick={() => handleUpdateStatus(item.order.id, 'DELIVERED')}
                                className="bg-fern hover:bg-gold hover:text-forest text-cream px-2 py-1 text-[9px] font-mono uppercase tracking-wider transition-colors"
                              >
                                Delivered
                              </button>
                            )}
                            {item.order.status !== 'DELIVERED' && item.order.status !== 'CANCELLED' && (
                              <button
                                onClick={() => handleUpdateStatus(item.order.id, 'CANCELLED')}
                                className="bg-transparent border border-solid border-red-900/40 text-red-400 hover:bg-red-950/20 px-2 py-1 text-[9px] font-mono uppercase tracking-wider transition-colors"
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FARM PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-xl bg-canopy border border-solid border-fern/20 p-6 rounded-sm space-y-6">
            <h2 className="font-serif text-xl border-b border-solid border-fern/10 pb-3">
              Configure Farm Operations
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-xs font-mono tracking-widest uppercase text-mist mb-2">
                  Farm Name
                </label>
                <input
                  type="text"
                  name="farmName"
                  required
                  defaultValue={user.farmName || ''}
                  className="w-full bg-forest border border-solid border-fern/60 focus:border-gold outline-none px-4 py-3 text-cream text-sm rounded-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono tracking-widest uppercase text-mist mb-2">
                  Farm Description & Produce Specialization
                </label>
                <textarea
                  name="farmDetails"
                  rows={4}
                  defaultValue={user.farmDetails || ''}
                  className="w-full bg-forest border border-solid border-fern/60 focus:border-gold outline-none px-4 py-3 text-cream text-sm rounded-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono tracking-widest uppercase text-mist mb-2">
                  Shipping/Pickup Farm Address
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  defaultValue={user.address || ''}
                  className="w-full bg-forest border border-solid border-fern/60 focus:border-gold outline-none px-4 py-3 text-cream text-sm rounded-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 bg-gold hover:bg-gold/90 text-forest font-medium tracking-wider text-xs uppercase font-mono transition-all"
              >
                {isPending ? 'Updating Operations...' : 'Save Settings'}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* MODAL 1: ADD PRODUCT */}
      {showAddModal && (
        <div className="fixed inset-0 bg-forest/85 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="w-full max-w-md bg-canopy border border-solid border-fern/40 p-6 rounded-sm shadow-2xl relative">
            <h3 className="font-serif text-lg text-cream mb-6">List New Produce</h3>

            {error && <div className="text-red-200 bg-red-950/40 border border-solid border-red-700/60 p-3 text-xs mb-4">{error}</div>}

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-mist mb-1.5">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Country Tomatoes"
                    className="w-full bg-forest border border-solid border-fern/60 focus:border-gold outline-none px-3 py-2 text-cream"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-mist mb-1.5">
                    Emoji Icon
                  </label>
                  <input
                    type="text"
                    name="emoji"
                    placeholder="🍅"
                    className="w-full bg-forest border border-solid border-fern/60 focus:border-gold outline-none px-3 py-2 text-center text-lg text-cream"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-mist mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  required
                  className="w-full bg-forest border border-solid border-fern/60 focus:border-gold outline-none px-3 py-2 text-cream cursor-pointer"
                >
                  <option value="VEGETABLES">Vegetables</option>
                  <option value="FRUITS">Fruits</option>
                  <option value="DAIRY">Dairy</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-mist mb-1.5">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    required
                    placeholder="40"
                    className="w-full bg-forest border border-solid border-fern/60 focus:border-gold outline-none px-3 py-2 text-cream"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-mist mb-1.5">
                    Selling Unit
                  </label>
                  <input
                    type="text"
                    name="unit"
                    required
                    placeholder="kg, litre, bunch, dozen"
                    className="w-full bg-forest border border-solid border-fern/60 focus:border-gold outline-none px-3 py-2 text-cream"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-mist mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Tell buyers about your harvesting standards..."
                  className="w-full bg-forest border border-solid border-fern/60 focus:border-gold outline-none px-3 py-2 text-cream resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-solid border-fern/10 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-transparent border border-solid border-fern/60 text-xs px-4 py-2 hover:border-cream text-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-gold text-forest text-xs px-4 py-2 font-mono uppercase tracking-wider hover:bg-gold/90"
                >
                  List Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT PRODUCT */}
      {editingProduct && (
        <div className="fixed inset-0 bg-forest/85 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="w-full max-w-md bg-canopy border border-solid border-fern/40 p-6 rounded-sm shadow-2xl relative">
            <h3 className="font-serif text-lg text-cream mb-6">Modify Listed Produce</h3>

            {error && <div className="text-red-200 bg-red-950/40 border border-solid border-red-700/60 p-3 text-xs mb-4">{error}</div>}

            <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-mist mb-1.5">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingProduct.name}
                    className="w-full bg-forest border border-solid border-fern/60 focus:border-gold outline-none px-3 py-2 text-cream"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-mist mb-1.5">
                    Emoji Icon
                  </label>
                  <input
                    type="text"
                    name="emoji"
                    defaultValue={editingProduct.emoji}
                    className="w-full bg-forest border border-solid border-fern/60 focus:border-gold outline-none px-3 py-2 text-center text-lg text-cream"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-mist mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  required
                  defaultValue={editingProduct.category}
                  className="w-full bg-forest border border-solid border-fern/60 focus:border-gold outline-none px-3 py-2 text-cream cursor-pointer"
                >
                  <option value="VEGETABLES">Vegetables</option>
                  <option value="FRUITS">Fruits</option>
                  <option value="DAIRY">Dairy</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-mist mb-1.5">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    required
                    defaultValue={editingProduct.price}
                    className="w-full bg-forest border border-solid border-fern/60 focus:border-gold outline-none px-3 py-2 text-cream"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-mist mb-1.5">
                    Selling Unit
                  </label>
                  <input
                    type="text"
                    name="unit"
                    required
                    defaultValue={editingProduct.unit}
                    className="w-full bg-forest border border-solid border-fern/60 focus:border-gold outline-none px-3 py-2 text-cream"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-mist mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingProduct.description || ''}
                  className="w-full bg-forest border border-solid border-fern/60 focus:border-gold outline-none px-3 py-2 text-cream resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-solid border-fern/10 justify-end">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="bg-transparent border border-solid border-fern/60 text-xs px-4 py-2 hover:border-cream text-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-gold text-forest text-xs px-4 py-2 font-mono uppercase tracking-wider hover:bg-gold/90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
