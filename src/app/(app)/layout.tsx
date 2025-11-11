// src/app/(app)/layout.tsx
import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'; // Cette librairie est dans votre package.json
import NavigationBar from '../../components/NavigationBar';

// Une fonction helper pour récupérer les données de l'utilisateur depuis le token
const getUserDataFromToken = () => {
  const token = cookies().get('token')?.value;
  if (!token) {
    redirect('/'); // Si pas de token, on renvoie à la page de connexion
  }
  try {
    // On décode le token pour récupérer les infos (userId, role, etc.)
    const decoded: { userId: string; role: string; establishmentId: string } = jwtDecode(token);
    return { ...decoded, token };
  } catch (error) {
    console.error("Token invalide:", error);
    redirect('/'); // Si le token est invalide, on renvoie à la connexion
  }
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = getUserDataFromToken();

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <NavigationBar user={userData} />
      <main className="p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}