"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Clipboard, CheckCircle, Download, ArrowLeft, GraduationCap, Briefcase } from 'lucide-react';

// Type pour les données des utilisateurs créés, reçues via l'URL
interface CreatedUser {
  firstName: string;
  lastName: string;
  identifiant: string;
  password: string;
  role: 'Enseignant' | 'Étudiant';
}

// --- COMPOSANT PRINCIPAL DE LA PAGE DE RÉSUMÉ ---
const BulkCreationSummaryPage = () => {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<CreatedUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  // State pour gérer la visibilité de chaque mot de passe individuellement
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  // State pour donner un feedback visuel lors de la copie
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    // On récupère les données encodées depuis le paramètre d'URL 'data'
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        // On décode et on parse le JSON pour récupérer notre tableau d'utilisateurs
        const decodedData = decodeURIComponent(dataParam);
        const parsedUsers = JSON.parse(decodedData) as CreatedUser[];
        setUsers(parsedUsers);
      } catch (e) {
        console.error("Erreur lors du parsing des données utilisateur :", e);
        setError("Les données reçues sont invalides ou corrompues.");
      }
    } else {
        // Cas où l'utilisateur arrive sur la page sans données
        setError("Aucune donnée d'utilisateur à afficher. Cette page s'affiche après une création en masse.");
    }
  }, [searchParams]);

  // Fonction pour basculer la visibilité d'un mot de passe
  const togglePasswordVisibility = (identifiant: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [identifiant]: !prev[identifiant]
    }));
  };

  // Fonction pour copier un texte dans le presse-papiers
  const copyToClipboard = (text: string, identifiant: string) => {
    navigator.clipboard.writeText(text);
    setCopied(identifiant);
    setTimeout(() => setCopied(null), 2000); // Réinitialise l'icône après 2s
  };

  // Fonction pour exporter la liste en fichier CSV
  const exportToCSV = () => {
    const headers = "Prénom,Nom,Rôle,Identifiant,Mot de Passe Temporaire";
    const rows = users.map(user => 
      [user.firstName, user.lastName, user.role, user.identifiant, user.password].join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    link.href = URL.createObjectURL(blob);
    link.download = `identifiants-nouveaux-utilisateurs.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  if (error) {
    return (
        <div className="text-center p-8 bg-surface rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-red-500 mb-4">Une erreur est survenue</h2>
            <p className="text-text-secondary mb-6">{error}</p>
            <Link href="/users" className="btn-secondary">
                &larr; Retour à la gestion des utilisateurs
            </Link>
        </div>
    );
  }

  return (
    <div>
      {/* --- En-tête de la page --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-text-primary">Résultats de la Création en Masse</h1>
          <div className="flex items-center gap-2">
            <Link href="/users" className="btn-secondary flex-1 sm:flex-initial">
              <ArrowLeft className="h-5 w-5" />
              <span>Retour</span>
            </Link>
            <button onClick={exportToCSV} className="btn-primary flex-1 sm:flex-initial" disabled={users.length === 0}>
              <Download className="h-5 w-5" />
              <span>Exporter en CSV</span>
            </button>
          </div>
      </div>

      {/* --- Conteneur principal pour la liste/tableau --- */}
      <div className="bg-surface p-2 sm:p-6 rounded-lg shadow-md">
        <p className="text-sm text-text-secondary mb-4 px-2 sm:px-0">
          Voici la liste des utilisateurs qui ont été créés. Veuillez leur communiquer leurs identifiants et mots de passe temporaires.
          <strong> Cette liste ne sera pas sauvegardée.</strong>
        </p>

        {/* --- VUE CARTES POUR MOBILE --- */}
        <div className="md:hidden">
          {users.length > 0 ? (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.identifiant} className="bg-background p-4 rounded-lg border dark:border-gray-700 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${user.role === 'Étudiant' ? 'bg-purple-100 dark:bg-purple-900/40' : 'bg-green-100 dark:bg-green-900/40'}`}>
                      {user.role === 'Étudiant' ? <GraduationCap className="h-5 w-5 text-purple-600" /> : <Briefcase className="h-5 w-5 text-green-600" />}
                    </div>
                    <div>
                      <p className="font-bold">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-text-secondary">{user.role}</p>
                    </div>
                  </div>
                  <div className="border-t dark:border-gray-700 pt-3 space-y-2">
                    <p className="text-sm font-mono text-text-secondary"><strong>ID:</strong> {user.identifiant}</p>
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-sm">{visiblePasswords[user.identifiant] ? user.password : '••••••••'}</span>
                        <div className="flex items-center">
                            <button onClick={() => togglePasswordVisibility(user.identifiant)} className="p-2 text-gray-500 hover:text-gray-700">
                                {visiblePasswords[user.identifiant] ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <button onClick={() => copyToClipboard(user.password, user.identifiant)} className="p-2 text-gray-500 hover:text-gray-700">
                                {copied === user.identifiant ? <CheckCircle size={16} className="text-green-500" /> : <Clipboard size={16} />}
                            </button>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-center py-8 text-text-secondary">Aucun nouvel utilisateur n'a été créé.</p>}
        </div>

        {/* --- VUE TABLEAU POUR GRAND ÉCRAN --- */}
        <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
                <thead className="border-b-2 border-gray-200 dark:border-gray-700">
                    <tr>
                        <th className="px-4 py-3 text-sm font-semibold text-text-secondary">Prénom</th>
                        <th className="px-4 py-3 text-sm font-semibold text-text-secondary">Nom</th>
                        <th className="px-4 py-3 text-sm font-semibold text-text-secondary">Rôle</th>
                        <th className="px-4 py-3 text-sm font-semibold text-text-secondary">Identifiant</th>
                        <th className="px-4 py-3 text-sm font-semibold text-text-secondary">Mot de Passe</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                    users.map(user => (
                        <tr key={user.identifiant} className="border-b border-gray-200 dark:border-gray-700">
                            <td className="px-4 py-3">{user.firstName}</td>
                            <td className="px-4 py-3">{user.lastName}</td>
                            <td className="px-4 py-3">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'Enseignant' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-4 py-3 font-mono text-sm">{user.identifiant}</td>
                            <td className="px-4 py-3">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-mono">{visiblePasswords[user.identifiant] ? user.password : '••••••••'}</span>
                                    <div className="flex items-center">
                                        <button onClick={() => togglePasswordVisibility(user.identifiant)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full" title="Afficher/Cacher">
                                            {visiblePasswords[user.identifiant] ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                        <button onClick={() => copyToClipboard(user.password, user.identifiant)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full" title="Copier">
                                            {copied === user.identifiant ? <CheckCircle size={16} className="text-green-500" /> : <Clipboard size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))
                    ) : (
                    <tr><td colSpan={5} className="text-center py-8 text-text-secondary">Aucun nouvel utilisateur n'a été créé.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default BulkCreationSummaryPage;