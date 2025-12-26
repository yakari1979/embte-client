'use client';

import React, { useState, useEffect } from 'react';
import { workerService } from '@/services/api';
import { FileText, CheckCircle2, Clock, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ReportsHistoryPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    workerService.getMyReports()
      .then(setReports)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-nexus-black text-nexus-text p-4 pt-24 pb-24">
      <div className="max-w-md mx-auto">
        
        <div className="flex justify-between items-center mb-6">
            <Link href="/dashboard/worker" className="text-nexus-concrete hover:text-white flex items-center gap-2">
                <ArrowLeft size={20}/> Retour
            </Link>
            <h1 className="text-2xl font-bold">Mes Rapports</h1>
        </div>

        {/* Bouton Nouveau Rapport */}
        <Link href="/dashboard/worker/reports/new" className="w-full bg-nexus-orange text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 mb-8 hover:scale-105 transition-transform shadow-lg shadow-nexus-orange/20">
            <Plus size={20}/> Nouveau Rapport
        </Link>

        {loading ? (
            <p className="text-center text-nexus-concrete">Chargement...</p>
        ) : reports.length === 0 ? (
            <div className="text-center py-10 bg-nexus-dark rounded-2xl border border-nexus-gray">
                <FileText size={40} className="mx-auto text-nexus-concrete mb-2"/>
                <p className="text-nexus-concrete">Aucun rapport envoyé.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {reports.map((report: any) => (
                    <div key={report.id} className="bg-nexus-dark p-4 rounded-2xl border border-nexus-gray flex justify-between items-center">
                        <div>
                            <p className="font-bold text-white mb-1">{report.project.name}</p>
                            <p className="text-xs text-nexus-concrete flex items-center gap-1">
                                <Clock size={12}/> {new Date(report.createdAt).toLocaleDateString()} à {new Date(report.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                            <p className="text-sm text-nexus-concrete mt-2 line-clamp-1">{report.content}</p>
                        </div>
                        
                        {/* Indicateur de statut */}
                        <div className="ml-4">
                            {report.status === 'REVIEWED' ? (
                                <div className="flex flex-col items-center text-green-500">
                                    <CheckCircle2 size={24}/>
                                    <span className="text-[10px] font-bold uppercase mt-1">Vu</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-yellow-500">
                                    <div className="w-6 h-6 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin"/>
                                    <span className="text-[10px] font-bold uppercase mt-1">Envoi</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}