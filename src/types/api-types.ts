// src/types/api-types.ts

/**
 * Données pour l'inscription d'un nouvel établissement et de son admin.
 * Correspond à la route POST /api/register
 */
export interface RegisterData {
    establishmentName: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string; 
  }
  
  /**
   * Données pour la connexion d'un utilisateur.
   * Correspond à la route POST /api/login
   */
  export interface LoginCredentials {
    // email: string;
    identifiant: string; // <-- Changer 'email' pour 'identifiant'
    password: string;
  }
  
  /**
   * Données pour la création d'un nouvel utilisateur (prof/élève) par un admin.
   * Correspond à la route POST /api/establishment/users
   */
  // export interface NewUserData {
  //   firstName: string;
  //   lastName: string;
  //   email?: string;
  //   password: string;
  //   role: 'TEACHER' | 'STUDENT';
  // }

  export interface NewUserData {
    firstName: string;
    lastName: string;
    role: 'STUDENT' | 'TEACHER';
    email?: string; // Le '?' rend le champ optionnel (il peut être string ou undefined)
  }


  export interface UserCredentials {
    identifiant: string;
    password: string;
  }
  
  /**
   * Données pour créer une nouvelle session de cours dans l'emploi du temps.
   * Correspond à la route POST /api/establishment/classes/:classId/schedule-sessions
   */
  export interface CourseSessionData {
    subject: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    teacherId: string;
  }
  
  /**
   * Données pour ajouter une ressource à un cours.
   * Correspond à la route POST /api/courses/sessions/:sessionId/resources
   */
  export interface ResourceData {
    name: string;
    url: string;
  }