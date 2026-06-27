import CartItems from "@/components/cart/CartItems";
import CheckOutForm from "@/components/cart/CheckOutForm";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

const CartPage = async () => {
  const session = await getServerSession(authOptions);

  const user = session?.user;
  return (
    <section className="section-gap">
      <div className="container">
        <div className="text-center">
          <h1 className="text-primary text-2xl font-semibold italic">Cart</h1>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <CartItems />
          <CheckOutForm user={user} />
        </div>
      </div>
    </section>
  );
};

export default CartPage;
