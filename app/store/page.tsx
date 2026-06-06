import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import Storefront from '@/components/Storefront';

export const dynamic = 'force-dynamic';

export default async function StorePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  // Get active products from active (non-blocked) farmers
  const products = await db.product.findMany({
    where: {
      isBlocked: false,
      farmer: {
        isBlocked: false,
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      unit: true,
      category: true,
      emoji: true,
      farmer: {
        select: {
          name: true,
          farmName: true,
          address: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Convert schema Enum Category to exact types used in UI
  const typedProducts = products.map((p) => ({
    ...p,
    category: p.category as 'VEGETABLES' | 'FRUITS' | 'DAIRY',
  }));

  return <Storefront products={typedProducts} user={user} />;
}
