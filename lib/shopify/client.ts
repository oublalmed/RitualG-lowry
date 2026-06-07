const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!;

const endpoint = `https://${domain}/api/2024-10/graphql.json`;

export async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Shopify fetch failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors) {
    console.error("[shopify] GraphQL errors:", JSON.stringify(json.errors));
    throw new Error(json.errors[0]?.message ?? "Unknown Shopify error");
  }

  return json.data as T;
}
