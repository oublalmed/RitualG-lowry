import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de cookies',
  description: 'Politique de gestion des cookies de Ritual Glowry — catégories, utilisation et gestion.',
}

const LAST_UPDATED = '1er juin 2026'

export default function PolitiqueCookiesPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="flex items-center justify-center py-20"
        style={{ background: 'linear-gradient(135deg, #1A1410 0%, #3D2B1F 100%)' }}
      >
        <div className="text-center px-4">
          <h1 className="font-playfair italic text-[#FAF6EF] text-4xl md:text-5xl mb-3">
            Politique de cookies
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
            1. Qu'est-ce qu'un cookie ?
          </h2>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed">
            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette
            ou smartphone) lors de votre visite sur notre site. Les cookies permettent de mémoriser
            vos préférences, d'améliorer votre expérience de navigation et de nous aider à analyser
            le trafic de notre site.
          </p>
        </section>

        <section>
          <h2 className="font-playfair italic text-[#3D2B1F] text-2xl mb-4">
            2. Catégories de cookies
          </h2>

          <div className="space-y-6">
            <div className="bg-[#F5EDE0] p-5 border-l-4 border-[#C9A875]">
              <h3 className="font-inter font-semibold text-[#3D2B1F] text-base mb-2">
                Cookies nécessaires
              </h3>
              <p className="font-inter text-[#3D2B1F]/80 text-sm leading-relaxed">
                Ces cookies sont indispensables au fonctionnement du site. Ils permettent d'utiliser
                les fonctionnalités de base (panier d'achat, session utilisateur, sécurité). Ils ne
                peuvent pas être désactivés. Exemples : session-token, cart-id.
              </p>
              <p className="font-inter text-xs text-[#3D2B1F]/50 mt-2">
                Durée de conservation : session ou jusqu'à 1 an
              </p>
            </div>

            <div className="bg-[#F5EDE0] p-5 border-l-4 border-[#B8924B]">
              <h3 className="font-inter font-semibold text-[#3D2B1F] text-base mb-2">
                Cookies analytiques
              </h3>
              <p className="font-inter text-[#3D2B1F]/80 text-sm leading-relaxed">
                Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre
                site en collectant des informations de manière anonyme. Nous utilisons Google Analytics
                pour analyser le trafic et améliorer notre contenu. Exemples : _ga, _gid, _gat.
              </p>
              <p className="font-inter text-xs text-[#3D2B1F]/50 mt-2">
                Durée de conservation : jusqu'à 2 ans — Nécessite votre consentement
              </p>
            </div>

            <div className="bg-[#F5EDE0] p-5 border-l-4 border-[#C9A8A0]">
              <h3 className="font-inter font-semibold text-[#3D2B1F] text-base mb-2">
                Cookies marketing
              </h3>
              <p className="font-inter text-[#3D2B1F]/80 text-sm leading-relaxed">
                Ces cookies sont utilisés pour vous proposer des publicités personnalisées en
                fonction de vos centres d'intérêt. Ils sont également utilisés pour limiter le
                nombre de fois où vous voyez une publicité et pour mesurer l'efficacité des
                campagnes publicitaires. Exemples : _fbp, ads/ga-audiences.
              </p>
              <p className="font-inter text-xs text-[#3D2B1F]/50 mt-2">
                Durée de conservation : jusqu'à 13 mois — Nécessite votre consentement
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-playfair italic text-[#3D2B1F] text-2xl mb-4">
            3. Comment gérer les cookies ?
          </h2>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed mb-4">
            Vous pouvez gérer vos préférences de cookies de plusieurs façons :
          </p>
          <ul className="list-disc pl-6 space-y-2 font-inter text-[#3D2B1F]/80 text-base mb-4">
            <li>
              <strong>Via notre bandeau de consentement</strong> : lors de votre première visite
              ou en cliquant sur &quot;Gérer mes cookies&quot; en bas de page.
            </li>
            <li>
              <strong>Via les paramètres de votre navigateur</strong> : vous pouvez configurer
              votre navigateur pour accepter, refuser ou supprimer les cookies.
            </li>
            <li>
              <strong>Via les outils tiers</strong> : pour les cookies Google Analytics, vous
              pouvez utiliser le module complémentaire de désactivation disponible sur le site
              de Google.
            </li>
          </ul>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed">
            Notez que le refus de certains cookies peut affecter votre expérience sur notre site
            et limiter certaines fonctionnalités.
          </p>
        </section>

        <section>
          <h2 className="font-playfair italic text-[#3D2B1F] text-2xl mb-4">
            4. Contact
          </h2>
          <p className="font-inter text-[#3D2B1F]/80 text-base leading-relaxed">
            Pour toute question concernant notre politique de cookies, contactez-nous à :{' '}
            <a href="mailto:privacy@ritualglowry.ma" className="text-[#C9A875] hover:underline">
              privacy@ritualglowry.ma
            </a>
          </p>
        </section>
      </div>
    </>
  )
}
