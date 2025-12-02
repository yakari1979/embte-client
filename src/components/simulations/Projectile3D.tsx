"use client";
import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Cylinder, Box, OrbitControls, Html, Line, Text, Grid, Trail, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// --- VECTEURS (Optionnels pour la déco) ---
const VectorArrow = ({ origin, direction, length, color, label }: any) => {
    if (length < 0.1) return null;
    return (
        <group position={origin}>
            <arrowHelper args={[direction.normalize(), new THREE.Vector3(0,0,0), length, color, 0.5, 0.3]} />
        </group>
    );
};

// --- CANON ---
const Cannon = ({ angle }: { angle: number }) => (
    <group position={[0, 0, 0]}>
        {/* Base */}
        <Box args={[1.5, 0.5, 1.5]} position={[0, 0.25, 0]} material-color="#1e293b" />
        {/* Roues */}
        <Cylinder args={[0.4, 0.4, 0.2, 16]} rotation={[Math.PI/2, 0, 0]} position={[0, 0.4, 0.8]} material-color="black" />
        <Cylinder args={[0.4, 0.4, 0.2, 16]} rotation={[Math.PI/2, 0, 0]} position={[0, 0.4, -0.8]} material-color="black" />
        
        {/* Tube Pivotant */}
        <group position={[0, 0.8, 0]} rotation={[0, 0, angle * (Math.PI / 180)]}>
            <Cylinder args={[0.25, 0.3, 3]} position={[0, 1.5, 0]} material-color="#475569" />
            <Cylinder args={[0.3, 0.35, 0.5]} position={[0, 0.2, 0]} material-color="#334155" />
        </group>
        
        {/* Affichage Angle */}
        <Text position={[1.5, 1, 0]} fontSize={0.5} color="white">{angle}°</Text>
    </group>
);

// --- BALLE PHYSIQUE ---
const Projectile = ({ trajectory, isAnimating, onFinish, setHudData }: any) => {
    // CORRECTION TYPE : On utilise 'any' pour éviter le conflit de type avec <Trail>
    const ref = useRef<any>(null);
    const [index, setIndex] = useState(0);
    const { camera, controls } = useThree(); // On récupère les contrôles

    useFrame((state, delta) => {
        // --- CAS 1 : ANIMATION EN COURS ---
        if (isAnimating && ref.current && index < trajectory.length - 1) {
            const speed = 40; 
            const nextIndex = Math.min(trajectory.length - 1, index + Math.ceil(speed * delta));
            setIndex(nextIndex);
            
            const currentPos = trajectory[nextIndex];
            const prevPos = trajectory[Math.max(0, nextIndex - 1)];
            
            // Mise à jour position balle
            ref.current.position.set(currentPos.x, currentPos.y, 0);

            // Mise à jour HUD
            const vx = (currentPos.x - prevPos.x) * 50;
            const vy = (currentPos.y - prevPos.y) * 50;
            setHudData({
                alt: currentPos.y.toFixed(1),
                dist: currentPos.x.toFixed(1),
                vx: vx,
                vy: vy
            });

            // CAMERA TRACKING (Suivi automatique)
            // La caméra suit la balle de côté et un peu en hauteur
            const targetCamPos = new THREE.Vector3(currentPos.x - 10, Math.max(5, currentPos.y + 2), 20);
            camera.position.lerp(targetCamPos, 0.1);
            
            // La caméra regarde la balle
            const lookAtTarget = new THREE.Vector3(currentPos.x, currentPos.y, 0);
            
            // Si on a des contrôles (OrbitControls), on met à jour leur cible
            // @ts-ignore
            if (controls) controls.target.lerp(lookAtTarget, 0.1);
            
            camera.lookAt(lookAtTarget);

            // Fin de trajectoire
            if (nextIndex >= trajectory.length - 1) onFinish();
        } 
        
        // --- CAS 2 : RESET (Retour départ) ---
        else if (!isAnimating && ref.current && index !== 0) {
            // On remet tout à zéro
            ref.current.position.set(0, 0, 0);
            setIndex(0);
            
            // Reset caméra position de départ
            camera.position.lerp(new THREE.Vector3(-5, 5, 25), 0.1);
            // @ts-ignore
            if (controls) controls.target.set(10, 0, 0);
        }
        
        // --- CAS 3 : FINI (L'élève peut naviguer) ---
        // On ne force plus la caméra, OrbitControls prend le relais
    });

    return (
        <group>
            <mesh ref={ref}>
                <sphereGeometry args={[0.4]} />
                <meshStandardMaterial color="#facc15" emissive="#ca8a04" emissiveIntensity={0.5} />
            </mesh>
            
            {/* Traînée dynamique derrière la balle */}
            <Trail width={1} length={8} color="#fbbf24" attenuation={(t) => t * t} target={ref} />
        </group>
    );
};

// --- DÉCOR ---
const FieldMarkers = ({ range }: { range: number }) => {
    const maxDist = Math.max(range + 20, 50);
    const markers = [];
    
    for(let i=10; i<=maxDist; i+=10) {
        markers.push(
            <group key={i} position={[i, 0.05, 0]}>
                <Text rotation={[-Math.PI/2, 0, 0]} fontSize={1.5} color="white" fillOpacity={0.3}>
                    {i}m
                </Text>
                <mesh rotation={[-Math.PI/2, 0, 0]}>
                    <planeGeometry args={[0.1, 5]} />
                    <meshBasicMaterial color="white" opacity={0.2} transparent />
                </mesh>
            </group>
        );
    }
    return <group>{markers}</group>;
};

export default function Projectile3D({ config, angle, isAnimating, onFinish, setHudData }: any) {
    const points = config?.trajectory || [];
    const range = parseFloat(config?.stats?.range || "0");

    // Conversion des points pour le composant Line
    const linePoints = useMemo(() => {
        return points.map((p: any) => [p.x, p.y, 0] as [number, number, number]);
    }, [points]);

    return (
        <div className="w-full h-[600px] bg-slate-900 rounded-xl overflow-hidden border-4 border-slate-700 shadow-2xl relative">
            <Canvas shadows>
                <PerspectiveCamera makeDefault position={[-5, 5, 25]} fov={45} />
                <color attach="background" args={['#0f172a']} />
                
                {/* Éclairage */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
                
                {/* Sol */}
                <Grid position={[0, -0.01, 0]} args={[300, 50]} cellSize={1} cellThickness={0.5} cellColor="#1e293b" sectionSize={5} sectionThickness={1} sectionColor="#334155" infiniteGrid fadeDistance={100} />
                
                <Cannon angle={angle} />
                
                <FieldMarkers range={range} />

                {/* --- LA BALLE --- */}
                <Projectile 
                    trajectory={points} 
                    isAnimating={isAnimating} 
                    onFinish={onFinish} 
                    setHudData={setHudData}
                />

                {/* --- TRAJECTOIRE THÉORIQUE (Tracé pointillé) --- */}
                {/* Elle s'affiche dès qu'on a les données, même avant le tir */}
                {linePoints.length > 0 && (
                    <Line 
                        points={linePoints}       // Liste des points
                        color="white"             // Couleur
                        opacity={0.3}             // Transparence
                        transparent
                        lineWidth={2}             // Épaisseur
                        dashed={true}             // Pointillés
                        dashScale={2}             // Échelle des pointillés
                        dashSize={1}              // Taille du trait
                        gapSize={1}               // Taille du vide
                    />
                )}

                {/* --- DRAPEAU D'ARRIVÉE (Fin de course) --- */}
                {points.length > 0 && !isAnimating && (
                    <group position={[points[points.length-1].x, 0, 0]}>
                        <Cylinder args={[0.05, 0.05, 2]} position={[0, 1, 0]} material-color="white"/>
                        <mesh position={[0.4, 1.8, 0]}>
                            <boxGeometry args={[0.8, 0.5, 0.05]} />
                            <meshStandardMaterial color="#ef4444" />
                        </mesh>
                        <Html position={[0, 2.5, 0]} center>
                            <div className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded shadow-lg animate-bounce whitespace-nowrap">
                                {range.toFixed(2)} m
                            </div>
                        </Html>
                    </group>
                )}

                {/* Contrôles manuels (activés quand l'animation est finie) */}
                {/* L'utilisateur peut zoomer/tourner autour du point de chute */}
                <OrbitControls 
                    enabled={!isAnimating} 
                    maxPolarAngle={Math.PI / 2 - 0.1} // Ne pas passer sous le sol
                    target={[range > 0 ? range : 10, 0, 0]} // Cible par défaut
                />
            </Canvas>
            
            {!isAnimating && range > 0 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-xs pointer-events-none backdrop-blur border border-white/20">
                    Souris : Clic Gauche (Tourner) • Molette (Zoomer) • Clic Droit (Déplacer)
                </div>
            )}
        </div>
    );
}