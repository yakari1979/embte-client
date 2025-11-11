

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'via.placeholder.com',
          port: '',
          pathname: '/**',
        },
        // --- AJOUT OPTIONNEL MAIS RECOMMANDÉ ---
        // Si vous utilisez les images d'avatar de pravatar.cc pour la page Équipe
        {
          protocol: 'https',
          hostname: 'i.pravatar.cc',
          port: '',
          pathname: '/**',
        },
        {
            protocol: 'https',
            hostname: 'i.postimg.cc', // Le nouvel hôte à autoriser
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '3001', // Important de spécifier le port
            pathname: '/uploads/**', // Autorise tous les chemins dans le dossier /uploads
          },
      ],
    },
  };
  
  export default nextConfig;