import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité et de protection des données personnelles de Ritual Glowry.',
}

const LAST_UPDATED = '1er juin 2026'

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      {/* Hero */}
      <section
        className="flex items-center justify-center py-20"
        style={{ background: 'linear-gradient(135deg, #1A1410 0%, #3D2B1F 100%)' }}
      >
        <div className="text-center px-4">
          <h1 className="font-playfair italic text-[#FAF6EF] text-4xl md:text-5xl mb-3">
            Politique de confidentialité
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
            1. Données collectées
          </h2>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed mb-4">
            Dans le cadre de notre activité, Ritual Glowry collecte les données personnelles suivantes :
          </p>
          <ul className="list-disc pl-6 space-y-2 font-inter text-[#3D2B1F]/80 text-base">
            <li>Données d'identification : nom, prénom, adresse email</li>
            <li>Données de contact : adresse postale, numéro de téléphone</li>
            <li>Données de transaction : historique des commandes, préférences d'achat</li>
            <li>Données de navigation : adresse IP, cookies, pages visitées</li>
            <li>Données de paiement : traitées directement par notre prestataire sécurisé (nous ne stockons pas vos données bancaires)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-playfair italic text-[#3D2B1F] text-2xl mb-4">
            2. Utilisation des données
          </h2>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed mb-4">
            Vos données sont utilisées aux fins suivantes :
          </p>
          <ul className="list-disc pl-6 space-y-2 font-inter text-[#3D2B1F]/80 text-base">
            <li>Traitement et suivi de vos commandes</li>
            <li>Gestion de votre compte client</li>
            <li>Envoi de communications commerciales (avec votre consentement)</li>
            <li>Amélioration de nos services et de l'expérience utilisateur</li>
            <li>Respect de nos obligations légales et comptables</li>
          </ul>
        </section>

        <section>
          <h2 className="font-playfair italic text-[#3D2B1F] text-2xl mb-4">
            3. Vos droits (RGPD)
          </h2>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed mb-4">
            Conformément à la réglementation applicable en matière de protection des données personnelles,
            vous disposez des droits suivants :
          </p>
          <ul className="list-disc pl-6 space-y-2 font-inter text-[#3D2B1F]/80 text-base">
            <li><strong>Droit d'accès</strong> : obtenir une copie de vos données personnelles</li>
            <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
            <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
            <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
            <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
            <li><strong>Droit à la limitation</strong> : limiter le traitement de vos données</li>
          </ul>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed mt-4">
            Pour exercer ces droits, contactez-nous à : <strong>dpo@ritualglowry.ma</strong>
          </p>
        </section>

        <section>
          <h2 className="font-playfair italic text-[#3D2B1F] text-2xl mb-4">
            4. Cookies
          </h2>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed">
            Notre site utilise des cookies pour améliorer votre expérience de navigation.
            Pour plus d'informations sur les cookies que nous utilisons et comment les gérer,
            consultez notre{' '}
            <a href="/politique-cookies" className="text-[#C9A875] hover:underline">
              Politique de cookies
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-playfair italic text-[#3D2B1F] text-2xl mb-4">
            5. Contact DPO
          </h2>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed">
            Notre Délégué à la Protection des Données (DPO) est joignable à l'adresse suivante :
            <br />
            <strong>Email :</strong> dpo@ritualglowry.ma<br />
            <strong>Adresse :</strong> Boulevard Anfa, Casablanca 20000, Maroc
          </p>
        </section>

        <section>
          <h2 className="font-playfair italic text-[#3D2B1F] text-2xl mb-4">
            6. Conservation des données
          </h2>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed">
            Vos données personnelles sont conservées pendant la durée nécessaire à la réalisation
            des finalités pour lesquelles elles ont été collectées, dans le respect de la
            réglementation applicable. Les données de commande sont conservées 10 ans pour
            des raisons comptables et légales.
          </p>
        </section>
      </div>
    </>
  )
}
