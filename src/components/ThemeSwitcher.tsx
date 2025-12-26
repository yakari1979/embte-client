// 'use client';

// import { Moon, Sun } from 'lucide-react';
// import { useTheme } from '@/context/ThemeContext';

// export default function ThemeSwitcher() {
//   const { theme, toggleTheme, mounted } = useTheme();

//   // Si le site n'est pas encore "monté" (chargé), on n'affiche rien 
//   // pour éviter les bugs d'affichage
//   if (!mounted) return <div className="w-9 h-9" />; // Un carré vide pour garder la place

//   return (
//     <button
//       onClick={toggleTheme}
//       className="p-2 rounded-full  border-nexus-gray hover:bg-nexus-orange hover:text-black hover:border-nexus-orange transition-all text-white"
//       aria-label="Changer de thème"
//     >
//       {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
//     </button>
//   );
// }



'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeSwitcher() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full border border-white/30 flex items-center justify-center overflow-hidden 
                 hover:bg-white/10 hover:border-blue-300 transition-all duration-300 shadow-sm"
      aria-label="Changer de thème"
    >
      <AnimatePresence mode="wait">
        {theme === 'dark' ? (
          <motion.div
            key="sun"
            initial={{ rotate: -45, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: 45, scale: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="absolute"
          >
            <Sun size={20} className="text-yellow-400" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 45, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: -45, scale: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="absolute"
          >
            <Moon size={20} className="text-blue-200" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
