// // (app)/moderator/establishments/[id]/page.tsx

// "use client";

// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';
// import { 
//     getEstablishmentDetails,
//     updateEstablishmentStatus,
//     EstablishmentDetails, // On importe le type corrigé
//     AdminInDetails        // On importe le type pour l'admin
// } from '@/services/api';
// import { ArrowLeft, Building, Mail, Phone, User, Calendar, Hash, ShieldCheck, ShieldX, School } from 'lucide-react';
// import Link from 'next/link';

// // Composant pour afficher une information
// const DetailItem: React.FC<{ icon: React.ElementType; label: string; value?: string | null }> = ({ icon: Icon, label, value }) => (
//     <div className="flex items-start gap-4">
//         <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
//             <Icon className="h-5 w-5 text-text-secondary" />
//         </div>
//         <div>
//             <p className="text-sm font-medium text-text-secondary">{label}</p>
//             <p className="text-base font-semibold text-text-primary">{value || 'Non fourni'}</p>
//         </div>
//     </div>
// );

// const EstablishmentDetailPage = () => {
//     const { id } = useParams();
//     const router = useRouter();
//     const [establishment, setEstablishment] = useState<EstablishmentDetails | null>(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState('');

//     const establishmentId = Array.isArray(id) ? id[0] : id;

//     const fetchData = useCallback(async () => {
//         if (!establishmentId) return;
//         setIsLoading(true);
//         setError('');
//         const token = Cookies.get('token');
//         if (!token) {
//             setError("Session invalide.");
//             setIsLoading(false);
//             return;
//         }
//         try {
//             const { data } = await getEstablishmentDetails(establishmentId, token);
//             setEstablishment(data);
//         } catch (err) {
//             setError("Impossible de charger les détails de l'établissement.");
//         } finally {
//             setIsLoading(false);
//         }
//     }, [establishmentId]);

//     useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     const handleStatusUpdate = async (status: 'ACTIVE' | 'REJECTED') => {
//         const token = Cookies.get('token');
//         if (!token || !establishmentId) return;

//         try {
//             await updateEstablishmentStatus(establishmentId, status, token);
//             alert(`L'établissement a été ${status === 'ACTIVE' ? 'approuvé' : 'rejeté'} avec succès.`);
//             router.push('/moderator/inscriptions');
//         } catch (err: any) {
//             alert(err.response?.data?.message || "Erreur lors de la mise à jour du statut.");
//         }
//     };

//     if (isLoading) {
//         return <div className="text-center p-12">Chargement des détails...</div>;
//     }

//     if (error) {
//         return <div className="text-center p-12 text-red-500">{error}</div>;
//     }

//     if (!establishment) {
//         return <div className="text-center p-12">Établissement non trouvé.</div>;
//     }

//     // On cherche l'administrateur dans la liste des utilisateurs
//     const admin = establishment.users.find(user => user.role === 'ADMIN');

//     return (
//         <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
//             <header className="mb-8">
//                 <Link href="/moderator/inscriptions" className="flex items-center text-sm text-blue-600 hover:underline mb-4">
//                     <ArrowLeft size={16} className="mr-1" />
//                     Retour à la liste des inscriptions
//                 </Link>
//                 <h1 className="text-3xl font-bold text-text-primary">{establishment.name}</h1>
//                 <p className="text-text-secondary mt-1 capitalize">{establishment.type || 'Type non spécifié'}</p>
//             </header>

//             {/* --- Actions pour les demandes en attente --- */}
//             {establishment.status === 'PENDING' && (
//                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
//                     <p className="text-lg font-semibold text-blue-800 dark:text-blue-200">Cette demande est en attente de validation.</p>
//                     <div className="flex items-center gap-3">
//                         <button 
//                             onClick={() => handleStatusUpdate('REJECTED')}
//                             className="btn-secondary bg-red-100 text-red-700 hover:bg-red-200"
//                         >
//                             <ShieldX size={16} className="mr-2" />
//                             Refuser
//                         </button>
//                         <button 
//                             onClick={() => handleStatusUpdate('ACTIVE')}
//                             className="btn-primary"
//                         >
//                             <ShieldCheck size={16} className="mr-2" />
//                             Approuver l'inscription
//                         </button>
//                     </div>
//                 </div>
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 {/* --- Colonne 1: Détails de l'établissement --- */}
//                 <div className="bg-surface rounded-lg shadow-md border dark:border-gray-800 p-6">
//                     <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3"><Building />Informations</h2>
//                     <div className="space-y-5">
//                         <DetailItem icon={School} label="Adresse" value={establishment.address} />
//                         <DetailItem icon={Hash} label="ID Système" value={establishment.id} />
//                         <DetailItem 
//                             icon={Calendar} 
//                             label="Date de la demande" 
//                             value={new Date(establishment.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'full' })} 
//                         />
//                     </div>
//                 </div>

//                 {/* --- Colonne 2: Détails de l'administrateur --- */}
//                 <div className="bg-surface rounded-lg shadow-md border dark:border-gray-800 p-6">
//                      <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3"><User />Administrateur Déclarant</h2>
//                      {admin ? (
//                          <div className="space-y-5">
//                             <DetailItem 
//                                 icon={User} 
//                                 label="Nom complet" 
//                                 value={`${admin.firstName} ${admin.lastName}`} 
//                             />
//                             <DetailItem icon={Mail} label="Email / Identifiant" value={admin.identifiant} />
//                             {/* Note: le téléphone n'est pas renvoyé par votre route, on peut l'ajouter si besoin */}
//                         </div>
//                      ) : (
//                         <p className="text-text-secondary">Aucune information sur l'administrateur n'a été trouvée.</p>
//                      )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EstablishmentDetailPage;




// (app)/moderator/establishments/[id]/page.tsx

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { 
    getEstablishmentDetails,
    updateEstablishmentStatus,
    EstablishmentDetails,
    AdminInDetails
} from '@/services/api';
import { ArrowLeft, Building, Mail, User, Calendar, Hash, ShieldCheck, ShieldX, School } from 'lucide-react';
import Link from 'next/link';

// Composant pour afficher une information (inchangé)
const DetailItem: React.FC<{ icon: React.ElementType; label: string; value?: string | null }> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-4">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
            <Icon className="h-5 w-5 text-text-secondary" />
        </div>
        <div>
            <p className="text-sm font-medium text-text-secondary">{label}</p>
            <p className="text-base font-semibold text-text-primary">{value || 'Non fourni'}</p>
        </div>
    </div>
);

const EstablishmentDetailPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [establishment, setEstablishment] = useState<EstablishmentDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const establishmentId = Array.isArray(id) ? id[0] : id;

    const fetchData = useCallback(async () => {
        if (!establishmentId) return;
        setIsLoading(true);
        setError('');
        const token = Cookies.get('token');
        if (!token) {
            setError("Session invalide.");
            setIsLoading(false);
            return;
        }
        try {
            const { data } = await getEstablishmentDetails(establishmentId, token);
            setEstablishment(data);
        } catch (err) {
            setError("Impossible de charger les détails de l'établissement.");
        } finally {
            setIsLoading(false);
        }
    }, [establishmentId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleStatusUpdate = async (status: 'ACTIVE' | 'REJECTED') => {
        const token = Cookies.get('token');
        if (!token || !establishmentId) return;

        try {
            await updateEstablishmentStatus(establishmentId, status, token);
            alert(`L'établissement a été ${status === 'ACTIVE' ? 'approuvé' : 'rejeté'} avec succès.`);
            router.push('/moderator/inscriptions');
        } catch (err: any) {
            alert(err.response?.data?.message || "Erreur lors de la mise à jour du statut.");
        }
    };

    if (isLoading) {
        return <div className="text-center p-12">Chargement des détails...</div>;
    }

    if (error) {
        return <div className="text-center p-12 text-red-500">{error}</div>;
    }

    if (!establishment) {
        return <div className="text-center p-12">Établissement non trouvé.</div>;
    }

    const admin = establishment.users.find(user => user.role === 'ADMIN');

    // --- LA CORRECTION EST ICI ---
    // On vérifie que la date existe avant de la formater.
    // Si elle n'existe pas, on affiche un message par défaut.
    const formattedDate = establishment.createdAt
        ? new Date(establishment.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'full' })
        : 'Date non disponible';
    // --- FIN DE LA CORRECTION ---

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <Link href="/moderator/inscriptions" className="flex items-center text-sm text-blue-600 hover:underline mb-4">
                    <ArrowLeft size={16} className="mr-1" />
                    Retour à la liste des inscriptions
                </Link>
                <h1 className="text-3xl font-bold text-text-primary">{establishment.name}</h1>
                <p className="text-text-secondary mt-1 capitalize">{establishment.type || 'Type non spécifié'}</p>
            </header>

            {establishment.status === 'PENDING' && (
                 <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-lg font-semibold text-blue-800 dark:text-blue-200">Cette demande est en attente de validation.</p>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => handleStatusUpdate('REJECTED')}
                            className="btn-secondary bg-red-100 text-red-700 hover:bg-red-200"
                        >
                            <ShieldX size={16} className="mr-2" />
                            Refuser
                        </button>
                        <button 
                            onClick={() => handleStatusUpdate('ACTIVE')}
                            className="btn-primary"
                        >
                            <ShieldCheck size={16} className="mr-2" />
                            Approuver
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-surface rounded-lg shadow-md border dark:border-gray-800 p-6">
                    <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3"><Building />Informations</h2>
                    <div className="space-y-5">
                        <DetailItem icon={School} label="Adresse" value={establishment.address} />
                        <DetailItem icon={Hash} label="ID Système" value={establishment.id} />
                        {/* On utilise notre variable sécurisée ici */}
                        <DetailItem 
                            icon={Calendar} 
                            label="Date de la demande" 
                            value={formattedDate} 
                        />
                    </div>
                </div>

                <div className="bg-surface rounded-lg shadow-md border dark:border-gray-800 p-6">
                     <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3"><User />Administrateur</h2>
                     {admin ? (
                         <div className="space-y-5">
                            <DetailItem 
                                icon={User} 
                                label="Nom complet" 
                                value={`${admin.firstName} ${admin.lastName}`} 
                            />
                            <DetailItem icon={Mail} label="Email / Identifiant" value={admin.identifiant} />
                        </div>
                     ) : (
                        <p className="text-text-secondary">Aucun administrateur trouvé pour cet établissement.</p>
                     )}
                </div>
            </div>
        </div>
    );
};

export default EstablishmentDetailPage;