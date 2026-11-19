import React, { useState } from 'react';
import { useDoctorat } from '../../context/DoctoratContext';
import { DoctoralReEnrollment } from '../../types';
import { 
  KeyRound, 
  FileEdit, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ArrowRight, 
  Printer, 
  Search,
  School,
  Building2,
  User,
  AlertCircle
} from 'lucide-react';
import { ActivityReportModal } from './ActivityReportModal';
import { ReinscriptionDetailsModal } from './ReinscriptionDetailsModal';

export const ReinscriptionView: React.FC = () => {
  const { 
    reinscriptions, 
    startNewReinscription 
  } = useDoctorat();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReinscription, setSelectedReinscription] = useState<DoctoralReEnrollment | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [newMatriculeInput, setNewMatriculeInput] = useState('');
  const [showNewDemandForm, setShowNewDemandForm] = useState(false);

  const filteredList = reinscriptions.filter(r => {
    const matchSearch = 
      r.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.matriculeDoctorant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.directeurThese.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.sujetThese.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const handleOpenReportModal = (item: DoctoralReEnrollment) => {
    setSelectedReinscription(item);
    setIsReportModalOpen(true);
  };

  const handleOpenDetails = (item: DoctoralReEnrollment) => {
    setSelectedReinscription(item);
    setIsDetailsModalOpen(true);
  };

  const handleStartDemand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatriculeInput) return;
    const res = startNewReinscription(newMatriculeInput);
    if (res.item) {
      setSelectedReinscription(res.item);
      setIsReportModalOpen(true);
      setShowNewDemandForm(false);
      setNewMatriculeInput('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Clean University Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Centre d'Études Doctorales (CEDoc)</span>
            <span>·</span>
            <span className="text-emerald-800 font-semibold">Campagne de Réinscription 2026/2027</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Espace Réinscription Annuelle
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Saisie du rapport d'avancement annuel, recueil des visas d'encadrement et renouvellement de l'inscription
          </p>
        </div>

        <button
          onClick={() => setShowNewDemandForm(!showNewDemandForm)}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouvelle Demande de Réinscription</span>
        </button>
      </div>

      {/* New demand inline panel */}
      {showNewDemandForm && (
        <form onSubmit={handleStartDemand} className="p-4 bg-white rounded-xl border border-emerald-300 shadow-2xs space-y-3">
          <h2 className="text-xs font-bold text-slate-900">
            Démarrer une réinscription (Année universitaire 2026/2027)
          </h2>
          <p className="text-[11px] text-slate-500">
            Renseignez votre matricule officiel doctorant (ex: <code>DOC-2025-LTISI-0019</code>) :
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              required
              placeholder="DOC-2025-XXXX-0000"
              value={newMatriculeInput}
              onChange={e => setNewMatriculeInput(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono outline-none focus:ring-2 focus:ring-emerald-600 w-64"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Ouvrir le dossier
            </button>
            <button
              type="button"
              onClick={() => setShowNewDemandForm(false)}
              className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Search & Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-2 bg-white p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-2xs">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Rechercher un doctorant par nom, matricule ou directeur..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs outline-none"
          />
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
          <div>
            <span className="text-slate-400 block text-[11px]">En cours de circuit :</span>
            <span className="font-bold text-slate-900 text-base font-mono">
              {reinscriptions.filter(r => r.status !== 'reinscription_validee').length}
            </span>
          </div>
          <Clock className="w-5 h-5 text-amber-500" />
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Réinscriptions Validées :</span>
            <span className="font-bold text-emerald-800 text-base font-mono">
              {reinscriptions.filter(r => r.status === 'reinscription_validee').length}
            </span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>
      </div>

      {/* High-Density Clean Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Dossiers de Réinscription Répertoriés ({filteredList.length})
          </h2>
          <span className="text-xs text-slate-400">
            Session d'automne 2026/2027
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredList.map((item) => {
            const isValidated = item.status === 'reinscription_validee';

            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left Info */}
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {item.matriculeDoctorant}
                    </span>
                    <span>·</span>
                    <span className="text-emerald-800 font-sans font-semibold">
                      Passage en {item.anneeTheseSollicitee}ème Année
                    </span>
                    <span>·</span>
                    <span className="text-slate-400">{item.anneeUniversitaire}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">
                    {item.prenom} {item.nom}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-1">
                    Thèse : <em>{item.sujetThese}</em>
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span>Directeur : <strong>{item.directeurThese}</strong></span>
                    <span>Labo : <strong>{item.laboratoire}</strong></span>
                    <span>Avancement : <strong className="font-mono text-slate-700">{item.rapportActivites.avancementPourcentage}%</strong></span>
                  </div>
                </div>

                {/* Right Status & Actions */}
                <div className="flex items-center gap-3 shrink-0 justify-between md:justify-end">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                    isValidated 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : item.status === 'pieces_non_conformes'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : item.status === 'rapport_en_cours'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-sky-50 text-sky-800 border-sky-200'
                  }`}>
                    {item.status === 'reinscription_validee' 
                      ? 'Réinscription Validée' 
                      : item.status === 'rapport_en_cours'
                        ? 'Rapport en rédaction'
                        : item.status === 'rapport_soumis'
                          ? 'Avis Directeur requis'
                          : item.status === 'avis_directeur_rendu'
                            ? 'Visa Labo requis'
                            : item.status === 'valide_laboratoire'
                              ? 'Confirmation CED requis'
                              : item.status === 'confirme_ced'
                                ? 'Contrôle Scolarité'
                                : item.status}
                  </span>

                  <div className="flex items-center gap-2">
                    {item.status === 'rapport_en_cours' && (
                      <button
                        onClick={() => handleOpenReportModal(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                        <span>Rédiger le rapport</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenDetails(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                    >
                      <span>Consulter</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {isValidated && (
                      <button
                        onClick={() => handleOpenDetails(item)}
                        className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded border border-emerald-200"
                        title="Imprimer l'attestation"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {selectedReinscription && (
        <>
          <ActivityReportModal
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
            reinscription={selectedReinscription}
          />

          <ReinscriptionDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            reinscription={selectedReinscription}
          />
        </>
      )}

    </div>
  );
};
