// (app)/moderator/registrations/page.tsx

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { 
    listAllEstablishments, 
    updateEstablishmentStatus,
    EstablishmentSummary 
} from '@/services/api';
import { Check, X, Clock, Building, Home, School } from 'lucide-react';
import Link from 'next/link';

// Modal pour afficher les identifiants après approbation
const CredentialsModal: React.FC<{
    credentials: { identifiant: string; password: string };
    onClose: () => void;
}> = ({ credentials, onClose }) => (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-surface rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b dark:border-gray-700">
                <h2 className="text-xl font-bold text-text-primary">Approbation Réussie !</h2>
            </div>
            <div className="p-6">
                <p className="text-sm mt-2 text-text-secondary">L'établissement est maintenant actif. Veuillez communiquer les identifiants temporaires suivants à son administrateur :</p>
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm space-y-2">
                    <p><strong>Identifiant :</strong> <span className="text-blue-600 dark:text-blue-400">{credentials.identifiant}</span></p>
                    <p><strong>Mot de passe :</strong> <span className="text-blue-600 dark:text-blue-400">{credentials.password}</span></p>
                </div>
                <button onClick={onClose} className="btn-primary mt-6 w-full">Fermer</button>
            </div>
        </div>
    </div>
);

const RegistrationManagementPage = () => {
    const [establishments, setEstablishments] = useState<EstablishmentSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [credentialsToShow, setCredentialsToShow] = useState<{ identifiant: string; password: string } | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError('');
        const token = Cookies.get('token');
        if (!token) {
            setError("Session invalide.");
            setIsLoading(false);
            return;
        }
        try {
            const { data } = await listAllEstablishments(token);
            setEstablishments(data);
        } catch (err) {
            setError("Impossible de charger la liste des inscriptions.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleStatusUpdate = async (establishmentId: string, status: 'ACTIVE' | 'REJECTED') => {
        const token = Cookies.get('token');
        if (!token) return;

        try {
            const { data } = await updateEstablishmentStatus(establishmentId, status, token);
            if (status === 'ACTIVE' && data.adminCredentials) {
                setCredentialsToShow(data.adminCredentials);
            }
            fetchData(); // Rafraîchir la liste
        } catch (err: any) {
            alert(err.response?.data?.message || "Erreur lors de la mise à jour du statut.");
        }
    };

    const pendingEstablishments = establishments.filter(e => e.status === 'PENDING');

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Gestion des Inscriptions</h1>
                <p className="text-text-secondary mt-1">Approuvez ou refusez les nouvelles demandes d'inscription d'établissements.</p>
            </header>

            <div className="bg-surface rounded-lg shadow-md border dark:border-gray-800">
                 <div className="p-4 border-b dark:border-gray-700">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-text-primary">
                        <Clock size={20} /> Demandes en attente ({pendingEstablishments.length})
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Établissement</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Type</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Demandé le</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {isLoading ? (
                                <tr><td colSpan={4} className="text-center py-8 text-text-secondary">Chargement...</td></tr>
                            ) : error ? (
                                <tr><td colSpan={4} className="text-center py-8 text-red-500">{error}</td></tr>
                            ) : pendingEstablishments.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-8 text-text-secondary">Aucune nouvelle demande d'inscription.</td></tr>
                            ) : (
                                pendingEstablishments.map((est) => (
                                    <tr key={est.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Building className="h-5 w-5 mr-3 text-text-secondary" />
                                                <div >
                                                    <div className="font-medium text-text-primary">{est.name}</div>
                                                    <Link href={`/moderator/establishments/${est.id}`} className="text-xs text-blue-600 hover:underline">
                                                        Voir détails
                                                    </Link>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-text-secondary capitalize">{est.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                                            {new Date(est.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end items-center gap-2">
                                                <button 
                                                    onClick={() => handleStatusUpdate(est.id, 'REJECTED')} 
                                                    className="btn-secondary-sm bg-red-100 text-red-700 hover:bg-red-200"
                                                    title="Refuser"
                                                >
                                                    <X size={16} /> Refuser
                                                </button>
                                                <button 
                                                    onClick={() => handleStatusUpdate(est.id, 'ACTIVE')} 
                                                    className="btn-primary-sm"
                                                    title="Approuver"
                                                >
                                                    <Check size={16} /> Approuver
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
             {credentialsToShow && (
                <CredentialsModal 
                    credentials={credentialsToShow} 
                    onClose={() => setCredentialsToShow(null)} 
                />
            )}
        </div>
    );
};

export default RegistrationManagementPage;