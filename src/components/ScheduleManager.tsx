// "use client";

// import React, { useState } from 'react';
// import Cookies from 'js-cookie';
// import axios from 'axios';
// import { addCourseSession } from '@/services/api';
// import { CourseSessionData } from '@/types/api-types';
// import { PlusCircle, Clock, BookOpen, UserCheck } from 'lucide-react';

// // --- Définition des types pour les props ---
// interface Teacher {
//   id: string;
//   firstName: string;
//   lastName: string;
// }
// interface Session {
//   id: string;
//   subject: string;
//   dayOfWeek: string;
//   startTime: string;
//   endTime: string;
//   teacher: Teacher;
// }
// interface Schedule {
//   id: string;
//   sessions: Session[];
// }
// interface ScheduleManagerProps {
//   schedule: Schedule | null;
//   teachers: Teacher[];
//   classId: string;
//   onSuccess: () => void; // Fonction pour rafraîchir les données parentes
// }

// // --- Le Composant ---
// const ScheduleManager: React.FC<ScheduleManagerProps> = ({ schedule, teachers, classId, onSuccess }) => {
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [newSession, setNewSession] = useState<Omit<CourseSessionData, 'dayOfWeek'>>({
//     subject: '',
//     startTime: '08:00',
//     endTime: '10:00',
//     teacherId: '',
//   });
//   const [selectedDay, setSelectedDay] = useState('MONDAY');

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setNewSession(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     const token = Cookies.get('token');
//     if (!token || !newSession.teacherId) {
//       setError("Le professeur est requis.");
//       setLoading(false);
//       return;
//     }

//     const sessionData: CourseSessionData = { ...newSession, dayOfWeek: selectedDay };

//     try {
//       await addCourseSession(classId, sessionData, token);
//       onSuccess(); // On dit au parent de se rafraîchir
//       setShowAddForm(false); // On cache le formulaire
//       // On réinitialise le formulaire pour la prochaine fois
//       setNewSession({ subject: '', startTime: '08:00', endTime: '10:00', teacherId: '' });
//     } catch (err) {
//       if (axios.isAxiosError(err) && err.response) {
//         setError(err.response.data.message || "Erreur lors de l'ajout.");
//       } else {
//         setError("Une erreur réseau est survenue.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sessionsByDay = schedule?.sessions?.reduce((acc, session) => {
//     (acc[session.dayOfWeek] = acc[session.dayOfWeek] || []).push(session);
//     return acc;
//   }, {} as Record<string, Session[]>) || {};
  
//   const daysOrder = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

//   return (
//     <div>
//       <div className="flex justify-end mb-4">
//         <button
//           onClick={() => setShowAddForm(!showAddForm)}
//           className="flex items-center space-x-2 bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
//         >
//           <PlusCircle className="h-5 w-5" />
//           <span>{showAddForm ? "Annuler" : "Ajouter une session"}</span>
//         </button>
//       </div>

//       {/* --- Formulaire d'Ajout (conditionnel) --- */}
//       {showAddForm && (
//         <form onSubmit={handleSubmit} className="bg-background p-4 rounded-md mb-6 border border-gray-200 dark:border-gray-700">
//           <h3 className="font-bold mb-4">Nouvelle session de cours</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input name="subject" value={newSession.subject} onChange={handleChange} placeholder="Matière (ex: Mathématiques)" required className="input-style" />
//             <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)} className="input-style">
//               {daysOrder.map(day => <option key={day} value={day}>{day.charAt(0) + day.slice(1).toLowerCase()}</option>)}
//             </select>
//             <input type="time" name="startTime" value={newSession.startTime} onChange={handleChange} required className="input-style" />
//             <input type="time" name="endTime" value={newSession.endTime} onChange={handleChange} required className="input-style" />
//             <select name="teacherId" value={newSession.teacherId} onChange={handleChange} required className="input-style md:col-span-2">
//               <option value="">Sélectionner un professeur...</option>
//               {teachers.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
//             </select>
//           </div>
//           {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
//           <div className="flex justify-end mt-4">
//             <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
//               {loading ? "Ajout..." : "Confirmer"}
//             </button>
//           </div>
//           <style jsx>{`.input-style { width: 100%; padding: 0.5rem 1rem; background-color: var(--background); border: 1px solid #ccc; border-radius: 0.375rem; }`}</style>
//         </form>
//       )}

//       {/* --- Affichage de l'Emploi du Temps --- */}
//       <div className="space-y-4">
//         {daysOrder.map(day => 
//           sessionsByDay[day] && (
//             <div key={day}>
//               <h4 className="font-bold text-text-secondary">{day.charAt(0) + day.slice(1).toLowerCase()}</h4>
//               <ul className="space-y-2 mt-2">
//                 {sessionsByDay[day].map(session => (
//                   <li key={session.id} className="bg-background p-3 rounded-md border border-gray-200 dark:border-gray-700">
//                     <p className="font-bold flex items-center"><BookOpen className="h-4 w-4 mr-2" />{session.subject}</p>
//                     <p className="text-sm text-text-secondary flex items-center"><Clock className="h-4 w-4 mr-2" />{session.startTime} - {session.endTime}</p>
//                     <p className="text-sm text-text-secondary flex items-center"><UserCheck className="h-4 w-4 mr-2" />{session.teacher.firstName} {session.teacher.lastName}</p>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )
//         )}
//         {(!schedule || schedule.sessions.length === 0) && (
//           <p className="text-center text-text-subtle italic py-8">L'emploi du temps est vide.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ScheduleManager;



"use client";

import React, { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { addCourseSession } from '@/services/api';
import { CourseSessionData } from '@/types/api-types';
import { PlusCircle, Clock, BookOpen, UserCheck, Edit } from 'lucide-react';
import EditSessionModal from './EditSessionModal'; // <-- Importer la nouvelle modale

// --- Définition des types pour les props ---
interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
}
interface Session {
  id: string;
  subject: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  teacher: Teacher;
}
interface Schedule {
  id: string;
  sessions: Session[];
}
interface ScheduleManagerProps {
  schedule: Schedule | null;
  teachers: Teacher[];
  classId: string;
  onSuccess: () => void; // Fonction pour rafraîchir les données parentes
}

// --- Le Composant ---
const ScheduleManager: React.FC<ScheduleManagerProps> = ({ schedule, teachers, classId, onSuccess }) => {
  // State pour le formulaire d'ajout
  const [showAddForm, setShowAddForm] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [errorAdd, setErrorAdd] = useState<string | null>(null);
  const [newSession, setNewSession] = useState<Omit<CourseSessionData, 'dayOfWeek'>>({
    subject: '',
    startTime: '08:00',
    endTime: '10:00',
    teacherId: '',
  });
  const [selectedDay, setSelectedDay] = useState('MONDAY');
  
  // --- NOUVEAU : State pour gérer la modale d'édition ---
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSession(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAdd(true);
    setErrorAdd(null);
    const token = Cookies.get('token');
    if (!token || !newSession.teacherId) {
      setErrorAdd("Le professeur est requis.");
      setLoadingAdd(false);
      return;
    }

    const sessionData: CourseSessionData = { ...newSession, dayOfWeek: selectedDay };

    try {
      await addCourseSession(classId, sessionData, token);
      onSuccess();
      setShowAddForm(false);
      setNewSession({ subject: '', startTime: '08:00', endTime: '10:00', teacherId: '' });
    } catch (err) {
        const errorMessage = axios.isAxiosError(err) && err.response 
            ? err.response.data.message 
            : "Une erreur réseau est survenue.";
        setErrorAdd(errorMessage);
    } finally {
      setLoadingAdd(false);
    }
  };

  const sessionsByDay = schedule?.sessions?.reduce((acc, session) => {
    (acc[session.dayOfWeek] = acc[session.dayOfWeek] || []).push(session);
    return acc;
  }, {} as Record<string, Session[]>) || {};
  
  const daysOrder = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

  return (
    <>
      <div>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-secondary flex items-center gap-2"
          >
            <PlusCircle size={18} />
            <span>{showAddForm ? "Annuler" : "Ajouter une session"}</span>
          </button>
        </div>

        {/* --- Formulaire d'Ajout (conditionnel) --- */}
        {showAddForm && (
          <form onSubmit={handleSubmit} className="bg-background p-4 rounded-md mb-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold mb-4">Nouvelle session de cours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="subject" value={newSession.subject} onChange={handleChange} placeholder="Matière (ex: Mathématiques)" required className="input-field" />
              <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)} className="input-field">
                {daysOrder.map(day => <option key={day} value={day}>{day.charAt(0) + day.slice(1).toLowerCase()}</option>)}
              </select>
              <input type="time" name="startTime" value={newSession.startTime} onChange={handleChange} required className="input-field" />
              <input type="time" name="endTime" value={newSession.endTime} onChange={handleChange} required className="input-field" />
              <select name="teacherId" value={newSession.teacherId} onChange={handleChange} required className="input-field md:col-span-2">
                <option value="">Sélectionner un professeur...</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
              </select>
            </div>
            {errorAdd && <p className="text-red-500 text-sm mt-2 text-center">{errorAdd}</p>}
            <div className="flex justify-end mt-4">
              <button type="submit" disabled={loadingAdd} className="btn-primary">
                {loadingAdd ? "Ajout..." : "Confirmer"}
              </button>
            </div>
          </form>
        )}

        {/* --- Affichage de l'Emploi du Temps (Cliquable) --- */}
        <div className="space-y-4">
          {daysOrder.map(day => 
            sessionsByDay[day] && (
              <div key={day}>
                <h4 className="font-bold text-text-secondary">{day.charAt(0) + day.slice(1).toLowerCase()}</h4>
                <ul className="space-y-2 mt-2">
                  {sessionsByDay[day]
                    .sort((a, b) => a.startTime.localeCompare(b.startTime)) // Trier les sessions par heure
                    .map(session => (
                    <li 
                      key={session.id} 
                      onClick={() => setEditingSession(session)} // <-- Action au clic
                      className="bg-background p-3 rounded-md border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary group transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold flex items-center"><BookOpen className="h-4 w-4 mr-2 text-text-secondary" />{session.subject}</p>
                          <p className="text-sm text-text-secondary flex items-center mt-1"><Clock className="h-4 w-4 mr-2" />{session.startTime} - {session.endTime}</p>
                          <p className="text-sm text-text-secondary flex items-center mt-1"><UserCheck className="h-4 w-4 mr-2" />{session.teacher.firstName} {session.teacher.lastName}</p>
                        </div>
                        <Edit className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
          {(!schedule || schedule.sessions.length === 0) && (
            <p className="text-center text-text-subtle italic py-8">L'emploi du temps est vide.</p>
          )}
        </div>
      </div>
      
      {/* --- Affichage conditionnel de la Modale --- */}
      {editingSession && (
        <EditSessionModal
          session={editingSession}
          teachers={teachers}
          onClose={() => setEditingSession(null)}
          onSuccess={() => {
            onSuccess(); // Rafraîchit les données de la page parente
            setEditingSession(null); // Ferme la modale
          }}
        />
      )}
    </>
  );
};

export default ScheduleManager;