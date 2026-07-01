import { getSingleOrder } from '@/server/db/orders';
import React from 'react'


const STATUS_STYLE: Record<string, string> = {
  PENDING:          'bg-yellow-100 text-yellow-700',
  PREPARING:        'bg-blue-100 text-blue-700',
  OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700',
  DELIVERED:        'bg-green-100 text-green-700',
  CANCELLED:        'bg-red-100 text-red-700',
};

interface IProps{
  params:Promise<{
    id:string
  }>
}
const SingleOrdersPage = async({params}:IProps) => {
  const {id}=await params
  const order=await getSingleOrder(id)
  if(!order){
    return <div>Order not found</div>
  }
 return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Order #{order.id.slice(-8).toUpperCase()}
        </h1>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_STYLE[order.status]}`}>
          {order.status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Delivery info */}
      <div className="border rounded-xl p-4 space-y-1 text-sm">
        <p className="font-semibold text-base mb-2">Delivery Details</p>
        <p><span className="text-muted-foreground">Payment:</span> 🛵 Pay on Delivery</p>
        <p><span className="text-muted-foreground">Address:</span> {order.streetAddress}, {order.city}, {order.postalCode}, {order.country}</p>
        <p><span className="text-muted-foreground">Phone:</span> {order.phone}</p>
        <p><span className="text-muted-foreground">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      {/* Items */}
      <div className="border rounded-xl divide-y">
        <p className="font-semibold px-4 pt-3 pb-2">Items</p>
        {order.products.map((op) => (
          <div key={op.id} className="flex justify-between items-center px-4 py-3">
            <div>
              <p className="font-medium">{op.product.name}</p>
              <p className="text-xs text-muted-foreground">x{op.quantity}</p>
            </div>
            <p className="font-medium">${(op.product.basePrice * op.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Price breakdown */}
      <div className="border rounded-xl p-4 space-y-2 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><span>${order.subTotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Delivery fee</span><span>${order.deliveryFee.toFixed(2)}</span></div>
        <div className="flex justify-between font-bold text-base border-t pt-2">
          <span>Total</span><span>${order.totalPrice.toFixed(2)}</span>
        </div>
      </div>

    </div>
  );
}

export default SingleOrdersPage