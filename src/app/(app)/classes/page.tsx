"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { listClasses } from '@/services/api';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { PlusCircle, Eye, School, Users } from 'lucide-react';

// Le type a été légèrement ajusté pour mieux correspondre aux données
interface ClassData {
  id: string;
  name: string;
  students: { id: string }[];
  teachers: { firstName: string; lastName: string }[];
}

const ClassesListPage = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchClasses = async () => {
      const token = Cookies.get('token');
      if (!token) {
        setError("Authentification requise.");
        setLoading(false);
        return;
      }
      try {
        const response = await listClasses(token);
        setClasses(response.data);
      } catch (err) {
        setError("Impossible de charger la liste des classes.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  return (
    <div>
      {/* --- En-tête de la page --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-text-primary">Gestion des Classes</h1>
        <Link href="/classes/new" className="btn-primary w-full sm:w-auto">
          <PlusCircle className="h-5 w-5" />
          <span>Créer une Classe</span>
        </Link>
      </div>

      {/* --- Conteneur principal pour la liste/tableau --- */}
      <div className="bg-surface p-2 sm:p-6 rounded-lg shadow-md">
        {loading && <p className="text-center p-8 text-text-secondary">Chargement...</p>}
        {error && <p className="text-center text-red-500 p-8">{error}</p>}
        
        {!loading && !error && (
          <>
            {/* --- VUE CARTES POUR MOBILE (visible jusqu'à 'md') --- */}
            <div className="md:hidden">
                {classes.length > 0 ? (
                    <div className="space-y-3">
                        {classes.map(cls => (
                            <div key={cls.id} onClick={() => router.push(`/classes/${cls.id}`)} className="bg-background p-4 rounded-lg border dark:border-gray-700 flex flex-col gap-3 cursor-pointer active:bg-gray-100 dark:active:bg-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/40">
                                        <School className="h-5 w-5 text-blue-600"/>
                                    </div>
                                    <p className="font-bold text-lg">{cls.name}</p>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-text-secondary pl-1">
                                    <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-1.5"/>
                                        <span>{cls.students.length} élève(s)</span>
                                    </div>
                                </div>
                                <div className="border-t dark:border-gray-700 pt-3 mt-1">
                                    <button className="btn-secondary w-full text-sm py-1.5">
                                        <Eye className="h-4 w-4" />
                                        <span>Gérer la classe</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center py-8 text-text-secondary">Aucune classe trouvée.</p>
                )}
            </div>

            {/* --- VUE TABLEAU POUR GRAND ÉCRAN (caché jusqu'à 'md') --- */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b-2 border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-text-secondary">Nom de la Classe</th>
                    <th className="px-4 py-3 text-sm font-semibold text-text-secondary">Nombre d'élèves</th>
                    <th className="px-4 py-3 text-sm font-semibold text-text-secondary">Professeurs Assignés</th>
                    <th className="px-4 py-3 text-sm font-semibold text-text-secondary text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.length > 0 ? (
                    classes.map(cls => (
                      <tr key={cls.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer" onClick={() => router.push(`/classes/${cls.id}`)}>
                        <td className="px-4 py-3 font-medium">{cls.name}</td>
                        <td className="px-4 py-3">{cls.students.length}</td>
                        <td className="px-4 py-3 text-sm">
                        {cls.teachers && cls.teachers.length > 0 
                            ? cls.teachers.map(t => `${t.firstName} ${t.lastName}`).join(', ') 
                            : <span className="text-text-subtle italic">Aucun</span>}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="inline-flex items-center space-x-1 p-1 text-blue-500 hover:text-blue-700" title="Gérer la classe">
                            <Eye className="h-5 w-5" />
                            <span className="text-sm hidden lg:inline">Gérer</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-text-secondary">
                        Aucune classe trouvée. <Link href="/classes/new" className="text-blue-500 hover:underline">Commencez par en créer une</Link>.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClassesListPage;