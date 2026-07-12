"use client";
import axios from "axios";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { toast } from "sonner";

export default function CancelButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCancel = async (orderid: string) => {
    try {
      if (!confirm("Are you sure you want to cancel this order?")) return;
      setLoading(true);
      await axios.put(`/api/orders/${orderid}`);

      router.refresh(); // re-fetch server component data
      toast.success("order canceled", { position: "top-center" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message, {
          position: "top-center",
          className:
            "!bg-red-500 !text-white !border !border-red-700 !rounded-xl !shadow-lg",
        });
        console.log(error.response?.data);
        console.log(error.message);
      } else {
        toast.error("Unknown error", {
          position: "top-center",
          className:
            "!bg-red-500 !text-white !border !border-red-700 !rounded-xl !shadow-lg",
        });
        console.log("Unknown error", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={() => handleCancel(orderId)}
      disabled={loading}
      className="border border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition"
    >
      {loading ? "Cancelling..." : "Cancel Order"}
    </button>
  );
}
