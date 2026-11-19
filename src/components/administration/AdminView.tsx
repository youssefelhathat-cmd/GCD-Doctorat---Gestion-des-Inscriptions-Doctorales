import React, { useState } from 'react';
import { useDoctorat } from '../../context/DoctoratContext';
import { CandidateApplication } from '../../types';
import { 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Mail, 
  Printer
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { 
    applications, 
    checkAdministrativeConformity, 
    notifyNonAdmission,
    submitAdminDossier,
    reinscriptions,
    auditReinscriptionAdmin
  } = useDoctorat();

  const [activeTab, setActiveTab] = useState<'inscriptions' | 'reinscriptions'>('inscriptions');
  const [selectedApp, setSelectedApp] = useState<CandidateApplication | null>(null);
  const [selectedReinscriptionId, setSelectedReinscriptionId] = useState<string>(reinscriptions[0]?.id || '');
  const [remarks, setRemarks] = useState('Attestation de diplôme manquante ou cachet illisible.');

  // Inscription Checklists
  const [diplomeChecked, setDiplomeChecked] = useState(true);
  const [relevesChecked, setRelevesChecked] = useState(true);
  const [charteChecked, setCharteChecked] = useState(true);
  const [assuranceChecked, setAssuranceChecked] = useState(true);
  const [quittanceChecked, setQuittanceChecked] = useState(true);

  // Reinscription Checklists
  const [quittanceReinscrChecked, setQuittanceReinscrChecked] = useState(true);
  const [assuranceReinscrChecked, setAssuranceReinscrChecked] = useState(true);
  const [ficheReinscrChecked, setFicheReinscrChecked] = useState(true);
  const [missingPiecesInput, setMissingPiecesInput] = useState('Quittance bancaire originale manquante.');
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  const admittedAwaitingPhysicalDossier = applications.filter(a => a.status === 'admis');
  const adminReceivedApps = applications.filter(a => 
    ['dossier_soumis', 'dossier_non_conforme', 'inscription_validee', 'non_admis'].includes(a.status)
  );

  const pendingControlApps = applications.filter(a => a.status === 'dossier_soumis');
  const nonAdmittedToNotify = applications.filter(a => a.status === 'non_admis');

  // Reinscriptions waiting for admin check (have CED confirmation)
  const pendingAdminReinscriptions = reinscriptions.filter(r => 
    r.status === 'confirme_ced' || (r.confirmationCed && r.status !== 'reinscription_validee')
  );
  const validatedAdminReinscriptions = reinscriptions.filter(r => r.status === 'reinscription_validee');

  const selectedReinscription = reinscriptions.find(r => r.id === selectedReinscriptionId) || reinscriptions[0];

  const handleValidateConformity = (isConforme: boolean) => {
    if (!selectedApp) return;
    checkAdministrativeConformity(selectedApp.id, isConforme, isConforme ? undefined : remarks);
    setSelectedApp(null);
    setAdminNotice(isConforme ? 'Inscription définitive validée. Matricule officiel attribué.' : 'Notification de pièces non conformes envoyée.');
    setTimeout(() => setAdminNotice(null), 3000);
  };

  const handleNotifyRejection = (appId: string) => {
    notifyNonAdmission(appId);
    setAdminNotice('Notification officielle de non-admission transmise par email au candidat.');
    setTimeout(() => setAdminNotice(null), 3000);
  };

  const handleAuditReinscription = (id: string, isConforme: boolean) => {
    const missing = isConforme ? [] : [missingPiecesInput];
    auditReinscriptionAdmin(id, isConforme, missing);
    setAdminNotice(isConforme ? 'Réinscription annuelle validée avec succès. Attestation générée.' : 'Signalement de pièces manquantes transmis au doctorant.');
    setTimeout(() => setAdminNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Clean University Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Acteur : Scolarité & Bureau des Thèses (Administration)</span>
            <span>·</span>
            <span className="text-emerald-800 font-semibold">Couloir UML 6 & Étapes 7 (Inscr.) et 6-7 (Réinscr.)</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Espace Scolarité & Contrôle Administratif
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Vérification des originaux, attribution des matricules officiels, attestations QR-code et gestion des réinscriptions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('inscriptions')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'inscriptions'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Inscriptions 1ère Année ({pendingControlApps.length} à contrôler)</span>
          </button>

          <button
            onClick={() => setActiveTab('reinscriptions')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'reinscriptions'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Réinscriptions Annuelles ({pendingAdminReinscriptions.length} en attente)</span>
          </button>
        </div>
      </div>

      {adminNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{adminNotice}</span>
        </div>
      )}

      {/* TAB 1: INSCRIPTIONS 1ÈRE ANNÉE */}
      {activeTab === 'inscriptions' ? (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Dossiers List */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Dossiers Administratifs ({adminReceivedApps.length})
            </h2>
            <p className="text-[11px] text-slate-400">Candidats admis ou en cours de vérification</p>
          </div>

          {/* Admitted & Homologated candidates awaiting physical file arrival at the desk */}
          {admittedAwaitingPhysicalDossier.length > 0 && (
            <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-lg space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-950 text-[11px] uppercase tracking-wide">
                  Admis Homologués CEDoc ({admittedAwaitingPhysicalDossier.length})
                </span>
                <span className="text-[10px] bg-purple-200 text-purple-900 px-1.5 py-0.5 rounded font-mono font-medium">
                  Guichet
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Candidats autorisés par le CEDoc à déposer leurs pièces originales :
              </p>
              {admittedAwaitingPhysicalDossier.map(cand => (
                <div key={cand.id} className="p-2 bg-white rounded border border-purple-200 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-bold text-slate-900">{cand.prenom} {cand.nom}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{cand.referenceDossier}</p>
                  </div>
                  <button
                    onClick={() => {
                      submitAdminDossier(cand.id);
                      setAdminNotice(`Dossier physique de ${cand.prenom} ${cand.nom} réceptionné au guichet. Prêt pour contrôle de conformité.`);
                      setTimeout(() => setAdminNotice(null), 3000);
                    }}
                    className="px-2.5 py-1 bg-purple-900 hover:bg-purple-800 text-white rounded text-[10px] font-semibold transition-colors shrink-0"
                    title="Enregistre la réception physique des originaux au guichet de scolarité"
                  >
                    Réceptionner
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            {adminReceivedApps.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">Aucun dossier à traiter pour le moment.</p>
            ) : (
              adminReceivedApps.map(app => {
                const isSelected = selectedApp?.id === app.id;
                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[11px] font-bold text-slate-500">{app.referenceDossier}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        app.status === 'inscription_validee'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : app.status === 'dossier_non_conforme'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : app.status === 'non_admis'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        {app.status === 'inscription_validee' ? 'Validé' : app.status === 'dossier_soumis' ? 'À contrôler' : app.status}
                      </span>
                    </div>

                    <p className="font-bold text-slate-900">{app.prenom} {app.nom}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{app.derniereFormation}</p>

                    {app.dossierAdministratif?.matriculeAttribue && (
                      <div className="mt-2 text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        Matricule : {app.dossierAdministratif.matriculeAttribue}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Section for Non-admission notifications */}
          {nonAdmittedToNotify.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>Notifications de non-admission ({nonAdmittedToNotify.length})</span>
              </h3>
              {nonAdmittedToNotify.map(app => (
                <div key={app.id} className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{app.prenom} {app.nom}</span>
                    <p className="text-[11px] text-slate-500">{app.referenceDossier}</p>
                  </div>
                  <button
                    onClick={() => handleNotifyRejection(app.id)}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-semibold"
                  >
                    Notifier
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Verification & Audit Area */}
        <div className="lg:col-span-2">
          {selectedApp ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
                    <span>Réf : {selectedApp.referenceDossier}</span>
                    <span>·</span>
                    <span>CIN : {selectedApp.cinOuPasseport}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Contrôle Administratif : {selectedApp.prenom} {selectedApp.nom}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Mention Master : {selectedApp.mentionMaster} ({selectedApp.moyenneGenerale}/20) · {selectedApp.universiteOrigine}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-mono">Statut du Dossier</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200 inline-block mt-1">
                    {selectedApp.status}
                  </span>
                </div>
              </div>

              {/* Résumé de l'Entretien & Avis Commission */}
              {selectedApp.entretien && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Résultats de la Commission de Thèse :</span>
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Avis : {selectedApp.entretien.avisCommission || 'Favorable'}
                    </span>
                  </div>
                  <p className="text-slate-600">
                    Note oral : <strong>{selectedApp.entretien.notesOral}/20</strong> · Membres : {selectedApp.entretien.juryMembres?.join(', ')}
                  </p>
                  <p className="text-slate-500 text-[11px] italic bg-white p-2 rounded border border-slate-100">
                    « {selectedApp.entretien.pvCommentaire} »
                  </p>
                </div>
              )}

              {/* Conformity Verification Checklist */}
              {['dossier_soumis', 'dossier_non_conforme'].includes(selectedApp.status) && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Contrôle des Pièces Justificatives Originales
                  </h3>

                  <div className="space-y-2 text-xs">
                    <label className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={diplomeChecked}
                        onChange={e => setDiplomeChecked(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span className="font-medium text-slate-800">
                        Diplôme de Master original (ou attestation officielle certifiée conforme)
                      </span>
                    </label>

                    <label className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={relevesChecked}
                        onChange={e => setRelevesChecked(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span className="font-medium text-slate-800">
                        Relevés de notes originaux certifiés (S1 à S4)
                      </span>
                    </label>

                    <label className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={charteChecked}
                        onChange={e => setCharteChecked(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span className="font-medium text-slate-800">
                        Charte des thèses du CEDoc signée par le candidat et le directeur de thèse
                      </span>
                    </label>

                    <label className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={assuranceChecked}
                        onChange={e => setAssuranceChecked(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span className="font-medium text-slate-800">
                        Attestation d'assurance maladie / responsabilité civile étudiant
                      </span>
                    </label>

                    <label className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={quittanceChecked}
                        onChange={e => setQuittanceChecked(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span className="font-medium text-slate-800">
                        Quittance de règlement des droits d'inscription universitaires
                      </span>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={remarks}
                        onChange={e => setRemarks(e.target.value)}
                        placeholder="Motif si non conforme..."
                        className="px-3 py-2 border border-slate-200 rounded-lg text-xs w-60 outline-none"
                      />
                      <button
                        onClick={() => handleValidateConformity(false)}
                        className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs transition-colors"
                      >
                        Signaler Incomplet
                      </button>
                    </div>

                    <button
                      onClick={() => handleValidateConformity(true)}
                      className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors"
                    >
                      Dossier Conforme · Valider l'Inscription
                    </button>
                  </div>
                </div>
              )}

              {/* If Validated */}
              {selectedApp.status === 'inscription_validee' && (
                <div className="p-5 border border-emerald-300 bg-emerald-50/50 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <span>Inscription Définitive Validée au CEDoc</span>
                    </div>
                    <span className="font-mono text-xs font-bold bg-emerald-700 text-white px-3 py-1 rounded">
                      {selectedApp.dossierAdministratif?.matriculeAttribue || 'DOC-2026-CMACS-0042'}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-emerald-200 text-xs space-y-1">
                    <p><strong>Doctorant :</strong> {selectedApp.prenom} {selectedApp.nom}</p>
                    <p><strong>CIN / Passeport :</strong> {selectedApp.cinOuPasseport}</p>
                    <p><strong>Date de validation :</strong> {selectedApp.dossierAdministratif?.dateValidationAdmin || '27/10/2026'}</p>
                    <p><strong>Statut :</strong> Étudiant-Chercheur régulier en 1ère année de Doctorat</p>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimer l'Attestation d'Inscription Officielle</span>
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
              <FileCheck2 className="w-10 h-10 mx-auto stroke-1 mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">Sélectionnez un dossier administratif</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Vérifiez les pièces justificatives et délivrez l'attestation définitive.
              </p>
            </div>
          )}
        </div>

      </div>
      ) : (
        /* TAB 2: AUDIT & VALIDATION ADMINISTRATIVE DES RÉINSCRIPTIONS (ÉTAPES 6 & 7) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Re-enrollments List */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs space-y-3">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Dossiers de Réinscription ({reinscriptions.length})
              </h2>
              <p className="text-[11px] text-slate-400">Étapes 6 & 7 : Contrôle des pièces & Attestation</p>
            </div>

            <div className="space-y-2">
              {reinscriptions.map(item => {
                const isSelected = selectedReinscription?.id === item.id;
                const isValidated = item.status === 'reinscription_validee';
                const isPending = item.status === 'confirme_ced' || (!isValidated && item.confirmationCed);

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedReinscriptionId(item.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50 shadow-xs'
                        : 'border-slate-200/80 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[11px] font-bold text-slate-600">{item.matriculeDoctorant}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${
                        isValidated
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : isPending
                            ? 'bg-sky-50 text-sky-800 border-sky-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {isValidated ? 'Réinscription Validée' : isPending ? 'Prêt pour contrôle' : 'En circuit académique'}
                      </span>
                    </div>

                    <p className="font-semibold text-slate-900">{item.prenom} {item.nom}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {item.anneeTheseSollicitee}ème Année · {item.laboratoire}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Administrative Audit & Certificate */}
          <div className="lg:col-span-2">
            {selectedReinscription ? (
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-5">
                
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
                      <span className="font-bold text-slate-700">{selectedReinscription.matriculeDoctorant}</span>
                      <span>·</span>
                      <span className="text-slate-600 font-sans font-medium">Inscription {selectedReinscription.anneeTheseSollicitee}ème Année ({selectedReinscription.anneeUniversitaire})</span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900">
                      Vérification Réinscription : {selectedReinscription.prenom} {selectedReinscription.nom}
                    </h2>
                    <p className="text-xs text-slate-600 mt-1 italic">
                      Thèse : « {selectedReinscription.sujetThese} » (Dir : {selectedReinscription.directeurThese})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-mono">Statut Réinscription</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded border inline-block mt-1 ${
                      selectedReinscription.status === 'reinscription_validee'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-100 text-slate-800 border-slate-200'
                    }`}>
                      {selectedReinscription.status}
                    </span>
                  </div>
                </div>

                {/* Circuit Approvals Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">1. Directeur Thèse</span>
                    <span className="font-semibold text-emerald-800">
                      {selectedReinscription.avisDirecteur ? `Avis ${selectedReinscription.avisDirecteur.decision}` : 'En attente'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">2. Structure / Labo</span>
                    <span className="font-semibold text-emerald-800">
                      {selectedReinscription.validationLabo ? 'Visa Labo Accordé' : 'En attente'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">3. CEDoc</span>
                    <span className="font-semibold text-emerald-800">
                      {selectedReinscription.confirmationCed ? 'Confirmé Académique' : 'En attente'}
                    </span>
                  </div>
                </div>

                {/* Administrative Checklist (Étape 6 du débat) */}
                {selectedReinscription.status !== 'reinscription_validee' && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Contrôle des Pièces Administratives de Réinscription
                    </h3>

                    <div className="space-y-2 text-xs">
                      <label className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={quittanceReinscrChecked}
                          onChange={e => setQuittanceReinscrChecked(e.target.checked)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                        />
                        <span className="font-medium text-slate-800">
                          Quittance originale de paiement des droits d'inscription annuelle (Année 2026/2027)
                        </span>
                      </label>

                      <label className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={assuranceReinscrChecked}
                          onChange={e => setAssuranceReinscrChecked(e.target.checked)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                        />
                        <span className="font-medium text-slate-800">
                          Attestation d'assurance responsabilité civile et individuelle accident en cours de validité
                        </span>
                      </label>

                      <label className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ficheReinscrChecked}
                          onChange={e => setFicheReinscrChecked(e.target.checked)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                        />
                        <span className="font-medium text-slate-800">
                          Fiche récapitulative annuelle d'avancement signée par le Directeur et visée par le Labo & CEDoc
                        </span>
                      </label>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={missingPiecesInput}
                          onChange={e => setMissingPiecesInput(e.target.value)}
                          placeholder="Pièces manquantes si non conforme..."
                          className="px-3 py-1.5 border border-slate-200 rounded-md text-xs w-64 outline-none"
                        />
                        <button
                          onClick={() => handleAuditReinscription(selectedReinscription.id, false)}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md text-xs transition-colors"
                        >
                          Signaler Manque
                        </button>
                      </div>

                      <button
                        onClick={() => handleAuditReinscription(selectedReinscription.id, true)}
                        className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-md text-xs shadow-xs transition-colors"
                      >
                        Valider la Réinscription Définitive
                      </button>
                    </div>
                  </div>
                )}

                {/* If Re-enrollment Validated (Étape 7 du débat) */}
                {selectedReinscription.status === 'reinscription_validee' && (
                  <div className="p-4 border border-emerald-300 bg-emerald-50/50 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                        <Award className="w-5 h-5 text-emerald-600" />
                        <span>Réinscription Officielle Validée pour l'Année 2026/2027</span>
                      </div>
                      <span className="font-mono text-xs font-bold bg-emerald-700 text-white px-2.5 py-1 rounded">
                        {selectedReinscription.matriculeDoctorant}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-emerald-200 text-xs space-y-1">
                      <p><strong>Doctorant :</strong> {selectedReinscription.prenom} {selectedReinscription.nom}</p>
                      <p><strong>Année de thèse :</strong> {selectedReinscription.anneeTheseSollicitee}ème Année Doctorale</p>
                      <p><strong>Laboratoire :</strong> {selectedReinscription.laboratoire}</p>
                      <p><strong>Attestation délivrée :</strong> {selectedReinscription.nouvelleAttestationNumero || `ATT-REINSCR-2026-${selectedReinscription.matriculeDoctorant}`}</p>
                      <p><strong>Statut :</strong> Inscription reconduite · Droits universitaires acquittés</p>
                    </div>

                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-md shadow-2xs transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Imprimer l'Attestation Officielle de Réinscription</span>
                    </button>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center text-slate-400">
                <FileCheck2 className="w-10 h-10 mx-auto stroke-1 mb-2 text-slate-300" />
                <p className="text-sm font-semibold text-slate-700">Sélectionnez un dossier de réinscription</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vérifiez le paiement des droits, l'assurance et éditez l'attestation de réinscription.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
