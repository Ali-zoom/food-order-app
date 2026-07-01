import { authOptions } from '@/lib/authOptions'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import React from 'react'
import OrderList from './_componants/OrderList'
import { getOrders } from '@/server/db/orders'

const OrdersPage = async() => {
    const session=await getServerSession(authOptions)
    if(!session?.user?.email){
        return <div>Unauthorized</div>
    }

    if(session.user.role!=="ADMIN"){
        return <div>Unauthorized</div>
    }

    const orders=await getOrders(session)
 
    
  return (
    <div>
        <OrderList orders={orders}/>
    </div>
  )
}

export default OrdersPage