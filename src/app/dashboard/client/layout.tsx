'use client';

// On supprime l'import de Sidebar
// import Sidebar from '@/components/dashboard/Sidebar'; 

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-nexus-black text-nexus-text">
      {/* 
          Plus de <Sidebar /> ici ! 
          On ajuste le padding pour que le contenu ne soit pas caché par la Navbar fixe 
      */}
      <div className="max-w-7xl mx-auto p-4 lg:p-8 pt-24">
        {children}
      </div>
    </div>
  );
}