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

  const handleClick = () => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  };

  const linkClass = (path: string) => `
    text-lg ${location.pathname === path ? "text-white" : "text-white/80"}
    hover:text-white transition-colors
  `;

  const mobileMenuClass = `
    fixed inset-0 bg-black/95 z-50 md:hidden
    flex flex-col items-center justify-center gap-8
    transition-transform duration-300
    ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
  `;

  return (
    <header
      className="sticky top-0 z-50 w-full bg-black"
      style={{ overflow: "visible" }}
    >
      <nav className="max-w-[2000px] mx-auto">
        <div className="h-16 px-4 flex items-center justify-between">
          <Link
            to="/"
            onClick={handleClick}
            className="text-2xl font-bold text-white select-none"
          >
            COSMETIC
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 select-none">
            <Link to="/" onClick={handleClick} className={linkClass("/")}>
              Home
            </Link>
            <Link
              to="/shop"
              onClick={handleClick}
              className={linkClass("/shop")}
            >
              Shop
            </Link>
            <Link
              to="/about"
              onClick={handleClick}
              className={linkClass("/about")}
            >
              About
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center text-white/80 hover:text-white transition-colors bg-transparent border-none"
            >
              <ShoppingCart
                size={24}
                weight="regular"
                className="text-current"
              />
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
            <List size={24} />
          </button>

          {/* Mobile Menu Overlay */}
          <div className={mobileMenuClass}>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-5 right-8 text-white hover:text-white/80 p-0 m-0 border-0 bg-transparent"
            >
              <X size={24} />
            </button>

            <Link
              to="/"
              onClick={handleClick}
              className="text-2xl text-white/80 hover:text-white transition-colors select-none"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={handleClick}
              className="text-2xl text-white/80 hover:text-white transition-colors select-none"
            >
              Shop
            </Link>
            <Link
              to="/about"
              onClick={handleClick}
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
    </header>
  );
};
