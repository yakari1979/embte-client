// Dans src/app/(app)/dashboard/my-plan/page.tsx

"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { getMyRevisionPlan, createStudentPlanItem, updateStudentPlanItem, deleteStudentPlanItem, StudentPlanItem, getMyStudentSchedule } from '@/services/api';
import { Loader2, Plus, Trash2, CheckCircle, Circle, BookOpen, Calendar, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
dayjs.locale('fr');

// ----- SOUS-COMPOSANTS -----

const AddPlanItem: React.FC<{ onAdd: (item: StudentPlanItem) => void; subjects: string[] }> = ({ onAdd, subjects }) => {
    const [goal, setGoal] = useState('');
    const [subject, setSubject] = useState(subjects[0] || '');
    const [planDate, setPlanDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = Cookies.get('token');
        if (!goal.trim() || !subject || !planDate || !token) return toast.error("Tous les champs sont requis.");

        setIsSubmitting(true);
        try {
            const res = await createStudentPlanItem({ goal, subject, planDate }, token);
            onAdd(res.data);
            setGoal('');
            toast.success("Objectif ajouté !");
        } catch (error) {
            toast.error("Erreur lors de l'ajout.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div layout className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
            <h2 className="font-bold text-lg mb-3">Nouvel Objectif de Révision</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mon objectif</label>
                    <input
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="Ex: Refaire les exercices sur les acides-bases"
                        className="input-field mt-1"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Matière</label>
                    <select value={subject} onChange={(e) => setSubject(e.target.value)} className="input-field mt-1">
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date prévue</label>
                    <input
                        type="date"
                        value={planDate}
                        onChange={(e) => setPlanDate(e.target.value)}
                        className="input-field mt-1"
                        required
                    />
                </div>
                <div className="md:col-span-2">
                    <button type="submit" className="btn-primary w-full md:w-auto" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Ajouter au plan"}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

const PlanItemCard: React.FC<{ item: StudentPlanItem; onUpdate: (id: string, data: Partial<StudentPlanItem>) => void; onDelete: (id: string) => void; }> = ({ item, onUpdate, onDelete }) => {
    const handleToggle = async () => {
        const token = Cookies.get('token');
        if (!token) return;
        try {
            await updateStudentPlanItem(item.id, { isCompleted: !item.isCompleted }, token);
            onUpdate(item.id, { isCompleted: !item.isCompleted });
        } catch {
            toast.error("Erreur de mise à jour.");
        }
    };

    const handleDelete = async () => {
        const token = Cookies.get('token');
        if (!token) return;
        try {
            await deleteStudentPlanItem(item.id, token);
            onDelete(item.id);
            toast.success("Objectif supprimé.");
        } catch {
            toast.error("Erreur de suppression.");
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${item.isCompleted ? 'bg-green-50 dark:bg-green-900/30' : 'bg-white dark:bg-gray-800'}`}
        >
            <button onClick={handleToggle} className="mt-1 flex-shrink-0">
                {item.isCompleted ? <CheckCircle className="h-6 w-6 text-green-500" /> : <Circle className="h-6 w-6 text-gray-300 dark:text-gray-600" />}
            </button>
            <div className="flex-grow">
                <p className={`font-semibold ${item.isCompleted ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>{item.goal}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{item.subject}</p>
            </div>
            <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 flex-shrink-0">
                <Trash2 className="h-5 w-5" />
            </button>
        </motion.div>
    );
};


// ----- COMPOSANT PRINCIPAL -----

const StudentPlannerPage = () => {
    const [plan, setPlan] = useState<StudentPlanItem[]>([]);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) return router.push('/login');
        
        Promise.all([
            getMyRevisionPlan(token),
            getMyStudentSchedule(token)
        ]).then(([planRes, scheduleRes]) => {
            setPlan(planRes.data);
            
            // --- CORRECTION AVEC CAST DE TYPE ---
            const subjectsList = scheduleRes.data.schedule?.sessions.map((s: { subject: any; }) => s.subject) || [];
            const subjectsSet = new Set(subjectsList);
        
            // On dit explicitement à TypeScript que le résultat est un tableau de strings
            const uniqueSubjects = Array.from(subjectsSet) as string[]; 
            // --- FIN DE LA CORRECTION ---
        
            setSubjects(uniqueSubjects);
        
        }).catch(() => {
            toast.error("Impossible de charger vos données.");
        }).finally(() => {
            setIsLoading(false);
        });
    }, [router]);

    const groupedPlan = useMemo(() => {
        const today = dayjs().startOf('day');
        const endOfWeek = today.endOf('week');

        const groups: { title: string; items: StudentPlanItem[] }[] = [
            { title: "Aujourd'hui", items: [] },
            { title: "Demain", items: [] },
            { title: "Cette Semaine", items: [] },
            { title: "Plus tard", items: [] },
            { title: "Terminés", items: [] },
        ];

        plan.sort((a, b) => dayjs(a.planDate).diff(dayjs(b.planDate)));

        for (const item of plan) {
            if (item.isCompleted) {
                groups[4].items.push(item);
                continue;
            }
            const date = dayjs(item.planDate);
            if (date.isSame(today, 'day')) groups[0].items.push(item);
            else if (date.isSame(today.add(1, 'day'), 'day')) groups[1].items.push(item);
            else if (date.isAfter(today) && date.isBefore(endOfWeek)) groups[2].items.push(item);
            else groups[3].items.push(item);
        }
        return groups.filter(g => g.items.length > 0);

    }, [plan]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin h-8 w-8 text-blue-500" /></div>;
    }

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3"><Calendar /> Mon Plan de Réussite</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Organisez vos révisions et atteignez vos objectifs académiques.</p>

                <AddPlanItem
                    subjects={subjects}
                    onAdd={(item) => setPlan(prev => [...prev, item])}
                />
                
                <AnimatePresence>
                    {groupedPlan.map(group => (
                        <motion.div key={group.title} layout className="mb-8">
                            <h2 className="text-xl font-bold mb-4 border-b pb-2 dark:border-gray-700">{group.title}</h2>
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {group.items.map(item => (
                                        <PlanItemCard
                                            key={item.id}
                                            item={item}
                                            onUpdate={(id, data) => setPlan(p => p.map(i => i.id === id ? { ...i, ...data } : i))}
                                            onDelete={(id) => setPlan(p => p.filter(i => i.id !== id))}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {plan.length === 0 && (
                    <div className="text-center py-16">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Votre plan est vide</h3>
                        <p className="mt-1 text-sm text-gray-500">Commencez par ajouter votre premier objectif de révision.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentPlannerPage;