import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BEN! | Pure Raw Intelligence',
    short_name: 'BEN!',
    description: 'BEN AI Academy: The singularity is here. Neural intelligence, mission-based learning, and elite operative training.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff9e6',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
