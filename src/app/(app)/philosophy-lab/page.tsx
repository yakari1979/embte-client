"use client";

import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
    Controls,
    Background,
    addEdge,
    useNodesState,
    useEdgesState,
    Connection,
    Edge,
    Node,
    Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { BrainCircuit, PlusCircle, Trash2, CheckCircle, BookOpen } from 'lucide-react';
import { sophismChallenges, philosophicalDebates } from '@/types/philosophy-data'; // Données externalisées

// Un compteur global pour les noeuds créés par l'utilisateur.
let userNodeId = 1;
const getUniqueUserNodeId = () => `user_node_${userNodeId++}`;

// Type pour définir la phase active de l'application
type LearningPhase = 'BUILDER' | 'SOPHISM' | 'DEBATE';

/**
 * Le composant principal pour le Laboratoire de Philosophie.
 * Il intègre 4 phases d'apprentissage :
 * 1. Visualisation (implicite dans React Flow)
 * 2. Construction d'arguments
 * 3. Analyse de sophismes
 * 4. Cartographie de débats philosophiques
 */
const PhilosophyLabPage = () => {
    // --- GESTION D'ÉTAT PRINCIPAL ---
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [currentPhase, setCurrentPhase] = useState<LearningPhase>('BUILDER');

    // États spécifiques pour les phases 3 et 4
    const [currentSophismIndex, setCurrentSophismIndex] = useState(0);
    const [currentDebateIndex, setCurrentDebateIndex] = useState(0);

    // --- PHASE 2 : LOGIQUE DU CONSTRUCTEUR D'ARGUMENTS ---

    /**
     * Ajoute un nouveau noeud (prémisse ou conclusion) au tableau en mode 'BUILDER'.
     */
    const addArgumentNode = useCallback((type: 'premise' | 'conclusion') => {
        const newNode: Node = {
            id: getUniqueUserNodeId(),
            position: { x: Math.random() * 250, y: Math.random() * 150 },
            data: { label: `Nouvelle ${type === 'premise' ? 'prémisse' : 'conclusion'}` },
            style: type === 'premise'
                ? { background: '#cce5ff', color: '#004085', border: '1px solid #b8daff', borderRadius: '8px' }
                : { background: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: '8px' },
        };
        setNodes((nds) => nds.concat(newNode));
    }, [setNodes]);

    /**
     * Permet d'éditer le texte d'un noeud créé par l'utilisateur.
     */
    const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node) => {
        // L'édition n'est autorisée qu'en mode constructeur
        if (currentPhase !== 'BUILDER') return;

        const newLabel = prompt("Modifiez le texte de cet élément :", node.data.label);
        if (newLabel !== null && newLabel.trim() !== '') {
            setNodes((nds) =>
                nds.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, label: newLabel } } : n))
            );
        }
    }, [currentPhase, setNodes]);

    // --- LOGIQUE DE GESTION DES PHASES ---

    /**
     * Charge le contenu d'un exercice de sophisme spécifique.
     */
    const loadSophism = useCallback((index: number) => {
        const challenge = sophismChallenges[index];
        if (challenge) {
            setNodes(challenge.initialNodes);
            setEdges(challenge.initialEdges);
        }
    }, [setNodes, setEdges]);
    
    /**
     * Charge le contenu d'une cartographie de débat philosophique.
     */
    const loadDebate = useCallback((index: number) => {
        const debate = philosophicalDebates[index];
        if (debate) {
            setNodes(debate.initialNodes);
            setEdges(debate.initialEdges);
        }
    }, [setNodes, setEdges]);

    /**
     * Effet qui se déclenche lorsque la phase change.
     * Il charge le contenu approprié pour la nouvelle phase.
     */
    useEffect(() => {
        userNodeId = 1; // Réinitialise le compteur
        if (currentPhase === 'BUILDER') {
            setNodes([]);
            setEdges([]);
        } else if (currentPhase === 'SOPHISM') {
            loadSophism(currentSophismIndex);
        } else if (currentPhase === 'DEBATE') {
            loadDebate(currentDebateIndex);
        }
    }, [currentPhase, currentSophismIndex, currentDebateIndex, loadSophism, loadDebate, setNodes, setEdges]);


    // --- PHASE 3 : LOGIQUE DE L'ANALYSEUR DE SOPHISMES ---

    /**
     * Gère la vérification de la réponse de l'élève pour le sophisme actuel.
     */
    const handleSophismCheck = () => {
        const challenge = sophismChallenges[currentSophismIndex];
        const userAnswer = prompt(challenge.question);
        if (userAnswer === null) return; // L'utilisateur a annulé

        if (userAnswer.toLowerCase().trim() === challenge.correctAnswer.toLowerCase().trim()) {
            alert(`Bravo ! C'est la bonne réponse.\n\nExplication : ${challenge.explanation}`);
        } else {
            alert(`Ce n'est pas tout à fait ça. Essayez de relire l'argument.\n\nIndice : ${challenge.explanation}`);
        }
    };
    
    // --- FONCTIONS GÉNÉRALES ---

    const onConnect = useCallback(
        (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true, type: 'smoothstep' }, eds)),
        [setEdges]
    );

    // Rendu du composant
    return (
        <div className="max-w-7xl mx-auto p-4">
            <header className="flex items-center gap-4 mb-6">
                <BrainCircuit className="h-10 w-10 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold">Laboratoire de Philosophie</h1>
                    <p className="text-text-secondary">De la construction d'arguments à l'analyse des grands débats.</p>
                </div>
            </header>

            {/* --- Navigation par Onglets --- */}
            <nav className="flex border-b mb-6">
                <button onClick={() => setCurrentPhase('BUILDER')} className={`px-4 py-2 ${currentPhase === 'BUILDER' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`}>
                    Phase 2: Constructeur
                </button>
                <button onClick={() => setCurrentPhase('SOPHISM')} className={`px-4 py-2 ${currentPhase === 'SOPHISM' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`}>
                    Phase 3: Analyse de Sophismes
                </button>
                <button onClick={() => setCurrentPhase('DEBATE')} className={`px-4 py-2 ${currentPhase === 'DEBATE' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`}>
                    Phase 4: Cartographie des Débats
                </button>
            </nav>

            <main className="bg-surface rounded-lg shadow-md p-6">
                {/* --- Contenu Conditionnel basé sur la Phase --- */}

                {currentPhase === 'BUILDER' && (
                    <section id="builder-section">
                        <h2 className="text-2xl font-semibold mb-2">Constructeur d'Arguments</h2>
                        <p className="text-text-secondary mb-4">
                            Créez un syllogisme. Ajoutez des prémisses et une conclusion, puis reliez-les. Double-cliquez pour modifier le texte.
                        </p>
                        <div className="flex flex-wrap gap-4 mb-4 p-3 border rounded-md bg-background">
                            <button onClick={() => addArgumentNode('premise')} className="btn-secondary flex items-center gap-2">
                                <PlusCircle size={18}/> Ajouter Prémisse
                            </button>
                            <button onClick={() => addArgumentNode('conclusion')} className="btn-secondary flex items-center gap-2">
                                <PlusCircle size={18}/> Ajouter Conclusion
                            </button>
                        </div>
                    </section>
                )}

                {currentPhase === 'SOPHISM' && (
                    <section id="sophism-section">
                        <h2 className="text-2xl font-semibold mb-2">Analyseur de Sophismes</h2>
                        <p className="text-text-secondary mb-4">
                           Analysez le raisonnement ci-dessous. Contient-il une erreur logique ?
                        </p>
                         <div className="flex flex-wrap gap-4 mb-4 p-3 border rounded-md bg-background items-center">
                            <h3 className="font-bold">{sophismChallenges[currentSophismIndex].title}</h3>
                            <p className="italic text-sm">{sophismChallenges[currentSophismIndex].description}</p>
                            <button onClick={handleSophismCheck} className="btn-primary flex items-center gap-2 ml-auto">
                                <CheckCircle size={18}/> Identifier le problème
                            </button>
                        </div>
                    </section>
                )}

                 {currentPhase === 'DEBATE' && (
                    <section id="debate-section">
                        <h2 className="text-2xl font-semibold mb-2">Cartographie des Débats Philosophiques</h2>
                        <p className="text-text-secondary mb-4">
                           Explorez la structure logique des grands dialogues de l'histoire de la philosophie.
                        </p>
                        <div className="flex flex-wrap gap-4 mb-4 p-3 border rounded-md bg-background items-center">
                           <BookOpen className="h-5 w-5"/>
                           <h3 className="font-bold">{philosophicalDebates[currentDebateIndex].title}</h3>
                           <p className="italic text-sm flex-1">{philosophicalDebates[currentDebateIndex].description}</p>
                        </div>
                    </section>
                )}
                
                {/* --- Le Canvas React Flow --- */}
                <div className="w-full h-[600px] border rounded-lg bg-gray-50">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeDoubleClick={onNodeDoubleClick}
                        fitView
                        proOptions={{ hideAttribution: true }}
                        // Empêche les actions non désirées dans les phases d'observation
                        nodesDraggable={currentPhase === 'BUILDER'}
                        nodesConnectable={currentPhase === 'BUILDER'}
                    >
                        <Background />
                        <Controls />
                    </ReactFlow>
                </div>
            </main>
        </div>
    );
};

export default PhilosophyLabPage;