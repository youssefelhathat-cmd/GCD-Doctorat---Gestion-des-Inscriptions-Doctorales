import React, { useState } from 'react';
import { useDoctorat } from '../../context/DoctoratContext';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  User, 
  Award,
  Clock,
  FileCheck2,
  AlertCircle,
  Users,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const LabDirectorView: React.FC = () => {
  const { 
    subjects, 
    validateLabSubject, 
    applications,
    validateLabHosting,
    reinscriptions, 
    validateLabReinscription,
    currentAccount
  } = useDoctorat();

  const [activeTab, setActiveTab] = useState<'sujets' | 'candidatures' | 'reinscriptions'>('candidatures');
  const [labCommentInput, setLabCommentInput] = useState('Capacité d\'accueil et adéquation des moyens de calcul et d\'expérimentation confirmées.');
  const [hostingCommentInput, setHostingCommentInput] = useState('Capacité d\'encadrement conforme aux quotas du laboratoire (moins de 6 doctorants par professeur habilité). Moyens matériels disponibles.');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const proposedSubjects = subjects.filter(s => s.status === 'propose');
  const validatedSubjects = subjects.filter(s => ['valide_labo', 'confirme_ced'].includes(s.status));

  // Candidatures related to this lab's subjects or preselected/admitted
  const labSubjectsCodes = subjects.map(s => s.id);
  const labApplications = applications.filter(app => 
    app.choixSujets.some(c => labSubjectsCodes.includes(c.subjectId))
  );

  const preselectedOrAdmittedApps = labApplications.filter(a => 
    ['preselectionne', 'admis', 'dossier_soumis', 'dossier_non_conforme', 'inscription_validee'].includes(a.status)
  );

  const pendingHostingVisaApps = preselectedOrAdmittedApps.filter(a => !a.visaLaboAccueil?.accorde);
  const grantedHostingVisaApps = preselectedOrAdmittedApps.filter(a => a.visaLaboAccueil?.accorde);

  // Re-enrollment items waiting for lab validation (must have director opinion)
  const pendingLabReinscriptions = reinscriptions.filter(r => 
    r.status === 'avis_directeur_rendu' || (r.avisDirecteur && !r.validationLabo)
  );
  const validatedLabReinscriptions = reinscriptions.filter(r => r.validationLabo);

  const handleValidateReinscription = (id: string, isValide: boolean) => {
    validateLabReinscription(id, isValide, labCommentInput);
    setActionNotice(isValide ? 'Visa de laboratoire accordé avec succès et transmis au CEDoc.' : 'Dossier renvoyé pour révision.');
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleGrantHostingVisa = (appId: string, accorde: boolean) => {
    validateLabHosting(appId, accorde, hostingCommentInput);
    setActionNotice(accorde ? 'Visa d\'accueil en laboratoire accordé. Dossier transmis pour homologation CEDoc.' : 'Visa d\'accueil ajourné ou refusé.');
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Clean University Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Acteur : Direction du Laboratoire de Recherche (USMBA)</span>
            <span>·</span>
            <span className="text-emerald-800 font-semibold">Couloir UML 4 & Suivi Post-Présélection</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Espace Direction de Laboratoire
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Validation des sujets, contrôle des capacités d'accueil & quotas post-présélection, et visas des réinscriptions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('candidatures')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'candidatures'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Candidatures & Quotas ({preselectedOrAdmittedApps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sujets')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'sujets'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Sujets de Thèse ({proposedSubjects.length} en attente)</span>
          </button>

          <button
            onClick={() => setActiveTab('reinscriptions')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'reinscriptions'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Visas Réinscription ({pendingLabReinscriptions.length})</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* TAB 1: SUIVI DES CANDIDATURES, POST-PRÉSÉLECTION & QUOTAS LABO */}
      {activeTab === 'candidatures' && (
        <div className="space-y-4">
          
          {/* Institutional explanation card answering user's question directly */}
          <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 text-xs text-slate-700 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sky-950">
              <ShieldCheck className="w-4 h-4 text-sky-700 shrink-0" />
              <span>Rôle du Directeur de Laboratoire après acceptation en présélection / entretien :</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Dès que la commission présélectionne ou auditionne les candidats, le <strong>Directeur de Laboratoire</strong> vérifie la <strong>capacité d'accueil de la structure de recherche</strong> : respect du quota maximal d'étudiants par enseignant-chercheur habilité (max 6 par encadrant), disponibilité des postes de travail, matériels et équipements de laboratoire. Il délivre formellement le <strong>Visa d'accueil en laboratoire</strong> permettant la transmission du dossier au Directeur du CEDoc.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide block">
                Candidats Présélectionnés / Admis
              </span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
                {preselectedOrAdmittedApps.length} dossier(s)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">Rattachés aux sujets du laboratoire</p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide block">
                Visas d'Accueil Accordés
              </span>
              <span className="text-xl font-bold font-mono text-emerald-800 mt-1 block">
                {grantedHostingVisaApps.length} visa(s)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">Capacité et quotas validés</p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide block">
                Quotas d'Encadrement Labo
              </span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
                Conforme USMBA
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">Max 6 doctorants par professeur habilité</p>
            </div>
          </div>

          {/* Applications list */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Dossiers des Candidats & Délivrance du Visa d'Accueil ({preselectedOrAdmittedApps.length})
            </h2>

            {preselectedOrAdmittedApps.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center text-slate-400">
                <Users className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-semibold text-slate-700">Aucun candidat présélectionné pour le moment</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Les dossiers apparaîtront ici dès que les professeurs de commission auront terminé les examens et délibérations.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {preselectedOrAdmittedApps.map(app => {
                  const subjectId = app.choixSujets[0]?.subjectId;
                  const subject = subjects.find(s => s.id === subjectId);
                  const isAdmis = app.status === 'admis' || app.status === 'inscription_validee' || app.status === 'dossier_soumis';
                  const isPreselected = app.status === 'preselectionne';

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
                            <span className="text-slate-600 font-sans font-medium">Mention {app.mentionMaster} ({app.moyenneGenerale}/20)</span>
                            <span>·</span>
                            <span>{app.universiteOrigine}</span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 leading-snug">
                            {app.prenom} {app.nom}
                          </h3>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Sujet : <strong>{subject?.titre || 'Sujet de thèse doctorale'}</strong>
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Directeur de thèse : <span className="font-medium text-slate-800">{subject?.directeurThese || 'Professeur habilité'}</span> · Quota actuel : <span className="font-mono text-emerald-800 font-bold">3/6 inscrits</span>
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold block ${
                            isAdmis
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : isPreselected
                                ? 'bg-sky-50 text-sky-800 border-sky-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {isAdmis ? 'Admis par Commission' : isPreselected ? 'Présélectionné oral' : app.status}
                          </span>
                          {app.entretien?.notesOral && (
                            <span className="text-[11px] text-slate-500 mt-1 block">
                              Note oral : <strong className="font-mono text-slate-900">{app.entretien.notesOral}/20</strong>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* PV Commission Summary */}
                      {app.entretien && (
                        <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-md text-xs text-slate-600 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-slate-800">Avis Commission : {app.entretien.avisCommission || 'Favorable'}</span>
                            <span className="text-slate-500 font-mono">Date PV : {app.entretien.datePv || '26/10/2026'}</span>
                          </div>
                          {app.entretien.pvCommentaire && (
                            <p className="italic text-slate-500 text-[11px]">« {app.entretien.pvCommentaire} »</p>
                          )}
                        </div>
                      )}

                      {/* Visa status or actions */}
                      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {app.visaLaboAccueil?.accorde ? (
                          <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>
                              <strong>Visa d'accueil accordé</strong> ({app.visaLaboAccueil.dateVisa}) par {app.visaLaboAccueil.directeurLaboNom}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">
                            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>En attente de visa d'accueil de la structure de recherche</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          {!app.visaLaboAccueil?.accorde ? (
                            <>
                              <button
                                onClick={() => handleGrantHostingVisa(app.id, false)}
                                className="px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-md border border-rose-200 transition-colors"
                              >
                                Refuser quota
                              </button>
                              <button
                                onClick={() => handleGrantHostingVisa(app.id, true)}
                                className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs transition-colors inline-flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Accorder le Visa d'Accueil</span>
                              </button>
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              Dossier transmis au Directeur du CEDoc pour homologation
                            </span>
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

      {/* TAB 2: VALIDATION DES SUJETS (INSCRIPTION - COULOIR 4 AMONT) */}
      {activeTab === 'sujets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Sujets en Attente de Visa Scientifique ({proposedSubjects.length})
            </h2>
            <span className="text-[11px] text-slate-500">
              Vérification faisabilité et adéquation aux moyens matériels du laboratoire
            </span>
          </div>

          {proposedSubjects.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center text-slate-400">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600 mb-2" />
              <p className="text-sm font-semibold text-slate-700">Tous les sujets proposés sont visés</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Les fiches ont été transmises au Directeur du CEDoc pour homologation finale.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {proposedSubjects.map(subject => (
                <div
                  key={subject.id}
                  className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs hover:border-slate-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
                        <span className="font-bold text-slate-700">{subject.code}</span>
                        <span>·</span>
                        <span className="text-slate-600 font-sans font-medium">{subject.discipline}</span>
                        <span>·</span>
                        <span>Proposé le : {subject.dateCreation}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {subject.titre}
                      </h3>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 shrink-0 font-medium">
                      Attente visa labo
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-md border border-slate-100 leading-relaxed">
                    {subject.resume}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 truncate">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Directeur : <strong>{subject.directeurThese}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Labo : <strong>{subject.laboratoire}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate text-emerald-800">
                      <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Financement : <strong>{subject.financement}</strong></span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Transmission automatique au CEDoc dès validation
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => validateLabSubject(subject.id, false)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-md border border-rose-200 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Demander révision</span>
                      </button>
                      <button
                        onClick={() => validateLabSubject(subject.id, true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Valider pour le laboratoire</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Validated history */}
          <div className="mt-6 pt-4 border-t border-slate-200/80 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Historique des Sujets Validés par le Laboratoire ({validatedSubjects.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {validatedSubjects.map(s => (
                <div key={s.id} className="p-2.5 bg-white border border-slate-200/80 rounded-md flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 truncate max-w-[280px]">{s.titre}</p>
                    <p className="text-[11px] text-slate-500">{s.directeurThese} · {s.code}</p>
                  </div>
                  <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                    Visé Labo
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VALIDATION DES RÉINSCRIPTIONS (RÉINSCRIPTION - ÉTAPE 4 DÉBAT) */}
      {activeTab === 'reinscriptions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Demandes de Réinscription en Attente de Visa Structure ({pendingLabReinscriptions.length})
              </h2>
              <p className="text-[11px] text-slate-500">
                Étape 4 du débat : Contrôle de la présence au laboratoire, état des ressources et validation de l'avancement
              </p>
            </div>
          </div>

          {pendingLabReinscriptions.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center text-slate-400">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600 mb-2" />
              <p className="text-sm font-semibold text-slate-700">Toutes les réinscriptions ont été traitées au niveau du laboratoire</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Les dossiers ont été transmis à la Direction du CEDoc pour confirmation institutionnelle.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {pendingLabReinscriptions.map(item => (
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
                        <span>Directeur : {item.directeurThese}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {item.prenom} {item.nom}
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5 italic">
                        Thèse : « {item.sujetThese} »
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium block">
                        Visa Labo requis
                      </span>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Avancement : <strong className="font-mono text-slate-900">{item.rapportActivites.avancementPourcentage}%</strong>
                      </span>
                    </div>
                  </div>

                  {/* Avis du directeur de thèse */}
                  {item.avisDirecteur && (
                    <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-md text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-emerald-900">
                          Avis du Directeur ({item.avisDirecteur.decision}) · Appréciation {item.avisDirecteur.appreciationQualite}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-mono">Signé le {item.avisDirecteur.dateAvis}</span>
                      </div>
                      <p className="text-slate-700 italic">
                        "{item.avisDirecteur.commentairesEtRecommandations}"
                      </p>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <input
                      type="text"
                      placeholder="Commentaire de la structure de recherche..."
                      value={labCommentInput}
                      onChange={e => setLabCommentInput(e.target.value)}
                      className="px-3 py-1.5 text-xs border border-slate-200 rounded-md flex-1 max-w-md outline-none"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleValidateReinscription(item.id, false)}
                        className="px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-md border border-rose-200 transition-colors"
                      >
                        Refuser / Révision
                      </button>
                      <button
                        onClick={() => handleValidateReinscription(item.id, true)}
                        className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs transition-colors"
                      >
                        Accorder le Visa du Laboratoire
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Validated re-enrollment history */}
          <div className="mt-6 pt-4 border-t border-slate-200/80 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Réinscriptions Visées par le Laboratoire ({validatedLabReinscriptions.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {validatedLabReinscriptions.map(item => (
                <div key={item.id} className="p-2.5 bg-white border border-slate-200/80 rounded-md flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{item.prenom} {item.nom}</p>
                    <p className="text-[11px] text-slate-500">{item.matriculeDoctorant} · {item.anneeTheseSollicitee}ème année</p>
                  </div>
                  <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Visa Accordé ({item.validationLabo?.dateValidation})
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
