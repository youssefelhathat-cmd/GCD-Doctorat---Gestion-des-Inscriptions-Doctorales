import React from 'react';
import { DoctoratProvider, useDoctorat } from './context/DoctoratContext';
import { Navbar } from './components/Navbar';
import { ConceptionDebateModal } from './components/conception/ConceptionDebateModal';
import { CandidateView } from './components/candidat/CandidateView';
import { ReinscriptionView } from './components/reinscription/ReinscriptionView';
import { GcdPlatformView } from './components/gcd/GcdPlatformView';
import { CommissionView } from './components/commission/CommissionView';
import { LabDirectorView } from './components/laboratoire/LabDirectorView';
import { CedDirectorView } from './components/ced/CedDirectorView';
import { AdminView } from './components/administration/AdminView';
import { CandidatureProgressionView } from './components/progression/CandidatureProgressionView';
import { AuditLogView } from './components/audit/AuditLogView';
import { ProcessDiagramView } from './components/diagramme/ProcessDiagramView';
import { RolePrivilegeManagerView } from './components/roles/RolePrivilegeManagerView';
import { AcademicLoginModal } from './components/auth/AcademicLoginModal';
import { School, Sparkles, BookOpen, Lock, ShieldCheck } from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    role, 
    portalMode, 
    setIsDiagramModalOpen,
    currentAccount,
    isAcademicAuthModalOpen,
    setIsAcademicAuthModalOpen,
    loginAsActor
  } = useDoctorat();

  const isRoleRestricted = role !== 'candidat' && !currentAccount;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isRoleRestricted ? (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-xs max-w-lg mx-auto my-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Espace Académique Réservé
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                L'accès aux opérations de cet espace nécessite une authentification avec un compte institutionnel habilité.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => setIsAcademicAuthModalOpen(true)}
                className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                Se connecter avec un compte académique
              </button>
              <button
                onClick={() => loginAsActor(role)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                Connexion rapide (Démo)
              </button>
            </div>
          </div>
        ) : portalMode === 'reinscription' ? (
          <ReinscriptionView />
        ) : portalMode === 'progression' ? (
          <CandidatureProgressionView />
        ) : portalMode === 'diagramme' ? (
          <ProcessDiagramView />
        ) : portalMode === 'journalisation' || portalMode === 'audit' ? (
          <AuditLogView />
        ) : portalMode === 'roles' ? (
          <RolePrivilegeManagerView />
        ) : (
          <>
            {role === 'candidat' && <CandidateView />}
            {role === 'plateforme_gcd' && <GcdPlatformView />}
            {role === 'professeur' && <CommissionView />}
            {role === 'directeur_labo' && <LabDirectorView />}
            {role === 'directeur_ced' && <CedDirectorView />}
            {role === 'administration' && <AdminView />}
          </>
        )}
      </main>

      {/* Academic Login & Account Manager Modal */}
      <AcademicLoginModal
        isOpen={isAcademicAuthModalOpen}
        onClose={() => setIsAcademicAuthModalOpen(false)}
      />

      {/* Conception & Debate Document Modal */}
      <ConceptionDebateModal />

      {/* Clean University Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-slate-400" />
            <span>Plateforme GCD · Centre d'Études Doctorales (CEDoc) · Année Universitaire 2026/2027</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <button
              onClick={() => setIsDiagramModalOpen(true)}
              className="hover:text-indigo-600 transition-colors inline-flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dossier de Conception & Schémas de Flux</span>
            </button>
            <span>·</span>
            <span>Support Technique : support-cedoc@usmba.ac.ma</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <DoctoratProvider>
      <MainContent />
    </DoctoratProvider>
  );
}
