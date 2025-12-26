'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { adminService } from '@/services/api';
import { gsap } from 'gsap';
import { ArrowRight, MapPin, HardHat, Calendar, Activity } from 'lucide-react';
import Link from 'next/link';

export default function ActiveProjectsPage() {
  const [projects, setProjects] = useState([]);
  const container = useRef(null);

  useEffect(() => {
    adminService.getActiveProjects().then(setProjects);
  }, []);

  useLayoutEffect(() => {
    if (!projects.length) return;
    const ctx = gsap.context(() => {
      gsap.from(".project-row", { x: -30, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" });
    }, container);
    return () => ctx.revert();
  }, [projects]);

  return (
    <div ref={container} className="max-w-7xl mx-auto pb-20 pt-28 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-nexus-text mb-1">Chantiers Actifs</h1>
        <p className="text-nexus-concrete">Suivi des projets validés et en cours d'exécution.</p>
      </div>

      <div className="bg-nexus-dark border border-nexus-gray rounded-3xl overflow-hidden shadow-xl">
        <div className="grid gap-1 p-4">
            {projects.map((project: any) => (
                <Link 
                    href={`/dashboard/admin/projects/${project.id}/manage`} // Lien vers la gestion
                    key={project.id} 
                    className="project-row flex flex-col md:flex-row items-center justify-between p-6 bg-nexus-black border border-nexus-gray rounded-2xl hover:border-nexus-orange/50 transition-all group"
                >
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${project.status === 'IN_PROGRESS' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                {project.status === 'IN_PROGRESS' ? 'En Cours' : 'Planifié'}
                            </span>
                            <span className="text-nexus-concrete text-sm flex items-center gap-1">
                                <MapPin size={14}/> {project.location}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-nexus-text group-hover:text-nexus-orange transition-colors">{project.name}</h3>
                    </div>

                    <div className="flex items-center gap-8 mt-4 md:mt-0">
                        {/* Manager Assigné */}
                        <div className="text-right">
                            <p className="text-xs text-nexus-concrete uppercase font-bold mb-1">Chef de Chantier</p>
                            <div className="flex items-center gap-2 justify-end">
                                <HardHat size={16} className={project.manager ? "text-nexus-orange" : "text-nexus-gray"} />
                                <span className={project.manager ? "text-nexus-text" : "text-nexus-concrete italic"}>
                                    {project.manager ? `${project.manager.firstName} ${project.manager.lastName}` : "Non assigné"}
                                
                                </span>
                            </div>
                        </div>
                        
                        <div className="w-10 h-10 rounded-full bg-nexus-dark border border-nexus-gray flex items-center justify-center group-hover:bg-nexus-orange group-hover:text-black transition-colors">
                            <ArrowRight size={20} />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      </div>
    </div>
  );
}