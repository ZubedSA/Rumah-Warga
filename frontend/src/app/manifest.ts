import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RumahWarga - Platform RT/RW Eksklusif',
    short_name: 'RumahWarga',
    description: 'Platform digital eksklusif untuk administrasi lingkungan RT & RW yang elegan dan aman.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F4F5F9',
    theme_color: '#5C17E5',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
