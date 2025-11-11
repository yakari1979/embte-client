"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { listClasses } from '@/services/api'; // Vous avez déjà cette fonction dans votre api.ts
import Cookies from 'js-cookie';
import Link from 'next/link';
import { Search, ChevronRight, Users, Briefcase, Loader2 } from 'lucide-react';

// Le type pour une classe, basé sur la réponse de votre API
interface ClassData {
  id: string;
  name: string;
  students: { id: string }[]; // On a juste besoin du nombre
  teachers: { firstName: string; lastName: string }[];
}

// --- COMPOSANT PRINCIPAL DE LA PAGE ---
const ClassesListPage = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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
        // On trie les classes par ordre alphabétique
        const sortedClasses = response.data.sort((a: ClassData, b: ClassData) => a.name.localeCompare(b.name));
        setClasses(sortedClasses);
      } catch (err) {
        setError("Impossible de charger la liste des classes.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // On filtre les classes en fonction de la recherche (insensible à la casse)
  const filteredClasses = useMemo(() =>
    classes.filter(cls =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [classes, searchTerm]
  );

  return (
    <div>
      {/* --- En-tête de la page --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-text-primary">Gestion des Classes</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Rechercher une classe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
      </div>

      {/* --- Conteneur principal pour la liste --- */}
      <div className="bg-surface p-2 sm:p-6 rounded-lg shadow-md">
          {loading && (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
              <p className="ml-4 text-text-secondary">Chargement des classes...</p>
            </div>
          )}
          {error && <p className="text-center text-red-500 p-8">{error}</p>}
          
          {!loading && !error && (
              <>
                  {filteredClasses.length > 0 ? (
                    <div className="space-y-3">
                      {filteredClasses.map(cls => (
                        <Link href={`/gestion/${cls.id}`} key={cls.id} className="block group">
                          <div className="bg-background p-4 rounded-lg border dark:border-gray-700 flex items-center justify-between cursor-pointer transition-all duration-200 hover:border-primary hover:shadow-lg">
                            <div>
                              <p className="font-bold text-lg text-text-primary group-hover:text-primary">{cls.name}</p>
                              <div className="flex items-center gap-4 text-sm text-text-secondary mt-1">
                                <span className="flex items-center gap-1.5"><Users size={14} /> {cls.students.length} élève(s)</span>
                                <span className="flex items-center gap-1.5"><Briefcase size={14} /> {cls.teachers.length} prof(s)</span>
                              </div>
                            </div>
                            <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-primary transition-transform duration-200 group-hover:translate-x-1" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-text-secondary">
                      {classes.length === 0 ? "Aucune classe n'a été créée pour cet établissement." : "Aucune classe ne correspond à votre recherche."}
                    </p>
                  )}
              </>
          )}
      </div>
    </div>
  );
};

export default ClassesListPage;