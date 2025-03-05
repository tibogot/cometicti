import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="w-full bg-black text-white py-20">
      <div className="w-full px-8">
        {" "}
        {/* Changed from just px-8 */}
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-12">
          {" "}
          {/* Added w-full */}
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold font-neue">COSMETIC</h2>
            <p className="text-white/80">
              Natural and organic cosmetics for your daily beauty routine.
            </p>
          </div>
          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold font-neue mb-2">Quick Links</h3>
            <Link
              to="/"
              className="text-white/80 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-white/80 hover:text-white transition-colors"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="text-white/80 hover:text-white transition-colors"
            >
              About
            </Link>
            <a
              href="#"
              className="text-white/80 hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
          {/* Legal */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold font-neue mb-2">Legal</h3>
            <a
              href="#"
              className="text-white/80 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-white/80 hover:text-white transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-white/80 hover:text-white transition-colors"
            >
              Shipping Policy
            </a>
          </div>
          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold font-neue mb-2">Newsletter</h3>
            <p className="text-white/80">
              Subscribe to our newsletter for updates and exclusive offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-white/10 px-4 py-2 rounded-lg flex-grow text-white placeholder:text-white/50"
              />
              <button className="bg-white text-black px-4 py-2 rounded-lg font-neue hover:bg-white/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        {/* Copyright */}
        <div className="w-full border-t border-white/10 mt-16 pt-8 text-center text-white/60">
          <p>© 2024 COSMETIC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
