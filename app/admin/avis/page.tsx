'use client';

import { useState } from 'react';
import { Check, X, MessageSquare, Star } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Review {
  id: string;
  product: string;
  client: string;
  rating: number;
  date: string;
  comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const mockReviews: Review[] = [
  { id: '1', product: 'Extension Lisse Naturelle', client: 'Fatima Z.', rating: 5, date: '28 Mar 2025', comment: 'Qualité exceptionnelle, je recommande vivement ! Les extensions tiennent très bien et sont indétectables.', status: 'PENDING' },
  { id: '2', product: 'Perruque Lace Front Premium', client: 'Houda M.', rating: 4, date: '27 Mar 2025', comment: 'Très belle perruque, livraison rapide. Je suis très satisfaite de mon achat.', status: 'PENDING' },
  { id: '3', product: 'Extension Bouclée Sublime', client: 'Sara B.', rating: 3, date: '25 Mar 2025', comment: 'Bonne qualité mais la couleur était légèrement différente de la photo.', status: 'PENDING' },
  { id: '4', product: 'Extension Ondulée Body Wave', client: 'Nadia O.', rating: 5, date: '20 Mar 2025', comment: 'Magnifique ! Je suis fan, déjà ma 3ème commande !', status: 'APPROVED' },
  { id: '5', product: 'Serre-tête Satin', client: 'Salma T.', rating: 5, date: '18 Mar 2025', comment: 'Excellent produit, très doux pour les cheveux.', status: 'APPROVED' },
  { id: '6', product: 'Extension Afro Naturelle', client: 'Rim K.', rating: 2, date: '15 Mar 2025', comment: 'Pas satisfaite, la texture ne correspond pas à ce qui était annoncé.', status: 'REJECTED' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-3 w-3 ${s <= rating ? 'fill-[#C9A875] text-[#C9A875]' : 'fill-[#3D2B1F]/10 text-[#3D2B1F]/10'}`} />
      ))}
    </div>
  );
}

function ReviewCard({ review, onApprove, onReject, onReply }: {
  review: Review;
  onApprove?: () => void;
  onReject?: () => void;
  onReply?: () => void;
}) {
  return (
    <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-inter font-semibold text-[#3D2B1F] text-sm">{review.product}</p>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <StarRating rating={review.rating} />
            <span className="text-xs font-inter text-[#3D2B1F]/50">{review.client}</span>
            <span className="text-xs font-inter text-[#3D2B1F]/40">{review.date}</span>
          </div>
          <p className="text-sm font-inter text-[#3D2B1F]/70 leading-relaxed">{review.comment}</p>
        </div>
        {review.status === 'PENDING' && (
          <div className="flex gap-1 flex-shrink-0">
            {onApprove && (
              <button onClick={onApprove} className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors" title="Approuver">
                <Check className="h-4 w-4" />
              </button>
            )}
            {onReject && (
              <button onClick={onReject} className="p-2 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition-colors" title="Rejeter">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
      {onReply && (
        <button
          onClick={onReply}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-inter text-[#C9A875] hover:text-[#B8924B] transition-colors"
        >
          <MessageSquare className="h-3 w-3" />
          Répondre
        </button>
      )}
    </div>
  );
}

export default function AvisPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [replyDialog, setReplyDialog] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const pending = reviews.filter((r) => r.status === 'PENDING');
  const approved = reviews.filter((r) => r.status === 'APPROVED');
  const rejected = reviews.filter((r) => r.status === 'REJECTED');

  const approve = (id: string) => setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status: 'APPROVED' } : r));
  const reject = (id: string) => setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status: 'REJECTED' } : r));

  const openReply = (id: string) => { setSelectedId(id); setReplyText(''); setReplyDialog(true); };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1
        className="text-2xl text-[#3D2B1F]"
        style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
      >
        Avis clientes
      </h1>

      <Tabs defaultValue="pending">
        <TabsList className="bg-[#F5EDE0] border border-[#C9A875]/15 p-1">
          <TabsTrigger value="pending" className="data-[state=active]:bg-[#C9A875] data-[state=active]:text-[#1A1410] font-inter text-sm gap-1.5">
            En attente
            {pending.length > 0 && (
              <span className="h-4 w-4 bg-[#3D2B1F] text-[#FAF6EF] text-[10px] rounded-full flex items-center justify-center">
                {pending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved" className="data-[state=active]:bg-[#C9A875] data-[state=active]:text-[#1A1410] font-inter text-sm">
            Approuvés ({approved.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="data-[state=active]:bg-[#C9A875] data-[state=active]:text-[#1A1410] font-inter text-sm">
            Rejetés ({rejected.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4 space-y-3">
          {pending.length === 0 ? (
            <p className="text-center py-10 text-[#3D2B1F]/40 font-inter text-sm">Aucun avis en attente</p>
          ) : (
            pending.map((r) => (
              <ReviewCard key={r.id} review={r} onApprove={() => approve(r.id)} onReject={() => reject(r.id)} onReply={() => openReply(r.id)} />
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-4 space-y-3">
          {approved.map((r) => (
            <ReviewCard key={r.id} review={r} onReply={() => openReply(r.id)} />
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="mt-4 space-y-3">
          {rejected.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={replyDialog} onOpenChange={setReplyDialog}>
        <DialogContent className="bg-[#FAF6EF] border-[#C9A875]/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#3D2B1F] font-inter">Répondre à l'avis</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Votre réponse..."
              rows={4}
              className="w-full bg-[#F5EDE0] border border-[#C9A875]/30 rounded-lg px-3 py-2 text-sm font-inter text-[#1A1410] resize-none outline-none focus:border-[#C9A875]"
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border-[#C9A875]/30" onClick={() => setReplyDialog(false)}>Annuler</Button>
              <Button className="flex-1 bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-semibold" onClick={() => setReplyDialog(false)}>Envoyer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
