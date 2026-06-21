"use client";
import { useAppSelector } from "@/redux/hooks";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { selectCartItems } from "@/redux/features/cartSlice";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { getSubTotalWithFee } from "@/lib/cart";
import { formatCurrency } from "@/lib/formatter";

const CheckOutForm = () => {
  const cart = useAppSelector(selectCartItems);
  const totalWithFee = getSubTotalWithFee(cart);
  return (
    <section>
      {cart && cart.length > 0 ? (
        <div className="">
          <form className="grid gap-4">
            <Field>
              <FieldLabel htmlFor="form-name">Name</FieldLabel>
              <Input
                id="form-name"
                type="text"
                placeholder="Evil Rabbit"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="ali@gmail.com"
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="city">City</FieldLabel>
                <Input id="city" type="text" placeholder="Hillah" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="country">Country</FieldLabel>
                <Input id="country" type="text" placeholder="Iraq" required />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="textarea-message">Notes</FieldLabel>
              <Textarea
                id="textarea-message"
                placeholder="Type your Notes here."
              />
            </Field>

            <Button className="py-4">Pay {formatCurrency(totalWithFee)}</Button>
          </form>
        </div>
      ) : (
        <p>cart is empty</p>
      )}
    </section>
  );
};

export default CheckOutForm;
