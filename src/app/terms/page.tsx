import React from 'react';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

// Petit composant pour structurer les articles
const Article: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-primary mb-3">{title}</h2>
        <div className="space-y-3 text-text-secondary leading-relaxed">
            {children}
        </div>
    </section>
);

const TermsOfUsePage = () => {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:py-16 lg:px-8">
        <div className="max-w-4xl mx-auto bg-surface p-6 sm:p-10 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-primary">Conditions Générales d'Utilisation (CGU)</h1>
            <p className="text-sm text-text-subtle mt-2">Dernière mise à jour : 5 novembre 2025</p>
          </div>

          <Article title="Article 1 : Objet">
            <p>Les présentes Conditions Générales d'Utilisation (CGU) encadrent l'accès et l'utilisation de la Plateforme d'Éducation Numérique Intégrée (PENI). L'objectif de PENI est de fournir un environnement numérique d'apprentissage centralisé pour les établissements scolaires et universitaires du Sénégal.</p>
          </Article>

          <Article title="Article 2 : Accès à la Plateforme">
            <p>L'accès à PENI est restreint et conditionné par l'obtention d'un compte utilisateur (ci-après "Compte"). Les Comptes sont créés et distribués exclusivement par les administrateurs désignés de chaque établissement partenaire.</p>
            <p>L'utilisateur est seul responsable de la confidentialité de son identifiant et de son mot de passe. Toute utilisation du Compte avec ces identifiants est réputée être effectuée par l'utilisateur lui-même.</p>
          </Article>

          <Article title="Article 3 : Rôles et Responsabilités des Utilisateurs">
            <p><strong>L'Étudiant</strong> s'engage à utiliser la plateforme dans un but strictement éducatif. Il est tenu de respecter ses pairs et ses enseignants. Le partage de contenu inapproprié, le harcèlement ou toute forme de perturbation des cours en ligne est strictement interdit.</p>
            <p><strong>L'Enseignant</strong> s'engage à dispenser ses cours dans le respect du programme officiel et des règles de déontologie de sa profession. Il est responsable du contenu pédagogique qu'il met en ligne (documents, ressources, enregistrements).</p>
            <p><strong>L'Administrateur</strong> est le garant de la bonne gestion de l'espace numérique de son établissement. Il est responsable de la création des comptes, de l'exactitude des emplois du temps et de la bonne assignation des rôles.</p>
          </Article>
          
          <Article title="Article 4 : Propriété Intellectuelle">
            <p>La structure de la plateforme PENI, ses logos, et ses fonctionnalités sont la propriété exclusive de ses concepteurs. Toute reproduction est interdite.</p>
            <p>Les contenus pédagogiques (cours, documents, vidéos) mis en ligne par les enseignants restent leur propriété intellectuelle, ou celle de leur établissement selon les contrats en vigueur. Ils sont mis à disposition des élèves de la classe concernée pour un usage strictement personnel et éducatif.</p>
          </Article>

          <Article title="Article 5 : Données et Contenus">
            <p>Les utilisateurs s'engagent à ne pas téléverser de contenus illégaux, violents, ou portant atteinte à la dignité humaine. PENI se réserve le droit de supprimer tout contenu jugé non conforme sans préavis.</p>
            <p>L'enregistrement des sessions de cours est une fonctionnalité essentielle de la plateforme. En participant à un cours, l'utilisateur accepte que sa participation (audio, vidéo si activée, messages dans le chat) soit enregistrée et mise à la disposition des autres membres de la classe à des fins pédagogiques.</p>
          </Article>

          <Article title="Article 6 : Limitation de Responsabilité">
            <p>PENI est fourni "en l'état". Bien que nous nous efforcions d'assurer une disponibilité maximale, nous ne pouvons être tenus responsables des interruptions de service dues à des problèmes de connectivité de l'utilisateur ou à une maintenance technique.</p>
            <p>PENI n'est pas responsable du contenu pédagogique publié par les enseignants. Toute question relative au contenu d'un cours doit être adressée directement à l'enseignant ou à l'établissement concerné.</p>
          </Article>

          <Article title="Article 7 : Modification des CGU">
            <p>Nous nous réservons le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle. La poursuite de l'utilisation de la plateforme après modification vaut acceptation des nouvelles conditions.</p>
          </Article>

          <div className="mt-10 text-center">
            <Link href="/" className="btn-secondary w-auto">
                <LogIn className="h-4 w-4" />
                <span>Retour à la connexion</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUsePage;