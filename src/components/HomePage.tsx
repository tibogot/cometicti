import { useEffect, useState } from "react";
import { ShopifyClient } from "../utils/shopify";
import { ShopifyProduct } from "../types/store.types";
import { useStore } from "../store/useStore";
import { ProductCard } from "./ProductCard";

export const HomePage = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const shopifyAccess = useStore((state) => state.shopifyAccess);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!shopifyAccess) return;

      const client = new ShopifyClient(
        shopifyAccess.shopDomain,
        shopifyAccess.accessToken
      );

      try {
        const response = await client.getAllProducts({ first: 3 });
        setProducts(response.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [shopifyAccess]);

  return (
    <div className="w-full flex flex-col">
      <section
        className="relative w-full flex-shrink-0 bg-gray-900"
        style={{ height: "calc(100svh - 4rem)" }}
      >
        <img
          src="/heroimg.avif"
          alt="Hero"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ willChange: "transform" }} // Optimize performance
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 w-full">
          <div className="px-8 pb-12">
            <h1 className="text-6xl font-bold text-white font-neue mb-4">
              Natural Beauty
            </h1>
            <p className="text-xl text-white/90 font-neue max-w-lg">
              Discover our collection of natural and organic cosmetics
            </p>
          </div>
        </div>
      </section>
      <section className="w-full bg-white py-20 flex-grow">
        <div className="px-8">
          <h2 className="text-4xl font-bold mb-12 font-neue">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[400px]">
            {loading
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                      <div className="bg-gray-200 h-4 w-2/3 mb-2 rounded"></div>
                      <div className="bg-gray-200 h-4 w-1/3 rounded"></div>
                    </div>
                  ))
              : products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>
    </div>
  );
};
