'use server';

import { db } from '../db';
import { getSessionUser } from '../auth';
import { revalidatePath } from 'next/cache';

interface CartItem {
  productId: string;
  quantity: number;
}

export async function placeOrder(cartItems: CartItem[]) {
  const user = await getSessionUser();
  if (!user || user.role !== 'BUYER') {
    return { success: false, error: 'Unauthorized. Please log in as a buyer.' };
  }

  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: 'Your cart is empty.' };
  }

  try {
    // Look up products to verify price and stock
    const productIds = cartItems.map((item) => item.productId);
    const products = await db.product.findMany({
      where: {
        id: { in: productIds },
        isBlocked: false,
      },
    });

    if (products.length !== cartItems.length) {
      return {
        success: false,
        error: 'One or more products in your cart are no longer available.',
      };
    }

    // Map products by ID for quick access
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Calculate total price
    let totalPrice = 0;
    const itemsData = cartItems.map((cartItem) => {
      const p = productMap.get(cartItem.productId)!;
      const priceAtPurchase = p.price;
      totalPrice += priceAtPurchase * cartItem.quantity;
      return {
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        priceAtPurchase,
        farmerId: p.farmerId,
      };
    });

    // Create the order inside a database transaction
    const order = await db.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          buyerId: user.id,
          totalPrice,
          status: 'PENDING',
        },
      });

      // Create order items
      await tx.orderItem.createMany({
        data: itemsData.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase,
          farmerId: item.farmerId,
        })),
      });

      return newOrder;
    });

    revalidatePath('/buyer/dashboard');
    revalidatePath('/farmer/dashboard');
    revalidatePath('/admin/dashboard');

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Checkout error:', error);
    return { success: false, error: 'Failed to place order. Please try again.' };
  }
}

export async function cancelOrder(orderId: string) {
  const user = await getSessionUser();
  if (!user || user.role !== 'BUYER') {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.buyerId !== user.id) {
      return { success: false, error: 'Order not found.' };
    }

    if (order.status !== 'PENDING') {
      return { success: false, error: 'Only pending orders can be cancelled.' };
    }

    await db.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });

    revalidatePath('/buyer/dashboard');
    revalidatePath('/farmer/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Cancel order error:', error);
    return { success: false, error: 'Failed to cancel order.' };
  }
}
