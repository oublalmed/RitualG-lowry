'use client';

import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, RotateCcw, Award, Heart, Minus, Plus } from 'lucide-react';
import type { MockProduct, MockVariant } from '@/lib/mockData';
import { useCartStore } from '@/stores/cartStore';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { StarRating } from '@/components/common/StarRating';
import { ProductGallery } from './ProductGallery';
import { ProductVariantSelector } from './ProductVariantSelector';
import { ColorQuizCTA } from './ColorQuizCTA';
import { ReviewSection } from './ReviewSection';
import { RelatedProducts } from './RelatedProducts';
import { MobileStickyBar } from './MobileStickyBar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { fadeInLeft, fadeInRight, fadeInUp, staggerContainer } from '@/lib/animations';

interface ProductPageClientProps {
  product: MockProduct;
  relatedProducts: MockProduct[];
}

const TRUST_BADGES = [
  { Icon: ShieldCheck, text: 'Paiement sécurisé' },
  { Icon: Truck, text: 'Livraison 2-5 jours' },
  { Icon: RotateCcw, text: 'Retours 30 jours' },
  { Icon: Award, text: 'Garantie qualité' },
];

function StockIndicator({ status, stock }: { status: string; stock: number }) {
  if (status === 'out_of_stock' || stock === 0) {
    return (
      <span className="flex items-center gap-1.5 font-inter text-sm">
        <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
        <span className="text-red-600">Rupture de stock</span>
      </span>
    );
  }
  if (stock <= 5 || status === 'low_stock') {
    return (
      <span className="flex items-center gap-1.5 font-inter text-sm">
        <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
        <span className="text-amber-700">Stock limité — {stock} restant{stock > 1 ? 's' : ''}</span>
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 font-inter text-sm">
      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
      <span className="text-emerald-700">En stock</span>
    </span>
  );
}

export function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const { addItem } = useCartStore();
  const galleryRef = useRef<HTMLDivElement>(null);

  const [selectedVariant, setSelectedVariant] = useState<MockVariant>(
    product.variants[0] ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);

  const currentPrice = selectedVariant?.price ?? product.basePrice;
  const currentStock = selectedVariant?.stock ?? 0;

  const handleAddToCart = useCallback(() => {
    addItem({
      id: `${product._id}-${selectedVariant?.label ?? 'default'}`,
      productId: product._id,
      sanityProductId: product._id,
      sanityVariantId: selectedVariant?.label,
      name: product.name,
      variantLabel: selectedVariant?.label ?? 'Standard',
      slug: product.slug,
      imageUrl: undefined,
      price: currentPrice,
    });
  }, [addItem, product, selectedVariant, currentPrice, quantity]);

  const incrementQty = () => setQuantity((q) => Math.min(q + 1, currentStock));
  const decrementQty = () => setQuantity((q) => Math.max(1, q - 1));

  return (
    <div className="bg-[#FAF6EF] min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 pt-6 pb-2">
        <Breadcrumb
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Boutique', href: '/boutique' },
            { label: product.category.name, href: `/boutique?types=${product.productType[0] ?? ''}` },
            { label: product.name },
          ]}
        />
      </div>

      {/* Main product section */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          {/* LEFT — Gallery */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInLeft}
            ref={galleryRef}
          >
            <ProductGallery productName={product.name} />
          </motion.div>

          {/* RIGHT — Product info */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col gap-5"
          >
            {/* Category tag */}
            <motion.span
              variants={fadeInUp}
              className="font-inter font-semibold text-xs uppercase tracking-[0.14em] text-[#C9A875]"
            >
              {product.category.name}
            </motion.span>

            {/* Title */}
            <motion.h1
              variants={fadeInUp}
              className="font-playfair italic font-bold text-2xl md:text-3xl text-[#3D2B1F] leading-tight"
            >
              {product.name}
            </motion.h1>

            {/* Rating */}
            <motion.div variants={fadeInUp} className="flex items-center gap-3">
              <StarRating rating={product.rating} size="sm" />
              <a
                href="#reviews"
                className="font-inter text-sm text-[#3D2B1F]/60 hover:text-[#C9A875] transition-colors"
              >
                ({product.reviewCount} avis)
              </a>
            </motion.div>

            {/* Price */}
            <motion.div variants={fadeInUp} className="flex items-baseline gap-3">
              <span className="font-inter font-bold text-3xl text-[#1A1410]">
                {currentPrice.toLocaleString('fr-MA')} MAD
              </span>
              {product.comparePrice && (
                <span className="font-inter text-lg text-[#C9A8A0] line-through">
                  {product.comparePrice.toLocaleString('fr-MA')} MAD
                </span>
              )}
              {product.comparePrice && (
                <span className="font-inter text-xs font-semibold bg-[#C9A8A0]/20 text-[#C9A8A0] px-2 py-0.5">
                  -{Math.round(((product.comparePrice - currentPrice) / product.comparePrice) * 100)}%
                </span>
              )}
            </motion.div>

            {/* Short description */}
            <motion.p
              variants={fadeInUp}
              className="font-cormorant italic text-lg text-[#3D2B1F]/70 leading-relaxed"
            >
              {product.shortDescription}
            </motion.p>

            {/* Divider */}
            <motion.div variants={fadeInUp} className="h-px bg-[#3D2B1F]/8" />

            {/* Variant selector */}
            <motion.div variants={fadeInUp}>
              <ProductVariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelect={setSelectedVariant}
                basePrice={product.basePrice}
              />
            </motion.div>

            {/* Color quiz CTA */}
            <motion.div variants={fadeInUp}>
              <ColorQuizCTA />
            </motion.div>

            {/* Stock indicator */}
            <motion.div variants={fadeInUp}>
              <StockIndicator status={product.stockStatus} stock={currentStock} />
            </motion.div>

            {/* Quantity + CTA */}
            <motion.div variants={fadeInUp} className="flex flex-col gap-3">
              {/* Qty */}
              <div className="flex items-center gap-0">
                <button
                  onClick={decrementQty}
                  className="w-10 h-10 border border-[#3D2B1F]/20 flex items-center justify-center text-[#3D2B1F] hover:border-[#C9A875] transition-colors"
                  aria-label="Diminuer la quantité"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="w-14 h-10 border-y border-[#3D2B1F]/20 flex items-center justify-center font-inter font-semibold text-sm text-[#1A1410]">
                  {quantity}
                </div>
                <button
                  onClick={incrementQty}
                  disabled={quantity >= currentStock}
                  className="w-10 h-10 border border-[#3D2B1F]/20 flex items-center justify-center text-[#3D2B1F] hover:border-[#C9A875] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Augmenter la quantité"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stockStatus === 'out_of_stock' || currentStock === 0}
                className="w-full bg-[#C9A875] hover:bg-[#B8924B] disabled:opacity-50 disabled:cursor-not-allowed text-[#1A1410] font-inter font-semibold text-sm uppercase tracking-[0.1em] py-4 transition-colors duration-200"
              >
                Ajouter au panier
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setWishlist((w) => !w)}
                className={`w-full flex items-center justify-center gap-2 border font-inter font-semibold text-sm uppercase tracking-[0.1em] py-4 transition-colors duration-200 ${
                  wishlist
                    ? 'bg-[#3D2B1F]/5 border-[#3D2B1F] text-[#3D2B1F]'
                    : 'border-[#3D2B1F]/25 text-[#3D2B1F]/70 hover:border-[#3D2B1F] hover:text-[#3D2B1F]'
                }`}
              >
                <Heart
                  className={`h-4 w-4 transition-all ${wishlist ? 'fill-[#3D2B1F] text-[#3D2B1F]' : ''}`}
                />
                {wishlist ? 'Dans ma wishlist' : 'Ajouter à la wishlist'}
              </button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 gap-3 pt-2"
            >
              {TRUST_BADGES.map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#C9A875]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-[#C9A875]" />
                  </div>
                  <span className="font-inter text-xs text-[#3D2B1F]/70">{text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Tabs section */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-10 border-t border-[#3D2B1F]/8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeInUp}
        >
          <Tabs defaultValue="description">
            <TabsList
              variant="line"
              className="mb-8 border-b border-[#3D2B1F]/10 w-full justify-start rounded-none pb-0 gap-0"
            >
              {[
                { value: 'description', label: 'Description' },
                { value: 'composition', label: 'Composition' },
                { value: 'entretien', label: 'Entretien' },
                { value: 'livraison', label: 'Livraison & Retours' },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="font-inter text-sm px-5 py-3 rounded-none border-b-2 border-transparent data-active:border-[#C9A875] data-active:text-[#3D2B1F] text-[#3D2B1F]/50 hover:text-[#3D2B1F] transition-colors"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="description" className="prose prose-sm max-w-none">
              <div className="space-y-4 font-cormorant text-lg text-[#3D2B1F]/80 leading-relaxed">
                <p>
                  Nos extensions sont confectionnées à partir de cheveux 100% Remy, soigneusement
                  sélectionnés pour leur qualité exceptionnelle. Chaque mèche est alignée dans le
                  même sens pour garantir une texture naturelle, brillante et sans nœuds.
                </p>
                <p>
                  La coupe et la densité ont été pensées pour un rendu parfaitement harmonieux avec
                  toutes les morphologies. Vous obtiendrez un volume généreux sans effet artificiel,
                  pour un résultat qui semble naturellement le vôtre.
                </p>
                <p>
                  Compatibles avec tous les outils chauffants jusqu'à 230°C, ces extensions peuvent
                  être coiffées, lissées, bouclées ou teintes (éclaircissement déconseillé au-delà
                  de 2 niveaux). Une expérience premium du premier au dernier port.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="composition" className="space-y-4">
              <div className="font-inter text-sm text-[#3D2B1F]/80 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Matière', value: '100% Remy Human Hair' },
                    { label: 'Origine', value: 'Asie du Sud-Est (certifié)' },
                    { label: 'Épaisseur', value: '100–150g par paquet' },
                    { label: 'Traitement', value: 'Sans silicone, sans acide' },
                    { label: 'Colorants', value: 'Teinture végétale douce' },
                    { label: 'Attachement', value: 'Clips acier inoxydable' },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-4 bg-white border border-[#3D2B1F]/8">
                      <p className="text-xs uppercase tracking-widest text-[#C9A875] mb-1">{label}</p>
                      <p className="font-semibold text-[#1A1410]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="entretien" className="space-y-3">
              <ul className="space-y-3 font-inter text-sm text-[#3D2B1F]/80">
                {[
                  'Lavez les extensions avec un shampoing doux sulfate-free, 1 à 2 fois par semaine maximum.',
                  'Appliquez un masque hydratant après chaque lavage et laissez poser 5 à 10 minutes.',
                  'Ne jamais coiffer les extensions mouillées. Séchez à l\'air libre ou à basse température.',
                  'Brossez délicatement de la pointe vers la racine avec une brosse à poils doux.',
                  'Rangez dans le sachet en soie fourni pour éviter les enchevêtrements.',
                  'Évitez le contact direct avec les produits coiffants à base d\'alcool.',
                  'Pour les outils chauffants, protégez toujours avec un spray thermo-protecteur.',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 w-5 h-5 rounded-full bg-[#C9A875]/15 text-[#C9A875] font-semibold text-xs flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="livraison" className="space-y-6 font-inter text-sm text-[#3D2B1F]/80">
              <div>
                <h4 className="font-semibold text-[#1A1410] mb-2 uppercase text-xs tracking-widest text-[#C9A875]">
                  Livraison
                </h4>
                <ul className="space-y-2">
                  <li>• Livraison standard : 2 à 5 jours ouvrés — Gratuite dès 500 MAD</li>
                  <li>• Livraison express : 24 à 48h — 40 MAD</li>
                  <li>• Toutes les commandes sont expédiées avec suivi numéro de colis.</li>
                  <li>• Emballage discret et sécurisé, boîte cadeau Ritual Glowry incluse.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[#1A1410] mb-2 uppercase text-xs tracking-widest text-[#C9A875]">
                  Retours & Échanges
                </h4>
                <ul className="space-y-2">
                  <li>• Retour gratuit sous 30 jours si le produit est non-porté et dans son emballage d'origine.</li>
                  <li>• Remboursement intégral sous 5 à 7 jours ouvrés après réception du retour.</li>
                  <li>• Échange possible pour une taille, longueur ou couleur différente.</li>
                  <li>• Contactez notre service client : contact@ritualglowry.ma</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Reviews section */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">
        <ReviewSection rating={product.rating} reviewCount={product.reviewCount} />
      </div>

      {/* Related products */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">
        <RelatedProducts products={relatedProducts} />
      </div>

      {/* Mobile sticky bar */}
      <MobileStickyBar
        productName={product.name}
        price={currentPrice}
        onAddToCart={handleAddToCart}
        triggerRef={galleryRef}
      />
    </div>
  );
}
