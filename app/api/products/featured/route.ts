import { NextResponse } from 'next/server';
import { getFeaturedProducts } from '@/lib/shopify/fetch';

export async function GET() {
  try {
    const products = await getFeaturedProducts().catch(() => []);
    return NextResponse.json({ data: products });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
