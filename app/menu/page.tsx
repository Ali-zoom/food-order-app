import Menu from "@/components/home/Menu";
import { getProductsByCategory } from "@/server/db/product";

const MenuPage = async () => {
  const productsWithCategory = await getProductsByCategory();
  return (
    <main>
      {productsWithCategory.map((categoy) => (
        <section key={categoy.id} className="container section-gap">
          <div className="text-center mb-6">
            <h1 className="text-primary text-2xl font-semibold">
              {categoy.name}
            </h1>
          </div>
          <Menu products={categoy.products} />
        </section>
      ))}
    </main>
  );
};

export default MenuPage;
