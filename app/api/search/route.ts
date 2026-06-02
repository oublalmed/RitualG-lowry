import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity/client';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ data: [] });
    }

    const results = await sanityClient.fetch(
      `*[_type == "product" && !(_id in path("drafts.**")) && (
        name match $pattern ||
        shortDescription match $pattern
      )] | order(_score desc) [0...6] {
        _id,
        name,
        "slug": slug.current,
        basePrice,
        "image": images[0].asset->url,
        "category": category->name
      }`,
      { pattern: `${q}*` }
    ).catch(() => []);

    return NextResponse.json({ data: results });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
