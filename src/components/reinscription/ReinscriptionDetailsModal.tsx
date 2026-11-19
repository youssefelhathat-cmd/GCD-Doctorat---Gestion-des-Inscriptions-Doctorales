import React, { useState } from 'react';
import { useDoctorat } from '../../context/DoctoratContext';
import { DoctoralReEnrollment, DirectorOpinion } from '../../types';
import { 
  X, 
  CheckCircle2, 
  Award, 
  Building2, 
  School, 
  FileCheck2, 
  Printer
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reinscription: DoctoralReEnrollment;
}

export const ReinscriptionDetailsModal: React.FC<Props> = ({ isOpen, onClose, reinscription }) => {
  const { 
    role, 
    giveDirectorOpinion, 
    validateLabReinscription, 
    confirmCedReinscription, 
    auditReinscriptionAdmin 
  } = useDoctorat();

  // Form states for role actions
  const [decisionAvis, setDecisionAvis] = useState<'Très favorable' | 'Favorable' | 'Réservé' | 'Défavorable'>('Très favorable');
  const [qualiteAvis, setQualiteAvis] = useState<'Excellente' | 'Très bonne' | 'Satisfaisante' | 'Insuffisante'>('Excellente');
  const [commentairesAvis, setCommentairesAvis] = useState(
    'Très bon état d\'avancement des travaux. Les objectifs de l\'année ont été pleinement atteints avec publication probante.'
  );

  const [labCommentaire, setLabCommentaire] = useState('Ressources matérielles et banc d\'essai disponibles au laboratoire.');
  const [cedCommentaire, setCedCommentaire] = useState('Calendrier de soutenance et formations doctorales validés.');

  const [quittanceChecked, setQuittanceChecked] = useState(reinscription.dossierAdministratif.quittanceDroitsPayee);
  const [assuranceChecked, setAssuranceChecked] = useState(reinscription.dossierAdministratif.attestationAssuranceValide);
  const [missingPieceText, setMissingPieceText] = useState('Quittance bancaire originale manquante.');

  if (!isOpen) return null;

  const handleDirectorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const opinion: DirectorOpinion = {
      decision: decisionAvis,
      appreciationQualite: qualiteAvis,
      commentairesEtRecommandations: commentairesAvis,
      dateAvis: new Date().toLocaleDateString('fr-FR') + ' ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      delaiRespecte: true
    };
    giveDirectorOpinion(reinscription.id, opinion);
  };

  const handleLabSubmit = (isValide: boolean) => {
    validateLabReinscription(reinscription.id, isValide, labCommentaire);
  };

  const handleCedSubmit = (isConfirme: boolean) => {
    confirmCedReinscription(reinscription.id, isConfirme, cedCommentaire);
  };

  const handleAdminSubmit = (isConforme: boolean) => {
    const missing = isConforme ? [] : [missingPieceText];
    auditReinscriptionAdmin(reinscription.id, isConforme, missing);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden text-xs">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-slate-500 mb-1">
              <span className="font-bold text-slate-900">{reinscription.matriculeDoctorant}</span>
              <span>·</span>
              <span className="text-emerald-800 font-sans font-semibold">Réinscription en {reinscription.anneeTheseSollicitee}ème Année</span>
              <span>·</span>
              <span>Session {reinscription.anneeUniversitaire}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Dossier de Réinscription · {reinscription.prenom} {reinscription.nom}
            </h2>
            <p className="text-slate-600 mt-0.5 truncate max-w-2xl">
              Thèse : <em>« {reinscription.sujetThese} »</em>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Stepper tracking */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Circuit de Validation de la Réinscription
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 text-center text-xs">
              
              <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                1. Rapport Soumis
              </div>

              <div className={`p-2.5 rounded border ${
                reinscription.avisDirecteur 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' 
                  : 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
              }`}>
                2. Avis Encadrant
              </div>

              <div className={`p-2.5 rounded border ${
                reinscription.validationLabo?.decision === 'Validé'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}>
                3. Visa Laboratoire
              </div>

              <div className={`p-2.5 rounded border ${
                reinscription.confirmationCed?.decision === 'Confirmé'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}>
                4. Confirmation CEDoc
              </div>

              <div className={`p-2.5 rounded border ${
                reinscription.status === 'reinscription_validee'
                  ? 'bg-emerald-700 text-white font-bold'
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}>
                5. Inscription Validée
              </div>

            </div>
          </div>

          {/* Details of Activity Report */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Rapport d'Activités & Avancement Déclaré
              </h3>
              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Taux d'avancement : {reinscription.rapportActivites.avancementPourcentage}%
              </span>
            </div>

            <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              <strong>Résumé des travaux :</strong> {reinscription.rapportActivites.resumeAvancement || 'Non renseigné'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-bold text-slate-800 block mb-1">Objectifs atteints :</span>
                <p className="text-slate-600 whitespace-pre-line">{reinscription.rapportActivites.objectifsAtteints || 'Non renseigné'}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-bold text-slate-800 block mb-1">Difficultés & Solutions :</span>
                <p className="text-slate-600">{reinscription.rapportActivites.difficultesEtSolutions || 'Aucune'}</p>
              </div>
            </div>

            {/* Publications */}
            <div>
              <span className="font-bold text-slate-800 block mb-1.5">
                Publications scientifiques déclarées ({reinscription.rapportActivites.publications.length}) :
              </span>
              {reinscription.rapportActivites.publications.length === 0 ? (
                <p className="text-slate-400 italic">Aucune publication déclarée.</p>
              ) : (
                <div className="space-y-1.5">
                  {reinscription.rapportActivites.publications.map((pub, idx) => (
                    <div key={idx} className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{pub.titre}</p>
                        <p className="text-[11px] text-slate-500">{pub.revueOuConference} · {pub.indexation}</p>
                      </div>
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        {pub.statut}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CED Credits & Soutenance date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block text-[11px]">Formations CEDoc validées :</span>
                <span className="font-bold text-slate-800">
                  {reinscription.rapportActivites.formationsValideesHeures} h / 200h obligatoires
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Calendrier prévisionnel de soutenance :</span>
                <span className="font-bold text-slate-800">
                  {reinscription.rapportActivites.calendrierPrevisionnelSoutenance}
                </span>
              </div>
            </div>
          </div>

          {/* ROLE ACTION AREA : Encadrant / Directeur de thèse */}
          {(role === 'professeur' || role === 'plateforme_gcd') && (
            <div className="p-5 bg-orange-50/70 border border-orange-200 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-orange-950 uppercase tracking-wider text-xs">
                  <Award className="w-4 h-4 text-orange-700" />
                  <span>Avis de l'Encadrant / Directeur de Thèse</span>
                </div>
              </div>

              {reinscription.avisDirecteur ? (
                <div className="bg-white p-3.5 rounded-lg border border-orange-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Avis formulé :</span>
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {reinscription.avisDirecteur.decision} ({reinscription.avisDirecteur.appreciationQualite})
                    </span>
                  </div>
                  <p className="text-slate-600 italic">« {reinscription.avisDirecteur.commentairesEtRecommandations} »</p>
                </div>
              ) : (
                <form onSubmit={handleDirectorSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Avis d'encadrement *</label>
                      <select
                        value={decisionAvis}
                        onChange={e => setDecisionAvis(e.target.value as any)}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white font-bold"
                      >
                        <option value="Très favorable">Très favorable</option>
                        <option value="Favorable">Favorable</option>
                        <option value="Réservé">Réservé</option>
                        <option value="Défavorable">Défavorable</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Qualité de l'avancement</label>
                      <select
                        value={qualiteAvis}
                        onChange={e => setQualiteAvis(e.target.value as any)}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="Excellente">Excellente</option>
                        <option value="Très bonne">Très bonne</option>
                        <option value="Satisfaisante">Satisfaisante</option>
                        <option value="Insuffisante">Insuffisante</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Commentaires et recommandations scientifiques *</label>
                    <textarea
                      rows={2}
                      required
                      value={commentairesAvis}
                      onChange={e => setCommentairesAvis(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-orange-700 hover:bg-orange-800 text-white font-semibold rounded-lg shadow-2xs transition-colors"
                    >
                      Enregistrer l'Avis et Transmettre au Laboratoire
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ROLE ACTION AREA : Laboratoire */}
          {(role === 'directeur_labo' || role === 'plateforme_gcd') && (
            <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-4">
              <div className="flex items-center gap-2 font-bold text-emerald-950 uppercase tracking-wider text-xs">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>Validation de la Structure / Laboratoire</span>
              </div>

              {reinscription.validationLabo ? (
                <div className="bg-white p-3.5 rounded-lg border border-emerald-100 space-y-1">
                  <p><strong>Statut Laboratoire :</strong> {reinscription.validationLabo.decision}</p>
                  <p className="text-slate-600">{reinscription.validationLabo.commentaires}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-emerald-900">
                    Confirmez la disponibilité des moyens de recherche au sein du laboratoire pour cette réinscription.
                  </p>
                  <input
                    type="text"
                    value={labCommentaire}
                    onChange={e => setLabCommentaire(e.target.value)}
                    className="w-full p-2 border border-emerald-300 rounded bg-white"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLabSubmit(true)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg transition-colors"
                    >
                      Viser pour le Laboratoire → Transmettre au CEDoc
                    </button>
                    <button
                      onClick={() => handleLabSubmit(false)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Demander Révision
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ROLE ACTION AREA : Direction CEDoc */}
          {(role === 'directeur_ced' || role === 'plateforme_gcd') && (
            <div className="p-5 bg-purple-50/70 border border-purple-200 rounded-xl space-y-4">
              <div className="flex items-center gap-2 font-bold text-purple-950 uppercase tracking-wider text-xs">
                <School className="w-4 h-4 text-purple-700" />
                <span>Confirmation du Centre d'Études Doctorales (CEDoc)</span>
              </div>

              {reinscription.confirmationCed ? (
                <div className="bg-white p-3.5 rounded-lg border border-purple-100 space-y-1">
                  <p><strong>Statut CEDoc :</strong> {reinscription.confirmationCed.decision}</p>
                  <p className="text-slate-600">{reinscription.confirmationCed.commentaires}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-purple-900">
                    Validation institutionnelle du Centre d'Études Doctorales.
                  </p>
                  <input
                    type="text"
                    value={cedCommentaire}
                    onChange={e => setCedCommentaire(e.target.value)}
                    className="w-full p-2 border border-purple-300 rounded bg-white"
                  />
                  <button
                    onClick={() => handleCedSubmit(true)}
                    className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg transition-colors"
                  >
                    Confirmer au niveau du CEDoc
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ROLE ACTION AREA : Administration */}
          {(role === 'administration' || role === 'plateforme_gcd') && (
            <div className="p-5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-4">
              <div className="flex items-center gap-2 font-bold text-indigo-950 uppercase tracking-wider text-xs">
                <FileCheck2 className="w-4 h-4 text-indigo-700" />
                <span>Contrôle Administratif & Quittance de Réinscription</span>
              </div>

              {reinscription.status === 'reinscription_validee' ? (
                <div className="bg-emerald-700 text-white p-4 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">RÉINSCRIPTION EN DOCTORAT DÉFINITIVEMENT VALIDÉE</span>
                    <span className="font-mono bg-white/20 px-2 py-0.5 rounded font-bold">
                      {reinscription.nouvelleAttestationNumero}
                    </span>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-emerald-900 font-bold rounded shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimer l'Attestation de Réinscription</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={quittanceChecked}
                        onChange={e => setQuittanceChecked(e.target.checked)}
                        className="rounded text-indigo-600 w-4 h-4"
                      />
                      <span>Quittance de paiement des droits de réinscription 2026/2027</span>
                    </label>

                    <label className="flex items-center gap-2.5 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={assuranceChecked}
                        onChange={e => setAssuranceChecked(e.target.checked)}
                        className="rounded text-indigo-600 w-4 h-4"
                      />
                      <span>Attestation d'assurance maladie / responsabilité civile étudiant</span>
                    </label>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={missingPieceText}
                        onChange={e => setMissingPieceText(e.target.value)}
                        placeholder="Motif si incomplet..."
                        className="px-2.5 py-1.5 border border-slate-200 rounded bg-white text-xs w-60"
                      />
                      <button
                        onClick={() => handleAdminSubmit(false)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded"
                      >
                        Signaler Incomplet
                      </button>
                    </div>

                    <button
                      onClick={() => handleAdminSubmit(true)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded shadow-xs"
                    >
                      Dossier Conforme · Valider la Réinscription
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-slate-500 text-[11px]">
            Session Doctorale 2026/2027
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
