"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { listModerators, createModerator, Moderator, NewModeratorData } from '@/services/api';
import { UserPlus, ShieldCheck } from 'lucide-react';

const ModeratorManagementPage = () => {
    const [moderators, setModerators] = useState<Moderator[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // États pour le formulaire de création
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [identifiant, setIdentifiant] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newCredentials, setNewCredentials] = useState<{ identifiant: string, password: string } | null>(null);

    const fetchModerators = async () => {
        setIsLoading(true);
        const token = Cookies.get('token');
        if (!token) return;
        try {
            const { data } = await listModerators(token);
            setModerators(data);
        } catch (err) {
            setError("Impossible de charger la liste des modérateurs.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchModerators();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setNewCredentials(null);
        const token = Cookies.get('token');
        if (!token) return;

        const data: NewModeratorData = { firstName, lastName, identifiant };
        try {
            const response = await createModerator(data, token);
            setNewCredentials(response.data.credentials);
            // Réinitialiser le formulaire
            setFirstName('');
            setLastName('');
            setIdentifiant('');
            // Mettre à jour la liste
            fetchModerators();
        } catch (err: any) {
            alert(err.response?.data?.message || "Erreur lors de la création.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne de gauche : Création */}
            <div className="lg:col-span-1">
                <div className="bg-surface p-6 rounded-lg shadow-md border dark:border-gray-800 sticky top-24">
                    <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
                        <UserPlus /> Créer un Modérateur
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Prénom" className="input-field" required />
                        <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Nom" className="input-field" required />
                        <input type="text" value={identifiant} onChange={e => setIdentifiant(e.target.value)} placeholder="Identifiant (ex: modo-pape)" className="input-field" required />
                        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                            {isSubmitting ? 'Création...' : 'Créer le compte'}
                        </button>
                    </form>
                    {newCredentials && (
                        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-lg">
                            <h3 className="font-bold text-green-800 dark:text-green-200">Compte créé !</h3>
                            <p className="text-sm text-green-700 dark:text-green-300">Veuillez communiquer ces informations au nouveau modérateur :</p>
                            <div className="mt-2 space-y-1 text-sm">
                                <p><strong>Identifiant :</strong> {newCredentials.identifiant}</p>
                                <p><strong>Mot de passe :</strong> {newCredentials.password}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Colonne de droite : Liste */}
            <div className="lg:col-span-2">
                <div className="bg-surface p-6 rounded-lg shadow-md border dark:border-gray-800">
                    <h2 className="text-2xl font-bold text-text-primary mb-4">Liste des Modérateurs</h2>
                    {isLoading ? <p>Chargement...</p> : error ? <p className="text-red-500">{error}</p> :
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {moderators.map(mod => (
                                <li key={mod.id} className="py-3 flex items-center gap-4">
                                    <ShieldCheck className="h-6 w-6 text-green-500"/>
                                    <div>
                                        <p className="font-medium text-text-primary">{mod.firstName} {mod.lastName}</p>
                                        <p className="text-sm text-text-secondary font-mono">{mod.identifiant}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    }
                </div>
            </div>
        </div>
    );
};

export default ModeratorManagementPage;