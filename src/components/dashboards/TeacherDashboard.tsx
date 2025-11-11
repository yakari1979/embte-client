"use client";

import React, { useState, useEffect } from 'react';
import { getMyTeacherSchedule, getMyProfile } from '@/services/api';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { Clock, BookOpen, CalendarDays, Video, Building2, ClipboardList, Timer } from 'lucide-react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';

dayjs.extend(isBetween);
dayjs.extend(relativeTime);
dayjs.locale('fr');

// --- TYPES & INTERFACES (Corrigé) ---
interface TeachingSession {
  id: string;
  subject: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  className: string;
}
interface UserProfile {
  firstName: string;
  lastName: string;
  establishment: { name: string };
}
type SessionStatus = 'past' | 'current' | 'upcoming_soon' | 'upcoming_later';

// --- COMPOSANT DE CARTE DE COURS ---
const CourseCard: React.FC<{ session: TeachingSession; now: dayjs.Dayjs }> = ({ session, now }) => {
  const todayStr = now.format('YYYY-MM-DD');
  const start = dayjs(`${todayStr} ${session.startTime}`);
  const end = dayjs(`${todayStr} ${session.endTime}`);

  const getSessionStatus = (): SessionStatus => {
    if (now.isAfter(end)) return 'past';
    if (now.isBetween(start, end)) return 'current';
    if (start.diff(now, 'minute') <= 60 && start.isAfter(now)) return 'upcoming_soon';
    return 'upcoming_later';
  };

  const status = getSessionStatus();
  
  const statusInfo = {
    past: {
      borderColor: 'border-gray-300 dark:border-gray-600',
      button: <Link href={`/session-summary/${session.id}`} className="btn-secondary"><ClipboardList className="h-4 w-4" /> Voir le Bilan</Link>,
      tag: null
    },
    current: {
      borderColor: 'border-green-500',
      button: <Link href={`/class-session/${session.id}`} className="btn-live"><Video className="h-5 w-5" /> Rejoindre (En Cours)</Link>,
      tag: <span className="tag-live">En direct</span>
    },
    upcoming_soon: {
      borderColor: 'border-blue-500',
      button: <Link href={`/class-session/${session.id}`} className="btn-primary"><Timer className="h-5 w-5" /> Rejoindre Bientôt</Link>,
      tag: <span className="tag-soon">{start.fromNow(true)}</span>
    },
    upcoming_later: {
      borderColor: 'border-transparent',
      button: null,
      tag: null
    },
  };

  return (
    <div className={`bg-surface p-4 rounded-lg shadow-md border-l-4 ${statusInfo[status].borderColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-text-primary">{session.subject}</p>
          <p className="text-sm text-text-secondary">{session.className}</p>
        </div>
        {statusInfo[status].tag}
      </div>
      <div className="flex items-center text-sm text-text-subtle mt-2">
        <Clock className="h-4 w-4 mr-2" />
        <span>{session.startTime} - {session.endTime}</span>
      </div>
      <div className="mt-4">
        {statusInfo[status].button}
      </div>
    </div>
  );
};


// --- COMPOSANT PRINCIPAL ---
const TeacherDashboard = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todaysSessions, setTodaysSessions] = useState<TeachingSession[]>([]);
  const [otherSessions, setOtherSessions] = useState<Record<string, TeachingSession[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(dayjs());

  const dayOrder = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  const dayTranslations: Record<string, string> = { MONDAY: "Lundi", TUESDAY: "Mardi", WEDNESDAY: "Mercredi", THURSDAY: "Jeudi", FRIDAY: "Vendredi", SATURDAY: "Samedi", SUNDAY: "Dimanche" };

  useEffect(() => {
    const interval = setInterval(() => setNow(dayjs()), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) throw new Error("Authentification requise.");
        
        const [profileRes, scheduleRes] = await Promise.all([ getMyProfile(token), getMyTeacherSchedule(token) ]);

        setProfile(profileRes.data);
        
        const allSessions: TeachingSession[] = scheduleRes.data;
        const todayKey = dayOrder[dayjs().day() === 0 ? 6 : dayjs().day() - 1];
        
        const today = allSessions.filter(s => s.dayOfWeek.toUpperCase() === todayKey).sort((a, b) => a.startTime.localeCompare(b.startTime));
        const others = allSessions.filter(s => s.dayOfWeek.toUpperCase() !== todayKey).reduce((acc, session) => {
            (acc[session.dayOfWeek] = acc[session.dayOfWeek] || []).push(session);
            return acc;
          }, {} as Record<string, TeachingSession[]>);
        
        setTodaysSessions(today);
        setOtherSessions(others);
      } catch (err: any) {
        setError(err.message || "Impossible de charger vos informations.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center p-8"><p>Chargement de votre tableau de bord...</p></div>;
  if (error) return <div className="text-center p-4 bg-red-100 text-red-600 rounded-lg">{error}</div>;

  return (
    <div className="space-y-8">
      {/* --- EN-TÊTE AMÉLIORÉ --- */}
      <div className="bg-surface p-6 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Tableau de Bord</h1>
          {profile && (
            <p className="text-lg text-text-secondary">
              Bienvenue, {profile.firstName} {profile.lastName}
            </p>
          )}
        </div>
        {profile && (
          <div className="flex items-center gap-3 bg-background p-3 rounded-md text-sm text-text-secondary border border-gray-200 dark:border-gray-700">
            <Building2 className="h-5 w-5 text-text-subtle" />
            <span className="font-semibold">{profile.establishment.name}</span>
          </div>
        )}
      </div>

      {/* --- STRUCTURE EN 2 COLONNES --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Aujourd'hui ({now.format('dddd D MMMM')})</h2>
            {todaysSessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {todaysSessions.map(session => <CourseCard key={session.id} session={session} now={now} />)}
              </div>
            ) : (
              <div className="text-center py-12 px-6 bg-surface rounded-lg">
                <CalendarDays className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-text-secondary">Aucun cours programmé aujourd'hui.</p>
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-1 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Reste de la semaine</h2>
            <div className="bg-surface p-4 rounded-lg shadow-md space-y-4">
              {Object.keys(otherSessions).length > 0 ? (
                dayOrder.map(day => (
                  otherSessions[day] && (
                    <div key={day}>
                      <h3 className="text-md font-semibold text-text-secondary border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
                        {dayTranslations[day]}
                      </h3>
                      <div className="space-y-2">
                        {otherSessions[day].map(session => (
                          <div key={session.id} className="text-sm p-2 bg-background rounded-md">
                            <p className="font-bold text-text-primary">{session.subject}</p>
                            <p className="text-text-secondary">{session.className} - {session.startTime}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))
              ) : (
                <p className="italic text-text-subtle text-center py-4">Aucun autre cours cette semaine.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* --- Plus besoin de style jsx, on utilise des classes Tailwind globales --- */}
    </div>
  );
};

export default TeacherDashboard;