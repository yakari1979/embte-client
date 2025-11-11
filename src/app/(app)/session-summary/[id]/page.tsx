"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { getSessionSummary } from '@/services/api';
import { BookOpen, Calendar, Clock, UserCheck, UserX, Paperclip } from 'lucide-react';

// --- TYPES ---
interface Student { id: string; firstName: string; lastName: string; }
interface AttendanceRecord { status: string; student: Student; }
interface Resource { id: string; name: string; url: string; }
interface SessionSummary {
  subject: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  schedule: { class: { name: string } };
  resources: Resource[];
  attendanceRecords: AttendanceRecord[];
}

const SessionSummaryPage = () => {
  const params = useParams();
  const sessionId = params.id as string;
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const token = Cookies.get('token');
      if (!token || !sessionId) return;
      try {
        const response = await getSessionSummary(sessionId, token);
        setSummary(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Impossible de charger le bilan.");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [sessionId]);

  const presentStudents = summary?.attendanceRecords.filter(r => r.status === 'PRESENT').map(r => r.student) || [];
  const absentStudents = summary?.attendanceRecords.filter(r => r.status === 'ABSENT').map(r => r.student) || [];

  if (loading) return <p className="text-center p-8">Chargement du bilan...</p>;
  if (error) return <p className="text-red-500 text-center p-4 bg-red-100 rounded-lg">{error}</p>;
  if (!summary) return <p className="text-center p-8">Aucun bilan trouvé pour cette session.</p>;

  return (
    <div>
      <Link href="/dashboard" className="text-sm text-blue-500 hover:underline mb-6 inline-block">&larr; Retour au tableau de bord</Link>
      
      {/* --- EN-TÊTE --- */}
      <div className="bg-surface p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl font-bold text-text-primary flex items-center">
          <BookOpen className="h-8 w-8 mr-3 text-blue-500" />
          Bilan du cours : {summary.subject}
        </h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-text-secondary mt-2">
          <span className="flex items-center"><Calendar className="h-4 w-4 mr-2" />{summary.schedule.class.name}</span>
          <span className="flex items-center"><Clock className="h-4 w-4 mr-2" />{summary.dayOfWeek}, {summary.startTime} - {summary.endTime}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* --- COLONNE PRINCIPALE : PRÉSENCES --- */}
        <div className="md:col-span-2 space-y-8">
          {/* Présents */}
          <div className="bg-surface p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold flex items-center text-green-600 dark:text-green-400 mb-4">
              <UserCheck className="h-6 w-6 mr-2" />
              Élèves Présents ({presentStudents.length})
            </h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {presentStudents.map(student => (
                <li key={student.id} className="text-sm p-2 bg-background rounded-md">{student.firstName} {student.lastName}</li>
              ))}
            </ul>
          </div>
          
          {/* Absents */}
          <div className="bg-surface p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold flex items-center text-red-600 dark:text-red-400 mb-4">
              <UserX className="h-6 w-6 mr-2" />
              Élèves Absents ({absentStudents.length})
            </h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {absentStudents.map(student => (
                <li key={student.id} className="text-sm p-2 bg-red-100 dark:bg-red-900/50 rounded-md font-semibold">{student.firstName} {student.lastName}</li>
              ))}
            </ul>
             {absentStudents.length === 0 && presentStudents.length > 0 && <p className="italic text-text-subtle">Félicitations, tous les élèves étaient présents !</p>}
          </div>
        </div>

        {/* --- COLONNE LATÉRALE : RESSOURCES --- */}
        <div className="md:col-span-1">
          <div className="bg-surface p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold flex items-center mb-4">
              <Paperclip className="h-6 w-6 mr-2" />
              Ressources
            </h2>
            <ul className="space-y-3">
              {summary.resources.length > 0 ? (
                summary.resources.map(resource => (
                  <li key={resource.id}>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block p-3 bg-background rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      <p className="font-semibold text-blue-600 dark:text-blue-400">{resource.name}</p>
                      <p className="text-xs text-text-subtle truncate">{resource.url}</p>
                    </a>
                  </li>
                ))
              ) : (
                <p className="italic text-text-subtle">Aucune ressource n'a été partagée pour ce cours.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionSummaryPage;