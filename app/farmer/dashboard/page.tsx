import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import FarmerDashboardClient from '@/components/FarmerDashboardClient';

export const dynamic = 'force-dynamic';

export default async function FarmerDashboard() {
  const user = await getSessionUser();

  if (!user || user.role !== 'FARMER') {
    redirect('/login');
  }

  // Fetch farmer's products
  const products = await db.product.findMany({
    where: { farmerId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  // Fetch farmer's incoming order items
  const orderItems = await db.orderItem.findMany({
    where: { farmerId: user.id },
    include: {
      order: {
        select: {
          id: true,
          createdAt: true,
          status: true,
          buyer: {
            select: {
              name: true,
              address: true,
            },
          },
        },
      },
    },
    orderBy: {
      order: {
        createdAt: 'desc',
      },
    },
  });

  // Convert categories and statuses into explicit typescript structures
  const typedProducts = products.map((p) => ({
    ...p,
    category: p.category as 'VEGETABLES' | 'FRUITS' | 'DAIRY',
  }));

  const typedOrderItems = orderItems.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    priceAtPurchase: item.priceAtPurchase,
    order: {
      id: item.order.id,
      createdAt: item.order.createdAt,
      status: item.order.status as 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED',
      buyer: {
        name: item.order.buyer.name,
        address: item.order.buyer.address,
      },
    },
  }));

  return (
    <FarmerDashboardClient
      products={typedProducts}
      orders={typedOrderItems}
      user={user}
    />
  );
}
