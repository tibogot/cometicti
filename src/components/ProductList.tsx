import { useEffect, useState } from "react";
import { ShopifyProduct } from "../types/store.types";
import { ShopifyClient } from "../utils/shopify";
import { useStore } from "../store/useStore";
import { ProductCard } from "./ProductCard";
import { FunnelSimple } from "@phosphor-icons/react";

type SortKey = "TITLE" | "PRICE";

interface Filters {
  type: string;
  vendor: string;
  search: string;
  sort: {
    key: SortKey;
    reverse: boolean;
  };
}

export const ProductList = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
  const shopifyAccess = useStore((state) => state.shopifyAccess);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [vendors, setVendors] = useState<string[]>([]);

  // Combine filter states into a single object
  const [filters, setFilters] = useState<Filters>({
    type: "",
    vendor: "",
    search: "",
    sort: {
      key: "TITLE",
      reverse: false,
    },
  });

  const handleSortChange = (value: string) => {
    switch (value) {
      case "TITLE_ASC":
        setFilters((prev) => ({
          ...prev,
          sort: { key: "TITLE", reverse: false },
        }));
        break;
      case "TITLE_DESC":
        setFilters((prev) => ({
          ...prev,
          sort: { key: "TITLE", reverse: true },
        }));
        break;
      case "PRICE_ASC":
        setFilters((prev) => ({
          ...prev,
          sort: { key: "PRICE", reverse: false },
        }));
        break;
      case "PRICE_DESC":
        setFilters((prev) => ({
          ...prev,
          sort: { key: "PRICE", reverse: true },
        }));
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
      const query = [
        filters.search && `title:*${filters.search}*`,
        filters.type && `product_type:${filters.type}`,
        filters.vendor && `vendor:${filters.vendor}`,
      ]
        .filter(Boolean)
        .join(" ");

      const response = await client.getAllProducts({
        first: 12,
        after: cursor,
        sortKey: filters.sort.key,
        reverse: filters.sort.reverse,
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
  }, [shopifyAccess, filters]);

  useEffect(() => {
    fetchFilters();
  }, [shopifyAccess]);

  return (
    <div className="w-full min-h-screen pt-24 pb-20 flex flex-col">
      <div className="px-4 md:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-neue">
            All Products
          </h1>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="px-4 py-2 border rounded-lg"
            />
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg min-w-[100px]"
            >
              <FunnelSimple size={20} />
              <span className="hidden md:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="mb-8 p-4 border rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type Filter */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Product Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, type: e.target.value }))
                  }
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
                  value={filters.vendor}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, vendor: e.target.value }))
                  }
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

        {/* Products Grid with Minimum Height */}
        <div className="min-h-[800px]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {loading
              ? // Loading skeleton with same layout as products
                Array(12)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex flex-col">
                      <div className="aspect-square bg-gray-200 rounded-lg mb-4 animate-pulse" />
                      <div className="space-y-2 p-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                      </div>
                    </div>
                  ))
              : products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>

          {/* Load More Section with Fixed Height */}
          <div className="h-20 mt-8 md:mt-12 flex items-center justify-center">
            {hasMore && (
              <button
                onClick={() => fetchProducts(endCursor)}
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </div>
                ) : (
                  "Load More"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
