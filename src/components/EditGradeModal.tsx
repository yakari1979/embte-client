"use client";

import React, { useState, useEffect } from 'react';
import { Student, Evaluation, Grade, Appreciation, upsertGrade } from '@/services/api';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';

interface EditGradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGradeSaved: () => void;
  student: Student | null;
  evaluation: Evaluation | null;
  currentGrade: Grade | null | undefined;
}

// La liste des appréciations disponibles, tirée de notre schéma Prisma
const appreciationOptions: Appreciation[] = ["EXCELLENT", "TRES_BIEN", "BIEN", "PASSABLE", "INSUFFISANT", "ACQUERIR", "NON_NOTE"];

const EditGradeModal: React.FC<EditGradeModalProps> = ({ isOpen, onClose, onGradeSaved, student, evaluation, currentGrade }) => {
  const [score, setScore] = useState<string>('');
  const [appreciation, setAppreciation] = useState<Appreciation>('NON_NOTE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pré-remplir le formulaire quand le modal s'ouvre
  useEffect(() => {
    if (currentGrade) {
      setScore(currentGrade.score !== null ? String(currentGrade.score) : '');
      setAppreciation(currentGrade.appreciation);
    } else {
      setScore('');
      setAppreciation('NON_NOTE');
    }
  }, [currentGrade, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !evaluation) return;

    const token = Cookies.get('token');
    if (!token) return;

    setIsSubmitting(true);
    try {
      await upsertGrade({
        studentId: student.id,
        evaluationId: evaluation.id,
        score: score === '' ? null : parseFloat(score),
        appreciation,
      }, token);
      onGradeSaved();
      onClose();
    } catch (err) {
      alert("Erreur lors de la sauvegarde de la note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !student || !evaluation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-1">Noter l'élève</h2>
        <p className="text-text-secondary mb-4">{student.firstName} {student.lastName.toUpperCase()} - {evaluation.title}</p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="score" className="block text-sm font-medium mb-1">Note (/20)</label>
              <input id="score" type="number" step="0.25" min="0" max="20" value={score} onChange={e => setScore(e.target.value)} className="input-field" placeholder="Ex: 15.5" />
            </div>
            <div>
              <label htmlFor="appreciation" className="block text-sm font-medium mb-1">Appréciation</label>
              <select id="appreciation" value={appreciation} onChange={e => setAppreciation(e.target.value as Appreciation)} className="input-field">
                {appreciationOptions.map(opt => (
                  <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary">Annuler</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGradeModal;