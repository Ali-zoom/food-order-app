import { authOptions } from '@/lib/authOptions'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import React from 'react'
import OrderList from './_componants/OrderList'

const OrdersPage = async() => {
    const session=await getServerSession(authOptions)
    if(!session?.user?.email){
        return <div>Unauthorized</div>
    }

    if(session.user.role!=="ADMIN"){
        return <div>Unauthorized</div>
    }
    const orders=await prisma.order.findMany({
        where:{userEmail:session.user.role!=="ADMIN"? session.user.email: undefined},
        orderBy:{createdAt:"desc"},
        include:{
            products:{include:{product:true}}
        }
    })
    
  return (
    <div>
        <OrderList orders={orders}/>
    </div>
  )
}

export default OrdersPage