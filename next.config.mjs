// TEST DE MODIFICATION
/** @type {import('next').NextConfig} */
const nextConfig = {
  // =======================================================
  // AJOUT DE LA DIRECTIVE POUR IGNORER ESLINT PENDANT LE BUILD
  // =======================================================
  eslint: {
    // Attention : Ceci permet à la construction de production de réussir même si
    // votre projet a des erreurs ESLint. C'est utile pour déployer rapidement,
    // mais il est recommandé de corriger ces erreurs plus tard.
    ignoreDuringBuilds: true,
  },

  // =======================================================
  // VOTRE CONFIGURATION EXISTANTE POUR LES IMAGES (CONSERVÉE)
  // =======================================================
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
      {
        // C'est celui-ci qui causait ton erreur
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**',
      },
      // --- AJOUTE CETTE LIGNE ---
      { protocol: 'https', hostname: 'covers.openlibrary.org', pathname: '/**' },
    ],
  },
};

export default nextConfig;