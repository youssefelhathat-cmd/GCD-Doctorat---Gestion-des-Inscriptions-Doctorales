import React, { useState } from 'react';
import { useDoctorat } from '../../context/DoctoratContext';
import { CandidateApplication, ThesisSubject, InterviewDetails } from '../../types';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  FileText, 
  Clock, 
  Building2, 
  GraduationCap,
  Plus
} from 'lucide-react';

export const CommissionView: React.FC = () => {
  const { 
    subjects, 
    applications, 
    proposeSubject, 
    preselectCandidate, 
    scheduleInterviewAndPv,
    reinscriptions,
    giveDirectorOpinion
  } = useDoctorat();

  const [activeTab, setActiveTab] = useState<'examiner' | 'proposer' | 'reinscription'>('examiner');
  const [selectedApp, setSelectedApp] = useState<CandidateApplication | null>(null);
  const [selectedReinscriptionId, setSelectedReinscriptionId] = useState<string>(reinscriptions[0]?.id || '');

  // State for director opinion form
  const [opinionDecision, setOpinionDecision] = useState<'Très favorable' | 'Favorable' | 'Réservé' | 'Défavorable'>('Très favorable');
  const [opinionAppreciation, setOpinionAppreciation] = useState<'Excellente' | 'Très bonne' | 'Satisfaisante' | 'Insuffisante'>('Très bonne');
  const [opinionComment, setOpinionComment] = useState('Travaux de recherche très rigoureux. Avancement satisfaisant conforme aux jalons fixés.');
  const [opinionSubmittedSuccess, setOpinionSubmittedSuccess] = useState(false);

  // Form state for proposing a subject
  const [titre, setTitre] = useState('');
  const [discipline, setDiscipline] = useState('Informatique & Intelligence Artificielle');
  const [laboratoire, setLaboratoire] = useState('Laboratoire des Technologies de l\'Information et Systèmes Intelligents (LTISI)');
  const [directeurThese, setDirecteurThese] = useState('Prof. Karim Bennani');
  const [coDirecteur, setCoDirecteur] = useState('');
  const [emailContact, setEmailContact] = useState('k.bennani@usmba.ac.ma');
  const [resume, setResume] = useState('');
  const [objectifsText, setObjectifsText] = useState('Modélisation formelle\nOptimisation algorithmique\nValidation sur jeu de données');
  const [prerequisText, setPrerequisText] = useState('Master Recherche ou Diplôme d\'Ingénieur\nBases solides en programmation et calcul scientifique');
  const [motsClesText, setMotsClesText] = useState('Machine Learning, Sûreté de fonctionnement, Optimisation');
  const [financement, setFinancement] = useState('Contrat Doctoral Université 2026 / Bourse d\'Excellence');
  const [placesDisponibles, setPlacesDisponibles] = useState(1);
  const [formSuccess, setFormSuccess] = useState(false);

  // Interview & PV form state
  const [interviewDate, setInterviewDate] = useState('2026-11-05T10:00');
  const [interviewPlace, setInterviewPlace] = useState('Salle des Thèses CEDoc');
  const [interviewMode, setInterviewMode] = useState<'présentiel' | 'visio'>('présentiel');
  const [juryMembres, setJuryMembres] = useState('Prof. Karim Bennani, Dr. Sofia Alami, Prof. Amina Chraibi');
  const [noteOral, setNoteOral] = useState<number>(17.5);
  const [avisCommission, setAvisCommission] = useState<'Très favorable' | 'Favorable' | 'Défavorable'>('Très favorable');
  const [pvCommentaire, setPvCommentaire] = useState('Candidat remarquable avec d\'excellentes dispositions méthodologiques.');
  const [decisionAdmission, setDecisionAdmission] = useState<'admis' | 'non_admis'>('admis');

  const pendingPreselection = applications.filter(a => ['soumise', 'en_examen'].includes(a.status));
  const pendingOral = applications.filter(a => a.status === 'preselectionne');
  const pendingReinscriptionAvis = reinscriptions.filter(r => r.status === 'rapport_soumis' || !r.avisDirecteur);

  const selectedReinscription = reinscriptions.find(r => r.id === selectedReinscriptionId) || reinscriptions[0];

  const handleProposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titre || !resume) return;

    proposeSubject({
      titre,
      discipline,
      laboratoire,
      directeurThese,
      coDirecteur: coDirecteur || undefined,
      emailContact,
      resume,
      objectifs: objectifsText.split('\n').filter(Boolean),
      prerequis: prerequisText.split('\n').filter(Boolean),
      motsCles: motsClesText.split(',').map(s => s.trim()).filter(Boolean),
      financement,
      placesDisponibles: Number(placesDisponibles)
    });

    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setTitre('');
      setResume('');
    }, 2500);
  };

  const handleSaveInterviewAndPv = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    const interviewData: InterviewDetails = {
      dateHeure: interviewDate,
      lieuOuLien: interviewPlace,
      mode: interviewMode,
      juryMembres: juryMembres.split(',').map(s => s.trim()),
      notesOral: Number(noteOral),
      avisCommission: avisCommission,
      pvCommentaire: pvCommentaire
    };

    scheduleInterviewAndPv(selectedApp.id, interviewData, decisionAdmission);
    setSelectedApp(null);
  };

  const handleSaveDirectorOpinion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReinscription) return;

    giveDirectorOpinion(selectedReinscription.id, {
      decision: opinionDecision,
      appreciationQualite: opinionAppreciation,
      commentairesEtRecommandations: opinionComment,
      dateAvis: new Date().toLocaleDateString('fr-FR'),
      delaiRespecte: true
    });

    setOpinionSubmittedSuccess(true);
    setTimeout(() => {
      setOpinionSubmittedSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Clean University Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Acteur : Professeur / Encadrant & Commission</span>
            <span>·</span>
            <span className="text-emerald-800 font-semibold">Couloir UML 3 & Débats 5, 6, 3</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Espace Enseignant-Chercheur & Commission de Thèse
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dépôt des offres de thèses, évaluation & oraux des candidatures, et avis sur les réinscriptions des doctorants.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => { setActiveTab('examiner'); setSelectedApp(null); }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'examiner'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Candidatures 1ère Année ({applications.length})</span>
            {pendingOral.length > 0 && (
              <span className="px-1 py-0.2 bg-amber-500 text-white text-[10px] rounded font-mono">
                {pendingOral.length} oral
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reinscription')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'reinscription'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Avis Réinscription ({reinscriptions.length})</span>
            {pendingReinscriptionAvis.length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-white text-[10px] rounded font-mono">
                {pendingReinscriptionAvis.length} à viser
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('proposer')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'proposer'
                ? 'bg-emerald-800 text-white'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Proposer un Sujet</span>
          </button>
        </div>
      </div>

      {activeTab === 'proposer' ? (
        /* Formulaire de proposition épuré */
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Proposer un Sujet de Thèse (Appel à Candidature 2026/2027)
            </h2>
            <p className="text-xs text-slate-500">
              Le sujet sera automatiquement soumis à la direction de votre laboratoire pour validation scientifique.
            </p>
          </div>

          {formSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sujet de thèse enregistré avec succès et transmis au directeur de laboratoire.</span>
            </div>
          )}

          <form onSubmit={handleProposeSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Intitulé du sujet de thèse *</label>
                <input
                  type="text"
                  required
                  value={titre}
                  onChange={e => setTitre(e.target.value)}
                  placeholder="Ex : Apprentissage Profond Hybride pour la Prédiction des Matériaux 2D..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Discipline</label>
                <select
                  value={discipline}
                  onChange={e => setDiscipline(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                >
                  <option value="Informatique & Intelligence Artificielle">Informatique & Intelligence Artificielle</option>
                  <option value="Génie Électrique & Énergies Renouvelables">Génie Électrique & Énergies Renouvelables</option>
                  <option value="Mathématiques Appliquées & Modélisation">Mathématiques Appliquées & Modélisation</option>
                  <option value="Biotechnologie & Génomique">Biotechnologie & Génomique</option>
                  <option value="Chimie & Science des Matériaux">Chimie & Science des Matériaux</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Laboratoire d'accueil</label>
                <input
                  type="text"
                  required
                  value={laboratoire}
                  onChange={e => setLaboratoire(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Directeur de thèse (HDR)</label>
                <input
                  type="text"
                  required
                  value={directeurThese}
                  onChange={e => setDirecteurThese(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email de contact</label>
                <input
                  type="email"
                  required
                  value={emailContact}
                  onChange={e => setEmailContact(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Financement envisagé</label>
                <input
                  type="text"
                  required
                  value={financement}
                  onChange={e => setFinancement(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Résumé scientifique du projet *</label>
                <textarea
                  rows={4}
                  required
                  value={resume}
                  onChange={e => setResume(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors"
              >
                Soumettre le sujet au laboratoire
              </button>
            </div>
          </form>
        </div>
      ) : activeTab === 'examiner' ? (
        /* Liste & Examen des candidatures */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Candidates List */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Candidats Postulants ({applications.length})
              </h2>
            </div>

            <div className="space-y-2">
              {applications.map(app => {
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
                      <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-700">
                        {app.status}
                      </span>
                    </div>

                    <p className="font-bold text-slate-900">{app.prenom} {app.nom}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{app.derniereFormation}</p>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-mono">
                      <span>Moyenne: <strong>{app.moyenneGenerale}/20</strong></span>
                      <span>Mention: {app.mentionMaster}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Application Detail & Decision Box */}
          <div className="lg:col-span-2">
            {selectedApp ? (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
                
                {/* Dossier Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
                      <span>Réf : {selectedApp.referenceDossier}</span>
                      <span>·</span>
                      <span>CIN : {selectedApp.cinOuPasseport}</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {selectedApp.prenom} {selectedApp.nom}
                    </h2>
                    <p className="text-xs text-slate-600 mt-1">
                      {selectedApp.derniereFormation} · {selectedApp.universiteOrigine}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-mono">Moyenne Master</span>
                    <span className="text-lg font-bold font-mono text-emerald-800">{selectedApp.moyenneGenerale} / 20</span>
                    <span className="text-[11px] text-slate-500 block">Mention {selectedApp.mentionMaster}</span>
                  </div>
                </div>

                {/* Vœux de thèse du candidat */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Choix de Sujets Exprimés
                  </h3>
                  <div className="space-y-2">
                    {selectedApp.choixSujets.map(cs => {
                      const s = subjects.find(sub => sub.id === cs.subjectId);
                      return (
                        <div key={cs.subjectId} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                          <span className="font-bold text-slate-900">Choix n°{cs.priorite} : </span>
                          <span className="text-slate-800 font-medium">{s?.titre || 'Sujet'}</span>
                          <p className="text-[11px] text-slate-500 mt-0.5">{s?.laboratoire} · Encadrant : {s?.directeurThese}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pièces justificatives déposées */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Documents Justificatifs
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                    <div className="p-2 border border-slate-200 rounded bg-slate-50 truncate flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{selectedApp.documentsDeposes.cvNom}</span>
                    </div>
                    <div className="p-2 border border-slate-200 rounded bg-slate-50 truncate flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{selectedApp.documentsDeposes.diplomeNom}</span>
                    </div>
                    <div className="p-2 border border-slate-200 rounded bg-slate-50 truncate flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{selectedApp.documentsDeposes.relevesNom}</span>
                    </div>
                    <div className="p-2 border border-slate-200 rounded bg-slate-50 truncate flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{selectedApp.documentsDeposes.lettreMotivationNom}</span>
                    </div>
                    <div className="p-2 border border-slate-200 rounded bg-slate-50 truncate flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{selectedApp.documentsDeposes.projetRechercheNom}</span>
                    </div>
                    <div className="p-2 border border-slate-200 rounded bg-slate-50 truncate flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{selectedApp.documentsDeposes.pieceIdentiteNom}</span>
                    </div>
                  </div>
                </div>

                {/* Phase 1 : Présélection */}
                {['soumise', 'en_examen'].includes(selectedApp.status) && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                    <h4 className="text-xs font-bold text-slate-900">
                      Décision de la Commission : Évaluation du Dossier
                    </h4>
                    <p className="text-xs text-slate-600">
                      Sur étude des relevés et de l'adéquation au profil de recherche, valider la convocation à l'entretien oral :
                    </p>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={() => preselectCandidate(selectedApp.id, true, 17)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Présélectionner pour l'entretien</span>
                      </button>

                      <button
                        onClick={() => preselectCandidate(selectedApp.id, false, undefined, 'Prérequis académiques non atteints')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Dossier non retenu</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Phase 2 : Entretien & PV officiel */}
                {selectedApp.status === 'preselectionne' && (
                  <form onSubmit={handleSaveInterviewAndPv} className="p-5 bg-purple-50/70 border border-purple-200 rounded-lg space-y-4 text-xs">
                    <h4 className="font-bold text-purple-950 uppercase tracking-wider">
                      Organisation de l'Entretien & Procès-Verbal (PV)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Date et heure de l'oral</label>
                        <input
                          type="datetime-local"
                          required
                          value={interviewDate}
                          onChange={e => setInterviewDate(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Lieu ou Lien visio</label>
                        <input
                          type="text"
                          required
                          value={interviewPlace}
                          onChange={e => setInterviewPlace(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 font-semibold mb-1">Composition du jury</label>
                        <input
                          type="text"
                          required
                          value={juryMembres}
                          onChange={e => setJuryMembres(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Note de l'oral (/20)</label>
                        <input
                          type="number"
                          step="0.5"
                          required
                          value={noteOral}
                          onChange={e => setNoteOral(parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Avis de la commission</label>
                        <select
                          value={avisCommission}
                          onChange={e => setAvisCommission(e.target.value as any)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-semibold"
                        >
                          <option value="Très favorable">Très favorable</option>
                          <option value="Favorable">Favorable</option>
                          <option value="Défavorable">Défavorable</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 font-semibold mb-1">Commentaires de délibération</label>
                        <textarea
                          rows={2}
                          required
                          value={pvCommentaire}
                          onChange={e => setPvCommentaire(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2 p-3 bg-white border border-purple-200 rounded-lg">
                        <label className="block font-bold text-slate-800 mb-1">Décision d'admission :</label>
                        <div className="flex items-center gap-6 mt-1">
                          <label className="flex items-center gap-2 cursor-pointer font-semibold text-emerald-800">
                            <input
                              type="radio"
                              name="admission"
                              checked={decisionAdmission === 'admis'}
                              onChange={() => setDecisionAdmission('admis')}
                            />
                            <span>Candidat Admis sur liste principale</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer font-semibold text-rose-800">
                            <input
                              type="radio"
                              name="admission"
                              checked={decisionAdmission === 'non_admis'}
                              onChange={() => setDecisionAdmission('non_admis')}
                            />
                            <span>Non Retenu</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs rounded-lg transition-colors"
                      >
                        Valider le PV & Enregistrer les Résultats
                      </button>
                    </div>
                  </form>
                )}

                {/* If processed */}
                {['admis', 'dossier_soumis', 'inscription_validee'].includes(selectedApp.status) && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900">
                    <p className="font-bold">Délibération validée : Candidat Admis</p>
                    <p className="mt-0.5 text-slate-600">
                      Note oral : {selectedApp.entretien?.notesOral}/20 · Avis : {selectedApp.entretien?.avisCommission}. Dossier transmis à la scolarité pour finalisation.
                    </p>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
                <Users className="w-10 h-10 mx-auto stroke-1 mb-2 text-slate-300" />
                <p className="text-sm font-semibold text-slate-700">Sélectionnez une candidature dans la liste</p>
                <p className="text-xs text-slate-500 mt-0.5">Examinez les pièces académiques et saisissez le PV d'audition.</p>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Volet Réinscription : Étape 3 Avis du Directeur de Thèse */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* List of Supervised Doctoral Students */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Doctorants Encadrés ({reinscriptions.length})
                </h2>
                <p className="text-[11px] text-slate-500">Étape 3 : Examen & Avis d'avancement</p>
              </div>
            </div>

            <div className="space-y-2">
              {reinscriptions.map(item => {
                const isSelected = selectedReinscription?.id === item.id;
                const hasAvis = Boolean(item.avisDirecteur);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedReinscriptionId(item.id);
                      if (item.avisDirecteur) {
                        setOpinionDecision(item.avisDirecteur.decision);
                        setOpinionAppreciation(item.avisDirecteur.appreciationQualite);
                        setOpinionComment(item.avisDirecteur.commentairesEtRecommandations);
                      }
                    }}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50 shadow-xs'
                        : 'border-slate-200/80 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[11px] font-bold text-slate-600">{item.matriculeDoctorant}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${
                        hasAvis
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {hasAvis ? 'Avis Rendu' : 'Avis Requis'}
                      </span>
                    </div>

                    <p className="font-semibold text-slate-900">{item.prenom} {item.nom}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      Passage en {item.anneeTheseSollicitee}ème Année
                    </p>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                      <span>Avancement : <strong className="font-mono text-slate-800">{item.rapportActivites.avancementPourcentage}%</strong></span>
                      <span className="text-slate-400 font-mono">{item.rapportActivites.formationsValideesHeures}h CED</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Report Details & Director Opinion Form */}
          <div className="lg:col-span-2">
            {selectedReinscription ? (
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-5">
                
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
                      <span className="font-bold text-slate-700">{selectedReinscription.matriculeDoctorant}</span>
                      <span>·</span>
                      <span className="text-slate-600 font-sans font-medium">Inscription en {selectedReinscription.anneeTheseSollicitee}ème Année</span>
                      <span>·</span>
                      <span>{selectedReinscription.anneeUniversitaire}</span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900">
                      {selectedReinscription.prenom} {selectedReinscription.nom}
                    </h2>
                    <p className="text-xs text-slate-600 mt-1 italic">
                      Sujet : « {selectedReinscription.sujetThese} »
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Taux d'avancement déclaré</span>
                    <span className="text-xl font-bold font-mono text-slate-900">{selectedReinscription.rapportActivites.avancementPourcentage}%</span>
                  </div>
                </div>

                {opinionSubmittedSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Avis d'encadrement officiellement enregistré et transmis à la Direction du Laboratoire.</span>
                  </div>
                )}

                {/* Report Content */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Rapport d'Activités de Recherche & Avancement
                  </h3>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 text-xs space-y-2">
                    <p className="text-slate-800 leading-relaxed font-medium">
                      {selectedReinscription.rapportActivites.resumeAvancement}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
                      <div>
                        <span className="font-semibold text-slate-700 block">Objectifs atteints cette année :</span>
                        <p className="text-slate-600">{selectedReinscription.rapportActivites.objectifsAtteints}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700 block">Difficultés & Actions correctives :</span>
                        <p className="text-slate-600">{selectedReinscription.rapportActivites.difficultesEtSolutions}</p>
                      </div>
                    </div>
                  </div>

                  {/* Publications & Formations */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg border border-slate-200/70 bg-white">
                      <span className="font-semibold text-slate-800 block mb-1">Publications & Conférences ({selectedReinscription.rapportActivites.publications.length})</span>
                      {selectedReinscription.rapportActivites.publications.length > 0 ? (
                        <ul className="space-y-1.5 text-[11px] text-slate-600">
                          {selectedReinscription.rapportActivites.publications.map((pub, idx) => (
                            <li key={idx} className="border-l-2 border-emerald-500 pl-2">
                              <span className="font-medium text-slate-900">{pub.titre}</span>
                              <p className="text-slate-500">{pub.revueOuConference} ({pub.indexation}, {pub.annee})</p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">Aucune publication indexée cette année.</p>
                      )}
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200/70 bg-white">
                      <span className="font-semibold text-slate-800 block mb-1">Formations Doctorales CEDoc</span>
                      <p className="text-slate-700 text-xs font-mono font-medium">
                        Volume validé : <strong className="text-slate-900">{selectedReinscription.rapportActivites.formationsValideesHeures} heures</strong> / 200h requises
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Soutenance estimée : <strong>{selectedReinscription.rapportActivites.calendrierPrevisionnelSoutenance}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Director Opinion Form (Tableau de débat Étape 3) */}
                <form onSubmit={handleSaveDirectorOpinion} className="p-4 rounded-lg bg-slate-50/80 border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs">
                      Saisie de l'Avis Officiel du Directeur de Thèse
                    </h4>
                    <span className="text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Délai réglementaire respecté
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Décision d'encadrement *</label>
                      <select
                        value={opinionDecision}
                        onChange={e => setOpinionDecision(e.target.value as any)}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-md bg-white font-medium text-slate-800 outline-none"
                      >
                        <option value="Très favorable">Très favorable (Reconduction sans réserve)</option>
                        <option value="Favorable">Favorable</option>
                        <option value="Réservé">Réservé (Mise en garde sur le rythme)</option>
                        <option value="Défavorable">Défavorable (Arrêt du cursus)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Appréciation qualitative *</label>
                      <select
                        value={opinionAppreciation}
                        onChange={e => setOpinionAppreciation(e.target.value as any)}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-md bg-white font-medium text-slate-800 outline-none"
                      >
                        <option value="Excellente">Excellente</option>
                        <option value="Très bonne">Très bonne</option>
                        <option value="Satisfaisante">Satisfaisante</option>
                        <option value="Insuffisante">Insuffisante</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-medium mb-1">Recommandations & Observations détaillées *</label>
                      <textarea
                        rows={2}
                        required
                        value={opinionComment}
                        onChange={e => setOpinionComment(e.target.value)}
                        placeholder="Précisez les objectifs prioritaires pour l'année universitaire..."
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-md bg-white outline-none focus:ring-1 focus:ring-slate-400"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-md shadow-xs transition-colors"
                    >
                      Signer et Transmettre l'Avis au Laboratoire
                    </button>
                  </div>
                </form>

              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center text-slate-400">
                <Clock className="w-10 h-10 mx-auto stroke-1 mb-2 text-slate-300" />
                <p className="text-sm font-semibold text-slate-700">Sélectionnez un doctorant pour examiner son rapport</p>
                <p className="text-xs text-slate-500 mt-0.5">Consultez l'avancement des travaux et formulez votre avis d'encadrement.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
