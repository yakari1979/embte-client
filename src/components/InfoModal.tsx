"use client";

import React from 'react';
import Link from 'next/link';
import { X, BookOpen, FileText, Shield, Info as InfoIcon } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">À propos de PENI</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <ul className="space-y-3">
            <li>
              <Link href="/about" onClick={onClose} className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <InfoIcon className="h-5 w-5 text-blue-500" />
                <span className="font-semibold">À Propos de la Plateforme</span>
              </Link>
            </li>
            <li>
              <Link href="/documentation" onClick={onClose} className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <BookOpen className="h-5 w-5 text-green-500" />
                <span className="font-semibold">Documentation Utilisateur</span>
              </Link>
            </li>
            <li>
              <Link href="/terms" onClick={onClose} className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <FileText className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold">Conditions d'Utilisation</span>
              </Link>
            </li>
            <li>
              <Link href="/privacy" onClick={onClose} className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <Shield className="h-5 w-5 text-red-500" />
                <span className="font-semibold">Politique de Confidentialité</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 text-center text-xs text-text-subtle rounded-b-lg">
          Plateforme Edu (PENI) - Version 1.0
        </div>
      </div>
    </div>
  );
};

export default InfoModal;