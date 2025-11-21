// (app)/library/[resourceId]/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { getExternalResourceById, ExternalResource, trackResourceClick } from '@/services/api';
import { Loader2, ArrowLeft, ExternalLink } from 'lucide-react';
import ReactPlayer from 'react-player';





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
                // On track le "clic" ici, car arriver sur la page est l'interaction principale
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
                return (
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <ReactPlayer url={resource.url} width="100%" height="100%" controls={true} />
                    </div>
                );
            case 'PDF':
                return (
                    <div className="h-[80vh] border rounded-lg overflow-hidden">
                        <iframe src={resource.url} width="100%" height="100%" title={resource.title}>
                            Votre navigateur ne supporte pas les iFrames.
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">Voir le PDF</a>
                        </iframe>
                    </div>
                );
            case 'LINK':
            case 'BOOK':
                return (
                    <div className="bg-surface p-8 rounded-lg text-center">
                        <h3 className="text-xl font-bold mb-4">Redirection vers une ressource externe</h3>
                        <p className="text-text-secondary mb-6">Vous allez être redirigé vers : <span className="font-semibold">{resource.source}</span></p>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                            <ExternalLink size={18}/> Accéder à la ressource
                        </a>
                    </div>
                );
            default:
                return <p>Type de ressource non supporté.</p>;
        }
    };

    if (loading) return <div className="text-center py-20"><Loader2 className="animate-spin h-10 w-10 mx-auto text-blue-500"/></div>;
    if (!resource) return <div className="text-center py-20">Ressource non trouvée.</div>;
    
    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/library" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline mb-6">
                <ArrowLeft size={16} /> Retour à la bibliothèque
            </Link>

            <header className="mb-6">
                <p className="font-semibold text-blue-600 dark:text-blue-400">{resource.subject}</p>
                <h1 className="text-4xl font-bold text-text-primary mt-1">{resource.title}</h1>
                <p className="text-text-secondary mt-2">Proposé par : {resource.source}</p>
            </header>

            <div className="mt-8">
                {renderContent()}
            </div>
        </div>
    );
};

export default ResourceDetailPage;