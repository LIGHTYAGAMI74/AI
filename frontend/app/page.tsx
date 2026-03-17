import HomePageClient from './home-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BEN! | Pure Raw Intelligence 2026',
  description: 'BEN AI Academy: The singularity is here. Neural intelligence, mission-based learning, and elite operative training.',
};

export default function HomePage() {
  return <HomePageClient />;
}