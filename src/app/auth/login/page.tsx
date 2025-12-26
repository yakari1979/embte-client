'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion'; 
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api'; // Import du service
import Cookies from 'js-cookie';

const SplineScene = dynamic(() => import('@/components/SplineScene'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-nexus-dark animate-pulse"></div>
});

// APRÈS :
const ConstructionScene = dynamic(() => import('@/components/ConstructionScene'), { 
  ssr: false, 
  loading: () => <div className="h-full w-full bg-nexus-dark animate-pulse flex items-center justify-center text-nexus-concrete">Chargement du chantier...</div>
});

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  
  // États pour le formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login({ email, password });
      
      // 1. Sauvegarder le token et le rôle
      Cookies.set('token', data.token, { expires: 7 }); // Expire dans 7 jours
      Cookies.set('user_role', data.user.role, { expires: 7 });

      // 2. Redirection Intelligente selon le Rôle
      switch (data.user.role) {
        case 'ADMIN':
          router.push('/dashboard/admin');
          break;
        case 'MANAGER': // Chef de chantier
          router.push('/dashboard/manager');
          break;
        case 'CLIENT':
          router.push('/dashboard/client');
          break;
        case 'WORKER':
          router.push('/dashboard/worker');
          break;
        default:
          router.push('/dashboard/client');
      }

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur de connexion. Vérifiez vos identifiants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-nexus-black text-nexus-text overflow-hidden font-sans pt-20 lg:pt-0">
      
      {/* GAUCHE : FORMULAIRE */}
      <motion.div 
        className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 relative z-20"
        initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
      >
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-4xl font-extrabold mb-2 text-nexus-text">Bon retour.</h1>
          <p className="text-nexus-concrete text-lg mb-8">Pilotez vos chantiers avec précision.</p>

          {/* Affichage des erreurs */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-200 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-nexus-concrete uppercase ml-1">Email Pro</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@entreprise.com" 
                  className="w-full bg-nexus-dark border border-nexus-gray focus:border-nexus-orange text-nexus-text px-5 py-4 rounded-xl outline-none transition-colors"
                  required 
                />
            </div>
            
            <div className="relative group flex flex-col gap-2">
                <label className="text-xs font-bold text-nexus-concrete uppercase ml-1">Mot de passe</label>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-nexus-dark border border-nexus-gray focus:border-nexus-orange text-nexus-text px-5 py-4 rounded-xl outline-none transition-colors"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[38px] text-gray-500 hover:text-nexus-text">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 mt-6 text-lg hover:scale-[1.02] transition-transform shadow-lg shadow-nexus-orange/20 disabled:opacity-50 disabled:cursor-not-allowed  hover:bg-nexus-orange"
            >
              {loading ? (
                <>Connexion <Loader2 className="animate-spin" /></>
              ) : (
                <>Accéder au Chantier <ArrowRight size={22} /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-nexus-concrete">
            Pas encore client ? <Link href="/auth/register" className="text-nexus-orange font-bold hover:text-nexus-orange underline ml-2">Créer un compte</Link>
          </div>
        </div>
      </motion.div>

      {/* DROITE : 3D */}
      <motion.div className="hidden lg:block w-1/2 h-screen bg-nexus-dark border-l border-nexus-gray relative">
        <ConstructionScene /> 
      </motion.div>
    </div>
  );
}