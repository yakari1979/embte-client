"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { listUsers, assignStudentToClass, assignTeacherToClass } from '@/services/api'; // On importe nos fonctions API
import { User, School, Calendar, Users, UserPlus } from 'lucide-react';
import ScheduleManager from '@/components/ScheduleManager'; // <-- 1. IMPORTER LE NOUVEAU COMPOSANT

// --- Définition des types pour les données ---
interface Student { id: string; firstName: string; lastName: string; }
interface Teacher { id: string; firstName: string; lastName: string; }
interface ClassDetails {
  id: string;
  name: string;
  students: Student[];
  teachers: Teacher[];
  schedule: any | null; // On le laisse en 'any' pour l'instant
}
interface AllUsers { id: string; firstName: string; lastName: string; role: string; }

// --- La Page Principale ---
const ClassDetailPage = () => {
  const params = useParams();
  const classId = params.id as string;
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [allUsers, setAllUsers] = useState<AllUsers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // On utilise useCallback pour mémoriser la fonction et éviter les re-render inutiles
  const fetchClassData = useCallback(async () => {
    const token = Cookies.get('token');
    if (!token || !classId) return;

    setLoading(true);
    try {
      // On utilise une route API spécifique pour les détails de la classe (à créer)
      // Pour l'instant, on simule en filtrant la liste complète
      const classResponse = await fetch(`http://localhost:3001/api/establishment/classes/${classId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      if(!classResponse.ok) throw new Error("Classe non trouvée ou accès refusé.");
      const classData = await classResponse.json();
      
      const usersResponse = await listUsers(token);

      setClassDetails(classData);
      setAllUsers(usersResponse.data);
    } catch (err) {
      setError("Impossible de charger les détails de la classe.");
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchClassData();
  }, [fetchClassData]);

  if (loading) return <p className="text-center">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!classDetails) return <p className="text-center">Aucune donnée pour cette classe.</p>;

  // Filtrer les utilisateurs pour les formulaires d'assignation
  const unassignedStudents = allUsers.filter(u => u.role === 'STUDENT' && !classDetails.students.some(s => s.id === u.id));
  const unassignedTeachers = allUsers.filter(u => u.role === 'TEACHER' && !classDetails.teachers.some(t => t.id === u.id));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">{classDetails.name}</h1>
          <p className="text-text-secondary">Gestion détaillée de la classe</p>
        </div>
        <Link href="/classes" className="text-sm text-blue-500 hover:underline">&larr; Retour à la liste des classes</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Colonne de gauche : Élèves et Professeurs --- */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section Élèves */}
          <SectionCard title="Élèves Inscrits" icon={<Users className="h-6 w-6 text-purple-500" />}>
            <UserList users={classDetails.students} />
            <AssignForm
              users={unassignedStudents}
              classId={classId}
              assignFunction={assignStudentToClass}
              onSuccess={fetchClassData}
              entityName="studentId"
              buttonText="Assigner l'élève"
            />
          </SectionCard>

          {/* Section Professeurs */}
          <SectionCard title="Professeurs Assignés" icon={<User className="h-6 w-6 text-green-500" />}>
            <UserList users={classDetails.teachers} />
            <AssignForm
              users={unassignedTeachers}
              classId={classId}
              assignFunction={assignTeacherToClass}
              onSuccess={fetchClassData}
              entityName="teacherId"
              buttonText="Assigner le professeur"
            />
          </SectionCard>
        </div>

        {/* --- Colonne de droite : Emploi du Temps --- */}
        <div className="lg:col-span-1">
        <SectionCard title="Emploi du Temps" icon={<Calendar className="h-6 w-6 text-orange-500" />}>
                        {/* --- 2. INTÉGRER LE COMPOSANT ICI --- */}
                        <ScheduleManager
                            schedule={classDetails.schedule}
                            teachers={classDetails.teachers}
                            classId={classId}
                            onSuccess={fetchClassData}
                        />
        </SectionCard>
        </div>
      </div>
    </div>
  );
};

// --- Composants Internes pour la Clarté ---

const SectionCard = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
  <div className="bg-surface p-6 rounded-lg shadow-md">
    <div className="flex items-center mb-4">
      {icon}
      <h2 className="text-xl font-bold text-text-primary ml-3">{title}</h2>
    </div>
    {children}
  </div>
);

const UserList = ({ users }: { users: (Student[] | Teacher[]) }) => (
  <ul className="space-y-2 mb-4">
    {users.length > 0 ? (
      users.map(user => (
        <li key={user.id} className="flex items-center justify-between p-2 bg-background rounded-md">
          <span>{user.firstName} {user.lastName}</span>
          {/* On pourra ajouter un bouton de désinscription ici */}
        </li>
      ))
    ) : (
      <p className="text-sm text-text-subtle italic">Aucun utilisateur pour le moment.</p>
    )}
  </ul>
);

const AssignForm = ({ users, classId, assignFunction, onSuccess, entityName, buttonText }: any) => {
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    setLoading(true);
    const token = Cookies.get('token')!;
    try {
      // La fonction d'assignation est dynamique
      await assignFunction(classId, selectedId, token);
      onSuccess(); // On rafraîchit les données de la page
      setSelectedId('');
    } catch (error) {
      console.error(`Erreur lors de l'assignation:`, error);
      alert("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <select 
        value={selectedId} 
        onChange={e => setSelectedId(e.target.value)}
        className="flex-grow w-full px-4 py-2 bg-background border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Sélectionner un utilisateur...</option>
        {users.map((user: AllUsers) => (
          <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>
        ))}
      </select>
      <button type="submit" disabled={!selectedId || loading} className="flex items-center space-x-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
        <UserPlus className="h-5 w-5" />
        <span>{loading ? '...' : buttonText}</span>
      </button>
    </form>
  );
};

export default ClassDetailPage;