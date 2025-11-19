// "use client";

// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';
// import Link from 'next/link';
// import { Users, Calendar, CheckSquare, UserX, ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react';
// import { getMyClassDetails } from '@/services/api'; 
// import AttendanceModal from '@/components/AttendanceModal';
// import { jwtDecode } from 'jwt-decode';
// import dayjs from 'dayjs';
// import isBetween from 'dayjs/plugin/isBetween';
// import 'dayjs/locale/fr';

// dayjs.extend(isBetween);
// dayjs.locale('fr');

// // --- TYPES ---
// interface Student { id: string; firstName: string; lastName: string; }
// interface Teacher { id: string; firstName: string; lastName: string; }
// interface AttendanceRecord { status: string; student: Student; date: string; }
// interface Session { 
//   id: string; 
//   subject: string; 
//   dayOfWeek: string; 
//   startTime: string; 
//   endTime: string; 
//   teacher: Teacher;
//   attendanceRecords: AttendanceRecord[];
// }
// interface ClassDetails { name: string; students: Student[]; schedule: { sessions: Session[] } | null; }
// interface DecodedToken { userId: string; }

// // --- COMPOSANT INTELLIGENT POUR UNE SESSION (LOGIQUE FINALE CORRIGÉE) ---
// const SessionItem: React.FC<{ session: Session; day: dayjs.Dayjs; currentUserId: string; onOpenModal: (session: Session, day: dayjs.Dayjs) => void; }> = ({ session, day, currentUserId, onOpenModal }) => {
//   const now = dayjs();
  
//   const startDateTime = day.hour(parseInt(session.startTime.split(':')[0])).minute(parseInt(session.startTime.split(':')[1]));
//   const endDateTime = day.hour(parseInt(session.endTime.split(':')[0])).minute(parseInt(session.endTime.split(':')[1]));
  
//   const isPast = now.isAfter(endDateTime);
//   const isCurrent = now.isBetween(startDateTime, endDateTime);
//   const isMyCourse = session.teacher.id === currentUserId;

//   const isHighlighted = isMyCourse && isCurrent;

//   return (
//     <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-background rounded-md mt-1 border ${isHighlighted ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800/50' : 'border-gray-200 dark:border-gray-700'}`}>
//       <div className="mb-2 sm:mb-0">
//         <p className="font-semibold">{session.subject}</p>
//         <p className="text-sm text-text-secondary">{session.startTime}-{session.endTime} (Prof: {session.teacher.firstName.charAt(0)}. {session.teacher.lastName})</p>
//       </div>
      
//       {/* Affiche les boutons d'action uniquement pour mes cours passés ou présents */}
//       {isMyCourse && (isCurrent || isPast) && (
//         <div className="flex items-center space-x-2 self-end sm:self-center">
//           <button onClick={() => onOpenModal(session, day)} className="btn-primary">
//             <CheckSquare className="h-4 w-4"/>
//             <span>Présences</span>
//           </button>
//           {isPast && (
//              <Link href={`/session-summary/${session.id}`} className="btn-secondary">
//                 <ClipboardList className="h-4 w-4"/>
//                 <span>Bilan</span>
//              </Link>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };


// // --- COMPOSANT PRINCIPAL DE LA PAGE ---
// const ClassDetailPageForTeacher = () => {
//   const params = useParams();
//   const classId = params.id as string;
//   const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedSession, setSelectedSession] = useState<{session: Session, date: string} | null>(null);
//   const [currentDate, setCurrentDate] = useState(dayjs());

//   const dayOrder = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

//   const fetchClassDetails = useCallback(async () => {
//     const token = Cookies.get('token');
//     if (!token || !classId) {
//       setError("Authentification invalide."); setLoading(false); return;
//     }
//     try {
//       const response = await getMyClassDetails(classId, token);
//       setClassDetails(response.data);
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Impossible de charger les détails.");
//     } finally {
//       if (loading) setLoading(false);
//     }
//   }, [classId, loading]);

//   useEffect(() => {
//     const token = Cookies.get('token');
//     if (token) {
//         try {
//             const decoded: DecodedToken = jwtDecode(token);
//             setCurrentUserId(decoded.userId);
//         } catch (e) { console.error("Token invalide"); }
//     }
//     fetchClassDetails();
//   }, [fetchClassDetails]);
  
//   const recentAbsences = useMemo(() => {
//     if (!classDetails?.schedule?.sessions) return [];
//     const allAbsences: { student: Student; session: Session; date: string }[] = [];
//     classDetails.schedule.sessions.forEach(session => {
//       session.attendanceRecords.forEach(record => {
//         if (record.status === 'ABSENT') {
//           allAbsences.push({ student: record.student, session, date: record.date });
//         }
//       });
//     });
//     return allAbsences.slice(0, 10);
//   }, [classDetails]);

//   const openAttendanceModal = (session: Session, date: dayjs.Dayjs) => {
//     setSelectedSession({ session, date: date.format('YYYY-MM-DD') });
//     setIsModalOpen(true);
//   };
  
//   const startOfWeek = currentDate.startOf('week');
//   const endOfWeek = currentDate.endOf('week');
//   const weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));

//   if (loading) return <p className="text-center p-8">Chargement...</p>;
//   if (error) return <p className="text-red-500 text-center p-4">{error}</p>;
//   if (!classDetails) return <p className="text-center p-8">Aucun détail trouvé.</p>;

//   return (
//     <div>
//       <Link href="/my-classes" className="text-sm text-blue-500 hover:underline mb-4 inline-block">&larr; Retour à mes classes</Link>
//       <h1 className="text-3xl font-bold mb-6">{classDetails.name}</h1>
      
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 space-y-6">
//           <div className="bg-surface p-6 rounded-lg shadow-md">
//             <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
//               <h2 className="text-xl font-bold flex items-center"><Calendar className="mr-2"/>Emploi du Temps</h2>
//               <div className="flex items-center space-x-2">
//                 <button onClick={() => setCurrentDate(c => c.subtract(1, 'week'))} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronLeft /></button>
//                 <span className="font-semibold text-sm w-48 text-center">{startOfWeek.format('D MMM')} - {endOfWeek.format('D MMM YYYY')}</span>
//                 <button onClick={() => setCurrentDate(c => c.add(1, 'week'))} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronRight /></button>
//               </div>
//             </div>
//             <div className="space-y-4">
//               {weekDays.map(day => {
//                 const dayIndex = day.day();
//                 const dayKey = dayOrder[dayIndex];
//                 const sessionsForDay = classDetails.schedule?.sessions.filter(s => s.dayOfWeek.toUpperCase() === dayKey).sort((a, b) => a.startTime.localeCompare(b.startTime)) || [];
//                 const isToday = day.isSame(dayjs(), 'day');
//                 return (
//                   <div key={day.toString()} className={isToday ? 'bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg' : ''}>
//                     <h3 className={`font-semibold text-sm ${isToday ? 'text-blue-600 dark:text-blue-300' : 'text-text-secondary'}`}>{day.format('dddd D')}</h3>
//                     {sessionsForDay.length > 0 ? (
//                       sessionsForDay.map(session => (
//                         <SessionItem 
//                           key={session.id}
//                           session={session} 
//                           day={day} 
//                           currentUserId={currentUserId!}
//                           onOpenModal={openAttendanceModal} 
//                         />
//                       ))
//                     ) : <p className="text-xs italic text-text-subtle pt-2 pl-1">Aucun cours</p>}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//           <div className="bg-surface p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-bold flex items-center mb-4"><UserX className="mr-2 text-red-500"/>Absences Récentes</h2>
//             {recentAbsences.length > 0 ? (
//               <ul className="space-y-2">
//                 {recentAbsences.map((absence, index) => (
//                   <li key={index} className="p-2 bg-background rounded-md text-sm">
//                     <span className="font-semibold">{absence.student.firstName} {absence.student.lastName}</span>
//                     <span className="text-text-secondary"> était absent(e) au cours de </span>
//                     <span className="font-semibold">{absence.session.subject}</span>
//                     <span className="text-text-secondary"> ({dayjs(absence.date).format('dddd D MMM')}).</span>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="italic text-text-subtle text-center py-4">Aucune absence enregistrée récemment.</p>
//             )}
//           </div>
//         </div>
        
//         <div className="lg:col-span-1">
//           <div className="bg-surface p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-bold flex items-center mb-4"><Users className="mr-2"/>Liste des Élèves ({classDetails.students.length})</h2>
//             <ul className="space-y-2 max-h-96 overflow-y-auto">
//               {classDetails.students.length > 0 ? (
//                 classDetails.students.map(student => <li key={student.id} className="p-2 bg-background rounded-md">{student.firstName} {student.lastName}</li>)
//               ) : <p className="italic text-text-subtle text-center py-4">Aucun élève inscrit.</p>}
//             </ul>
//           </div>
//         </div>
//       </div>
      
//       {isModalOpen && selectedSession && (
//         <AttendanceModal 
//           session={selectedSession.session}
//           date={selectedSession.date}
//           students={classDetails.students}
//           onClose={() => setIsModalOpen(false)}
//           onSuccess={() => {
//             fetchClassDetails();
//             setIsModalOpen(false);
//           }}
//         />
//       )}
//       <style jsx>{`
//         .btn-primary { display: flex; align-items: center; gap: 0.5rem; background-color: #2563eb; color: white; padding: 0.25rem 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 600; transition: background-color 0.2s; }
//         .btn-primary:hover { background-color: #1d4ed8; }
//         .btn-secondary { display: flex; align-items: center; gap: 0.5rem; background-color: transparent; border: 1px solid #9ca3af; color: #4b5563; padding: 0.25rem 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 600; transition: background-color 0.2s; }
//         .dark .btn-secondary { color: #9ca3af; border-color: #4b5563; }
//         .btn-secondary:hover { background-color: #f3f4f6; }
//         .dark .btn-secondary:hover { background-color: #374151; }
//       `}</style>
//     </div>
//   );
// };

// export default ClassDetailPageForTeacher;




"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { Users, Calendar, CheckSquare, UserX, ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react';
import { getMyClassDetails } from '@/services/api'; 
import AttendanceModal from '@/components/AttendanceModal';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/fr';

dayjs.extend(isBetween);
dayjs.locale('fr');

// --- TYPES MIS À JOUR ---
interface Student { id: string; firstName: string; lastName: string; }
interface Teacher { id: string; firstName: string; lastName: string; }
interface AttendanceRecord { status: string; student: Student; date: string; }
interface Session { 
  id: string; 
  subject: string; 
  dayOfWeek: string; 
  startTime: string; 
  endTime: string; 
  teacher: Teacher;
  // La clé peut ne pas exister si aucune présence n'a jamais été enregistrée
  attendanceRecords?: AttendanceRecord[]; 
}
interface ClassDetails { name: string; students: Student[]; schedule: { sessions: Session[] } | null; }
interface DecodedToken { userId: string; }

// --- COMPOSANT INTELLIGENT POUR UNE SESSION ---
const SessionItem: React.FC<{ session: Session; day: dayjs.Dayjs; currentUserId: string; onOpenModal: (session: Session, day: dayjs.Dayjs) => void; }> = ({ session, day, currentUserId, onOpenModal }) => {
  const now = dayjs();
  
  const startDateTime = day.hour(parseInt(session.startTime.split(':')[0])).minute(parseInt(session.startTime.split(':')[1]));
  const endDateTime = day.hour(parseInt(session.endTime.split(':')[0])).minute(parseInt(session.endTime.split(':')[1]));
  
  const isPast = now.isAfter(endDateTime);
  const isCurrent = now.isBetween(startDateTime, endDateTime);
  const isMyCourse = session.teacher.id === currentUserId;

  const isHighlighted = isMyCourse && isCurrent;

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-background rounded-md mt-1 border ${isHighlighted ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800/50' : 'border-gray-200 dark:border-gray-700'}`}>
      <div className="mb-2 sm:mb-0">
        <p className="font-semibold">{session.subject}</p>
        <p className="text-sm text-text-secondary">{session.startTime}-{session.endTime} (Prof: {session.teacher.firstName.charAt(0)}. {session.teacher.lastName})</p>
      </div>
      
      {isMyCourse && (isCurrent || isPast) && (
        <div className="flex items-center space-x-2 self-end sm:self-center">
          <button onClick={() => onOpenModal(session, day)} className="btn-primary">
            <CheckSquare className="h-4 w-4"/>
            <span>Présences</span>
          </button>
          {isPast && (
             <Link href={`/session-summary/${session.id}`} className="btn-secondary">
                <ClipboardList className="h-4 w-4"/>
                <span>Bilan</span>
             </Link>
          )}
        </div>
      )}
    </div>
  );
};


// --- COMPOSANT PRINCIPAL DE LA PAGE ---
const ClassDetailPageForTeacher = () => {
  const params = useParams();
  const classId = params.id as string;
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<{session: Session, date: string} | null>(null);
  const [currentDate, setCurrentDate] = useState(dayjs());

  const dayOrder = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

  const fetchClassDetails = useCallback(async () => {
    const token = Cookies.get('token');
    if (!token || !classId) {
      setError("Authentification invalide."); setLoading(false); return;
    }
    try {
      const response = await getMyClassDetails(classId, token);
      setClassDetails(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Impossible de charger les détails.");
    } finally {
      // On s'assure de ne mettre le loading à false qu'une seule fois
      if (loading) setLoading(false);
    }
  }, [classId, loading]); // `loading` est ajouté pour éviter un re-fetch inutile si loading est déjà false

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
        try {
            const decoded: DecodedToken = jwtDecode(token);
            setCurrentUserId(decoded.userId);
        } catch (e) { console.error("Token invalide"); }
    }
    fetchClassDetails();
  }, [fetchClassDetails]);
  
  const recentAbsences = useMemo(() => {
    if (!classDetails?.schedule?.sessions) return [];

    const allAbsences: { student: Student; session: Session; date: string }[] = [];
    
    classDetails.schedule.sessions.forEach(session => {
      // --- LA CORRECTION EST ICI ---
      // On vérifie que `attendanceRecords` est bien un tableau avant de boucler dessus.
      if (session.attendanceRecords && Array.isArray(session.attendanceRecords)) {
        session.attendanceRecords.forEach(record => {
          if (record.status === 'ABSENT') {
            allAbsences.push({ student: record.student, session, date: record.date });
          }
        });
      }
    });

    // On trie par date la plus récente
    allAbsences.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));

    return allAbsences.slice(0, 10);
  }, [classDetails]);

  const openAttendanceModal = (session: Session, date: dayjs.Dayjs) => {
    setSelectedSession({ session, date: date.format('YYYY-MM-DD') });
    setIsModalOpen(true);
  };
  
  const startOfWeek = currentDate.startOf('week');
  const endOfWeek = currentDate.endOf('week');
  const weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));

  if (loading) return <p className="text-center p-8">Chargement des détails de la classe...</p>;
  if (error) return <p className="text-red-500 text-center p-4">{error}</p>;
  if (!classDetails) return <p className="text-center p-8">Aucun détail trouvé pour cette classe.</p>;

  return (
    <div>
      <Link href="/my-classes" className="text-sm text-blue-500 hover:underline mb-4 inline-block">&larr; Retour à mes classes</Link>
      <h1 className="text-3xl font-bold mb-6">{classDetails.name}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
              <h2 className="text-xl font-bold flex items-center"><Calendar className="mr-2"/>Emploi du Temps</h2>
              <div className="flex items-center space-x-2">
                <button onClick={() => setCurrentDate(c => c.subtract(1, 'week'))} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronLeft /></button>
                <span className="font-semibold text-sm w-48 text-center">{startOfWeek.format('D MMM')} - {endOfWeek.format('D MMM YYYY')}</span>
                <button onClick={() => setCurrentDate(c => c.add(1, 'week'))} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronRight /></button>
              </div>
            </div>
            <div className="space-y-4">
              {weekDays.map(day => {
                const dayIndex = day.day();
                const dayKey = dayOrder[dayIndex];
                const sessionsForDay = classDetails.schedule?.sessions.filter(s => s.dayOfWeek.toUpperCase() === dayKey).sort((a, b) => a.startTime.localeCompare(b.startTime)) || [];
                const isToday = day.isSame(dayjs(), 'day');
                return (
                  <div key={day.toString()} className={isToday ? 'bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg' : ''}>
                    <h3 className={`font-semibold text-sm ${isToday ? 'text-blue-600 dark:text-blue-300' : 'text-text-secondary'}`}>{day.format('dddd D')}</h3>
                    {sessionsForDay.length > 0 ? (
                      sessionsForDay.map(session => (
                        <SessionItem 
                          key={session.id}
                          session={session} 
                          day={day} 
                          currentUserId={currentUserId!}
                          onOpenModal={openAttendanceModal} 
                        />
                      ))
                    ) : <p className="text-xs italic text-text-subtle pt-2 pl-1">Aucun cours</p>}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-surface p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold flex items-center mb-4"><UserX className="mr-2 text-red-500"/>Absences Récentes</h2>
            {recentAbsences.length > 0 ? (
              <ul className="space-y-2">
                {recentAbsences.map((absence, index) => (
                  <li key={index} className="p-2 bg-background rounded-md text-sm">
                    <span className="font-semibold">{absence.student.firstName} {absence.student.lastName}</span>
                    <span className="text-text-secondary"> était absent(e) au cours de </span>
                    <span className="font-semibold">{absence.session.subject}</span>
                    <span className="text-text-secondary"> ({dayjs(absence.date).format('dddd D MMM')}).</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="italic text-text-subtle text-center py-4">Aucune absence enregistrée récemment.</p>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-surface p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold flex items-center mb-4"><Users className="mr-2"/>Liste des Élèves ({classDetails.students.length})</h2>
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {classDetails.students.length > 0 ? (
                classDetails.students.map(student => <li key={student.id} className="p-2 bg-background rounded-md">{student.firstName} {student.lastName}</li>)
              ) : <p className="italic text-text-subtle text-center py-4">Aucun élève inscrit.</p>}
            </ul>
          </div>
        </div>
      </div>
      
      {isModalOpen && selectedSession && (
        <AttendanceModal 
          session={selectedSession.session}
          date={selectedSession.date}
          students={classDetails.students}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            fetchClassDetails();
            setIsModalOpen(false);
          }}
        />
      )}
      <style jsx>{`
        .btn-primary { display: flex; align-items: center; gap: 0.5rem; background-color: #2563eb; color: white; padding: 0.25rem 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 600; transition: background-color 0.2s; }
        .btn-primary:hover { background-color: #1d4ed8; }
        .btn-secondary { display: flex; align-items: center; gap: 0.5rem; background-color: transparent; border: 1px solid #9ca3af; color: #4b5563; padding: 0.25rem 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 600; transition: background-color 0.2s; }
        .dark .btn-secondary { color: #9ca3af; border-color: #4b5563; }
        .btn-secondary:hover { background-color: #f3f4f6; }
        .dark .btn-secondary:hover { background-color: #374151; }
      `}</style>
    </div>
  );
};

export default ClassDetailPageForTeacher;