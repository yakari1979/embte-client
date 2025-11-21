// (app)/my-classes/student/[studentId]/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getStudentDetailsForTeacher, UserDetails } from '@/services/api'; // On appelle la nouvelle fonction
import Cookies from 'js-cookie';
import { Loader2, User, GraduationCap, Mail, Key, School, UserPlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const StudentDetailPageForTeacher = () => {
  const pathname = usePathname();
  const studentId = pathname.split('/').pop() || '';
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) return;
    const fetchData = async () => {
      const token = Cookies.get('token');
      if (!token) { setError("Authentification requise."); setLoading(false); return; }
      try {
        const response = await getStudentDetailsForTeacher(studentId, token); // On utilise la bonne fonction
        setUser(response.data);
      } catch (err) {
        setError("Impossible de charger les détails ou accès refusé.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studentId]);

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;
  if (!user) return <div className="p-4">Élève non trouvé.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <Link href={`/my-classes/${user.enrolledClass?.id || ''}`} className="text-sm text-blue-500 hover:underline mb-4 inline-block"><ArrowLeft size={14} className="inline-block mr-1"/> Retour à la classe</Link>
      <div className="bg-surface p-8 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b dark:border-gray-700">
          <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/40">
            <GraduationCap className="h-10 w-10 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
            <p className="text-lg text-text-secondary">Élève</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 mb-2">Informations de Contact</h3>
            <p className="flex items-center"><Mail className="mr-3 text-text-subtle" />{user.email || 'Non renseigné'}</p>
            <p className="flex items-center"><Key className="mr-3 text-text-subtle" />Identifiant : <span className="font-mono ml-2">{user.identifiant}</span></p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 mb-2">Informations Scolaires</h3>
            {user.enrolledClass && <p className="flex items-center"><School className="mr-3 text-text-subtle" />Classe : {user.enrolledClass.name}</p>}
            <p className="flex items-center"><UserPlus className="mr-3 text-text-subtle" />Parent : <span className="font-semibold ml-2">{user.parent ? `${user.parent.firstName} ${user.parent.lastName}` : 'Non assigné'}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPageForTeacher;