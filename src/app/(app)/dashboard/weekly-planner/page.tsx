// Dans src/app/(app)/dashboard/weekly-planner/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { getMyClasses } from '@/services/api';
import { Loader2, BookOpen } from 'lucide-react';

interface TeacherClass {
  id: string;
  name: string;
}

const WeeklyPlannerHomePage = () => {
    const [classes, setClasses] = useState<TeacherClass[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            router.push('/login');
            return;
        }
        getMyClasses(token)
            .then(res => setClasses(res.data))
            .catch(err => console.error("Failed to fetch classes", err))
            .finally(() => setIsLoading(false));
    }, [router]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin h-8 w-8 text-blue-500" /></div>;
    }

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-2">Mon Planificateur Hebdomadaire</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Sélectionnez une classe pour organiser votre semaine d'enseignement.</p>

            {classes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map(cls => (
                        <div
                            key={cls.id}
                            onClick={() => router.push(`/dashboard/weekly-planner/${cls.id}`)}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                        >
                            <BookOpen className="h-10 w-10 text-blue-500 mb-4" />
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{cls.name}</h2>
                            <p className="text-blue-500 font-semibold mt-4">Accéder au planificateur →</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 italic mt-16">Vous n'êtes assigné à aucune classe pour le moment.</p>
            )}
        </div>
    );
};

export default WeeklyPlannerHomePage;