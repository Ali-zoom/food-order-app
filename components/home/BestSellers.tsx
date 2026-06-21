import prisma from "@/lib/prisma";
import Menu from "./Menu";
import { getBestSellers } from "@/server/db/product";

const BestSellers = async () => {
  const bestSellers = await getBestSellers(3);
  return (
    <section>
      <div className="container ">
        <div className="text-center">
          <p className="text-accent font-bold py-3">check out</p>
          <h1 className="text-3xl font-semibold text-primary">Best Sellers</h1>
        </div>

        {/* <Menu bestSellers={bestSellers} /> */}
        <Menu products={bestSellers} />
      </div>
    </section>
  );
};

export default BestSellers;
