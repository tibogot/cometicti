import { useStore } from "../store/useStore";

export const CartBackdrop = () => {
  const isCartOpen = useStore((state) => state.isCartOpen);
  const setCartOpen = useStore((state) => state.setCartOpen);

  return (
    <div
      onClick={() => setCartOpen(false)}
      className={`
        fixed inset-0 bg-black/50 z-[80]
        transition-opacity duration-300
        ${
          isCartOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }
      `}
    />
  );
};
