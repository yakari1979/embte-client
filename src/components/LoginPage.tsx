"use client";

import React, { useState } from 'react';
import { login } from '../services/api';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import ThemeSwitcher from './ThemeSwitcher';
import axios from 'axios';
import { LoginCredentials } from '../types/api-types';
import { Info, User } from 'lucide-react';
import InfoModal from '../components/InfoModal';
import { jwtDecode } from 'jwt-decode'; // <-- Importer cette librairie

// --- NOUVEAU TYPE ---
interface DecodedToken {
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'MODERATOR'| 'PARENT';
  // ... autres champs du token
}


const LoginPage: React.FC = () => {
  const [identifiant, setIdentifiant] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const credentials: LoginCredentials = { identifiant, password };
      const response = await login(credentials);
      
      const token = response.data.token;
      Cookies.set('token', token, { expires: 1, secure: true, sameSite: 'strict' }); 

      // --- DÉBUT DE LA LOGIQUE DE REDIRECTION ---
      const decodedToken: DecodedToken = jwtDecode(token);
      
      if (decodedToken.role === 'MODERATOR') {
        router.push('/moderator/dashboard'); // Redirection vers le tableau de bord modérateur
      } else if (decodedToken.role === 'PARENT') { // <-- AJOUTER CETTE CONDITION
        router.push('/parent/dashboard'); // Redirection vers le tableau de bord parent  
      } else {
        router.push('/dashboard'); // Redirection normale pour les autres
      }
      // --- FIN DE LA LOGIQUE DE REDIRECTION ---
      
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Identifiant ou mot de passe incorrect.');
      } else {
        setError('Une erreur réseau est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    // On utilise un fragment pour pouvoir retourner plusieurs éléments au même niveau
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
        
        {/* --- Positionnement des boutons flottants --- */}
        <div className="absolute top-4 left-4 flex items-center gap-4">
            <button onClick={() => setInfoModalOpen(true)} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700" title="Informations">
                <Info className="h-6 w-6"/>
            </button>
        </div>
        <div className="absolute top-4 right-4">
          <ThemeSwitcher />
        </div>

        {/* --- Contenu principal de la page --- */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col md:flex-row max-w-4xl w-full">
          
          {/* --- Partie gauche : Formulaire --- */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Plateforme Éducation <span className="text-blue-500">Sénégal</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              L'avenir de l'éducation numérique. Accédez à vos cours et ressources.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2" htmlFor="identifiant">
                  Identifiant
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                      className="shadow-inner appearance-none border border-gray-300 dark:border-gray-600 rounded-lg w-full py-3 pl-10 pr-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="identifiant" type="text" placeholder="Ex: lmr-eleve-12345 ou votre email"
                      value={identifiant} onChange={(e) => setIdentifiant(e.target.value)} required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2" htmlFor="password">
                  Mot de passe
                </label>
                <input
                  className="shadow-inner appearance-none border border-gray-300 dark:border-gray-600 rounded-lg w-full py-3 px-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="password" type="password" placeholder="******************"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                />
              </div>

              {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">{error}</p>}
              
              <div>
                <button
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  type="submit" disabled={loading}
                >
                  {loading ? 'Connexion en cours...' : 'Se connecter'}
                </button>
              </div>
            </form>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
              Votre établissement n'est pas encore inscrit ?{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Créer un compte
              </Link>
            </p>
              
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-start space-x-3">
              <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1 text-sm text-gray-600 dark:text-gray-300">
                <p className="font-semibold text-gray-700 dark:text-gray-200">Qui peut se connecter ?</p>
                <p>
                  Utilisez l'identifiant fourni par votre établissement (élèves, professeurs) ou votre email (administrateurs).
                </p>
              </div>
            </div>
          </div>

          {/* --- Partie droite : Image (cachée sur mobile) --- */}
          <div className="hidden md:block w-1/2 relative">
            <Image 
              className="object-cover rounded-r-2xl"
              src="/assets/log.png"
              alt="Illustration d'un environnement éducatif numérique au Sénégal"
              fill
              priority
            />
          </div>
        </div>
      </div>
      
      {/* --- LE MODAL EST MAINTENANT ICI, EN DEHORS DE LA CARTE PRINCIPALE --- */}
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setInfoModalOpen(false)} />
    </>
  );
};

export default LoginPage;