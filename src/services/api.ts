import axios from 'axios';
import { 
  RegisterData, 
  LoginCredentials, 
  NewUserData, 
  CourseSessionData} from '../types/api-types';


const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Crée le client Axios avec l'URL dynamique
const apiClient = axios.create({
  baseURL: baseURL,
});

// =======================================================
//   SERVICE D'AUTHENTIFICATION
// =======================================================

export const register = (data: RegisterData) => {
  return apiClient.post('/register', data);
};

export const login = (credentials: LoginCredentials) => {
  return apiClient.post('/login', credentials);
};


// =======================================================
//   SERVICE UTILISATEUR (Routes préfixées par /users)
// =======================================================

export const getMyProfile = (token: string) => {
  return apiClient.get('/users/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getMyStudentSchedule = (token: string) => {
  return apiClient.get('/users/my-schedule', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getMyTeacherSchedule = (token: string) => {
  return apiClient.get('/users/my-teaching-schedule', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getMyClasses = (token: string) => {
  return apiClient.get('/users/my-classes', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getMyClassDetails = (classId: string, token: string) => {
  return apiClient.get(`/users/my-classes/${classId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};


// =======================================================
//   SERVICE D'ADMINISTRATION (Routes préfixées par /establishment)
// =======================================================

export const createUser = (userData: NewUserData, token: string) => {
  return apiClient.post('/establishment/users', userData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const listUsers = (token: string) => {
  return apiClient.get('/establishment/users', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const createClass = (className: string, token: string) => {
  return apiClient.post('/establishment/classes', { name: className }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const listClasses = (token: string) => {
  return apiClient.get('/establishment/classes', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const assignStudentToClass = (classId: string, studentId: string, token: string) => {
  return apiClient.post(`/establishment/classes/${classId}/assign-student`, { studentId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const assignTeacherToClass = (classId: string, teacherId: string, token: string) => {
  return apiClient.post(`/establishment/classes/${classId}/assign-teacher`, { teacherId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const addCourseSession = (classId: string, sessionData: CourseSessionData, token: string) => {
  return apiClient.post(`/establishment/classes/${classId}/schedule-sessions`, sessionData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};


// =======================================================
//   SERVICE DE COURS (Routes préfixées par /courses)
// =======================================================

export const getSessionSummary = (sessionId: string, token: string) => {
  return apiClient.get(`/courses/sessions/${sessionId}/summary`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getSessionResources = (sessionId: string, token: string) => {
  return apiClient.get(`/courses/sessions/${sessionId}/resources`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};


interface NewResourceData {
  name: string;
  file: File; // On attend un objet File, pas une URL
}

// Fonction MODIFIÉE
export const addSessionResource = (sessionId: string, data: NewResourceData, token: string) => {
  // 1. On crée un objet FormData
  const formData = new FormData();
  
  // 2. On y ajoute les données
  formData.append('name', data.name);
  formData.append('file', data.file); // Le nom 'file' doit correspondre à celui dans `upload.single('file')`

  // 3. On envoie la requête. Axios s'occupera de mettre le bon Content-Type.
  return apiClient.post(`/courses/sessions/${sessionId}/resources`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      // PAS besoin de 'Content-Type': 'multipart/form-data', Axios le fait pour nous
    }
  });
};

export const getSessionStatus = (sessionId: string, token: string) => {
  return apiClient.get(`/courses/sessions/${sessionId}/details`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const toggleLiveStatus = (sessionId: string, token: string) => {
  return apiClient.post(`/courses/sessions/${sessionId}/toggle-live`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const toggleChatStatus = (sessionId: string, token: string) => {
  return apiClient.post(`/courses/sessions/${sessionId}/toggle-chat`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getSessionMessages = (sessionId: string, token: string) => {
  return apiClient.get(`/courses/sessions/${sessionId}/messages`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const saveAttendance = (
  sessionId: string, 
  data: { attendances: { studentId: string; status: string }[], date: string },
  token: string
) => {
  return apiClient.post(`/courses/sessions/${sessionId}/attendance`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};



// =======================================================
//   SERVICE DE NOTATION (Routes préfixées par /grades)
// =======================================================

// Les types pour nos nouvelles données
export type Appreciation = "EXCELLENT" | "TRES_BIEN" | "BIEN" | "PASSABLE" | "INSUFFISANT" | "ACQUERIR" | "NON_NOTE";


export interface TeacherInfo {
  firstName: string;
  lastName: string;
}


export interface Evaluation {
  id: string;
  title: string;
  type: string;
  subject: string;
  teacher: TeacherInfo; 
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Grade {
  id: string;
  score: number | null;
  appreciation: Appreciation;
  studentId: string;
  evaluationId: string;
}

export interface GradingData {
  students: Student[];
  evaluations: Evaluation[];
  grades: Grade[];
  teacherSubjects: string[]; 
}

// Type de réponse pour la page de l'élève
export interface GradeWithEvaluation extends Grade {
  evaluation: Evaluation;
}


interface NewEvaluationData {
  title: string;
  type: 'TD' | 'DEVOIR';
  subject: string;
  classId: string;
}

interface UpsertGradeData {
  studentId: string;
  evaluationId: string;
  score: number | null;
  appreciation: Appreciation;
}




// Récupère toutes les données (élèves, évals, notes) pour une classe
export const getGradingDataForClass = (classId: string, token: string) => {
  return apiClient.get<GradingData>(`/grades/class/${classId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};



// Pour la page de l'élève : Récupère toutes les notes de l'étudiant connecté
export const getMyGrades = (token: string) => {
  return apiClient.get<GradeWithEvaluation[]>('/grades/my-grades', {
    headers: { Authorization: `Bearer ${token}` }
  });
};


// Crée une nouvelle évaluation (ex: un nouveau TD)
export const createEvaluation = (data: NewEvaluationData, token: string) => {
  return apiClient.post('/grades/evaluations', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};


export const deleteEvaluation = (evaluationId: string, token: string) => {
  return apiClient.delete(`/grades/evaluations/${evaluationId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};


export const upsertGrade = (data: UpsertGradeData, token: string) => {
  return apiClient.post('/grades', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};



export interface Notification {
  id: string;
  message: string;
  link: string | null;
  createdAt: string;
}

export const getMyNotifications = (token: string) => {
    return apiClient.get<Notification[]>('/notifications/my-notifications', {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// --- NOUVELLE FONCTION ---
export const markNotificationAsRead = (notificationId: string, token: string) => {
  return apiClient.post(`/notifications/${notificationId}/mark-as-read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
  });
};






// --- NOUVEAUX TYPES POUR LA PAGE "MES COURS" ---
export interface Classmate {
  id: string;
  firstName: string;
  lastName: string;
}
export interface Teacher extends Classmate {}
export interface Resource {
  id: string;
  name: string;
  url: string;
}
export interface SessionWithResources {
  id: string;
  subject: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  teacher: Teacher;
  resources: Resource[];
  weeklyPlanItems: WeeklyPlanItem[]; // <-- AJOUTER CETTE LIGNE
}
export interface MyCourseDetailsResponse {
  id: string;
  name: string;
  classmates: Classmate[];
  teachers: Teacher[];
  schedule: {
    sessions: SessionWithResources[];
  } | null;
}


export const getMyCourseDetails = (token: string) => {
    return apiClient.get<MyCourseDetailsResponse>('/users/my-course-details', {
        headers: { Authorization: `Bearer ${token}` }
    });
};



export const resetUserPassword = (identifiant: string, token: string) => {
  return apiClient.post('/establishment/users/reset-password', { identifiant }, {
      headers: { Authorization: `Bearer ${token}` }
  });
};







// --- NOUVEAUX TYPES ET FONCTION POUR LE DASHBOARD ADMIN ---


export interface AdminStats {
  studentCount: number;
  teacherCount: number;
  classCount: number;
}
export interface RecentUser {
  id: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'TEACHER';
}
export interface AdminDashboardData {
  stats: AdminStats;
  recentUsers: RecentUser[];
}

export const getAdminDashboardSummary = (token: string) => {
    return apiClient.get<AdminDashboardData>('/establishment/dashboard-summary', {
        headers: { Authorization: `Bearer ${token}` }
    });
};



export const searchUsers = (query: string, token: string) => {
  return apiClient.get(`/establishment/users/search?q=${query}`, {
      headers: { Authorization: `Bearer ${token}` }
  });
};

export const getUserDetails = (userId: string, token: string) => {
  return apiClient.get(`/establishment/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
  });
};




// Récupère les détails d'une classe pour l'admin (élèves, profs)
export const getAdminClassDetails = (classId: string, token: string) => {
  return apiClient.get(`/establishment/classes/${classId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};


// Récupère les statistiques calculées pour le tableau de bord d'une classe
export const getAdminClassDashboardStats = (classId: string, token: string) => {
    return apiClient.get(`/establishment/classes/${classId}/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};




export const updateCourseSession = (sessionId: string, sessionData: CourseSessionData, token: string) => {
  return apiClient.put(`/establishment/sessions/${sessionId}`, sessionData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};


export const deleteCourseSession = (sessionId: string, token: string) => {
  return apiClient.delete(`/establishment/sessions/${sessionId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};






// ======================================================================================
//   SERVICE DE SIMULATION QUANTIQUE si on a une autre microservice on vas utiliser sa 
// ======================================================================================



// export const getQuantumSimulationImage = (
//   simulationType: 'superposition-bloch' | 'entanglement-histogram' | 'measurement', 
//   token: string
// ) => {
// return apiClient.get(`/quantum-sim/${simulationType}`, {
//   headers: { Authorization: `Bearer ${token}` }
// });
// }



// export const getPhysicsSimulationImage = (params: { velocity: number; angle: number }, token: string) => {
//   return apiClient.post(`/physics-sim/projectile`, params, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };



// export const getRLCSimulationImage = (params: { R: number; L: number; C: number }, token: string) => {
//   return apiClient.post(`/physics-sim/rlc-resonance`, params, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };



// export const getLensSimulationImage = (params: { focalLength: number; objectDistance: number; }, token: string) => {
//   return apiClient.post(`/physics-sim/lens`, params, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };




// export const getDecaySimulationImage = (params: { initialNuclei: number; halfLife: number; }, token: string) => {
//   return apiClient.post(`/physics-sim/decay`, params, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };



// export const getTitrationSimulationImage = (params: { Ca: number; Va: number; Cb: number }, token: string) => {
//   return apiClient.post(`/physics-sim/titration`, params, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };


 
// export const getLeChatelierSimulationImage = (params: { perturbation: 'add_N2' | 'add_NH3' }, token: string) => {
//   return apiClient.post(`/physics-sim/le-chatelier`, params, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };




// export const getDaniellCellSimulationImages = (token: string) => {
//   return apiClient.get(`/physics-sim/daniell-cell`, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };



// export const getKineticsSimulationImage = (params: { initialConcentration: number; temperature: number; }, token: string) => {
//   return apiClient.post(`/physics-sim/kinetics`, params, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };



// export const getTimeDilationSimulation = (params: { properTime: number; percentageOfC: number; }, token: string) => {
//   return apiClient.post(`/physics-sim/time-dilation`, params, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };


// export const getGeneticsSimulation = (params: { parent1: string; parent2: string; offspringCount: number }, token: string) => {
//   return apiClient.post(`/physics-sim/genetics`, params, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };



// export const getEcologySimulation = (params: { initialPrey: number; initialPredators: number; }, token: string) => {
//   return apiClient.post(`/physics-sim/predator-prey`, params, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };



// export const getTranscriptionSimulation = (token: string) => {
//   return apiClient.get(`/physics-sim/transcription`, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };



// export const getContinentalDriftData = (token: string) => {
//   return apiClient.get(`/physics-sim/continental-drift`, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };


// export const getEnzymeKineticsSimulation = (token: string) => {
//   // Pas de paramètres à envoyer pour cette simulation
//   return apiClient.post(`/physics-sim/enzyme-kinetics`, {}, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };


// export const getAgePyramidSimulation = (params: { country: string; birthModifier: number; lifeModifier: number }, token: string) => {
//   return apiClient.post(`/history-sim/age-pyramid`, params, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };




// export const getHistorySimulationData = (token: string) => {
//   return apiClient.get(`/history-sim/west-african-empires`, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };




// export const getFaradaySimulationImage = (params: { magnetPosition: number; magnetVelocity: number; }, token: string) => {
//   return apiClient.post(`/physics-sim/faraday`, params, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };



// export const getWordCloudImage = (text: string, token: string) => {
//   return apiClient.post(`/history-sim/word-cloud`, { text }, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };



// ===========================================================================================================================
//   SERVICE DE SIMULATION (SECTION CORRIGÉE) mais cette partis c'est par ce uqe on a fusionner les deux pas de microservice 
// ==========================================================================================================================

// --- DÉBUT DE LA CORRECTION ---
// Le préfixe commun pour toutes les simulations, SANS /api
const SIM_PREFIX = '/simulations';
// --- FIN DE LA CORRECTION ---


export const getQuantumSimulationImage = (
  simulationType: 'superposition-bloch' | 'entanglement-histogram' | 'measurement', 
  token: string
) => {
  return apiClient.get(`${SIM_PREFIX}/quantum-sim/${simulationType}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export const getPhysicsSimulationImage = (params: { velocity: number; angle: number }, token: string) => {
  return apiClient.post(`${SIM_PREFIX}/physics-sim/projectile`, params, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getRLCSimulationImage = (params: { R: number; L: number; C: number }, token: string) => {
  return apiClient.post(`${SIM_PREFIX}/physics-sim/rlc-resonance`, params, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getLensSimulationImage = (params: { focalLength: number; objectDistance: number; }, token: string) => {
  return apiClient.post(`${SIM_PREFIX}/physics-sim/lens`, params, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getDecaySimulationImage = (params: { initialNuclei: number; halfLife: number; }, token: string) => {
  return apiClient.post(`${SIM_PREFIX}/physics-sim/decay`, params, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getTitrationSimulationImage = (params: { Ca: number; Va: number; Cb: number }, token: string) => {
  return apiClient.post(`${SIM_PREFIX}/physics-sim/titration`, params, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getLeChatelierSimulationImage = (params: { perturbation: 'add_N2' | 'add_NH3' }, token: string) => {
  return apiClient.post(`${SIM_PREFIX}/physics-sim/le-chatelier`, params, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getDaniellCellSimulationImages = (token: string) => {
  return apiClient.get(`${SIM_PREFIX}/physics-sim/daniell-cell`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getKineticsSimulationImage = (params: { initialConcentration: number; temperature: number; }, token: string) => {
  return apiClient.post(`${SIM_PREFIX}/physics-sim/kinetics`, params, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getTimeDilationSimulation = (params: { properTime: number; percentageOfC: number; }, token: string) => {
  return apiClient.post(`${SIM_PREFIX}/physics-sim/time-dilation`, params, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getGeneticsSimulation = (params: { parent1: string; parent2: string; offspringCount: number }, token: string) => {
  return apiClient.post(`${SIM_PREFIX}/physics-sim/genetics`, params, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getEcologySimulation = (params: { initialPrey: number; initialPredators: number; }, token: string) => {
  return apiClient.post(`${SIM_PREFIX}/physics-sim/predator-prey`, params, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getTranscriptionSimulation = (token: string) => {
  return apiClient.get(`${SIM_PREFIX}/physics-sim/transcription`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getContinentalDriftData = (token: string) => {
  return apiClient.get(`${SIM_PREFIX}/physics-sim/continental-drift`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getEnzymeKineticsSimulation = (token: string) => {
  return apiClient.post(`${SIM_PREFIX}/physics-sim/enzyme-kinetics`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getAgePyramidSimulation = (params: { country: string; birthModifier: number; lifeModifier: number }, token: string) => {
  return apiClient.post(`${SIM_PREFIX}/history-sim/age-pyramid`, params, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getHistorySimulationData = (token: string) => {
  return apiClient.get(`${SIM_PREFIX}/history-sim/west-african-empires`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getFaradaySimulationImage = (params: { magnetPosition: number; magnetVelocity: number; }, token: string) => {
  return apiClient.post(`${SIM_PREFIX}/physics-sim/faraday`, params, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getWordCloudImage = (text: string, token: string) => {
  return apiClient.post(`${SIM_PREFIX}/history-sim/word-cloud`, { text }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};



// =======================================================
//   SERVICE DU BLOG (Routes préfixées par /blog)
// =======================================================

export interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  coverImageUrl: string | null; 
  author: {
      firstName: string;
      lastName: string;
  };
}

export interface NewPostData {
  title: string;
  content: string;
  coverImage?: File | null; 
  published?: boolean;
}



const createOrUpdateBlogPost = (postId: string | null, postData: NewPostData, token: string) => {
  const formData = new FormData();
  formData.append('title', postData.title);
  formData.append('content', postData.content);
  formData.append('published', String(postData.published || false));
  if (postData.coverImage) {
      formData.append('coverImage', postData.coverImage); // Le nom 'coverImage' doit correspondre au middleware
  }

  const config = { headers: { Authorization: `Bearer ${token}` }};

  if (postId) { // Mise à jour
      return apiClient.put<Post>(`/blog/posts/${postId}`, formData, config);
  } else { // Création
      return apiClient.post<Post>('/blog/posts', formData, config);
  }
};


export const createBlogPost = (postData: NewPostData, token: string) => {
  return createOrUpdateBlogPost(null, postData, token);
};

export const updateBlogPost = (postId: string, postData: NewPostData, token: string) => {
  return createOrUpdateBlogPost(postId, postData, token);
};



export const getBlogPostsForAdmin = (token: string) => {
  return apiClient.get<Post[]>('/blog/all', {
      headers: { Authorization: `Bearer ${token}` }
  });
};



export const deleteBlogPost = (postId: string, token: string) => {
  return apiClient.delete(`/blog/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` }
  });
};



export const getPublishedBlogPosts = (token: string) => {
  return apiClient.get<Post[]>('/blog/published', {
      headers: { Authorization: `Bearer ${token}` }
  });
};


export const getBlogPostById = (postId: string, token: string) => {
    return apiClient.get<Post>(`/blog/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};





// =======================================================
//   SERVICE DE MODÉRATION (Routes préfixées par /moderator)
// =======================================================

export interface GlobalStats {
  establishmentCount: number;
  classCount: number;
  adminCount: number;
  teacherCount: number;
  studentCount: number;
}



// export interface EstablishmentSummary {
//   id: string;
//   name: string;
//   isSuspended: boolean; 
//   _count: {
//       users: number;
//   };
// }

export interface EstablishmentDetails {
  id: string;
  name: string;
  users: {
      id: string;
      firstName: string;
      lastName: string;
      role: string;
      identifiant: string;
  }[];
  classes: {
      id: string;
      name: string;
      _count: {
          students: number;
      };
  }[];
}


export interface SearchedUser {
  id: string;
  firstName: string;
  lastName: string;
  identifiant: string;
  role: string;
  establishment: { name: string } | null;
}

export interface Moderator {
  id: string;
  firstName: string;
  lastName: string;
  identifiant: string;
}

export interface NewModeratorData {
  firstName: string;
  lastName: string;
  identifiant: string;
}


export interface NewEstablishmentData {
  establishmentName: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
}


export const getGlobalStats = (token: string) => {
  return apiClient.get<GlobalStats>('/moderator/global-stats', {
      headers: { Authorization: `Bearer ${token}` }
  });
};


export const listAllEstablishments = (token: string) => {
  return apiClient.get<EstablishmentSummary[]>('/moderator/establishments', {
      headers: { Authorization: `Bearer ${token}` }
  });
};

// export const getEstablishmentDetails = (establishmentId: string, token: string) => {
//   return apiClient.get<EstablishmentDetails>(`/moderator/establishments/${establishmentId}`, {
//       headers: { Authorization: `Bearer ${token}` }
//   });
// };

export const searchAllUsers = (query: string, token: string) => {
  return apiClient.get<SearchedUser[]>(`/moderator/users/search?q=${query}`, {
      headers: { Authorization: `Bearer ${token}` }
  });
};

export const listModerators = (token: string) => {
  return apiClient.get<Moderator[]>('/moderator/management/list', {
      headers: { Authorization: `Bearer ${token}` }
  });
};

export const createModerator = (data: NewModeratorData, token: string) => {
  return apiClient.post('/moderator/management/create', data, {
      headers: { Authorization: `Bearer ${token}` }
  });
};


export const createEstablishmentWithAdmin = (data: NewEstablishmentData, token: string) => {
  return apiClient.post('/moderator/establishments/create', data, {
      headers: { Authorization: `Bearer ${token}` }
  });
};


export const toggleEstablishmentSuspension = (establishmentId: string, token: string) => {
  return apiClient.put(`/moderator/establishments/${establishmentId}/toggle-suspension`, {}, {
      headers: { Authorization: `Bearer ${token}` }
  });
};

export const deleteEstablishment = (establishmentId: string, token: string) => {
  return apiClient.delete(`/moderator/establishments/${establishmentId}`, {
      headers: { Authorization: `Bearer ${token}` }
  });
};



export type PlanItemType = 'LESSON' | 'ASSIGNMENT' | 'REVIEW' | 'OTHER';

export interface WeeklyPlanItem {
  id: string;
  content: string;
  type: PlanItemType;
  isCompleted: boolean;
  courseSessionId: string;
}

export interface NewPlanItemData {
  content: string;
  type: PlanItemType;
}

export interface UpdatePlanItemData {
  content?: string;
  isCompleted?: boolean;
}

export const createWeeklyPlanItem = (sessionId: string, data: NewPlanItemData, token: string) => {
    return apiClient.post(`/courses/sessions/${sessionId}/plan`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const updateWeeklyPlanItem = (planItemId: string, data: UpdatePlanItemData, token: string) => {
    return apiClient.put(`/courses/plan-items/${planItemId}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const deleteWeeklyPlanItem = (planItemId: string, token: string) => {
    return apiClient.delete(`/courses/plan-items/${planItemId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};


// --- NOUVEAUX TYPES ET FONCTIONS POUR LE PLAN DE RÉVISIONS ÉLÈVE ---

export interface StudentPlanItem {
  id: string;
  goal: string;
  isCompleted: boolean;
  planDate: string; // Date en format ISO string
  subject: string;
}

export interface NewStudentPlanData {
  goal: string;
  planDate: string;
  subject: string;
}

export const getMyRevisionPlan = (token: string) => {
  return apiClient.get<StudentPlanItem[]>('/users/my-revision-plan', {
      headers: { Authorization: `Bearer ${token}` }
  });
};

export const createStudentPlanItem = (data: NewStudentPlanData, token: string) => {
  return apiClient.post<StudentPlanItem>('/users/my-revision-plan', data, {
      headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateStudentPlanItem = (itemId: string, data: Partial<NewStudentPlanData & { isCompleted: boolean }>, token: string) => {
  return apiClient.put(`/users/my-revision-plan/${itemId}`, data, {
      headers: { Authorization: `Bearer ${token}` }
  });
};

export const deleteStudentPlanItem = (itemId: string, token: string) => {
  return apiClient.delete(`/users/my-revision-plan/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` }
  });
};

export interface EstablishmentSummary {
  id: string;
  name: string;
  isSuspended: boolean;
  status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED'; // Champ de statut
  type: string; // Type d'établissement
  createdAt: string; // Date de création
  _count: {
      users: number;
  };
}

// ... (autres fonctions)

// --- NOUVELLE FONCTION POUR GÉRER LES INSCRIPTIONS ---
export const updateEstablishmentStatus = (establishmentId: string, status: 'ACTIVE' | 'REJECTED', token: string) => {
  return apiClient.put(`/moderator/establishments/${establishmentId}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
  });
};


export interface AdminInDetails {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    identifiant: string;
}

export interface ClassInDetails {
    id: string;
    name: string;
    _count: {
        students: number;
    };
}

// Le type principal pour la page de détails
export interface EstablishmentDetails {
  id: string;
  name: string;
  type: string;
  address: string;
  status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
  createdAt: string;
  // On s'attend à recevoir un tableau d'utilisateurs
  users: AdminInDetails[];
  classes: ClassInDetails[];
}


// La fonction existante est déjà correcte
export const getEstablishmentDetails = (establishmentId: string, token: string) => {
  return apiClient.get<EstablishmentDetails>(`/moderator/establishments/${establishmentId}`, {
      headers: { Authorization: `Bearer ${token}` }
  });
};




// services/api.ts

// ... (toutes vos fonctions et imports existants)

// =======================================================
//   NOUVELLE SECTION : GESTION DES PARENTS (POUR L'ADMIN)
// =======================================================

// Type pour la création d'un parent
export interface NewParentData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

// Fonction pour créer un compte parent
export const createParent = (parentData: NewParentData, token: string) => {
  return apiClient.post('/establishment/parents', parentData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Fonction pour lier un élève à un parent
export const assignStudentToParent = (parentId: string, studentId: string, token: string) => {
  return apiClient.post(`/establishment/parents/${parentId}/assign-student`, { studentId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};


// =======================================================
//   NOUVELLE SECTION : ESPACE PARENT (POUR LE PARENT CONNECTÉ)
// =======================================================

// --- TYPES POUR LE DASHBOARD PARENT ---

// Résumé d'un enfant pour le tableau de bord
export interface ChildSummary {
  id: string;
  firstName: string;
  lastName: string;
  enrolledClass: { name: string } | null;
}

// Détails d'un professeur
export interface TeacherDetails {
    firstName: string;
    lastName: string;
}

// Détails d'une note
export interface ChildGrade {
    evaluation: { title: string; subject: string; date: string; };
    score: number | null;
}

// Détails d'une absence
export interface ChildAttendance {
    date: string;
    session: { subject: string; };
}

// Emploi du temps complet
export interface ChildSchedule {
    sessions: {
        id: string; // <-- LA CORRECTION EST ICI, AJOUTEZ CETTE LIGNE
        dayOfWeek: string;
        startTime: string;
        endTime: string;
        subject: string;
        teacher: TeacherDetails;
    }[];
}

// La réponse complète de l'API pour les détails d'un enfant
export interface ChildDetailsResponse {
    studentInfo: {
        id: string;
        firstName: string;
        lastName: string;
        className: string | null;
        teachers: TeacherDetails[];
    };
    grades: ChildGrade[];
    attendance: ChildAttendance[];
    schedule: ChildSchedule | null;
}


// --- FONCTIONS API POUR L'ESPACE PARENT ---

// Récupère la liste des enfants du parent connecté
export const getMyChildren = (token: string) => {
    return apiClient.get<ChildSummary[]>('/users/my-children', {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Récupère les détails complets d'un enfant spécifique
export const getChildDetails = (studentId: string, token: string) => {
    return apiClient.get<ChildDetailsResponse>(`/users/my-children/${studentId}/details`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};


// --- NOUVEAU TYPE POUR LA RECHERCHE DE PARENTS ---
export interface ParentSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  identifiant: string;
}

// --- METTRE À JOUR LE TYPE UserDetails ---
export interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  identifiant: string;
  email: string | null;
  role: 'STUDENT' | 'TEACHER' | 'PARENT'; // Ajouter PARENT
  enrolledClass: { name: string, id: string; } | null;
  parent: { // Ajouter le champ parent optionnel
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

// --- NOUVELLE FONCTION POUR RECHERCHER DES PARENTS ---
export const searchParents = (query: string, token: string) => {
  return apiClient.get<ParentSearchResult[]>(`/establishment/parents/search?q=${query}`, {
      headers: { Authorization: `Bearer ${token}` }
  });
};



// =======================================================
//   NOUVELLE SECTION : GESTION DE LA BIBLIOTHÈQUE (MODÉRATEUR)
// =======================================================

export type ResourceType = 'VIDEO' | 'PDF' | 'LINK' | 'BOOK';

export interface ExternalResource {
  isPremium: any;
  id: string;
  title: string;
  description?: string;
  type: ResourceType;
  url: string;
  thumbnailUrl?: string;
  source: string;
  subject: string;
  addedBy?: { // Optionnel car non présent sur la route publique
      firstName: string;
      lastName: string;
  };
  createdAt: string;
}

export interface NewExternalResourceData {
  title: string;
  description?: string;
  type: ResourceType;
  url: string;
  thumbnailUrl?: string;
  source: string;
  subject: string;
}

// Lister toutes les ressources pour l'admin
export const listAllAdminResources = (token: string) => {
    return apiClient.get<ExternalResource[]>('/library/admin/resources', {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Créer une nouvelle ressource
export const createExternalResource = (data: NewExternalResourceData, token: string) => {
    return apiClient.post<ExternalResource>('/library/admin/resources', data, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Mettre à jour une ressource
export const updateExternalResource = (resourceId: string, data: NewExternalResourceData, token: string) => {
    return apiClient.put<ExternalResource>(`/library/admin/resources/${resourceId}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Supprimer une ressource
export const deleteExternalResource = (resourceId: string, token: string) => {
    return apiClient.delete(`/library/admin/resources/${resourceId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};




// pour le systeme de recommandation

// --- NOUVEAUX TYPES POUR LE PROFIL D'APPRENTISSAGE ---
export interface SubjectAverage {
  subject: string;
  average: number;
}

export interface LearningProfile {
  summary: string;
  strengths: SubjectAverage[];
  weaknesses: SubjectAverage[];
  fullProfile: SubjectAverage[];
}

// --- NOUVELLE FONCTION ---
export const getMyLearningProfile = (token: string) => {
    return apiClient.get<LearningProfile>('/users/my-learning-profile', {
        headers: { Authorization: `Bearer ${token}` }
    });
};


export interface RecommendedResource { id: string; title: string; type: 'VIDEO' | 'PDF'; url: string; source: string; }
export interface RecommendationResponse { aiMessage: string; recommendedResources: RecommendedResource[]; }
export const getMyRecommendations = (token: string) => {
    return apiClient.post<RecommendationResponse>('/ai/recommendations/for-student', {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
};


export const trackResourceClick = (resourceId: string, token: string) => {
  return apiClient.post(`/library/resources/${resourceId}/track-click`, {}, {
      headers: { Authorization: `Bearer ${token}` }
  });
};




// --- NOUVEAUX TYPES POUR L'ASSISTANT DU PROFESSEUR ---
export interface DifficultSubject {
  subject: string;
  average: number;
}

export interface StrugglingStudent {
  id: string;
  name: string;
  average: number;
}

export interface PedagogicalInsightsResponse {
  aiSummary: string[];
  difficultSubjects: DifficultSubject[];
  strugglingStudents: StrugglingStudent[];
}

// --- NOUVELLE FONCTION ---
export const getPedagogicalInsights = (classId: string, token: string) => {
    return apiClient.get<PedagogicalInsightsResponse>(`/users/my-classes/${classId}/pedagogical-insights`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};



// --- NOUVELLE FONCTION POUR LES PROFESSEURS ---
export const getStudentDetailsForTeacher = (studentId: string, token: string) => {
  return apiClient.get<UserDetails>(`/users/my-students/${studentId}/details`, {
      headers: { Authorization: `Bearer ${token}` }
  });
};




// --- NOUVELLE FONCTION POUR LA PAGE DE DÉTAILS ---
export const getExternalResourceById = (resourceId: string, token: string) => {
  return apiClient.get<ExternalResource>(`/library/resources/${resourceId}`, {
      headers: { Authorization: `Bearer ${token}` }
  });
};

// La fonction listAllAdminResources est pour le modérateur,
// nous avons besoin d'une fonction pour l'élève/prof
export const listPublicResources = (token: string) => {
  return apiClient.get<ExternalResource[]>('/library/resources', {
      headers: { Authorization: `Bearer ${token}` }
  });
};


export default apiClient;