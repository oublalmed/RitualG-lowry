import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente',
  description: 'Conditions générales de vente de Ritual Glowry — commandes, livraison, retours et garanties.',
}

const LAST_UPDATED = '1er juin 2026'

export default function CGVPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="flex items-center justify-center py-20"
        style={{ background: 'linear-gradient(135deg, #1A1410 0%, #3D2B1F 100%)' }}
      >
        <div className="text-center px-4">
          <h1 className="font-playfair italic text-[#FAF6EF] text-4xl md:text-5xl mb-3">
            Conditions Générales de Vente
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
            1. Produits
          </h2>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed">
            Les produits proposés à la vente sur le site ritualglowry.ma sont des extensions
            capillaires, perruques et accessoires cheveux de qualité premium. Nos produits sont
            fabriqués à partir de cheveux 100% naturels Remy, issus de sources éthiques et certifiées.
            Les photographies et descriptions des produits sont fournies à titre indicatif. Des
            variations de couleur peuvent exister en fonction de votre écran.
          </p>
        </section>

        <section>
          <h2 className="font-playfair italic text-[#3D2B1F] text-2xl mb-4">
            2. Prix
          </h2>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed">
            Les prix affichés sur le site sont indiqués en Dirhams Marocains (€), toutes taxes
            comprises. Ritual Glowry se réserve le droit de modifier ses prix à tout moment.
            Les produits seront facturés au prix en vigueur au moment de la validation de la commande.
            Les frais de livraison sont offerts pour toute commande supérieure à 1 200 €.
          </p>
        </section>

        <section>
          <h2 className="font-playfair italic text-[#3D2B1F] text-2xl mb-4">
            3. Commandes
          </h2>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed">
            Pour passer commande, l'acheteur doit suivre le processus de commande en ligne.
            Toute commande implique l'acceptation des présentes conditions générales de vente.
            La validation de la commande par l'acheteur vaut signature et acceptation expresse de
            toutes les opérations effectuées sur le site. Un email de confirmation est envoyé
            après la validation de chaque commande.
          </p>
        </section>

        <section>
          <h2 className="font-playfair italic text-[#3D2B1F] text-2xl mb-4">
            4. Livraison
          </h2>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed mb-4">
            Nous livrons dans tout le Maroc. Les délais de livraison sont les suivants :
          </p>
          <ul className="list-disc pl-6 space-y-2 font-inter text-[#3D2B1F]/80 text-base mb-4">
            <li>Casablanca, Rabat, Marrakech : 24 à 48h ouvrées</li>
            <li>Autres villes du Maroc : 2 à 4 jours ouvrés</li>
          </ul>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed">
            Les livraisons sont assurées par nos partenaires logistiques. Un numéro de suivi
            vous est communiqué par email dès l'expédition de votre commande.
          </p>
        </section>

        <section>
          <h2 className="font-playfair italic text-[#3D2B1F] text-2xl mb-4">
            5. Retours
          </h2>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed">
            Vous disposez de 30 jours à compter de la réception de votre commande pour retourner
            un produit. Le produit doit être retourné dans son état d'origine, non utilisé, dans
            son emballage d'origine. Les frais de retour sont gratuits pour les produits défectueux.
            Pour initier un retour, contactez notre service client à : retours@ritualglowry.ma
          </p>
        </section>

        <section>
          <h2 className="font-playfair italic text-[#3D2B1F] text-2xl mb-4">
            6. Garanties
          </h2>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed">
            Tous nos produits bénéficient d'une garantie de conformité. En cas de produit
            défectueux ou non conforme à la description, nous nous engageons à procéder à
            l'échange ou au remboursement intégral. La garantie ne couvre pas les dommages
            résultant d'une utilisation incorrecte ou d'un entretien inadapté du produit.
          </p>
        </section>

        <section>
          <h2 className="font-playfair italic text-[#3D2B1F] text-2xl mb-4">
            7. Paiement
          </h2>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed">
            Les paiements sont sécurisés et traités par nos prestataires certifiés PCI-DSS.
            Nous acceptons les cartes bancaires Visa, Mastercard, ainsi que le virement bancaire
            et le paiement à la livraison (selon disponibilité). Les données de paiement ne
            transitent pas par nos serveurs.
          </p>
        </section>
      </div>
    </>
  )
}
