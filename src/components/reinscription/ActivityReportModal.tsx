import React, { useState } from 'react';
import { useDoctorat } from '../../context/DoctoratContext';
import { DoctoralReEnrollment, ActivityReportPublication, ActivityReport } from '../../types';
import { 
  X, 
  Trash2, 
  CheckCircle2, 
  Plus
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reinscription: DoctoralReEnrollment;
}

export const ActivityReportModal: React.FC<Props> = ({ isOpen, onClose, reinscription }) => {
  const { submitActivityReport } = useDoctorat();

  const [avancementPourcentage, setAvancementPourcentage] = useState<number>(
    reinscription.rapportActivites.avancementPourcentage || 50
  );
  const [resumeAvancement, setResumeAvancement] = useState(
    reinscription.rapportActivites.resumeAvancement || 
    'Poursuite des travaux expérimentaux et simulations numériques relatives aux verrous identifiés l\'année précédente.'
  );
  const [objectifsAtteints, setObjectifsAtteints] = useState(
    reinscription.rapportActivites.objectifsAtteints || 
    '1. Formulation théorique validée.\n2. Élaboration du prototype de test.\n3. Rédaction d\'un premier manuscrit d\'article.'
  );
  const [difficultesEtSolutions, setDifficultesEtSolutions] = useState(
    reinscription.rapportActivites.difficultesEtSolutions || 
    'Contrainte d\'accès aux serveurs de calcul résolue par allocation d\'un compte HPC universitaire.'
  );
  const [formationsValideesHeures, setFormationsValideesHeures] = useState<number>(
    reinscription.rapportActivites.formationsValideesHeures || 60
  );
  const [participationsCongres, setParticipationsCongres] = useState(
    reinscription.rapportActivites.participationsCongres || 
    'Participation aux Doctoriales et présentation d\'un poster scientifique.'
  );
  const [calendrierPrevisionnelSoutenance, setCalendrierPrevisionnelSoutenance] = useState(
    reinscription.rapportActivites.calendrierPrevisionnelSoutenance || 'Fin 2027 / Début 2028'
  );

  const [publications, setPublications] = useState<ActivityReportPublication[]>(
    reinscription.rapportActivites.publications.length > 0
      ? reinscription.rapportActivites.publications
      : [
          {
            titre: 'Analyse Prédictive et Robustesse des Modèles Distribués',
            revueOuConference: 'Revue Internationale des Systèmes Avancés',
            statut: 'Soumis',
            indexation: 'Scopus Q1',
            annee: 2026
          }
        ]
  );

  const [newPubTitre, setNewPubTitre] = useState('');
  const [newPubRevue, setNewPubRevue] = useState('');
  const [newPubStatut, setNewPubStatut] = useState<'Publié' | 'Accepté' | 'Soumis' | 'En révision'>('Soumis');
  const [newPubIndex, setNewPubIndex] = useState('Scopus Q1 / Q2');

  if (!isOpen) return null;

  const handleAddPublication = () => {
    if (!newPubTitre || !newPubRevue) return;
    setPublications(prev => [
      ...prev,
      {
        titre: newPubTitre,
        revueOuConference: newPubRevue,
        statut: newPubStatut,
        indexation: newPubIndex,
        annee: 2026
      }
    ]);
    setNewPubTitre('');
    setNewPubRevue('');
  };

  const handleRemovePublication = (index: number) => {
    setPublications(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reportData: ActivityReport = {
      anneeCible: reinscription.anneeTheseSollicitee,
      avancementPourcentage: Number(avancementPourcentage),
      resumeAvancement,
      objectifsAtteints,
      difficultesEtSolutions,
      publications,
      formationsValideesHeures: Number(formationsValideesHeures),
      participationsCongres,
      calendrierPrevisionnelSoutenance
    };

    submitActivityReport(reinscription.id, reportData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
              <span>Rapport d'État d'Avancement des Travaux</span>
              <span>·</span>
              <span className="text-emerald-700 font-semibold">Demande de Réinscription {reinscription.anneeTheseSollicitee}ème Année</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-snug">
              {reinscription.prenom} {reinscription.nom}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Matricule : <code className="font-mono">{reinscription.matriculeDoctorant}</code> · Directeur : {reinscription.directeurThese}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guided Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          
          {/* 1. Avancement global */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 text-xs">
                1. Taux d'avancement global estimé de la thèse
              </label>
              <span className="font-mono text-base font-bold text-emerald-800 bg-white px-3 py-0.5 rounded border border-slate-200">
                {avancementPourcentage}%
              </span>
            </div>

            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={avancementPourcentage}
              onChange={e => setAvancementPourcentage(parseInt(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>Démarrage (20%)</span>
              <span>Mi-parcours (50%)</span>
              <span>Rédaction avancée (80%)</span>
              <span>Prêt pour soutenance (100%)</span>
            </div>
          </div>

          {/* 2. Résumé de l'avancement */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              2. Synthèse des travaux de recherche réalisés durant l'année écoulée *
            </label>
            <textarea
              rows={3}
              required
              value={resumeAvancement}
              onChange={e => setResumeAvancement(e.target.value)}
              placeholder="Décrivez les résultats obtenus, expérimentations, modélisations..."
              className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
            />
          </div>

          {/* 3. Objectifs & Difficultés */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                3. Objectifs scientifiques atteints *
              </label>
              <textarea
                rows={3}
                required
                value={objectifsAtteints}
                onChange={e => setObjectifsAtteints(e.target.value)}
                placeholder="Verrous levés, prototypes ou validations (un par ligne)..."
                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                4. Difficultés et solutions apportées
              </label>
              <textarea
                rows={3}
                value={difficultesEtSolutions}
                onChange={e => setDifficultesEtSolutions(e.target.value)}
                placeholder="Ressources matérielles, approvisionnements, simulations..."
                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
              />
            </div>
          </div>

          {/* 4. Publications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-xs">
                  5. Production scientifique (Articles indexés Scopus/WoS, Brevets, Conférences)
                </h3>
              </div>
              <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                {publications.length} publication(s)
              </span>
            </div>

            <div className="space-y-2">
              {publications.map((pub, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3">
                  <div className="truncate">
                    <p className="font-bold text-slate-900 truncate">{pub.titre}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {pub.revueOuConference} · <span className="font-medium text-slate-700">{pub.indexation}</span> · Statut : <strong>{pub.statut}</strong> ({pub.annee})
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePublication(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    title="Retirer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Publication Box */}
            <div className="p-3 bg-white border border-dashed border-slate-300 rounded-lg space-y-2.5">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                + Ajouter une publication
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Titre de l'article ou de la communication"
                  value={newPubTitre}
                  onChange={e => setNewPubTitre(e.target.value)}
                  className="sm:col-span-2 px-2.5 py-1.5 border border-slate-200 rounded text-xs outline-none"
                />
                <input
                  type="text"
                  placeholder="Nom de la revue / conférence"
                  value={newPubRevue}
                  onChange={e => setNewPubRevue(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-200 rounded text-xs outline-none"
                />
                <select
                  value={newPubStatut}
                  onChange={e => setNewPubStatut(e.target.value as any)}
                  className="px-2 py-1.5 border border-slate-200 rounded text-xs bg-white"
                >
                  <option value="Publié">Publié</option>
                  <option value="Accepté">Accepté</option>
                  <option value="Soumis">Soumis</option>
                  <option value="En révision">En révision</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddPublication}
                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          {/* 5. Formations doctorales & Calendrier de soutenance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                6. Formations Doctorales CEDoc validées (Heures cumulées)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  max={250}
                  value={formationsValideesHeures}
                  onChange={e => setFormationsValideesHeures(parseInt(e.target.value) || 0)}
                  className="w-24 px-3 py-2 border border-slate-200 rounded-lg font-mono text-sm font-bold text-slate-900"
                />
                <span className="text-slate-500 text-[11px]">
                  / 200 heures exigées par le CEDoc
                </span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                7. Date prévisionnelle de soutenance *
              </label>
              <input
                type="text"
                required
                value={calendrierPrevisionnelSoutenance}
                onChange={e => setCalendrierPrevisionnelSoutenance(e.target.value)}
                placeholder="Ex : Juin / Juillet 2027"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
              />
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Soumettre le Rapport d'Activités</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
