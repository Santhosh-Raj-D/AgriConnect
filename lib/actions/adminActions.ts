'use server';

import { db } from '../db';
import { getSessionUser } from '../auth';
import { revalidatePath } from 'next/cache';

export async function toggleUserBlockStatus(userId: string) {
  const admin = await getSessionUser();
  if (!admin || admin.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { success: false, error: 'User not found.' };
    }

    if (user.role === 'ADMIN') {
      return { success: false, error: 'Cannot block administrative accounts.' };
    }

    const newBlockedState = !user.isBlocked;

    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { isBlocked: newBlockedState },
      });

      if (newBlockedState) {
        // Clear all active sessions for this user so they are instantly logged out
        await tx.session.deleteMany({
          where: { userId },
        });
      }
    });

    revalidatePath('/admin/dashboard');
    revalidatePath('/store');
    return { success: true, isBlocked: newBlockedState };
  } catch (error) {
    console.error('Toggle user block status error:', error);
    return { success: false, error: 'Failed to update user block status.' };
  }
}

export async function toggleProductBlockStatus(productId: string) {
  const admin = await getSessionUser();
  if (!admin || admin.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) {
      return { success: false, error: 'Product not found.' };
    }

    const newBlockedState = !product.isBlocked;

    await db.product.update({
      where: { id: productId },
      data: { isBlocked: newBlockedState },
    });

    revalidatePath('/admin/dashboard');
    revalidatePath('/store');
    revalidatePath('/farmer/dashboard');
    return { success: true, isBlocked: newBlockedState };
  } catch (error) {
    console.error('Toggle product block status error:', error);
    return { success: false, error: 'Failed to update product block status.' };
  }
}
