// // (app)/library/[resourceId]/page.tsx

// "use client";

// import React, { useState, useEffect } from 'react';
// import { usePathname } from 'next/navigation';
// import Cookies from 'js-cookie';
// import Link from 'next/link';
// import { getExternalResourceById, ExternalResource, trackResourceClick } from '@/services/api';
// import { Loader2, ArrowLeft, ExternalLink } from 'lucide-react';
// import ReactPlayer from 'react-player';


// const ResourceDetailPage = () => {
//     const pathname = usePathname();
//     const resourceId = pathname.split('/').pop() || '';
//     const [resource, setResource] = useState<ExternalResource | null>(null);
//     const [loading, setLoading] = useState(true);
    
//     // Cet état est une bonne pratique pour éviter les erreurs d'hydratation
//     const [hasMounted, setHasMounted] = useState(false);
//     useEffect(() => {
//         setHasMounted(true);
//     }, []);


//     useEffect(() => {
//         if (!resourceId) return;
        
//         const fetchData = async () => {
//             const token = Cookies.get('token');
//             if (!token) { setLoading(false); return; }
//             try {
//                 const response = await getExternalResourceById(resourceId, token);
//                 setResource(response.data);
//                 trackResourceClick(resourceId, token).catch(console.error);
//             } catch (error) {
//                 console.error(error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, [resourceId]);

//     const renderContent = () => {
//         // On attend que le composant soit "monté" côté client avant d'afficher le lecteur
//         if (!resource || !hasMounted) {
//             return <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>;
//         }

//         switch (resource.type) {
//             case 'VIDEO':
//                 return (
//                     <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
//                         <ReactPlayer 
//                             url={resource.url} 
//                             width="100%" 
//                             height="100%" 
//                             controls={true}
//                             style={{ position: 'absolute', top: 0, left: 0 }}
//                             // Ajout pour une meilleure expérience sur certains navigateurs
//                             playing={false}
//                             // light={resource.thumbnailUrl || false}
//                         />
//                     </div>
//                 );
//             case 'PDF':
//                 return (
//                     <div className="h-[80vh] border rounded-lg overflow-hidden">
//                         <iframe src={resource.url} width="100%" height="100%" title={resource.title}>
//                             <a href={resource.url} target="_blank" rel="noopener noreferrer">Voir le PDF</a>
//                         </iframe>
//                     </div>
//                 );
//             case 'LINK':
//             case 'BOOK':
//                 return (
//                      <div className="bg-surface p-8 rounded-lg text-center">
//                         <h3 className="text-xl font-bold mb-4">Redirection vers une ressource externe</h3>
//                         <p className="text-text-secondary mb-6">Vous allez être redirigé vers : <span className="font-semibold">{resource.source}</span></p>
//                         <a href={resource.url} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
//                             <ExternalLink size={18}/> Accéder à la ressource
//                         </a>
//                     </div>
//                 );
//             default:
//                 return <p>Type de ressource non supporté.</p>;
//         }
//     };

//     if (loading) return <div className="text-center py-20"><Loader2 className="animate-spin h-10 w-10 mx-auto text-blue-500"/></div>;
//     if (!resource) return <div className="text-center py-20">Ressource non trouvée.</div>;

//     console.log('Resource URL:', resource.url);

    
//     return (
//         <div className="container mx-auto px-4 py-8">
//             <Link href="/library" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline mb-6">
//                 <ArrowLeft size={16} /> Retour à la bibliothèque
//             </Link>

//             <header className="mb-6">
//                 <p className="font-semibold text-blue-600 dark:text-blue-400">{resource.subject}</p>
//                 <h1 className="text-4xl font-bold text-text-primary mt-1">{resource.title}</h1>
//                 <p className="text-text-secondary mt-2">Proposé par : {resource.source}</p>
//             </header>

//             <div className="mt-8">
//                 {renderContent()}
//             </div>
//         </div>
//     );
// };

// export default ResourceDetailPage;




// (app)/library/[resourceId]/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { getExternalResourceById, ExternalResource, trackResourceClick } from '@/services/api';
import { Loader2, ArrowLeft, ExternalLink, PlayCircle } from 'lucide-react';

// Fonction utilitaire pour extraire l'ID YouTube (propre et robuste)
const getYoutubeEmbedUrl = (url: string) => {
    try {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`;
        }
        return null;
    } catch (e) {
        return null;
    }
};

const ResourceDetailPage = () => {
    const pathname = usePathname();
    const resourceId = pathname.split('/').pop() || '';
    const [resource, setResource] = useState<ExternalResource | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!resourceId) return;
        
        const fetchData = async () => {
            const token = Cookies.get('token');
            if (!token) { setLoading(false); return; }
            try {
                const response = await getExternalResourceById(resourceId, token);
                setResource(response.data);
                trackResourceClick(resourceId, token).catch(console.error);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [resourceId]);

    const renderContent = () => {
        if (!resource) return null;

        switch (resource.type) {
            case 'VIDEO':
                const embedUrl = getYoutubeEmbedUrl(resource.url);

                if (embedUrl) {
                    return (
                        // On utilise une hauteur fixe (h-64 ou h-96) pour être sûr que ça s'affiche
                        // même si 'aspect-video' ne marche pas dans ton CSS.
                        <div className="w-full h-64 md:h-[500px] bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                            <iframe
                                src={embedUrl}
                                title={resource.title}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    );
                } else {
                    // Fallback si ce n'est pas un lien YouTube valide
                    return (
                        <div className="bg-red-50 p-6 rounded-lg text-center border border-red-200">
                            <PlayCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
                            <p className="text-red-700 font-medium">Format vidéo non reconnu ou lien invalide.</p>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mt-2 block">
                                Essayer d'ouvrir le lien directement
                            </a>
                        </div>
                    );
                }

            case 'PDF':
                return (
                    <div className="h-[80vh] border rounded-lg overflow-hidden bg-white shadow-lg">
                        <iframe 
                            src={resource.url} 
                            className="w-full h-full"
                            title="Lecteur PDF"
                        >
                            <p className="p-4">Votre navigateur ne supporte pas l'affichage des PDF.</p>
                        </iframe>
                    </div>
                );

            case 'LINK':
            case 'BOOK':
                return (
                     <div className="bg-white dark:bg-gray-800 p-10 rounded-xl text-center shadow-lg border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
                        <div className="mb-6 inline-flex p-4 bg-blue-50 rounded-full">
                            <ExternalLink size={32} className="text-blue-600"/>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">Ressource Externe</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-8">
                            Cette ressource est hébergée sur <span className="font-semibold text-blue-600">{resource.source}</span>.
                        </p>
                        <a 
                            href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors gap-2 shadow-md hover:shadow-lg"
                        >
                            Accéder à la ressource <ExternalLink size={18}/>
                        </a>
                    </div>
                );
            default:
                return <p className="text-center text-gray-500">Type de ressource non supporté.</p>;
        }
    };

    if (loading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin h-12 w-12 text-blue-600"/></div>;
    
    if (!resource) return (
        <div className="flex flex-col h-[50vh] items-center justify-center text-center px-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oups !</h2>
            <p className="text-gray-600">Cette ressource semble introuvable.</p>
            <Link href="/library" className="mt-4 text-blue-600 hover:underline">Retourner à la bibliothèque</Link>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <Link href="/library" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 mb-8 transition-colors">
                <ArrowLeft size={18} /> Retour à la bibliothèque
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Colonne Principale : Le Contenu */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-1">
                        {renderContent()}
                    </div>
                    
                    {/* Titre et Description pour Mobile (apparaît sous la vidéo) */}
                    <div className="lg:hidden">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{resource.title}</h1>
                        <p className="text-gray-500 text-sm">Source : {resource.source}</p>
                    </div>
                </div>

                {/* Colonne Latérale : Infos et Description (Desktop) */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-6">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 text-sm font-bold text-blue-700 bg-blue-50 rounded-full border border-blue-100">
                                {resource.subject}
                            </span>
                            <span className="px-3 py-1 text-sm font-semibold text-gray-700 bg-gray-100 rounded-full border border-gray-200">
                                {resource.type}
                            </span>
                        </div>

                        <h1 className="hidden lg:block text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                            {resource.title}
                        </h1>

                        {resource.description ? (
                            <div className="prose dark:prose-invert text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                {resource.description}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic text-sm">Aucune description fournie.</p>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">Fourni par</p>
                            <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                {resource.source}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceDetailPage;