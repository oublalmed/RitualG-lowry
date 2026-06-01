import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const mockStats = {
  revenue: {
    current: 24500,
    previous: 21875,
    change: 12,
    monthly: [
      { month: 'Avr', revenue: 18200 },
      { month: 'Mai', revenue: 21500 },
      { month: 'Jun', revenue: 17800 },
      { month: 'Jul', revenue: 22100 },
      { month: 'Aoû', revenue: 19300 },
      { month: 'Sep', revenue: 24500 },
      { month: 'Oct', revenue: 27800 },
      { month: 'Nov', revenue: 31200 },
      { month: 'Déc', revenue: 38500 },
      { month: 'Jan', revenue: 22100 },
      { month: 'Fév', revenue: 20800 },
      { month: 'Mar', revenue: 24500 },
    ],
  },
  orders: {
    pending: 8,
    total: 89,
    thisMonth: 23,
  },
  customers: {
    new: 23,
    total: 312,
  },
  cart: {
    average: 890,
    change: 5,
  },
  conversion: 3.2,
  loyaltyPoints: 1240,
  topProducts: [
    { name: 'Extension Lisse Naturelle', sales: 124 },
    { name: 'Perruque Lace Front Premium', sales: 203 },
    { name: 'Extension Bouclée Sublime', sales: 87 },
    { name: 'Extension Ondulée Body Wave', sales: 99 },
    { name: 'Extension Afro Naturelle', sales: 56 },
  ],
  lowStock: [
    { name: 'Extension Afro 30cm', stock: 4 },
    { name: 'Extension Lisse 60cm Châtain', stock: 3 },
    { name: 'Extension Bouclée 50cm Brun', stock: 5 },
  ],
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    return NextResponse.json({ data: mockStats });
  } catch {
    return NextResponse.json({ data: mockStats });
  }
}
