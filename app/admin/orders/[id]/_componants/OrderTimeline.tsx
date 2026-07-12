// components/OrderTimeline.tsx
import { Check, ChefHat, Bike, PackageCheck, X } from "lucide-react";

type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

const STEPS = [
  {
    key: "PENDING",
    label: "Order placed",
    description: "We received your order",
    icon: Check,
  },
  {
    key: "PREPARING",
    label: "Preparing your order",
    description: "Your food is being prepared",
    icon: ChefHat,
  },
  {
    key: "OUT_FOR_DELIVERY",
    label: "Out for delivery",
    description: "On the way to your address",
    icon: Bike,
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    description: "Enjoy your meal!",
    icon: PackageCheck,
  },
];

const ORDER_INDEX: Record<string, number> = {
  PENDING: 0,
  PREPARING: 1,
  OUT_FOR_DELIVERY: 2,
  DELIVERED: 3,
};

export default function OrderTimeline({
  status,
  createdAt,
}: {
  status: OrderStatus;
  createdAt: Date;
}) {
  const currentIndex = ORDER_INDEX[status] ?? 0;
  const isCancelled = status === "CANCELLED";

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
        <div className="w-10 h-10 rounded-full bg-red-100 border-2 border-red-300 flex items-center justify-center flex-shrink-0">
          <X className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <p className="font-medium text-red-700">Order cancelled</p>
          <p className="text-sm text-red-500">This order has been cancelled</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const isDone = i < currentIndex;
        const isActive = i === currentIndex;
        const isPending = i > currentIndex;

        return (
          <div key={step.key} className="flex items-start gap-4 relative">
            {/* Vertical connector line */}
            {i < STEPS.length - 1 && (
              <div
                className={`absolute left-5 top-11 w-0.5 h-[calc(100%-12px)] ${
                  isDone ? "bg-blue-400" : "bg-gray-200"
                }`}
              />
            )}

            {/* Icon circle */}
            <div
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 transition-colors ${
                isDone
                  ? "bg-blue-50 border-blue-400 text-blue-600"
                  : isActive
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "bg-white border-gray-200 text-gray-300"
              }`}
            >
              {isDone ? (
                <Check className="w-4 h-4" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
            </div>

            {/* Text */}
            <div className="pb-8 pt-1.5">
              <p
                className={`font-medium text-sm ${isPending ? "text-gray-400" : "text-gray-900"}`}
              >
                {step.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>

              {/* Timestamp on first step */}
              {i === 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(createdAt).toLocaleString()}
                </p>
              )}

              {/* Active badge */}
              {isActive && (
                <span className="inline-block mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  In progress
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
