-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PAY_ON_DELIVERY', 'ONLINE');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'PAY_ON_DELIVERY',
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING';
