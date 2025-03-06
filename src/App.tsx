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

function App() {
  const setShopifyAccess = useStore((state) => state.setShopifyAccess);
  const loadCartFromStorage = useStore((state) => state.loadCartFromStorage);

  useEffect(() => {
    setShopifyAccess({
      // Update these values with your Shopify store credentials
      shopDomain: "cometicti.myshopify.com", // Your store domain
      accessToken: "5cd5d06e253d551c46f99b8de1d1c048", // Your Storefront API access token
    });
    loadCartFromStorage();
  }, [setShopifyAccess, loadCartFromStorage]);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
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
