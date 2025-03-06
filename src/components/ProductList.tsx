import { useEffect, useState } from "react";
import { ShopifyProduct } from "../types/store.types";
import { ShopifyClient } from "../utils/shopify";
import { useStore } from "../store/useStore";
import { ProductCard } from "./ProductCard";
import { FunnelSimple } from "@phosphor-icons/react";

type SortOption = {
  key: "TITLE" | "PRICE";
  reverse: boolean;
};

export const ProductList = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
  const shopifyAccess = useStore((state) => state.shopifyAccess);

  // Filter states
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortOption>({
    key: "TITLE",
    reverse: false,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [vendors, setVendors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSortChange = (value: string) => {
    switch (value) {
      case "TITLE_ASC":
        setSortConfig({ key: "TITLE", reverse: false });
        break;
      case "TITLE_DESC":
        setSortConfig({ key: "TITLE", reverse: true });
        break;
      case "PRICE_ASC":
        setSortConfig({ key: "PRICE", reverse: false });
        break;
      case "PRICE_DESC":
        setSortConfig({ key: "PRICE", reverse: true });
        break;
    }
  };

  const fetchProducts = async (cursor?: string) => {
    if (!shopifyAccess) return;

    const client = new ShopifyClient(
      shopifyAccess.shopDomain,
      shopifyAccess.accessToken
    );

    try {
      setLoading(true);
      let query = "";
      if (searchQuery) query += `title:*${searchQuery}* `;
      if (selectedType) query += `product_type:${selectedType} `;
      if (selectedVendor) query += `vendor:${selectedVendor} `;

      const response = await client.getAllProducts({
        first: 12,
        after: cursor,
        sortKey: sortConfig.key,
        reverse: sortConfig.reverse,
        query: query.trim() || undefined,
      });

      if (cursor) {
        setProducts((prev) => [...prev, ...response.products]);
      } else {
        setProducts(response.products);
      }

      setHasMore(response.pageInfo.hasNextPage);
      setEndCursor(response.pageInfo.endCursor);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    if (!shopifyAccess) return;

    const client = new ShopifyClient(
      shopifyAccess.shopDomain,
      shopifyAccess.accessToken
    );

    try {
      const [types, vendorList] = await Promise.all([
        client.getProductTypes(),
        client.getVendors(),
      ]);

      setProductTypes(types);
      setVendors(vendorList);
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [shopifyAccess, selectedType, selectedVendor, sortConfig, searchQuery]);

  useEffect(() => {
    fetchFilters();
  }, [shopifyAccess]);

  return (
    <div className="w-full min-h-screen pt-24 pb-20 flex flex-col">
      <div className="px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold font-neue">All Products</h1>

          <div className="flex items-center gap-4">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border rounded-lg w-64"
            />

            {/* Sort Dropdown */}
            <select
              value={`${sortConfig.key}_${sortConfig.reverse ? "DESC" : "ASC"}`}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="TITLE_ASC">Name (A-Z)</option>
              <option value="TITLE_DESC">Name (Z-A)</option>
              <option value="PRICE_ASC">Price (Low to High)</option>
              <option value="PRICE_DESC">Price (High to Low)</option>
            </select>

            {/* Filter Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg"
            >
              <FunnelSimple size={20} />
              Filters
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="mb-8 p-4 border rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              {/* Type Filter */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Product Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">All Types</option>
                  {productTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vendor Filter */}
              <div>
                <label className="block mb-2 text-sm font-medium">Vendor</label>
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">All Vendors</option>
                  {vendors.map((vendor) => (
                    <option key={vendor} value={vendor}>
                      {vendor}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid with Loading State */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[800px]">
          {loading
            ? // Loading skeleton
              Array(8)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 w-2/3 mb-2 rounded"></div>
                    <div className="bg-gray-200 h-4 w-1/3 rounded"></div>
                  </div>
                ))
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={() => fetchProducts(endCursor)}
              disabled={loading}
              className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
