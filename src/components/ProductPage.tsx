import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopifyProduct, ShopifyVariant } from "../types/store.types";
import { ShopifyClient } from "../utils/shopify";
import { useStore } from "../store/useStore";
// import { CaretLeft, CaretRight } from "@phosphor-icons/react";

export const ProductPage = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  // const [activeTab, setActiveTab] = useState("details");
  const shopifyAccess = useStore((state) => state.shopifyAccess);
  const addToCart = useStore((state) => state.addToCart);
  const setCartOpen = useStore((state) => state.setCartOpen);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(
    null
  );
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  // const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!shopifyAccess || !handle) return;

      const client = new ShopifyClient(
        shopifyAccess.shopDomain,
        shopifyAccess.accessToken
      );

      try {
        const product = await client.getProductByHandle(handle);
        setProduct(product);

        // Set initial variant
        if (product.variants.length > 0) {
          const [defaultVariant] = product.variants;
          const [size, color] = defaultVariant.title.split(" / ");
          setSelectedSize(size);
          setSelectedColor(color);
          setSelectedVariant(defaultVariant);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Error fetching product. Please try again later.");
        navigate("/");
      }
    };

    fetchProduct();
  }, [handle, shopifyAccess, navigate]);

  useEffect(() => {
    if (product) {
      const variant = product.variants.find(
        (v) =>
          v.title ===
          `${selectedSize}${selectedColor ? " / " + selectedColor : ""}`
      );
      setSelectedVariant(variant || product.variants[0]);
    }
  }, [product, selectedSize, selectedColor]);

  // Update selected variant when size or color changes
  useEffect(() => {
    if (!product || !selectedSize || !selectedColor) return;

    const variant = product.variants.find(
      (v) => v.title === `${selectedSize} / ${selectedColor}`
    );

    setSelectedVariant(variant || null);
  }, [product, selectedSize, selectedColor]);

  const handleAddToCart = () => {
    if (product && selectedVariant) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product, selectedVariant);
      }
      setQuantity(1);
      setCartOpen(true);
    }
  };

  // Simplified variant handling
  const getVariantOptions = () => {
    if (!product) return { colors: [], sizes: [] };

    const variantGroups = {
      colors: Array.from(
        new Set(
          product.variants.map((v) => v.title.split(" / ")[1]).filter(Boolean)
        )
      ),
      sizes: Array.from(
        new Set(
          product.variants.map((v) => v.title.split(" / ")[0]).filter(Boolean)
        )
      ),
    };

    return variantGroups;
  };

  const isOptionAvailable = (size: string, color: string) => {
    if (!product) return false;

    const variant = product.variants.find(
      (v) => v.title === `${size} / ${color}`
    );

    return Boolean(variant?.available);
  };

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!product) return <div className="p-4">Loading...</div>;

  const { colors, sizes } = getVariantOptions();

  return (
    <div className="w-full">
      <section className="relative w-full bg-white">
        <div className="px-4 md:px-8 py-12 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Image Section */}
            <div className="relative md:sticky md:top-24 select-none">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                {/* Main Image */}
                <div className="order-1 md:order-2 flex-1">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    {product?.images[selectedImage] && (
                      <img
                        src={product.images[selectedImage].src}
                        alt={
                          product.images[selectedImage].altText || product.title
                        }
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="order-2 md:order-1 flex gap-2 md:flex-col md:w-24">
                  {product?.images.map((image, index) => (
                    <button
                      key={image.id || index}
                      onClick={() => setSelectedImage(index)}
                      className={`
                        relative aspect-square rounded-lg overflow-hidden flex-shrink-0
                        w-16 md:w-24 transition-all duration-200 focus:outline-none select-none
                        ${
                          selectedImage === index
                            ? "ring-2 ring-black"
                            : "opacity-75 hover:opacity-100 hover:ring-2 hover:ring-blue-400 hover:ring-offset-0"
                        }
                        ${selectedImage === index ? "hover:ring-black" : ""}
                      `}
                    >
                      <img
                        src={image.src}
                        alt={image.altText || `View ${index + 1}`}
                        className="w-full h-full object-cover"
                        draggable="false"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold font-neue mb-4">
                {product.title}
              </h1>
              <p className="text-2xl font-bold text-gray-900 mb-6">
                ${selectedVariant?.price || product.price}
              </p>

              {/* Product Description - simplified */}
              <div className="mb-8 prose prose-lg">
                <p>{product?.description}</p>
              </div>

              {/* Size Selection - moved before color */}
              <div className="select-none">
                {sizes.length > 0 && (
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Size
                      </h3>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {sizes.map((size) => {
                        const hasAvailableVariant = colors.some((color) =>
                          isOptionAvailable(size, color)
                        );

                        return (
                          <button
                            key={size}
                            onClick={() =>
                              hasAvailableVariant && setSelectedSize(size)
                            }
                            className={`
                              py-3 rounded-lg border-2 transition-all
                              ${
                                selectedSize === size
                                  ? "border-black bg-black text-white"
                                  : hasAvailableVariant
                                  ? "border-gray-200 hover:border-gray-400"
                                  : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                              }
                            `}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {colors.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">
                      Color
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {colors.map((color) => {
                        const hasAvailableVariant = selectedSize
                          ? isOptionAvailable(selectedSize, color)
                          : sizes.some((size) =>
                              isOptionAvailable(size, color)
                            );

                        return (
                          <button
                            key={color}
                            onClick={() =>
                              hasAvailableVariant && setSelectedColor(color)
                            }
                            className={`
                              px-4 py-2 rounded-lg border-2 transition-all
                              flex items-center gap-2
                              ${
                                selectedColor === color
                                  ? "border-black bg-black text-white"
                                  : hasAvailableVariant
                                  ? "border-gray-200 hover:border-gray-400"
                                  : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                              }
                            `}
                          >
                            <span
                              className="w-4 h-4 rounded-full border border-white"
                              style={{ backgroundColor: color.toLowerCase() }}
                            />
                            {color}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Features */}
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-4">Product Features</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-black rounded-full"></span>
                    Natural ingredients
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-black rounded-full"></span>
                    Cruelty-free
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-black rounded-full"></span>
                    Sustainable packaging
                  </li>
                </ul>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="mt-auto pt-8 border-t select-none">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-neue">Quantity:</span>
                  <div className="flex items-center gap-3 border rounded-lg px-3 py-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-xl font-bold text-gray-500 hover:text-gray-700"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-xl font-bold text-gray-500 hover:text-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || !selectedVariant.available}
                  className="w-full bg-black text-white py-4 rounded-lg font-neue 
                    hover:bg-gray-900 transition-colors disabled:bg-gray-300
                    disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {!selectedVariant
                      ? "Select options"
                      : !selectedVariant.available
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </span>
                  <div className="absolute inset-0 bg-gray-900 transform translate-y-full transition-transform group-hover:translate-y-0" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
