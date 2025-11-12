"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getHistorySimulationData, getAgePyramidSimulation, getWordCloudImage } from '@/services/api';
// import { MapContainer, TileLayer, Polygon, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, Landmark, Globe, Pyramid, BookOpen } from 'lucide-react';
import dynamic from 'next/dynamic'; // <-- 1. IMPORTER 'dynamic'


// --- DÉBUT DE LA CORRECTION ---

// 2. Importer 'react-leaflet' de manière dynamique pour désactiver le SSR
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), {
    ssr: false, // On s'assure que ce composant n'est rendu que côté client
    loading: () => <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin"/></div>
});
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Polygon = dynamic(() => import('react-leaflet').then(mod => mod.Polygon), { ssr: false });
const Tooltip = dynamic(() => import('react-leaflet').then(mod => mod.Tooltip), { ssr: false });

// --- FIN DE LA CORRECTION ---

// Type pour les données des empires
interface EmpireData {
    name: string;
    period: string;
    color: string;
    polygon: [number, number][];
}

const HGLabPage = () => {
    const [activeTab, setActiveTab] = useState<'history' | 'geography' | 'literature'>('history');
    
    // States pour l'onglet Histoire
    const [empires, setEmpires] = useState<EmpireData[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [historyError, setHistoryError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // States pour l'onglet Géographie
    const [pyramidParams, setPyramidParams] = useState({ country: 'Sénégal', birthModifier: 0, lifeModifier: 0 });
    const [pyramidImage, setPyramidImage] = useState<string | null>(null);
    const [loadingPyramid, setLoadingPyramid] = useState(false);
    const [pyramidError, setPyramidError] = useState<string | null>(null);

    // --- NOUVEAUX STATES ---
    const [textToAnalyze, setTextToAnalyze] = useState('');
    const [wordCloudImage, setWordCloudImage] = useState<string | null>(null);
    const [loadingWordCloud, setLoadingWordCloud] = useState(false);
    const [wordCloudError, setWordCloudError] = useState<string | null>(null);

    // Fetch des données pour la carte historique au chargement
    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            setHistoryError("Authentification requise.");
            setLoadingHistory(false);
            return;
        }
        getHistorySimulationData(token)
            .then(response => {
                setEmpires(response.data);
            })
            .catch(err => {
                setHistoryError("Impossible de charger les données de la simulation historique.");
            })
            .finally(() => {
                setLoadingHistory(false);
            });
    }, []);

    // Fonction pour lancer la simulation de la pyramide des âges
    // const handlePyramidSimulation = () => {
    //     const token = Cookies.get('token');
    //     if (!token) {
    //         setPyramidError("Authentification requise.");
    //         return;
    //     }
    //     setLoadingPyramid(true);
    //     setPyramidError(null);
    //     setPyramidImage(null); // On efface l'ancienne image
    //     getAgePyramidSimulation(pyramidParams, token)
    //         .then(response => {
    //             setPyramidImage(response.data.dataUrl);
    //         })
    //         .catch(err => setPyramidError("Erreur lors de la simulation démographique."))
    //         .finally(() => setLoadingPyramid(false));
    // };


    const handlePyramidSimulation = () => {
        const token = Cookies.get('token');
        if (!token) {
            setPyramidError("Authentification requise.");
            return;
        }
        setLoadingPyramid(true);
        setPyramidError(null);
        setPyramidImage(null); // On efface l'ancienne image
        getAgePyramidSimulation(pyramidParams, token)
            .then(response => {
                // MISE À JOUR : On construit le dataUrl ici
                setPyramidImage(`data:image/png;base64,${response.data.imageBase64}`);
            })
            .catch(err => setPyramidError("Erreur lors de la simulation démographique."))
            .finally(() => setLoadingPyramid(false));
    };

    const activeEmpire = empires[activeIndex];

    // const handleWordCloudAnalysis = () => {
    //     const token = Cookies.get('token');
    //     if (!token || !textToAnalyze.trim()) return;
    //     setLoadingWordCloud(true);
    //     setWordCloudError(null);
    //     setWordCloudImage(null);
    //     getWordCloudImage(textToAnalyze, token)
    //         .then(response => {
    //             setWordCloudImage(response.data.dataUrl);
    //         })
    //         .catch(err => setWordCloudError("Erreur lors de l'analyse du texte."))
    //         .finally(() => setLoadingWordCloud(false));
    // };


    const handleWordCloudAnalysis = () => {
        const token = Cookies.get('token');
        if (!token || !textToAnalyze.trim()) return;
        setLoadingWordCloud(true);
        setWordCloudError(null);
        setWordCloudImage(null);
        getWordCloudImage(textToAnalyze, token)
            .then(response => {
                // MISE À JOUR : On construit le dataUrl ici
                setWordCloudImage(`data:image/png;base64,${response.data.imageBase64}`);
            })
            .catch(err => setWordCloudError("Erreur lors de l'analyse du texte."))
            .finally(() => setLoadingWordCloud(false));
    };


    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Landmark className="h-10 w-10 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold">Laboratoire d'Histoire-Géographie</h1>
                    <p className="text-text-secondary">Explorez les dynamiques humaines et territoriales.</p>
                </div>
            </div>

            <div className="bg-surface rounded-lg shadow-md">
                {/* --- Barre d'onglets --- */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex gap-6 px-6" aria-label="Tabs">
                         <button 
                            onClick={() => setActiveTab('history')} 
                            className={`shrink-0 border-b-2 py-4 px-1 text-lg font-medium ${activeTab === 'history' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}
                         >
                            Histoire
                         </button>
                         <button 
                            onClick={() => setActiveTab('geography')} 
                            className={`shrink-0 border-b-2 py-4 px-1 text-lg font-medium ${activeTab === 'geography' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}
                         >
                            Géographie
                         </button>

                         <button onClick={() => setActiveTab('literature')} 
                         className={`shrink-0 border-b-2 py-4 px-1 text-lg font-medium ${activeTab === 'literature' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>Littérature</button>
                         
                    </nav>
                </div>

                {/* --- Contenu des Onglets --- */}
                <div className="p-6">
                    {/* --- Contenu de l'onglet Histoire --- */}
                    {activeTab === 'history' && (
                        <div>
                            {loadingHistory && <div className="flex justify-center p-10"><Loader2 className="animate-spin h-8 w-8"/></div>}
                            {historyError && <p className="text-red-500 text-center">{historyError}</p>}
                            {!loadingHistory && !historyError && (
                                <>
                                    <h2 className="text-2xl font-semibold mb-2">Les Grands Empires d'Afrique de l'Ouest</h2>
                                    <div className="mb-4">
                                        <label htmlFor="timeline-slider" className="block text-sm font-medium mb-2">
                                            Époque : <span className="font-bold text-primary">{activeEmpire?.name} ({activeEmpire?.period})</span>
                                        </label>
                                        <input
                                            id="timeline-slider" type="range" min="0" max={empires.length - 1} step="1"
                                            value={activeIndex} onChange={(e) => setActiveIndex(Number(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                        />
                                        <div className="flex justify-between text-xs text-text-secondary mt-1">
                                            {empires.map((e) => <span key={e.name}>{e.name}</span>)}
                                        </div>
                                    </div>
                                    <div className="h-[500px] w-full rounded-lg overflow-hidden">
                                        <MapContainer center={[15, -4]} zoom={5} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                                            {activeEmpire && (
                                                <Polygon pathOptions={{ color: activeEmpire.color, fillColor: activeEmpire.color, fillOpacity: 0.5 }} positions={activeEmpire.polygon}>
                                                    <Tooltip sticky>
                                                        <h3 className="font-bold">{activeEmpire.name}</h3>
                                                        <p>{activeEmpire.period}</p>
                                                    </Tooltip>
                                                </Polygon>
                                            )}
                                        </MapContainer>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* --- Contenu de l'onglet Géographie --- */}
                    {activeTab === 'geography' && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><Pyramid/> Démographie : Pyramide des Âges</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6 bg-background p-4 rounded-lg border dark:border-gray-700">
                                    <div>
                                        <label className="block text-sm font-medium">Choisir un pays</label>
                                        <select value={pyramidParams.country} onChange={(e) => setPyramidParams(p => ({...p, country: e.target.value}))} className="input-field w-full mt-1">
                                            <option>Sénégal</option>
                                            <option>Japon</option>
                                            <option>France</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Variation simulée de la natalité ({Math.round(pyramidParams.birthModifier * 100)}%)</label>
                                        <input type="range" min="-0.5" max="0.5" step="0.05" value={pyramidParams.birthModifier} onChange={(e) => setPyramidParams(p => ({...p, birthModifier: Number(e.target.value)}))} className="w-full mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Variation simulée de l'espérance de vie ({Math.round(pyramidParams.lifeModifier * 100)}%)</label>
                                        <input type="range" min="-0.2" max="0.2" step="0.02" value={pyramidParams.lifeModifier} onChange={(e) => setPyramidParams(p => ({...p, lifeModifier: Number(e.target.value)}))} className="w-full mt-1" />
                                    </div>
                                    <button onClick={handlePyramidSimulation} disabled={loadingPyramid} className="btn-primary w-full">
                                        {loadingPyramid ? <Loader2 className="animate-spin mx-auto"/> : 'Simuler l\'Évolution'}
                                    </button>
                                </div>
                                <div className="bg-background rounded-lg flex items-center justify-center p-4 min-h-[400px]">
                                    {loadingPyramid && <Loader2 className="animate-spin h-8 w-8"/>}
                                    {pyramidError && <p className="text-red-500">{pyramidError}</p>}
                                    {pyramidImage && !loadingPyramid && <img src={pyramidImage} alt="Pyramide des âges" className="max-w-full h-auto"/>}
                                    {!pyramidImage && !loadingPyramid && !pyramidError && <p className="text-text-secondary">Le graphique s'affichera ici.</p>}
                                </div>
                            </div>
                        </div>
                    )}
                    {/* --- NOUVEL ONGLET LITTÉRATURE --- */}
                    {activeTab === 'literature' && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><BookOpen/> Analyseur de Texte</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Panneau de contrôle */}
                                <div className="space-y-4">
                                    <textarea
                                        value={textToAnalyze}
                                        onChange={(e) => setTextToAnalyze(e.target.value)}
                                        rows={15}
                                        placeholder="Collez ici le texte à analyser (un poème, un extrait de roman...)"
                                        className="input-field w-full"
                                    />
                                    <button onClick={handleWordCloudAnalysis} disabled={loadingWordCloud || !textToAnalyze.trim()} className="btn-primary w-full">
                                        {loadingWordCloud ? <Loader2 className="animate-spin mx-auto"/> : 'Générer le Nuage de Mots'}
                                    </button>
                                </div>
                                {/* Zone d'affichage */}
                                <div className="bg-background rounded-lg flex items-center justify-center p-4 min-h-[300px]">
                                    {loadingWordCloud && <Loader2 className="animate-spin h-8 w-8"/>}
                                    {wordCloudError && <p className="text-red-500">{wordCloudError}</p>}
                                    {wordCloudImage && !loadingWordCloud && <img src={wordCloudImage} alt="Nuage de mots" className="max-w-full h-auto"/>}
                                    {!wordCloudImage && !loadingWordCloud && !wordCloudError && <p className="text-text-secondary">Le nuage de mots s'affichera ici.</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HGLabPage;