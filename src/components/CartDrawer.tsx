import { useStore } from "../store/useStore";
import { X } from "@phosphor-icons/react";

export const CartDrawer = () => {
  const isCartOpen = useStore((state) => state.isCartOpen);
  const setCartOpen = useStore((state) => state.setCartOpen);
  const cartItems = useStore((state) => state.cartItems);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const { isLoading, error } = useStore((state) => state.cartState);

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.variant.price) * item.quantity,
    0
  );

  const formatVariantTitle = (title: string) => {
    const [size, color] = title.split(" / ");
    if (color) {
      return `Size: ${size} - Color: ${color}`;
    }
    return `Size: ${size}`;
  };

  return (
    <div
      className={`
        fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-[1000]
        transform transition-transform duration-300 ease-in-out
        ${isCartOpen ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <div className="h-full flex flex-col p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold font-neue">Your Cart</h2>
          <button
            onClick={() => setCartOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded mb-4">{error}</div>
        )}

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 font-neue">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 border-b pb-4">
                  {item.product.images[0] && (
                    <img
                      src={item.product.images[0].src}
                      alt={item.product.images[0].altText || item.product.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-neue">{item.product.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatVariantTitle(item.variant.title)}
                    </p>
                    <p className="text-gray-500">${item.variant.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="text-gray-500 hover:text-gray-700"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="text-gray-500 hover:text-gray-700"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between mb-4">
                <span className="font-neue">Total</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </div>
              <button className="w-full bg-black text-white py-3 rounded-lg font-neue">
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
