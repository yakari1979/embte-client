'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState, useMemo } from 'react'
import { Group, Vector3 } from 'three'
import { 
  Text, 
  Environment, 
  ContactShadows,
  Grid,
  Float,
  PerspectiveCamera
} from '@react-three/drei'
import * as THREE from 'three'

// --- 1. MOBILIER INTÉRIEUR (BUREAUX) ---
function InteriorFurniture() {
  return (
    <group>
      {/* Bureau 1 */}
      <group position={[-0.8, 0, -0.8]} rotation={[0, 0.5, 0]}>
         <mesh position={[0, 0.35, 0]} castShadow receiveShadow> {/* Table */}
            <boxGeometry args={[0.8, 0.05, 0.5]} />
            <meshStandardMaterial color="#ffffff" />
         </mesh>
         <mesh position={[0, 0.17, 0]} castShadow receiveShadow> {/* Pied */}
            <boxGeometry args={[0.05, 0.35, 0.4]} />
            <meshStandardMaterial color="#333" />
         </mesh>
         <mesh position={[0, 0.45, 0.1]}> {/* Écran */}
            <boxGeometry args={[0.3, 0.2, 0.02]} />
            <meshStandardMaterial color="#111" />
         </mesh>
      </group>

      {/* Bureau 2 */}
      <group position={[0.8, 0, 0.5]} rotation={[0, -0.5, 0]}>
         <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.8, 0.05, 0.5]} />
            <meshStandardMaterial color="#ffffff" />
         </mesh>
         <mesh position={[0, 0.17, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.05, 0.35, 0.4]} />
            <meshStandardMaterial color="#333" />
         </mesh>
         <mesh position={[0, 0.45, 0.1]}>
            <boxGeometry args={[0.3, 0.2, 0.02]} />
            <meshStandardMaterial color="#FF6B00" />
         </mesh>
      </group>
    </group>
  )
}

// --- 2. LOGO EMBTE 3D ---
function EmbteLogo() {
  return (
    <group position={[0, 3.5, 0]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          fontSize={0.8}
          color="#FF6B00"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          EMBTE
        </Text>
        <Text
          position={[0, -0.6, 0]}
          fontSize={0.25}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          BÂTIMENT & ÉTUDES
        </Text>
      </Float>
    </group>
  )
}

// --- 3. STRUCTURE D'UN ÉTAGE ---
function Floor({ position, delay }: { position: [number, number, number], delay: number }) {
  const groupRef = useRef<Group>(null!)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const cycle = time % 12 
    
    let targetScale = 0
    // Apparition 
    if (cycle > delay && cycle < 11) {
        targetScale = 1
    }

    if (groupRef.current) {
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* DALLE SOL */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[3.2, 0.1, 3.2]} />
        <meshStandardMaterial color="#222" roughness={0.2} metalness={0.5} />
      </mesh>

      {/* POTEAUX */}
      {[[-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5], [1.5, 1.5]].map((pos, i) => (
         <mesh key={i} position={[pos[0], 0.75, pos[1]]} castShadow receiveShadow>
            <boxGeometry args={[0.2, 1.5, 0.2]} />
            <meshStandardMaterial color="#FF6B00" />
         </mesh>
      ))}

      {/* VITRES */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[3.1, 1.4, 3.1]} />
        <meshPhysicalMaterial 
            color="#88ccee" 
            transparent 
            opacity={0.3} 
            roughness={0} 
            metalness={0.1} 
            transmission={0.5} 
            thickness={1}
        />
      </mesh>

      <InteriorFurniture />
    </group>
  )
}

// --- 4. CAMÉRA INTELLIGENTE ---
function CameraDirector() {
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const cycle = time % 12 

    // Positions clés
    const startPos = new THREE.Vector3(8, 6, 8)
    const closePos = new THREE.Vector3(2, 2, 4)
    
    const targetPos = new THREE.Vector3()
    const targetLook = new THREE.Vector3(0, 1, 0)

    if (cycle < 5) {
        // Vue d'ensemble qui tourne
        const angle = time * 0.3
        targetPos.set(Math.sin(angle) * 8, 5, Math.cos(angle) * 8)
    } else if (cycle < 10) {
        // Zoom vers l'entrée
        targetPos.lerpVectors(startPos, closePos, (cycle - 5) / 5)
    } else {
        // Reset rapide
        targetPos.copy(startPos)
    }

    state.camera.position.lerp(targetPos, 0.05)
    state.camera.lookAt(targetLook)
  })
  return null
}

// --- 5. SCÈNE PRINCIPALE ---
export default function ConstructionAnimation() {
  return (
    // CORRECTION : Hauteur forcée h-[600px] pour être sûr que ça s'affiche
    <div className="w-full h-[600px] bg-gradient-to-b from-gray-900 to-black rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl">
      
      <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-nexus-orange/20 border border-nexus-orange rounded-full">
        <p className="text-[10px] font-mono text-nexus-orange animate-pulse">BIM LIVE RENDER</p>
      </div>

      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={45} />
        <CameraDirector />

        <ambientLight intensity={0.5} />
        <spotLight position={[10, 20, 10]} angle={0.25} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={1} color="#3B82F6" />
        
        <Environment preset="city" />

        <group position={[0, -2, 0]}>
            <Floor position={[0, 0, 0]} delay={0} />
            <Floor position={[0, 1.5, 0]} delay={1} />
            <Floor position={[0, 3.0, 0]} delay={2} />
            <EmbteLogo />
        </group>

        <Grid 
            position={[0, -2.1, 0]} 
            args={[20, 20]} 
            cellSize={0.5} 
            cellThickness={1} 
            cellColor="#444" 
            sectionSize={2.5}
            sectionThickness={1.5}
            sectionColor="#FF6B00"
            fadeDistance={15}
        />
        
        <ContactShadows position={[0, -2.1, 0]} opacity={0.5} scale={20} blur={2} far={4} />
      </Canvas>
    </div>
  )
}