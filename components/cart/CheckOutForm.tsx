"use client";
import { useAppSelector } from "@/redux/hooks";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { CartItem, selectCartItems } from "@/redux/features/cartSlice";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { deliveryFee, getSubTotal, getSubTotalWithFee } from "@/lib/cart";
import { formatCurrency } from "@/lib/formatter";
import { toast } from "sonner";
import axios from "axios";
import {
  CheckoutFormValues,
  checkoutSchema,
} from "@/lib/validation/checkoutFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { useClientSession } from "@/hooks/useClientSession";
import { OrderStatus, PaymentMethod } from "@/constants/enums";
import { string } from "zod";

const CheckOutForm = ({ user }: { user?: Session["user"] }) => {
  const cart = useAppSelector(selectCartItems);
  const subTotal = getSubTotal(cart);
  const totalWithFee = getSubTotalWithFee(cart);
  deliveryFee;
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,

    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    mode: "onChange",
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user ? user.name : "",
      email: user ? user.email : "",
      phone: user?.phone ?? "",
      city: user?.city ?? "",
      country: user?.country ?? "",
    },
  });

  const onSubmit = async (formdata: CheckoutFormValues) => {
    try {
      const res=await axios.post(`/api/orders`, {
        ...formdata,
        subTotal: subTotal,
        deliveryFee: deliveryFee,
        totalPrice: totalWithFee,
        streetAddress: "street",
        postalCode: "123 post code",
        paid: false,
        status: OrderStatus.PENDING,
        paymentMethod: PaymentMethod.PAY_ON_DELIVERY,
        userId: user?.id ?? null,

        // products: cart.map((item: CartItem) => ({
        //   productId: item.id,
        //   quantity: item.quantity,
        //   userId: user?.id ?? null,
        // })),
        products: JSON.stringify(cart),
      });
      toast.success("order placed", { position: "top-center" });
      router.push(`/admin/orders/${res.data.id}`);
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
    }
  };

  return (
    <section>
      {cart && cart.length > 0 ? (
        <div className="">
          <form
            className="grid gap-4"
            onSubmit={handleSubmit(onSubmit, (errors) =>
              console.log("❌ Validation failed:", errors),
            )}
          >
            <Field>
              <FieldLabel htmlFor="form-name">Name</FieldLabel>
              <Input
                id="form-name"
                type="text"
                placeholder="Evil Rabbit"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-destructive">{errors.name.message}</p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="ali@gmail.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-destructive">{errors.email.message}</p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="phone">Phone</FieldLabel>
              <Input
                id="Phone"
                type="text"
                placeholder="07XXXXXXX"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-destructive">{errors.phone.message}</p>
              )}
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="city">City</FieldLabel>
                <Input
                  id="city"
                  type="text"
                  placeholder="Hillah"
                  {...register("city")}
                />
                {errors.city && (
                  <p className="text-destructive">{errors.city.message}</p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="country">Country</FieldLabel>
                <Input
                  id="country"
                  type="text"
                  placeholder="Iraq"
                  {...register("country")}
                />
                {errors.country && (
                  <p className="text-destructive">{errors.country.message}</p>
                )}
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="textarea-message">Notes</FieldLabel>
              <Textarea
                id="textarea-message"
                placeholder="Type your Notes here."
                {...register("notes")}
              />
              {errors.notes && (
                <p className="text-destructive">{errors.notes.message}</p>
              )}
            </Field>

            <Button className="py-4">
              {isSubmitting ? "Loading" : `Pay ${formatCurrency(totalWithFee)}`}
            </Button>
          </form>
        </div>
      ) : (
        <p>cart is empty</p>
      )}
    </section>
  );
};

export default CheckOutForm;
