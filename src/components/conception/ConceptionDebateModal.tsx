import React, { useState } from 'react';
import { useDoctorat } from '../../context/DoctoratContext';
import { SYNTHESE_INSCRIPTION, SYNTHESE_REINSCRIPTION } from '../../data/conceptionData';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Laptop, 
  Users, 
  ArrowRight,
  GitBranch,
  BookOpen,
  RotateCw,
  Search,
  Filter
} from 'lucide-react';
import { Role, PortalMode } from '../../types';

export const ConceptionDebateModal: React.FC = () => {
  const { 
    isDiagramModalOpen, 
    setIsDiagramModalOpen,
    conceptionTab,
    setConceptionTab,
    setRole,
    setPortalMode
  } = useDoctorat();

  const [zoom, setZoom] = useState(1);
  const [searchFilter, setSearchFilter] = useState('');

  if (!isDiagramModalOpen) return null;

  const activeMatrix = conceptionTab === 'inscription' ? SYNTHESE_INSCRIPTION : SYNTHESE_REINSCRIPTION;

  const filteredSteps = activeMatrix.etapes.filter(step => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      step.titreEtape.toLowerCase().includes(q) ||
      step.problemesRencontres.some(p => p.toLowerCase().includes(q)) ||
      step.solutionsInformatiques.some(s => s.toLowerCase().includes(q)) ||
      step.casUtilisation.some(c => c.toLowerCase().includes(q))
    );
  });

  const jumpToLiveSolution = (targetRole: Role, targetMode: PortalMode) => {
    setRole(targetRole);
    setPortalMode(targetMode);
    setIsDiagramModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[94vh] flex flex-col border border-slate-200 overflow-hidden animate-in fade-in duration-150">
        
        {/* Header Modal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              GCD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Dossier de Conception & Débat des Acteurs
                </h2>
                <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded">
                  Spécifications Officielles
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Diagramme d'Activité UML & Tableaux de Synthèse (Inscription vs Réinscription)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Tabs */}
            <div className="flex items-center bg-white rounded-lg p-0.5 border border-slate-200 text-xs shadow-2xs">
              <button
                onClick={() => setConceptionTab('inscription')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  conceptionTab === 'inscription' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Débat Inscription (1ère Année)
              </button>
              <button
                onClick={() => setConceptionTab('reinscription')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  conceptionTab === 'reinscription' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Débat Réinscription (2e/3e Année)
              </button>
              <button
                onClick={() => setConceptionTab('uml')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  conceptionTab === 'uml' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3. Diagramme UML Swimlanes
              </button>
            </div>

            <button
              onClick={() => setIsDiagramModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Overview Banner */}
        <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {conceptionTab !== 'uml' ? (
            <>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="font-bold text-slate-900">{activeMatrix.titre}</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 italic max-w-xl truncate">« {activeMatrix.objectifGlobal} »</span>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Filtrer étape, problème, solution..."
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 text-xs border border-slate-200 rounded-md outline-none focus:border-indigo-500"
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-slate-600 font-medium">
                Diagramme d'activité officiel à 6 couloirs (Candidat, Plateforme GCD, Professeur, Directeur Labo, Directeur CED, Administration)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setZoom(prev => Math.max(0.6, prev - 0.15))}
                  className="p-1 text-slate-600 hover:bg-slate-100 rounded"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="font-mono text-slate-600 text-[11px] w-10 text-center">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoom(prev => Math.min(2.0, prev + 0.15))}
                  className="p-1 text-slate-600 hover:bg-slate-100 rounded"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="p-1 text-slate-600 hover:bg-slate-100 rounded"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/50">
          
          {conceptionTab === 'uml' ? (
            /* UML Diagram Image */
            <div className="flex flex-col items-center">
              <div 
                className="overflow-auto max-w-full rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-transform duration-150 origin-top"
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
            /* Two Actor Debate Synthesis Tables */
            <div className="space-y-4">
              
              {/* Table header guide */}
              <div className="hidden lg:grid grid-cols-12 gap-3 px-4 py-2.5 bg-slate-200/80 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-700">
                <div className="col-span-2">1. Étape & Nom</div>
                <div className="col-span-2">2. Cas d'utilisation</div>
                <div className="col-span-2">3. Processus physique</div>
                <div className="col-span-2">4. Processus numérique GCD</div>
                <div className="col-span-2">5. Problèmes & Réponses</div>
                <div className="col-span-2 text-right">6. Solution Informatique</div>
              </div>

              {/* Rows */}
              <div className="space-y-3">
                {filteredSteps.map((step) => {
                  const targetRole = step.correspondanceApplication.roleLie;
                  const targetMode = activeMatrix.type;

                  return (
                    <div 
                      key={step.numeroEtape}
                      className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all space-y-3"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
                        
                        {/* Col 1 : Étape */}
                        <div className="lg:col-span-2 flex items-start gap-3">
                          <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                            {step.numeroEtape}
                          </span>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                              Étape {step.numeroEtape}
                            </span>
                            <h3 className="font-bold text-slate-900 text-sm leading-snug">
                              {step.titreEtape}
                            </h3>
                          </div>
                        </div>

                        {/* Col 2 : Cas d'utilisation */}
                        <div className="lg:col-span-2 space-y-1">
                          <span className="lg:hidden text-[11px] font-bold text-slate-400 block uppercase">Cas d'utilisation :</span>
                          <ul className="space-y-1 text-slate-700">
                            {step.casUtilisation.map((cu, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-indigo-600 font-bold">•</span>
                                <span>{cu}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Col 3 : Processus physique */}
                        <div className="lg:col-span-2 space-y-1 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                          <span className="text-[10px] font-bold text-amber-800 uppercase block tracking-wider">Manuel (Avant) :</span>
                          <ul className="space-y-1 text-slate-600">
                            {step.processusPhysique.map((pp, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-amber-600">•</span>
                                <span>{pp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Col 4 : Processus numérique */}
                        <div className="lg:col-span-2 space-y-1 bg-sky-50/50 p-2.5 rounded-lg border border-sky-100">
                          <span className="text-[10px] font-bold text-sky-800 uppercase block tracking-wider">Numérique GCD :</span>
                          <ul className="space-y-1 text-slate-700 font-medium">
                            {step.processusNumerique.map((pn, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-sky-600 font-bold">✓</span>
                                <span>{pn}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Col 5 : Problèmes rencontrés & Solution organisationnelle */}
                        <div className="lg:col-span-2 space-y-2">
                          <div className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-800">
                            <span className="text-[10px] font-bold uppercase block text-rose-900">Problème soulevé :</span>
                            <ul className="text-[11px] space-y-0.5 mt-0.5">
                              {step.problemesRencontres.map((pr, idx) => (
                                <li key={idx}>⚠ {pr}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-2 rounded bg-blue-50 border border-blue-200 text-blue-900">
                            <span className="text-[10px] font-bold uppercase block text-blue-900">Solution orga :</span>
                            <ul className="text-[11px] space-y-0.5 mt-0.5">
                              {step.solutionsOrganisationnelles.map((so, idx) => (
                                <li key={idx}>💡 {so}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Col 6 : Solution informatique dans l'App */}
                        <div className="lg:col-span-2 flex flex-col justify-between space-y-3 p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-200">
                          <div>
                            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px] mb-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Implémenté dans l'App</span>
                            </div>
                            <ul className="space-y-1 text-slate-800 font-semibold text-[11px]">
                              {step.solutionsInformatiques.map((si, idx) => (
                                <li key={idx}>⚡ {si}</li>
                              ))}
                            </ul>
                          </div>

                          <button
                            onClick={() => jumpToLiveSolution(targetRole, targetMode)}
                            className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded text-[11px] font-bold shadow-2xs transition-colors"
                          >
                            <span>Tester dans l'App</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              Conception validée : Diagramme d'activité UML + Synthèse Inscription (7 étapes) + Synthèse Réinscription (7 étapes).
            </span>
          </div>

          <button
            onClick={() => setIsDiagramModalOpen(false)}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
