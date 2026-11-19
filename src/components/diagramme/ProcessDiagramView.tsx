import React, { useState } from 'react';
import { useDoctorat } from '../../context/DoctoratContext';
import { Role } from '../../types';
import { DEBATE_MATRICES } from '../../data/conceptionData';
import { 
  Workflow, 
  Table, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  ExternalLink,
  Search,
  ShoppingBag,
  UserCheck,
  FileCheck,
  Send,
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface DiagramActivityNode {
  id: string;
  swimlane: Role;
  swimlaneLabel: string;
  titre: string;
  type: 'action' | 'decision';
  descriptionCourte: string;
  regleCle: string;
  solutionGCD: string;
}

export const ProcessDiagramView: React.FC = () => {
  const { setRole, setPortalMode, auditLogs } = useDoctorat();

  const [activeSubTab, setActiveSubTab] = useState<'swimlanes' | 'debat_inscription' | 'debat_reinscription'>('swimlanes');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('act_recherche');

  const SWIMLANES: { role: Role; label: string; bgLane: string; border: string; tag: string }[] = [
    { role: 'candidat', label: 'Candidat', bgLane: 'bg-amber-50/15', border: 'border-slate-200', tag: 'bg-slate-50 text-slate-700 font-medium border-b border-slate-200' },
    { role: 'plateforme_gcd', label: 'Plateforme GCD', bgLane: 'bg-sky-50/15', border: 'border-slate-200', tag: 'bg-slate-50 text-slate-700 font-medium border-b border-slate-200' },
    { role: 'professeur', label: 'Professeur / Commission', bgLane: 'bg-amber-50/15', border: 'border-slate-200', tag: 'bg-slate-50 text-slate-700 font-medium border-b border-slate-200' },
    { role: 'directeur_labo', label: 'Directeur Laboratoire', bgLane: 'bg-emerald-50/15', border: 'border-slate-200', tag: 'bg-slate-50 text-slate-700 font-medium border-b border-slate-200' },
    { role: 'directeur_ced', label: 'Directeur CEDoc', bgLane: 'bg-indigo-50/15', border: 'border-slate-200', tag: 'bg-slate-50 text-slate-700 font-medium border-b border-slate-200' },
    { role: 'administration', label: 'Administration', bgLane: 'bg-slate-50/30', border: 'border-slate-200', tag: 'bg-slate-50 text-slate-700 font-medium border-b border-slate-200' }
  ];

  // Concised nodes - zero text overload
  const ACTIVITIES: DiagramActivityNode[] = [
    // Professeur
    {
      id: 'act_proposer_sujets',
      swimlane: 'professeur',
      swimlaneLabel: 'Professeur / Commission',
      titre: 'Proposer les sujets de thèse',
      type: 'action',
      descriptionCourte: 'Dépôt des offres doctorales et axes de recherche.',
      regleCle: 'Rattachement obligatoire à une équipe accréditée.',
      solutionGCD: 'Saisie standardisée en ligne avec contrôle des prérequis.'
    },
    // Directeur Labo
    {
      id: 'act_valider_labo',
      swimlane: 'directeur_labo',
      swimlaneLabel: 'Directeur Laboratoire',
      titre: 'Valider les sujets de thèse',
      type: 'action',
      descriptionCourte: 'Validation de faisabilité et adéquation des moyens.',
      regleCle: 'Avis du labo requis avant transmission au CEDoc.',
      solutionGCD: 'Validation dématérialisée en 1 clic.'
    },
    // Directeur CED
    {
      id: 'act_confirmer_ced',
      swimlane: 'directeur_ced',
      swimlaneLabel: 'Directeur CEDoc',
      titre: 'Confirmer la validation des sujets',
      type: 'action',
      descriptionCourte: 'Homologation officielle de l\'offre doctorale.',
      regleCle: 'Autorise la publication au catalogue public.',
      solutionGCD: 'Vue globale et arbitrage centralisé de la campagne.'
    },
    // Plateforme GCD
    {
      id: 'act_publier_gcd',
      swimlane: 'plateforme_gcd',
      swimlaneLabel: 'Plateforme GCD',
      titre: 'Publier les sujets validés',
      type: 'action',
      descriptionCourte: 'Mise en ligne du catalogue officiel des thèses.',
      regleCle: 'Consultable par tous sans compte requis.',
      solutionGCD: 'Moteur de recherche et filtres par discipline.'
    },
    // Candidat
    {
      id: 'act_recherche',
      swimlane: 'candidat',
      swimlaneLabel: 'Candidat',
      titre: 'Rechercher des sujets (sans compte)',
      type: 'action',
      descriptionCourte: 'Consultation libre des offres et équipes de recherche.',
      regleCle: 'Accès public libre et immédiat.',
      solutionGCD: 'Fiches descriptives complètes avec contacts.'
    },
    {
      id: 'act_ajouter_panier',
      swimlane: 'candidat',
      swimlaneLabel: 'Candidat',
      titre: 'Ajouter au panier (max 3 sujets)',
      type: 'action',
      descriptionCourte: 'Sélection ordonnée de 1 à 3 sujets prioritaires.',
      regleCle: 'Limite stricte de 3 vœux maximum par candidat.',
      solutionGCD: 'Contrôle automatique du panier avant validation.'
    },
    {
      id: 'dec_panier_conforme',
      swimlane: 'candidat',
      swimlaneLabel: 'Candidat',
      titre: 'Panier conforme ? (≤ 3)',
      type: 'decision',
      descriptionCourte: 'Contrôle du respect du plafond de 3 vœux.',
      regleCle: 'Si > 3 : demande de modification du panier.',
      solutionGCD: 'Bloquant automatique évitant la surcharge.'
    },
    {
      id: 'act_creer_activer_compte',
      swimlane: 'candidat',
      swimlaneLabel: 'Candidat',
      titre: 'Créer & Activer son compte',
      type: 'action',
      descriptionCourte: 'Création du compte et validation par email.',
      regleCle: 'Compte activé après sélection du panier.',
      solutionGCD: 'Lien d\'activation sécurisé automatique par courriel.'
    },
    {
      id: 'act_depot_dossier_unique',
      swimlane: 'candidat',
      swimlaneLabel: 'Candidat',
      titre: 'Dépôt unique des pièces justificatives',
      type: 'action',
      descriptionCourte: 'Téléversement unique du Master, relevés et CV.',
      regleCle: 'Dossier mutualisé pour les 3 choix exprimés.',
      solutionGCD: 'Élimination des dossiers multiples en triple exemplaire.'
    },
    {
      id: 'act_enregistrer_gcd',
      swimlane: 'plateforme_gcd',
      swimlaneLabel: 'Plateforme GCD',
      titre: 'Enregistrer la candidature',
      type: 'action',
      descriptionCourte: 'Horodatage et attribution d\'une référence unique.',
      regleCle: 'Verrouillage du dossier pour examen commission.',
      solutionGCD: 'Attribution automatique d\'un code DOS-2026-XXXX.'
    },
    // Commission
    {
      id: 'act_examiner_commission',
      swimlane: 'professeur',
      swimlaneLabel: 'Professeur / Commission',
      titre: 'Examiner & Présélectionner',
      type: 'action',
      descriptionCourte: 'Évaluation académique et notation sur dossier.',
      regleCle: 'Seules les notes conformes accèdent à l\'oral.',
      solutionGCD: 'Grille d\'évaluation standardisée en ligne.'
    },
    {
      id: 'dec_preselection',
      swimlane: 'professeur',
      swimlaneLabel: 'Professeur / Commission',
      titre: 'Candidat présélectionné ?',
      type: 'decision',
      descriptionCourte: 'Décision d\'admissibilité pour l\'entretien oral.',
      regleCle: 'Si Oui : convocation orale. Si Non : arrêt du parcours.',
      solutionGCD: 'Notification transparente de la décision.'
    },
    {
      id: 'act_entretien_pv',
      swimlane: 'professeur',
      swimlaneLabel: 'Professeur / Commission',
      titre: 'Entretien oral & Signature du PV',
      type: 'action',
      descriptionCourte: 'Audition du candidat et procès-verbal délibéré.',
      regleCle: 'PV officiel avec mention de la liste d\'admission.',
      solutionGCD: 'PV numérique signé avec note d\'oral et avis.'
    },
    {
      id: 'dec_admis',
      swimlane: 'professeur',
      swimlaneLabel: 'Professeur / Commission',
      titre: 'Candidat admis ?',
      type: 'decision',
      descriptionCourte: 'Décision finale du jury de thèse.',
      regleCle: 'Si Non : notification non-admission. Si Oui : dossier admin.',
      solutionGCD: 'Délibération immédiate transmise à l\'administration.'
    },
    // Administration
    {
      id: 'act_controle_admin',
      swimlane: 'administration',
      swimlaneLabel: 'Administration',
      titre: 'Contrôle des pièces & originaux',
      type: 'action',
      descriptionCourte: 'Vérification diplôme Master, quittance et assurance.',
      regleCle: 'Vérification physique ou certifiée des pièces.',
      solutionGCD: 'Checklist de conformité avec signalement précis.'
    },
    {
      id: 'dec_dossier_conforme',
      swimlane: 'administration',
      swimlaneLabel: 'Administration',
      titre: 'Dossier conforme ?',
      type: 'decision',
      descriptionCourte: 'Validation de l\'intégrité des pièces administratives.',
      regleCle: 'Si Non : correction demandée. Si Oui : inscription finale.',
      solutionGCD: 'Boucle de régularisation avec prolongation possible.'
    },
    {
      id: 'act_inscription_matricule',
      swimlane: 'administration',
      swimlaneLabel: 'Administration',
      titre: 'Validation finale & Matricule officiel',
      type: 'action',
      descriptionCourte: 'Attribution du matricule officiel et certificat final.',
      regleCle: 'Clôture de l\'inscription au cycle doctoral.',
      solutionGCD: 'Attestation officielle téléchargeable avec QR-Code.'
    }
  ];

  const selectedNode = ACTIVITIES.find(a => a.id === selectedNodeId) || ACTIVITIES[0];
  const logsCount = auditLogs.filter(l => l.tacheNom.toLowerCase().includes(selectedNode.titre.toLowerCase()) || l.details.toLowerCase().includes(selectedNode.titre.toLowerCase())).length;

  return (
    <div className="space-y-5">
      
      {/* Header bar - clean & compact */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Workflow className="w-4 h-4 text-emerald-700" />
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Diagramme des Flux & Activités UML
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Architecture 6 couloirs (Swimlanes) et points de décision conditionnels
          </p>
        </div>

        {/* Tab switcher */}
        <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1 border border-slate-200 text-xs">
          <button
            onClick={() => setActiveSubTab('swimlanes')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeSubTab === 'swimlanes'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Diagramme 6 Couloirs
          </button>
          <button
            onClick={() => setActiveSubTab('debat_inscription')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeSubTab === 'debat_inscription'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Débat Inscription
          </button>
          <button
            onClick={() => setActiveSubTab('debat_reinscription')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeSubTab === 'debat_reinscription'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Débat Réinscription
          </button>
        </div>
      </div>

      {/* SUBTAB 1: SWIMLANES GRID */}
      {activeSubTab === 'swimlanes' && (
        <div className="space-y-4">
          
          {/* Visual Swimlanes Container */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            
            {/* Headers */}
            <div className="grid grid-cols-2 md:grid-cols-6 border-b border-slate-200 divide-x divide-slate-200 text-center text-xs font-semibold">
              {SWIMLANES.map(s => (
                <div key={s.role} className={`py-2 px-2 ${s.tag}`}>
                  {s.label}
                </div>
              ))}
            </div>

            {/* Swimlanes columns */}
            <div className="grid grid-cols-2 md:grid-cols-6 divide-x divide-slate-200 min-h-[460px] text-xs">
              {SWIMLANES.map(lane => {
                const laneNodes = ACTIVITIES.filter(a => a.swimlane === lane.role);

                return (
                  <div key={lane.role} className={`p-2.5 space-y-2.5 ${lane.bgLane}`}>
                    {laneNodes.map(node => {
                      const isSelected = selectedNodeId === node.id;
                      const isDecision = node.type === 'decision';

                      return (
                        <div
                          key={node.id}
                          onClick={() => setSelectedNodeId(node.id)}
                          className={`cursor-pointer p-2.5 rounded-lg border transition-all text-left ${
                            isDecision
                              ? isSelected
                                ? 'bg-amber-50/90 border-amber-500 text-amber-950 shadow-xs ring-1 ring-amber-400 font-semibold'
                                : 'bg-white border-amber-200/80 text-amber-900 hover:border-amber-300'
                              : isSelected
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-1 ring-slate-800'
                                : 'bg-white text-slate-800 border-slate-200/80 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className={`text-[10px] font-medium tracking-tight px-1.5 py-0.5 rounded ${
                              isDecision 
                                ? 'bg-amber-100/70 text-amber-900' 
                                : isSelected 
                                  ? 'bg-slate-800 text-slate-300' 
                                  : 'bg-slate-100 text-slate-600'
                            }`}>
                              {isDecision ? 'Décision' : 'Étape'}
                            </span>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                          </div>

                          <p className={`font-semibold text-xs leading-snug ${isSelected && !isDecision ? 'text-white' : ''}`}>
                            {node.titre}
                          </p>

                          <p className={`text-[11px] mt-0.5 line-clamp-1 ${isSelected && !isDecision ? 'text-slate-300' : 'text-slate-500'}`}>
                            {node.descriptionCourte}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* COMPACT INSPECTOR - LIGHTWEIGHT & INFORMATIVE */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                    selectedNode.type === 'decision'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {selectedNode.type === 'decision' ? 'Losange de Décision' : 'Activité Métier'}
                  </span>
                  <h3 className="font-semibold text-sm text-slate-900">
                    {selectedNode.titre}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Responsable : <span className="font-medium text-slate-800">{selectedNode.swimlaneLabel}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setRole(selectedNode.swimlane);
                    setPortalMode('inscription');
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Accéder à l'espace rôle</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50/60 border border-slate-200/70">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Rôle & Action</span>
                <p className="text-slate-700 leading-relaxed">{selectedNode.descriptionCourte}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50/60 border border-slate-200/70">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Règle de Gestion</span>
                <p className="text-slate-800 font-medium leading-relaxed">{selectedNode.regleCle}</p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/40 border border-emerald-200/60">
                <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wide block mb-1">Solution Numérique GCD</span>
                <p className="text-emerald-950 leading-relaxed">{selectedNode.solutionGCD}</p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Traces enregistrées dans le journal d'audit : <strong className="text-slate-800">{logsCount}</strong></span>
              <button
                onClick={() => setPortalMode('journalisation')}
                className="text-slate-700 hover:text-slate-950 font-medium flex items-center gap-1"
              >
                <span>Consulter la journalisation</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 2 & 3: DÉBATS ACTEURS - SCANNABLE & CLEAN */}
      {(activeSubTab === 'debat_inscription' || activeSubTab === 'debat_reinscription') && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {(() => {
            const matrix = activeSubTab === 'debat_inscription' ? DEBATE_MATRICES.inscription : DEBATE_MATRICES.reinscription;

            return (
              <div>
                <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      {matrix.titre}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Synthèse des 7 étapes · Comparatif processus physique vs solution informatique
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    7 Étapes Clés
                  </span>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {matrix.etapes.map(step => (
                    <div key={step.numeroEtape} className="p-4 hover:bg-slate-50/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center">
                            {step.numeroEtape}
                          </span>
                          <h3 className="font-bold text-slate-900 text-sm">
                            {step.titreEtape}
                          </h3>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {step.casUtilisation[0]}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                        <div className="p-2.5 rounded-lg bg-amber-50/30 border border-amber-200/60">
                          <span className="text-[10px] font-bold text-amber-800 uppercase block mb-1">Processus Manuel :</span>
                          <p className="text-slate-700">{step.processusPhysique.join(' · ')}</p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-rose-50/30 border border-rose-200/60">
                          <span className="text-[10px] font-bold text-rose-800 uppercase block mb-1">Problème Résolu :</span>
                          <p className="text-rose-900">{step.problemesRencontres.join(' · ')}</p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-emerald-50/40 border border-emerald-200/60">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">Solution Numérique GCD :</span>
                          <p className="text-emerald-950 font-medium">{step.solutionsInformatiques.join(' · ')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

    </div>
  );
};
