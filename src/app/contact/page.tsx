'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { 
  MapPin, Phone, Mail, Send, Loader2, Crosshair, 
  MessageSquare, Calendar, HelpCircle, CheckCircle2, AlertTriangle, Linkedin, Twitter, Instagram, Facebook 
} from 'lucide-react';
import { publicService } from '@/services/api';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Import dynamique de la carte
const ContactMap = dynamic(() => import('@/components/ContactMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-nexus-gray/20 animate-pulse rounded-2xl flex items-center justify-center text-nexus-concrete">Chargement de la carte...</div>
});

export default function ContactPage() {
  const container = useRef(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  
  // NOUVEAU : État pour gérer le message de retour (Succès ou Erreur)
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    subject: 'RENDEZ_VOUS',
    message: '',
    location: '',
    latitude: 0,
    longitude: 0
  });

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".anim-item", { y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" });
    }, container);
    return () => ctx.revert();
  }, []);

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert("Géolocalisation non supportée."); // Ici un alert est acceptable car c'est une info système
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({ 
            ...prev, 
            latitude, 
            longitude, 
            location: `GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}` 
        }));
        setLocating(false);
      },
      () => {
        setLocating(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('IDLE'); // Réinitialiser le message

    try {
      await publicService.sendContact(formData);
      
      // SUCCÈS : On change l'état et on vide le message
      setStatus('SUCCESS');
      setFormData({ ...formData, message: '', location: '' });

      // On cache le message après 5 secondes
      setTimeout(() => setStatus('IDLE'), 5000);

    } catch (e) {
      // ERREUR
      setStatus('ERROR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={container} className="bg-nexus-black min-h-screen  pt-32 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-16 anim-item">
            <h1 className="text-4xl md:text-6xl font-black text-nexus-text mb-4">
                Parlons de votre <span className="text-nexus-orange">Projet</span>
            </h1>
            <p className="text-nexus-concrete text-lg max-w-2xl mx-auto">
                Une question ? Une réclamation ? Ou prêt à démarrer ? Remplissez le formulaire ci-dessous ou venez nous voir à Rufisque.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* COLONNE GAUCHE : INFOS & CARTE */}
            <div className="space-y-8 anim-item">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-nexus-dark p-6 rounded-2xl border border-nexus-gray hover:border-nexus-orange transition-colors group">
                        <Phone className="text-nexus-orange mb-4 group-hover:scale-110 transition-transform" size={32}/>
                        <h3 className="font-bold text-nexus-text mb-1">Téléphone</h3>
                        <p className="text-nexus-concrete">+221 77 218 74 64</p>
                        <p className="text-nexus-concrete">+221 77 300 20 94</p>
                    </div>
                    <div className="bg-nexus-dark p-6 rounded-2xl border border-nexus-gray hover:border-nexus-orange transition-colors group">
                        <Mail className="text-nexus-orange mb-4 group-hover:scale-110 transition-transform" size={32}/>
                        <h3 className="font-bold text-nexus-text mb-1">Email</h3>
                        <p className="text-nexus-concrete">mou.kone@yahoo.com</p>
                        <p className="text-nexus-concrete">support@embte.sn</p>
                    </div>
                </div>

                <div className="h-[400px] bg-nexus-dark rounded-3xl border border-nexus-gray overflow-hidden relative shadow-2xl">
                    <ContactMap userLat={formData.latitude} userLng={formData.longitude} />
                    <div className="absolute top-4 left-4 bg-nexus-black/80 backdrop-blur px-4 py-2 rounded-xl border border-white/10 z-[1000]">
                        <p className="text-xs text-nexus-concrete uppercase font-bold flex items-center gap-2">
                            <MapPin size={12}/> Notre Siège & Vous
                        </p>
                    </div>
                </div>
            </div>

            {/* COLONNE DROITE : FORMULAIRE */}
            <div className="bg-nexus-dark p-8 md:p-10 rounded-3xl border border-nexus-gray shadow-2xl anim-item">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <h2 className="text-2xl font-bold text-nexus-text mb-6">Envoyez-nous un message</h2>

                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'RENDEZ_VOUS', label: 'Rendez-vous', icon: Calendar },
                            { id: 'RECLAMATION', label: 'Réclamation', icon: MessageSquare },
                            { id: 'AUTRE', label: 'Autre', icon: HelpCircle },
                        ].map((item) => (
                            <label key={item.id} className="cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="subject" 
                                    value={item.id}
                                    checked={formData.subject === item.id}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    className="peer sr-only"
                                />
                                <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-nexus-gray bg-nexus-black text-nexus-concrete peer-checked:bg-nexus-orange peer-checked:text-black peer-checked:border-nexus-orange transition-all hover:bg-nexus-gray/20 h-full">
                                    <item.icon size={20} className="mb-2"/>
                                    <span className="text-[10px] font-bold uppercase text-center">{item.label}</span>
                                </div>
                            </label>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Prénom" value={formData.firstName} onChange={(e: { target: { value: any; }; }) => setFormData({...formData, firstName: e.target.value})} />
                        <Input placeholder="Nom" value={formData.lastName} onChange={(e: { target: { value: any; }; }) => setFormData({...formData, lastName: e.target.value})} />
                    </div>

                    <Input type="email" placeholder="Email" value={formData.email} onChange={(e: { target: { value: any; }; }) => setFormData({...formData, email: e.target.value})} />
                    <Input type="tel" placeholder="Téléphone" value={formData.phone} onChange={(e: { target: { value: any; }; }) => setFormData({...formData, phone: e.target.value})} />

                    <div className="relative">
                        <input 
                            placeholder="Votre adresse ou localisation..." 
                            className="w-full bg-nexus-black border border-nexus-gray rounded-xl px-4 py-3.5 text-nexus-text focus:border-nexus-orange outline-none transition-colors pr-12"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                        <button 
                            type="button"
                            onClick={handleGeolocate}
                            title="Utiliser ma position actuelle"
                            className="absolute right-2 top-2 p-1.5 bg-nexus-dark hover:bg-nexus-orange hover:text-black text-nexus-concrete rounded-lg transition-colors border border-nexus-gray"
                        >
                            {locating ? <Loader2 className="animate-spin" size={18}/> : <Crosshair size={18}/>}
                        </button>
                    </div>

                    <textarea 
                        rows={5}
                        placeholder="Comment pouvons-nous vous aider ?"
                        className="w-full bg-nexus-black border border-nexus-gray rounded-xl px-4 py-3 text-nexus-text focus:border-nexus-orange outline-none transition-colors"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />

                    {/* BOUTON D'ENVOI */}
                    <button 
                        disabled={loading}
                        className="w-full bg-nexus-orange text-black font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-nexus-orange/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? "Envoi..." : <>Envoyer le message <Send size={18}/></>}
                    </button>

                    {/* --- ZONE DE NOTIFICATIONS (MESSAGE PROFESSIONNEL) --- */}
                    
                    {/* MESSAGE DE SUCCÈS */}
                    {status === 'SUCCESS' && (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                            <CheckCircle2 className="shrink-0 mt-0.5" size={20} />
                            <div>
                                <p className="font-bold text-sm">Message envoyé avec succès !</p>
                                <p className="text-xs opacity-80 mt-1">Notre équipe a bien reçu votre demande et vous recontactera sous 24h.</p>
                            </div>
                        </div>
                    )}

                    {/* MESSAGE D'ERREUR */}
                    {status === 'ERROR' && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                            <AlertTriangle className="shrink-0 mt-0.5" size={20} />
                            <div>
                                <p className="font-bold text-sm">Erreur lors de l'envoi</p>
                                <p className="text-xs opacity-80 mt-1">Veuillez vérifier votre connexion internet et réessayer.</p>
                            </div>
                        </div>
                    )}

                </form>
            </div>

        </div>
      </div>

       {/* --- FOOTER --- */}
      <footer className="bg-nexus-dark border-t border-nexus-gray pt-16 pb-8 px-6 text-nexus-concrete">
         <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
                <h3 className="text-2xl font-bold text-nexus-text mb-4">EM<span className="text-nexus-orange">BTE</span></h3>
                <p className="text-sm leading-relaxed">
                    La solution n°1 pour la digitalisation des chantiers en Afrique de l'Ouest.
                </p>
            </div>
              {/* dejas fait */}
            <div>
                <h4 className="text-white font-bold mb-4">Liens Rapides</h4>
                <ul className="space-y-2 text-sm">
                    <li><Link href="#" className="hover:text-nexus-orange">À Propos</Link></li>
                    <li><Link href="/solutions" className="hover:text-nexus-orange">Nos Services</Link></li>
                    <li><Link href="/contact" className="hover:text-nexus-orange">Contacter Nous</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Légal</h4>
                <ul className="space-y-2 text-sm">
                    <li><Link href="/legal" className="hover:text-nexus-orange">Mentions Légales</Link></li>
                    <li><Link href="/privacy" className="hover:text-nexus-orange">Politique de Confidentialité</Link></li>
                    <li><Link href="/cgv" className="hover:text-nexus-orange">CGV</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Contact</h4>
                <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2"><MapPin size={16}/> Dakar, Sénégal</li>
                    <li className="flex items-center gap-2"><Phone size={16}/> +221 33 800 00 00</li>
                    <li className="flex items-center gap-2"><Mail size={16}/> contact@nexusbtp.sn</li>
                </ul>
            </div>
         </div>
          <div className="container mx-auto border-t border-[var(--nexus-gray)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">

            {/* Texte à gauche */}
            <p className="text-[var(--nexus-concrete)] text-center md:text-left flex flex-wrap items-center gap-1">
              © 2025
              <span className="text-[var(--nexus-text)] font-semibold">
                Nexus EMBTE
              </span>.
              Tous droits réservés.
              Code with ❤️ by
              <a
                href="https://ton-lien-epso.com"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  ml-1 px-3 py-1 rounded-full font-semibold
                  text-white
                  bg-gradient-to-r
                  from-[var(--nexus-orange)]
                  to-blue-600
                  hover:to-blue-700
                  transition-all
                  shadow-md
                "
              >
                EPSO
              </a>
            </p>

            {/* Réseaux sociaux */}
            <div className="flex items-center gap-4">

              <a
                href="#"
                aria-label="Facebook"
                className="
                p-2 rounded-full
                bg-gradient-to-br
                from-[var(--nexus-orange)]
                to-blue-600
                text-white
                hover:scale-110
                transition-all
                shadow-md
              "
              >
                <Facebook size={18} />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="
                p-2 rounded-full
                bg-gradient-to-br
                from-[var(--nexus-orange)]
                to-blue-600
                text-white
                hover:scale-110
                transition-all
                shadow-md
              "
              >
                <Linkedin size={18} />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="
                p-2 rounded-full
                bg-gradient-to-br
                from-[var(--nexus-orange)]
                to-blue-600
                text-white
                hover:scale-110
                transition-all
                shadow-md
              "
              >
                <Twitter size={18} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="
                p-2 rounded-full
                bg-gradient-to-br
                from-[var(--nexus-orange)]
                to-blue-600
                text-white
                hover:scale-110
                transition-all
                shadow-md
              "
              >
                <Instagram size={18} />
              </a>

              <a
                href="mailto:contact@nexusembte.com"
                aria-label="Gmail"
                className="
                p-2 rounded-full
                bg-gradient-to-br
                from-[var(--nexus-orange)]
                to-blue-600
                text-white
                hover:scale-110
                transition-all
                shadow-md
              "
              >
                <Mail size={18} />
              </a>

            </div>
          </div>
      </footer>
    </div>
  );
}

const Input = ({ ...props }: any) => (
    <input 
        required
        className="w-full bg-nexus-black border border-nexus-gray rounded-xl px-4 py-3.5 text-nexus-text focus:border-nexus-orange outline-none transition-colors placeholder:text-nexus-concrete/50"
        {...props}
    />
);