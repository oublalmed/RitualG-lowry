export const PRODUCTS_QUERY = `
  query Products($first: Int!, $after: String, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {
      edges {
        node {
          id
          handle
          title
          description
          descriptionHtml
          productType
          tags
          vendor
          createdAt
          updatedAt
          images(first: 10) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 30) {
            edges {
              node {
                id
                title
                sku
                availableForSale
                quantityAvailable
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                selectedOptions { name value }
              }
            }
          }
          priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
          compareAtPriceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      productType
      tags
      vendor
      createdAt
      updatedAt
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            sku
            availableForSale
            quantityAvailable
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            selectedOptions { name value }
          }
        }
      }
      priceRange {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      compareAtPriceRange {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
    }
  }
`;

export const COLLECTIONS_QUERY = `
  query Collections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          image { url altText }
          products(first: 12) {
            edges {
              node {
                id
                handle
                title
                images(first: 1) {
                  edges {
                    node { url altText }
                  }
                }
                priceRange {
                  minVariantPrice { amount currencyCode }
                }
                compareAtPriceRange {
                  minVariantPrice { amount currencyCode }
                }
                tags
                productType
                variants(first: 30) {
                  edges {
                    node {
                      id
                      title
                      sku
                      availableForSale
                      quantityAvailable
                      price { amount currencyCode }
                      compareAtPrice { amount currencyCode }
                      selectedOptions { name value }
                    }
                  }
                }
                createdAt
              }
            }
          }
        }
      }
    }
  }
`;

export const COLLECTION_BY_HANDLE_QUERY = `
  query CollectionByHandle($handle: String!, $first: Int!, $after: String) {
    collectionByHandle(handle: $handle) {
      id
      handle
      title
      description
      image { url altText }
      products(first: $first, after: $after) {
        edges {
          node {
            id
            handle
            title
            description
            descriptionHtml
            productType
            tags
            vendor
            createdAt
            updatedAt
            images(first: 10) {
              edges {
                node { url altText width height }
              }
            }
            variants(first: 30) {
              edges {
                node {
                  id
                  title
                  sku
                  availableForSale
                  quantityAvailable
                  price { amount currencyCode }
                  compareAtPrice { amount currencyCode }
                  selectedOptions { name value }
                }
              }
            }
            priceRange {
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
            compareAtPriceRange {
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
`;
