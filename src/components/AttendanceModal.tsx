"use client";

import React, { useState } from 'react';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';

interface Session { id: string; subject: string; }
interface Student { id: string; firstName: string; lastName: string; }

interface AttendanceModalProps {
  session: Session;
  students: Student[];
  date: string; // Date au format "YYYY-MM-DD"
  onClose: () => void;
  onSuccess: () => void;
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({ session, students, date, onClose, onSuccess }) => {
  const [attendance, setAttendance] = useState<Record<string, string>>(() => {
    const initialState: Record<string, string> = {};
    students.forEach(s => initialState[s.id] = 'PRESENT');
    return initialState;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    const token = Cookies.get('token');
    const attendanceData = Object.entries(attendance).map(([studentId, status]) => ({ studentId, status }));

    try {
      const response = await fetch(`http://localhost:3001/api/courses/sessions/${session.id}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ attendances: attendanceData, date: date }), // On envoie la date
      });

      if (!response.ok) throw new Error("La sauvegarde a échoué.");
      alert('Présences enregistrées !');
      onSuccess();
      onClose();
    } catch (err) {
      setError('Erreur lors de l\'enregistrement. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-surface p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">Prise de Présence</h2>
        <p className="text-text-secondary mb-4">
          Cours de <span className="font-semibold">{session.subject}</span> du 
          <span className="font-semibold"> {dayjs(date).format('dddd D MMMM YYYY')}</span>
        </p>
        
        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
          {students.map(student => (
            <div key={student.id} className="flex justify-between items-center p-2 bg-background rounded-md">
              <p>{student.firstName} {student.lastName}</p>
              <div className="flex space-x-2">
                <button onClick={() => handleStatusChange(student.id, 'PRESENT')} className={`px-3 py-1 text-sm rounded-full ${attendance[student.id] === 'PRESENT' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>Présent</button>
                <button onClick={() => handleStatusChange(student.id, 'ABSENT')} className={`px-3 py-1 text-sm rounded-full ${attendance[student.id] === 'ABSENT' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>Absent</button>
              </div>
            </div>
          ))}
        </div>
        
        {error && <p className="text-red-500 text-center text-sm mt-4">{error}</p>}
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={onClose} className="btn-secondary">Annuler</button>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary">{loading ? 'Sauvegarde...' : 'Sauvegarder'}</button>
        </div>
      </div>
       <style jsx>{`
        .btn-primary { background-color: #2563eb; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; }
        .btn-primary:disabled { opacity: 0.5; }
        .btn-secondary { background-color: #e5e7eb; color: #1f2937; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; }
        .dark .btn-secondary { background-color: #4b5563; color: #e5e7eb; }
      `}</style>
    </div>
  );
};
export default AttendanceModal;