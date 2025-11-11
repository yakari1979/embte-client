// src/app/(app)/dashboard/page.tsx
import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

// Importez les futurs composants de tableau de bord
import AdminDashboard from '../../../components/dashboards/AdminDashboard';
import TeacherDashboard from '../../../components/dashboards/TeacherDashboard';
import StudentDashboard from '../../../components/dashboards/StudentDashboard';

const getUserDataFromToken = () => {
    // ... (même fonction helper que dans le layout)
    const token = cookies().get('token')?.value;
    if (!token) redirect('/');
    try {
        return jwtDecode(token) as { userId: string; role: string };
    } catch {
        redirect('/');
    }
};

export default function DashboardPage() {
  const user = getUserDataFromToken();

  return (
    <div>
      {user.role === 'ADMIN' && <AdminDashboard />}
      {user.role === 'TEACHER' && <TeacherDashboard />}
      {user.role === 'STUDENT' && <StudentDashboard />}
    </div>
  );
}