import { Link } from "react-router-dom";
import { ShopifyProduct } from "../types/store.types";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const isGLB = product.images[0]?.src.endsWith(".glb");

  return (
    <Link to={`/product/${product.handle}`} className="group w-full">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 select-none">
        {product.images[0] &&
          (isGLB ? (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-500">3D Model Available</span>
            </div>
          ) : (
            <img
              src={product.images[0].src}
              alt={product.images[0].altText || product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ))}
      </div>
      <div className="p-4">
        <h2 className="text-base md:text-lg font-semibold text-gray-800 truncate">
          {product.title}
        </h2>
        <p className="text-lg md:text-xl font-bold text-blue-600">
          ${product.price}
        </p>
      </div>
    </Link>
  );
};
