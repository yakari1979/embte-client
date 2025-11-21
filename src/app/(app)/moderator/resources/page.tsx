// (app)/moderator/resources/page.tsx

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import {
    listAllAdminResources, createExternalResource, updateExternalResource, deleteExternalResource,
    ExternalResource, NewExternalResourceData, ResourceType
} from '@/services/api';
import { PlusCircle, Edit, Trash2, Video, FileText, Link as LinkIcon, Book, Loader2 } from 'lucide-react';

const MATIERES = ["Mathématiques", "Physique-Chimie", "SVT", "Français", "Histoire-Géographie", "Anglais", "Philosophie"];
const SOURCES = ["École au Sénégal", "Prof Express", "Khan Academy", "Autre"];


function isValidYoutubeUrl(url: string): boolean {
    const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[A-Za-z0-9_-]{11}(\S*)?$/;
    return youtubeRegex.test(url.trim());
}

function extractYoutubeId(url: string): string | null {
    const regex = /(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}


// --- SOUS-COMPOSANT : MODAL DE CRÉATION/ÉDITION (MIS À JOUR) ---
const ResourceModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    resource: ExternalResource | null;
}> = ({ isOpen, onClose, onSave, resource }) => {
    // --- L'ANNOTATION DE TYPE EST MISE À JOUR ICI ---
    const [formData, setFormData] = useState<NewExternalResourceData>({
        title: '', type: 'VIDEO', url: '', subject: MATIERES[0], source: SOURCES[0], description: '', thumbnailUrl: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (resource) {
            setFormData(resource);
        } else {
            setFormData({ title: '', type: 'VIDEO', url: '', subject: MATIERES[0], source: SOURCES[0], description: '', thumbnailUrl: '' });
        }
    }, [resource, isOpen]);

    // Le reste de votre composant Modal reste identique...
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value as ResourceType }));
    };

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     const token = Cookies.get('token');
    //     if (!token) { alert("Session expirée"); setLoading(false); return; }
        
    //     try {
    //         if (resource) {
    //             await updateExternalResource(resource.id, formData, token);
    //         } else {
    //             await createExternalResource(formData, token);
    //         }
    //         onSave();
    //         onClose();
    //     } catch (error) {
    //         alert("Erreur lors de la sauvegarde.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
    
        // --- Validation YouTube uniquement si type = VIDEO ---
        if (formData.type === "VIDEO") {
    
            if (!isValidYoutubeUrl(formData.url)) {
                alert("L’URL fournie n’est pas un lien YouTube valide.");
                setLoading(false);
                return;
            }
    
            // Génération automatique de la miniature si vide
            if (!formData.thumbnailUrl) {
                const id = extractYoutubeId(formData.url);
                if (id) {
                    formData.thumbnailUrl = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
                }
            }
        }
    
        const token = Cookies.get('token');
        if (!token) { alert("Session expirée"); setLoading(false); return; }
    
        try {
            if (resource) {
                await updateExternalResource(resource.id, formData, token);
            } else {
                await createExternalResource(formData, token);
            }
            onSave();
            onClose();
        } catch (error) {
            alert("Erreur lors de la sauvegarde.");
        } finally {
            setLoading(false);
        }
    };
    

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-surface rounded-lg shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b"><h2 className="text-xl font-bold">{resource ? "Modifier" : "Ajouter"} une Ressource</h2></div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Titre de la ressource" className="input-field" required />
                    <select name="type" value={formData.type} onChange={handleChange} className="input-field"><option value="VIDEO">Vidéo</option><option value="PDF">PDF</option><option value="LINK">Lien Article</option><option value="BOOK">Livre</option></select>
                    <input name="url" type="url" value={formData.url} onChange={handleChange} placeholder="URL de la ressource (lien YouTube, PDF...)" className="input-field" required />
                    <input name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} placeholder="URL de la miniature (optionnel)" className="input-field" />
                    <select name="subject" value={formData.subject} onChange={handleChange} className="input-field">{MATIERES.map(m => <option key={m} value={m}>{m}</option>)}</select>
                    <select name="source" value={formData.source} onChange={handleChange} className="input-field">{SOURCES.map(s => <option key={s} value={s}>{s}</option>)}</select>
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Courte description (optionnel)" className="input-field" rows={3}></textarea>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-4 rounded-b-lg">
                    <button type="button" onClick={onClose} className="btn-secondary">Annuler</button>
                    <button type="submit" disabled={loading} className="btn-primary min-w-[120px] justify-center">{loading ? <Loader2 className="animate-spin"/> : "Sauvegarder"}</button>
                </div>
            </form>
        </div>
    );
};

// --- COMPOSANT PRINCIPAL DE LA PAGE ---
const ResourcesManagementPage = () => {
    const [resources, setResources] = useState<ExternalResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResource, setEditingResource] = useState<ExternalResource | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const token = Cookies.get('token');
        if (!token) { setLoading(false); return; }
        try {
            const { data } = await listAllAdminResources(token);
            setResources(data);
        } catch (error) { console.error(error); } 
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleOpenCreateModal = () => {
        setEditingResource(null);
        setIsModalOpen(true);
    };
    const handleOpenEditModal = (resource: ExternalResource) => {
        setEditingResource(resource);
        setIsModalOpen(true);
    };
    const handleDelete = async (resourceId: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette ressource ?")) {
            const token = Cookies.get('token');
            if (!token) return;
            await deleteExternalResource(resourceId, token);
            fetchData();
        }
    };

    const typeIcons: Record<ResourceType, React.ReactNode> = {
        VIDEO: <Video className="h-5 w-5 text-red-500" />,
        PDF: <FileText className="h-5 w-5 text-blue-500" />,
        LINK: <LinkIcon className="h-5 w-5 text-gray-500" />,
        BOOK: <Book className="h-5 w-5 text-green-500" />,
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <header className="flex justify-between items-center mb-8">
                <div><h1 className="text-3xl font-bold">Gestion de la Bibliothèque</h1><p className="text-text-secondary mt-1">Ajoutez et gérez les ressources pédagogiques pour tous les élèves.</p></div>
                <button onClick={handleOpenCreateModal} className="btn-primary flex items-center gap-2"><PlusCircle size={20}/> Ajouter</button>
            </header>

            <div className="bg-surface rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y">
                        <thead className="bg-gray-50 dark:bg-gray-800/50"><tr><th className="th-cell">Titre</th><th className="th-cell">Matière</th><th className="th-cell">Source</th><th className="th-cell text-right">Actions</th></tr></thead>
                        <tbody className="divide-y">
                            {loading && <tr><td colSpan={4} className="cell-center"><Loader2 className="animate-spin"/></td></tr>}
                            {!loading && resources.map((res) => (
                                <tr key={res.id}>
                                    <td className="td-cell"><div className="flex items-center gap-3">{typeIcons[res.type]} <span className="font-semibold">{res.title}</span></div></td>
                                    <td className="td-cell">{res.subject}</td>
                                    <td className="td-cell">{res.source}</td>
                                    <td className="td-cell text-right">
                                        <div className="flex justify-end items-center gap-4">
                                            <button onClick={() => handleOpenEditModal(res)} className="action-icon text-yellow-500"><Edit size={16}/></button>
                                            <button onClick={() => handleDelete(res.id)} className="action-icon text-red-500"><Trash2 size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ResourceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={fetchData} resource={editingResource} />
        </div>
    );
};

export default ResourcesManagementPage;