// "use client";

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';
// import ThemeSwitcher from './ThemeSwitcher';
// import Image from 'next/image'; // <-- AJOUTEZ CETTE LIGNE
// import { Menu, X, LogOut } from 'lucide-react';

// interface User {
//   role: string;
// }

// const NavigationBar: React.FC<{ user: User }> = ({ user }) => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'auto';
//     }
//     return () => {
//       document.body.style.overflow = 'auto';
//     };
//   }, [isOpen]);

//   useEffect(() => {
//     setIsOpen(false);
//   }, [pathname]);

//   const handleLogout = () => {
//     Cookies.remove('token');
//     router.push('/');
//   };

//   // --- NOUVEAU MENU POUR LE MODÉRATEUR ---explorer
//   const moderatorLinks = (
//     <>
//       <Link href="/moderator/dashboard" className={`nav-link ${pathname.startsWith('/moderator/dashboard') ? 'active' : ''}`}>Vue d'Ensemble</Link>
//       <Link href="/moderator/establishments" className={`nav-link ${pathname.startsWith('/moderator/establishments') ? 'active' : ''}`}>Établissements</Link>
//       <Link href="/moderator/users" className={`nav-link ${pathname.startsWith('/moderator/users') ? 'active' : ''}`}>Utilisateurs</Link>
//       <Link href="/moderator/registrations" className={`nav-link ${pathname.startsWith('/moderator/registrations') ? 'active' : ''}`}>Registrations</Link>
//       <Link href="/moderator/resources" className={`nav-link ${pathname.startsWith('/moderator/resources') ? 'active' : ''}`}>Bibliothèque</Link>
//       <Link href="/moderator/management" className={`nav-link ${pathname.startsWith('/moderator/management') ? 'active' : ''}`}>Gestion Modos</Link>
//       <Link href="/moderator/explorer" className={`nav-link ${pathname.startsWith('/moderator/explorer') ? 'active' : ''}`}>Explorer</Link>
//     </>
//   );

//   const adminLinks = (
//     <>
//       <Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}>Tableau de Bord</Link>
//       <Link href="/users" className={`nav-link ${pathname.startsWith('/users') ? 'active' : ''}`}>Utilisateurs</Link>
//       <Link href="/classes" className={`nav-link ${pathname.startsWith('/classes') ? 'active' : ''}`}>Classes</Link>
//       <Link href="/ai-assistant" className={`nav-link ${pathname.startsWith('/ai-assistant') ? 'active' : ''}`}>Assistant</Link>
//       <Link href="/gestion" className={`nav-link ${pathname.startsWith('/classesAdmin') ? 'active' : ''}`}>Gestion des Classes</Link>
//       <Link href="/admin/bulletins" className={`nav-link ${pathname === '/admin/bulletins' ? 'active' : ''}`}>Gestion des Bulletins</Link>
//       <Link href="/admin/bulletins/archives" className={`nav-link ${pathname === '/admin/bulletins/archives' ? 'active' : ''}`}>Archives & Envoi</Link>
//       <Link href="/admin/blog" className={`nav-link ${pathname.startsWith('/admin/blog') ? 'active' : ''}`}>Blog / Annonces</Link> {/* <-- NOUVEAU LIEN */}
//     </>
//   );

//   const teacherLinks = (
//     <>
//       <Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}>Mon Emploi du Temps</Link>
//       <Link href="/my-classes" className={`nav-link ${pathname.startsWith('/my-classes') ? 'active' : ''}`}>Mes Classes</Link>
//       <Link href="/grades-management" className={`nav-link ${pathname === '/grades-management' ? 'active' : ''}`}>Suivi & Notes</Link>
//       <Link href="/teacher/quiz-generator" className={`nav-link ${pathname === '/teacher/quiz-generator' ? 'active' : ''}`}>Générateur de QCM</Link>
//       <Link href="/student/simulations" className={`nav-link ${pathname === '/student/simulations' ? 'active' : ''}`}>Laboratoire Virtuel 3D</Link> 
//       <Link href="/dashboard/weekly-planner" className={`nav-link ${pathname === '/dashboard/weekly-planner' ? 'active' : ''}`}>Organiseur hebdo</Link>
//       {/* <Link href="/labs" className={`nav-link ${pathname === '/labs' ? 'active' : ''}`}>Laboratoire</Link> */}
//       <Link href="/blog" className={`nav-link ${pathname.startsWith('/blog') ? 'active' : ''}`}>Annonces</Link> {/* <-- AJOUTER*/}
//     </>
//   );

//   const studentLinks = (
//     <>
//       <Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}>Mon Emploi du Temps</Link>
//       <Link href="/my-courses" className={`nav-link ${pathname === '/my-courses' ? 'active' : ''}`}>Mes Cours</Link>
//       <Link href="/my-grades" className={`nav-link ${pathname === '/my-grades' ? 'active' : ''}`}>Mes Notes</Link>
//       <Link href="/student/bulletins" className={`nav-link ${pathname === '/student/bulletins' ? 'active' : ''}`}>Mes Bulletins</Link>
//       <Link href="/dashboard/my-plan" className={`nav-link ${pathname === '/dashboard/my-plan' ? 'active' : ''}`}>Mon Plan de Réussite</Link>
//       <Link href="/student/simulations" className={`nav-link ${pathname === '/student/simulations' ? 'active' : ''}`}>Laboratoire Virtuel 3D</Link> 
//       <Link href="/library" className={`nav-link ${pathname === '/library' ? 'active' : ''}`}>Bibliothèque</Link>
//       {/* <Link href="/labs" className={`nav-link ${pathname === '/labs' ? 'active' : ''}`}>Laboratoire</Link> */}
//       <Link href="/blog" className={`nav-link ${pathname.startsWith('/blog') ? 'active' : ''}`}>Annonces</Link> {/* <-- AJOUTER */}
//     </>
//   );

//   // --- NOUVEAU : LIENS POUR LE PARENT ---
//   const parentLinks = (
//     <>
//       <Link href="/parent/dashboard" className={`nav-link ${pathname.startsWith('/parent') ? 'active' : ''}`}>Tableau de Bord</Link>
//       <Link href="/parent/bulletins" className={`nav-link ${pathname.startsWith('/parent/bulletins') ? 'active' : ''}`}>Bulletins de mes Enfants</Link>
//       <Link href="/blog" className={`nav-link ${pathname.startsWith('/blog') ? 'active' : ''}`}>Annonces</Link>
//     </>
//   );

//   return (
//     <>
//       {/* --- MODIFIÉ : Le z-index de la barre de navigation est maintenant plus bas que celui du panneau --- */}
//       <header className="bg-surface/80 backdrop-blur-sm shadow-md sticky top-0 z-30">
//         <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
            
//             {/* <div className="flex items-center">
//               <Link href="/dashboard" className="font-bold text-xl text-blue-600 dark:text-blue-400">
//                 Plateforme Edu
//               </Link>
//             </div> */}

//             {/* --- SECTION MODIFIÉE --- */}
//             <div className="flex items-center">
//               <Link href="/dashboard" className="flex items-center gap-3 font-bold text-xl text-blue-600 dark:text-blue-400">
//                 {/* L'image est maintenant plus grande, circulaire et l'espacement a été ajusté */}
//                 <Image 
//                   src="/favicon.ico" // Assurez-vous que le chemin est correct donc on vas faire en sorte qu sa marche bien
//                   alt="Logo Plateforme Edu"
//                   width={40}  // Taille augmentée pour une meilleure présence
//                   height={40} // La hauteur doit être égale à la largeur pour un cercle parfait
//                   className="h-10 w-10 rounded-full" // Classes pour une plus grande taille et une forme circulaire
//                 />
//                 <span>Plateforme Edu</span>
//               </Link>
//             </div>

//             <div className="hidden md:flex items-baseline space-x-4">
//               {user.role === 'MODERATOR' && moderatorLinks}
//               {user.role === 'ADMIN' && adminLinks}
//               {user.role === 'TEACHER' && teacherLinks}
//               {user.role === 'STUDENT' && studentLinks}
//               {user.role === 'PARENT' && parentLinks} {/* <-- AJOUTER LE RÔLE PARENT ICI */}
//             </div>

//             <div className="flex items-center gap-4">
//               <div className="hidden md:flex items-center gap-4">
//                 <span className="user-role-badge">{user.role}</span>
//                 <ThemeSwitcher />
//                 <button onClick={handleLogout} className="logout-button" title="Déconnexion">
//                   <LogOut className="h-5 w-5" />
//                 </button>
//               </div>
              
//               <div className="md:hidden flex items-center">
//                 <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-text-secondary hover:text-text-primary focus:outline-none" aria-label="Ouvrir le menu">
//                   {isOpen ? <X /> : <Menu />}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </nav>
//       </header>

//       {/* --- MODIFIÉ : Le z-index du conteneur du panneau est maintenant le plus élevé --- */}
//       <div 
//         className={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
//           isOpen ? 'translate-x-0' : 'translate-x-full'
//         }`}
//         aria-hidden={!isOpen}
//       >
//         {/* Le fond semi-transparent */}
//         <div className="fixed inset-0 bg-black/30" onClick={() => setIsOpen(false)}></div>
        
//         {/* Le contenu du panneau (qui est un enfant de z-40, donc il est aussi au-dessus) */}
//         <div className="absolute right-0 top-0 h-full w-64 bg-background shadow-lg p-5">
//           <div className="flex flex-col h-full">
//             <div className="flex-grow space-y-4 pt-4">
//                 {user.role === 'MODERATOR' && moderatorLinks}
//                 {user.role === 'ADMIN' && adminLinks}
//                 {user.role === 'TEACHER' && teacherLinks}
//                 {user.role === 'STUDENT' && studentLinks}
//                 {user.role === 'PARENT' && parentLinks} {/* <-- AJOUTER LE RÔLE PARENT ICI */}
//             </div>
            
//             <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
//                 <div className="flex justify-between items-center">
//                     <span className="user-role-badge">{user.role}</span>
//                     <ThemeSwitcher />
//                 </div>
//                 <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 logout-button">
//                     <LogOut className="h-5 w-5" />
//                     <span>Déconnexion</span>
//                 </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default NavigationBar;



"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import ThemeSwitcher from './ThemeSwitcher';
import Image from 'next/image';
import { Menu, X, LogOut } from 'lucide-react';

// 1. MISE À JOUR DE L'INTERFACE
// On ajoute 'enrolledClass' pour pouvoir vérifier le nom de la classe
interface User {
  role: string;
  enrolledClass?: {
    name: string;
  };
}

const NavigationBar: React.FC<{ user: User }> = ({ user }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/');
  };

  // 2. LOGIQUE DE VÉRIFICATION
  // On vérifie si l'utilisateur a une classe et si son nom contient "terminale" ou "tle" (insensible à la casse)
  const isTerminaleStudent = React.useMemo(() => {
    // 1. Vérifie si c'est un élève
    if (user.role !== 'STUDENT') return false;
    
    // 2. Vérifie si la classe existe (c'est là que ça bloque si le backend ne l'envoie pas)
    if (!user.enrolledClass?.name) {
        console.log("Pas de classe détectée pour cet élève"); // Pour le debug
        return false;
    }
    
    const className = user.enrolledClass.name.toLowerCase();
    
    // 3. Vérifie le nom
    // Cela marchera pour "Terminale S1", "Tle S2", "Terminale L", etc.
    return className.includes('terminale') || className.startsWith('tle');
  }, [user]);

  const moderatorLinks = (
    <>
      <Link href="/moderator/dashboard" className={`nav-link ${pathname.startsWith('/moderator/dashboard') ? 'active' : ''}`}>Vue d'Ensemble</Link>
      <Link href="/moderator/establishments" className={`nav-link ${pathname.startsWith('/moderator/establishments') ? 'active' : ''}`}>Établissements</Link>
      <Link href="/moderator/users" className={`nav-link ${pathname.startsWith('/moderator/users') ? 'active' : ''}`}>Utilisateurs</Link>
      <Link href="/moderator/registrations" className={`nav-link ${pathname.startsWith('/moderator/registrations') ? 'active' : ''}`}>Registrations</Link>
      <Link href="/moderator/resources" className={`nav-link ${pathname.startsWith('/moderator/resources') ? 'active' : ''}`}>Bibliothèque</Link>
      <Link href="/moderator/management" className={`nav-link ${pathname.startsWith('/moderator/management') ? 'active' : ''}`}>Gestion Modos</Link>
      <Link href="/moderator/explorer" className={`nav-link ${pathname.startsWith('/moderator/explorer') ? 'active' : ''}`}>Explorer</Link>
    </>
  );

  const adminLinks = (
    <>
      <Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}>Tableau de Bord</Link>
      <Link href="/users" className={`nav-link ${pathname.startsWith('/users') ? 'active' : ''}`}>Utilisateurs</Link>
      <Link href="/classes" className={`nav-link ${pathname.startsWith('/classes') ? 'active' : ''}`}>Classes</Link>
      <Link href="/ai-assistant" className={`nav-link ${pathname.startsWith('/ai-assistant') ? 'active' : ''}`}>Assistant</Link>
      <Link href="/gestion" className={`nav-link ${pathname.startsWith('/classesAdmin') ? 'active' : ''}`}>Gestion des Classes</Link>
      <Link href="/admin/bulletins" className={`nav-link ${pathname === '/admin/bulletins' ? 'active' : ''}`}>Gestion des Bulletins</Link>
      <Link href="/admin/bulletins/archives" className={`nav-link ${pathname === '/admin/bulletins/archives' ? 'active' : ''}`}>Archives & Envoi</Link>
      <Link href="/admin/blog" className={`nav-link ${pathname.startsWith('/admin/blog') ? 'active' : ''}`}>Blog / Annonces</Link>
    </>
  );

  const teacherLinks = (
    <>
      <Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}>Mon Emploi du Temps</Link>
      <Link href="/my-classes" className={`nav-link ${pathname.startsWith('/my-classes') ? 'active' : ''}`}>Mes Classes</Link>
      <Link href="/grades-management" className={`nav-link ${pathname === '/grades-management' ? 'active' : ''}`}>Suivi & Notes</Link>
      <Link href="/teacher/quiz-generator" className={`nav-link ${pathname === '/teacher/quiz-generator' ? 'active' : ''}`}>Générateur de QCM</Link>
      <Link href="/student/simulations" className={`nav-link ${pathname === '/student/simulations' ? 'active' : ''}`}>Laboratoire Virtuel 3D</Link> 
      <Link href="/dashboard/weekly-planner" className={`nav-link ${pathname === '/dashboard/weekly-planner' ? 'active' : ''}`}>Organiseur hebdo</Link>
      <Link href="/blog" className={`nav-link ${pathname.startsWith('/blog') ? 'active' : ''}`}>Annonces</Link>
    </>
  );

  // 3. APPLICATION DE LA CONDITION DANS LE MENU ÉLÈVE
  const studentLinks = (
    <>
      <Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}>Mon Emploi du Temps</Link>
      <Link href="/my-courses" className={`nav-link ${pathname === '/my-courses' ? 'active' : ''}`}>Mes Cours</Link>
      <Link href="/my-grades" className={`nav-link ${pathname === '/my-grades' ? 'active' : ''}`}>Mes Notes</Link>
      <Link href="/student/bulletins" className={`nav-link ${pathname === '/student/bulletins' ? 'active' : ''}`}>Mes Bulletins</Link>
      <Link href="/dashboard/my-plan" className={`nav-link ${pathname === '/dashboard/my-plan' ? 'active' : ''}`}>Mon Plan de Réussite</Link>
      
      {/* AFFICHAGE CONDITIONNEL ICI */}
      {isTerminaleStudent && (
        <Link href="/student/simulations" className={`nav-link ${pathname === '/student/simulations' ? 'active' : ''}`}>
            Laboratoire Virtuel 3D
        </Link> 
      )}

      <Link href="/library" className={`nav-link ${pathname === '/library' ? 'active' : ''}`}>Bibliothèque</Link>
      <Link href="/blog" className={`nav-link ${pathname.startsWith('/blog') ? 'active' : ''}`}>Annonces</Link>
    </>
  );

  const parentLinks = (
    <>
      <Link href="/parent/dashboard" className={`nav-link ${pathname.startsWith('/parent') ? 'active' : ''}`}>Tableau de Bord</Link>
      <Link href="/parent/bulletins" className={`nav-link ${pathname.startsWith('/parent/bulletins') ? 'active' : ''}`}>Bulletins de mes Enfants</Link>
      <Link href="/blog" className={`nav-link ${pathname.startsWith('/blog') ? 'active' : ''}`}>Annonces</Link>
    </>
  );

  console.log("User Class:", user.enrolledClass);

  return (
    <>
      <header className="bg-surface/80 backdrop-blur-sm shadow-md sticky top-0 z-30">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center gap-3 font-bold text-xl text-blue-600 dark:text-blue-400">
                <Image 
                  src="/favicon.ico"
                  alt="Logo Plateforme Edu"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                />
                <span>Plateforme Edu</span>
              </Link>
            </div>

            <div className="hidden md:flex items-baseline space-x-4">
              {user.role === 'MODERATOR' && moderatorLinks}
              {user.role === 'ADMIN' && adminLinks}
              {user.role === 'TEACHER' && teacherLinks}
              {user.role === 'STUDENT' && studentLinks}
              {user.role === 'PARENT' && parentLinks}
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4">
                <span className="user-role-badge">{user.role}</span>
                <ThemeSwitcher />
                <button onClick={handleLogout} className="logout-button" title="Déconnexion">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
              
              <div className="md:hidden flex items-center">
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-text-secondary hover:text-text-primary focus:outline-none" aria-label="Ouvrir le menu">
                  {isOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div 
        className={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="fixed inset-0 bg-black/30" onClick={() => setIsOpen(false)}></div>
        
        <div className="absolute right-0 top-0 h-full w-64 bg-background shadow-lg p-5">
          <div className="flex flex-col h-full">
            <div className="flex-grow space-y-4 pt-4">
                {user.role === 'MODERATOR' && moderatorLinks}
                {user.role === 'ADMIN' && adminLinks}
                {user.role === 'TEACHER' && teacherLinks}
                {user.role === 'STUDENT' && studentLinks}
                {user.role === 'PARENT' && parentLinks}
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                <div className="flex justify-between items-center">
                    <span className="user-role-badge">{user.role}</span>
                    <ThemeSwitcher />
                </div>
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 logout-button">
                    <LogOut className="h-5 w-5" />
                    <span>Déconnexion</span>
                </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationBar;