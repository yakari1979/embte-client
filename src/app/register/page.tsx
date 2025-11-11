// On déclare ce composant comme un "Client Component" car il est interactif
"use client";

import React, { useState } from 'react';
import { register } from '../../services/api'; // On importe la fonction register
import Image from 'next/image';
import Link from 'next/link'; // Important pour naviguer entre les pages
import ThemeSwitcher from '../../components/ThemeSwitcher';
import axios from 'axios';
import { RegisterData } from '../../types/api-types'; // On utilise notre type

const RegisterPage: React.FC = () => {
  // On a besoin de plus d'états pour les nouveaux champs
  const [establishmentName, setEstablishmentName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data: RegisterData = { establishmentName, firstName, lastName, email, password };
      await register(data);
      
      setSuccess("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      // Idéalement, ici on redirigerait l'utilisateur vers la page de connexion après 2-3 secondes.
      
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Une erreur est survenue lors de l'inscription.");
      } else {
        setError('Une erreur réseau est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col md:flex-row max-w-4xl w-full">
        
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Inscrire votre Établissement
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Créez un compte administrateur et enregistrez votre école ou université.
          </p>
          
          <form onSubmit={handleSubmit}>
            {/* Champs pour l'établissement et l'admin */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2" htmlFor="establishmentName">Nom de l'établissement</label>
              <input className="shadow-inner appearance-none border border-gray-300 dark:border-gray-600 rounded-lg w-full py-3 px-4 bg-white dark:bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="establishmentName" type="text" placeholder="Lycée John F. Kennedy" value={establishmentName} onChange={(e) => setEstablishmentName(e.target.value)} required />
            </div>
            <div className="flex space-x-4 mb-4">
                <div className="w-1/2">
                    <label className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2" htmlFor="firstName">Votre Prénom</label>
                    <input className="shadow-inner appearance-none border border-gray-300 dark:border-gray-600 rounded-lg w-full py-3 px-4 bg-white dark:bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="firstName" type="text" placeholder="Moussa" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="w-1/2">
                    <label className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2" htmlFor="lastName">Votre Nom</label>
                    <input className="shadow-inner appearance-none border border-gray-300 dark:border-gray-600 rounded-lg w-full py-3 px-4 bg-white dark:bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="lastName" type="text" placeholder="Diop" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2" htmlFor="email">Email de l'administrateur</label>
              <input className="shadow-inner appearance-none border border-gray-300 dark:border-gray-600 rounded-lg w-full py-3 px-4 bg-white dark:bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="email" type="email" placeholder="admin@lyceekennedy.sn" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2" htmlFor="password">Mot de passe</label>
              <input className="shadow-inner appearance-none border border-gray-300 dark:border-gray-600 rounded-lg w-full py-3 px-4 bg-white dark:bg-gray-700 text-gray-200 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="password" type="password" placeholder="******************" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">{error}</p>}
            {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-center">{success}</p>}
            
            <div>
              <button className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} type="submit" disabled={loading}>
                {loading ? "Création en cours..." : "Créer le compte"}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Vous avez déjà un compte ?{' '}
            <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
              Se connecter
            </Link>
          </p>
        </div>

        <div className="hidden md:block w-1/2 relative">
          <Image className="object-cover rounded-r-2xl" src="/assets/login-image.webp" alt="Illustration d'un environnement éducatif numérique au Sénégal" fill priority />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;