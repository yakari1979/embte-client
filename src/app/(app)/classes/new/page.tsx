"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClass } from '@/services/api'; // <--- CORRECTION
import Cookies from 'js-cookie';
import axios from 'axios';
import Link from 'next/link';

// ... (le reste du code est identique)
const NewClassPage = () => {
  const router = useRouter();
  const [className, setClassName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const token = Cookies.get('token');
    if (!token) {
      setError("Votre session a expiré. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }

    try {
      await createClass(className, token);
      setSuccess(`La classe "${className}" a été créée avec succès !`);
      setClassName('');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Une erreur est survenue.");
      } else {
        setError("Une erreur réseau est survenue.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Créer une Nouvelle Classe</h1>
        <Link href="/dashboard" className="text-sm text-blue-500 hover:underline">
          &larr; Retour au tableau de bord
        </Link>
      </div>

      <div className="bg-surface p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="className" className="block text-sm font-medium text-text-secondary mb-1">
              Nom de la classe
            </label>
            <input 
              type="text" 
              name="className" 
              id="className" 
              value={className} 
              onChange={(e) => setClassName(e.target.value)} 
              required 
              placeholder="Ex: Terminale S2"
              className="w-full px-4 py-2 bg-background border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            />
            <p className="text-xs text-text-subtle mt-1">
              Donnez un nom unique et descriptif à la classe.
            </p>
          </div>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}
          {success && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-center">{success}</p>}
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={loading} 
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Création en cours..." : "Créer la classe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewClassPage;