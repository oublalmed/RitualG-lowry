import type { Metadata } from 'next';
import { FaqPageClient } from '@/components/faq/FaqPageClient';
import { getFaqItems } from '@/lib/sanity/fetch';

export const metadata: Metadata = {
  title: 'FAQ | Ritual Glowry',
  description:
    'Retrouvez les réponses à toutes vos questions sur nos extensions, notre livraison, nos paiements et nos retours.',
};

/**
 * Convert portable-text answer blocks to plain text for JSON-LD and the client component.
 */
function portableTextToPlain(blocks: any): string {
  if (typeof blocks === 'string') return blocks;
  if (!Array.isArray(blocks)) return '';
  return blocks
    .filter((b: any) => b._type === 'block')
    .map((b: any) => b.children?.map((c: any) => c.text).join('') ?? '')
    .join('\n');
}

export default async function FaqPage() {
  const faqItems = await getFaqItems();

  // Group FAQ items by category to match the FaqPageClient interface
  const categoryMap = new Map<string, { id: string; label: string; questions: { q: string; a: string }[] }>();

  for (const item of faqItems ?? []) {
    const catId = item.category || 'general';
    const catLabel = catId.charAt(0).toUpperCase() + catId.slice(1);

    if (!categoryMap.has(catId)) {
      categoryMap.set(catId, { id: catId, label: catLabel, questions: [] });
    }
    categoryMap.get(catId)!.questions.push({
      q: item.question,
      a: portableTextToPlain(item.answer),
    });
  }

  const faqCategories = Array.from(categoryMap.values());

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqCategories.flatMap((cat) =>
      cat.questions.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      }))
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FaqPageClient categories={faqCategories} />
    </>
  );
}
