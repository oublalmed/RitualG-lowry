import type { Metadata } from 'next'
import { ContactForm } from './ContactForm'
import { MapPin, Mail, Phone, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez l\'équipe Ritual Glowry pour toute question sur vos commandes, nos produits ou la livraison.',
}

const contactInfo = [
  {
    icon: MapPin,
    label: 'Adresse',
    value: 'Boulevard Anfa, Casablanca, Maroc',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@ritualglowry.ma',
    href: 'mailto:contact@ritualglowry.ma',
  },
  {
    icon: Phone,
    label: 'Téléphone',
    value: '+212 6XX XXX XXX',
    href: 'tel:+2126XXXXXXXX',
  },
  {
    icon: Clock,
    label: 'Horaires',
    value: 'Lun–Ven 9h–18h',
  },
]

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="flex items-center justify-center py-20"
        style={{ background: 'linear-gradient(135deg, #3D2B1F 0%, #1A1410 100%)' }}
      >
        <div className="text-center px-4">
          <h1 className="font-playfair italic text-[#FAF6EF] text-4xl md:text-5xl mb-3">
            Contactez-nous
          </h1>
          <p className="font-cormorant italic text-[#FAF6EF]/70 text-xl">
            Notre équipe est à votre disposition
          </p>
        </div>
      </section>

      {/* Two-column layout */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-5xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Contact info */}
          <div>
            <h2 className="font-playfair italic text-[#3D2B1F] text-2xl mb-8">
              Nos coordonnées
            </h2>
            <div className="space-y-6">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#C9A875]/15 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-[#C9A875]" />
                  </div>
                  <div>
                    <p className="font-inter text-xs font-semibold uppercase tracking-[0.1em] text-[#3D2B1F]/50 mb-1">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="font-inter text-[#3D2B1F] text-base hover:text-[#C9A875] transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-inter text-[#3D2B1F] text-base">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-[#F5EDE0] border-l-4 border-[#C9A875]">
              <p className="font-cormorant italic text-[#3D2B1F] text-lg leading-relaxed">
                &quot;Votre beauté est notre priorité. Nous répondons à toutes vos questions
                sous 24h ouvrées.&quot;
              </p>
              <p className="font-inter text-sm text-[#3D2B1F]/60 mt-3">
                — L'équipe Ritual Glowry
              </p>
            </div>
          </div>

          {/* Right: Contact form */}
          <div>
            <h2 className="font-playfair italic text-[#3D2B1F] text-2xl mb-8">
              Envoyez-nous un message
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  )
}
