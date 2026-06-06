import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import AdminDashboardClient from '@/components/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const user = await getSessionUser();

  if (!user || user.role !== 'ADMIN') {
    redirect('/login');
  }

  // Fetch counts
  const farmersCount = await db.user.count({ where: { role: 'FARMER' } });
  const buyersCount = await db.user.count({ where: { role: 'BUYER' } });
  const productsCount = await db.product.count();
  const ordersCount = await db.order.count();

  // Fetch all users (excluding admins)
  const users = await db.user.findMany({
    where: {
      role: { not: 'ADMIN' },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      farmName: true,
      isBlocked: true,
      address: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate Category Metrics: sum of volume & revenue from non-cancelled orders
  const items = await db.orderItem.findMany({
    where: {
      order: {
        status: { not: 'CANCELLED' },
      },
    },
    select: {
      quantity: true,
      priceAtPurchase: true,
      product: {
        select: {
          category: true,
        },
      },
    },
  });

  const categories = ['VEGETABLES', 'FRUITS', 'DAIRY'];
  const categoryMap = new Map<string, { volume: number; revenue: number }>(
    categories.map((c) => [c, { volume: 0, revenue: 0 }])
  );

  items.forEach((item) => {
    const cat = item.product.category;
    if (categoryMap.has(cat)) {
      const current = categoryMap.get(cat)!;
      current.volume += item.quantity;
      current.revenue += item.quantity * item.priceAtPurchase;
    }
  });

  const categoryMetrics = Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    volume: data.volume,
    revenue: data.revenue,
  }));

  // Calculate Buyer Activity: top buyers by order count
  const buyers = await db.user.findMany({
    where: { role: 'BUYER' },
    select: {
      name: true,
      email: true,
      _count: {
        select: {
          orders: {
            where: { status: { not: 'CANCELLED' } },
          },
        },
      },
    },
  });

  const buyerMetrics = buyers
    .map((b) => ({
      name: b.name,
      email: b.email,
      orderCount: b._count.orders,
    }))
    .sort((x, y) => y.orderCount - x.orderCount)
    .slice(0, 5); // top 5 active buyers

  // Convert categories and roles to exact TypeScript types for Client Component
  const typedUsers = users.map((u) => ({
    ...u,
    role: u.role as 'FARMER' | 'BUYER',
  }));

  return (
    <AdminDashboardClient
      users={typedUsers}
      categoryMetrics={categoryMetrics}
      buyerMetrics={buyerMetrics}
      counts={{
        farmers: farmersCount,
        buyers: buyersCount,
        products: productsCount,
        orders: ordersCount,
      }}
    />
  );
}
