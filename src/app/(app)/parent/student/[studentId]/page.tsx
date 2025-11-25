// // (app)/parent/student/[studentId]/page.tsx

// "use client";

// import React, { useState, useEffect } from 'react';
// import { usePathname } from 'next/navigation';
// import Cookies from 'js-cookie';
// import Link from 'next/link';
// import { getChildDetails, ChildDetailsResponse } from '@/services/api';
// import { Loader2, ArrowLeft, Calendar, BookOpen, CheckCircle, XCircle, Users, BarChart2 } from 'lucide-react';
// import dayjs from 'dayjs';
// import 'dayjs/locale/fr';
// dayjs.locale('fr');

// const dayOrder = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
// const dayTranslations: Record<string, string> = { MONDAY: "Lundi", TUESDAY: "Mardi", WEDNESDAY: "Mercredi", THURSDAY: "Jeudi", FRIDAY: "Vendredi", SATURDAY: "Samedi", SUNDAY: "Dimanche" };

// const StudentDetailPageForParent = () => {
//     const pathname = usePathname();
//     const studentId = pathname.split('/').pop() || '';
//     const [details, setDetails] = useState<ChildDetailsResponse | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         if (!studentId) return;
//         const fetchData = async () => {
//             const token = Cookies.get('token');
//             if (!token) { setError("Session expirée."); setLoading(false); return; }
//             try {
//                 const response = await getChildDetails(studentId, token);
//                 setDetails(response.data);
//             } catch (err) {
//                 setError("Impossible de charger les détails de l'élève.");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, [studentId]);

//     if (loading) return <div className="text-center p-8"><Loader2 className="animate-spin mx-auto h-8 w-8 text-blue-500" /></div>;
//     if (error) return <div className="text-center p-4 bg-red-100 text-red-600 rounded-lg">{error}</div>;
//     if (!details) return <p className="text-center">Aucune donnée trouvée pour cet élève.</p>;

//     return (
//         <div className="space-y-8">
//             <Link href="/parent/dashboard" className="flex items-center text-sm text-blue-600 hover:underline mb-4"><ArrowLeft size={16} className="mr-1" /> Retour au tableau de bord</Link>

//             <div className="bg-surface p-6 rounded-lg shadow-md">
//                 <h1 className="text-3xl font-bold text-text-primary">{details.studentInfo.firstName} {details.studentInfo.lastName}</h1>
//                 <p className="text-lg text-text-secondary">Suivi Pédagogique - Classe de <span className="font-semibold text-primary">{details.studentInfo.className || 'N/A'}</span></p>
//             </div>
            
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 <div className="lg:col-span-2 space-y-8">
//                     {/* Section Notes */}
//                     <div className="bg-surface p-6 rounded-lg shadow-md">
//                         <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2"><BarChart2 />Dernières Notes</h2>
//                         {details.grades.length > 0 ? (
//                             <ul className="space-y-3">{details.grades.map((grade, i) => <li key={i} className="flex justify-between items-center p-3 bg-background rounded-md"><p>{grade.evaluation.subject}: <span className="font-semibold">{grade.evaluation.title}</span></p><span className={`font-bold text-lg ${grade.score && grade.score < 10 ? 'text-red-500' : 'text-green-600'}`}>{grade.score ?? 'N/A'} / 20</span></li>)}</ul>
//                         ) : <p className="text-text-secondary italic text-center py-4">Aucune note enregistrée.</p>}
//                     </div>
//                     {/* Section Absences */}
//                     <div className="bg-surface p-6 rounded-lg shadow-md">
//                         <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2"><XCircle className="text-red-500"/>Dernières Absences</h2>
//                         {details.attendance.length > 0 ? (
//                             <ul className="space-y-3">{details.attendance.map((att, i) => <li key={i} className="flex justify-between items-center p-3 bg-background rounded-md"><p className="font-semibold">{att.session.subject}</p><span className="text-sm text-text-secondary">{dayjs(att.date).format('dddd D MMMM YYYY')}</span></li>)}</ul>
//                         ) : <div className="text-center py-4 flex items-center justify-center gap-2 text-green-600"><CheckCircle /> <p>Aucune absence enregistrée. Félicitations !</p></div>}
//                     </div>
//                 </div>

//                 <div className="lg:col-span-1 space-y-8">
//                     {/* Section Emploi du temps */}
//                     <div className="bg-surface p-6 rounded-lg shadow-md">
//                         <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2"><Calendar />Emploi du Temps</h2>
//                         {details.schedule ? (
//                             <div className="space-y-4">{dayOrder.map(day => {
//                                 const daySessions = details.schedule!.sessions.filter(s => s.dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
//                                 if (daySessions.length === 0) return null;
//                                 return <div key={day}><h3 className="font-semibold text-text-secondary">{dayTranslations[day]}</h3><ul className="mt-1 space-y-1">{daySessions.map(s => <li key={s.id} className="text-sm p-2 bg-background rounded-md">{s.startTime} - {s.subject}</li>)}</ul></div>
//                             })}</div>
//                         ) : <p className="text-text-secondary italic text-center py-4">Emploi du temps non disponible.</p>}
//                     </div>
//                     {/* Section Professeurs */}
//                      <div className="bg-surface p-6 rounded-lg shadow-md">
//                         <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2"><Users />Équipe Pédagogique</h2>
//                         {details.studentInfo.teachers.length > 0 ? (
//                             <ul className="space-y-2">{details.studentInfo.teachers.map((t, i) => <li key={i} className="p-2 bg-background rounded-md text-sm">{t.firstName} {t.lastName}</li>)}</ul>
//                         ) : <p className="text-text-secondary italic text-center py-4">Aucun professeur assigné.</p>}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default StudentDetailPageForParent;




// (app)/parent/student/[studentId]/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { getChildDetails, ChildDetailsResponse } from '@/services/api';
import { Loader2, ArrowLeft, Calendar, CheckCircle, XCircle, Users, BarChart2, TrendingUp } from 'lucide-react'; // J'ai ajouté TrendingUp
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
dayjs.locale('fr');

const dayOrder = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const dayTranslations: Record<string, string> = { MONDAY: "Lundi", TUESDAY: "Mardi", WEDNESDAY: "Mercredi", THURSDAY: "Jeudi", FRIDAY: "Vendredi", SATURDAY: "Samedi", SUNDAY: "Dimanche" };

const StudentDetailPageForParent = () => {
    const pathname = usePathname();
    const studentId = pathname.split('/').pop() || '';
    const [details, setDetails] = useState<ChildDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!studentId) return;
        const fetchData = async () => {
            const token = Cookies.get('token');
            if (!token) { setError("Session expirée."); setLoading(false); return; }
            try {
                const response = await getChildDetails(studentId, token);
                setDetails(response.data);
            } catch (err) {
                setError("Impossible de charger les détails de l'élève.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [studentId]);

    if (loading) return <div className="text-center p-8"><Loader2 className="animate-spin mx-auto h-8 w-8 text-blue-500" /></div>;
    if (error) return <div className="text-center p-4 bg-red-100 text-red-600 rounded-lg">{error}</div>;
    if (!details) return <p className="text-center">Aucune donnée trouvée pour cet élève.</p>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <Link href="/parent/dashboard" className="flex items-center text-sm text-blue-600 hover:underline mb-4"><ArrowLeft size={16} className="mr-1" /> Retour au tableau de bord</Link>

            {/* EN-TÊTE AVEC BOUTON D'ANALYSE */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{details.studentInfo.firstName} {details.studentInfo.lastName}</h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400">Suivi Pédagogique - Classe de <span className="font-semibold text-blue-600">{details.studentInfo.className || 'N/A'}</span></p>
                </div>
                
                {/* --- LE BOUTON MAGIQUE --- */}
                <Link 
                    href={`/parent/student/${studentId}/analytics`}
                    className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all transform hover:scale-105"
                >
                    <div className="bg-white/20 p-2 rounded-lg">
                        <TrendingUp size={24} />
                    </div>
                    <div className="text-left">
                        <span className="block text-xs font-medium text-blue-100 uppercase tracking-wider">Assistant Parental</span>
                        <span className="block font-bold text-sm">Analyser la Réussite</span>
                    </div>
                </Link>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Section Notes */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><BarChart2 className="text-blue-500"/>Dernières Notes</h2>
                        {details.grades.length > 0 ? (
                            <ul className="space-y-3">{details.grades.map((grade, i) => <li key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700"><p className="text-gray-700 dark:text-gray-300">{grade.evaluation.subject}: <span className="font-semibold">{grade.evaluation.title}</span></p><span className={`font-bold text-lg ${grade.score && grade.score < 10 ? 'text-red-500' : 'text-green-600'}`}>{grade.score ?? 'N/A'} / 20</span></li>)}</ul>
                        ) : <p className="text-gray-500 italic text-center py-4">Aucune note enregistrée.</p>}
                    </div>
                    {/* Section Absences */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><XCircle className="text-red-500"/>Dernières Absences</h2>
                        {details.attendance.length > 0 ? (
                            <ul className="space-y-3">{details.attendance.map((att, i) => <li key={i} className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30"><p className="font-semibold text-red-700 dark:text-red-400">{att.session.subject}</p><span className="text-sm text-red-600 dark:text-red-300">{dayjs(att.date).format('dddd D MMMM YYYY')}</span></li>)}</ul>
                        ) : <div className="text-center py-4 flex items-center justify-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg"><CheckCircle /> <p>Aucune absence enregistrée. Félicitations !</p></div>}
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    {/* Section Emploi du temps */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Calendar className="text-purple-500"/>Emploi du Temps</h2>
                        {details.schedule ? (
                            <div className="space-y-4">{dayOrder.map(day => {
                                const daySessions = details.schedule!.sessions.filter(s => s.dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
                                if (daySessions.length === 0) return null;
                                return <div key={day}><h3 className="font-semibold text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider mb-2">{dayTranslations[day]}</h3><ul className="space-y-2">{daySessions.map(s => <li key={s.id} className="text-sm p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border-l-4 border-blue-500 flex justify-between"><span className="font-medium">{s.subject}</span><span className="text-gray-500">{s.startTime}</span></li>)}</ul></div>
                            })}</div>
                        ) : <p className="text-gray-500 italic text-center py-4">Emploi du temps non disponible.</p>}
                    </div>
                    {/* Section Professeurs */}
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Users className="text-orange-500"/>Équipe Pédagogique</h2>
                        {details.studentInfo.teachers.length > 0 ? (
                            <ul className="space-y-2">{details.studentInfo.teachers.map((t, i) => <li key={i} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm flex items-center gap-3"><div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">{t.firstName[0]}{t.lastName[0]}</div><span className="font-medium text-gray-700 dark:text-gray-300">{t.firstName} {t.lastName}</span></li>)}</ul>
                        ) : <p className="text-gray-500 italic text-center py-4">Aucun professeur assigné.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailPageForParent;