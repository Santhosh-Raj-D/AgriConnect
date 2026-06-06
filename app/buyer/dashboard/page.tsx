import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { cancelOrder } from '@/lib/actions/buyerActions';

export const dynamic = 'force-dynamic';

export default async function BuyerDashboard() {
  const user = await getSessionUser();

  if (!user || user.role !== 'BUYER') {
    redirect('/login');
  }

  // Fetch orders with items and product/farmer details
  const orders = await db.order.findMany({
    where: { buyerId: user.id },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              emoji: true,
              farmer: {
                select: {
                  name: true,
                  farmName: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalSpent = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-900/40 border-amber-700/60 text-amber-200';
      case 'SHIPPED':
        return 'bg-blue-900/40 border-blue-700/60 text-blue-200';
      case 'DELIVERED':
        return 'bg-emerald-900/40 border-emerald-700/60 text-emerald-200';
      case 'CANCELLED':
        return 'bg-zinc-900/60 border-zinc-700/40 text-zinc-400';
      default:
        return 'bg-zinc-900/40 border-zinc-700/60 text-zinc-200';
    }
  };

  async function handleCancel(formData: FormData) {
    'use server';
    const orderId = formData.get('orderId') as string;
    if (orderId) {
      await cancelOrder(orderId);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1A14] text-[#F2EDE4] font-sans flex flex-col">
      {/* Header */}
      <header className="bg-[#0A1A14] border-b border-solid border-[#2B5240]/25 px-6 py-4 flex items-center justify-between">
        <Link href="/store" className="nav-logo text-xl font-serif text-[#F2EDE4] flex items-center gap-2">
          <span className="logo-dot" /> Buyer Dashboard
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/store" className="text-xs text-[#D4A853] hover:underline font-mono uppercase tracking-wider">
            Marketplace
          </Link>
          <span className="text-xs text-[#8FB89A]">
            Buyer: <strong className="text-[#F2EDE4]">{user.name}</strong>
          </span>
        </div>
      </header>

      <main className="max-w-4xl w-full mx-auto p-6 md:p-8 space-y-8 flex-1">
        {/* Stats card */}
        <div className="bg-[#112218] border border-solid border-[#2B5240]/20 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-sm">
          <div>
            <h1 className="font-serif text-3xl text-[#F2EDE4] mb-1">Purchases History</h1>
            <p className="text-xs text-[#8FB89A]">Track your incoming shipments and review previous orders.</p>
          </div>
          <div className="bg-[#0A1A14] border border-solid border-[#2B5240]/30 px-6 py-4 rounded-sm flex flex-col items-end">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8FB89A]">Total Direct Investments</span>
            <span className="text-2xl font-mono text-[#D4A853] font-bold mt-1">
              ₹{totalSpent.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Orders list */}
        <div className="space-y-6">
          <h2 className="font-serif text-xl border-b border-solid border-[#2B5240]/15 pb-3">Your Orders</h2>

          {orders.length === 0 ? (
            <div className="text-center py-20 bg-[#112218] border border-dashed border-[#2B5240]/20 rounded-sm text-[#8FB89A]">
              <p className="font-serif text-lg">You haven&apos;t placed any orders yet.</p>
              <Link
                href="/store"
                className="inline-block mt-4 bg-[#D4A853] hover:bg-[#D4A853]/90 text-[#0A1A14] px-6 py-2.5 text-xs font-mono uppercase tracking-wider"
              >
                Go to Marketplace
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#112218] border border-solid border-[#2B5240]/20 p-6 rounded-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-solid border-[#2B5240]/10 pb-3">
                    <div className="space-y-1">
                      <div className="text-xs text-[#8FB89A]">
                        Order ID:{' '}
                        <span className="font-mono text-[#F2EDE4]">{order.id}</span>
                      </div>
                      <div className="text-xs text-[#8FB89A]">
                        Placed on:{' '}
                        <span className="text-[#F2EDE4]">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] tracking-wider uppercase font-mono px-3 py-1.5 border border-solid rounded-sm ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      {order.status === 'PENDING' && (
                        <form action={handleCancel}>
                          <input type="hidden" name="orderId" value={order.id} />
                          <button
                            type="submit"
                            className="bg-transparent border border-solid border-red-900/40 text-red-400 hover:bg-red-950/20 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-colors"
                          >
                            Cancel
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="divide-y divide-solid divide-[#2B5240]/10">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.product.emoji}</span>
                          <div>
                            <div className="text-sm font-medium text-[#F2EDE4]">
                              {item.product.name}
                            </div>
                            <div className="text-[10px] text-[#8FB89A]">
                              Grown by:{' '}
                              <span className="text-[#D4A853]">
                                {item.product.farmer.farmName ||
                                  item.product.farmer.name}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 justify-between sm:justify-end">
                          <div className="text-xs text-[#8FB89A]">
                            Qty:{' '}
                            <span className="font-mono text-[#F2EDE4]">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="text-xs text-[#8FB89A]">
                            Price:{' '}
                            <span className="font-mono text-[#F2EDE4]">
                              ₹{item.priceAtPurchase}
                            </span>
                          </div>
                          <div className="font-mono text-sm text-[#D4A853]">
                            ₹{(item.quantity * item.priceAtPurchase).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t border-solid border-[#2B5240]/15 pt-3 flex justify-between items-center font-mono">
                    <span className="text-xs text-[#8FB89A]">Order Total:</span>
                    <span className="text-base text-[#D4A853] font-bold">
                      ₹{order.totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
