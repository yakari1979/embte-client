"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { School, Users, ArrowRight } from 'lucide-react';
import { getMyClasses } from '@/services/api'; // <-- 1. ON CHANGE L'IMPORT

interface TeacherClass {
  id: string;
  name: string;
  // La nouvelle route renvoie _count au lieu d'une liste complète
  students: { _count: number };
}

const MyClassesPage = () => {
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      const token = Cookies.get('token');
      if (!token) {
        setError("Authentification requise."); setLoading(false); return;
      }
      try {
        const response = await getMyClasses(token); // <-- 2. ON APPELLE LA BONNE FONCTION
        setClasses(response.data);
      } catch (err) {
        setError("Impossible de charger vos classes.");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  if (loading) return <p>Chargement de vos classes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Mes Classes</h1>
      {classes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map(cls => (
            <Link href={`/my-classes/${cls.id}`} key={cls.id} className="block group">
              <div className="bg-surface p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                    <School className="h-6 w-6 text-blue-500" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">{cls.name}</h2>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center text-text-secondary">
                    <Users className="h-5 w-5 mr-2" />
                    {/* 3. ON MET À JOUR L'AFFICHAGE DU NOMBRE D'ÉLÈVES */}
                    <span>{cls.students._count} élèves</span>
                  </div>
                  <div className="text-blue-500 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Gérer</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>Aucune classe ne vous est assignée pour le moment.</p>
      )}
    </div>
  );
};

export default MyClassesPage;