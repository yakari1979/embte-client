"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { getMyClasses, getGradingDataForClass, GradingData } from '@/services/api';
import { Loader2, AlertCircle } from 'lucide-react';
import GradingTable from '@/components/GradingTable'; 

interface ClassSummary {
  id: string;
  name: string;
}

const GradesManagementPage = () => {
  // --- États pour la gestion de la page ---
  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [gradingData, setGradingData] = useState<GradingData | null>(null);
  
  // États pour le chargement et les erreurs
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isLoadingGrades, setIsLoadingGrades] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const token = Cookies.get('token');

  // --- Effet pour charger les classes du professeur au montage ---
  useEffect(() => {
    if (!token) return;
    const fetchClasses = async () => {
      try {
        const response = await getMyClasses(token);
        setClasses(response.data);
      } catch (err) {
        setError("Impossible de charger vos classes.");
      } finally {
        setIsLoadingClasses(false);
      }
    };
    fetchClasses();
  }, [token]);

  // --- On extrait la logique de fetch dans une fonction réutilisable avec useCallback ---
  const fetchGradingData = useCallback(async () => {
    // Ne rien faire si aucune classe n'est sélectionnée ou si le token manque
    if (!selectedClassId || !token) {
        setGradingData(null); // S'assurer que les anciennes données sont effacées
        return;
    }

    setIsLoadingGrades(true);
    setError(null);
    try {
      const response = await getGradingDataForClass(selectedClassId, token);
      setGradingData(response.data);
    } catch (err) {
      setError("Impossible de charger les données de notation pour cette classe.");
      setGradingData(null);
    } finally {
      setIsLoadingGrades(false);
    }
  }, [selectedClassId, token]); // Les dépendances de la fonction

  // --- Effet pour charger les données de notation quand une classe est sélectionnée ---
  // Il appelle la fonction définie ci-dessus.
  useEffect(() => {
    fetchGradingData();
  }, [fetchGradingData]); // La seule dépendance est la fonction elle-même

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Suivi Pédagogique & Notes</h1>

      {/* --- Section 1: Sélecteur de Classe --- */}
      <div className="mb-8 max-w-md">
        <label htmlFor="class-select" className="block text-sm font-medium text-text-secondary mb-2">
          Sélectionnez une classe pour commencer :
        </label>
        {isLoadingClasses ? <Loader2 className="animate-spin" /> : (
          <select
            id="class-select"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="input-field"
          >
            <option value=""> Choisir une classe </option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* --- Section 2: Affichage des Données --- */}
      <div>
        {isLoadingGrades && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="ml-4">Chargement des notes...</p>
          </div>
        )}

        {error && !isLoadingGrades && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold mr-2"><AlertCircle size={20} className="inline"/> Erreur:</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* On affiche le tableau seulement si on a des données et qu'on ne charge pas */}
        {gradingData && !isLoadingGrades && (
          <GradingTable 
            data={gradingData} 
            classId={selectedClassId}
            onDataChange={fetchGradingData} // On passe la fonction pour permettre le rafraîchissement
          />
        )}

        {/* Message si aucune classe n'est sélectionnée */}
        {!selectedClassId && !isLoadingClasses && (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                <p className="text-text-secondary">Veuillez sélectionner une classe pour afficher les tableaux de notes.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default GradesManagementPage;