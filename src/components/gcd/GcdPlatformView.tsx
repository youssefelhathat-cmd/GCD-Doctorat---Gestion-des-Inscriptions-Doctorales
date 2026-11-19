import React from 'react';
import { useDoctorat } from '../../context/DoctoratContext';
import { 
  Server, 
  Send, 
  ShoppingBag, 
  Globe, 
  FileCheck2, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  RotateCw,
  GitBranch
} from 'lucide-react';

export const GcdPlatformView: React.FC = () => {
  const { 
    subjects, 
    applications, 
    cart, 
    pendingActivationEmail,
    setIsDiagramModalOpen 
  } = useDoctorat();

  const publishedSubjects = subjects.filter(s => s.status === 'confirme_ced');

  return (
    <div className="space-y-6">
      
      {/* Swimlane Header Banner */}
      <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            2
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-950">
              <span className="uppercase tracking-wider">Couloir UML : Plateforme GCD</span>
              <span className="text-sky-400">·</span>
              <span className="text-sky-700 font-normal">
                Publier les sujets validés · Modifier le panier · Envoyer un email d'activation · Enregistrer la candidature
              </span>
            </div>
            <p className="text-xs text-sky-800 mt-0.5">
              Moteur d'orchestration central du cursus doctoral assurant les contrôles d'invariants, la diffusion des offres et le routage des dossiers.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDiagramModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-sky-300 rounded-lg text-xs font-semibold text-sky-900 hover:bg-sky-100 transition-colors"
        >
          <GitBranch className="w-3.5 h-3.5 text-sky-600" />
          <span>Voir Interactions UML</span>
        </button>
      </div>

      {/* 4 Pillars of Plateforme GCD matching the 4 tasks in the UML swimlane */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Task 1: Publier les sujets validés */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <Globe className="w-4 h-4 text-sky-600" />
            <span>1. Publier les sujets validés</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Intervient immédiatement après que le <strong>Directeur du CED</strong> a confirmé la validation d'un sujet. La plateforme GCD le rend consultable publiquement par tout candidat sans obligation de compte.
          </p>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs flex items-center justify-between font-mono">
            <span>Sujets actuellement publiés :</span>
            <span className="font-bold text-sky-700">{publishedSubjects.length} offre(s)</span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Statut du flux : <strong>Auto-sync actif</strong></span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">En ligne</span>
          </div>
        </div>

        {/* Task 2: Modifier le panier */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <ShoppingBag className="w-4 h-4 text-amber-600" />
            <span>2. Modifier le panier</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Se déclenche quand la décision <em>"Panier conforme ? (max 3 sujets)"</em> renvoie <strong>Non</strong>. La plateforme GCD applique la contrainte stricte de 3 sujets maximum et permet de réordonner les priorités 1, 2 et 3.
          </p>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs flex items-center justify-between font-mono">
            <span>Règle d'intégrité :</span>
            <span className="font-bold text-slate-800">1 ≤ N_sujets ≤ 3</span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Vœux en session : <strong>{cart.length} sélectionné(s)</strong></span>
            <span className={`px-2 py-0.5 rounded font-medium ${cart.length <= 3 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
              {cart.length <= 3 ? 'Conforme (≤ 3)' : 'Bloqué (> 3)'}
            </span>
          </div>
        </div>

        {/* Task 3: Envoyer un email d'activation */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <Mail className="w-4 h-4 text-indigo-600" />
            <span>3. Envoyer un email d'activation</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Lorsque la décision <em>"Compte existant ?"</em> est <strong>Non</strong> et que le candidat soumet le formulaire <em>"Créer un compte"</em>, la plateforme GCD envoie un email avec jeton de sécurité pour activation.
          </p>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs flex items-center justify-between font-mono">
            <span>Dernier email généré :</span>
            <span className="font-bold text-indigo-700">
              {pendingActivationEmail ? pendingActivationEmail.email : 'Aucun en attente'}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Service SMTP Universitaire :</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Prêt & Sécurisé
            </span>
          </div>
        </div>

        {/* Task 4: Enregistrer la candidature */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            <span>4. Enregistrer la candidature (max 3 sujets)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Dès validation finale par le candidat, la plateforme GCD génère le numéro de référence officiel (ex: <code>DOS-2026-XXXX</code>) et transmet immédiatement le dossier complet à la <strong>Commission</strong> pour examen.
          </p>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs flex items-center justify-between font-mono">
            <span>Candidatures enregistrées :</span>
            <span className="font-bold text-emerald-700">{applications.length} dossier(s)</span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Routage automatique :</span>
            <span className="text-slate-700 font-medium">Vers Commissions spécialisées</span>
          </div>
        </div>

      </div>

      {/* Live Stream of Platform Events & Audit Link */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Traçabilité des Événements GCD
          </h3>
          <span className="text-xs text-slate-400 font-mono">Temps Réel</span>
        </div>

        <div className="space-y-2 text-xs">
          {applications.flatMap(a => a.historique).slice(0, 8).map((ev, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 font-mono text-[11px]">
              <div className="flex items-center gap-3 truncate">
                <span className="text-slate-400 shrink-0">{ev.date}</span>
                <span className="font-bold text-slate-800 shrink-0">[{ev.auteur}]</span>
                <span className="text-slate-600 truncate font-sans">{ev.action}</span>
              </div>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-2" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
