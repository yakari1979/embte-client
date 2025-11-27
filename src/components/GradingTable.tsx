// "use client";

// import React, { useState } from 'react';
// import { Student, Evaluation, Grade, GradingData } from '@/services/api';
// import AddEvaluationModal from './AddEvaluationModal';
// import EditGradeModal from './EditGradeModal';

// interface GradingTableProps {
//   data: GradingData;
//   classId: string;
//   onDataChange: () => void;
// }

// interface GradeCellProps {
//     grade: Grade | undefined;
//     onClick: () => void;
// }

// const GradeCell: React.FC<GradeCellProps> = ({ grade, onClick }) => {
//     const appreciationColors: { [key: string]: string } = { EXCELLENT: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300', TRES_BIEN: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300', BIEN: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900 dark:text-cyan-300', PASSABLE: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300', INSUFFISANT: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300', ACQUERIR: 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300', NON_NOTE: 'text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400' };
//     const colorClass = grade ? appreciationColors[grade.appreciation] || 'text-gray-500' : 'text-gray-500';
    
//     return (
//         <div onClick={onClick} className="text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors min-h-[60px] flex flex-col justify-center">
//             {grade && grade.score !== null ? (
//                 <>
//                     <p className="font-bold text-lg">{grade.score.toFixed(2)}</p>
//                     <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colorClass}`}>{grade.appreciation.replace('_', ' ')}</span>
//                 </>
//             ) : <span className="text-gray-400 italic">--</span>}
//         </div>
//     );
// };

// const GradingTable: React.FC<GradingTableProps> = ({ data, classId, onDataChange }) => {
//   const { students, evaluations, grades, teacherSubjects } = data;

//   const [isAddTdModalOpen, setIsAddTdModalOpen] = useState(false);
//   const [isAddDevoirModalOpen, setIsAddDevoirModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedGradeInfo, setSelectedGradeInfo] = useState<{ student: Student; evaluation: Evaluation; grade: Grade | undefined } | null>(null);

//   const handleOpenEditModal = (student: Student, evaluation: Evaluation) => {
//     const grade = grades.find(g => g.studentId === student.id && g.evaluationId === evaluation.id);
//     setSelectedGradeInfo({ student, evaluation, grade });
//     setIsEditModalOpen(true);
//   };
  
//   const tdEvaluations = evaluations.filter(ev => ev.type === 'TD');
//   const devoirEvaluations = evaluations.filter(ev => ev.type === 'DEVOIR');
//   const [evalType, setEvalType] = useState('AUTRE'); // Par défaut

//   return (
//     <div className="space-y-12">
//       {/* --- Section Travaux Dirigés (TD) --- */}
//       <div>
//         <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-semibold">Travaux Dirigés (TD)</h2>
//             <button onClick={() => setIsAddTdModalOpen(true)} className="btn-primary">+ Ajouter un TD</button>
//         </div>
//         <div className="overflow-x-auto bg-surface rounded-lg shadow">
//           <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//             <thead className="bg-gray-50 dark:bg-gray-800">
//               <tr>
//                 {/* <-- MODIFIÉ : Ajout de padding et alignement */}
//                 <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Élève</th>
//                 {tdEvaluations.map(ev => (
//                   <th key={ev.id} className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">{ev.title} ({ev.subject})</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="bg-surface divide-y divide-gray-200 dark:divide-gray-700">
//               {students.length > 0 ? students.map(student => (
//                 <tr key={student.id}>
//                   {/* <-- MODIFIÉ : Ajout de padding et alignement */}
//                   <td className="px-6 py-4 whitespace-nowrap text-left font-medium"> {student.firstName.toUpperCase()} {student.lastName.toUpperCase()}</td>
//                   {tdEvaluations.map(ev => (
//                     <td key={ev.id} className="p-1"> {/* On garde un padding minimal pour la cellule de note qui a déjà son propre padding interne */}
//                          <GradeCell 
//                             grade={grades.find(g => g.studentId === student.id && g.evaluationId === ev.id)}
//                             onClick={() => handleOpenEditModal(student, ev)}
//                          />
//                     </td>
//                   ))}
//                 </tr>
//               )) : (
//                 <tr>
//                     <td colSpan={tdEvaluations.length + 1} className="text-center py-10 text-text-secondary italic">Aucun élève dans cette classe.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- Section Devoirs Surveillés (Implémentation complète) --- */}
//       <div>
//         <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-semibold">Devoirs Surveillés</h2>
//             <button onClick={() => setIsAddDevoirModalOpen(true)} className="btn-primary">+ Ajouter un Devoir</button>
//         </div>
//         <div className="overflow-x-auto bg-surface rounded-lg shadow">
//             <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//             <thead className="bg-gray-50 dark:bg-gray-800">
//               <tr>
//                 {/* <-- MODIFIÉ : Ajout de padding et alignement */}
//                 <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Élève</th>
//                 {devoirEvaluations.map(ev => (
//                   <th key={ev.id} className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">{ev.title} ({ev.subject})</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="bg-surface divide-y divide-gray-200 dark:divide-gray-700">
//               {students.length > 0 ? students.map(student => (
//                 <tr key={student.id}>
//                   {/* <-- MODIFIÉ : Ajout de padding et alignement */}
//                   <td className="px-6 py-4 whitespace-nowrap text-left font-medium">{student.firstName.toUpperCase()} {student.lastName.toUpperCase()} </td>
//                   {devoirEvaluations.map(ev => (
//                     <td key={ev.id} className="p-1">
//                          <GradeCell 
//                             grade={grades.find(g => g.studentId === student.id && g.evaluationId === ev.id)}
//                             onClick={() => handleOpenEditModal(student, ev)}
//                          />
//                     </td>
//                   ))}
//                 </tr>
//               )) : (
//                 <tr>
//                     <td colSpan={devoirEvaluations.length + 1} className="text-center py-10 text-text-secondary italic">Aucun élève dans cette classe.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="mb-4">
//           <label className="block text-sm font-bold mb-2">Type pour le Bulletin</label>
//           <div className="flex gap-4">
//               <label className="flex items-center gap-2 cursor-pointer">
//                   <input 
//                       type="radio" name="evalType" value="DEVOIR_1"
//                       checked={evalType === 'DEVOIR_1'}
//                       onChange={(e) => setEvalType(e.target.value)}
//                   />
//                   Devoir 1
//               </label>
//               <label className="flex items-center gap-2 cursor-pointer">
//                   <input 
//                       type="radio" name="evalType" value="DEVOIR_2"
//                       checked={evalType === 'DEVOIR_2'}
//                       onChange={(e) => setEvalType(e.target.value)}
//                   />
//                   Devoir 2
//               </label>
//               <label className="flex items-center gap-2 cursor-pointer">
//                   <input 
//                       type="radio" name="evalType" value="COMPOSITION"
//                       checked={evalType === 'COMPOSITION'}
//                       onChange={(e) => setEvalType(e.target.value)}
//                   />
//                   Composition
//               </label>
//               <label className="flex items-center gap-2 cursor-pointer">
//                   <input 
//                       type="radio" name="evalType" value="AUTRE"
//                       checked={evalType === 'AUTRE'}
//                       onChange={(e) => setEvalType(e.target.value)}
//                   />
//                   Autre (TD, Bonus...)
//               </label>
//           </div>
//           <p className="text-xs text-gray-500 mt-1">Seuls les Devoirs 1, 2 et la Compo sont calculés dans le bulletin.</p>
//       </div>

//       {/* --- 4. Rendre les 3 modals --- */}
//       <AddEvaluationModal
//         isOpen={isAddTdModalOpen}
//         onClose={() => setIsAddTdModalOpen(false)}
//         onEvaluationCreated={onDataChange}
//         classId={classId}
//         subjects={teacherSubjects}
//         evaluationType="TD"
//       />
//       <AddEvaluationModal
//         isOpen={isAddDevoirModalOpen}
//         onClose={() => setIsAddDevoirModalOpen(false)}
//         onEvaluationCreated={onDataChange}
//         classId={classId}
//         subjects={teacherSubjects}
//         evaluationType="DEVOIR"
//       />
//       <EditGradeModal
//         isOpen={isEditModalOpen}
//         onClose={() => setIsEditModalOpen(false)}
//         onGradeSaved={onDataChange}
//         student={selectedGradeInfo?.student || null}
//         evaluation={selectedGradeInfo?.evaluation || null}
//         currentGrade={selectedGradeInfo?.grade || null}
//       />
//     </div>
//   );
// };

// export default GradingTable;



"use client";

import React, { useState } from 'react';
import { Student, Evaluation, Grade, GradingData } from '@/services/api';
import AddEvaluationModal from './AddEvaluationModal';
import EditGradeModal from './EditGradeModal';

interface GradingTableProps {
  data: GradingData;
  classId: string;
  onDataChange: () => void;
}

interface GradeCellProps {
    grade: Grade | undefined;
    onClick: () => void;
}

const GradeCell: React.FC<GradeCellProps> = ({ grade, onClick }) => {
    const appreciationColors: { [key: string]: string } = { EXCELLENT: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300', TRES_BIEN: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300', BIEN: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900 dark:text-cyan-300', PASSABLE: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300', INSUFFISANT: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300', ACQUERIR: 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300', NON_NOTE: 'text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400' };
    const colorClass = grade ? appreciationColors[grade.appreciation] || 'text-gray-500' : 'text-gray-500';
    
    return (
        <div onClick={onClick} className="text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors min-h-[60px] flex flex-col justify-center">
            {grade && grade.score !== null ? (
                <>
                    <p className="font-bold text-lg">{grade.score.toFixed(2)}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colorClass}`}>{grade.appreciation.replace('_', ' ')}</span>
                </>
            ) : <span className="text-gray-400 italic">--</span>}
        </div>
    );
};

const GradingTable: React.FC<GradingTableProps> = ({ data, classId, onDataChange }) => {
  const { students, evaluations, grades, teacherSubjects } = data;

  const [isAddTdModalOpen, setIsAddTdModalOpen] = useState(false);
  const [isAddDevoirModalOpen, setIsAddDevoirModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGradeInfo, setSelectedGradeInfo] = useState<{ student: Student; evaluation: Evaluation; grade: Grade | undefined } | null>(null);

  const handleOpenEditModal = (student: Student, evaluation: Evaluation) => {
    const grade = grades.find(g => g.studentId === student.id && g.evaluationId === evaluation.id);
    setSelectedGradeInfo({ student, evaluation, grade });
    setIsEditModalOpen(true);
  };
  
  // --- CORRECTION DU FILTRAGE ---
  // On inclut 'TD' dans la liste TD
  const tdEvaluations = evaluations.filter(ev => ev.type === 'TD');
  
  // On inclut DEVOIR_1, DEVOIR_2, COMPOSITION et AUTRE dans la liste des Devoirs
  const devoirEvaluations = evaluations.filter(ev => 
      ['DEVOIR_1', 'DEVOIR_2', 'COMPOSITION', 'AUTRE', 'DEVOIR'].includes(ev.type)
  );

  // Fonction utilitaire pour afficher un joli badge pour le type
  const getTypeBadge = (type: string) => {
      switch(type) {
          case 'DEVOIR_1': return <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">D1</span>;
          case 'DEVOIR_2': return <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">D2</span>;
          case 'COMPOSITION': return <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">COMPO</span>;
          default: return <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Autre</span>;
      }
  };

  return (
    <div className="space-y-12">
      
      {/* --- SECTION 1 : TRAVAUX DIRIGÉS (TD) --- */}
      <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Travaux Dirigés (TD)</h2>
            <button onClick={() => setIsAddTdModalOpen(true)} className="btn-primary">+ Ajouter un TD</button>
        </div>
        <div className="overflow-x-auto bg-surface rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-800 z-10">Élève</th>
                {tdEvaluations.map(ev => (
                  <th key={ev.id} className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">{ev.title} <br/><span className="text-[10px] opacity-70">({ev.subject})</span></th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-gray-200 dark:divide-gray-700">
              {students.length > 0 ? students.map(student => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-left font-medium sticky left-0 bg-surface z-10 border-r border-gray-100 dark:border-gray-700"> {student.firstName.toUpperCase()} {student.lastName.toUpperCase()}</td>
                  {tdEvaluations.map(ev => (
                    <td key={ev.id} className="p-1 min-w-[100px]">
                         <GradeCell 
                            grade={grades.find(g => g.studentId === student.id && g.evaluationId === ev.id)}
                            onClick={() => handleOpenEditModal(student, ev)}
                         />
                    </td>
                  ))}
                </tr>
              )) : (
                <tr>
                    <td colSpan={tdEvaluations.length + 1} className="text-center py-10 text-text-secondary italic">Aucun élève dans cette classe.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- SECTION 2 : DEVOIRS SURVEILLÉS & COMPOS --- */}
      <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Devoirs & Compositions</h2>
            <button onClick={() => setIsAddDevoirModalOpen(true)} className="btn-primary">+ Ajouter un Devoir</button>
        </div>
        <div className="overflow-x-auto bg-surface rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-800 z-10">Élève</th>
                {devoirEvaluations.map(ev => (
                  <th key={ev.id} className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                      {ev.title} <br/>
                      {getTypeBadge(ev.type)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-gray-200 dark:divide-gray-700">
              {students.length > 0 ? students.map(student => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-left font-medium sticky left-0 bg-surface z-10 border-r border-gray-100 dark:border-gray-700">{student.firstName.toUpperCase()} {student.lastName.toUpperCase()} </td>
                  {devoirEvaluations.map(ev => (
                    <td key={ev.id} className="p-1 min-w-[100px]">
                         <GradeCell 
                            grade={grades.find(g => g.studentId === student.id && g.evaluationId === ev.id)}
                            onClick={() => handleOpenEditModal(student, ev)}
                         />
                    </td>
                  ))}
                </tr>
              )) : (
                <tr>
                    <td colSpan={devoirEvaluations.length + 1} className="text-center py-10 text-text-secondary italic">Aucun élève dans cette classe.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS --- */}
      
      <AddEvaluationModal
        isOpen={isAddTdModalOpen}
        onClose={() => setIsAddTdModalOpen(false)}
        onEvaluationCreated={onDataChange}
        classId={classId}
        subjects={teacherSubjects}
        evaluationType="TD" 
        bulletinType="TD" // On force le type TD
      />

      <AddEvaluationModal
        isOpen={isAddDevoirModalOpen}
        onClose={() => setIsAddDevoirModalOpen(false)}
        onEvaluationCreated={onDataChange}
        classId={classId}
        subjects={teacherSubjects}
        evaluationType="DEVOIR" 
        allowBulletinChoice={true} // Le prof choisit D1, D2 ou Compo
      />

      <EditGradeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onGradeSaved={onDataChange}
        student={selectedGradeInfo?.student || null}
        evaluation={selectedGradeInfo?.evaluation || null}
        currentGrade={selectedGradeInfo?.grade || null}
      />
    </div>
  );
};

export default GradingTable;