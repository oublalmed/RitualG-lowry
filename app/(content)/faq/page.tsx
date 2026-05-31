import type { Metadata } from 'next';
import { FaqPageClient } from '@/components/faq/FaqPageClient';

export const metadata: Metadata = {
  title: 'FAQ | Ritual Glowry',
  description:
    'Retrouvez les réponses à toutes vos questions sur nos extensions, notre livraison, nos paiements et nos retours.',
};

const faqCategories = [
  {
    id: 'livraison',
    label: 'Livraison',
    questions: [
      {
        q: 'Quel est le délai de livraison ?',
        a: 'Nous livrons en 2 à 4 jours ouvrables dans tout le Maroc. La livraison express (24h) est disponible pour Casablanca, Rabat et Marrakech.',
      },
      {
        q: 'La livraison est-elle gratuite ?',
        a: 'La livraison est offerte dès 1 200 MAD d\'achat. En dessous de ce montant, les frais de livraison sont de 30 MAD.',
      },
      {
        q: 'Livrez-vous à l\'international ?',
        a: 'Actuellement, nous livrons uniquement au Maroc. L\'expansion internationale est prévue pour fin 2026.',
      },
      {
        q: 'Comment suivre ma commande ?',
        a: 'Un email de confirmation avec un lien de suivi vous est envoyé dès l\'expédition de votre commande.',
      },
    ],
  },
  {
    id: 'produits',
    label: 'Produits',
    questions: [
      {
        q: 'Vos extensions sont-elles 100% naturelles ?',
        a: 'Oui, toutes nos extensions sont fabriquées avec des cheveux Remy 100% naturels, avec les cuticules alignées pour un rendu optimal.',
      },
      {
        q: 'Combien de temps durent les extensions ?',
        a: 'Avec un entretien approprié, nos extensions peuvent durer entre 6 mois et 2 ans selon le type et la fréquence d\'utilisation.',
      },
      {
        q: 'Puis-je teindre ou chauffer les extensions ?',
        a: 'Oui, nos extensions naturelles supportent la coloration et la chaleur (jusqu\'à 180°C). Nous recommandons l\'utilisation d\'un protecteur thermique.',
      },
      {
        q: 'Comment entretenir mes extensions ?',
        a: 'Lavez avec un shampooing doux, conditionnez régulièrement, démêlez délicatement et rangez dans un endroit sec à l\'abri du soleil.',
      },
    ],
  },
  {
    id: 'paiement',
    label: 'Paiement',
    questions: [
      {
        q: 'Quels moyens de paiement acceptez-vous ?',
        a: 'Nous acceptons les cartes bancaires (Visa, Mastercard), Apple Pay, le virement bancaire et le paiement à la livraison.',
      },
      {
        q: 'Le paiement est-il sécurisé ?',
        a: 'Oui, tous les paiements sont traités via Stripe, une plateforme sécurisée certifiée PCI DSS. Vos données bancaires ne sont jamais stockées sur nos serveurs.',
      },
      {
        q: 'Puis-je payer en plusieurs fois ?',
        a: 'Oui, nous proposons le paiement en 3 ou 6 fois sans frais pour les commandes supérieures à 1 500 MAD.',
      },
    ],
  },
  {
    id: 'retours',
    label: 'Retours',
    questions: [
      {
        q: 'Puis-je retourner un produit ?',
        a: 'Oui, vous disposez de 30 jours après réception pour retourner un produit non utilisé dans son emballage d\'origine.',
      },
      {
        q: 'Les retours sont-ils gratuits ?',
        a: 'Oui, les retours sont gratuits. Nous vous envoyons une étiquette de retour prépayée par email.',
      },
      {
        q: 'Dans quel délai serai-je remboursée ?',
        a: 'Le remboursement est effectué sous 5 à 7 jours ouvrables après réception et vérification du retour.',
      },
    ],
  },
  {
    id: 'compte',
    label: 'Compte',
    questions: [
      {
        q: 'Comment créer un compte ?',
        a: 'Cliquez sur l\'icône profil en haut à droite et sélectionnez "Créer un compte". Vous pouvez également vous inscrire lors de votre premier achat.',
      },
      {
        q: 'J\'ai oublié mon mot de passe, que faire ?',
        a: 'Cliquez sur "Mot de passe oublié" sur la page de connexion. Vous recevrez un email de réinitialisation dans les 5 minutes.',
      },
      {
        q: 'Comment modifier mes informations personnelles ?',
        a: 'Connectez-vous à votre compte, accédez à "Mon Profil" et vous pourrez modifier toutes vos informations.',
      },
    ],
  },
];

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

export default function FaqPage() {
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
