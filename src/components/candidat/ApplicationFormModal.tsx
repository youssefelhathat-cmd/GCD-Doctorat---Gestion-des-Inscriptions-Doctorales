import React, { useState } from 'react';
import { useDoctorat } from '../../context/DoctoratContext';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  GraduationCap, 
  User, 
  Files,
  Award
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

export const ApplicationFormModal: React.FC<Props> = ({ isOpen, onClose, onSubmitted }) => {
  const { cart, subjects, user, submitApplication } = useDoctorat();

  const [step, setStep] = useState<1 | 2>(1); // 1 = Infos & Documents, 2 = Confirmer les choix (priorités 1..3)

  // Candidate Profile fields
  const [nom, setNom] = useState(user?.nom || 'El Amrani');
  const [prenom, setPrenom] = useState(user?.prenom || 'Salma');
  const [email, setEmail] = useState(user?.email || 'salma.elamrani@gmail.com');
  const [telephone, setTelephone] = useState('+212 6 61 24 55 89');
  const [cinOuPasseport, setCinOuPasseport] = useState('BK718293');
  const [dateNaissance, setDateNaissance] = useState('1999-05-14');
  const [nationalite, setNationalite] = useState('Marocaine');
  
  // Academic cursus
  const [derniereFormation, setDerniereFormation] = useState('Master Recherche en Informatique & Big Data');
  const [universiteOrigine, setUniversiteOrigine] = useState('Faculté des Sciences, Rabat');
  const [mentionMaster, setMentionMaster] = useState('Très Bien');
  const [moyenneGenerale, setMoyenneGenerale] = useState<number>(16.85);

  // Documents
  const [cvFile, setCvFile] = useState('CV_Detaille_2026.pdf');
  const [diplomeFile, setDiplomeFile] = useState('Diplome_Master_ou_Attestation.pdf');
  const [relevesFile, setRelevesFile] = useState('Releves_Notes_S1_S4.pdf');
  const [lettreFile, setLettreFile] = useState('Lettre_Motivation_These.pdf');
  const [projetFile, setProjetFile] = useState('Avant_Projet_Recherche.pdf');
  const [cinFile, setCinFile] = useState('Copie_CIN_ou_Passeport.pdf');

  if (!isOpen) return null;

  const cartSubjects = cart.map(id => subjects.find(s => s.id === id)).filter(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = submitApplication({
      nom,
      prenom,
      email,
      telephone,
      cinOuPasseport,
      dateNaissance,
      nationalite,
      derniereFormation,
      universiteOrigine,
      mentionMaster,
      moyenneGenerale: Number(moyenneGenerale),
      documents: {
        cvNom: cvFile,
        diplomeNom: diplomeFile,
        relevesNom: relevesFile,
        lettreMotivationNom: lettreFile,
        projetRechercheNom: projetFile,
        pieceIdentiteNom: cinFile
      }
    });

    if (res.success) {
      onSubmitted();
      onClose();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold mb-1">
              <span>Étape du Diagramme UML</span>
              <span>·</span>
              <span>Compléter les informations et déposer les documents</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Dossier de Candidature au Doctorat (Dépôt Unique)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Tab */}
        <div className="border-b border-slate-200 bg-white px-6 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 font-medium ${
                step === 1 ? 'text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1' : 'text-slate-500'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-[11px]">1</span>
              <span>1. Informations & Dépôt des Pièces (Une seule fois)</span>
            </button>
            <button
              onClick={() => setStep(2)}
              className={`flex items-center gap-2 font-medium ${
                step === 2 ? 'text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1' : 'text-slate-500'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-[11px]">2</span>
              <span>2. Confirmer les Choix (Max 3 sujets)</span>
            </button>
          </div>

          <span className="text-slate-400 text-[11px]">
            {cart.length} sujet(s) dans le panier
          </span>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {step === 1 ? (
            <div className="space-y-6">
              
              {/* Identité */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-slate-500" />
                  <span>1. État Civil & Coordonnées du Candidat</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Nom</label>
                    <input 
                      type="text" 
                      required 
                      value={nom} 
                      onChange={e => setNom(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Prénom</label>
                    <input 
                      type="text" 
                      required 
                      value={prenom} 
                      onChange={e => setPrenom(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">CIN ou N° Passeport</label>
                    <input 
                      type="text" 
                      required 
                      value={cinOuPasseport} 
                      onChange={e => setCinOuPasseport(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500 uppercase" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Date de naissance</label>
                    <input 
                      type="date" 
                      required 
                      value={dateNaissance} 
                      onChange={e => setDateNaissance(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Nationalité</label>
                    <input 
                      type="text" 
                      required 
                      value={nationalite} 
                      onChange={e => setNationalite(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Téléphone de contact</label>
                    <input 
                      type="text" 
                      required 
                      value={telephone} 
                      onChange={e => setTelephone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500 font-mono" 
                    />
                  </div>
                </div>
              </div>

              {/* Cursus Académique */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 mb-3">
                  <GraduationCap className="w-4 h-4 text-slate-500" />
                  <span>2. Cursus Universitaire & Dernier Diplôme Obtenu</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-medium mb-1">Intitulé du Master / Diplôme d'Ingénieur</label>
                    <input 
                      type="text" 
                      required 
                      value={derniereFormation} 
                      onChange={e => setDerniereFormation(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Établissement / Université d'origine</label>
                    <input 
                      type="text" 
                      required 
                      value={universiteOrigine} 
                      onChange={e => setUniversiteOrigine(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Mention</label>
                      <select 
                        value={mentionMaster} 
                        onChange={e => setMentionMaster(e.target.value)}
                        className="w-full px-2.5 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="Très Bien">Très Bien</option>
                        <option value="Bien">Bien</option>
                        <option value="Assez Bien">Assez Bien</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Moyenne (/20)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        required 
                        value={moyenneGenerale} 
                        onChange={e => setMoyenneGenerale(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500 font-mono" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dépôt des pièces jointes obligatoires */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 mb-1">
                  <Files className="w-4 h-4 text-slate-500" />
                  <span>3. Pièces Justificatives Numérisées (Déposées une seule fois)</span>
                </h3>
                <p className="text-[11px] text-slate-500 mb-3">
                  Ces documents seront transmis automatiquement aux commissions des sujets sélectionnés dans votre panier.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  
                  <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/70 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div className="truncate">
                        <p className="font-semibold text-slate-800">Curriculum Vitae détaillé</p>
                        <p className="text-slate-500 text-[11px] font-mono truncate">{cvFile}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-medium shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Prêt
                    </span>
                  </div>

                  <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/70 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div className="truncate">
                        <p className="font-semibold text-slate-800">Diplôme ou Attestation Master</p>
                        <p className="text-slate-500 text-[11px] font-mono truncate">{diplomeFile}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-medium shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Prêt
                    </span>
                  </div>

                  <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/70 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div className="truncate">
                        <p className="font-semibold text-slate-800">Relevés de notes officiels (S1-S4)</p>
                        <p className="text-slate-500 text-[11px] font-mono truncate">{relevesFile}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-medium shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Prêt
                    </span>
                  </div>

                  <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/70 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div className="truncate">
                        <p className="font-semibold text-slate-800">Lettre de motivation</p>
                        <p className="text-slate-500 text-[11px] font-mono truncate">{lettreFile}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-medium shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Prêt
                    </span>
                  </div>

                  <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/70 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div className="truncate">
                        <p className="font-semibold text-slate-800">Avant-projet de recherche</p>
                        <p className="text-slate-500 text-[11px] font-mono truncate">{projetFile}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-medium shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Prêt
                    </span>
                  </div>

                  <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/70 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div className="truncate">
                        <p className="font-semibold text-slate-800">Copie CIN ou Passeport légalisée</p>
                        <p className="text-slate-500 text-[11px] font-mono truncate">{cinFile}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-medium shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Prêt
                    </span>
                  </div>

                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                <strong>Confirmation des vœux de thèse (Maximum 3) :</strong>
                <p className="mt-1">
                  Selon le diagramme UML, l'enregistrement de votre candidature transmettra vos vœux classés à la commission d'examen.
                </p>
              </div>

              <div className="space-y-3">
                {cartSubjects.map((s, idx) => {
                  if (!s) return null;
                  return (
                    <div key={s.id} className="p-4 border border-slate-200 rounded-lg bg-white shadow-2xs flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-0.5">
                            <span className="font-semibold text-slate-700">Priorité n°{idx + 1}</span>
                            <span>·</span>
                            <span>{s.code}</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900">{s.titre}</h4>
                          <p className="text-[11px] text-slate-500 mt-1">{s.laboratoire} · {s.directeurThese}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded shrink-0">
                        Prêt pour soumission
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
                <p className="font-semibold text-slate-800">Engagement du candidat :</p>
                <p className="text-slate-600 text-[11px]">
                  Je certifie sur l'honneur l'exactitude des renseignements fournis et l'authenticité des pièces justificatives jointes à ce dossier. Je m'engage à me présenter à l'entretien si ma candidature est présélectionnée.
                </p>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            {step === 1 ? (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Annuler
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                ← Revenir aux informations
              </button>
            )}

            {step === 1 ? (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                <span>Vérifier et ordonner mes choix</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmer les choix et soumettre la candidature (GCD)</span>
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
};
