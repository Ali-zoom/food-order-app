import CartItems from "@/components/cart/CartItems";
import CheckOutForm from "@/components/cart/CheckOutForm";

const CartPage = () => {
  return (
    <section className="section-gap">
      <div className="container">
        <div className="text-center">
          <h1 className="text-primary text-2xl font-semibold italic">Cart</h1>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <CartItems />
          <CheckOutForm />
        </div>
      </div>
    </section>
  );
};

export default CartPage;
