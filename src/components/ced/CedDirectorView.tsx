import React, { useState } from 'react';
import { useDoctorat } from '../../context/DoctoratContext';
import { 
  School, 
  CheckCircle2, 
  Globe,
  Clock,
  Award,
  AlertCircle,
  FileCheck2,
  Users,
  ShieldCheck,
  Send,
  Building2,
  Filter,
  Check,
  ArrowRight
} from 'lucide-react';

export const CedDirectorView: React.FC = () => {
  const { 
    subjects, 
    confirmCedSubject, 
    applications,
    homologateCedApplication,
    submitAdminDossier,
    reinscriptions, 
    confirmCedReinscription,
    currentAccount
  } = useDoctorat();

  const [activeTab, setActiveTab] = useState<'admissions' | 'sujets' | 'reinscriptions'>('admissions');
  const [subFilter, setSubFilter] = useState<'tous' | 'a_homologuer' | 'preselectionnes' | 'admis' | 'homologues'>('tous');
  
  const [cedObservationsInput, setCedObservationsInput] = useState('Validation institutionnelle accordée par le CEDoc conformément aux quotas et règlements.');
  const [homologationCommentInput, setHomologationCommentInput] = useState('Procès-verbal de délibération homologué. Quotas et bourses de recherche approuvés par le Conseil du CEDoc. Transmission à la scolarité.');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Subject Homologation (amont)
  const pendingCedConfirmation = subjects.filter(s => s.status === 'valide_labo');
  const publishedGcdSubjects = subjects.filter(s => s.status === 'confirme_ced');

  // All Candidate applications under CEDoc jurisdiction (preselected, admitted, dossiers submitted, etc.)
  const candidateApps = applications.filter(a => 
    ['preselectionne', 'admis', 'dossier_soumis', 'dossier_non_conforme', 'inscription_validee', 'soumise', 'en_examen'].includes(a.status)
  );

  const preselectedApps = applications.filter(a => a.status === 'preselectionne');
  const admittedApps = applications.filter(a => 
    ['admis', 'dossier_soumis', 'dossier_non_conforme', 'inscription_validee'].includes(a.status)
  );
  const pendingHomologationApps = candidateApps.filter(a => !a.homologationCed?.homologue);
  const homologatedApps = candidateApps.filter(a => !!a.homologationCed?.homologue);

  // Filtered list based on subFilter
  const displayedApps = candidateApps.filter(app => {
    if (subFilter === 'a_homologuer') return !app.homologationCed?.homologue;
    if (subFilter === 'preselectionnes') return app.status === 'preselectionne';
    if (subFilter === 'admis') return ['admis', 'dossier_soumis', 'dossier_non_conforme', 'inscription_validee'].includes(app.status);
    if (subFilter === 'homologues') return !!app.homologationCed?.homologue;
    return true;
  });

  // Re-enrollment items waiting for CED confirmation (must have lab validation)
  const pendingCedReinscriptions = reinscriptions.filter(r => 
    r.status === 'valide_laboratoire' || (r.validationLabo && !r.confirmationCed)
  );
  const confirmedCedReinscriptions = reinscriptions.filter(r => r.confirmationCed);

  const handleConfirmReinscription = (id: string, isConfirme: boolean) => {
    confirmCedReinscription(id, isConfirme, cedObservationsInput);
    setActionNotice(isConfirme ? 'Confirmation académique du CEDoc enregistrée. Dossier transmis à la scolarité.' : 'Dossier mis en réserve par le CEDoc.');
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleHomologate = (appId: string, homologue: boolean) => {
    homologateCedApplication(appId, homologue, homologationCommentInput);
    setActionNotice(homologue ? 'Candidature homologuée avec succès par le Conseil du CEDoc. Admission validée sur Liste Principale.' : 'Réserves émises sur l\'homologation.');
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleHomologateAndTransmitToAdmin = (appId: string) => {
    homologateCedApplication(appId, true, homologationCommentInput);
    submitAdminDossier(appId);
    setActionNotice('Homologation CEDoc validée et dossier administratif transmis immédiatement à la Scolarité pour contrôle des originaux.');
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Clean University Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Acteur : Direction du Centre d'Études Doctorales (CEDoc USMBA)</span>
            <span>·</span>
            <span className="text-purple-800 font-semibold">Couloir UML 5 & Étape 5 Débat</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Espace Direction du CEDoc
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Homologation des admissions & quotas bourses, validation de l'offre doctorale (catalogue GCD), et confirmations de réinscription.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('admissions')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'admissions'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Homologation Admissions ({candidateApps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sujets')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'sujets'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Offres de Thèses ({pendingCedConfirmation.length} en attente)</span>
          </button>

          <button
            onClick={() => setActiveTab('reinscriptions')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'reinscriptions'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            <span>Visas Réinscription ({pendingCedReinscriptions.length})</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
          <span className="font-medium">{actionNotice}</span>
        </div>
      )}

      {/* TAB 1: HOMOLOGATION DES ADMISSIONS (POST-COMMISSION & ARBITRAGE DES QUOTAS) */}
      {activeTab === 'admissions' && (
        <div className="space-y-4">
          
          {/* Institutional explanation card answering user's question directly */}
          <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 text-xs text-slate-700 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-purple-950">
              <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0" />
              <span>Rôle officiel de la Direction du CEDoc après examen et présélection :</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Le <strong>Directeur du CEDoc</strong> centralise l'ensemble des procès-verbaux (PV) d'examen et d'auditions transmis par les commissions de thèse et les laboratoires. Il procède à l'<strong>arbitrage des quotas globaux de l'école doctorale</strong> (bourses ministérielles, contrats doctoraux USMBA) et <strong>homologue la Liste Principale</strong>. Cette homologation est l'acte juridique indispensable qui autorise la <strong>Scolarité (Administration)</strong> à recevoir le dossier physique et valider l'inscription définitive.
            </p>
          </div>

          {/* KPI Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide block">
                Candidatures CEDoc
              </span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
                {candidateApps.length} dossier(s)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">Toutes disciplines confondues</p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide block">
                Présélectionnés Commission
              </span>
              <span className="text-xl font-bold font-mono text-sky-800 mt-1 block">
                {preselectedApps.length} candidat(s)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">En cours d'audition / délibération</p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide block">
                Homologations Accordées
              </span>
              <span className="text-xl font-bold font-mono text-emerald-800 mt-1 block">
                {homologatedApps.length} liste(s)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">Transmises à la Scolarité</p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide block">
                En Attente Homologation
              </span>
              <span className="text-xl font-bold font-mono text-amber-800 mt-1 block">
                {pendingHomologationApps.length} candidat(s)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">Action du Directeur requise</p>
            </div>
          </div>

          {/* Subfilter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Filtrer les dossiers :</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSubFilter('tous')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  subFilter === 'tous'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tous ({candidateApps.length})
              </button>

              <button
                onClick={() => setSubFilter('a_homologuer')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  subFilter === 'a_homologuer'
                    ? 'bg-amber-800 text-white'
                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                À Homologuer ({pendingHomologationApps.length})
              </button>

              <button
                onClick={() => setSubFilter('preselectionnes')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  subFilter === 'preselectionnes'
                    ? 'bg-sky-800 text-white'
                    : 'bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100'
                }`}
              >
                Présélectionnés ({preselectedApps.length})
              </button>

              <button
                onClick={() => setSubFilter('admis')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  subFilter === 'admis'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                Admis / PV ({admittedApps.length})
              </button>

              <button
                onClick={() => setSubFilter('homologues')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  subFilter === 'homologues'
                    ? 'bg-purple-800 text-white'
                    : 'bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100'
                }`}
              >
                Homologués CEDoc ({homologatedApps.length})
              </button>
            </div>
          </div>

          {/* List of applications to homologate */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Dossiers des Candidatures Doctorales sous Tutelle du CEDoc ({displayedApps.length})
            </h2>

            {displayedApps.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center text-slate-400">
                <Users className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-semibold text-slate-700">Aucun dossier dans cette catégorie</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Modifiez votre filtre pour afficher l'ensemble des candidats du pôle doctoral.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {displayedApps.map(app => {
                  const subjectId = app.choixSujets[0]?.subjectId;
                  const subject = subjects.find(s => s.id === subjectId);
                  const isHomologated = !!app.homologationCed?.homologue;
                  const isPreselected = app.status === 'preselectionne';
                  const isAdmis = ['admis', 'dossier_soumis', 'dossier_non_conforme', 'inscription_validee'].includes(app.status);

                  return (
                    <div
                      key={app.id}
                      className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
                            <span className="font-bold text-slate-700">{app.referenceDossier}</span>
                            <span>·</span>
                            <span className="text-slate-600 font-sans font-medium">Discipline : {subject?.discipline || 'Sciences & Technologies'}</span>
                            <span>·</span>
                            <span>{app.universiteOrigine}</span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 leading-snug">
                            {app.prenom} {app.nom}
                          </h3>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Thèse : <strong>{subject?.titre || 'Sujet de thèse doctorale'}</strong>
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Laboratoire : <span className="font-medium text-slate-800">{subject?.laboratoire}</span> · Directeur : <span className="font-medium text-slate-800">{subject?.directeurThese}</span>
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold block ${
                            isHomologated
                              ? 'bg-purple-50 text-purple-800 border-purple-200'
                              : isAdmis
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : isPreselected
                                  ? 'bg-sky-50 text-sky-800 border-sky-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {isHomologated ? 'Homologué CEDoc' : isAdmis ? 'Admis par Commission' : isPreselected ? 'Présélectionné oral' : app.status}
                          </span>
                          {app.entretien?.notesOral ? (
                            <span className="text-[11px] text-slate-500 mt-1 block">
                              Note jury : <strong className="font-mono text-slate-900">{app.entretien.notesOral}/20</strong>
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-500 mt-1 block">
                              Note dossier : <strong className="font-mono text-slate-900">{app.moyenneGenerale}/20</strong>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* PV Commission & Lab Visa details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-md">
                          <span className="font-semibold text-slate-700 block text-[11px] mb-0.5">
                            1. Délibération Commission de Thèse :
                          </span>
                          <p className="text-slate-600 text-[11px]">
                            Avis : <strong>{app.entretien?.avisCommission || (isPreselected ? 'Candidat Présélectionné' : 'En examen')}</strong>
                            {app.entretien?.notesOral && ` · Note oral : ${app.entretien.notesOral}/20`}
                          </p>
                          {app.entretien?.pvCommentaire && (
                            <p className="italic text-slate-500 text-[10px] mt-1">« {app.entretien.pvCommentaire} »</p>
                          )}
                        </div>

                        <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-md">
                          <span className="font-semibold text-slate-700 block text-[11px] mb-0.5">
                            2. Visa d'Accueil Laboratoire :
                          </span>
                          {app.visaLaboAccueil?.accorde ? (
                            <p className="text-emerald-800 text-[11px] font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Accordé ({app.visaLaboAccueil.dateVisa}) · Quotas vérifiés</span>
                            </p>
                          ) : (
                            <p className="text-amber-800 text-[11px] flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>Visa labo en cours ou dispense directe CEDoc</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Homologation Actions */}
                      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {isHomologated ? (
                          <div className="flex items-center gap-2 text-xs text-purple-900 bg-purple-50 px-3 py-1.5 rounded-md border border-purple-200">
                            <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                            <span>
                              <strong>Liste homologuée par le CEDoc</strong> ({app.homologationCed?.dateHomologation}) par {app.homologationCed?.directeurCedNom}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">
                            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>Prêt pour homologation institutionnelle des quotas et bourses</span>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2">
                          {!isHomologated ? (
                            <>
                              <button
                                onClick={() => handleHomologate(app.id, false)}
                                className="px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-md border border-rose-200 transition-colors"
                              >
                                Émettre réserves
                              </button>

                              <button
                                onClick={() => handleHomologate(app.id, true)}
                                className="px-3.5 py-1.5 text-xs font-medium text-white bg-purple-900 hover:bg-purple-800 rounded-md shadow-xs transition-colors inline-flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Homologuer l'Admission</span>
                              </button>

                              <button
                                onClick={() => handleHomologateAndTransmitToAdmin(app.id)}
                                className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs transition-colors inline-flex items-center gap-1.5"
                                title="Homologue et envoie directement le dossier administratif à la scolarité"
                              >
                                <Send className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Homologuer & Transmettre à la Scolarité</span>
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              {app.status === 'admis' && (
                                <button
                                  onClick={() => handleHomologateAndTransmitToAdmin(app.id)}
                                  className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs transition-colors inline-flex items-center gap-1.5"
                                >
                                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Transmettre à la Scolarité</span>
                                </button>
                              )}
                              <span className="text-[11px] text-slate-500 font-mono">
                                Statut actuel : <strong>{app.status}</strong>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: HOMOLOGATION & PUBLICATION DES SUJETS (COULOIR UML 5 AMONT) */}
      {activeTab === 'sujets' && (
        <div className="space-y-4">
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Sujets Validés par les Laboratoires en Attente d'Homologation ({pendingCedConfirmation.length})
            </h2>

            {pendingCedConfirmation.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600 mb-2" />
                <p className="text-sm font-semibold text-slate-700">Tous les sujets proposés sont confirmés</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  L'offre de thèses est automatiquement publiée au catalogue public sur la plateforme GCD.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {pendingCedConfirmation.map(subject => (
                  <div
                    key={subject.id}
                    className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
                          <span className="font-bold text-slate-700">{subject.code}</span>
                          <span>·</span>
                          <span className="text-slate-600 font-sans font-medium">{subject.discipline}</span>
                          <span>·</span>
                          <span>Labo : {subject.laboratoire}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug">
                          {subject.titre}
                        </h3>
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 shrink-0 font-medium">
                        Visa Labo accordé
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-md border border-slate-100 leading-relaxed">
                      {subject.resume}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Directeur de Thèse :</span>
                        <span className="font-medium text-slate-800">{subject.directeurThese}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Type de Financement :</span>
                        <span className="font-medium text-emerald-800">{subject.financement}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Places ouvertes :</span>
                        <span className="font-medium text-slate-800">{subject.placesDisponibles} doctorant(s)</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <span>Mise en ligne immédiate sur le catalogue des candidatures</span>
                      </div>

                      <button
                        onClick={() => confirmCedSubject(subject.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Confirmer & Publier au Catalogue</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Currently Published */}
          <div className="mt-6 pt-4 border-t border-slate-200/80 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Offres Publiées au Catalogue GCD ({publishedGcdSubjects.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {publishedGcdSubjects.map(s => (
                <div key={s.id} className="p-2.5 bg-white border border-slate-200/80 rounded-md flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 truncate max-w-[280px]">{s.titre}</p>
                    <p className="text-[11px] text-slate-500">{s.directeurThese} · {s.code}</p>
                  </div>
                  <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-emerald-600" />
                    En ligne
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONFIRMATION RÉINSCRIPTION (RÉINSCRIPTION - ÉTAPE 5 DÉBAT) */}
      {activeTab === 'reinscriptions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Demandes de Réinscription en Attente de Confirmation CEDoc ({pendingCedReinscriptions.length})
              </h2>
              <p className="text-[11px] text-slate-500">
                Étape 5 du débat : Validation académique finale, respect du calendrier et régularisation des dérogations
              </p>
            </div>
          </div>

          {pendingCedReinscriptions.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center text-slate-400">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600 mb-2" />
              <p className="text-sm font-semibold text-slate-700">Toutes les réinscriptions ont été confirmées par le CEDoc</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Les dossiers ont été transmis à la Scolarité pour contrôle des pièces et quittance.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {pendingCedReinscriptions.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
                        <span className="font-bold text-slate-700">{item.matriculeDoctorant}</span>
                        <span>·</span>
                        <span className="text-slate-600 font-sans font-medium">Passage en {item.anneeTheseSollicitee}ème Année</span>
                        <span>·</span>
                        <span>Labo : {item.laboratoire}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {item.prenom} {item.nom}
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5 italic">
                        Sujet : « {item.sujetThese} » (Dir : {item.directeurThese})
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium block">
                        Visa Labo Accordé
                      </span>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Avancement : <strong className="font-mono text-slate-900">{item.rapportActivites.avancementPourcentage}%</strong>
                      </span>
                    </div>
                  </div>

                  {/* Avis Directeur & Visa Labo */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md">
                      <span className="font-semibold text-slate-700 block text-[11px]">Avis du Directeur :</span>
                      <p className="text-slate-600 italic text-[11px]">
                        "{item.avisDirecteur?.decision} · {item.avisDirecteur?.commentairesEtRecommandations}"
                      </p>
                    </div>

                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md">
                      <span className="font-semibold text-slate-700 block text-[11px]">Visa du Laboratoire :</span>
                      <p className="text-slate-600 italic text-[11px]">
                        "{item.validationLabo?.commentaires || 'Approuvé par la direction de recherche'}"
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <input
                      type="text"
                      placeholder="Observations institutionnelles CEDoc..."
                      value={cedObservationsInput}
                      onChange={e => setCedObservationsInput(e.target.value)}
                      className="px-3 py-1.5 text-xs border border-slate-200 rounded-md flex-1 max-w-md outline-none"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleConfirmReinscription(item.id, false)}
                        className="px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-md border border-rose-200 transition-colors"
                      >
                        Mettre en réserve
                      </button>
                      <button
                        onClick={() => handleConfirmReinscription(item.id, true)}
                        className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs transition-colors"
                      >
                        Confirmer pour le CEDoc
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Confirmed re-enrollment history */}
          <div className="mt-6 pt-4 border-t border-slate-200/80 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Réinscriptions Confirmées par le CEDoc ({confirmedCedReinscriptions.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {confirmedCedReinscriptions.map(item => (
                <div key={item.id} className="p-2.5 bg-white border border-slate-200/80 rounded-md flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{item.prenom} {item.nom}</p>
                    <p className="text-[11px] text-slate-500">{item.matriculeDoctorant} · {item.anneeTheseSollicitee}ème année</p>
                  </div>
                  <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Confirmé ({item.confirmationCed?.dateConfirmation})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
