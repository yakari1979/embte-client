// "use client";

// import React, { useState, useEffect, useCallback } from 'react';
// import Cookies from 'js-cookie';
// import Link from 'next/link';
// import { 
//     listAllEstablishments, 
//     createEstablishmentWithAdmin, 
//     EstablishmentSummary, 
//     NewEstablishmentData 
// } from '@/services/api';
// import { Building, Users, Eye, PlusCircle } from 'lucide-react';

// // --- NOUVEAU COMPOSANT : LE MODAL DE CRÉATION ---
// // Ce composant gère l'interface et la logique pour créer un nouvel établissement.
// const CreationModal: React.FC<{
//     isOpen: boolean;
//     onClose: () => void;
//     onCreated: () => void;
// }> = ({ isOpen, onClose, onCreated }) => {
//     if (!isOpen) return null;

//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [credentials, setCredentials] = useState<{ identifiant: string; password: string } | null>(null);

//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setError('');
//         setCredentials(null);

//         const formData = new FormData(e.currentTarget);
//         const data: NewEstablishmentData = {
//             establishmentName: formData.get('establishmentName') as string,
//             adminFirstName: formData.get('adminFirstName') as string,
//             adminLastName: formData.get('adminLastName') as string,
//             adminEmail: formData.get('adminEmail') as string,
//         };

//         const token = Cookies.get('token');
//         if (!token) {
//             setError("Session expirée. Veuillez vous reconnecter.");
//             setIsLoading(false);
//             return;
//         }

//         try {
//             const response = await createEstablishmentWithAdmin(data, token);
//             setCredentials(response.data.adminCredentials);
//             onCreated(); // Rafraîchit la liste sur la page parente
//         } catch (err: any) {
//             setError(err.response?.data?.message || "Une erreur est survenue lors de la création.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Gère la fermeture et la réinitialisation de l'état du modal
//     const handleClose = () => {
//         setCredentials(null);
//         setError('');
//         onClose();
//     };

//     return (
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={handleClose}>
//             <div className="bg-surface rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
//                 <div className="p-6 border-b dark:border-gray-700">
//                     <h2 className="text-xl font-bold text-text-primary">Créer un Nouvel Établissement</h2>
//                 </div>
//                 {credentials ? (
//                     <div className="p-6">
//                         <h3 className="font-bold text-green-600 dark:text-green-400 text-lg">Opération réussie !</h3>
//                         <p className="text-sm mt-2 text-text-secondary">Veuillez communiquer les identifiants temporaires suivants à l'administrateur de l'établissement :</p>
//                         <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm space-y-2">
//                             <p><strong>Identifiant :</strong> <span className="text-blue-600 dark:text-blue-400">{credentials.identifiant}</span></p>
//                             <p><strong>Mot de passe :</strong> <span className="text-blue-600 dark:text-blue-400">{credentials.password}</span></p>
//                         </div>
//                         <button onClick={handleClose} className="btn-primary mt-6 w-full">Fermer</button>
//                     </div>
//                 ) : (
//                     <form onSubmit={handleSubmit}>
//                         <div className="p-6 space-y-4">
//                             <input name="establishmentName" placeholder="Nom de l'établissement" className="input-field" required/>
//                             <hr className="my-2 dark:border-gray-700"/>
//                             <p className="font-semibold text-text-primary">Compte Administrateur Principal</p>
//                             <input name="adminFirstName" placeholder="Prénom de l'admin" className="input-field" required/>
//                             <input name="adminLastName" placeholder="Nom de l'admin" className="input-field" required/>
//                             <input name="adminEmail" type="email" placeholder="Email de l'admin (servira d'identifiant)" className="input-field" required/>
//                             {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//                         </div>
//                         <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-4 rounded-b-lg border-t dark:border-gray-700">
//                             <button type="button" onClick={handleClose} className="btn-secondary">Annuler</button>
//                             <button type="submit" disabled={isLoading} className="btn-primary min-w-[100px] justify-center">
//                                 {isLoading ? 'Création...' : 'Créer'}
//                             </button>
//                         </div>
//                     </form>
//                 )}
//             </div>
//         </div>
//     );
// };


// // --- COMPOSANT PRINCIPAL DE LA PAGE ---
// const EstablishmentsListPage = () => {
//     const [establishments, setEstablishments] = useState<EstablishmentSummary[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     // useCallback pour éviter de recréer la fonction à chaque rendu
//     const fetchData = useCallback(async () => {
//         setIsLoading(true);
//         const token = Cookies.get('token');
//         if (!token) {
//             setError("Session invalide. Veuillez vous reconnecter.");
//             setIsLoading(false);
//             return;
//         }
//         try {
//             const { data } = await listAllEstablishments(token);
//             setEstablishments(data);
//         } catch (err) {
//             setError("Impossible de charger la liste des établissements.");
//         } finally {
//             setIsLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     const handleCreationSuccess = () => {
//         fetchData(); // On rafraîchit la liste
//         // On ne ferme PAS le modal automatiquement pour laisser le temps de copier les identifiants.
//     };

//     return (
//         <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
//             <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
//                 <div>
//                     <h1 className="text-3xl font-bold text-text-primary">Liste des Établissements</h1>
//                     <p className="text-text-secondary mt-1">Supervision de tous les établissements inscrits sur la plateforme.</p>
//                 </div>
//                 <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2 justify-center w-full sm:w-auto">
//                     <PlusCircle size={20}/> Créer un Établissement
//                 </button>
//             </header>

//             <div className="bg-surface rounded-lg shadow-md border border-transparent dark:border-gray-800">
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                         <thead className="bg-gray-50 dark:bg-gray-800/50">
//                             <tr>
//                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Nom de l'Établissement</th>
//                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Nombre d'Utilisateurs</th>
//                                 <th scope="col" className="relative px-6 py-3"><span className="sr-only">Détails</span></th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                             {isLoading ? (
//                                 <tr><td colSpan={3} className="text-center py-8 text-text-secondary">Chargement...</td></tr>
//                             ) : error ? (
//                                 <tr><td colSpan={3} className="text-center py-8 text-red-500">{error}</td></tr>
//                             ) : establishments.length === 0 ? (
//                                 <tr><td colSpan={3} className="text-center py-8 text-text-secondary">Aucun établissement n'a été créé.</td></tr>
//                             ) : (
//                                 establishments.map((est) => (
//                                     <tr key={est.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <div className="flex items-center">
//                                                 <Building className="h-5 w-5 mr-3 text-text-secondary" />
//                                                 <span className="font-medium text-text-primary">{est.name}</span>
//                                             </div>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <div className="flex items-center text-text-secondary">
//                                                 <Users className="h-5 w-5 mr-2" />
//                                                 <span>{est._count.users}</span>
//                                             </div>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                             <Link href={`/moderator/establishments/${est.id}`} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
//                                                 <Eye size={16} />
//                                                 Voir les détails
//                                             </Link>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
            
//             {/* Le Modal est appelé ici */}
//             <CreationModal 
//                 isOpen={isModalOpen} 
//                 onClose={() => setIsModalOpen(false)}
//                 onCreated={handleCreationSuccess}
//             />
//         </div>
//     );
// };

// export default EstablishmentsListPage;


"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { 
    listAllEstablishments, 
    createEstablishmentWithAdmin, 
    toggleEstablishmentSuspension,
    deleteEstablishment,
    EstablishmentSummary, 
    NewEstablishmentData 
} from '@/services/api';
import { Building, Users, Eye, PlusCircle, AlertTriangle, Play, Pause } from 'lucide-react';

const CreationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onCreated: () => void;
}> = ({ isOpen, onClose, onCreated }) => {
    if (!isOpen) return null;

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [credentials, setCredentials] = useState<{ identifiant: string; password: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setCredentials(null);

        const formData = new FormData(e.currentTarget);
        const data: NewEstablishmentData = {
            establishmentName: formData.get('establishmentName') as string,
            adminFirstName: formData.get('adminFirstName') as string,
            adminLastName: formData.get('adminLastName') as string,
            adminEmail: formData.get('adminEmail') as string,
        };

        const token = Cookies.get('token');
        if (!token) {
            setError("Session expirée. Veuillez vous reconnecter.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await createEstablishmentWithAdmin(data, token);
            setCredentials(response.data.adminCredentials);
            onCreated();
        } catch (err: any) {
            setError(err.response?.data?.message || "Une erreur est survenue lors de la création.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setCredentials(null);
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={handleClose}>
            <div className="bg-surface rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold text-text-primary">Créer un Nouvel Établissement</h2>
                </div>
                {credentials ? (
                    <div className="p-6">
                        <h3 className="font-bold text-green-600 dark:text-green-400 text-lg">Opération réussie !</h3>
                        <p className="text-sm mt-2 text-text-secondary">Veuillez communiquer les identifiants temporaires suivants à l'administrateur de l'établissement :</p>
                        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm space-y-2">
                            <p><strong>Identifiant :</strong> <span className="text-blue-600 dark:text-blue-400">{credentials.identifiant}</span></p>
                            <p><strong>Mot de passe :</strong> <span className="text-blue-600 dark:text-blue-400">{credentials.password}</span></p>
                        </div>
                        <button onClick={handleClose} className="btn-primary mt-6 w-full">Fermer</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-4">
                            <input name="establishmentName" placeholder="Nom de l'établissement" className="input-field" required/>
                            <hr className="my-2 dark:border-gray-700"/>
                            <p className="font-semibold text-text-primary">Compte Administrateur Principal</p>
                            <input name="adminFirstName" placeholder="Prénom de l'admin" className="input-field" required/>
                            <input name="adminLastName" placeholder="Nom de l'admin" className="input-field" required/>
                            <input name="adminEmail" type="email" placeholder="Email de l'admin (servira d'identifiant)" className="input-field" required/>
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-4 rounded-b-lg border-t dark:border-gray-700">
                            <button type="button" onClick={handleClose} className="btn-secondary">Annuler</button>
                            <button type="submit" disabled={isLoading} className="btn-primary min-w-[100px] justify-center">
                                {isLoading ? 'Création...' : 'Créer'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

const EstablishmentsListPage = () => {
    const [establishments, setEstablishments] = useState<EstablishmentSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const token = Cookies.get('token');
        if (!token) {
            setError("Session invalide. Veuillez vous reconnecter.");
            setIsLoading(false);
            return;
        }
        try {
            const { data } = await listAllEstablishments(token);
            setEstablishments(data);
        } catch (err) {
            setError("Impossible de charger la liste des établissements.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreationSuccess = () => {
        fetchData();
    };
    
    const handleToggleSuspend = async (establishmentId: string) => {
        const token = Cookies.get('token');
        if (!token) return;
        try {
            await toggleEstablishmentSuspension(establishmentId, token);
            fetchData();
        } catch (err) {
            alert("Erreur lors du changement de statut.");
        }
    };

    const handleDelete = async (establishmentId: string, establishmentName: string) => {
        if (window.confirm(`Êtes-vous absolument sûr de vouloir supprimer l'établissement "${establishmentName}" ?\n\nCETTE ACTION EST IRRÉVERSIBLE ET SUPPRIMERA TOUS LES UTILISATEURS, CLASSES ET DONNÉES ASSOCIÉES.`)) {
            const token = Cookies.get('token');
            if (!token) return;
            try {
                await deleteEstablishment(establishmentId, token);
                fetchData();
            } catch (err) {
                alert("Erreur lors de la suppression.");
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Gestion des Établissements</h1>
                    <p className="text-text-secondary mt-1">Supervision de tous les établissements inscrits sur la plateforme.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2 justify-center w-full sm:w-auto">
                    <PlusCircle size={20}/> Créer un Établissement
                </button>
            </header>

            <div className="bg-surface rounded-lg shadow-md border border-transparent dark:border-gray-800">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Établissement</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Utilisateurs</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Statut</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {isLoading ? (
                                <tr><td colSpan={4} className="text-center py-8 text-text-secondary">Chargement...</td></tr>
                            ) : error ? (
                                <tr><td colSpan={4} className="text-center py-8 text-red-500">{error}</td></tr>
                            ) : establishments.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-8 text-text-secondary">Aucun établissement n'a été créé.</td></tr>
                            ) : (
                                establishments.map((est) => (
                                    <tr key={est.id} className={`${est.isSuspended ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'} transition-colors`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Building className="h-5 w-5 mr-3 text-text-secondary" />
                                                <span className="font-medium text-text-primary">{est.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-text-secondary">
                                                <Users className="h-5 w-5 mr-2" />
                                                <span>{est._count.users}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {est.isSuspended ? (
                                                <span className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                    <Pause size={12}/> Suspendu
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                    <Play size={12}/> Actif
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end items-center gap-4">
                                                <Link href={`/moderator/establishments/${est.id}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" title="Voir les détails">
                                                    <Eye size={16} />
                                                </Link>
                                                <button onClick={() => handleToggleSuspend(est.id)} className={est.isSuspended ? 'text-green-600 hover:text-green-800' : 'text-yellow-600 hover:text-yellow-800'} title={est.isSuspended ? 'Réactiver' : 'Suspendre'}>
                                                    {est.isSuspended ? <Play size={16} /> : <Pause size={16} />}
                                                </button>
                                                <button onClick={() => handleDelete(est.id, est.name)} className="text-red-600 hover:text-red-800" title="Supprimer Définitivement">
                                                    <AlertTriangle size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <CreationModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onCreated={handleCreationSuccess}
            />
        </div>
    );
};

export default EstablishmentsListPage;