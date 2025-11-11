"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { searchUsers } from '@/services/api';
import Cookies from 'js-cookie';
import { Search, X, Loader2, User, GraduationCap, Briefcase } from 'lucide-react';
import { useDebounce } from 'use-debounce'; // Installer avec : npm install use-debounce

interface UserSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  identifiant: string;
  role: 'STUDENT' | 'TEACHER';
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300); // Délai de 300ms
  const router = useRouter();

  const handleSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const token = Cookies.get('token');
    if (!token) return;
    try {
      const response = await searchUsers(query, token);
      setResults(response.data);
    } catch (error) {
      console.error("Erreur de recherche:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, handleSearch]);

  const handleUserClick = (userId: string) => {
    onClose();
    router.push(`/users/${userId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-start pt-20 p-4" onClick={onClose}>
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {loading ? <Loader2 className="animate-spin text-gray-400" /> : <Search className="text-gray-400" />}
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom, prénom ou identifiant..."
            className="w-full p-4 pl-12 bg-transparent text-lg focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <X className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto border-t border-gray-200 dark:border-gray-700">
          {results.length > 0 ? (
            <ul>
              {results.map(user => (
                <li key={user.id} onClick={() => handleUserClick(user.id)} className="p-4 flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                  <div className={`p-2 rounded-full ${user.role === 'STUDENT' ? 'bg-purple-100' : 'bg-green-100'}`}>
                    {user.role === 'STUDENT' ? <GraduationCap className="text-purple-600" /> : <Briefcase className="text-green-600" />}
                  </div>
                  <div>
                    <p className="font-semibold">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-text-secondary font-mono">{user.identifiant}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            searchTerm.length > 1 && !loading && (
              <div className="p-10 text-center text-text-secondary">
                <p>Aucun utilisateur trouvé pour "{searchTerm}".</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;