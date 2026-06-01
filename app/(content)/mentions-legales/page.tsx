import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales de Ritual Glowry — éditeur, hébergement, propriété intellectuelle.',
}

const LAST_UPDATED = '1er juin 2026'

export default function MentionsLegalesPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="flex items-center justify-center py-20"
        style={{ background: 'linear-gradient(135deg, #1A1410 0%, #3D2B1F 100%)' }}
      >
        <div className="text-center px-4">
          <h1 className="font-playfair italic text-[#FAF6EF] text-4xl md:text-5xl mb-3">
            Mentions légales
          </h1>
          <p className="font-inter text-[#FAF6EF]/50 text-sm">
            Dernière mise à jour : {LAST_UPDATED}
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-8 max-w-3xl py-16 space-y-10">
        <section>
          <h2 className="font-playfair italic text-[#3D2B1F] text-2xl mb-4">
            1. Éditeur du site
          </h2>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed">
            Le site <strong>ritualglowry.ma</strong> est édité par la société <strong>Ritual Glowry SARL</strong>,
            société à responsabilité limitée au capital social de 100 000 MAD, immatriculée au Registre
            du Commerce de Casablanca sous le numéro RC XXXXXXX. Siège social : Boulevard Anfa,
            Casablanca 20000, Maroc. Téléphone : +212 6XX XXX XXX. Email : contact@ritualglowry.ma.
            Directeur de la publication : Directeur Général de Ritual Glowry.
          </p>
        </section>

        <section>
          <h2 className="font-playfair italic text-[#3D2B1F] text-2xl mb-4">
            2. Hébergement
          </h2>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed">
            Ce site est hébergé par <strong>Vercel Inc.</strong>, 340 Pine Street Suite 701,
            San Francisco, CA 94104, États-Unis. Site web : vercel.com. Les données sont stockées
            sur des serveurs situés dans l'Union Européenne conformément aux règles de protection
            des données applicables.
          </p>
        </section>

        <section>
          <h2 className="font-playfair italic text-[#3D2B1F] text-2xl mb-4">
            3. Propriété intellectuelle
          </h2>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed">
            L'ensemble des éléments constitutifs du site ritualglowry.ma (textes, images, logos,
            vidéos, base de données, structure du site, charte graphique, etc.) sont la propriété
            exclusive de Ritual Glowry ou font l'objet d'une autorisation d'utilisation. Toute
            reproduction, représentation, modification, publication ou adaptation de tout ou partie
            des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf
            autorisation écrite préalable de Ritual Glowry.
          </p>
        </section>

        <section>
          <h2 className="font-playfair italic text-[#3D2B1F] text-2xl mb-4">
            4. Responsabilité
          </h2>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed">
            Ritual Glowry s'efforce d'assurer l'exactitude et la mise à jour des informations
            diffusées sur ce site, dont elle se réserve le droit de corriger, à tout moment et sans
            préavis, le contenu. Toutefois, Ritual Glowry ne peut garantir l'exactitude, la précision
            ou l'exhaustivité des informations mises à la disposition sur ce site. En conséquence,
            Ritual Glowry décline toute responsabilité pour les imprécisions, inexactitudes ou
            omissions portant sur des informations disponibles sur ce site.
          </p>
        </section>

        <section>
          <h2 className="font-playfair italic text-[#3D2B1F] text-2xl mb-4">
            5. Droit applicable
          </h2>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed">
            Les présentes mentions légales sont soumises au droit marocain. En cas de litige,
            les tribunaux de Casablanca seront seuls compétents.
          </p>
        </section>
      </div>
    </>
  )
}
