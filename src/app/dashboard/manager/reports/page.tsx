'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { managerService, SERVER_URL } from '@/services/api';
import { gsap } from 'gsap';
import { 
  FileText, CheckCircle2, Clock, MapPin, User, CloudSun, 
  X, Image as ImageIcon, Loader2, Eye 
} from 'lucide-react';

export default function ManagerReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const container = useRef(null);

  const fetchReports = () => {
    managerService.getReports()
      .then(setReports)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReports(); }, []);

  useLayoutEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.from(".report-card", { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" });
    }, container);
    return () => ctx.revert();
  }, [loading, reports]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-nexus-black"><Loader2 className="animate-spin text-nexus-orange w-12 h-12"/></div>;

  return (
    <div ref={container} className="max-w-7xl mx-auto pb-20 pt-28 px-4">
      
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-nexus-text mb-1">Rapports de Chantier</h1>
            <p className="text-nexus-concrete">Suivi quotidien des activités remontées par vos équipes.</p>
        </div>
        <div className="bg-nexus-dark px-4 py-2 rounded-xl border border-nexus-gray text-sm font-bold text-nexus-text">
            {reports.filter((r: any) => r.status === 'PENDING').length} Nouveaux rapports
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-20 bg-nexus-dark border border-nexus-gray rounded-3xl">
            <FileText size={48} className="text-nexus-concrete opacity-50 mx-auto mb-4"/>
            <p className="text-nexus-concrete">Aucun rapport reçu pour le moment.</p>
        </div>
      ) : (
        <div className="grid gap-4">
            {reports.map((report) => (
                <div 
                    key={report.id} 
                    onClick={() => setSelectedReport(report)}
                    className={`report-card p-6 rounded-2xl border transition-all cursor-pointer group flex flex-col md:flex-row gap-6 justify-between items-start md:items-center ${
                        report.status === 'PENDING' 
                        ? 'bg-nexus-dark border-nexus-orange/50 hover:bg-nexus-orange/5' 
                        : 'bg-nexus-black border-nexus-gray hover:border-nexus-concrete'
                    }`}
                >
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                            report.status === 'PENDING' ? 'bg-nexus-orange text-black' : 'bg-nexus-dark border border-nexus-gray text-nexus-concrete'
                        }`}>
                            <FileText size={20}/>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-bold text-nexus-text">{report.project.name}</h3>
                                {report.status === 'PENDING' && (
                                    <span className="bg-nexus-orange text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase">Nouveau</span>
                                )}
                            </div>
                            <p className="text-sm text-nexus-concrete mb-2 line-clamp-1">{report.content}</p>
                            <div className="flex items-center gap-4 text-xs text-nexus-concrete">
                                <span className="flex items-center gap-1"><User size={12}/> {report.author.firstName} {report.author.lastName}</span>
                                <span className="flex items-center gap-1"><Clock size={12}/> {new Date(report.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        {/* Indicateur de médias */}
                        {JSON.parse(report.media || "[]").length > 0 && (
                            <span className="flex items-center gap-1 text-xs font-bold text-nexus-text bg-nexus-black px-3 py-1 rounded border border-nexus-gray">
                                <ImageIcon size={12}/> {JSON.parse(report.media || "[]").length} Fichiers
                            </span>
                        )}
                        
                        <button className="flex items-center gap-2 text-sm font-bold text-nexus-orange group-hover:underline">
                            Voir détails <Eye size={16}/>
                        </button>
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* MODAL DÉTAILS */}
      {selectedReport && (
        <ReportDetailsModal 
            report={selectedReport} 
            onClose={() => setSelectedReport(null)} 
            onValidate={() => {
                fetchReports(); // Rafraichir la liste
                setSelectedReport(null); // Fermer
            }}
        />
      )}

    </div>
  );
}

// ============================================================================
// MODAL DÉTAILS RAPPORT
// ============================================================================
function ReportDetailsModal({ report, onClose, onValidate }: any) {
    const [validating, setValidating] = useState(false);
    const mediaFiles = JSON.parse(report.media || "[]");

    const handleValidate = async () => {
        setValidating(true);
        try {
            await managerService.validateReport(report.id);
            onValidate();
        } catch (e) {
            alert("Erreur validation");
            setValidating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity">
            <div className="bg-nexus-dark border border-nexus-gray w-full max-w-2xl rounded-3xl p-0 relative shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
                
                {/* Header */}
                <div className="p-6 border-b border-nexus-gray flex justify-between items-start bg-nexus-black/30">
                    <div>
                        <p className="text-xs text-nexus-orange font-bold uppercase tracking-wider mb-1">Rapport de chantier</p>
                        <h2 className="text-2xl font-bold text-nexus-text">{report.project.name}</h2>
                        <p className="text-nexus-concrete text-sm flex items-center gap-2 mt-1">
                            <MapPin size={14}/> {report.project.location}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-nexus-concrete hover:text-white transition-colors">
                        <X size={24}/>
                    </button>
                </div>

                {/* Contenu Scrollable */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    
                    {/* Infos Méta */}
                    <div className="flex flex-wrap gap-4 mb-8">
                        <InfoBadge icon={User} label="Auteur" value={`${report.author.firstName} ${report.author.lastName}`} />
                        <InfoBadge icon={Clock} label="Date" value={new Date(report.createdAt).toLocaleString()} />
                        {report.weather && <InfoBadge icon={CloudSun} label="Météo" value={report.weather} />}
                    </div>

                    {/* Contenu Texte */}
                    <div className="bg-nexus-black p-6 rounded-2xl border border-nexus-gray mb-8">
                        <h3 className="text-sm font-bold text-nexus-concrete uppercase mb-3">Description des travaux</h3>
                        <p className="text-nexus-text leading-relaxed whitespace-pre-wrap">{report.content}</p>
                    </div>

                    {/* Galerie Médias */}
                    {mediaFiles.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-nexus-concrete uppercase mb-4 flex items-center gap-2">
                                <ImageIcon size={16}/> Photos & Vidéos jointes
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {mediaFiles.map((file: any, index: number) => (
                                    <a href={`${SERVER_URL}${file.url}`} target="_blank" rel="noopener noreferrer" key={index} className="block relative aspect-square rounded-xl overflow-hidden border border-nexus-gray hover:border-nexus-orange transition-colors group">
                                        {file.type === 'IMAGE' ? (
                                            <img src={`${SERVER_URL}${file.url}`} alt="Chantier" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-nexus-black text-nexus-concrete">
                                                <span className="text-xs font-bold uppercase">{file.type}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs">
                                            Voir
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-nexus-gray bg-nexus-black/30 flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-nexus-concrete hover:bg-white/5 transition-colors">
                        Fermer
                    </button>
                    {report.status === 'PENDING' ? (
                        <button 
                            onClick={handleValidate} 
                            disabled={validating}
                            className="px-8 py-3 rounded-xl bg-nexus-orange text-black font-bold hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50"
                        >
                            {validating ? <Loader2 className="animate-spin" size={18}/> : <CheckCircle2 size={18}/>}
                            Marquer comme Lu
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 text-green-500 font-bold px-6 py-3 border border-green-500/30 bg-green-500/10 rounded-xl">
                            <CheckCircle2 size={18}/> Rapport Validé
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

const InfoBadge = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-center gap-3 bg-nexus-black px-4 py-2 rounded-xl border border-nexus-gray">
        <Icon size={16} className="text-nexus-orange"/>
        <div>
            <p className="text-[10px] text-nexus-concrete uppercase font-bold">{label}</p>
            <p className="text-sm text-nexus-text font-medium">{value}</p>
        </div>
    </div>
);