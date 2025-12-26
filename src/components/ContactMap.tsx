'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Correction des icônes Leaflet par défaut qui buggent souvent avec Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Composant pour recentrer la carte dynamiquement
function RecenterAutomatically({ lat, lng }: { lat: number, lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng]);
  return null;
}

export default function ContactMap({ userLat, userLng }: { userLat?: number, userLng?: number }) {
  // Coordonnées de Rufisque / Diamniadio (Siège)
  const officePos: [number, number] = [14.7167, -17.2667]; 
  
  // Position à afficher (Utilisateur ou Siège)
  const centerPos: [number, number] = (userLat && userLng) ? [userLat, userLng] : officePos;

  return (
    <MapContainer center={centerPos} zoom={13} scrollWheelZoom={false} className="w-full h-full rounded-2xl z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Marqueur du Siège */}
      <Marker position={officePos} icon={icon}>
        <Popup>
          <b>Siège Nexus BTP</b><br /> Route de Rufisque, Dakar.
        </Popup>
      </Marker>

      {/* Marqueur de l'Utilisateur (si géolocalisé) */}
      {userLat && userLng && (
        <Marker position={[userLat, userLng]} icon={icon}>
          <Popup>Votre position détectée</Popup>
        </Marker>
      )}

      <RecenterAutomatically lat={centerPos[0]} lng={centerPos[1]} />
    </MapContainer>
  );
}