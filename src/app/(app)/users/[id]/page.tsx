// "use client";

// import React, { useState, useEffect } from 'react';
// import { usePathname } from 'next/navigation';
// import { getUserDetails } from '@/services/api';
// import Cookies from 'js-cookie';
// import { Loader2, AlertCircle, User, GraduationCap, Briefcase, Mail, Key, School } from 'lucide-react';

// interface UserDetails {
//   id: string;
//   firstName: string;
//   lastName: string;
//   identifiant: string;
//   email: string | null;
//   role: 'STUDENT' | 'TEACHER';
//   enrolledClass: { name: string } | null;
// }

// const UserDetailPage = () => {
//   const pathname = usePathname();
//   const userId = pathname.split('/').pop() || '';
//   const [user, setUser] = useState<UserDetails | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!userId) return;
//     const fetchData = async () => {
//       const token = Cookies.get('token');
//       if (!token) { setError("Authentification requise."); setLoading(false); return; }
//       try {
//         const response = await getUserDetails(userId, token);
//         setUser(response.data);
//       } catch (err) {
//         setError("Impossible de charger les détails de l'utilisateur.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [userId]);

//   if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
//   if (error) return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;
//   if (!user) return <div className="p-4">Utilisateur non trouvé.</div>;

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="bg-surface p-8 rounded-lg shadow-md">
//         <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
//           <div className={`p-4 rounded-full ${user.role === 'STUDENT' ? 'bg-purple-100' : 'bg-green-100'}`}>
//             {user.role === 'STUDENT' ? <GraduationCap className="h-10 w-10 text-purple-600" /> : <Briefcase className="h-10 w-10 text-green-600" />}
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
//             <p className="text-lg text-text-secondary">{user.role === 'STUDENT' ? 'Élève' : 'Enseignant'}</p>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold border-b pb-2 mb-2">Informations Personnelles</h3>
//             <p className="flex items-center"><User className="mr-2 text-text-subtle" />{user.firstName} {user.lastName}</p>
//             <p className="flex items-center"><Mail className="mr-2 text-text-subtle" />{user.email || 'Non renseigné'}</p>
//           </div>
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold border-b pb-2 mb-2">Informations de Connexion</h3>
//             <p className="flex items-center"><Key className="mr-2 text-text-subtle" />Identifiant : <span className="font-mono ml-2">{user.identifiant}</span></p>
//             {user.role === 'STUDENT' && user.enrolledClass && (
//               <p className="flex items-center"><School className="mr-2 text-text-subtle" />Classe : {user.enrolledClass.name}</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDetailPage;





"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { getUserDetails, UserDetails, assignStudentToParent, searchParents, ParentSearchResult } from '@/services/api';
import Cookies from 'js-cookie';
import { Loader2, User, GraduationCap, Briefcase, Mail, Key, School, Link2, UserPlus, Search } from 'lucide-react';
import useDebounce from '@/hooks/useDebounce'; // Un hook custom très utile, voir code ci-dessous

// --- HOOK OPTIONNEL MAIS RECOMMANDÉ : useDebounce ---
// Créez un fichier `hooks/useDebounce.ts` et mettez-y ce code.
// Il évite de surcharger l'API en n'effectuant la recherche que lorsque l'utilisateur a fini de taper.
/*
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default useDebounce;
*/


// --- SOUS-COMPOSANT : MODAL D'ASSIGNATION DE PARENT ---
const AssignParentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAssign: (parentId: string) => Promise<void>;
}> = ({ isOpen, onClose, onAssign }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<ParentSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isAssigning, setIsAssigning] = useState<string | null>(null);
    
    // Utilisez le vrai hook si vous l'avez créé, sinon commentez cette ligne
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        const performSearch = async () => {
            if (debouncedSearchTerm.length < 2) {
                setResults([]);
                return;
            }
            setIsSearching(true);
            const token = Cookies.get('token');
            if(token) {
                try {
                    const response = await searchParents(debouncedSearchTerm, token);
                    setResults(response.data);
                } catch (error) {
                    console.error("Erreur de recherche:", error);
                } finally {
                    setIsSearching(false);
                }
            }
        };
        performSearch();
    }, [debouncedSearchTerm]);

    const handleAssignClick = async (parentId: string) => {
        setIsAssigning(parentId);
        await onAssign(parentId);
        setIsAssigning(null);
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-surface rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b"><h2 className="text-xl font-bold">Assigner un Parent</h2></div>
                <div className="p-6">
                    <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Rechercher par nom ou identifiant..." className="input-field pl-10"/></div>
                    <div className="mt-4 h-64 overflow-y-auto space-y-2">
                        {isSearching && <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>}
                        {!isSearching && results.length === 0 && <p className="text-center text-text-secondary py-4 italic">{debouncedSearchTerm.length > 1 ? "Aucun parent trouvé." : "Tapez au moins 2 lettres pour rechercher."}</p>}
                        {results.map(parent => (
                            <div key={parent.id} className="flex items-center justify-between p-3 bg-background rounded-md">
                                <div><p className="font-semibold">{parent.firstName} {parent.lastName}</p><p className="text-sm font-mono text-text-secondary">{parent.identifiant}</p></div>
                                <button onClick={() => handleAssignClick(parent.id)} disabled={!!isAssigning} className="btn-primary-sm justify-center min-w-[90px]">
                                    {isAssigning === parent.id ? <Loader2 className="animate-spin h-4 w-4" /> : "Assigner"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- COMPOSANT PRINCIPAL DE LA PAGE ---
const UserDetailPage = () => {
  const pathname = usePathname();
  const userId = pathname.split('/').pop() || '';
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    const token = Cookies.get('token');
    if (!token) { setError("Authentification requise."); setLoading(false); return; }
    try {
      const response = await getUserDetails(userId, token);
      setUser(response.data);
    } catch (err) {
      setError("Impossible de charger les détails de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAssignParent = async (parentId: string) => {
      const token = Cookies.get('token');
      if (!token) { alert("Session expirée."); return; }
      try {
          await assignStudentToParent(parentId, userId, token);
          setIsModalOpen(false);
          await fetchData(); // Recharger les données pour afficher le nouveau parent
      } catch (error) {
          alert("Erreur lors de l'assignation.");
      }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-blue-500" /></div>;
  if (error) return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;
  if (!user) return <div className="p-4">Utilisateur non trouvé.</div>;

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface p-8 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b dark:border-gray-700">
            <div className={`p-4 rounded-full ${user.role === 'STUDENT' ? 'bg-purple-100 dark:bg-purple-900/40' : 'bg-green-100 dark:bg-green-900/40'}`}>
              {user.role === 'STUDENT' ? <GraduationCap className="h-10 w-10 text-purple-600" /> : <Briefcase className="h-10 w-10 text-green-600" />}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-primary">{user.firstName} {user.lastName}</h1>
              <p className="text-lg text-text-secondary">{user.role === 'STUDENT' ? 'Élève' : 'Enseignant'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">Informations Générales</h3>
              <div className="space-y-3">
                <p className="flex items-center"><User className="mr-3 text-text-subtle" />{user.firstName} {user.lastName}</p>
                <p className="flex items-center"><Mail className="mr-3 text-text-subtle" />{user.email || 'Non renseigné'}</p>
                <p className="flex items-center"><Key className="mr-3 text-text-subtle" />Identifiant : <span className="font-mono ml-2">{user.identifiant}</span></p>
              </div>
            </div>
            
            {user.role === 'STUDENT' && (
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Informations Scolaires</h3>
                <div className="space-y-3">
                  {user.enrolledClass && <p className="flex items-center"><School className="mr-3 text-text-subtle" />Classe : {user.enrolledClass.name}</p>}
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center">
                      <UserPlus className="mr-3 text-text-subtle" />
                      <div>
                        <p>Parent Assigné</p>
                        <p className="text-sm font-semibold text-text-primary">{user.parent ? `${user.parent.firstName} ${user.parent.lastName}` : 'Aucun'}</p>
                      </div>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="btn-secondary-sm">
                      <Link2 className="h-4 w-4 mr-1"/>
                      {user.parent ? "Changer" : "Assigner"}
                    </button>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AssignParentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAssign={handleAssignParent} />
    </>
  );
};

export default UserDetailPage;