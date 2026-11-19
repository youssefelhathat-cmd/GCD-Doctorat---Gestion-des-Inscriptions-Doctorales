import React, { useState } from 'react';
import { CandidateApplication } from '../../types';
import { useDoctorat } from '../../context/DoctoratContext';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  FileText, 
  ArrowLeft,
  Send,
  Printer,
  RefreshCw,
  Award
} from 'lucide-react';

interface Props {
  application: CandidateApplication;
  onBackToCatalog: () => void;
}

export const CandidateDashboard: React.FC<Props> = ({ application, onBackToCatalog }) => {
  const { 
    subjects, 
    submitAdminDossier, 
    correctDossier 
  } = useDoctorat();

  const [correctionNote, setCorrectionNote] = useState('');
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);
  const [isPreFilling, setIsPreFilling] = useState(false);

  const appliedSubjects = application.choixSujets.map(c => {
    const s = subjects.find(sub => sub.id === c.subjectId);
    return { ...s, priorite: c.priorite };
  }).filter(Boolean);

  const handlePrepareAdminDossier = () => {
    setIsPreFilling(true);
    setTimeout(() => {
      submitAdminDossier(application.id);
      setIsPreFilling(false);
    }, 400);
  };

  const handleSendCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionNote) return;
    correctDossier(application.id, correctionNote);
    setShowCorrectionForm(false);
    setCorrectionNote('');
  };

  const getStatusBadge = (status: CandidateApplication['status']) => {
    switch (status) {
      case 'soumise':
        return { label: 'Candidature enregistrée', color: 'bg-sky-50 text-sky-800 border-sky-200', icon: Clock };
      case 'en_examen':
        return { label: 'En cours d\'examen par la commission', color: 'bg-amber-50 text-amber-800 border-amber-200', icon: Clock };
      case 'rejetee_preselection':
        return { label: 'Non présélectionné', color: 'bg-rose-50 text-rose-800 border-rose-200', icon: AlertCircle };
      case 'preselectionne':
        return { label: 'Présélectionné · Entretien programmé', color: 'bg-purple-50 text-purple-800 border-purple-200', icon: Calendar };
      case 'entretien_passe':
        return { label: 'Entretien passé · Délibération en cours', color: 'bg-indigo-50 text-indigo-800 border-indigo-200', icon: Clock };
      case 'non_admis':
        return { label: 'Non retenu après entretien', color: 'bg-rose-50 text-rose-800 border-rose-200', icon: AlertCircle };
      case 'admis':
        return { label: 'Admis sur liste principale', color: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle2 };
      case 'dossier_soumis':
        return { label: 'Dossier administratif en cours de vérification', color: 'bg-blue-50 text-blue-800 border-blue-200', icon: Clock };
      case 'dossier_non_conforme':
        return { label: 'Dossier incomplet · Pièces à corriger', color: 'bg-amber-50 text-amber-800 border-amber-200', icon: AlertCircle };
      case 'inscription_validee':
        return { label: 'Inscription Définitive Validée', color: 'bg-emerald-700 text-white border-emerald-800', icon: Award };
      default:
        return { label: status, color: 'bg-slate-100 text-slate-800 border-slate-200', icon: Clock };
    }
  };

  const badge = getStatusBadge(application.status);
  const BadgeIcon = badge.icon;

  return (
    <div className="space-y-6">
      
      {/* Top Bar with Reference & Return Button */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCatalog}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Revenir au catalogue"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span className="font-bold text-slate-800">{application.referenceDossier}</span>
              <span>·</span>
              <span className="font-sans font-medium text-slate-600">
                {application.prenom} {application.nom}
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 mt-0.5">
              Suivi de Candidature au Doctorat
            </h1>
          </div>
        </div>

        <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 ${badge.color}`}>
          <BadgeIcon className="w-3.5 h-3.5" />
          <span>{badge.label}</span>
        </div>
      </div>

      {/* Progression Stepper */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
          État d'avancement de votre candidature
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-3 rounded-lg border bg-emerald-50 border-emerald-200 text-emerald-800">
            <span className="block font-bold">1. Dépôt du dossier</span>
            <span className="text-[11px] text-emerald-600 mt-0.5 block">Enregistré</span>
          </div>

          <div className={`p-3 rounded-lg border ${
            application.status === 'soumise' 
              ? 'bg-amber-50 border-amber-300 text-amber-800 font-bold'
              : application.status === 'rejetee_preselection'
                ? 'bg-rose-50 border-rose-300 text-rose-800 font-bold'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <span className="block font-bold">2. Présélection</span>
            <span className="text-[11px] mt-0.5 block">
              {application.status === 'rejetee_preselection' ? 'Non retenu' : 'Validée'}
            </span>
          </div>

          <div className={`p-3 rounded-lg border ${
            ['preselectionne', 'entretien_passe'].includes(application.status)
              ? 'bg-purple-50 border-purple-300 text-purple-900 font-bold'
              : ['admis', 'dossier_soumis', 'dossier_non_conforme', 'inscription_validee'].includes(application.status)
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <span className="block font-bold">3. Entretien Oral</span>
            <span className="text-[11px] mt-0.5 block">
              {application.status === 'preselectionne' ? 'Convoqué' : 'Évalué'}
            </span>
          </div>

          <div className={`p-3 rounded-lg border ${
            application.status === 'inscription_validee'
              ? 'bg-emerald-700 text-white font-bold'
              : ['admis', 'dossier_soumis', 'dossier_non_conforme'].includes(application.status)
                ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <span className="block font-bold">4. Inscription Finale</span>
            <span className="text-[11px] mt-0.5 block">
              {application.status === 'inscription_validee' ? 'Validée (Doctorant)' : 'En cours'}
            </span>
          </div>
        </div>
      </div>

      {/* Convocation Card if preselected */}
      {application.status === 'preselectionne' && application.entretien && (
        <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
            <Calendar className="w-5 h-5 text-purple-700" />
            <span>Convocation Officielle à l'Entretien Oral de Thèse</span>
          </div>
          <p className="text-xs text-purple-900">
            Votre dossier a été présélectionné par la commission. Veuillez vous présenter à la séance d'audition selon les modalités ci-dessous :
          </p>

          <div className="bg-white p-4 rounded-lg border border-purple-100 text-xs space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500 block">Date et heure :</span>
                <span className="font-bold text-slate-900">
                  {application.entretien.dateHeure ? new Date(application.entretien.dateHeure).toLocaleString('fr-FR') : 'Date communiquée sous 48h'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Lieu / Salle :</span>
                <span className="font-bold text-slate-900">
                  {application.entretien.lieuOuLien || 'Salle des Thèses du CEDoc'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Format :</span>
                <span className="font-semibold text-purple-700 uppercase">{application.entretien.mode}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Note de présélection sur dossier :</span>
                <span className="font-mono font-bold text-slate-900">{application.entretien.notesDossier || 17} / 20</span>
              </div>
            </div>

            {application.entretien.juryMembres && application.entretien.juryMembres.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-500 block text-[11px]">Membres du jury :</span>
                <p className="text-slate-700 font-medium">{application.entretien.juryMembres.join(' · ')}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admitted Card -> Administrative Kit Submission */}
      {application.status === 'admis' && (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Félicitations ! Vous êtes admis sur liste principale</span>
            </div>
            <span className="text-xs font-mono font-bold bg-white text-emerald-900 px-2.5 py-1 rounded border border-emerald-200">
              Avis : {application.entretien?.avisCommission || 'Très favorable'}
            </span>
          </div>

          <p className="text-xs text-emerald-900 leading-relaxed">
            Pour finaliser votre inscription au CEDoc, veuillez générer votre dossier administratif prérempli et soumettre les originaux pour vérification de conformité.
          </p>

          <div className="bg-white p-4 rounded-lg border border-emerald-200/80 text-xs space-y-1.5">
            <span className="font-bold text-slate-800 block mb-1">Pièces administratives à déposer :</span>
            <p className="text-slate-600">• Original du diplôme de Master ou d'Ingénieur et relevés certifiés conformes</p>
            <p className="text-slate-600">• Charte des thèses signée par l'encadrant et le doctorant</p>
            <p className="text-slate-600">• Quittance des droits d'inscription et attestation d'assurance</p>
          </div>

          <button
            onClick={handlePrepareAdminDossier}
            disabled={isPreFilling}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>{isPreFilling ? 'Transmission en cours...' : 'Transmettre mon dossier administratif à la scolarité'}</span>
          </button>
        </div>
      )}

      {/* Dossier Incomplet / Correction Required */}
      {application.status === 'dossier_non_conforme' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-amber-700" />
            <span>Dossier Incomplet · Demande de régularisation</span>
          </div>
          
          <div className="bg-white p-3.5 rounded-lg border border-amber-200 text-xs">
            <span className="font-bold text-slate-800 block">Remarque de l'administration :</span>
            <p className="text-amber-800 mt-1 italic">
              « {application.dossierAdministratif?.remarquesConformite || 'Document manquant ou illisible.'} »
            </p>
          </div>

          {!showCorrectionForm ? (
            <button
              onClick={() => setShowCorrectionForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Corriger et renvoyer les pièces</span>
            </button>
          ) : (
            <form onSubmit={handleSendCorrection} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Explications sur les documents régularisés :
                </label>
                <textarea
                  rows={3}
                  required
                  value={correctionNote}
                  onChange={e => setCorrectionNote(e.target.value)}
                  placeholder="Ex : Document original téléversé et quittance bancaire jointe."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Valider et retransmettre
                </button>
                <button
                  type="button"
                  onClick={() => setShowCorrectionForm(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:text-slate-800"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Inscription Validated Card */}
      {application.status === 'inscription_validee' && (
        <div className="bg-white border-2 border-emerald-500 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Inscription Définitive au Doctorat Validée
                </h2>
                <p className="text-xs text-emerald-700 font-medium">
                  Vous êtes officiellement doctorant(e) inscrit(e) au Centre d'Études Doctorales (CEDoc).
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 block uppercase">Matricule Officiel</span>
              <span className="text-sm font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded inline-block mt-0.5 border border-emerald-200">
                {application.dossierAdministratif?.matriculeAttribue || 'DOC-2026-MATH-0042'}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 text-xs space-y-2 border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-slate-400 block">Doctorant :</span>
                <span className="font-bold text-slate-800">{application.prenom} {application.nom}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Date de validation :</span>
                <span className="font-bold text-slate-800">{application.dossierAdministratif?.dateValidationAdmin || '27/10/2026'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Année Universitaire :</span>
                <span className="font-bold text-slate-800">2026 / 2027 (1ère Année)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer l'Attestation d'Inscription Officielle</span>
          </button>
        </div>
      )}

      {/* Applied Subjects */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Vœux de Sujets Enregistrés ({appliedSubjects.length} / 3)
        </h2>

        <div className="space-y-2.5">
          {appliedSubjects.map((sub, i) => {
            if (!sub) return null;
            return (
              <div key={sub.id || i} className="p-3.5 border border-slate-200 rounded-lg bg-slate-50/50 flex items-start justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2 font-mono text-slate-500 mb-1">
                    <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Choix n°{sub.priorite}
                    </span>
                    <span>·</span>
                    <span>{sub.code}</span>
                    <span>·</span>
                    <span className="text-emerald-800 font-sans font-medium">{sub.discipline}</span>
                  </div>
                  <h3 className="font-bold text-slate-900">{sub.titre}</h3>
                  <p className="text-[11px] text-slate-500 mt-1">{sub.laboratoire} · {sub.directeurThese}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
