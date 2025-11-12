"use client";

import React, { useState } from 'react';
import Cookies from 'js-cookie';
import apiClient from '@/services/api'; // Assurez-vous que ce chemin est correct !
// L'import de "axios" n'est plus nécessaire ici si on utilise apiClient partout,
// mais on le garde car la gestion d'erreur l'utilise (axios.isAxiosError).
import axios from 'axios'; 
import { Bot, Loader2, Send, FileUp, XCircle, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// =======================================================
//   CHANGEMENT 1 : Importer votre apiClient centralisé
// =======================================================

const AiAssistantPage = () => {
    const [command, setCommand] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<{ message: string; error?: boolean } | null>(null);
    
    const router = useRouter(); 
    
    const exampleCommand = `Crée une classe nommée "Première L1". ...`;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setCommand('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = Cookies.get('token');
        if (!token || (!command.trim() && !file)) return;

        setIsLoading(true);
        setResponse(null);

        try {
            let apiResponse;
            if (file) {
                const formData = new FormData();
                formData.append('document', file);

                // =======================================================
                //   CHANGEMENT 2 : Utiliser apiClient au lieu de axios
                // =======================================================
                apiResponse = await apiClient.post(
                    '/ai/execute-from-file', // L'URL est maintenant relative
                    formData,
                    { headers: { 
                        'Authorization': `Bearer ${token}`,
                        // 'Content-Type' est géré automatiquement par apiClient pour les FormData
                    }}
                );

            } else {
                // =======================================================
                //   CHANGEMENT 3 : Utiliser apiClient au lieu de axios
                // =======================================================
                apiResponse = await apiClient.post(
                    '/ai/execute-command', // L'URL est maintenant relative
                    { command },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            
            // On récupère toutes les données de la réponse
            const result = apiResponse.data;

            // On vérifie si la réponse contient une liste non vide d'utilisateurs créés
            if (result.createdUsers && Array.isArray(result.createdUsers) && result.createdUsers.length > 0) {
                // 1. On transforme le tableau d'utilisateurs en une chaîne de caractères JSON
                const dataString = JSON.stringify(result.createdUsers);
                // 2. On encode cette chaîne pour qu'elle soit valide dans une URL
                const encodedData = encodeURIComponent(dataString);
                // 3. On redirige vers la page de résumé avec les données
                router.push(`/users/bulk-creation-summary?data=${encodedData}`);
                // Pas besoin de setIsLoading(false) car la page va changer
            } else {
                // S'il n'y a pas de nouveaux utilisateurs, on affiche simplement le message de succès sur la page actuelle
                setResponse({ message: result.message });
                setIsLoading(false);
                setFile(null); // On réinitialise le fichier après envoi
            }

        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setResponse({ message: err.response.data.message, error: true });
            } else {
                setResponse({ message: "Une erreur réseau est survenue.", error: true });
            }
            // On s'assure de stopper le chargement en cas d'erreur
            setIsLoading(false);
            setFile(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Bot className="h-10 w-10 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Assistant d'Administration IA</h1>
                    <p className="text-text-secondary">Automatisez les tâches via du texte ou en uploadant un fichier.</p>
                </div>
            </div>

            {/* ======================= SECTION À AJOUTER CI-DESSOUS ======================= */}

    <div className="bg-green-50 border-l-4 border-green-400 text-green-800 p-4 rounded-md mb-8 dark:bg-green-900/20 dark:border-green-600 dark:text-green-300" role="alert">
        <div className="flex">
            <div className="py-1">
                <AlertTriangle className="h-5 w-5 text-green-500 mr-3" />
            </div>
            <div>
                <p className="font-bold">Attention : Ceci est un assistant</p>
                <p className="text-sm">
                    Cet outil est là pour vous aider, mais il peut commettre des erreurs ou mal interpréter une commande. Veuillez toujours vérifier attentivement les résultats générés avant de les valider définitivement.
                </p>
            </div>
        </div>
    </div>

    {/* ======================= FIN DE LA SECTION À AJOUTER ======================= */}


            <div className="bg-surface p-8 rounded-lg shadow-md">
                <form onSubmit={handleSubmit}>
                    
                    {/* --- Section d'Upload --- */}
                    <div className="mb-4">
                        <label htmlFor="file-upload" className="w-full flex items-center justify-center px-4 py-6 bg-background border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                            <div className="text-center">
                                <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-text-secondary">
                                    <span className="font-semibold text-primary">Uploadez un fichier</span> ou glissez-déposez
                                </p>
                                <p className="text-xs text-text-subtle">PDF, DOCX</p>
                            </div>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.docx" disabled={!!command.trim()} />
                        </label>
                        {file && (
                            <div className="mt-2 flex items-center justify-between text-sm text-text-secondary bg-gray-100 dark:bg-gray-900 p-2 rounded">
                                <span>Fichier sélectionné : <span className="font-medium">{file.name}</span></span>
                                <button type="button" onClick={() => setFile(null)} className="text-red-500 hover:text-red-700">
                                    <XCircle size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="relative my-6 flex items-center">
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                        <span className="flex-shrink mx-4 text-sm text-text-subtle">OU</span>
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    </div>

                    {/* --- Section Texte --- */}
                    <div className="mb-4">
                        <label htmlFor="command" className="block text-sm font-medium text-text-secondary mb-2">
                            Entrez votre commande manuellement
                        </label>
                        <textarea
                            id="command"
                            rows={8}
                            value={command}
                            onChange={(e) => { setCommand(e.target.value); setFile(null); }}
                            placeholder="Décrivez ce que vous voulez faire..."
                            className="input-field w-full"
                            disabled={!!file}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <button type="button" onClick={() => { setCommand(exampleCommand); setFile(null); }} className="text-sm text-blue-500 hover:underline" disabled={!!file}>
                            Utiliser un exemple
                        </button>
                        <button type="submit" disabled={isLoading || (!command.trim() && !file)} className="btn-primary flex items-center gap-2">
                            {isLoading ? <Loader2 className="animate-spin" /> : <Send size={16} />}
                            {isLoading ? "Traitement en cours..." : "Exécuter"}
                        </button>
                    </div>
                </form>

                {/* Ce bloc de réponse ne s'affichera que si l'opération réussit SANS créer de nouveaux utilisateurs */}
                {response && (
                    <div className={`mt-6 p-4 rounded-md ${response.error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        <p className="font-semibold">{response.error ? "Erreur" : "Résultat"}</p>
                        <p>{response.message}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiAssistantPage;

