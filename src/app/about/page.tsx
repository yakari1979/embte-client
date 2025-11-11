import React from 'react';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto bg-surface p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-primary mb-4">À Propos de la Plateforme PENI</h1>
          <p className="text-text-secondary mb-6">
            PENI (Plateforme d'Éducation Numérique Intégrée) est une initiative stratégique visant à numériser et moderniser le système éducatif sénégalais, en s'alignant sur la Stratégie du Numérique pour l'Éducation 2025-2029.
          </p>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Notre Mission</h2>
            <p>Notre mission est de fournir un écosystème numérique unifié, sécurisé et accessible à tous les établissements, enseignants et élèves du Sénégal. Nous cherchons à réduire la fracture numérique, à garantir la continuité pédagogique et à préparer la jeunesse aux défis de demain grâce à des outils innovants, incluant l'intelligence artificielle.</p>
            <h2 className="text-2xl font-semibold">Proposé par</h2>
            <p>Ce projet est une initiative citoyenne proposée et développée par Mouhamed SAKHO, ingénieur et chercheur en Intelligence Artificielle, avec la vision de contribuer activement à l'édification d'un Sénégal numérique et prospère.</p>
          </div>
          <div className="mt-8 text-center">
            <Link href="/" className="btn-primary w-auto">
              Retour à la page de connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;