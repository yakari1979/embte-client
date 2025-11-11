// src/types/index.ts

// Type pour les données d'inscription
export interface RegisterData {
    establishmentName: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string; // Le mot de passe peut être optionnel dans certains contextes
  }
  
  // Type pour les identifiants de connexion
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  // Type pour les données de création d'un nouvel utilisateur (par l'admin)
  export interface NewUserData extends RegisterData {
    role: 'TEACHER' | 'STUDENT'; // Le rôle doit être l'un des deux
  }
  
  // Type pour les données d'une session de cours
  export interface CourseSessionData {
    subject: string;
    dayOfWeek: string; // ex: "MONDAY"
    startTime: string; // ex: "08:00"
    endTime: string;   // ex: "10:00"
    teacherId: string;
  }
  
  // Type pour les données d'une ressource de cours
  export interface ResourceData {
    name: string;
    url: string;
  }