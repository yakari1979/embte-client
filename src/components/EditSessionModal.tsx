"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { updateCourseSession, deleteCourseSession } from '@/services/api';
import { CourseSessionData } from '@/types/api-types';

// Types pour les props
interface Teacher { id: string; firstName: string; lastName: string; }
interface Session { id: string; subject: string; dayOfWeek: string; startTime: string; endTime: string; teacher: Teacher; }

interface EditSessionModalProps {
    session: Session;
    teachers: Teacher[];
    onClose: () => void;
    onSuccess: () => void;
}

const daysOrder = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const EditSessionModal: React.FC<EditSessionModalProps> = ({ session, teachers, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<CourseSessionData>({
        subject: session.subject,
        dayOfWeek: session.dayOfWeek,
        startTime: session.startTime,
        endTime: session.endTime,
        teacherId: session.teacher.id,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const token = Cookies.get('token');
        if (!token) return;

        try {
            await updateCourseSession(session.id, formData, token);
            onSuccess();
            onClose();
        } catch (err) {
            setError("Erreur lors de la mise à jour.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette session ? Cette action est irréversible.")) {
            return;
        }
        setLoading(true);
        setError(null);
        const token = Cookies.get('token');
        if (!token) return;
        
        try {
            await deleteCourseSession(session.id, token);
            onSuccess();
            onClose();
        } catch (err) {
            setError("Erreur lors de la suppression.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">&times;</button>
                <h2 className="text-xl font-bold mb-4">Modifier la Session de Cours</h2>

                <form onSubmit={handleUpdate}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Matière" required className="input-style" />
                        <select name="dayOfWeek" value={formData.dayOfWeek} onChange={handleChange} className="input-style">
                            {daysOrder.map(day => <option key={day} value={day}>{day.charAt(0) + day.slice(1).toLowerCase()}</option>)}
                        </select>
                        <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required className="input-style" />
                        <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required className="input-style" />
                        <select name="teacherId" value={formData.teacherId} onChange={handleChange} required className="input-style md:col-span-2">
                            {teachers.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
                        </select>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                    
                    <div className="flex justify-between items-center mt-6">
                        <button type="button" onClick={handleDelete} disabled={loading} className="btn-danger">
                            Supprimer
                        </button>
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? "Sauvegarde..." : "Sauvegarder les changements"}
                        </button>
                    </div>
                </form>
                 <style jsx>{`.input-style { width: 100%; padding: 0.5rem 1rem; background-color: var(--background); border: 1px solid #ccc; border-radius: 0.375rem; }`}</style>
            </div>
        </div>
    );
};

export default EditSessionModal;