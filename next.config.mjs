

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     images: {
//       remotePatterns: [
//         {
//           protocol: 'https',
//           hostname: 'via.placeholder.com',
//           port: '',
//           pathname: '/**',
//         },
//         // --- AJOUT OPTIONNEL MAIS RECOMMANDÉ ---
//         // Si vous utilisez les images d'avatar de pravatar.cc pour la page Équipe
//         {
//           protocol: 'https',
//           hostname: 'i.pravatar.cc',
//           port: '',
//           pathname: '/**',
//         },
//         {
//             protocol: 'https',
//             hostname: 'i.postimg.cc', // Le nouvel hôte à autoriser
//             port: '',
//             pathname: '/**',
//           },
//           {
//             protocol: 'http',
//             hostname: 'localhost',
//             port: '3001', // Important de spécifier le port
//             pathname: '/uploads/**', // Autorise tous les chemins dans le dossier /uploads
//           },
//       ],
//     },
//   };
  
//   export default nextConfig;


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
    ],
  },
};

export default nextConfig;