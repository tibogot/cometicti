import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 md:py-20">
      <div className="px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Shop
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4">Stay Updated</h3>
            <p className="text-white/80 mb-4">Subscribe to our newsletter</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg bg-white/10 text-white placeholder:text-white/50 flex-1"
              />
              <button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors">
                Subscribe
              </button>
            </form>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <address className="not-italic text-white/80">
              <p>1234 Street Name</p>
              <p>City, State 12345</p>
              <p>Email: info@cosmetic.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/60">
          <p>
            &copy; {new Date().getFullYear()} Cosmetic. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
