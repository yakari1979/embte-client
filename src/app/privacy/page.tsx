import React from 'react';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

// On réutilise le même composant Article
const Article: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-primary mb-3">{title}</h2>
        <div className="space-y-3 text-text-secondary leading-relaxed">
            {children}
        </div>
    </section>
);

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:py-16 lg:px-8">
        <div className="max-w-4xl mx-auto bg-surface p-6 sm:p-10 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-primary">Politique de Confidentialité</h1>
            <p className="text-sm text-text-subtle mt-2">Dernière mise à jour : 5 novembre 2025</p>
          </div>

          <Article title="1. Introduction">
            <p>La Plateforme d'Éducation Numérique Intégrée (PENI) s'engage à protéger la vie privée et les données personnelles de ses utilisateurs, conformément à la législation en vigueur au Sénégal, notamment la loi 2008-08 sur la protection des données à caractère personnel. Cette politique décrit les données que nous collectons et la manière dont nous les utilisons.</p>
          </Article>

          <Article title="2. Quelles données collectons-nous ?">
            <p>Nous collectons les données strictement nécessaires au bon fonctionnement de la plateforme :</p>
            <ul className="list-disc list-inside space-y-2">
                <li><strong>Données d'identification :</strong> Nom, prénom, identifiant unique, rôle (Étudiant, Enseignant, Admin), et établissement d'appartenance. L'adresse email est optionnelle et utilisée pour les notifications.</li>
                <li><strong>Données pédagogiques :</strong> Classe d'appartenance, notes, appréciations, et registres de présence. Ces données sont gérées par les enseignants et administrateurs.</li>
                <li><strong>Données d'utilisation :</strong> Enregistrements vidéo et audio des sessions de cours, messages échangés dans le chat, et ressources partagées.</li>
                <li><strong>Données techniques :</strong> Adresses IP et journaux de connexion, à des fins de sécurité et de maintenance.</li>
            </ul>
          </Article>

          <Article title="3. Pourquoi collectons-nous ces données ?">
            <p>Vos données sont utilisées exclusivement pour les finalités suivantes :</p>
            <ul className="list-disc list-inside space-y-2">
                <li>Assurer votre authentification et sécuriser l'accès à votre compte.</li>
                <li>Permettre le bon déroulement des cours en ligne et la gestion des emplois du temps.</li>
                <li>Permettre aux enseignants d'assurer le suivi pédagogique (notation, absences).</li>
                <li>Mettre à disposition les enregistrements des cours à des fins de révision.</li>
                <li>Générer des statistiques anonymisées pour le Ministère de l'Éducation Nationale afin de piloter les politiques éducatives.</li>
            </ul>
          </Article>

          <Article title="4. Qui a accès à vos données ?">
            <p>L'accès aux données est strictement cloisonné par rôle :</p>
            <ul className="list-disc list-inside space-y-2">
                <li><strong>Vous :</strong> Vous avez accès à vos propres informations de profil, à vos cours et à vos notes.</li>
                <li><strong>Vos Enseignants :</strong> Ils ont accès aux informations des élèves de leurs classes (liste, notes, absences) uniquement pour les matières qu'ils enseignent.</li>
                <li><strong>Votre Administrateur :</strong> Il gère les comptes et les classes, mais n'a PAS accès à vos notes ou au contenu de vos cours.</li>
                <li><strong>PENI :</strong> Notre équipe technique peut accéder aux données à des fins de maintenance, mais est soumise à une stricte obligation de confidentialité.</li>
            </ul>
            <p className="font-semibold mt-4">Vos données personnelles ne sont jamais vendues, partagées ou louées à des tiers à des fins commerciales.</p>
          </Article>

          <Article title="5. Sécurité et Conservation des données">
            <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données, notamment le cryptage des mots de passe et la sécurisation de nos serveurs.</p>
            <p>Les données sont conservées pendant la durée de la scolarité de l'élève ou du contrat de l'enseignant, puis anonymisées ou supprimées conformément aux directives légales.</p>
          </Article>
          
          <Article title="6. Vos Droits">
            <p>Conformément à la loi, vous disposez d'un droit d'accès, de rectification et d'opposition concernant vos données personnelles. Pour exercer ces droits, veuillez vous adresser en premier lieu à l'administrateur de votre établissement.</p>
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

export default PrivacyPolicyPage;