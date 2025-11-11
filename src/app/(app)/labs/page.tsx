import Link from 'next/link';
import { Atom, ScrollText, BrainCircuit, ArrowRight } from 'lucide-react';
import React from 'react';

// Les données des cartes restent structurées pour une maintenance facile
const labData = [
    {
        href: "/philosophy-lab",
        icon: <BrainCircuit className="h-12 w-12 text-blue-500" />,
        title: "Laboratoire de Philosophie",
        description: "Construisez des arguments, analysez des sophismes et explorez les grands débats philosophiques de manière interactive."
    },
    {
        href: "/quantum-lab",
        icon: <Atom className="h-12 w-12 text-purple-500" />,
        title: "Laboratoire Quantique",
        description: "Plongez dans les mystères de la physique quantique. Simulez des expériences comme les fentes de Young et la superposition."
    },
    {
        href: "/history-lab",
        icon: <ScrollText className="h-12 w-12 text-amber-600" />,
        title: "Laboratoire d'Histoire",
        description: "Visualisez les lignes du temps, analysez les relations de cause à effet et cartographiez les événements qui ont façonné notre monde."
    }
];

/**
 * Page d'accueil des laboratoires, optimisée pour le thème clair/sombre,
 * responsive, et avec un contenu détaillé pour les élèves de Terminale.
 */
const LabsHomePage = () => {
  return (
    // Utilisation des variables CSS pour les couleurs de fond et de texte
    <div className="min-h-screen bg-background text-text-primary transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        
        <header className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-text-primary mb-4">
            Votre Espace d'Exploration Intellectuelle
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto">
            Vous êtes en Terminale et les concepts abstraits vous semblent parfois lointains ? Ces laboratoires transforment l'abstrait en concret. Passez de la lecture passive à l'expérimentation active et forgez-vous une compréhension profonde et durable.
          </p>
        </header>

        {/* Section explicative détaillée */}
        <section className="mb-20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-text-primary mb-8">
                Pourquoi ces laboratoires sont essentiels pour vous ?
            </h2>
            <div className="space-y-6 text-text-secondary">
                <p>
                    Que vous soyez en <span className='font-bold'>Terminale L</span> ou en <span className='font-bold'>Terminale S</span>, la maîtrise de la logique, de l'argumentation et de la pensée critique est la clé de votre réussite. Ces outils ne sont pas de simples gadgets ; ils sont conçus pour aiguiser les compétences fondamentales exigées au Baccalauréat et dans vos études supérieures.
                </p>
                
                <div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">Pour vous, élèves de Terminale L :</h3>
                    <p>
                        Le  <span className='font-bold'>Laboratoire de Philosophie</span> est votre meilleur allié pour la dissertation. Apprenez à décomposer un sujet, à construire un plan rigoureux, à identifier les sophismes dans un texte et à visualiser les dialogues entre les grands philosophes. C'est l'outil parfait pour passer d'une opinion à un argument structuré et imparable.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">Pour vous, élèves de Terminale S :</h3>
                    <p>
                        Ne pensez pas que la philosophie ou l'histoire sont loin de vous. La rigueur scientifique repose sur une logique implacable. Le <span className='font-bold'>Laboratoire de Philosophie</span> vous entraînera à structurer votre pensée comme vous structurez une démonstration mathématique. Le <span className='font-bold'>Laboratoire Quantique</span> vous permettra de visualiser les principes contre-intuitifs que vous étudiez, et le <span className='font-bold'>Laboratoire d'Histoire</span> vous montrera comment les découvertes scientifiques s'inscrivent dans un contexte plus large. C'est un entraînement complet à l'esprit d'analyse.
                    </p>
                </div>
            </div>
        </section>

        {/* Grille des cartes de laboratoires, responsive et adaptée aux thèmes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {labData.map((lab) => (
            <Link href={lab.href} key={lab.title} passHref>
              {/* La carte utilise --surface pour son fond et des bordures subtiles en mode sombre */}
              <div className="group flex flex-col h-full bg-surface rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden border border-transparent dark:border-text-subtle/20">
                
                <div className="p-8 flex justify-center items-center">
                  {lab.icon}
                </div>

                <div className="p-6 pt-0 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-text-primary mb-3">
                    {lab.title}
                  </h2>
                  <p className="text-text-secondary flex-grow mb-6">
                    {lab.description}
                  </p>

                  {/* Le lien utilise les couleurs de la marque, adaptées pour le mode sombre */}
                  <div className="mt-auto font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2 group-hover:gap-3 transition-all">
                    Ouvrir le laboratoire
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LabsHomePage;