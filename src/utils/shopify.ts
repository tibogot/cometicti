import { GraphQLClient } from "graphql-request";
import { ShopifyProduct } from "../types/store.types";

// Add type definitions for API responses
interface ShopifyImageEdge {
  node: {
    id: string;
    src: string;
    altText: string | null;
  };
}

interface ShopifyVariantEdge {
  node: {
    id: string;
    title: string;
    price: {
      amount: string;
    };
    availableForSale: boolean;
  };
}

interface ShopifyProductResponse {
  id: string;
  title: string;
  handle: string;
  description: string;
  productType: string; // Added this
  vendor: string; // Added this
  images: {
    edges: ShopifyImageEdge[];
  };
  variants: {
    edges: ShopifyVariantEdge[];
  };
}

// interface GetProductsResponse {
//   products: {
//     edges: Array<{
//       node: ShopifyProductResponse;
//     }>;
//   };
// }

interface GetProductByHandleResponse {
  product: ShopifyProductResponse;
}

interface ProductQueryOptions {
  first?: number;
  after?: string;
  sortKey?: "TITLE" | "PRICE"; // Add specific sort keys
  reverse?: boolean; // Controls ascending/descending
  query?: string;
}

interface ProductsQueryResponse {
  products: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    edges: Array<{
      node: ShopifyProductResponse;
    }>;
  };
}

export class ShopifyClient {
  private client: GraphQLClient;
  // private cachedProductTypes: string[] = [];
  // private cachedVendors: string[] = [];

  constructor(shopDomain: string, accessToken: string) {
    this.client = new GraphQLClient(
      `https://${shopDomain}/api/2024-01/graphql.json`,
      {
        headers: {
          "X-Shopify-Storefront-Access-Token": accessToken,
        },
      }
    );
  }

  async getAllProducts(options: ProductQueryOptions = {}): Promise<{
    products: ShopifyProduct[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  }> {
    const query = `
      query GetProducts($first: Int!, $after: String, $sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
        products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, query: $query) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              description
              productType
              vendor
              priceRange {
                minVariantPrice {
                  amount
                }
              }
              images(first: 5) {
                edges {
                  node {
                    id
                    src: originalSrc
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                    }
                    availableForSale
                  }
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      first: options.first || 12,
      after: options.after,
      sortKey: options.sortKey || "TITLE",
      reverse: options.reverse || false,
      query: options.query,
    };

    const data = await this.client.request<ProductsQueryResponse>(
      query,
      variables
    );

    // Extract unique product types and vendors from the response
    const productTypes = new Set<string>();
    const vendors = new Set<string>();

    data.products.edges.forEach(({ node }) => {
      if (node.productType) productTypes.add(node.productType);
      if (node.vendor) vendors.add(node.vendor);
    });

    // this.cachedProductTypes = Array.from(productTypes);
    // this.cachedVendors = Array.from(vendors);

    return {
      products: this.formatProducts(data.products.edges),
      pageInfo: data.products.pageInfo,
    };
  }

  async getProductByHandle(handle: string): Promise<ShopifyProduct> {
    const query = `
      query getProductByHandle($handle: String!) {
        product(handle: $handle) {
          id
          title
          handle
          description
          variants(first: 250) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                }
              }
            }
          }
          images(first: 250) {
            edges {
              node {
                id
                src: originalSrc
                altText
              }
            }
          }
        }
      }
    `;

    const response = await this.client.request<GetProductByHandleResponse>(
      query,
      { handle }
    );
    const product = response.product;

    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.description,
      images: product.images.edges.map((edge) => ({
        id: edge.node.id,
        src: edge.node.src,
        altText: edge.node.altText,
      })),
      variants: product.variants.edges.map((edge) => ({
        id: edge.node.id,
        title: edge.node.title,
        price: edge.node.price.amount,
        available: edge.node.availableForSale,
      })),
      price: product.variants.edges[0]?.node.price.amount || "0.00",
    };
  }

  async getProductTypes(): Promise<string[]> {
    const query = `
      query GetProductTypes {
        products(first: 250) {
          edges {
            node {
              productType
            }
          }
        }
      }
    `;

    try {
      const data = await this.client.request<{
        products: {
          edges: Array<{ node: { productType: string } }>;
        };
      }>(query);

      const types = new Set(
        data.products.edges
          .map((edge) => edge.node.productType)
          .filter((type) => type !== "")
      );

      return Array.from(types);
    } catch (error) {
      console.error("Error fetching product types:", error);
      return [];
    }
  }

  async getVendors(): Promise<string[]> {
    const query = `
      query GetVendors {
        products(first: 250) {
          edges {
            node {
              vendor
            }
          }
        }
      }
    `;

    try {
      const data = await this.client.request<{
        products: {
          edges: Array<{ node: { vendor: string } }>;
        };
      }>(query);

      const vendors = new Set(
        data.products.edges
          .map((edge) => edge.node.vendor)
          .filter((vendor) => vendor !== "")
      );

      return Array.from(vendors);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      return [];
    }
  }

  private formatProduct(product: ShopifyProductResponse): ShopifyProduct {
    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.description,
      images: product.images.edges.map((edge: ShopifyImageEdge) => ({
        id: edge.node.id,
        src: edge.node.src,
        altText: edge.node.altText,
      })),
      variants: product.variants.edges.map((edge: ShopifyVariantEdge) => ({
        id: edge.node.id,
        title: edge.node.title,
        price: edge.node.price.amount,
        available: edge.node.availableForSale,
      })),
      price: product.variants.edges[0]?.node.price.amount || "0.00",
    };
  }

  private formatProducts(
    products: Array<{ node: ShopifyProductResponse }>
  ): ShopifyProduct[] {
    return products.map(({ node }) => this.formatProduct(node));
  }
}
