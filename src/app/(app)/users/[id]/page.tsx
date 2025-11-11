"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getUserDetails } from '@/services/api';
import Cookies from 'js-cookie';
import { Loader2, AlertCircle, User, GraduationCap, Briefcase, Mail, Key, School } from 'lucide-react';

interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  identifiant: string;
  email: string | null;
  role: 'STUDENT' | 'TEACHER';
  enrolledClass: { name: string } | null;
}

const UserDetailPage = () => {
  const pathname = usePathname();
  const userId = pathname.split('/').pop() || '';
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      const token = Cookies.get('token');
      if (!token) { setError("Authentification requise."); setLoading(false); return; }
      try {
        const response = await getUserDetails(userId, token);
        setUser(response.data);
      } catch (err) {
        setError("Impossible de charger les détails de l'utilisateur.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;
  if (!user) return <div className="p-4">Utilisateur non trouvé.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-surface p-8 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
          <div className={`p-4 rounded-full ${user.role === 'STUDENT' ? 'bg-purple-100' : 'bg-green-100'}`}>
            {user.role === 'STUDENT' ? <GraduationCap className="h-10 w-10 text-purple-600" /> : <Briefcase className="h-10 w-10 text-green-600" />}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
            <p className="text-lg text-text-secondary">{user.role === 'STUDENT' ? 'Élève' : 'Enseignant'}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 mb-2">Informations Personnelles</h3>
            <p className="flex items-center"><User className="mr-2 text-text-subtle" />{user.firstName} {user.lastName}</p>
            <p className="flex items-center"><Mail className="mr-2 text-text-subtle" />{user.email || 'Non renseigné'}</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 mb-2">Informations de Connexion</h3>
            <p className="flex items-center"><Key className="mr-2 text-text-subtle" />Identifiant : <span className="font-mono ml-2">{user.identifiant}</span></p>
            {user.role === 'STUDENT' && user.enrolledClass && (
              <p className="flex items-center"><School className="mr-2 text-text-subtle" />Classe : {user.enrolledClass.name}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;