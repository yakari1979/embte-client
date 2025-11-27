// "use client";

// import React, { useState, useEffect } from 'react';
// import { createEvaluation } from '@/services/api';
// import Cookies from 'js-cookie';
// import { Loader2 } from 'lucide-react';

// interface AddEvaluationModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onEvaluationCreated: () => void;
//   classId: string;
//   subjects: string[];
//   evaluationType: 'TD' | 'DEVOIR'; // <-- 1. On ajoute cette prop
// }

// const AddEvaluationModal: React.FC<AddEvaluationModalProps> = ({ isOpen, onClose, onEvaluationCreated, classId, subjects, evaluationType }) => {
//   const [title, setTitle] = useState('');
//   const [subject, setSubject] = useState(subjects[0] || '');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');

//   // 2. Le titre du modal devient dynamique
//   const modalTitle = evaluationType === 'TD' ? 'Ajouter un nouveau TD' : 'Ajouter un nouveau Devoir';

//   useEffect(() => {
//       if (subjects.length > 0 && !subject) {
//           setSubject(subjects[0]);
//       }
//   }, [subjects, subject]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title.trim() || !subject.trim()) {
//       setError("Le titre et la matière sont requis.");
//       return;
//     }

//     const token = Cookies.get('token');
//     if (!token) return;

//     setIsSubmitting(true);
//     setError('');
//     try {
//       // 3. On utilise la prop 'evaluationType' lors de l'appel API
//       await createEvaluation({ title, type: evaluationType, subject, classId }, token);
      
//       onEvaluationCreated();
//       onClose();
//       setTitle('');
//       setSubject(subjects[0] || '');
//     } catch (err) {
//       setError("Une erreur est survenue lors de la création.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
//       <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-md">
//         <h2 className="text-xl font-bold mb-4">{modalTitle}</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             <div>
//               <label htmlFor="title" className="block text-sm font-medium mb-1">Titre de l'évaluation</label>
//               <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder={evaluationType === 'TD' ? "Ex: TD N°1 - Algèbre" : "Ex: 1er Devoir Surveillé"} />
//             </div>
//             <div>
//               <label htmlFor="subject" className="block text-sm font-medium mb-1">Matière</label>
//               <select id="subject" value={subject} onChange={e => setSubject(e.target.value)} className="input-field">
//                 {subjects.map(s => <option key={s} value={s}>{s}</option>)}
//               </select>
//             </div>
//             {error && <p className="text-red-500 text-sm">{error}</p>}
//           </div>
//           <div className="mt-6 flex justify-end gap-3">
//             <button type="button" onClick={onClose} className="btn-secondary">Annuler</button>
//             <button type="submit" className="btn-primary" disabled={isSubmitting}>
//               {isSubmitting ? <Loader2 className="animate-spin" /> : 'Créer'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddEvaluationModal;


"use client";

import React, { useState, useEffect } from 'react';
import { createEvaluation } from '@/services/api';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';

interface AddEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEvaluationCreated: () => void;
  classId: string;
  subjects: string[];
  evaluationType: 'TD' | 'DEVOIR';
  // --- 1. Nouveaux paramètres optionnels pour le bulletin ---
  allowBulletinChoice?: boolean; 
  bulletinType?: string;
}

const AddEvaluationModal: React.FC<AddEvaluationModalProps> = ({ 
    isOpen, onClose, onEvaluationCreated, classId, subjects, evaluationType,
    allowBulletinChoice = false, 
    bulletinType = 'AUTRE'
}) => {
  
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(subjects[0] || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // --- 2. État pour le choix spécifique (Devoir 1, 2, Compo) ---
  const [selectedBulletinType, setSelectedBulletinType] = useState(bulletinType);

  const modalTitle = evaluationType === 'TD' ? 'Ajouter un nouveau TD' : 'Ajouter un nouveau Devoir';

  // Reset du formulaire quand on ouvre/ferme
  useEffect(() => {
      if (isOpen) {
          if (subjects.length > 0 && !subject) setSubject(subjects[0]);
          setSelectedBulletinType(bulletinType); // Reset du type
      }
  }, [isOpen, subjects, subject, bulletinType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim()) {
      setError("Le titre et la matière sont requis.");
      return;
    }

    const token = Cookies.get('token');
    if (!token) return;

    setIsSubmitting(true);
    setError('');
    try {
      // --- 3. Envoi du type spécifique à l'API ---
      await createEvaluation({ 
          title, 
          type: evaluationType, // TD ou DEVOIR (Visuel)
          subject, 
          classId,
          // Ici on envoie DEVOIR_1, COMPOSITION, etc.
          evaluationType: allowBulletinChoice ? selectedBulletinType : bulletinType 
      }, token);
      
      onEvaluationCreated();
      onClose();
      setTitle('');
      setSubject(subjects[0] || '');
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de la création.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{modalTitle}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Titre de l'évaluation</label>
              <input 
                id="title" 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="input-field w-full" 
                placeholder={evaluationType === 'TD' ? "Ex: TD N°1 - Algèbre" : "Ex: Devoir N°1"} 
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">Matière</label>
              <select id="subject" value={subject} onChange={e => setSubject(e.target.value)} className="input-field w-full">
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* --- 4. SECTION SÉLECTION TYPE BULLETIN (Visible seulement pour les Devoirs) --- */}
            {allowBulletinChoice && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mt-2">
                    <label className="block text-sm font-bold text-blue-800 dark:text-blue-300 mb-3">
                        Type pour le Bulletin Officiel
                    </label>
                    <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 p-1 rounded transition-colors">
                            <input 
                                type="radio" 
                                name="bType" 
                                value="DEVOIR_1"
                                checked={selectedBulletinType === 'DEVOIR_1'}
                                onChange={e => setSelectedBulletinType(e.target.value)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium">1er Devoir Semestriel</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 p-1 rounded transition-colors">
                            <input 
                                type="radio" 
                                name="bType" 
                                value="DEVOIR_2"
                                checked={selectedBulletinType === 'DEVOIR_2'}
                                onChange={e => setSelectedBulletinType(e.target.value)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium">2ème Devoir Semestriel</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 p-1 rounded transition-colors">
                            <input 
                                type="radio" 
                                name="bType" 
                                value="COMPOSITION"
                                checked={selectedBulletinType === 'COMPOSITION'}
                                onChange={e => setSelectedBulletinType(e.target.value)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-bold text-blue-700 dark:text-blue-400">Composition</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded transition-colors">
                            <input 
                                type="radio" 
                                name="bType" 
                                value="AUTRE"
                                checked={selectedBulletinType === 'AUTRE'}
                                onChange={e => setSelectedBulletinType(e.target.value)}
                                className="w-4 h-4 text-gray-500 focus:ring-gray-500"
                            />
                            <span className="text-sm text-gray-500">Autre (Non comptabilisé)</span>
                        </label>
                    </div>
                </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary">Annuler</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvaluationModal;