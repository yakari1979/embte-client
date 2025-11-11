"use client";

import React, { useState, useEffect } from 'react';
import { createEvaluation } from '@/services/api';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';

interface AddEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEvaluationCreated: () => void;
  classId: string;
  subjects: string[];
  evaluationType: 'TD' | 'DEVOIR'; // <-- 1. On ajoute cette prop
}

const AddEvaluationModal: React.FC<AddEvaluationModalProps> = ({ isOpen, onClose, onEvaluationCreated, classId, subjects, evaluationType }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(subjects[0] || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 2. Le titre du modal devient dynamique
  const modalTitle = evaluationType === 'TD' ? 'Ajouter un nouveau TD' : 'Ajouter un nouveau Devoir';

  useEffect(() => {
      if (subjects.length > 0 && !subject) {
          setSubject(subjects[0]);
      }
  }, [subjects, subject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim()) {
      setError("Le titre et la matière sont requis.");
      return;
    }

    const token = Cookies.get('token');
    if (!token) return;

    setIsSubmitting(true);
    setError('');
    try {
      // 3. On utilise la prop 'evaluationType' lors de l'appel API
      await createEvaluation({ title, type: evaluationType, subject, classId }, token);
      
      onEvaluationCreated();
      onClose();
      setTitle('');
      setSubject(subjects[0] || '');
    } catch (err) {
      setError("Une erreur est survenue lors de la création.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{modalTitle}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Titre de l'évaluation</label>
              <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder={evaluationType === 'TD' ? "Ex: TD N°1 - Algèbre" : "Ex: 1er Devoir Surveillé"} />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">Matière</label>
              <select id="subject" value={subject} onChange={e => setSubject(e.target.value)} className="input-field">
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary">Annuler</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvaluationModal;