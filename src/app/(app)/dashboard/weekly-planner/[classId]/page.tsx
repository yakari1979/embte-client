// Dans src/app/(app)/dashboard/weekly-planner/[classId]/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { getMyClassDetails, createWeeklyPlanItem, updateWeeklyPlanItem, deleteWeeklyPlanItem, WeeklyPlanItem, PlanItemType } from '@/services/api';
import { Loader2, Book, Pencil, Repeat, Check, Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';

// Définir les types pour les données de la classe
interface Session {
  id: string;
  subject: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  teacher: {
      id: string | null; firstName: string; lastName: string; 
};
  weeklyPlanItems: WeeklyPlanItem[];
}
interface ClassDetails {
  id: string;
  name: string;
  schedule: { sessions: Session[] } | null;
}
type Day = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';


// ----- Sous-composants pour une meilleure lisibilité -----

// Formulaire pour ajouter une nouvelle note
const AddPlanItemForm: React.FC<{ sessionId: string; onAddItem: (item: WeeklyPlanItem) => void; }> = ({ sessionId, onAddItem }) => {
    const [content, setContent] = useState('');
    const [type, setType] = useState<PlanItemType>('LESSON');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = Cookies.get('token');
        if (!content.trim() || !token) return;

        setIsSubmitting(true);
        try {
            const res = await createWeeklyPlanItem(sessionId, { content, type }, token);
            onAddItem(res.data);
            setContent('');
            setType('LESSON');
            toast.success("Note ajoutée !");
        } catch (error) {
            toast.error("Erreur lors de l'ajout.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 space-y-2">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Ajouter une note pour ce cours..."
                className="input-field w-full text-sm"
                rows={2}
                required
            />
            <div className="flex items-center justify-between gap-2">
                <select value={type} onChange={(e) => setType(e.target.value as PlanItemType)} className="input-field text-sm">
                    <option value="LESSON">Cours</option>
                    <option value="ASSIGNMENT">Devoir</option>
                    <option value="REVIEW">Révision</option>
                    <option value="OTHER">Autre</option>
                </select>
                {/* <button type="submit" className="btn-primary-sm" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </button> */}
                {/* --- CORRECTION ICI --- */}
                <button type="submit" className="btn-primary-sm flex items-center gap-1" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : <> <Plus className="h-4 w-4" /> Ajouter </>}
                </button>
                {/* --- FIN DE LA CORRECTION --- */}
            </div>
        </form>
    );
};


// Composant pour afficher une seule note
const PlanItem: React.FC<{ item: WeeklyPlanItem; onUpdate: (id: string, data: Partial<WeeklyPlanItem>) => void; onDelete: (id: string) => void; }> = ({ item, onUpdate, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleToggleComplete = async () => {
        const token = Cookies.get('token');
        if (!token) return;
        try {
            await updateWeeklyPlanItem(item.id, { isCompleted: !item.isCompleted }, token);
            onUpdate(item.id, { isCompleted: !item.isCompleted });
        } catch (error) {
            toast.error("Erreur de mise à jour.");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette note ?")) return;
        const token = Cookies.get('token');
        if (!token) return;
        setIsDeleting(true);
        try {
            await deleteWeeklyPlanItem(item.id, token);
            onDelete(item.id);
            toast.success("Note supprimée.");
        } catch (error) {
            toast.error("Erreur de suppression.");
            setIsDeleting(false);
        }
    };
    
    const ICONS: Record<PlanItemType, React.ReactNode> = {
        LESSON: <Book className="h-4 w-4 text-blue-500" />,
        ASSIGNMENT: <Pencil className="h-4 w-4 text-orange-500" />,
        REVIEW: <Repeat className="h-4 w-4 text-green-500" />,
        OTHER: <Check className="h-4 w-4 text-gray-500" />,
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
            <button onClick={handleToggleComplete} className="mt-1">
                {item.isCompleted ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5 text-gray-400" />}
            </button>
            <div className="flex-grow">
                <p className={`text-sm ${item.isCompleted ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                    {item.content}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    {ICONS[item.type]}
                    <span>{item.type.charAt(0) + item.type.slice(1).toLowerCase()}</span>
                </div>
            </div>
            <button onClick={handleDelete} className="text-gray-400 hover:text-red-500" disabled={isDeleting}>
                {isDeleting ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
            </button>
        </motion.div>
    );
};


// ----- COMPOSANT PRINCIPAL -----
const ClassPlannerPage = () => {
    const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null); // <-- AJOUTER CET ÉTAT
    const router = useRouter();
    const params = useParams();
    const classId = params.classId as string;

    const daysOfWeek: Day[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const dayTranslations: Record<Day, string> = { MONDAY: 'Lundi', TUESDAY: 'Mardi', WEDNESDAY: 'Mercredi', THURSDAY: 'Jeudi', FRIDAY: 'Vendredi', SATURDAY: 'Samedi', SUNDAY: 'Dimanche' };


    useEffect(() => {
        if (!classId) return;
        const token = Cookies.get('token');
        if (!token) {
            router.push('/login');
            return;
        }

        // --- AJOUT : Décoder le token pour obtenir l'ID de l'utilisateur ---
        const decoded: { userId: string } = jwtDecode(token);
        setCurrentUserId(decoded.userId);
        // --- FIN DE L'AJOUT ---

        getMyClassDetails(classId, token)
            .then(res => setClassDetails(res.data))
            .catch(err => toast.error("Impossible de charger les détails de la classe."))
            .finally(() => setIsLoading(false));
    }, [classId, router]);

    const updatePlanItems = (sessionId: string, items: WeeklyPlanItem[]) => {
        setClassDetails(prev => {
            if (!prev || !prev.schedule) return prev;
            const newSessions = prev.schedule.sessions.map(s => s.id === sessionId ? { ...s, weeklyPlanItems: items } : s);
            return { ...prev, schedule: { ...prev.schedule, sessions: newSessions } };
        });
    };
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin h-8 w-8 text-blue-500" /></div>;
    }

    if (!classDetails) {
        return <p className="text-center text-red-500 p-8">Erreur: Classe non trouvée.</p>;
    }

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-2">Planificateur pour la classe : <span className="text-blue-600">{classDetails.name}</span></h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Organisez vos cours, devoirs et révisions pour la semaine à venir.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {daysOfWeek.slice(0, 5).map(day => ( // On affiche que du Lundi au Vendredi par défaut
                    <div key={day} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                        <h2 className="font-bold text-center mb-4 text-gray-700 dark:text-gray-300">{dayTranslations[day]}</h2>
                        <div className="space-y-4">
                            {classDetails.schedule?.sessions.filter(s => s.dayOfWeek === day && s.teacher.id === currentUserId).map(session => (
                                <div key={session.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                    <p className="font-bold text-sm">{session.subject}</p>
                                    <p className="text-xs text-gray-500">{session.startTime} - {session.endTime}</p>
                                    <hr className="my-3 dark:border-gray-700"/>
                                    <AnimatePresence>
                                        {session.weeklyPlanItems.map(item => (
                                            <PlanItem
                                                key={item.id}
                                                item={item}
                                                onUpdate={(id, data) => updatePlanItems(session.id, session.weeklyPlanItems.map(i => i.id === id ? { ...i, ...data } : i))}
                                                onDelete={(id) => updatePlanItems(session.id, session.weeklyPlanItems.filter(i => i.id !== id))}
                                            />
                                        ))}
                                    </AnimatePresence>
                                    <AddPlanItemForm
                                        sessionId={session.id}
                                        onAddItem={(item) => updatePlanItems(session.id, [...session.weeklyPlanItems, item])}
                                    />
                                </div>
                            ))}
                            {classDetails.schedule?.sessions.filter(s => s.dayOfWeek === day && s.teacher.id === currentUserId).length === 0 && (
                                <p className="text-center text-xs text-gray-400 italic py-8">Aucun cours ce jour.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClassPlannerPage;