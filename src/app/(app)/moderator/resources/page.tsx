// // (app)/moderator/resources/page.tsx

// "use client";

// import React, { useState, useEffect, useCallback } from 'react';
// import Cookies from 'js-cookie';
// import {
//     listAllAdminResources, createExternalResource, updateExternalResource, deleteExternalResource,
//     ExternalResource, NewExternalResourceData, ResourceType
// } from '@/services/api';
// import { PlusCircle, Edit, Trash2, Video, FileText, Link as LinkIcon, Book, Loader2 } from 'lucide-react';

// const MATIERES = ["Mathématiques", "Physique-Chimie", "SVT", "Français", "Histoire-Géographie", "Anglais", "Philosophie"];
// const SOURCES = ["École au Sénégal", "Prof Express", "Khan Academy", "Autre"];


// function isValidYoutubeUrl(url: string): boolean {
//     const youtubeRegex =
//         /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[A-Za-z0-9_-]{11}(\S*)?$/;
//     return youtubeRegex.test(url.trim());
// }

// function extractYoutubeId(url: string): string | null {
//     const regex = /(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;
//     const match = url.match(regex);
//     return match ? match[1] : null;
// }

// function cleanYoutubeUrl(url: string): string {
//     const id = extractYoutubeId(url);
//     return id ? `https://www.youtube.com/watch?v=${id}` : url;
// }


// // --- SOUS-COMPOSANT : MODAL DE CRÉATION/ÉDITION (MIS À JOUR) ---
// const ResourceModal: React.FC<{
//     isOpen: boolean;
//     onClose: () => void;
//     onSave: () => void;
//     resource: ExternalResource | null;
// }> = ({ isOpen, onClose, onSave, resource }) => {
//     // --- L'ANNOTATION DE TYPE EST MISE À JOUR ICI ---
//     const [formData, setFormData] = useState<NewExternalResourceData>({
//         title: '', type: 'VIDEO', url: '', subject: MATIERES[0], source: SOURCES[0], description: '', thumbnailUrl: ''
//     });
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (resource) {
//             setFormData(resource);
//         } else {
//             setFormData({ title: '', type: 'VIDEO', url: '', subject: MATIERES[0], source: SOURCES[0], description: '', thumbnailUrl: '' });
//         }
//     }, [resource, isOpen]);

//     // Le reste de votre composant Modal reste identique...
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//         setFormData(prev => ({ ...prev, [e.target.name]: e.target.value as ResourceType }));
//     };


//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);

//         if (formData.type === "VIDEO") {
//             const id = extractYoutubeId(formData.url);
//             if (!id) {
//                 alert("L’URL fournie n’est pas un lien YouTube valide.");
//                 setLoading(false);
//                 return;
//             }
        
//             // Nettoyer l'URL
//             formData.url = `https://www.youtube.com/watch?v=${id}`;
        
//             // Génération automatique de la miniature si vide
//             if (!formData.thumbnailUrl) {
//                 formData.thumbnailUrl = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
//             }
//         }
        

    
//         const token = Cookies.get('token');
//         if (!token) { alert("Session expirée"); setLoading(false); return; }
    
//         try {
//             if (resource) {
//                 await updateExternalResource(resource.id, formData, token);
//             } else {
//                 await createExternalResource(formData, token);
//             }
//             onSave();
//             onClose();
//         } catch (error) {
//             alert("Erreur lors de la sauvegarde.");
//         } finally {
//             setLoading(false);
//         }
//     };
    

//     if (!isOpen) return null;
//     return (
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
//             <form onSubmit={handleSubmit} className="bg-surface rounded-lg shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
//                 <div className="p-6 border-b"><h2 className="text-xl font-bold">{resource ? "Modifier" : "Ajouter"} une Ressource</h2></div>
//                 <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
//                     <input name="title" value={formData.title} onChange={handleChange} placeholder="Titre de la ressource" className="input-field" required />
//                     <select name="type" value={formData.type} onChange={handleChange} className="input-field"><option value="VIDEO">Vidéo</option><option value="PDF">PDF</option><option value="LINK">Lien Article</option><option value="BOOK">Livre</option></select>
//                     <input name="url" type="url" value={formData.url} onChange={handleChange} placeholder="URL de la ressource (lien YouTube, PDF...)" className="input-field" required />
//                     <input name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} placeholder="URL de la miniature (optionnel)" className="input-field" />
//                     <select name="subject" value={formData.subject} onChange={handleChange} className="input-field">{MATIERES.map(m => <option key={m} value={m}>{m}</option>)}</select>
//                     <select name="source" value={formData.source} onChange={handleChange} className="input-field">{SOURCES.map(s => <option key={s} value={s}>{s}</option>)}</select>
//                     <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Courte description (optionnel)" className="input-field" rows={3}></textarea>
//                 </div>
//                 <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-4 rounded-b-lg">
//                     <button type="button" onClick={onClose} className="btn-secondary">Annuler</button>
//                     <button type="submit" disabled={loading} className="btn-primary min-w-[120px] justify-center">{loading ? <Loader2 className="animate-spin"/> : "Sauvegarder"}</button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// // --- COMPOSANT PRINCIPAL DE LA PAGE ---
// const ResourcesManagementPage = () => {
//     const [resources, setResources] = useState<ExternalResource[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingResource, setEditingResource] = useState<ExternalResource | null>(null);

//     const fetchData = useCallback(async () => {
//         setLoading(true);
//         const token = Cookies.get('token');
//         if (!token) { setLoading(false); return; }
//         try {
//             const { data } = await listAllAdminResources(token);
//             setResources(data);
//         } catch (error) { console.error(error); } 
//         finally { setLoading(false); }
//     }, []);

//     useEffect(() => { fetchData(); }, [fetchData]);

//     const handleOpenCreateModal = () => {
//         setEditingResource(null);
//         setIsModalOpen(true);
//     };
//     const handleOpenEditModal = (resource: ExternalResource) => {
//         setEditingResource(resource);
//         setIsModalOpen(true);
//     };
//     const handleDelete = async (resourceId: string) => {
//         if (window.confirm("Êtes-vous sûr de vouloir supprimer cette ressource ?")) {
//             const token = Cookies.get('token');
//             if (!token) return;
//             await deleteExternalResource(resourceId, token);
//             fetchData();
//         }
//     };

//     const typeIcons: Record<ResourceType, React.ReactNode> = {
//         VIDEO: <Video className="h-5 w-5 text-red-500" />,
//         PDF: <FileText className="h-5 w-5 text-blue-500" />,
//         LINK: <LinkIcon className="h-5 w-5 text-gray-500" />,
//         BOOK: <Book className="h-5 w-5 text-green-500" />,
//     };

//     return (
//         <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
//             <header className="flex justify-between items-center mb-8">
//                 <div><h1 className="text-3xl font-bold">Gestion de la Bibliothèque</h1><p className="text-text-secondary mt-1">Ajoutez et gérez les ressources pédagogiques pour tous les élèves.</p></div>
//                 <button onClick={handleOpenCreateModal} className="btn-primary flex items-center gap-2"><PlusCircle size={20}/> Ajouter</button>
//             </header>

//             <div className="bg-surface rounded-lg shadow-md">
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y">
//                         <thead className="bg-gray-50 dark:bg-gray-800/50"><tr><th className="th-cell">Titre</th><th className="th-cell">Matière</th><th className="th-cell">Source</th><th className="th-cell text-right">Actions</th></tr></thead>
//                         <tbody className="divide-y">
//                             {loading && <tr><td colSpan={4} className="cell-center"><Loader2 className="animate-spin"/></td></tr>}
//                             {!loading && resources.map((res) => (
//                                 <tr key={res.id}>
//                                     <td className="td-cell"><div className="flex items-center gap-3">{typeIcons[res.type]} <span className="font-semibold">{res.title}</span></div></td>
//                                     <td className="td-cell">{res.subject}</td>
//                                     <td className="td-cell">{res.source}</td>
//                                     <td className="td-cell text-right">
//                                         <div className="flex justify-end items-center gap-4">
//                                             <button onClick={() => handleOpenEditModal(res)} className="action-icon text-yellow-500"><Edit size={16}/></button>
//                                             <button onClick={() => handleDelete(res.id)} className="action-icon text-red-500"><Trash2 size={16}/></button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//             <ResourceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={fetchData} resource={editingResource} />
//         </div>
//     );
// };

// export default ResourcesManagementPage;


// (app)/moderator/resources/page.tsx

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import {
    listAllAdminResources, createExternalResource, updateExternalResource, deleteExternalResource,
    ExternalResource, NewExternalResourceData, ResourceType
} from '@/services/api';
import { 
    PlusCircle, Edit, Trash2, Video, FileText, Link as LinkIcon, Book, Loader2, 
    X, Search, Filter, ExternalLink, Image as ImageIcon, Type, Globe, AlignLeft 
} from 'lucide-react';

const MATIERES = ["Mathématiques", "Physique-Chimie", "SVT", "Français", "Histoire-Géographie", "Anglais", "Philosophie"];
const SOURCES = ["École au Sénégal", "Prof Express", "Khan Academy", "Autre"];

// --- UTILITAIRES ---
function extractYoutubeId(url: string): string | null {
    const regex = /(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// --- COMPOSANT MODAL DESIGN (REFONDU) ---
const ResourceModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    resource: ExternalResource | null;
}> = ({ isOpen, onClose, onSave, resource }) => {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value as ResourceType }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Logique YouTube automatique
        if (formData.type === "VIDEO") {
            const id = extractYoutubeId(formData.url);
            if (id) {
                formData.url = `https://www.youtube.com/watch?v=${id}`;
                if (!formData.thumbnailUrl) {
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

    // Classes pour les inputs (style moderne et adaptatif)
    const inputClass = "w-full px-4 py-3 bg-background border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-text-primary placeholder-text-subtle";
    const labelClass = "block text-sm font-medium text-text-secondary mb-1.5 flex items-center gap-2";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            {/* Fond flouté */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

            {/* Conteneur Modal */}
            <div 
                className="relative bg-surface w-full max-w-2xl rounded-2xl shadow-2xl transform transition-all scale-100 overflow-hidden flex flex-col max-h-[90vh]" 
                onClick={(e) => e.stopPropagation()}
            >
                {/* En-tête */}
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">
                            {resource ? "Modifier la ressource" : "Ajouter une ressource"}
                        </h2>
                        <p className="text-xs text-text-secondary mt-0.5">Remplissez les informations ci-dessous pour la bibliothèque.</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-text-secondary transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Corps du formulaire (Scrollable) */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                    
                    {/* Ligne 1 : Type et Matière */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}><Filter size={16}/> Type de contenu</label>
                            <div className="relative">
                                <select name="type" value={formData.type} onChange={handleChange} className={`${inputClass} appearance-none`}>
                                    <option value="VIDEO">🎥 Vidéo</option>
                                    <option value="PDF">📄 Document PDF</option>
                                    <option value="LINK">🔗 Lien Web</option>
                                    <option value="BOOK">📚 Livre</option>
                                </select>
                                {/* Petite flèche custom si besoin, sinon le navigateur gère */}
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}><Book size={16}/> Matière</label>
                            <select name="subject" value={formData.subject} onChange={handleChange} className={inputClass}>
                                {MATIERES.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Ligne 2 : Titre */}
                    <div>
                        <label className={labelClass}><Type size={16}/> Titre de la ressource</label>
                        <input 
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange} 
                            placeholder="Ex: Introduction aux Probabilités..." 
                            className={inputClass} 
                            required 
                        />
                    </div>

                    {/* Ligne 3 : URL */}
                    <div>
                        <label className={labelClass}><LinkIcon size={16}/> Lien URL (YouTube, PDF, Site...)</label>
                        <input 
                            name="url" 
                            type="url" 
                            value={formData.url} 
                            onChange={handleChange} 
                            placeholder="https://..." 
                            className={inputClass} 
                            required 
                        />
                        {formData.type === 'VIDEO' && (
                            <p className="text-xs text-blue-500 mt-1.5 ml-1">
                                💡 Astuce : Collez simplement le lien YouTube, la miniature sera automatique.
                            </p>
                        )}
                    </div>

                    {/* Ligne 4 : Source */}
                    <div>
                        <label className={labelClass}><Globe size={16}/> Source / Origine</label>
                        <select name="source" value={formData.source} onChange={handleChange} className={inputClass}>
                            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {/* Ligne 5 : Description */}
                    <div>
                        <label className={labelClass}><AlignLeft size={16}/> Description (Optionnelle)</label>
                        <textarea 
                            name="description" 
                            value={formData.description || ''} 
                            onChange={handleChange} 
                            placeholder="Un bref résumé pour aider les élèves..." 
                            className={`${inputClass} min-h-[100px] resize-y`}
                        ></textarea>
                    </div>
                    
                    {/* Ligne 6 : Miniature (Si pas vidéo) */}
                    {formData.type !== 'VIDEO' && (
                        <div>
                            <label className={labelClass}><ImageIcon size={16}/> Image de couverture (URL optionnelle)</label>
                            <input 
                                name="thumbnailUrl" 
                                value={formData.thumbnailUrl || ''} 
                                onChange={handleChange} 
                                placeholder="https://image.com/cover.jpg" 
                                className={inputClass} 
                            />
                        </div>
                    )}
                </form>

                {/* Pied de page (Actions) */}
                <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex justify-end gap-3">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="px-5 py-2.5 rounded-xl text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors"
                    >
                        Annuler
                    </button>
                    <button 
                        type="button" 
                        onClick={handleSubmit} 
                        disabled={loading} 
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5"/> : (resource ? "Enregistrer les modifications" : "Créer la ressource")}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- COMPOSANT PRINCIPAL DE LA PAGE ---
const ResourcesManagementPage = () => {
    const [resources, setResources] = useState<ExternalResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResource, setEditingResource] = useState<ExternalResource | null>(null);
    const [searchTerm, setSearchTerm] = useState(""); // Ajout filtre recherche simple

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

    // Filtrage
    const filteredResources = resources.filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const typeIcons: Record<ResourceType, React.ReactNode> = {
        VIDEO: <Video className="h-5 w-5 text-red-500" />,
        PDF: <FileText className="h-5 w-5 text-blue-500" />,
        LINK: <LinkIcon className="h-5 w-5 text-purple-500" />,
        BOOK: <Book className="h-5 w-5 text-green-500" />,
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen bg-background text-text-primary">
            
            {/* En-tête */}
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Bibliothèque Numérique</h1>
                    <p className="text-text-secondary mt-1">Gérez les ressources pédagogiques accessibles aux élèves.</p>
                </div>
                <button 
                    onClick={handleOpenCreateModal} 
                    className="btn-primary w-full md:w-auto px-6 py-3 rounded-xl shadow-lg shadow-blue-500/20"
                >
                    <PlusCircle size={20}/> 
                    <span>Ajouter une ressource</span>
                </button>
            </header>

            {/* Barre d'outils */}
            <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Search size={20} />
                </div>
                <input 
                    type="text"
                    placeholder="Rechercher par titre ou matière..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-surface border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-text-primary placeholder-text-subtle"
                />
            </div>

            {/* Liste des ressources */}
            <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center text-text-subtle">
                        <Loader2 className="animate-spin h-10 w-10 mb-4 text-blue-500"/>
                        <p>Chargement des ressources...</p>
                    </div>
                ) : filteredResources.length === 0 ? (
                    <div className="p-16 text-center text-text-subtle">
                        <p>Aucune ressource trouvée pour le moment.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
                            <thead className="bg-gray-50/50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Titre</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Matière</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Source</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-surface">
                                {filteredResources.map((res) => (
                                    <tr key={res.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:scale-110 transition-transform">
                                                    {typeIcons[res.type]}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-text-primary line-clamp-1 max-w-[200px] md:max-w-md" title={res.title}>{res.title}</p>
                                                    <span className="text-xs text-text-subtle capitalize">{res.type.toLowerCase()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                                                {res.subject}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                            {res.source}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleOpenEditModal(res)} className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-all" title="Modifier">
                                                    <Edit size={18}/>
                                                </button>
                                                <button onClick={() => handleDelete(res.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all" title="Supprimer">
                                                    <Trash2 size={18}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            <ResourceModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={fetchData} 
                resource={editingResource} 
            />
        </div>
    );
};

export default ResourcesManagementPage;