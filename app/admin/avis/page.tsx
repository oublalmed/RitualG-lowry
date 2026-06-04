'use client';

import { useState, useEffect, useCallback } from 'react';
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
  sanityProductId: string;
  title: string | null;
  rating: number;
  comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  adminReply: string | null;
  user: { id: string; name: string | null; email: string } | null;
}

type ReviewTab = 'PENDING' | 'APPROVED' | 'REJECTED';

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
  const clientName = review.user?.name ?? review.user?.email ?? 'Anonyme';
  const reviewDate = new Date(review.createdAt).toLocaleDateString('fr-BE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-inter font-semibold text-[#3D2B1F] text-sm">
              {review.title ?? review.sanityProductId}
            </p>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <StarRating rating={review.rating} />
            <span className="text-xs font-inter text-[#3D2B1F]/50">{clientName}</span>
            <span className="text-xs font-inter text-[#3D2B1F]/40">{reviewDate}</span>
          </div>
          <p className="text-sm font-inter text-[#3D2B1F]/70 leading-relaxed">{review.comment}</p>
          {review.adminReply && (
            <div className="mt-2 pl-3 border-l-2 border-[#C9A875]/40">
              <p className="text-xs font-inter text-[#3D2B1F]/60 italic">{review.adminReply}</p>
            </div>
          )}
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ReviewTab>('PENDING');

  const [replyDialog, setReplyDialog] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async (status: ReviewTab) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/reviews?status=${status}&limit=50`);
      if (!res.ok) throw new Error('Erreur lors du chargement des avis');
      const json = await res.json();
      setReviews(json.data);
      setTotal(json.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews(activeTab);
  }, [fetchReviews, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as ReviewTab);
  };

  const updateReviewStatus = async (id: string, status: 'APPROVED' | 'REJECTED', adminReply?: string) => {
    try {
      setSubmitting(true);
      const body: { status: string; adminReply?: string } = { status };
      if (adminReply) body.adminReply = adminReply;

      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Erreur lors de la mise à jour');
      await fetchReviews(activeTab);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  };

  const approve = (id: string) => updateReviewStatus(id, 'APPROVED');
  const reject = (id: string) => updateReviewStatus(id, 'REJECTED');

  const openReply = (id: string) => { setSelectedId(id); setReplyText(''); setReplyDialog(true); };

  const sendReply = async () => {
    if (!selectedId || !replyText.trim()) return;
    await updateReviewStatus(selectedId, 'APPROVED', replyText.trim());
    setReplyDialog(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1
        className="text-2xl text-[#3D2B1F]"
        style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
      >
        Avis clientes
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 font-inter text-sm">
          {error}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="bg-[#F5EDE0] border border-[#C9A875]/15 p-1">
          <TabsTrigger value="PENDING" className="data-[state=active]:bg-[#C9A875] data-[state=active]:text-[#1A1410] font-inter text-sm gap-1.5">
            En attente
            {activeTab === 'PENDING' && total > 0 && (
              <span className="h-4 w-4 bg-[#3D2B1F] text-[#FAF6EF] text-[10px] rounded-full flex items-center justify-center">
                {total}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="APPROVED" className="data-[state=active]:bg-[#C9A875] data-[state=active]:text-[#1A1410] font-inter text-sm">
            Approuvés {activeTab === 'APPROVED' ? `(${total})` : ''}
          </TabsTrigger>
          <TabsTrigger value="REJECTED" className="data-[state=active]:bg-[#C9A875] data-[state=active]:text-[#1A1410] font-inter text-sm">
            Rejetés {activeTab === 'REJECTED' ? `(${total})` : ''}
          </TabsTrigger>
        </TabsList>

        {(['PENDING', 'APPROVED', 'REJECTED'] as ReviewTab[]).map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-6 w-6 rounded-full border-2 border-[#C9A875] border-t-transparent animate-spin" />
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-center py-10 text-[#3D2B1F]/40 font-inter text-sm">
                {tab === 'PENDING' ? 'Aucun avis en attente' : tab === 'APPROVED' ? 'Aucun avis approuvé' : 'Aucun avis rejeté'}
              </p>
            ) : (
              reviews.map((r) => (
                <ReviewCard
                  key={r.id}
                  review={r}
                  onApprove={tab === 'PENDING' ? () => approve(r.id) : undefined}
                  onReject={tab === 'PENDING' ? () => reject(r.id) : undefined}
                  onReply={tab !== 'REJECTED' ? () => openReply(r.id) : undefined}
                />
              ))
            )}
          </TabsContent>
        ))}
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
              <Button
                className="flex-1 bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-semibold"
                onClick={sendReply}
                disabled={submitting || !replyText.trim()}
              >
                {submitting ? 'Envoi...' : 'Envoyer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
