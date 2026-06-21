import CartItems from "@/components/cart/CartItems";
import { CartItem } from "@/redux/features/cartSlice";

export const deliveryFee = 5;
export const getCartItemsQuantity = (cart: CartItem[]) => {
  //   return cart.reduce((acc, current) => acc + current.quantity!, 0);
  return cart.reduce(
    (quantity, currentItem) => quantity + currentItem.quantity!,
    0,
  );
};

export const getSingleCartItemQuantity = (id: string, cart: CartItem[]) => {
  return cart.find((item) => item.id === id)?.quantity || 0;
};

export const getSubTotal = (cart: CartItem[]) => {
  return cart.reduce((total, cartItem) => {
    //item.basePrice + item.size.price + item.extras.price

    const totolExstraPrice = cartItem.extras?.reduce(
      (sum, extra) => sum + (extra.price || 0),
      0,
    );

    const itemTotal =
      cartItem.basePrice +
      (cartItem.size?.price || 0) +
      (totolExstraPrice || 0);

    return total + itemTotal * cartItem.quantity!;
  }, 0);
};

export const getSubTotalWithFee = (cart: CartItem[]) => {
  return (getSubTotal(cart) || 0) + deliveryFee;
};
