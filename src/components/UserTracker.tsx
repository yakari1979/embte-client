'use client';

import { useEffect } from 'react';
import { monitoringService } from '@/services/api';
import Cookies from 'js-cookie';

export default function UserTracker() {
  useEffect(() => {
    // On ne tracke que si l'utilisateur est connecté
    const token = Cookies.get('token');
    if (!token) return;

    const trackUser = async () => {
      // 1. Infos Navigateur & Système (Basique)
      const userAgent = navigator.userAgent;
      let os = "Inconnu";
      if (userAgent.indexOf("Win") !== -1) os = "Windows";
      if (userAgent.indexOf("Mac") !== -1) os = "MacOS";
      if (userAgent.indexOf("Linux") !== -1) os = "Linux";
      if (userAgent.indexOf("Android") !== -1) os = "Android";
      if (userAgent.indexOf("like Mac") !== -1) os = "iOS";

      // 2. Infos Réseau (Si disponible)
      // @ts-ignore
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const networkType = connection ? connection.effectiveType : 'wifi/unknown';

      // 3. Récupération IP
      let ipAddress = "Masquée";
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        ipAddress = ipData.ip;
      } catch (e) {}

      // 4. Géolocalisation
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            sendData(os, networkType, ipAddress, position.coords.latitude, position.coords.longitude);
          },
          () => {
            // Si refusé, on envoie quand même le reste
            sendData(os, networkType, ipAddress, null, null);
          }
        );
      } else {
        sendData(os, networkType, ipAddress, null, null);
      }
    };

    const sendData = (os: string, networkType: string, ip: string, lat: number | null, lng: number | null) => {
       monitoringService.logConnection({
           deviceModel: navigator.platform, // Ex: MacIntel, Win32
           os: os,
           browser: getBrowserName(),
           networkType: networkType,
           ipAddress: ip,
           latitude: lat,
           longitude: lng
       });
    };

    // Pour ne pas spammer, on le fait une fois au montage
    trackUser();
    
  }, []);

  return null; // Ce composant ne rend rien visuellement
}

// Petit helper pour le navigateur
function getBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase();
    // CORRECTION ICI : Utilisation de "as any" au lieu de "<any>"
    if (agent.indexOf('chrome') > -1 && !!(window as any).chrome) return "Chrome";
    if (agent.indexOf('safari') > -1) return "Safari";
    if (agent.indexOf('firefox') > -1) return "Firefox";
    return "Autre";
}