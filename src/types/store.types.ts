export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: Array<{
    id: string;
    src: string;
    altText: string | null;
  }>;
  variants: ShopifyVariant[];
  price: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: string;
  available: boolean;
}

export interface ShopifyImage {
  id: string;
  src: string;
  altText: string | null;
}

export interface CartItem {
  id: string;
  quantity: number;
  variant: ShopifyVariant;
  product: ShopifyProduct;
}

export interface CartState {
  isLoading: boolean;
  error: string | null;
  lastUpdated: number;
}

export interface StoreState {
  isCartOpen: boolean;
  cartItems: CartItem[];
  shopifyAccess: {
    accessToken: string;
    shopDomain: string;
  } | null;
  cartState: CartState;

  // Actions
  setCartOpen: (isOpen: boolean) => void;
  addToCart: (product: ShopifyProduct, variant: ShopifyVariant) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setShopifyAccess: (
    access: {
      accessToken: string;
      shopDomain: string;
    } | null
  ) => void;
  saveCartToStorage: () => void;
  loadCartFromStorage: () => void;
  setCartError: (error: string | null) => void;
  setCartLoading: (isLoading: boolean) => void;
}
