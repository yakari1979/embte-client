'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, User, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api';
import Cookies from 'js-cookie';

export default function RegisterPage() {
  const router = useRouter();
  
  // États pour les données du formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '', // On utilisera le champ 'jobTitle' du backend pour stocker l'entreprise
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Gestion des changements dans les inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Soumission du formulaire
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Préparer les données pour l'API
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: 'CLIENT', // On force le rôle CLIENT ici
        jobTitle: formData.company || 'Particulier' // Si pas d'entreprise, on met "Particulier"
      };

      // 2. Appel à l'API
      const data = await authService.register(payload);

      // 3. Connexion automatique après inscription (Le backend renvoie un token)
      Cookies.set('token', data.token, { expires: 7 });
      Cookies.set('user_role', 'CLIENT', { expires: 7 });

      // 4. Redirection vers le dashboard Client
      router.push('/dashboard/client');

    } catch (err: any) {
      console.error(err);
      // Afficher le message d'erreur du backend s'il existe (ex: "Cet email est déjà utilisé")
      setError(err.response?.data?.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nexus-black flex flex-col items-center justify-center text-nexus-text relative overflow-hidden pt-24 pb-10 px-4">
        
      {/* Fond décoratif */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-nexus-orange/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-nexus-dark/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl z-10"
      >
        <h1 className="text-3xl font-bold mb-2 text-center text-nexus-text">Devenir Client</h1>
        <p className="text-nexus-concrete mb-6 text-center">Créez votre espace pour suivre vos projets.</p>

        {/* Affichage des erreurs */}
        {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-200 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
            </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
              <div className="bg-nexus-black border border-nexus-gray rounded-xl p-3 flex items-center gap-3 focus-within:border-nexus-orange transition-colors">
                  <User size={18} className="text-nexus-concrete"/>
                  <input 
                    name="firstName" 
                    value={formData.firstName}
                    onChange={handleChange}
                    className="bg-transparent outline-none w-full text-sm placeholder-gray-600 text-nexus-text" 
                    placeholder="Prénom" 
                    required
                  />
              </div>
              <div className="bg-nexus-black border border-nexus-gray rounded-xl p-3 flex items-center gap-3 focus-within:border-nexus-orange transition-colors">
                  <User size={18} className="text-nexus-concrete"/>
                  <input 
                    name="lastName" 
                    value={formData.lastName}
                    onChange={handleChange}
                    className="bg-transparent outline-none w-full text-sm placeholder-gray-600 text-nexus-text" 
                    placeholder="Nom" 
                    required
                  />
              </div>
          </div>

          <div className="bg-nexus-black border border-nexus-gray rounded-xl p-4 flex items-center gap-3 focus-within:border-nexus-orange transition-colors">
              <Building2 size={18} className="text-nexus-concrete"/>
              <input 
                name="company" 
                value={formData.company}
                onChange={handleChange}
                className="bg-transparent outline-none w-full text-nexus-text placeholder-gray-600" 
                placeholder="Nom de l'entreprise (Optionnel)" 
              />
          </div>

          <div className="bg-nexus-black border border-nexus-gray rounded-xl p-4 flex items-center gap-3 focus-within:border-nexus-orange transition-colors">
              <Mail size={18} className="text-nexus-concrete"/>
              <input 
                name="email" 
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-transparent outline-none w-full text-nexus-text placeholder-gray-600" 
                placeholder="Email professionnel" 
                required
              />
          </div>

          <div className="bg-nexus-black border border-nexus-gray rounded-xl p-4 flex items-center gap-3 focus-within:border-nexus-orange transition-colors">
              <Lock size={18} className="text-nexus-concrete"/>
              <input 
                name="password" 
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="bg-transparent outline-none w-full text-nexus-text placeholder-gray-600" 
                placeholder="Mot de passe (min 6 carac.)" 
                required
                minLength={6}
              />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-nexus-orange transition-all mt-6 flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
                <>Création en cours... <Loader2 className="animate-spin" size={18}/></>
            ) : (
                <>Créer mon espace <ArrowRight size={18}/></>
            )}
          </button>
        </form>
        
        <p className="mt-6 text-center text-nexus-concrete text-sm">
          Vous avez déjà un compte ? <Link href="/auth/login" className="text-nexus-orange hover:underline ml-1">Se connecter</Link>
        </p>
      </motion.div>
    </div>
  );
}