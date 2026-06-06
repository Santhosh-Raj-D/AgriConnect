'use server';

import { db } from '../db';
import { getSessionUser } from '../auth';
import { revalidatePath } from 'next/cache';

export async function createProduct(state: any, formData: FormData) {
  const user = await getSessionUser();
  if (!user || user.role !== 'FARMER') {
    return { success: false, error: 'Unauthorized.' };
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const priceInput = formData.get('price') as string;
  const unit = formData.get('unit') as string;
  const category = formData.get('category') as 'VEGETABLES' | 'FRUITS' | 'DAIRY';
  const emoji = formData.get('emoji') as string;

  if (!name || !priceInput || !unit || !category) {
    return { success: false, error: 'Required fields are missing.' };
  }

  const price = parseFloat(priceInput);
  if (isNaN(price) || price <= 0) {
    return { success: false, error: 'Price must be a valid number greater than 0.' };
  }

  try {
    await db.product.create({
      data: {
        name,
        description: description || '',
        price,
        unit,
        category,
        emoji: emoji || '🌾',
        farmerId: user.id,
      },
    });

    revalidatePath('/farmer/dashboard');
    revalidatePath('/store');
    return { success: true };
  } catch (error) {
    console.error('Create product error:', error);
    return { success: false, error: 'Failed to list product.' };
  }
}

export async function updateProduct(productId: string, state: any, formData: FormData) {
  const user = await getSessionUser();
  if (!user || user.role !== 'FARMER') {
    return { success: false, error: 'Unauthorized.' };
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const priceInput = formData.get('price') as string;
  const unit = formData.get('unit') as string;
  const category = formData.get('category') as 'VEGETABLES' | 'FRUITS' | 'DAIRY';
  const emoji = formData.get('emoji') as string;

  if (!name || !priceInput || !unit || !category) {
    return { success: false, error: 'Required fields are missing.' };
  }

  const price = parseFloat(priceInput);
  if (isNaN(price) || price <= 0) {
    return { success: false, error: 'Price must be a valid number greater than 0.' };
  }

  try {
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product || product.farmerId !== user.id) {
      return { success: false, error: 'Product not found or access denied.' };
    }

    await db.product.update({
      where: { id: productId },
      data: {
        name,
        description: description || '',
        price,
        unit,
        category,
        emoji: emoji || '🌾',
      },
    });

    revalidatePath('/farmer/dashboard');
    revalidatePath('/store');
    return { success: true };
  } catch (error) {
    console.error('Update product error:', error);
    return { success: false, error: 'Failed to update product.' };
  }
}

export async function deleteProduct(productId: string) {
  const user = await getSessionUser();
  if (!user || user.role !== 'FARMER') {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product || product.farmerId !== user.id) {
      return { success: false, error: 'Product not found or access denied.' };
    }

    await db.product.delete({ where: { id: productId } });

    revalidatePath('/farmer/dashboard');
    revalidatePath('/store');
    return { success: true };
  } catch (error) {
    console.error('Delete product error:', error);
    return { success: false, error: 'Failed to delete product.' };
  }
}

export async function updateOrderStatus(orderId: string, newStatus: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED') {
  const user = await getSessionUser();
  if (!user || user.role !== 'FARMER') {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    // In our simplified order structure, a farmer manages the status of the entire order
    // containing their items.
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return { success: false, error: 'Order not found.' };
    }

    // Verify if this farmer has items in this order
    const hasItems = order.items.some((item) => item.farmerId === user.id);
    if (!hasItems) {
      return { success: false, error: 'Unauthorized access to this order.' };
    }

    await db.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    revalidatePath('/farmer/dashboard');
    revalidatePath('/buyer/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Update order status error:', error);
    return { success: false, error: 'Failed to update order status.' };
  }
}

export async function updateFarmProfile(state: any, formData: FormData) {
  const user = await getSessionUser();
  if (!user || user.role !== 'FARMER') {
    return { success: false, error: 'Unauthorized.' };
  }

  const farmName = formData.get('farmName') as string;
  const farmDetails = formData.get('farmDetails') as string;
  const address = formData.get('address') as string;

  if (!farmName) {
    return { success: false, error: 'Farm name is required.' };
  }

  try {
    await db.user.update({
      where: { id: user.id },
      data: {
        farmName,
        farmDetails: farmDetails || '',
        address: address || '',
      },
    });

    revalidatePath('/farmer/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Update farm profile error:', error);
    return { success: false, error: 'Failed to update farm details.' };
  }
}
