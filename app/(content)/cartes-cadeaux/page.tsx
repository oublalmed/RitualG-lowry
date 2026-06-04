'use client';

import { useState } from 'react';
import type { Metadata } from 'next';

// Note: metadata export only works in server components.
// Since this page needs client state, we keep it 'use client'
// and export metadata from layout or via a wrapper if needed.
// For now we set the title via document if needed — metadata is handled by parent layout.

const AMOUNTS = [250, 500, 1000];

const STEPS = [
  { step: '01', label: 'Choisir le montant', desc: 'Sélectionnez parmi nos 3 valeurs disponibles' },
  { step: '02', label: 'Envoyer par email', desc: 'Entrez les coordonnées de la destinataire' },
  { step: '03', label: 'La destinataire utilise son code', desc: 'Elle reçoit un code unique à utiliser sur ritualglowry.com' },
];

export default function CartesCadeauxPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ firstName: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF6EF]">
      {/* Hero */}
      <section
        className="relative py-28 flex items-center justify-center text-center"
        style={{ background: 'linear-gradient(160deg, #3D2B1F 0%, #1A1410 100%)' }}
      >
        <div className="px-4">
          <p className="text-xs font-inter font-semibold uppercase tracking-[0.15em] text-[#C9A875] mb-4">
            Idée Cadeau
          </p>
          <h1
            className="text-5xl md:text-6xl text-[#FAF6EF] mb-4"
            style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
          >
            Offrez le Luxe
          </h1>
          <p className="font-cormorant italic text-xl text-[#FAF6EF]/70 max-w-lg mx-auto">
            Offrez à vos proches la liberté de choisir leurs extensions ou perruques idéales.
          </p>
        </div>
      </section>

      {/* Gift card options */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl text-[#3D2B1F]"
              style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
            >
              Choisissez le montant
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {AMOUNTS.map((amount) => {
              const isSelected = selectedAmount === amount;
              return (
                <div
                  key={amount}
                  className={`relative overflow-hidden rounded-2xl shadow-lg transition-all duration-200 ${
                    isSelected ? 'ring-4 ring-[#C9A875] scale-[1.02]' : ''
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, #3D2B1F 0%, #C9A875 100%)',
                  }}
                >
                  <div className="p-8 text-center">
                    <p className="font-inter font-semibold uppercase tracking-[0.15em] text-[#FAF6EF]/60 text-xs mb-4">
                      RITUAL GLOWRY
                    </p>
                    <p
                      className="text-5xl font-inter font-bold text-[#C9A875] mb-2"
                      style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
                    >
                      {amount}
                    </p>
                    <p className="font-inter text-[#FAF6EF]/80 text-sm mb-1">MAD</p>
                    <p className="font-inter text-xs text-[#FAF6EF]/50 mb-6">Valable 1 an</p>
                    <button
                      onClick={() => setSelectedAmount(amount)}
                      className={`w-full py-3 font-inter font-semibold text-sm uppercase tracking-wider transition-colors duration-200 ${
                        isSelected
                          ? 'bg-[#C9A875] text-[#1A1410]'
                          : 'border border-[#C9A875] text-[#C9A875] hover:bg-[#C9A875] hover:text-[#1A1410]'
                      }`}
                    >
                      {isSelected ? 'Sélectionné ✓' : 'Offrir'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-[#F5EDE0]">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl text-[#3D2B1F]"
              style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
            >
              Comment ça marche
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {STEPS.map(({ step, label, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#C9A875] text-[#1A1410] font-inter font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-inter font-semibold text-[#3D2B1F] mb-2">{label}</h3>
                <p className="font-inter text-sm text-[#3D2B1F]/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order form */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <h2
                className="text-3xl text-[#3D2B1F]"
                style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
              >
                Personnalisez votre cadeau
              </h2>
              {selectedAmount && (
                <p className="font-inter text-sm text-[#C9A875] mt-2">
                  Montant sélectionné : <strong>{selectedAmount} €</strong>
                </p>
              )}
            </div>

            {submitted ? (
              <div className="text-center py-12 bg-[#F5EDE0] rounded-2xl border border-[#C9A875]/20">
                <div className="text-4xl mb-4">🎁</div>
                <h3
                  className="text-2xl text-[#3D2B1F] mb-2"
                  style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
                >
                  Carte cadeau envoyée !
                </h3>
                <p className="font-inter text-sm text-[#3D2B1F]/60">
                  Un email avec le code cadeau a été envoyé à la destinataire.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-[#F5EDE0] rounded-2xl border border-[#C9A875]/20 p-8 space-y-5"
              >
                <div>
                  <label className="block font-inter text-sm font-medium text-[#3D2B1F] mb-1">
                    Prénom de la destinataire
                  </label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    placeholder="Yasmine"
                    className="w-full bg-[#FAF6EF] border border-[#C9A875]/30 px-4 py-3 font-inter text-sm text-[#1A1410] placeholder:text-[#3D2B1F]/40 focus:outline-none focus:border-[#C9A875] transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-inter text-sm font-medium text-[#3D2B1F] mb-1">
                    Email de la destinataire
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="yasmine@exemple.com"
                    className="w-full bg-[#FAF6EF] border border-[#C9A875]/30 px-4 py-3 font-inter text-sm text-[#1A1410] placeholder:text-[#3D2B1F]/40 focus:outline-none focus:border-[#C9A875] transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-inter text-sm font-medium text-[#3D2B1F] mb-1">
                    Message personnel (optionnel)
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Avec tout mon amour..."
                    className="w-full bg-[#FAF6EF] border border-[#C9A875]/30 px-4 py-3 font-inter text-sm text-[#1A1410] placeholder:text-[#3D2B1F]/40 focus:outline-none focus:border-[#C9A875] transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!selectedAmount}
                  className="w-full bg-[#C9A875] hover:bg-[#B8924B] disabled:opacity-50 disabled:cursor-not-allowed text-[#1A1410] font-inter font-semibold uppercase tracking-[0.1em] py-4 transition-colors duration-200"
                >
                  {selectedAmount ? `Offrir ${selectedAmount} MAD →` : 'Sélectionnez un montant'}
                </button>
                {!selectedAmount && (
                  <p className="text-center font-inter text-xs text-[#3D2B1F]/50">
                    Veuillez d&apos;abord choisir un montant ci-dessus
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
