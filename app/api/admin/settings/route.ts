import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/admin/settings
 *
 * Stub endpoint — returns success immediately.
 * In production, site settings (boutique info, loyalty tiers, shipping rates)
 * are managed via Sanity Studio. This route exists so the admin UI Save button
 * has a real HTTP target and can confirm the action to the user.
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/settings POST]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
