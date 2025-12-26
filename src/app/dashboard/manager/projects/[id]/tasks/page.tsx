'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { managerService } from '@/services/api';
import { 
  ArrowLeft, Plus, Calendar, User, CheckCircle2, Circle, Clock, 
  AlertCircle, X, Save, Type, AlignLeft, Flag, Loader2 
} from 'lucide-react';
import Link from 'next/link';

export default function ProjectTasksPage() {
  const { id } = useParams();
  const [tasks, setTasks] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]); // Pour l'assignation
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // Charger les données
  const loadData = async () => {
    try {
      const [tasksData, projectData] = await Promise.all([
        managerService.getProjectTasks(id as string),
        managerService.getProjectDetails(id as string) // Pour avoir l'équipe
      ]);
      setTasks(tasksData);
      setTeam(projectData.workers || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [id]);

  // Fonction pour changer le statut
  const handleStatusChange = async (taskId: string, newStatus: string) => {
    // Optimistic UI (Mise à jour immédiate)
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    try {
      await managerService.updateTaskStatus(taskId, newStatus);
    } catch (e) {
      alert("Erreur mise à jour");
      loadData(); // Revert si erreur
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-nexus-text">Chargement des tâches...</div>;

  return (
    <div className="max-w-6xl mx-auto pb-20 pt-28 px-4">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
                <Link href={`/dashboard/manager/projects/${id}`} className="flex items-center gap-2 text-nexus-concrete hover:text-nexus-text mb-4 transition-colors">
                    <ArrowLeft size={18}/> Retour au Projet
                </Link>
                <h1 className="text-3xl font-bold text-nexus-text">Planification des Tâches</h1>
                <p className="text-nexus-concrete">Gérez l'avancement opérationnel étape par étape.</p>
            </div>
            <button 
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 bg-nexus-orange text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
            >
                <Plus size={20}/> Nouvelle Tâche
            </button>
        </div>

        {/* COLONNES KANBAN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TaskColumn 
                title="À FAIRE" 
                status="TODO" 
                color="border-nexus-concrete" 
                tasks={tasks} 
                onStatusChange={handleStatusChange}
                onSelect={setSelectedTask}
            />
            <TaskColumn 
                title="EN COURS" 
                status="IN_PROGRESS" 
                color="border-blue-500" 
                tasks={tasks} 
                onStatusChange={handleStatusChange}
                onSelect={setSelectedTask}
            />
            <TaskColumn 
                title="TERMINÉ" 
                status="DONE" 
                color="border-green-500" 
                tasks={tasks} 
                onStatusChange={handleStatusChange}
                onSelect={setSelectedTask}
            />
        </div>

        {/* MODAL CRÉATION */}
        {showCreate && (
            <CreateTaskModal 
                projectId={id} 
                team={team} 
                onClose={() => setShowCreate(false)} 
                onSuccess={() => { setShowCreate(false); loadData(); }} 
            />
        )}

        {/* MODAL DÉTAILS */}
        {selectedTask && (
            <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
        )}

    </div>
  );
}

// ----------------------------------------------------------------------
// COMPOSANT COLONNE
// ----------------------------------------------------------------------
function TaskColumn({ title, status, color, tasks, onStatusChange, onSelect }: any) {
    const filteredTasks = tasks.filter((t: any) => t.status === status);

    return (
        <div className="bg-nexus-dark border border-nexus-gray rounded-2xl p-4 flex flex-col h-[70vh]">
            <div className={`border-b-4 ${color} pb-4 mb-4 flex justify-between items-center`}>
                <h3 className="font-bold text-nexus-text tracking-wider">{title}</h3>
                <span className="bg-nexus-black px-2 py-1 rounded text-xs font-bold text-nexus-concrete">{filteredTasks.length}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                {filteredTasks.map((task: any) => (
                    <div 
                        key={task.id} 
                        onClick={() => onSelect(task)}
                        className="bg-nexus-black border border-nexus-gray p-4 rounded-xl hover:border-nexus-orange/50 cursor-pointer transition-all group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                task.priority === 'HIGH' ? 'bg-red-500/10 text-red-500' : 
                                task.priority === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'
                            }`}>
                                {task.priority}
                            </span>
                            {/* Bouton rapide de changement de statut */}
                            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                {status !== 'TODO' && (
                                    <button onClick={() => onStatusChange(task.id, 'TODO')} className="w-6 h-6 rounded bg-nexus-gray hover:bg-white/20 flex items-center justify-center text-xs">⏮</button>
                                )}
                                {status !== 'IN_PROGRESS' && (
                                    <button onClick={() => onStatusChange(task.id, 'IN_PROGRESS')} className="w-6 h-6 rounded bg-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center text-xs">▶</button>
                                )}
                                {status !== 'DONE' && (
                                    <button onClick={() => onStatusChange(task.id, 'DONE')} className="w-6 h-6 rounded bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center text-xs">✔</button>
                                )}
                            </div>
                        </div>
                        
                        <h4 className="font-bold text-nexus-text mb-2 line-clamp-2">{task.title}</h4>
                        
                        <div className="flex justify-between items-center text-xs text-nexus-concrete">
                            <div className="flex items-center gap-1">
                                <Calendar size={12}/> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '---'}
                            </div>
                            {task.assignedTo && (
                                <div className="flex items-center gap-1" title={task.assignedTo.firstName}>
                                    <div className="w-5 h-5 rounded-full bg-nexus-gray flex items-center justify-center text-[10px] text-black font-bold">
                                        {task.assignedTo.firstName[0]}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ----------------------------------------------------------------------
// MODAL CRÉATION (VERSION PREMIUM)
// ----------------------------------------------------------------------
function CreateTaskModal({ projectId, team, onClose, onSuccess }: any) {
    const [formData, setFormData] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assignedToId: '', projectId });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await managerService.createTask(formData);
            onSuccess();
        } catch (e) { alert("Erreur lors de la création"); } 
        finally { setLoading(false); }
    };

    // Style commun des inputs (Identique aux autres modales)
    const inputClasses = "w-full bg-nexus-black border border-nexus-gray rounded-xl pl-11 pr-4 py-3.5 text-nexus-text focus:border-nexus-orange outline-none transition-all placeholder:text-nexus-concrete/60 appearance-none";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity">
            <div className="bg-nexus-dark border border-nexus-gray w-full max-w-lg rounded-3xl p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300">
                <button onClick={onClose} className="absolute top-5 right-5 text-nexus-concrete hover:text-nexus-text p-2 rounded-full hover:bg-white/5 transition-colors">
                    <X size={24}/>
                </button>
                
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-nexus-text mb-2">Nouvelle Tâche</h2>
                    <p className="text-nexus-concrete text-sm">Ajoutez une étape au planning du chantier.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* TITRE */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-nexus-concrete uppercase tracking-wider ml-1">Titre de la tâche</label>
                        <div className="relative">
                            <Type className="absolute left-4 top-3.5 text-nexus-concrete" size={18} />
                            <input 
                                required 
                                placeholder="Ex: Coulage dalle RDC" 
                                className={inputClasses} 
                                onChange={e => setFormData({...formData, title: e.target.value})} 
                            />
                        </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-nexus-concrete uppercase tracking-wider ml-1">Description technique</label>
                        <div className="relative">
                            <AlignLeft className="absolute left-4 top-3.5 text-nexus-concrete" size={18} />
                            <textarea 
                                rows={3} 
                                placeholder="Détails, mesures, matériel nécessaire..." 
                                className={`${inputClasses} py-3`} 
                                onChange={e => setFormData({...formData, description: e.target.value})} 
                            />
                        </div>
                    </div>

                    {/* LIGNE PRIORITÉ & DATE */}
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-nexus-concrete uppercase tracking-wider ml-1">Priorité</label>
                            <div className="relative">
                                <Flag className="absolute left-4 top-3.5 text-nexus-concrete" size={18} />
                                <select className={inputClasses} onChange={e => setFormData({...formData, priority: e.target.value})}>
                                    <option value="LOW">Basse</option>
                                    <option value="MEDIUM">Moyenne</option>
                                    <option value="HIGH">Haute</option>
                                    <option value="CRITICAL">Critique</option>
                                </select>
                                <div className="absolute right-4 top-4 text-nexus-concrete pointer-events-none">▼</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-nexus-concrete uppercase tracking-wider ml-1">Échéance</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-3.5 text-nexus-concrete" size={18} />
                                <input 
                                    type="date" 
                                    className={inputClasses} 
                                    onChange={e => setFormData({...formData, dueDate: e.target.value})} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* ASSIGNATION */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-nexus-concrete uppercase tracking-wider ml-1">Assigner à (Optionnel)</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 text-nexus-concrete" size={18} />
                            <select className={inputClasses} onChange={e => setFormData({...formData, assignedToId: e.target.value})}>
                                <option value="">-- Sélectionner un ouvrier --</option>
                                {team.map((w: any) => (
                                    <option key={w.id} value={w.id}>{w.firstName} {w.lastName} ({w.jobTitle})</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-4 text-nexus-concrete pointer-events-none">▼</div>
                        </div>
                    </div>

                    <button disabled={loading} className="w-full bg-nexus-orange text-black font-bold py-4 rounded-xl mt-6 hover:scale-[1.02] transition-transform shadow-lg shadow-nexus-orange/20 text-lg flex items-center justify-center gap-2 disabled:opacity-50">
                        {loading ? <Loader2 className="animate-spin"/> : <Save size={20}/>}
                        {loading ? "Création..." : "Ajouter au planning"}
                    </button>
                </form>
            </div>
        </div>
    )
}

// ----------------------------------------------------------------------
// MODAL DÉTAILS
// ----------------------------------------------------------------------
function TaskDetailsModal({ task, onClose }: any) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-nexus-dark border border-nexus-gray w-full max-w-md rounded-3xl p-8 relative shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-nexus-concrete hover:text-white"><X size={24}/></button>
                
                <div className="flex items-center gap-2 mb-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                        task.status === 'DONE' ? 'bg-green-500 text-black' : 'bg-blue-500 text-white'
                    }`}>
                        {task.status}
                    </span>
                    <span className="text-xs text-nexus-concrete font-bold border border-nexus-gray px-2 py-1 rounded">
                        {task.priority}
                    </span>
                </div>

                <h2 className="text-2xl font-bold text-nexus-text mb-4">{task.title}</h2>
                <div className="bg-nexus-black p-4 rounded-xl border border-nexus-gray mb-6">
                    <p className="text-nexus-concrete text-sm whitespace-pre-wrap">{task.description || "Aucune description."}</p>
                </div>

                <div className="space-y-3 text-sm text-nexus-text">
                    <div className="flex justify-between border-b border-nexus-gray pb-2">
                        <span className="text-nexus-concrete">Date Limite</span>
                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Non définie"}</span>
                    </div>
                    <div className="flex justify-between border-b border-nexus-gray pb-2">
                        <span className="text-nexus-concrete">Assigné à</span>
                        <span>{task.assignedTo ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}` : "Non assigné"}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}