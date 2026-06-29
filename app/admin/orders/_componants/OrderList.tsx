import { Order } from '@/app/generated/prisma/client'
import { OrderWithRelation } from '@/types/orders'
import Link from 'next/link';
import React from 'react'
const STATUS_STYLE: Record<string, string> = {
  PENDING:          'bg-yellow-100 text-yellow-700',
  PREPARING:        'bg-blue-100 text-blue-700',
  OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700',
  DELIVERED:        'bg-green-100 text-green-700',
  CANCELLED:        'bg-red-100 text-red-700',
};
const OrderList = ({orders}:{orders:OrderWithRelation[]}) => {
  
    return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">My Orders</h1>

      {orders.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-4xl mb-3">🛒</p>
          <p>You haven&apos;t placed any orders yet.</p>
          <Link href="/" className="text-orange-500 underline mt-2 inline-block">Browse menu</Link>
        </div>
      )}

      {orders.map((order) => (
        <Link className='' href={`/orders/${order.id}`} key={order.id}>
          <div className="my-2 border rounded-xl p-4 flex justify-between items-center hover:shadow-md transition cursor-pointer">
            <div className="space-y-1">
              <p className="font-semibold">Order #{order.id.slice(-8).toUpperCase()}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString()} · {order.products.length} item(s)
              </p>
              <p className="text-sm font-medium">${order.totalPrice.toFixed(2)}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[order.status]}`}>
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
  
}

export default OrderList