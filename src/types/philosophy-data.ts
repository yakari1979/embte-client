import { Node, Edge, Position } from 'reactflow';

// --- PHASE 3 : DONNÉES POUR L'ANALYSEUR DE SOPHISMES ---

export const sophismChallenges = [
    {
        title: "Le Faux Dilemme",
        description: "Ce raisonnement présente-t-il toutes les options possibles ?",
        question: "Quel est le nom de ce sophisme ?",
        correctAnswer: "faux dilemme",
        explanation: "Un faux dilemme (ou 'fausse dichotomie') se produit lorsqu'on ne présente que deux options comme étant les seules possibles, alors qu'en réalité, il en existe d'autres.",
        initialNodes: [
            { id: 's1-1', data: { label: 'Soit tu es avec nous,' }, position: { x: 50, y: 50 }, sourcePosition: Position.Right },
            { id: 's1-2', data: { label: 'Soit tu es contre nous.' }, position: { x: 50, y: 150 }, sourcePosition: Position.Right },
            { id: 's1-3', data: { label: 'Puisque tu n\'es pas avec nous, tu es donc contre nous.' }, position: { x: 400, y: 100 }, targetPosition: Position.Left, style: { background: '#f8d7da', color: '#721c24' } },
        ] as Node[],
        initialEdges: [
            { id: 's1-e1', source: 's1-1', target: 's1-3', animated: true },
            { id: 's1-e2', source: 's1-2', target: 's1-3', animated: true },
        ] as Edge[],
    },
    // Vous pouvez ajouter d'autres sophismes ici
];


// --- PHASE 4 : DONNÉES POUR LA CARTOGRAPHIE DES DÉBATS ---

export const philosophicalDebates = [
    {
        title: "Le Débat sur l'Existence de Dieu",
        description: "Arguments de Saint Thomas d'Aquin (en bleu) face aux critiques de Kant (en rouge).",
        initialNodes: [
            // Question Centrale
            { id: 'd1-q', data: { label: 'Dieu existe-t-il ?' }, position: { x: 400, y: 25 }, style: { width: 200, textAlign: 'center', background: '#e9ecef' } },

            // Branche de Thomas d'Aquin (Argument Cosmologique)
            { id: 'd1-t1', data: { label: 'Prémisse 1: Tout ce qui existe a une cause.' }, position: { x: 50, y: 150 }, style: { background: '#cce5ff', color: '#004085' } },
            { id: 'd1-t2', data: { label: 'Prémisse 2: La chaîne des causes ne peut pas être infinie.' }, position: { x: 50, y: 250 }, style: { background: '#cce5ff', color: '#004085' } },
            { id: 'd1-t3', data: { label: 'Conclusion (Aquin): Il doit exister une Cause Première non causée, que nous appelons Dieu.' }, position: { x: 50, y: 375 }, style: { background: '#d4edda', color: '#155724', width: 250 } },

            // Branche de Kant (Critique)
            { id: 'd1-k1', data: { label: 'Objection (Kant): Le concept de causalité ne s\'applique qu\'aux phénomènes que nous pouvons expérimenter.' }, position: { x: 600, y: 200 }, style: { background: '#f8d7da', color: '#721c24' } },
            { id: 'd1-k2', data: { label: 'Critique: Appliquer la causalité au-delà de l\'expérience pour prouver une "Cause Première" est un usage illégitime de la raison.' }, position: { x: 600, y: 325 }, style: { background: '#f8d7da', color: '#721c24', width: 250 } },

        ] as Node[],
        initialEdges: [
            // Liens de la question
            { id: 'd1-eq-t', source: 'd1-q', target: 'd1-t3', label: 'Argument pour' },
            { id: 'd1-eq-k', source: 'd1-q', target: 'd1-k2', label: 'Argument contre' },
            // Liens de l'argument d'Aquin
            { id: 'd1-et1-3', source: 'd1-t1', target: 'd1-t3', type: 'smoothstep' },
            { id: 'd1-et2-3', source: 'd1-t2', target: 'd1-t3', type: 'smoothstep' },
            // Lien de la critique de Kant
            { id: 'd1-ek1-2', source: 'd1-k1', target: 'd1-k2', type: 'smoothstep' },
            // Lien d'opposition
            { id: 'd1-ek-t', source: 'd1-k2', target: 'd1-t2', type: 'smoothstep', animated: true, style: { stroke: '#721c24', strokeWidth: 2 }, label: 'attaque la prémisse 2' },
        ] as Edge[],
    },
    // Vous pouvez ajouter d'autres débats ici
];