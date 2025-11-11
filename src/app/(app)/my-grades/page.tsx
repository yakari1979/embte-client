"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getMyGrades, GradeWithEvaluation } from '@/services/api';
import { Loader2, AlertCircle, FileText, BookOpen, Star, User } from 'lucide-react';

// --- Sous-composant pour un tableau de notes (TD ou Devoir) ---
const GradesTable: React.FC<{ grades: GradeWithEvaluation[] }> = ({ grades }) => {
    if (grades.length === 0) {
        return <p className="text-sm italic text-text-subtle px-4 py-2">Aucune évaluation de ce type.</p>;
    }
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="border-b-2 border-gray-200 dark:border-gray-700">
                    <tr>
                        <th className="py-2 text-left font-semibold">Évaluation</th>
                        <th className="py-2 text-left font-semibold">Professeur</th>
                        <th className="py-2 text-center font-semibold">Note</th>
                        <th className="py-2 text-center font-semibold">Appréciation</th>
                    </tr>
                </thead>
                <tbody>
                    {grades.map(grade => (
                        <tr key={grade.id} className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-3 pr-2">{grade.evaluation.title}</td>
                            <td className="py-3 pr-2 text-text-secondary">{grade.evaluation.teacher.firstName} {grade.evaluation.teacher.lastName}</td>
                            <td className="py-3 text-center font-bold text-lg text-primary">{grade.score !== null ? grade.score.toFixed(2) : '--'}</td>
                            <td className="py-3 text-center text-xs font-semibold">{grade.appreciation.replace('_', ' ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


// --- Sous-composant pour une matière entière ---
const SubjectGradesCard: React.FC<{ subject: string; grades: GradeWithEvaluation[] }> = ({ subject, grades }) => {
    // Calcul de la moyenne pour cette matière
    const gradedItems = grades.filter(g => g.score !== null);
    const average = gradedItems.length > 0
        ? gradedItems.reduce((sum, g) => sum + g.score!, 0) / gradedItems.length
        : null;

    // Séparation des notes en TD et Devoirs
    const tdGrades = grades.filter(g => g.evaluation.type === 'TD');
    const devoirGrades = grades.filter(g => g.evaluation.type === 'DEVOIR');

    return (
        <div className="bg-surface p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h2 className="text-2xl font-bold text-primary flex items-center">
                    <BookOpen className="h-6 w-6 mr-3" />
                    {subject}
                </h2>
                {average !== null && (
                    <div className="text-center bg-background p-3 rounded-md mt-2 sm:mt-0">
                        <p className="text-sm font-semibold text-text-secondary">Moyenne actuelle</p>
                        <p className="text-2xl font-bold text-blue-500">{average.toFixed(2)} / 20</p>
                    </div>
                )}
            </div>
            
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-text-secondary mb-2">Travaux Dirigés (TD)</h3>
                    <GradesTable grades={tdGrades} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-text-secondary mb-2">Devoirs Surveillés</h3>
                    <GradesTable grades={devoirGrades} />
                </div>
            </div>
        </div>
    );
};


// --- Composant principal de la page ---
const MyGradesPage = () => {
    const [groupedGrades, setGroupedGrades] = useState<Record<string, GradeWithEvaluation[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGrades = async () => {
            const token = Cookies.get('token');
            if (!token) {
                setError("Authentification requise."); setLoading(false); return;
            }
            try {
                const response = await getMyGrades(token);
                const grouped = response.data.reduce((acc, grade) => {
                    const subject = grade.evaluation.subject;
                    if (!acc[subject]) acc[subject] = [];
                    acc[subject].push(grade);
                    return acc;
                }, {} as Record<string, GradeWithEvaluation[]>);
                setGroupedGrades(grouped);
            } catch (err) {
                setError("Impossible de charger vos notes.");
            } finally {
                setLoading(false);
            }
        };
        fetchGrades();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>;
    if (error) return <div className="container mx-auto p-4"><div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"><strong className="font-bold mr-2"><AlertCircle size={20} className="inline"/> Erreur:</strong><span>{error}</span></div></div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-8">Mes Notes & Évaluations</h1>
            {Object.keys(groupedGrades).length > 0 ? (
                <div className="space-y-8">
                    {Object.entries(groupedGrades).map(([subject, grades]) => (
                        <SubjectGradesCard key={subject} subject={subject} grades={grades} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 px-6 bg-surface rounded-lg">
                    <FileText className="mx-auto h-16 w-16 text-gray-400" />
                    <p className="mt-4 text-xl font-semibold text-text-secondary">Aucune note n'a encore été enregistrée.</p>
                </div>
            )}
        </div>
    );
};

export default MyGradesPage;