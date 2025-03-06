import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./components/HomePage";
import { ProductList } from "./components/ProductList";
import { ProductPage } from "./components/ProductPage";
import { Nav } from "./components/Nav";
import { useStore } from "./store/useStore";
import { CartDrawer } from "./components/CartDrawer";
import { CartBackdrop } from "./components/CartBackdrop";
import { Footer } from "./components/Footer";
import { AboutPage } from "./components/AboutPage";
import { BackToTop } from "./components/BackToTop";
import { ScrollToTop } from "./components/ScrollToTop";

function App() {
  const setShopifyAccess = useStore((state) => state.setShopifyAccess);
  const loadCartFromStorage = useStore((state) => state.loadCartFromStorage);

  useEffect(() => {
    setShopifyAccess({
      shopDomain: import.meta.env.VITE_SHOPIFY_DOMAIN,
      accessToken: import.meta.env.VITE_SHOPIFY_ACCESS_TOKEN,
    });
    loadCartFromStorage();
  }, [setShopifyAccess, loadCartFromStorage]);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <ScrollToTop />
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ProductList />} />
            <Route path="/product/:handle" element={<ProductPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
        <BackToTop />
        <CartDrawer />
        <CartBackdrop />
      </div>
    </BrowserRouter>
  );
}

export default App;
