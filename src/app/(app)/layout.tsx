// // src/app/(app)/layout.tsx
// import React from 'react';
// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
// import { jwtDecode } from 'jwt-decode'; // Cette librairie est dans votre package.json
// import NavigationBar from '../../components/NavigationBar';

// // Une fonction helper pour récupérer les données de l'utilisateur depuis le token
// const getUserDataFromToken = () => {
//   const token = cookies().get('token')?.value;
//   if (!token) {
//     redirect('/'); // Si pas de token, on renvoie à la page de connexion
//   }
//   try {
//     // On décode le token pour récupérer les infos (userId, role, etc.)
//     const decoded: { userId: string; role: string; establishmentId: string } = jwtDecode(token);
//     return { ...decoded, token };
//   } catch (error) {
//     console.error("Token invalide:", error);
//     redirect('/'); // Si le token est invalide, on renvoie à la connexion
//   }
// };

// export default function AppLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const userData = getUserDataFromToken();

//   return (
//     <div className="min-h-screen bg-background text-text-primary">
//       <NavigationBar user={userData} />
//       <main className="p-4 sm:p-6 lg:p-8">
//         {children}
//       </main>
//     </div>
//   );
// }




// src/app/(app)/layout.tsx
import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import NavigationBar from '../../components/NavigationBar';

// URL de ton backend (ajuste si nécessaire, ex: http://localhost:3001/api)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Fonction pour récupérer le profil complet depuis le serveur
async function getUserProfile() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    // On appelle l'API /me qui, elle, contient bien "enrolledClass" grâce à ta correction précédente
    const res = await fetch(`${API_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Important : on veut toujours la donnée fraîche
    });

    if (!res.ok) {
      console.error("Erreur API:", res.statusText);
      return null;
    }

    const userData = await res.json();
    return userData;

  } catch (error) {
    console.error("Erreur de connexion au backend:", error);
    return null;
  }
}

// Le layout doit être asynchrone pour attendre les données
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = await getUserProfile();

  if (!userData) {
    redirect('/'); // Si pas de user valide, retour au login
  }

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* On passe les données complètes (avec enrolledClass) à la navbar */}
      <NavigationBar user={userData} />
      <main className="p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}