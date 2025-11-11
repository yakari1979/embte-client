"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { listUsers, resetUserPassword } from '@/services/api';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { PlusCircle, Edit, Trash2, Key, CheckCircle, Clipboard, Loader2, Search, GraduationCap, Briefcase } from 'lucide-react';
import SearchModal from '@/components/SearchModal';

// Le type User doit inclure l'identifiant
interface User {
  id: string;
  firstName: string;
  lastName: string;
  identifiant: string;
  role: 'TEACHER' | 'STUDENT';
}

// --- SOUS-COMPOSANT : MODAL POUR AFFICHER LE NOUVEAU MOT DE PASSE ---
const ResetPasswordModal: React.FC<{ identifiant: string; newPassword: string; onClose: () => void }> = ({ identifiant, newPassword, onClose }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(newPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-2">Mot de Passe Réinitialisé</h2>
                <p className="text-text-secondary mb-6">
                    Le mot de passe pour <span className="font-bold">{identifiant}</span> a été changé. Veuillez lui communiquer le nouveau mot de passe :
                </p>
                
                <div className="flex items-center justify-between bg-background p-3 rounded-md border border-gray-200 dark:border-gray-700">
                    <span className="font-mono text-lg text-primary">{newPassword}</span>
                    <button onClick={copyToClipboard} className="p-1 text-gray-400 hover:text-gray-600" title="Copier le mot de passe">
                        {copied ? <CheckCircle size={18} className="text-green-500" /> : <Clipboard size={18} />}
                    </button>
                </div>

                <button onClick={onClose} className="mt-8 btn-primary w-full">Fermer</button>
            </div>
        </div>
    );
};


// --- COMPOSANT PRINCIPAL DE LA PAGE ---
const UsersListPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [resetInfo, setResetInfo] = useState<{ identifiant: string; newPassword: string } | null>(null);
  const [loadingReset, setLoadingReset] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = Cookies.get('token');
      if (!token) {
        setError("Authentification requise.");
        setLoading(false);
        return;
      }

      try {
        const response = await listUsers(token);
        setUsers(response.data);
      } catch (err) {
        setError("Impossible de charger la liste des utilisateurs.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleResetPassword = async (e: React.MouseEvent, identifiant: string) => {
    e.stopPropagation(); // Empêche le clic de se propager
    const confirmation = confirm(`Êtes-vous sûr de vouloir réinitialiser le mot de passe pour l'utilisateur '${identifiant}' ? Cette action est irréversible.`);
    if (!confirmation) return;

    const token = Cookies.get('token');
    if (!token) {
        alert("Session expirée. Veuillez vous reconnecter.");
        return;
    }

    setLoadingReset(identifiant);
    try {
      const response = await resetUserPassword(identifiant, token);
      setResetInfo({
        identifiant: identifiant,
        newPassword: response.data.newPassword,
      });
    } catch (err) {
      alert("Erreur lors de la réinitialisation du mot de passe.");
    } finally {
      setLoadingReset(null);
    }
  };
  
  const handleDelete = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    alert(`Fonctionnalité de suppression pour l'utilisateur ${userId} à venir.`);
  };

  const handleEdit = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    alert(`Fonctionnalité de modification pour l'utilisateur ${userId} à venir.`);
  };

  // Composant réutilisable pour les boutons d'action
  const UserActions = ({ user }: { user: User }) => (
    <div className="flex items-center justify-end gap-1">
      <button 
        onClick={(e) => handleResetPassword(e, user.identifiant)} 
        className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-full" 
        title="Réinitialiser le mot de passe"
        disabled={loadingReset === user.identifiant}
      >
        {loadingReset === user.identifiant ? <Loader2 className="h-5 w-5 animate-spin"/> : <Key className="h-5 w-5" />}
      </button>
      <button onClick={(e) => handleEdit(e, user.id)} className="p-2 text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 rounded-full" title="Modifier">
        <Edit className="h-5 w-5" />
      </button>
      <button onClick={(e) => handleDelete(e, user.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-full" title="Supprimer">
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );

  return (
    <>
      <div>
        {/* --- En-tête de la page --- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h1 className="text-3xl font-bold text-text-primary">Gestion des Utilisateurs</h1>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsSearchOpen(true)} className="btn-secondary flex-1 sm:flex-initial">
                <Search className="h-5 w-5" />
                <span>Rechercher</span>
              </button>
              <Link href="/users/new" className="btn-primary flex-1 sm:flex-initial">
                <PlusCircle className="h-5 w-5" />
                <span>Ajouter</span>
              </Link>
            </div>
        </div>

        {/* --- Conteneur principal pour la liste/tableau --- */}
        <div className="bg-surface p-2 sm:p-6 rounded-lg shadow-md">
            {loading && <p className="text-center p-8 text-text-secondary">Chargement...</p>}
            {error && <p className="text-center text-red-500 p-8">{error}</p>}
            
            {!loading && !error && (
                <>
                    {/* --- VUE CARTES POUR MOBILE (visible jusqu'à la taille d'écran 'md') --- */}
                    <div className="md:hidden">
                      {users.length > 0 ? (
                        <div className="space-y-3">
                          {users.map(user => (
                            <div key={user.id} onClick={() => router.push(`/users/${user.id}`)} className="bg-background p-4 rounded-lg border dark:border-gray-700 flex flex-col gap-3 cursor-pointer active:bg-gray-100 dark:active:bg-gray-800">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-full ${user.role === 'STUDENT' ? 'bg-purple-100 dark:bg-purple-900/40' : 'bg-green-100 dark:bg-green-900/40'}`}>
                                    {user.role === 'STUDENT' ? <GraduationCap className="h-5 w-5 text-purple-600" /> : <Briefcase className="h-5 w-5 text-green-600" />}
                                  </div>
                                  <div>
                                    <p className="font-bold">{user.firstName} {user.lastName}</p>
                                    <p className="text-xs text-text-secondary">{user.role === 'TEACHER' ? 'Enseignant' : 'Étudiant'}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="border-t dark:border-gray-700 pt-2 flex items-center justify-between">
                                <p className="text-sm font-mono text-text-secondary">{user.identifiant}</p>
                                <UserActions user={user} />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center py-8 text-text-secondary">Aucun utilisateur trouvé.</p>
                      )}
                    </div>

                    {/* --- VUE TABLEAU POUR GRAND ÉCRAN (caché jusqu'à 'md') --- */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b-2 border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-sm font-semibold text-text-secondary">Prénom</th>
                                    <th className="px-4 py-3 text-sm font-semibold text-text-secondary">Nom</th>
                                    <th className="px-4 py-3 text-sm font-semibold text-text-secondary">Identifiant</th>
                                    <th className="px-4 py-3 text-sm font-semibold text-text-secondary">Rôle</th>
                                    <th className="px-4 py-3 text-sm font-semibold text-text-secondary text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                users.map(user => (
                                    <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer" onClick={() => router.push(`/users/${user.id}`)}>
                                        <td className="px-4 py-3">{user.firstName}</td>
                                        <td className="px-4 py-3">{user.lastName}</td>
                                        <td className="px-4 py-3 font-mono text-sm">{user.identifiant}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'TEACHER' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'}`}>
                                                {user.role === 'TEACHER' ? 'Enseignant' : 'Étudiant'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right"><UserActions user={user} /></td>
                                    </tr>
                                ))
                                ) : (
                                <tr><td colSpan={5} className="text-center py-8 text-text-secondary">Aucun utilisateur trouvé. <Link href="/users/new" className="text-blue-500 hover:underline">Commencez par en ajouter un</Link>.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
      </div>
      
      {resetInfo && <ResetPasswordModal identifiant={resetInfo.identifiant} newPassword={resetInfo.newPassword} onClose={() => setResetInfo(null)} />}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default UsersListPage;