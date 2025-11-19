// "use client";

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { createUser } from '@/services/api';
// import { UserCredentials } from '@/types/api-types';
// import Cookies from 'js-cookie';
// import axios from 'axios';
// import Link from 'next/link';
// import { CheckCircle, Clipboard } from 'lucide-react';

// // --- COMPOSANT MODAL DE SUCCÈS ---
// // Ce composant s'affiche après la création pour montrer les identifiants.
// const SuccessModal: React.FC<{ credentials: UserCredentials; onClose: () => void }> = ({ credentials, onClose }) => {
//     const [copied, setCopied] = useState('');

//     const copyToClipboard = (text: string, field: 'identifiant' | 'password') => {
//         navigator.clipboard.writeText(text);
//         setCopied(field);
//         setTimeout(() => setCopied(''), 2000); // Réinitialise l'icône après 2 secondes
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
//             <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-md text-center">
//                 <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
//                 <h2 className="text-xl font-bold mb-2">Compte Créé avec Succès !</h2>
//                 <p className="text-text-secondary mb-6">Veuillez communiquer les informations suivantes à l'utilisateur :</p>
                
//                 <div className="space-y-4 text-left">
//                     <div>
//                         <label className="text-xs font-semibold text-text-secondary">IDENTIFIANT</label>
//                         <div className="flex items-center justify-between bg-background p-3 rounded-md border border-gray-200 dark:border-gray-700">
//                             <span className="font-mono text-primary break-all">{credentials.identifiant}</span>
//                             <button onClick={() => copyToClipboard(credentials.identifiant, 'identifiant')} className="p-1 text-gray-400 hover:text-gray-600 ml-2" title="Copier l'identifiant">
//                                 {copied === 'identifiant' ? <CheckCircle size={16} className="text-green-500" /> : <Clipboard size={16} />}
//                             </button>
//                         </div>
//                     </div>
//                     <div>
//                         <label className="text-xs font-semibold text-text-secondary">MOT DE PASSE TEMPORAIRE</label>
//                         <div className="flex items-center justify-between bg-background p-3 rounded-md border border-gray-200 dark:border-gray-700">
//                             <span className="font-mono text-primary">{credentials.password}</span>
//                             <button onClick={() => copyToClipboard(credentials.password, 'password')} className="p-1 text-gray-400 hover:text-gray-600 ml-2" title="Copier le mot de passe">
//                                 {copied === 'password' ? <CheckCircle size={16} className="text-green-500" /> : <Clipboard size={16} />}
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 <button onClick={onClose} className="mt-8 btn-primary w-full">
//                     Fermer et créer un autre utilisateur
//                 </button>
//             </div>
//         </div>
//     );
// };


// // --- COMPOSANT PRINCIPAL DE LA PAGE ---
// const NewUserPage = () => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     role: 'STUDENT',
//     email: '', // L'email est maintenant optionnel
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
  
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [generatedCredentials, setGeneratedCredentials] = useState<UserCredentials | null>(null);

//   const router = useRouter();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     const token = Cookies.get('token');
//     if (!token) {
//       setError("Votre session a expiré. Veuillez vous reconnecter.");
//       setLoading(false);
//       return;
//     }

//     try {
//       // On ne crée pas de type spécifique, on envoie directement l'objet simplifié
//       const response = await createUser({
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         role: formData.role as 'STUDENT' | 'TEACHER',
//         email: formData.email || undefined, // N'envoie le champ que s'il n'est pas vide
//       }, token);
      
//       setGeneratedCredentials(response.data.credentials);
//       setShowSuccessModal(true);
      
//       setFormData({ firstName: '', lastName: '', email: '', role: 'STUDENT' });
//     } catch (err) {
//       if (axios.isAxiosError(err) && err.response) {
//         setError(err.response.data.message || "Une erreur est survenue.");
//       } else {
//         setError("Une erreur réseau est survenue.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseModal = () => {
//     setShowSuccessModal(false);
//     setGeneratedCredentials(null);
//   };

//   return (
//     <>
//       <div className="max-w-2xl mx-auto">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-3xl font-bold text-text-primary">Créer un Nouvel Utilisateur</h1>
//           <Link href="/users" className="text-sm text-blue-500 hover:underline">
//             &larr; Retour à la liste
//           </Link>
//         </div>

//         <div className="bg-surface p-8 rounded-lg shadow-md">
//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <label htmlFor="firstName" className="block text-sm font-medium text-text-secondary mb-1">Prénom</label>
//                 <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleChange} required className="input-field" />
//               </div>
//               <div>
//                 <label htmlFor="lastName" className="block text-sm font-medium text-text-secondary mb-1">Nom</label>
//                 <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} required className="input-field" />
//               </div>
//             </div>
//             <div className="mb-6">
//               <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Adresse Email (Optionnel)</label>
//               <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="input-field" />
//               <p className="text-xs text-text-subtle mt-1">Utilisé pour les notifications et la récupération de compte.</p>
//             </div>
//             <div className="mb-8">
//               <label htmlFor="role" className="block text-sm font-medium text-text-secondary mb-1">Rôle</label>
//               <select name="role" id="role" value={formData.role} onChange={handleChange} className="input-field">
//                 <option value="STUDENT">Étudiant</option>
//                 <option value="TEACHER">Enseignant</option>
//               </select>
//             </div>
//             {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}
//             <div className="flex justify-end">
//               <button type="submit" disabled={loading} className="btn-primary">
//                 {loading ? "Création en cours..." : "Créer l'utilisateur"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
      
//       {showSuccessModal && generatedCredentials && (
//         <SuccessModal credentials={generatedCredentials} onClose={handleCloseModal} />
//       )}
//     </>
//   );
// };

// export default NewUserPage;




// (app)/users/new/page.tsx

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser, createParent, NewParentData } from '@/services/api';
import { UserCredentials } from '@/types/api-types';
import Cookies from 'js-cookie';
import axios from 'axios';
import Link from 'next/link';
import { CheckCircle, Clipboard, Briefcase, GraduationCap, UserPlus } from 'lucide-react';

// --- COMPOSANT MODAL DE SUCCÈS (INCHANGÉ) ---
const SuccessModal: React.FC<{ credentials: UserCredentials; onClose: () => void; userType: string }> = ({ credentials, onClose, userType }) => {
    const [copied, setCopied] = useState('');
    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text); setCopied(field);
        setTimeout(() => setCopied(''), 2000);
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-md text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Compte {userType} Créé !</h2>
                <p className="text-text-secondary mb-6">Veuillez communiquer les informations suivantes à l'utilisateur :</p>
                <div className="space-y-4 text-left">
                    {/* Identifiant */}
                    <div>
                        <label className="text-xs font-semibold text-text-secondary">IDENTIFIANT</label>
                        <div className="flex items-center justify-between bg-background p-3 rounded-md border dark:border-gray-700">
                            <span className="font-mono text-primary break-all">{credentials.identifiant}</span>
                            <button onClick={() => copyToClipboard(credentials.identifiant, 'id')} className="p-1 text-gray-400 hover:text-gray-600 ml-2" title="Copier"><CheckCircle size={16} className={copied === 'id' ? 'text-green-500' : 'hidden'} /><Clipboard size={16} className={copied === 'id' ? 'hidden' : 'block'} /></button>
                        </div>
                    </div>
                    {/* Mot de passe */}
                    <div>
                        <label className="text-xs font-semibold text-text-secondary">MOT DE PASSE TEMPORAIRE</label>
                        <div className="flex items-center justify-between bg-background p-3 rounded-md border dark:border-gray-700">
                            <span className="font-mono text-primary">{credentials.password}</span>
                             <button onClick={() => copyToClipboard(credentials.password, 'pw')} className="p-1 text-gray-400 hover:text-gray-600 ml-2" title="Copier"><CheckCircle size={16} className={copied === 'pw' ? 'text-green-500' : 'hidden'} /><Clipboard size={16} className={copied === 'pw' ? 'hidden' : 'block'} /></button>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="mt-8 btn-primary w-full">Fermer et continuer</button>
            </div>
        </div>
    );
};

// --- COMPOSANT PRINCIPAL DE LA PAGE ---
const NewUserPage = () => {
  const [formType, setFormType] = useState<'standard' | 'parent'>('standard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // States pour le formulaire standard (élève/prof)
  const [standardData, setStandardData] = useState({ firstName: '', lastName: '', role: 'STUDENT', email: '' });
  
  // States pour le formulaire parent
  const [parentData, setParentData] = useState({ firstName: '', lastName: '', email: '', phone: '' });

  // States pour le modal de succès
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<UserCredentials | null>(null);
  const [createdUserType, setCreatedUserType] = useState('');

  const handleStandardChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setStandardData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleParentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParentData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const token = Cookies.get('token');
    if (!token) { setError("Session expirée."); setLoading(false); return; }

    try {
        let response;
        if (formType === 'standard') {
            response = await createUser({ ...standardData, role: standardData.role as 'STUDENT' | 'TEACHER', email: standardData.email || undefined }, token);
            setCreatedUserType(standardData.role === 'STUDENT' ? 'Étudiant' : 'Enseignant');
            setStandardData({ firstName: '', lastName: '', email: '', role: 'STUDENT' }); // Reset form
        } else {
            response = await createParent({ ...parentData, email: parentData.email || undefined, phone: parentData.phone || undefined }, token);
            setCreatedUserType('Parent');
            setParentData({ firstName: '', lastName: '', email: '', phone: '' }); // Reset form
        }
        setGeneratedCredentials(response.data.credentials);
        setShowSuccessModal(true);
    } catch (err) {
        if (axios.isAxiosError(err) && err.response) setError(err.response.data.message);
        else setError("Une erreur réseau est survenue.");
    } finally {
        setLoading(false);
    }
  };
  
  return (
    <>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-text-primary">Créer un Compte</h1>
          <Link href="/users" className="text-sm text-blue-500 hover:underline">&larr; Retour</Link>
        </div>

        <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-6"><button onClick={() => setFormType('standard')} className={`${formType === 'standard' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'} py-3 px-1 border-b-2 font-medium text-sm`}>Élève / Enseignant</button><button onClick={() => setFormType('parent')} className={`${formType === 'parent' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'} py-3 px-1 border-b-2 font-medium text-sm`}>Parent d'élève</button></nav>
        </div>

        <div className="bg-surface p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            {formType === 'standard' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"><div><label htmlFor="firstName" className="label">Prénom</label><input type="text" name="firstName" value={standardData.firstName} onChange={handleStandardChange} required className="input-field" /></div><div><label htmlFor="lastName" className="label">Nom</label><input type="text" name="lastName" value={standardData.lastName} onChange={handleStandardChange} required className="input-field" /></div></div>
                <div className="mb-6"><label htmlFor="email" className="label">Email (Optionnel)</label><input type="email" name="email" value={standardData.email} onChange={handleStandardChange} className="input-field" /></div>
                <div className="mb-8"><label htmlFor="role" className="label">Rôle</label><select name="role" value={standardData.role} onChange={handleStandardChange} className="input-field"><option value="STUDENT">Étudiant</option><option value="TEACHER">Enseignant</option></select></div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"><div><label htmlFor="firstName" className="label">Prénom du Parent</label><input type="text" name="firstName" value={parentData.firstName} onChange={handleParentChange} required className="input-field" /></div><div><label htmlFor="lastName" className="label">Nom du Parent</label><input type="text" name="lastName" value={parentData.lastName} onChange={handleParentChange} required className="input-field" /></div></div>
                <div className="mb-6"><label htmlFor="email" className="label">Email (Optionnel)</label><input type="email" name="email" value={parentData.email} onChange={handleParentChange} className="input-field" /></div>
                <div className="mb-8"><label htmlFor="phone" className="label">Téléphone (Optionnel)</label><input type="tel" name="phone" value={parentData.phone} onChange={handleParentChange} className="input-field" /></div>
              </>
            )}
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Création..." : "Créer le Compte"}</button>
          </form>
        </div>
      </div>
      {showSuccessModal && generatedCredentials && <SuccessModal credentials={generatedCredentials} userType={createdUserType} onClose={() => setShowSuccessModal(false)} />}
    </>
  );
};

export default NewUserPage;