"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { PlusCircle, Edit, Trash2, Send, Loader2 } from 'lucide-react';
import { 
  getBlogPostsForAdmin, 
    createBlogPost, 
    updateBlogPost, 
    deleteBlogPost, 
    Post 
} from '@/services/api'; // Assurez-vous que le chemin vers votre service API est correct
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Importez le style de l'éditeur

// Chargement dynamique de l'éditeur pour éviter les problèmes de rendu côté serveur (SSR)
const ReactQuill = dynamic(() => import('react-quill'), { 
    ssr: false,
    loading: () => <p>Chargement de l'éditeur...</p> 
});

const BlogManagementPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  
  // États pour le formulaire
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<Post>>({}); // Stocke le post en cours d'édition
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = Cookies.get('token');
      if (!token) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }
      
      // --- MODIFICATION ICI ---
      const { data } = await getBlogPostsForAdmin(token); // On appelle la bonne fonction
      setPosts(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Impossible de charger les articles.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleEdit = (post: Post) => {
    setCurrentPost(post);
    setTitle(post.title);
    setContent(post.content);
    setIsPublished(post.published);
    setIsFormVisible(true);
    window.scrollTo(0, 0); // Fait défiler la page vers le haut
  };

  const handleNewPost = () => {
    setCurrentPost({});
    setTitle('');
    setContent('');
    setCoverImage(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Réinitialise le champ de fichier
    setIsPublished(false);
    setIsFormVisible(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
        const token = Cookies.get('token');
        if (!token) {
            alert("Votre session a expiré. Veuillez vous reconnecter.");
            return;
        }
        try {
            await deleteBlogPost(postId, token);
            fetchPosts();
        } catch (err) {
            alert('Erreur lors de la suppression de l\'article.');
        }
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = Cookies.get('token');

    if (!token) {
        alert("Votre session a expiré. Veuillez vous reconnecter.");
        setIsSubmitting(false);
        return;
    }

    const postData = { title, content, published: isPublished, coverImage };
    
    try {
      if (currentPost.id) {
        await updateBlogPost(currentPost.id, postData, token);
      } else {
        await createBlogPost(postData, token);
      }
      fetchPosts();
      setIsFormVisible(false);
    } catch (err) {
      alert("Erreur lors de l'enregistrement de l'article.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Configuration pour l'éditeur ReactQuill
  const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']
    ],
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold text-text-primary">Gestion du Blog / Annonces</h1>
            <p className="text-text-secondary mt-1">Créez et gérez les communications officielles de l'établissement.</p>
        </div>
        {!isFormVisible && (
            <button onClick={handleNewPost} className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
                <PlusCircle size={20} />
                <span>Nouvel Article</span>
            </button>
        )}
      </header>
      
      {isFormVisible && (
        <section className="bg-surface p-6 rounded-lg shadow-md mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">{currentPost.id ? "Modifier l'article" : "Créer un nouvel article"}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Titre de l'article"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              required
              disabled={isSubmitting}
            />

            {/* --- NOUVEAU CHAMP POUR L'IMAGE --- */}
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Image de couverture (optionnel)</label>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => setCoverImage(e.target.files ? e.target.files[0] : null)}
                    className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept="image/*"
                />
            </div>
            <div className="bg-white text-gray-900 rounded-md overflow-hidden">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent}
                modules={quillModules}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <label className="flex items-center gap-3 cursor-pointer text-text-secondary">
                    <input 
                        type="checkbox" 
                        checked={isPublished} 
                        onChange={(e) => setIsPublished(e.target.checked)} 
                        className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500"
                        disabled={isSubmitting}
                    />
                    Rendre cet article visible publiquement
                </label>
                <div className="flex gap-4">
                    <button type="button" onClick={() => setIsFormVisible(false)} className="btn-secondary" disabled={isSubmitting}>Annuler</button>
                    <button type="submit" className="btn-primary flex items-center gap-2 min-w-[120px] justify-center" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                        <span>{currentPost.id ? "Mettre à jour" : "Enregistrer"}</span>
                    </button>
                </div>
            </div>
          </form>
        </section>
      )}

      <section className="bg-surface p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-text-primary">Articles existants</h2>
        <div className="space-y-4">
          {isLoading ? <p className="text-text-secondary">Chargement des articles...</p> : error ? <p className="text-red-500">{error}</p> : 
            posts.length === 0 ? (
                <p className="text-text-secondary">Aucun article n'a été créé pour le moment.</p>
            ) : (
                posts.map(post => (
                    <div key={post.id} className="p-4 border dark:border-gray-700 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                        <h3 className="font-bold text-lg text-text-primary">{post.title}</h3>
                        <p className="text-sm text-text-secondary">
                            Par {post.author.firstName} {post.author.lastName} - Le {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                            <span className={`ml-3 text-xs font-bold px-2.5 py-1 rounded-full ${post.published ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                {post.published ? 'Publié' : 'Brouillon'}
                            </span>
                        </p>
                        </div>
                        <div className="flex items-center gap-3 self-end sm:self-auto">
                            <button onClick={() => handleEdit(post)} className="p-2 text-text-secondary hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" title="Modifier"><Edit size={18} /></button>
                            <button onClick={() => handleDelete(post.id)} className="p-2 text-text-secondary hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-full transition-colors" title="Supprimer"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))
            )
          }
        </div>
      </section>
    </div>
  );
};

export default BlogManagementPage;