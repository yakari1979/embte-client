"use client";

import React, { useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { debounce } from 'lodash';
import { searchAllUsers, SearchedUser } from '@/services/api';
import { Search, User, Building } from 'lucide-react';

const roleDisplay: { [key: string]: string } = {
    ADMIN: 'Admin',
    TEACHER: 'Professeur',
    STUDENT: 'Élève',
};

const UserSearchPage = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchedUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("Entrez au moins 2 caractères pour lancer la recherche.");

    const debouncedSearch = useCallback(
        debounce(async (searchQuery: string) => {
            if (searchQuery.length < 2) {
                setResults([]);
                setMessage("Entrez au moins 2 caractères pour lancer la recherche.");
                return;
            }

            setIsLoading(true);
            setMessage('');
            const token = Cookies.get('token');
            if (!token) return;

            try {
                const { data } = await searchAllUsers(searchQuery, token);
                setResults(data);
                if (data.length === 0) {
                    setMessage("Aucun utilisateur trouvé pour cette recherche.");
                }
            } catch (error) {
                setMessage("Erreur lors de la recherche.");
            } finally {
                setIsLoading(false);
            }
        }, 500), // Délai de 500ms
        []
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        debouncedSearch(newQuery);
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Recherche Globale d'Utilisateurs</h1>
                <p className="text-text-secondary mt-1">Trouvez n'importe quel admin, professeur ou élève sur la plateforme.</p>
            </header>

            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Rechercher par nom, prénom, identifiant ou email..."
                    className="input-field w-full pl-12"
                />
            </div>

            <div className="bg-surface rounded-lg shadow-md border dark:border-gray-800 p-4">
                {isLoading ? (
                    <p className="text-center p-4">Recherche en cours...</p>
                ) : results.length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {results.map(user => (
                            <li key={user.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center">
                                <div>
                                    <p className="font-bold text-text-primary">{user.firstName} {user.lastName}</p>
                                    <p className="text-sm text-text-secondary font-mono">{user.identifiant}</p>
                                </div>
                                <div className="mt-2 sm:mt-0 flex items-center gap-4 text-sm">
                                    <span className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-medium">
                                        <User size={14} /> {roleDisplay[user.role] || user.role}
                                    </span>
                                    {user.establishment && (
                                        <span className="inline-flex items-center gap-2 text-text-secondary">
                                            <Building size={14} /> {user.establishment.name}
                                        </span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center p-4 text-text-secondary">{message}</p>
                )}
            </div>
        </div>
    );
};

export default UserSearchPage;