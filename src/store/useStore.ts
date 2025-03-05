import { create } from "zustand";
import { StoreState } from "../types/store.types";

const CART_STORAGE_KEY = "cosmetic-cart";

export const useStore = create<StoreState>((set, get) => ({
  isCartOpen: false,
  cartItems: [],
  shopifyAccess: null,

  cartState: {
    isLoading: false,
    error: null,
    lastUpdated: Date.now(),
  },

  setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  setShopifyAccess: (access) => set({ shopifyAccess: access }),

  setCartLoading: (isLoading) =>
    set((state) => ({
      cartState: { ...state.cartState, isLoading, error: null },
    })),

  setCartError: (error) =>
    set((state) => ({
      cartState: { ...state.cartState, error, isLoading: false },
    })),

  saveCartToStorage: () => {
    const { cartItems } = get();
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      set((state) => ({
        cartState: { ...state.cartState, lastUpdated: Date.now() },
      }));
    } catch (error) {
      get().setCartError("Failed to save cart");
    }
  },

  loadCartFromStorage: () => {
    get().setCartLoading(true);
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const cartItems = JSON.parse(stored);
        set({ cartItems });
      }
    } catch (error) {
      get().setCartError("Failed to load cart");
    } finally {
      get().setCartLoading(false);
    }
  },

  addToCart: (product, variant) => {
    get().setCartLoading(true);
    try {
      const { cartItems } = get();
      const existingItem = cartItems.find(
        (item) => item.variant.id === variant.id
      );

      if (existingItem) {
        const updatedItems = cartItems.map((item) =>
          item.variant.id === variant.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        set({ cartItems: updatedItems });
      } else {
        set({
          cartItems: [
            ...cartItems,
            { id: variant.id, quantity: 1, variant, product },
          ],
        });
      }
      get().saveCartToStorage();
    } catch (error) {
      get().setCartError("Failed to add item to cart");
    } finally {
      get().setCartLoading(false);
    }
  },

  removeFromCart: (itemId) => {
    get().setCartLoading(true);
    try {
      const { cartItems } = get();
      set({ cartItems: cartItems.filter((item) => item.id !== itemId) });
      get().saveCartToStorage();
    } catch (error) {
      get().setCartError("Failed to remove item from cart");
    } finally {
      get().setCartLoading(false);
    }
  },

  updateQuantity: (itemId, quantity) => {
    get().setCartLoading(true);
    try {
      const { cartItems } = get();
      if (quantity < 1) {
        set({ cartItems: cartItems.filter((item) => item.id !== itemId) });
        get().saveCartToStorage();
        return;
      }
      set({
        cartItems: cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        ),
      });
      get().saveCartToStorage();
    } catch (error) {
      get().setCartError("Failed to update quantity");
    } finally {
      get().setCartLoading(false);
    }
  },

  clearCart: () => {
    get().setCartLoading(true);
    try {
      set({ cartItems: [] });
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      get().setCartError("Failed to clear cart");
    } finally {
      get().setCartLoading(false);
    }
  },
}));
