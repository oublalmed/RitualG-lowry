import type { Metadata } from 'next';
import { AboutHero } from '@/components/about/AboutHero';
import { FounderSection } from '@/components/about/FounderSection';
import { MissionSection } from '@/components/about/MissionSection';
import { Timeline } from '@/components/about/Timeline';
import { TeamSection } from '@/components/about/TeamSection';
import { CertificationsSection } from '@/components/about/CertificationsSection';

export const metadata: Metadata = {
  title: 'Notre Histoire | Ritual Glowry',
  description:
    'Découvrez l\'histoire de Ritual Glowry, née d\'une passion pour la beauté naturelle et les extensions premium au Maroc.',
};

export default function AProposPage() {
  return (
    <>
      <AboutHero />
      <FounderSection />
      <MissionSection />
      <Timeline />
      <TeamSection />
      <CertificationsSection />
    </>
  );
}
