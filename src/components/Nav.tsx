import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, List, X } from "@phosphor-icons/react";
import { useStore } from "../store/useStore";
import { useState } from "react";

export const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const cartItems = useStore((state) => state.cartItems);
  const setCartOpen = useStore((state) => state.setCartOpen);

  const totalItems = cartItems.reduce(
    (sum: number, item) => sum + item.quantity,
    0
  );

  return (
    <nav
      className="fixed top-0 left-0 right-0 bg-black z-[100]"
      style={{ width: "calc(100% - var(--scrollbar-width))" }}
    >
      <div className="w-full px-8 h-16 flex items-center justify-between font-neue">
        <Link to="/" className="text-2xl font-bold text-white select-none">
          COSMETIC
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 select-none">
          <Link
            to="/"
            className={`text-lg ${
              location.pathname === "/" ? "text-white" : "text-white/80"
            } hover:text-white transition-colors`}
          >
            Home
          </Link>
          <Link
            to="/shop"
            className={`text-lg ${
              location.pathname === "/shop" ? "text-white" : "text-white/80"
            } hover:text-white transition-colors`}
          >
            Shop
          </Link>
          <Link
            to="/about"
            className={`text-lg ${
              location.pathname === "/about" ? "text-white" : "text-white/80"
            } hover:text-white transition-colors`}
          >
            About
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center justify-center text-white/80 hover:text-white transition-colors bg-transparent border-none"
          >
            <ShoppingCart size={24} weight="regular" className="text-current" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white/80 hover:text-white transition-colors bg-transparent border-none"
        >
          {isMenuOpen ? <X size={24} /> : <List size={24} />}
        </button>

        {/* Mobile Menu Overlay */}
        <div
          className={`
          fixed inset-0 bg-black/95 z-50 md:hidden
          flex flex-col items-center justify-center gap-8
          transition-opacity duration-300
          ${
            isMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
        >
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-5 right-8 text-white/80 hover:text-white"
          >
            <X size={24} />
          </button>

          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="text-2xl text-white/80 hover:text-white transition-colors select-none"
          >
            Home
          </Link>
          <Link
            to="/shop"
            onClick={() => setIsMenuOpen(false)}
            className="text-2xl text-white/80 hover:text-white transition-colors select-none"
          >
            Shop
          </Link>
          <Link
            to="/about"
            onClick={() => setIsMenuOpen(false)}
            className="text-2xl text-white/80 hover:text-white transition-colors select-none"
          >
            About
          </Link>
          <button
            onClick={() => {
              setCartOpen(true);
              setIsMenuOpen(false);
            }}
            className="relative flex items-center justify-center text-white/80 hover:text-white transition-colors bg-transparent border-none"
          >
            <ShoppingCart size={24} weight="regular" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
