import React, { useState } from 'react';
import { useDoctorat } from '../context/DoctoratContext';
import { Role, PortalMode } from '../types';
import { 
  GraduationCap, 
  ShoppingBag, 
  BookOpen, 
  Users, 
  FileCheck, 
  RotateCcw,
  User,
  ChevronDown,
  Sparkles,
  RefreshCw,
  Building2,
  FileText,
  CalendarClock,
  History,
  ShieldCheck,
  Workflow,
  LogIn,
  LogOut,
  Key,
  CheckCircle2
} from 'lucide-react';
import { GoogleIcon } from './auth/AcademicLoginModal';

export const Navbar: React.FC = () => {
  const { 
    role, 
    setRole, 
    portalMode, 
    setPortalMode, 
    cart, 
    subjects,
    applications,
    reinscriptions,
    setIsDiagramModalOpen,
    resetDataToDefault,
    accounts,
    currentAccount,
    logoutAccount,
    loginAsActor,
    setIsAcademicAuthModalOpen
  } = useDoctorat();

  const [switchToast, setSwitchToast] = useState<string | null>(null);

  // Live task counters for each actor
  const pendingLabSubjects = subjects.filter(s => s.status === 'propose').length;
  const pendingLabReinscriptions = reinscriptions.filter(r => r.status === 'avis_directeur_rendu' || (r.avisDirecteur && !r.validationLabo)).length;
  const totalLabPending = pendingLabSubjects + pendingLabReinscriptions;

  const pendingCedSubjects = subjects.filter(s => s.status === 'valide_labo').length;
  const pendingCedReinscriptions = reinscriptions.filter(r => r.status === 'valide_laboratoire' || (r.validationLabo && !r.confirmationCed)).length;
  const pendingCedAdmissions = applications.filter(a => ['preselectionne', 'admis'].includes(a.status) && !a.homologationCed?.homologue).length;
  const totalCedPending = pendingCedSubjects + pendingCedReinscriptions + pendingCedAdmissions;

  const pendingAdminInscriptions = applications.filter(a => a.status === 'dossier_soumis').length;
  const pendingAdminReinscriptions = reinscriptions.filter(r => r.status === 'confirme_ced' || (r.confirmationCed && r.status !== 'reinscription_validee')).length;
  const totalAdminPending = pendingAdminInscriptions + pendingAdminReinscriptions;

  const pendingProfOral = applications.filter(a => a.status === 'preselectionne').length;
  const pendingProfAvis = reinscriptions.filter(r => r.status === 'rapport_soumis' || !r.avisDirecteur).length;
  const totalProfPending = pendingProfOral + pendingProfAvis;

  const ACTORS: { 
    id: Role; 
    label: string; 
    icon: string; 
    pendingCount?: number;
    nomCompte: string;
    emailCompte: string;
    fonctionCourte: string;
  }[] = [
    { 
      id: 'candidat', 
      label: 'Candidat / Doctorant', 
      icon: '🎓', 
      pendingCount: cart.length > 0 ? cart.length : undefined,
      nomCompte: 'Salma El Amrani',
      emailCompte: 'salma.elamrani@usmba.ac.ma',
      fonctionCourte: 'Candidate Master'
    },
    { 
      id: 'professeur', 
      label: 'Professeur / Commission', 
      icon: '👨‍🏫', 
      pendingCount: totalProfPending > 0 ? totalProfPending : undefined,
      nomCompte: 'Prof. Karim Bennani',
      emailCompte: 'k.bennani@usmba.ac.ma',
      fonctionCourte: 'Président Jury & Encadrant'
    },
    { 
      id: 'directeur_labo', 
      label: 'Directeur Laboratoire', 
      icon: '🔬', 
      pendingCount: totalLabPending > 0 ? totalLabPending : undefined,
      nomCompte: 'Dr. Hassan Idrissi',
      emailCompte: 'h.idrissi@usmba.ac.ma',
      fonctionCourte: 'Directeur Labo LEMA'
    },
    { 
      id: 'directeur_ced', 
      label: 'Directeur CEDoc', 
      icon: '🏛️', 
      pendingCount: totalCedPending > 0 ? totalCedPending : undefined,
      nomCompte: 'Prof. Amina Chraibi',
      emailCompte: 'a.chraibi@usmba.ac.ma',
      fonctionCourte: 'Directrice Pôle Doctoral'
    },
    { 
      id: 'administration', 
      label: 'Scolarité & Admin', 
      icon: '📋', 
      pendingCount: totalAdminPending > 0 ? totalAdminPending : undefined,
      nomCompte: 'Fatima Benjelloun',
      emailCompte: 'scolarite.cedoc@usmba.ac.ma',
      fonctionCourte: 'Responsable Inscriptions'
    },
    { 
      id: 'plateforme_gcd', 
      label: 'Plateforme GCD', 
      icon: '⚙️',
      nomCompte: 'Nabil Mansouri',
      emailCompte: 'superviseur.gcd@usmba.ac.ma',
      fonctionCourte: 'Superviseur DSI'
    }
  ];

  const roleLabels: Record<Role, { name: string; desc: string }> = {
    candidat: { name: 'Espace Candidat', desc: 'Recherche, Panier max 3, Dépôt & Réinscription' },
    professeur: { name: 'Enseignant / Commission', desc: 'Sujets, Présélection, PV d\'audition & Avis' },
    directeur_labo: { name: 'Direction Laboratoire', desc: 'Validation scientifique & Visa structure' },
    directeur_ced: { name: 'Direction CEDoc', desc: 'Homologation catalogue & Quotas institutionnels' },
    administration: { name: 'Scolarité Doctorat', desc: 'Contrôle originaux, Matricules & Attestations' },
    plateforme_gcd: { name: 'Système GCD', desc: 'Supervision & 4 piliers automatisés' }
  };

  const handleSelectActor = (selectedRole: Role) => {
    loginAsActor(selectedRole);
    setPortalMode('inscription');
    const acc = accounts.find(a => a.role === selectedRole);
    if (acc) {
      setSwitchToast(`Compte actif : ${acc.prenom} ${acc.nom} (${acc.email}) · ${acc.titre.split('·')[0]}`);
      setTimeout(() => setSwitchToast(null), 3500);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main top bar */}
        <div className="flex items-center justify-between h-14 gap-3 border-b border-slate-100">
          
          {/* Logo & Platform Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-xs tracking-wider shadow-xs">
              GCD
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm tracking-tight">
                  Plateforme Doctorat
                </span>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60 hidden sm:inline-block">
                  CEDoc USMBA
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden md:block leading-none mt-0.5">
                Université Sidi Mohamed Ben Abdellah (Fès) · Gestion Doctorat
              </p>
            </div>
          </div>

          {/* Right Global Tools & Academic Account Profile */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setPortalMode('diagramme')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                portalMode === 'diagramme'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Workflow className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Diagramme UML & Débats</span>
              <span className="sm:hidden">UML</span>
            </button>

            <button
              onClick={() => setPortalMode('progression')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                portalMode === 'progression'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CalendarClock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Suivi & Délais</span>
              <span className="sm:hidden">Délais</span>
            </button>

            <button
              onClick={() => setPortalMode('journalisation')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                portalMode === 'journalisation' || portalMode === 'audit'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Journal d'Audit</span>
              <span className="sm:hidden">Audit</span>
            </button>

            <button
              onClick={() => setPortalMode('roles')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                portalMode === 'roles'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Rôles & Droits</span>
              <span className="md:hidden">Droits</span>
            </button>

            <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

            {/* Conception modal trigger */}
            <button
              onClick={() => setIsDiagramModalOpen(true)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              title="Consulter le dossier de conception & diagrammes de flux"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            </button>

            {/* Reset data */}
            <button
              onClick={resetDataToDefault}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              title="Réinitialiser les données de démonstration"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Academic Account Profile Card / Fast Auth Button */}
            <div className="h-4 w-px bg-slate-200 mx-1" />

            {currentAccount ? (
              <div className="flex items-center gap-1.5 pl-1">
                <button
                  onClick={() => setIsAcademicAuthModalOpen(true)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg hover:bg-slate-100 transition-colors text-left border border-slate-200/80 bg-slate-50/60"
                  title="Gérer les comptes académiques / Google Workspace"
                >
                  <div className="relative">
                    <div className={`w-6 h-6 rounded ${currentAccount.avatarBg} text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-2xs`}>
                      {currentAccount.initiales}
                    </div>
                    {currentAccount.fournisseurAuth === 'google' && (
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center shadow-xs border border-slate-200">
                        <GoogleIcon className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                  <div className="hidden lg:block leading-tight text-left">
                    <div className="flex items-center gap-1">
                      <span className="block text-[11px] font-bold text-slate-800 truncate max-w-[120px]">
                        {currentAccount.prenom} {currentAccount.nom}
                      </span>
                    </div>
                    <span className="block text-[9px] text-slate-400 font-mono truncate max-w-[120px]">
                      {currentAccount.email}
                    </span>
                  </div>
                  <Key className="w-3 h-3 text-slate-400 ml-0.5" />
                </button>

                <button
                  onClick={() => {
                    logoutAccount();
                    setSwitchToast('Déconnexion effectuée.');
                    setTimeout(() => setSwitchToast(null), 2500);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  title="Fermer la session académique"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAcademicAuthModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-2xs transition-colors"
              >
                <GoogleIcon className="w-3.5 h-3.5" />
                <span>Connexion Google / Acteur</span>
              </button>
            )}

          </div>

        </div>

        {/* Switch Toast notification if active */}
        {switchToast && (
          <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-1.5 text-xs text-indigo-900 flex items-center justify-between animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>{switchToast}</span>
            </div>
            <button
              onClick={() => setIsAcademicAuthModalOpen(true)}
              className="text-[11px] font-semibold text-indigo-700 hover:underline"
            >
              Gérer les comptes →
            </button>
          </div>
        )}

        {/* 6 Actors Interactive Strip - High Visibility */}
        <div className="py-2 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 hidden lg:inline">
              Espaces Acteurs :
            </span>

            {ACTORS.map(actor => {
              const isSelected = portalMode === 'inscription' && role === actor.id;

              return (
                <button
                  key={actor.id}
                  onClick={() => handleSelectActor(actor.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border text-left ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-1 ring-slate-800'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 hover:border-slate-300'
                  }`}
                  title={`Compte institutionnel : ${actor.nomCompte} (${actor.emailCompte})`}
                >
                  <span className="text-base shrink-0">{actor.icon}</span>
                  <div className="flex flex-col leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs">{actor.label}</span>
                      {actor.pendingCount !== undefined && (
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold leading-tight ${
                          isSelected
                            ? 'bg-emerald-500 text-white'
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}>
                          {actor.pendingCount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`text-[10px] font-medium truncate max-w-[130px] ${
                        isSelected ? 'text-emerald-300' : 'text-indigo-900 font-semibold'
                      }`}>
                        {actor.nomCompte}
                      </span>
                      <span className={`text-[9px] font-mono truncate max-w-[110px] hidden xl:inline ${
                        isSelected ? 'text-slate-400' : 'text-slate-400'
                      }`}>
                        · {actor.emailCompte.split('@')[0]}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick access to Réinscription for doctorants */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setPortalMode('reinscription')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 whitespace-nowrap border ${
                portalMode === 'reinscription'
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                  : 'bg-emerald-50 hover:bg-emerald-100/70 text-emerald-900 border-emerald-200/70'
              }`}
            >
              <RefreshCw className="w-3 h-3 text-emerald-700" />
              <span>Réinscription Annuelle</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
