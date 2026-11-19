import React, { useState } from 'react';
import { useDoctorat } from '../context/DoctoratContext';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { Role } from '../types';

export const UmlDiagramViewer: React.FC = () => {
  const { 
    isDiagramModalOpen, 
    setIsDiagramModalOpen, 
    setRole,
    highlightedDiagramStep
  } = useDoctorat();

  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState<'diagram' | 'guide'>('diagram');

  if (!isDiagramModalOpen) return null;

  const navigateToStepRole = (targetRole: Role) => {
    setRole(targetRole);
    setIsDiagramModalOpen(false);
  };

  const stepsDetails = [
    {
      swimlane: 'Candidat (Jaune)',
      roleId: 'candidat' as Role,
      etapes: [
        { label: 'Rechercher des sujets (sans compte)', desc: 'Consultation libre du catalogue de thèses validées sans inscription préalable.' },
        { label: 'Consulter les détails des sujets', desc: 'Accès au résumé scientifique, objectifs, prérequis et profil d\'encadrement.' },
        { label: 'Ajouter des sujets au panier', desc: 'Sélection des sujets souhaités (classement par ordre de préférence).' },
        { label: 'Panier conforme ? (max 3 sujets)', desc: 'Règle stricte : si > 3 sujets, le candidat est renvoyé vers "Modifier le panier".' },
        { label: 'Compte existant ?', desc: 'Si Non -> Création de compte + Activation par email. Si Oui -> Connexion.' },
        { label: 'Compléter les informations et déposer les documents (une seule fois)', desc: 'Dossier unique : coordonnées, cursus, diplôme Master, relevés de notes, CV, projet.' },
        { label: 'Confirmer les choix et soumettre la candidature', desc: 'Validation définitive des 1 à 3 choix de thèses.' },
        { label: 'Passer l\'entretien', desc: 'Entretien oral devant le jury de commission.' },
        { label: 'Préparer les documents administratifs préremplis', desc: 'Si admis : constitution du dossier administratif officiel d\'inscription.' },
        { label: 'Corriger le dossier', desc: 'En cas de non-conformité administrative, régularisation des pièces demandées.' }
      ]
    },
    {
      swimlane: 'Plateforme GCD (Bleu)',
      roleId: 'plateforme_gcd' as Role,
      etapes: [
        { label: 'Publier les sujets validés', desc: 'Mise en ligne automatique dès confirmation par le Directeur du CED.' },
        { label: 'Modifier le panier', desc: 'Ajustement de la sélection pour respecter le quota des 3 sujets maximum.' },
        { label: 'Envoyer un email d\'activation', desc: 'Génération et expédition du lien unique d\'activation de compte.' },
        { label: 'Enregistrer la candidature (au maximum 3 sujets)', desc: 'Génération de la référence unique de candidature et transmission à la commission.' }
      ]
    },
    {
      swimlane: 'Professeur / Commission (Orange)',
      roleId: 'professeur' as Role,
      etapes: [
        { label: 'Proposer les sujets de thèse', desc: 'Saisie des nouveaux sujets par les enseignants-chercheurs encadrants.' },
        { label: 'Examiner les candidatures', desc: 'Évaluation des dossiers académiques reçus par sujet.' },
        { label: 'Candidat présélectionné ?', desc: 'Décision : Si Oui -> Convocation à l\'oral. Si Non -> Fin du processus.' },
        { label: 'Organiser l\'entretien et établir le PV', desc: 'Convocation, notation (dossier + oral) et rédaction du procès-verbal officiel.' },
        { label: 'Candidat admis ?', desc: 'Décision finale : Si Oui -> Inscription administrative. Si Non -> Rejet notifié.' }
      ]
    },
    {
      swimlane: 'Directeur du laboratoire (Vert)',
      roleId: 'directeur_labo' as Role,
      etapes: [
        { label: 'Valider les sujets de thèse', desc: 'Validation scientifique initiale et conformité aux axes de recherche de l\'unité.' },
        { label: 'Contrôler la capacité d\'accueil & quotas (Post-présélection)', desc: 'Vérification du ratio maximal de doctorants par professeur habilité (max 6) et délivrance du Visa d\'Accueil en laboratoire.' },
        { label: 'Visa de réinscription annuelle (Étape 4)', desc: 'Contrôle de l\'assiduité, moyens d\'expérimentation et avis sur le rapport d\'activité annuel.' }
      ]
    },
    {
      swimlane: 'Directeur du CED (Rose/Mauve)',
      roleId: 'directeur_ced' as Role,
      etapes: [
        { label: 'Confirmer la validation des sujets', desc: 'Homologation institutionnelle des sujets avant publication automatique sur la plateforme GCD.' },
        { label: 'Homologuer les listes d\'admission (Post-entretien)', desc: 'Centralisation des PV de commissions, arbitrage des quotas de bourses doctorales et autorisation officielle de transmission à la Scolarité.' },
        { label: 'Confirmation de réinscription (Étape 5)', desc: 'Validation académique définitive de passage en année supérieure et dérogations.' }
      ]
    },
    {
      swimlane: 'Administration / Scolarité (Violet clair)',
      roleId: 'administration' as Role,
      etapes: [
        { label: 'Notifier la non-admission', desc: 'Notification officielle par email transmise aux candidats non retenus après délibération.' },
        { label: 'Recevoir le dossier administratif prérempli', desc: 'Réception des pièces justificatives originales (Diplôme Master, relevés S1-S4, charte signée, assurance, quittance).' },
        { label: 'Dossier conforme ? (Contrôle des originaux)', desc: 'Si Non -> Renvoi au candidat avec motif précis ("Corriger le dossier"). Si Oui -> Validation finale.' },
        { label: 'Valider l\'inscription définitive', desc: 'Attribution du numéro d\'apogée / matricule doctorant officiel et délivrance de l\'attestation d\'inscription.' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Diagramme d'Activité UML · Cycle d'Inscription en Doctorat
              </h2>
              <p className="text-xs text-slate-500">
                Visualisation des 6 couloirs d'activités (Swimlanes) et des points de décision
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white rounded-lg p-0.5 border border-slate-200 text-xs">
              <button
                onClick={() => setActiveTab('diagram')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeTab === 'diagram' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Diagramme Image UML
              </button>
              <button
                onClick={() => setActiveTab('guide')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeTab === 'guide' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Matrice des Rôles & Décisions
              </button>
            </div>

            <button
              onClick={() => setIsDiagramModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/60">
          {activeTab === 'diagram' ? (
            <div className="flex flex-col items-center">
              {/* Zoom controls */}
              <div className="sticky top-0 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs mb-4">
                <button
                  onClick={() => setZoom(prev => Math.max(0.6, prev - 0.15))}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                  title="Zoom Arrière"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-medium text-slate-600 w-12 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom(prev => Math.min(2.0, prev + 0.15))}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                  title="Zoom Avant"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded ml-1"
                  title="Taille Normale"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-slate-200 mx-1" />

                <span className="text-xs text-slate-500">
                  L'application implémente fidèlement chaque étape de ce diagramme
                </span>
              </div>

              {/* Real Diagram Image from workspace assets */}
              <div 
                className="overflow-auto max-w-full rounded-lg border border-slate-200 bg-white p-2 shadow-sm transition-transform duration-150 origin-top"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
              >
                <img
                  src="/assets/aistudio/French_UML_Activity_Diagram_Swimlanes_402d9e79.png"
                  alt="French UML Activity Diagram Swimlanes"
                  className="w-full max-w-4xl h-auto object-contain mx-auto"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stepsDetails.map((col, idx) => (
                <div key={idx} className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        {col.swimlane}
                      </h3>
                      <button
                        onClick={() => navigateToStepRole(col.roleId)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                      >
                        Basculer
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <ul className="space-y-3 text-xs">
                      {col.etapes.map((step, sIdx) => (
                        <li key={sIdx} className="border-l-2 border-slate-200 pl-2.5">
                          <p className="font-semibold text-slate-900">{step.label}</p>
                          <p className="text-slate-500 text-[11px] mt-0.5">{step.desc}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => navigateToStepRole(col.roleId)}
                      className="w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded border border-slate-200 transition-colors text-center"
                    >
                      Ouvrir l'Espace {col.swimlane.split(' ')[0]}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Architecture 100% conforme à la chaîne d'activités : Panier (max 3) → Enregistrement GCD → Examen → Entretien & PV → Dossier Admin → Inscription</span>
          </div>
          <button
            onClick={() => setIsDiagramModalOpen(false)}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
