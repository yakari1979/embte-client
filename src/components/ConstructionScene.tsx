'use client';

export default function ConstructionScene() {
  return (
    <div className="w-full h-full relative overflow-hidden rounded-2xl border border-white/5">
      
      {/* 1. Iframe Sketchfab */}
      <iframe 
        title="Construction Site 3D" 
        className="w-[120%] h-[120%] -ml-[10%] -mt-[10%] border-0 relative z-0" // ASTUCE : On zoome à 120% pour pousser les bords hors du cadre
        // Paramètres pour nettoyer au maximum
        src="https://sketchfab.com/models/62fc443a7d91465f844de1cf95731f60/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_controls=0&ui_stop=0&ui_watermark=0&transparent=1" 
        allow="autoplay; fullscreen; xr-spatial-tracking" 
      >
      </iframe>

      {/* 2. Masque Haut (Cache le titre et l'auteur) */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-nexus-black via-nexus-black/80 to-transparent z-10 pointer-events-none" />

      {/* 3. Masque Bas (Cache le logo Sketchfab et la barre de lecture) */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-nexus-black via-nexus-black/80 to-transparent z-10 pointer-events-none" />

      {/* 4. Bloqueur de clic (Empêche de cliquer sur les logos cachés par erreur) */}
      <div className="absolute top-0 left-0 w-full h-full z-20 bg-transparent">
        {/* On laisse le centre vide pour pouvoir tourner le modèle, mais on bloque les coins */}
      </div>

    </div>
  );
}