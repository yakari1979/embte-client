// "use client";

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import Link from 'next/link';
// import Image from 'next/image'; // <-- Importer
// import Cookies from 'js-cookie';
// import { getBlogPostById, Post } from '@/services/api';
// import { ArrowLeft, Calendar, User } from 'lucide-react';

// const PostDetailPage = () => {
//     const [post, setPost] = useState<Post | null>(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState('');
//     const params = useParams();
//     const postId = params.postId as string;

//     useEffect(() => {
//         if (!postId) return;
//         const fetchPost = async () => {
//             const token = Cookies.get('token');
//             if (!token) {
//                 setError("Vous devez être connecté pour lire cet article.");
//                 setIsLoading(false);
//                 return;
//             }
//             try {
//                 const { data } = await getBlogPostById(postId, token);
//                 setPost(data);
//             } catch (err) {
//                 setError("Article introuvable ou non publié.");
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchPost();
//     }, [postId]);

//     if (isLoading) {
//         return <div className="text-center py-20">Chargement de l'article...</div>;
//     }
//     if (error) {
//         return <div className="text-center py-20 text-red-500">{error}</div>;
//     }
//     if (!post) {
//         return null;
//     }

//     return (
//         <div className="bg-surface min-h-screen">
//             <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//                 <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-8">
//                     <ArrowLeft size={18} />
//                     Retour à toutes les annonces
//                 </Link>

//                 <header>
//                     <h1 className="text-4xl lg:text-5xl font-extrabold text-text-primary leading-tight">
//                         {post.title}
//                     </h1>
//                     <div className="mt-6 flex items-center gap-6 text-base text-text-secondary">
//                         <div className="flex items-center gap-2">
//                             <User size={18} />
//                             <span>Par <strong>{post.author.firstName} {post.author.lastName}</strong></span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <Calendar size={18} />
//                             <span>Publié le {new Date(post.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
//                         </div>
//                     </div>
//                 </header>

//                 <hr className="my-8 border-gray-200 dark:border-gray-700" />

//                 {/* --- AFFICHER L'IMAGE SI ELLE EXISTE --- */}
//                 {post.coverImageUrl && (
//                         <div className="relative h-48 w-full">
//                         <Image
//                             src={post.coverImageUrl}
//                             alt={`Image de couverture pour ${post.title}`}
//                             layout="fill"
//                             objectFit="cover"
//                         />
//                     </div>
//                 )}                   

//                 {/* Le contenu de l'article est rendu ici */}
//                 <div
//                     className="prose prose-lg dark:prose-invert max-w-none"
//                     dangerouslySetInnerHTML={{ __html: post.content }}
//                 />
//             </article>
//         </div>
//     );
// };

// export default PostDetailPage;



"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // Important
import Cookies from 'js-cookie';
import { getBlogPostById, Post } from '@/services/api';
import { ArrowLeft, Calendar, User } from 'lucide-react';

const PostDetailPage = () => {
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const params = useParams();
    const postId = params.postId as string;

    useEffect(() => {
        if (!postId) return;
        const fetchPost = async () => {
            // ... (votre code de fetch est parfait, pas de changement ici)
            const token = Cookies.get('token');
            if (!token) {
                setError("Vous devez être connecté pour lire cet article.");
                setIsLoading(false);
                return;
            }
            try {
                const { data } = await getBlogPostById(postId, token);
                setPost(data);
            } catch (err) {
                setError("Article introuvable ou non publié.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

    if (isLoading) {
        return <div className="text-center py-20">Chargement de l'article...</div>;
    }
    if (error) {
        return <div className="text-center py-20 text-red-500">{error}</div>;
    }
    if (!post) {
        return null;
    }

    return (
        <div className="bg-surface min-h-screen">
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-8">
                    <ArrowLeft size={18} />
                    Retour à toutes les annonces
                </Link>

                <header>
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-text-primary leading-tight">
                        {post.title}
                    </h1>
                    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-base text-text-secondary">
                        <div className="flex items-center gap-2">
                            <User size={18} />
                            <span>Par <strong>{post.author.firstName} {post.author.lastName}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={18} />
                            <span>Publié le {new Date(post.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>
                </header>
                
                {/* --- DÉBUT DE LA SECTION IMAGE AMÉLIORÉE --- */}
                {post.coverImageUrl && (
                    <div className="my-12 w-full max-w-4xl mx-auto">
                        <div className="relative w-full overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <Image
                                src={post.coverImageUrl}
                                alt={`Image de couverture pour l'article "${post.title}"`}
                                width={1200} // Largeur indicative pour le ratio (ex: 16:9)
                                height={675} // Hauteur indicative pour le ratio
                                className="w-full h-auto object-contain" // Responsive, garde les proportions
                            />
                        </div>
                    </div>
                )}
                {/* --- FIN DE LA SECTION IMAGE AMÉLIORÉE --- */}
                
                {/* Si pas d'image, on garde le séparateur pour l'espacement */}
                {!post.coverImageUrl && (
                    <hr className="my-8 border-gray-200 dark:border-gray-700" />
                )}

                <div
                    // Ajout de styles pour que le contenu du blog soit plus lisible
                    className="prose prose-lg dark:prose-invert max-w-none prose-p:text-text-secondary prose-headings:text-text-primary"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>
        </div>
    );
};

export default PostDetailPage;