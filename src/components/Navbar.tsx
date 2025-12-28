'use client';

import Link from 'next/link';
import { HardHat, Menu, X, ArrowRight, LogOut, LayoutDashboard, PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api';
import Image from "next/image";


export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // État de connexion
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Vérifier la connexion au chargement
  useEffect(() => {
    const token = Cookies.get('token');
    const role = Cookies.get('user_role');
    
    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);
    }

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloquer le scroll quand le menu mobile est ouvert
  useEffect(() => { 
    document.body.style.overflow = isOpen ? 'hidden' : 'auto'; 
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  // Gérer la déconnexion
  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUserRole(null);
    closeMenu();
    router.push('/');
  };

  // --- DÉFINITION DES LIENS SELON LE RÔLE ---
  const getLinks = () => {
    if (!isLoggedIn) {
      // Liens Publics
      return [
        { name: "Accueil", href: "/#apropos" },
        { name: "À Propos", href: "/about" },
        { name: "Vitrine", href: "/projects"}, 
        { name: "Nos Solutions", href: "/solutions" },
        { name: "Contacter Nous", href: "/contact" }, 
      ];
    }

    // Liens Connectés (Selon le rôle)
    switch (userRole) {
      case 'ADMIN':
        return [
          { name: "Général", href: "/dashboard/admin" }, // Dashboard Principal
          { name: "Utilisateurs", href: "/dashboard/admin/users" }, // Gestion Clients/Managers
          { name: "Statistiques", href: "/dashboard/admin/analytics" }, // <-- AJOUT
          { name: "Chantiers Actifs", href: "/dashboard/admin/projects" }, // Assignation & Suivi
          { name: "Logistique", href: "/dashboard/admin/logistics" }, // <-- AJOUT
          { name: "Surveillance", href: "/dashboard/admin/surveillance" }, // <-- AJOUT
          { name: "Messagerie", href: "/dashboard/admin/contacts" }, // <-- AJOUT ICI
        ];
      case 'MANAGER': // Chef de chantier
        return [
          { name: "Mes Chantiers", href: "/dashboard/manager" },
          { name: "Équipes", href: "/dashboard/manager/teams" },
          { name: "Rapports", href: "/dashboard/manager/reports" },
        ];
        case 'WORKER': // Ouvrier (NOUVEAU)
        return [
          { name: "Mon Espace", href: "/dashboard/worker" }, // Pointage
          { name: "Mes Rapports", href: "/dashboard/worker/reports" }, // Envoi photos
        ];
      case 'CLIENT':
        // Tout le menu client est ici maintenant !
        return [
          { name: "Vue d'ensemble", href: "/dashboard/client" },
          { name: "Matériaux & Stock", href: "/dashboard/client/logistics" }, // <-- AJOUT
          { name: "Documents", href: "/dashboard/client/documents" },
          { name: "Finance", href: "/dashboard/client/finance" },
          // { name: "Messagerie", href: "/dashboard/client/messages" },
        ];
      default:
        return [{ name: "Dashboard", href: "/dashboard" }];
    }
  };

  const navLinks = getLinks();
  // Lien pour le bouton "Tableau de bord" à droite (sauf pour le client qui a déjà ses liens au centre)
  const dashboardPath = userRole && userRole !== 'CLIENT' ? `/dashboard/${userRole.toLowerCase()}` : '/dashboard/client';

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled || isOpen 
        ? 'bg-gradient-to-r from-blue-700/90 to-blue-600/90 border-b border-blue-500/50 py-4'
        : 'bg-gradient-to-r from-blue-600/70 to-blue-500/70 py-6'      

      }`}>
        <div className="container mx-auto px-6 flex items-center justify-between">

          {/* LOGO (Image seule, grande et visible) */}
          <Link href="/" className="relative z-50 flex items-center" onClick={closeMenu}>
            <img
              src="/images/logo.png"
              alt="Logo EM BTE"
              // h-12 (48px) sur mobile, h-20 (80px) sur ordi
              // w-auto permet de garder les proportions de ton logo
              className="h-10 md:h-10 w-auto object-contain transition-transform duration-300 hover:scale-105 rounded-lg"
            />
          </Link>

          {/* LIENS CENTRAUX (DESKTOP) */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-white">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`transition-all duration-300 ${
                  link.name === "Commander un Chantier" 
                    ? "text-nexus-orange font-bold border border-nexus-orange/30 px-3 py-1.5 rounded-lg hover:bg-nexus-orange hover:text-black flex items-center gap-2"
                    : "relative px-3 py-1.5 text-white hover:text-blue-200 hover:border-b-2 hover:border-blue-300"
                }`}
              >
                {link.name === "Commander un Chantier" && <PlusCircle size={16}/>}
                {link.name}
              </Link>
            ))}
          </div>


          {/* ACTIONS DROITE (DESKTOP) */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeSwitcher />
            
            {isLoggedIn ? (
              <>
                {/* On affiche le bouton Dashboard sauf pour le client qui a déjà tout au centre */}
                {userRole !== 'CLIENT' && (
                  // <Link 
                  //   href={dashboardPath} 
                  //   className="flex items-center gap-2 text-nexus-text hover:text-nexus-orange font-medium text-sm transition-colors border border-nexus-gray px-4 py-2 rounded-lg hover:border-nexus-orange"
                  // >
                  //   <LayoutDashboard size={18} />
                  //   Tableau de Bord
                  // </Link>

                  <Link
                    href={dashboardPath}
                    className="
                      group relative inline-flex items-center gap-2
                      px-5 py-2.5 rounded-xl
                      border border-white/10
                      bg-white/5 backdrop-blur-md
                      text-nexus-text text-sm font-semibold
                      transition-all duration-300
                      hover:border-nexus-orange/50
                      hover:bg-nexus-orange/10
                      hover:shadow-[0_0_30px_rgba(249,115,22,0.25)]
                    "
                  >
                    <LayoutDashboard
                      size={18}
                      className="text-white transition-transform duration-300 group-hover:scale-110"
                    />
                    <span className='text-white'>Tableau de Bord</span>

                    {/* glow effect */}
                    <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-nexus-orange/20 via-transparent to-nexus-orange/20" />
                  </Link>

                )}
                
                <button 
                  onClick={handleLogout} 
                  className="bg-red-500/10 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
               <Link
                href="/auth/login"
                className="text-white font-medium text-sm px-4 py-2 rounded-xl border border-white/40 
                          hover:bg-white/10 hover:border-blue-300 transition-all duration-300"
              >
                Se connecter
              </Link>

              <Link
                href="/auth/register"
                className="bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-bold text-sm 
                          px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md 
                          hover:scale-105 hover:shadow-lg transition-transform duration-300"
              >
                Devenir Client
              </Link>

              </>
            )}
          </div>

          {/* BOUTON MOBILE */}
          <div className="lg:hidden flex items-center gap-4 z-50">
             <ThemeSwitcher />
             <button className="text-nexus-text p-2 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={28} /> : <Menu size={28} />}
             </button>
          </div>
        </div>
      </nav>

      {/* --- MENU MOBILE (SIDEBAR) --- */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeMenu}></div>
        
        {/* Contenu Menu Mobile */}
        <div className={`absolute right-0 top-0 h-full w-[280px] bg-nexus-dark border-l border-nexus-gray shadow-2xl transform transition-transform duration-300 ease-out flex flex-col pt-24 px-6 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          <div className="flex flex-col space-y-6 overflow-y-auto max-h-[70vh]">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={closeMenu} 
                className={`text-lg font-medium border-b border-nexus-gray pb-4 ${
                  link.name === "Commander un Chantier" 
                    ? "text-nexus-orange flex items-center gap-2" 
                    : "text-nexus-text"
                }`}
              >
                {link.name === "Commander un Chantier" && <PlusCircle size={20}/>}
                {link.name}
              </Link>
            ))}
          </div>

          <div className="mt-auto mb-10 flex flex-col gap-4 pt-6 border-t border-nexus-gray">
            {isLoggedIn ? (
              <>
                {userRole !== 'CLIENT' && (
                  <Link href={dashboardPath} onClick={closeMenu} className="w-full py-4 text-center bg-nexus-text text-nexus-black rounded-xl font-bold flex items-center justify-center gap-2">
                    <LayoutDashboard size={20} /> Tableau de Bord
                  </Link>
                )}
                <button onClick={handleLogout} className="w-full py-4 text-center border border-red-500/50 text-red-500 rounded-xl font-bold hover:bg-red-500/10 flex items-center justify-center gap-2">
                  <LogOut size={20} /> Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={closeMenu}
                  className="w-full py-3 text-center text-white border border-white/40 rounded-xl font-semibold 
                            hover:bg-white/10 hover:border-blue-300 transition-all duration-300"
                >
                  Se connecter
                </Link>

                <Link
                  href="/auth/register"
                  onClick={closeMenu}
                  className="w-full py-3 text-center bg-gradient-to-r from-orange-500 to-yellow-400 text-black 
                            rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:scale-105 
                            hover:shadow-lg transition-transform duration-300"
                >
                  Devenir Client <ArrowRight size={18} />
                </Link>

              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}