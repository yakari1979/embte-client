"use client";

import React, { useState, useEffect } from 'react';
import { getMyStudentSchedule, getMyProfile, getMyNotifications, Notification, markNotificationAsRead } from '@/services/api';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { Clock, BookOpen, CalendarDays, Video, User, Building2, ClipboardList, Timer, Bell, X, Sparkles, ArrowRight } from 'lucide-react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';
import RecommendationWidget from '@/components/RecommendationWidget'; // Importez le nouveau
import LearningProfileWidget from '@/components/LearningProfileWidget'; // Importez le composant

// --- Configuration de Day.js ---
dayjs.extend(isBetween);
dayjs.extend(relativeTime);
dayjs.locale('fr');

// --- INTERFACES ---
interface CourseSession {
  id: string;
  subject: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  teacher: { firstName: string; lastName: string; };
}
interface ScheduleResponse {
  className: string;
  schedule?: { sessions: CourseSession[]; }
}
interface UserProfile {
  firstName: string;
  lastName: string;
  establishment: { name: string; };
}
type SessionStatus = 'past' | 'current' | 'upcoming_soon' | 'upcoming_later';

// Composant Bouton Intelligent
// const SmartQuizButton = ({ notifications }: { notifications: Notification[] }) => {
//   // On cherche la notification la plus récente qui contient un lien vers un quiz
//   const pendingQuiz = notifications.find(n => n.link && n.link.includes('/student/quiz/'));

//   // Si aucun quiz n'est trouvé, on n'affiche rien (le bouton se cache tout seul)
//   if (!pendingQuiz) return null;

  const SmartQuizButton = ({ notifications }: { notifications: Notification[] }) => {
    // On filtre pour ne prendre que les notifs NON LUES (!n.isRead)
    const pendingQuiz = notifications.find(n => 
        !n.isRead && n.link && n.link.includes('/student/quiz/')
    );
  
    if (!pendingQuiz) return null;

  return (
    <div className="mb-8 transform hover:scale-[1.01] transition-all duration-300">
      <Link href={pendingQuiz.link!} className="block group relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-1 shadow-xl">
        <span className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors" />
        <div className="relative flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full animate-pulse">
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold text-xl">Nouveau Quiz Disponible !</h3>
              <p className="text-purple-100 text-sm sm:text-base opacity-90">
                Un devoir t'attend. Clique ici pour commencer.
              </p>
            </div>
          </div>
          <div className="bg-white text-purple-700 rounded-full p-2 group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </Link>
    </div>
  );
};

// =======================================================
//   COMPOSANT DE CARTE DE COURS POUR ÉTUDIANT (ADAPTÉ)
// =======================================================
const StudentCourseCard: React.FC<{ session: CourseSession; now: dayjs.Dayjs }> = ({ session, now }) => {
  const todayStr = now.format('YYYY-MM-DD');
  const start = dayjs(`${todayStr} ${session.startTime}`);
  const end = dayjs(`${todayStr} ${session.endTime}`);

  const getSessionStatus = (): SessionStatus => {
    if (now.isAfter(end)) return 'past';
    if (now.isBetween(start.subtract(5, 'minute'), end)) return 'current'; // Permet de rejoindre 5min avant
    if (start.diff(now, 'minute') <= 60 && start.isAfter(now)) return 'upcoming_soon';
    return 'upcoming_later';
  };

  const status = getSessionStatus();
  
  const statusInfo = {
    past: {
      borderColor: 'border-gray-300 dark:border-gray-600 opacity-70',
      button: <Link href={`/session-summary/${session.id}`} className="btn-secondary w-full"><ClipboardList className="h-4 w-4" /> Voir le Bilan</Link>,
      tag: <span className="tag-past">Terminé</span>
    },
    current: {
      borderColor: 'border-green-500',
      button: <Link href={`/class-session/${session.id}`} className="btn-live w-full"><Video className="h-5 w-5" /> Rejoindre le Cours</Link>,
      tag: <span className="tag-live">En direct</span>
    },
    upcoming_soon: {
      borderColor: 'border-blue-500',
      button: <Link href={`/class-session/${session.id}`} className="btn-primary w-full"><Timer className="h-5 w-5" /> Rejoindre Bientôt</Link>,
      tag: <span className="tag-soon">{start.fromNow(true)}</span>
    },
    upcoming_later: {
      borderColor: 'border-transparent',
      button: <button disabled className="btn-disabled w-full">À venir</button>,
      tag: null
    },
  };

  return (
    <div className={`bg-surface p-4 rounded-lg shadow-md border-l-4 flex flex-col justify-between ${statusInfo[status].borderColor}`}>
      <div>
        <div className="flex justify-between items-start">
            <p className="text-xl font-bold text-primary">{session.subject}</p>
            {statusInfo[status].tag}
        </div>
        <p className="text-md text-text-secondary flex items-center mt-1">
          <User className="h-4 w-4 mr-2" /> {`avec ${session.teacher.firstName} ${session.teacher.lastName}`}
        </p>
        <div className="flex items-center text-sm text-text-subtle mt-2">
          <Clock className="h-4 w-4 mr-2" />
          <span>{session.startTime} - {session.endTime}</span>
        </div>
      </div>
      <div className="mt-4">
        {statusInfo[status].button}
      </div>
    </div>
  );
};


// =======================================================
//   LE COMPOSANT PRINCIPAL DU TABLEAU DE BORD
// =======================================================
const StudentDashboard = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleResponse | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todaysCourses, setTodaysCourses] = useState<CourseSession[]>([]);
  // --- 2. Ajouter un état pour les notifications ---
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(dayjs());

  const dayMap: { [key: string]: number } = { SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, THURSDAY: 4, FRIDAY: 5, SATURDAY: 6 };
  const dayTranslations: Record<string, string> = { MONDAY: "Lundi", TUESDAY: "Mardi", WEDNESDAY: "Mercredi", THURSDAY: "Jeudi", FRIDAY: "Vendredi", SATURDAY: "Samedi", SUNDAY: "Dimanche" };

  useEffect(() => {
    // Rafraîchit l'heure toutes les minutes pour mettre à jour les statuts
    const interval = setInterval(() => setNow(dayjs()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get('token');
      if (!token) { setError("Authentification requise."); setLoading(false); return; }
      try {
        const [profileRes, scheduleRes, notificationsRes] = await Promise.all([ getMyProfile(token), getMyStudentSchedule(token), getMyNotifications(token) ]);
        const allSessions = scheduleRes.data.schedule?.sessions || [];
        setProfile(profileRes.data);
        setScheduleData(scheduleRes.data);
        const todayIndex = dayjs().day();
        const todaySessions = allSessions
          .filter((session: CourseSession) => dayMap[session.dayOfWeek.toUpperCase()] === todayIndex)
          .sort((a: CourseSession, b: CourseSession) => a.startTime.localeCompare(b.startTime));
        setTodaysCourses(todaySessions);
        // --- 4. Mettre à jour l'état des notifications ---
        setNotifications(notificationsRes.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Impossible de charger vos informations.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  // --- 3. Créer la fonction pour fermer une notification ---
  const handleDismissNotification = async (notificationId: string) => {
    const token = Cookies.get('token');
    if (!token) return;

    // Mise à jour optimiste : on retire la notif de l'UI immédiatement
    setNotifications(currentNotifications =>
      currentNotifications.filter(notif => notif.id !== notificationId)
    );

    // On envoie la requête au backend en arrière-plan
    try {
      await markNotificationAsRead(notificationId, token);
    } catch (error) {
      console.error("Impossible de marquer la notification comme lue:", error);
      // Optionnel : si l'API échoue, on pourrait remettre la notif dans la liste
    }
  };


  if (loading) return <div className="text-center p-8"><p>Chargement de votre tableau de bord...</p></div>;
  if (error) return <div className="text-center p-4 bg-red-100 text-red-600 rounded-lg">{error}</div>;

  return (
    <div className="space-y-8">
      {/* --- EN-TÊTE DE BIENVENUE --- */}
      <div className="bg-surface p-6 rounded-lg shadow-md">
        {profile && (
            <>
                <h1 className="text-3xl font-bold text-text-primary">Bienvenue, {profile.firstName}</h1>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center text-text-secondary gap-x-6 gap-y-1">
                    {scheduleData?.className && <p className="text-md">Classe de <span className="font-semibold text-primary">{scheduleData.className}</span></p>}
                    <div className="flex items-center text-md"><Building2 className="h-4 w-4 mr-2" /><span>{profile.establishment.name}</span></div>
                </div>
            </>
        )}
      </div>

      {/* 🔥 INSERTION DU BOUTON INTELLIGENT ICI 🔥 */}
      <SmartQuizButton notifications={notifications} />

       {/* --- AJOUTEZ LE NOUVEAU WIDGET DE RECOMMANDATION ICI --- */}
       <RecommendationWidget />

      {/* --- NOUVELLE SECTION : NOTIFICATIONS --- */}
     {/* --- SECTION NOTIFICATIONS (MAINTENANT AVEC BOUTON FERMER) --- */}
     {notifications.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Notifications Récentes</h2>
            <div className="bg-surface p-4 rounded-lg shadow-md space-y-3">
                {notifications.map(notif => (
                    <div key={notif.id} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md relative group">
                        <Bell className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0"/>
                        <div className="pr-6">
                            <p className="font-semibold text-text-primary">Nouvelle mise à jour de vos notes !</p>
                            <p className="text-sm text-text-secondary">
                                {notif.message} 
                                {notif.link && <Link href={notif.link} className="font-bold text-blue-500 hover:underline ml-1">Consulter.</Link>}
                            </p>
                            <p className="text-xs text-text-subtle mt-1">{dayjs(notif.createdAt).fromNow()}</p>
                        </div>
                        {/* --- 4. Le bouton pour fermer --- */}
                        <button
                          onClick={() => handleDismissNotification(notif.id)}
                          className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Fermer la notification"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
          </div>
      )}

      {/* --- AJOUTEZ LE NOUVEAU WIDGET ICI --- */}
      <LearningProfileWidget />
      
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* --- COURS DU JOUR (colonne principale) --- */}
        <div className="lg:col-span-2 space-y-4"> 
          <h2 className="text-2xl font-bold text-text-primary">Cours d'aujourd'hui ({now.format('dddd D MMMM')})</h2>
          {todaysCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {todaysCourses.map((session: CourseSession) => <StudentCourseCard key={session.id} session={session} now={now} />)}
            </div>
          ) : (
            <div className="text-center py-12 px-6 bg-surface rounded-lg">
              <CalendarDays className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-text-secondary">Aucun cours programmé pour aujourd'hui.</p>
            </div>
          )}
        </div>

        {/* --- EMPLOI DU TEMPS DE LA SEMAINE (colonne latérale) --- */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-2xl font-bold text-text-primary">Reste de la semaine</h2>
          <div className="bg-surface p-4 rounded-lg shadow-md">
            {scheduleData?.schedule && scheduleData.schedule.sessions.length > 0 ? (
              <div className="space-y-4">
                {Object.entries(scheduleData.schedule.sessions.reduce((acc: Record<string, CourseSession[]>, s: CourseSession) => { (acc[s.dayOfWeek] = acc[s.dayOfWeek] || []).push(s); return acc; }, {}))
                .sort(([dayA], [dayB]) => dayOrder.indexOf(dayA) - dayOrder.indexOf(dayB))
                .map(([day, sessions]) => (
                  <div key={day}>
                      <h3 className="font-semibold text-text-secondary">{dayTranslations[day]}</h3>
                      <ul className="mt-2 space-y-2">
                          {sessions.sort((a,b) => a.startTime.localeCompare(b.startTime)).map((session) => (
                               <li key={session.id} className="p-3 bg-background rounded-md border text-sm">
                                  <p className="font-semibold flex items-center"><BookOpen className="h-4 w-4 mr-2" />{session.subject}</p>
                                  <p className="text-text-secondary flex items-center mt-1"><User className="h-4 w-4 mr-2" />{`${session.teacher.firstName} ${session.teacher.lastName}`}</p>
                                  <p className="text-text-subtle flex items-center mt-1"><Clock className="h-4 w-4 mr-2" />{`${session.startTime} - ${session.endTime}`}</p>
                               </li>
                          ))}
                      </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-text-subtle italic py-8">L'emploi du temps n'a pas été défini.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};



export default StudentDashboard;

// Helper pour le tri
const dayOrder = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];