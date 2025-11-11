"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { getEstablishmentDetails, EstablishmentDetails } from '@/services/api';
import { ArrowLeft, Building, School, User } from 'lucide-react';

const EstablishmentDetailPage = () => {
    const [details, setDetails] = useState<EstablishmentDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'classes' | 'teachers' | 'students'>('classes');
    
    const params = useParams();
    const router = useRouter();
    const establishmentId = params.id as string;

    useEffect(() => {
        if (!establishmentId) return;
        const fetchData = async () => {
            const token = Cookies.get('token');
            if (!token) {
                router.push('/');
                return;
            }
            try {
                const { data } = await getEstablishmentDetails(establishmentId, token);
                setDetails(data);
            } catch (err) {
                setError("Impossible de charger les détails de l'établissement.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [establishmentId, router]);

    const teachers = details?.users.filter(u => u.role === 'TEACHER') || [];
    const students = details?.users.filter(u => u.role === 'STUDENT') || [];

    if (isLoading) return <div className="text-center py-10">Chargement des détails...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
    if (!details) return null;

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Link href="/moderator/establishments" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-6">
                <ArrowLeft size={18} />
                Retour à la liste des établissements
            </Link>

            <header className="mb-8 p-6 bg-surface rounded-lg shadow-md border dark:border-gray-800">
                <div className="flex items-center gap-4">
                    <Building className="h-10 w-10 text-blue-500" />
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">{details.name}</h1>
                        <p className="text-text-secondary">ID: {details.id}</p>
                    </div>
                </div>
            </header>

            {/* Onglets de navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('classes')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'classes' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Classes ({details.classes.length})
                    </button>
                    <button onClick={() => setActiveTab('teachers')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'teachers' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Professeurs ({teachers.length})
                    </button>
                    <button onClick={() => setActiveTab('students')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'students' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Élèves ({students.length})
                    </button>
                </nav>
            </div>

            {/* Contenu des onglets */}
            <div className="bg-surface p-6 rounded-lg shadow-md border dark:border-gray-800">
                {activeTab === 'classes' && (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {details.classes.map(cls => (
                            <li key={cls.id} className="py-3 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <School className="h-5 w-5 text-text-secondary"/>
                                    <span className="font-medium">{cls.name}</span>
                                </div>
                                <span className="text-sm text-text-secondary">{cls._count.students} élève(s)</span>
                            </li>
                        ))}
                    </ul>
                )}
                {activeTab === 'teachers' && (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {teachers.map(user => (
                            <li key={user.id} className="py-3 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-text-secondary"/>
                                    <span className="font-medium">{user.firstName} {user.lastName}</span>
                                </div>
                                <span className="text-sm text-text-secondary font-mono">{user.identifiant}</span>
                            </li>
                        ))}
                    </ul>
                )}
                {activeTab === 'students' && (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {students.map(user => (
                            <li key={user.id} className="py-3 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-text-secondary"/>
                                    <span className="font-medium">{user.firstName} {user.lastName}</span>
                                </div>
                                <span className="text-sm text-text-secondary font-mono">{user.identifiant}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default EstablishmentDetailPage;