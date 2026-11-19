import React, { useState } from 'react';
import { useDoctorat } from '../../context/DoctoratContext';
import { 
  CandidateApplication, 
  CandidatureMilestone 
} from '../../types';
import { 
  CalendarClock, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  User, 
  Edit3, 
  LayoutList,
  BarChart2,
  Info,
  CalendarCheck
} from 'lucide-react';

export const CandidatureProgressionView: React.FC = () => {
  const { applications, prolongMilestoneDate } = useDoctorat();

  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [viewMode, setViewMode] = useState<'tableau' | 'graphique'>('tableau');
  const [isProlongModalOpen, setIsProlongModalOpen] = useState(false);
  const [targetMilestoneCode, setTargetMilestoneCode] = useState<CandidatureMilestone['code']>('entretien');
  const [newDateInput, setNewDateInput] = useState('10/11/2026');
  const [motifInput, setMotifInput] = useState('Mission officielle du rapporteur principal. Décalage convenu en commission.');
  const [authorInput, setAuthorInput] = useState('Commission Doctorale');

  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0];

  if (!selectedApp) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        Aucune candidature enregistrée pour le moment.
      </div>
    );
  }

  const milestones: CandidatureMilestone[] = selectedApp.jalons || [
    {
      code: 'depot',
      nomEtape: '1. Dépôt & Choix de sujets (max 3)',
      statut: 'termine',
      dateInitiale: '18/10/2026',
      datePrevueOuEffective: '18/10/2026',
      estProlongee: false
    },
    {
      code: 'preselection',
      nomEtape: '2. Examen des dossiers & Présélection',
      statut: selectedApp.status === 'soumise' ? 'en_cours' : 'termine',
      dateInitiale: '22/10/2026',
      datePrevueOuEffective: '22/10/2026',
      estProlongee: false
    },
    {
      code: 'entretien',
      nomEtape: '3. Entretien oral & Délibération PV',
      statut: selectedApp.status === 'preselectionne' ? 'en_cours' : selectedApp.status === 'admis' || selectedApp.status === 'inscription_validee' ? 'termine' : 'a_venir',
      dateInitiale: '26/10/2026',
      datePrevueOuEffective: '04/11/2026',
      estProlongee: true,
      motifProlongation: 'Mission officielle du rapporteur principal à l\'étranger.',
      auteurProlongation: 'Commission Doctorale',
      dateProlongation: '24/10/2026'
    },
    {
      code: 'dossier_admin',
      nomEtape: '4. Vérification pièces administratives',
      statut: selectedApp.status === 'dossier_soumis' ? 'en_cours' : selectedApp.status === 'inscription_validee' ? 'termine' : 'a_venir',
      dateInitiale: '08/11/2026',
      datePrevueOuEffective: '12/11/2026',
      estProlongee: false
    },
    {
      code: 'validation_finale',
      nomEtape: '5. Inscription définitive & Matricule',
      statut: selectedApp.status === 'inscription_validee' ? 'termine' : 'a_venir',
      dateInitiale: '15/11/2026',
      datePrevueOuEffective: '18/11/2026',
      estProlongee: false
    }
  ];

  const handleOpenProlong = (code?: CandidatureMilestone['code']) => {
    if (code) setTargetMilestoneCode(code);
    const target = milestones.find(m => m.code === (code || targetMilestoneCode));
    if (target) {
      setNewDateInput(target.datePrevueOuEffective);
      setMotifInput(target.motifProlongation || 'Report accordé suite à délibération de la commission.');
    }
    setIsProlongModalOpen(true);
  };

  const handleSaveProlongation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDateInput || !motifInput) return;

    prolongMilestoneDate(
      selectedApp.id,
      targetMilestoneCode,
      newDateInput,
      motifInput,
      authorInput
    );
    setIsProlongModalOpen(false);
  };

  const hasProlongedDate = milestones.some(m => m.estProlongee);

  return (
    <div className="space-y-5">
      
      {/* Header bar - clean & compact */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-emerald-700" />
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Progression & Suivi des Échéances
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi des 5 jalons du cycle doctoral · Visualisation immédiate des dates prolongées
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1 border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('tableau')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'tableau'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Tableau</span>
            </button>
            <button
              onClick={() => setViewMode('graphique')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'graphique'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>
          </div>

          <button
            onClick={() => handleOpenProlong()}
            className="px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-xs transition-colors flex items-center gap-1.5"
          >
            <CalendarClock className="w-3.5 h-3.5" />
            <span>Prolonger une date</span>
          </button>
        </div>
      </div>

      {/* Candidate strip - calm, readable */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
            {selectedApp.prenom.charAt(0)}{selectedApp.nom.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">
                {selectedApp.prenom} {selectedApp.nom}
              </span>
              <span className="font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                {selectedApp.referenceDossier}
              </span>
              <span className="font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px] border border-slate-200">
                {selectedApp.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-slate-500 text-[11px] mt-0.5">
              {selectedApp.derniereFormation} · Note : {selectedApp.moyenneGenerale}/20
            </p>
          </div>
        </div>

        {/* Candidate selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Dossier :</span>
          <select
            value={selectedApp.id}
            onChange={(e) => setSelectedAppId(e.target.value)}
            className="border border-slate-200 rounded-md px-2.5 py-1 bg-white font-medium text-slate-700 text-xs focus:ring-1 focus:ring-slate-400 outline-none"
          >
            {applications.map(app => (
              <option key={app.id} value={app.id}>
                {app.nom} {app.prenom} ({app.referenceDossier})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW 1: TABLEAU - CLEAR, BREATHABLE */}
      {viewMode === 'tableau' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Jalon d'Admission</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Date Initiale</th>
                  <th className="px-4 py-3">Date Prévue / Révisée</th>
                  <th className="px-4 py-3">Détail du Report (si prolongé)</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {milestones.map((jalon) => {
                  const isDone = jalon.statut === 'termine';
                  const isInProgress = jalon.statut === 'en_cours';

                  return (
                    <tr 
                      key={jalon.code} 
                      className={`hover:bg-slate-50/70 transition-colors ${
                        jalon.estProlongee ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Name */}
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {jalon.nomEtape}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-200/70">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Effectué
                          </span>
                        ) : isInProgress ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            <Clock className="w-3 h-3 text-slate-500" />
                            En cours
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            À venir
                          </span>
                        )}
                      </td>

                      {/* Initial Date */}
                      <td className="px-4 py-3 font-mono text-slate-500">
                        {jalon.estProlongee ? (
                          <span className="line-through text-slate-400">
                            {jalon.dateInitiale}
                          </span>
                        ) : (
                          <span>{jalon.dateInitiale}</span>
                        )}
                      </td>

                      {/* Revised Date */}
                      <td className="px-4 py-3 font-mono">
                        {jalon.estProlongee ? (
                          <span className="font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">
                            {jalon.datePrevueOuEffective}
                          </span>
                        ) : (
                          <span className="font-medium text-slate-800">
                            {jalon.datePrevueOuEffective}
                          </span>
                        )}
                      </td>

                      {/* Report / Motive */}
                      <td className="px-4 py-3 max-w-xs">
                        {jalon.estProlongee ? (
                          <div>
                            <span className="inline-block text-[10px] font-medium text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mb-0.5">
                              Date Prolongée
                            </span>
                            <p className="text-slate-600 text-[11px] italic">
                              "{jalon.motifProlongation}"
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleOpenProlong(jalon.code)}
                          className="text-xs font-medium text-slate-700 hover:text-slate-950 hover:underline"
                        >
                          Modifier
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: TIMELINE - COMPACT & VISUAL */}
      {viewMode === 'graphique' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">Déroulement des 5 Étapes</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-600" /> Validé</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500" /> Date Prolongée</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-slate-300" /> À venir</span>
            </div>
          </div>

          <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {milestones.map((jalon, idx) => {
              const isDone = jalon.statut === 'termine';
              const isInProgress = jalon.statut === 'en_cours';

              return (
                <div key={jalon.code} className="relative flex items-start gap-3">
                  {/* Node icon */}
                  <div className={`absolute -left-7 mt-0.5 w-6 h-6 rounded-md flex items-center justify-center font-semibold text-xs ring-4 ring-white shadow-xs ${
                    jalon.estProlongee 
                      ? 'bg-amber-600 text-white'
                      : isDone
                        ? 'bg-emerald-700 text-white'
                        : isInProgress
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    {jalon.estProlongee ? (
                      <CalendarClock className="w-3.5 h-3.5" />
                    ) : isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      idx + 1
                    )}
                  </div>

                  {/* Card */}
                  <div className={`flex-1 rounded-lg p-3.5 border transition-all ${
                    jalon.estProlongee
                      ? 'bg-amber-50/20 border-amber-200/80'
                      : isInProgress
                        ? 'bg-slate-50/50 border-slate-300'
                        : 'bg-white border-slate-200/80'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{jalon.nomEtape}</span>
                        {jalon.estProlongee && (
                          <span className="text-[10px] font-medium text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Date Prolongée
                          </span>
                        )}
                      </div>

                      {/* Dates */}
                      <div className="font-mono text-xs">
                        {jalon.estProlongee ? (
                          <div className="flex items-center gap-1.5">
                            <span className="line-through text-slate-400">{jalon.dateInitiale}</span>
                            <ArrowRight className="w-3 h-3 text-amber-600" />
                            <span className="font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              {jalon.datePrevueOuEffective}
                            </span>
                          </div>
                        ) : (
                          <span className="font-medium text-slate-800">{jalon.datePrevueOuEffective}</span>
                        )}
                      </div>
                    </div>

                    {jalon.estProlongee && (
                      <p className="mt-2 text-[11px] text-slate-600 italic border-l-2 border-amber-400 pl-2">
                        Motif : {jalon.motifProlongation} (Par {jalon.auteurProlongation})
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PROLONG MODAL */}
      {isProlongModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Ajuster ou Prolonger une Échéance
                </h3>
              </div>
              <button
                onClick={() => setIsProlongModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProlongation} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jalon ciblé :</label>
                <select
                  value={targetMilestoneCode}
                  onChange={(e) => {
                    const code = e.target.value as CandidatureMilestone['code'];
                    setTargetMilestoneCode(code);
                    const target = milestones.find(m => m.code === code);
                    if (target) setNewDateInput(target.datePrevueOuEffective);
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white text-slate-800 focus:outline-emerald-600"
                >
                  {milestones.map(m => (
                    <option key={m.code} value={m.code}>
                      {m.nomEtape}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nouvelle date limite :</label>
                <input
                  type="text"
                  required
                  placeholder="JJ/MM/AAAA"
                  value={newDateInput}
                  onChange={(e) => setNewDateInput(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono text-slate-900 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Motif du report :</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Justification réglementaire..."
                  value={motifInput}
                  onChange={(e) => setMotifInput(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Autorité signataire :</label>
                <input
                  type="text"
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-emerald-600"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProlongModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Enregistrer le report</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
