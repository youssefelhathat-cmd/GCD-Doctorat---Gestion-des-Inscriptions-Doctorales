import React, { useState } from 'react';
import { useDoctorat } from '../../context/DoctoratContext';
import { X, Mail, Lock, User, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const { 
    user, 
    login, 
    registerAccount, 
    activateAccount, 
    pendingActivationEmail 
  } = useDoctorat();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [password, setPassword] = useState('Doctorat2026!');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Veuillez saisir votre adresse email.');
      return;
    }
    const ok = login(email);
    if (ok) {
      onSuccess();
      onClose();
    } else {
      setError('Impossible de se connecter.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !nom || !prenom) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    registerAccount(email, nom, prenom);
  };

  const handleSimulateActivation = () => {
    if (pendingActivationEmail) {
      const ok = activateAccount(pendingActivationEmail.token);
      if (ok) {
        onSuccess();
        onClose();
      }
    }
  };

  const useDemoAccount = (demoEmail: string) => {
    login(demoEmail);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {pendingActivationEmail 
                ? 'Plateforme GCD : Email d\'activation envoyé' 
                : mode === 'login' ? 'Connexion Candidat' : 'Création de Compte Candidat'}
            </h2>
            <p className="text-xs text-slate-500">
              Étape UML : Décision "Compte existant ?"
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* State 1: Simulation of Activation Email (Directly from UML Diagram!) */}
        {pendingActivationEmail ? (
          <div className="p-6 space-y-4">
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-lg text-xs space-y-3">
              <div className="flex items-center gap-2 text-sky-800 font-bold">
                <Mail className="w-4 h-4 text-sky-600" />
                <span>Simulation de l'Email Envoyé par la Plateforme GCD</span>
              </div>
              <p className="text-slate-700">
                Un message de confirmation a été expédié à l'adresse <strong>{pendingActivationEmail.email}</strong>.
              </p>
              <div className="bg-white p-3 rounded border border-sky-100 font-mono text-[11px] text-slate-600">
                <p><strong>De :</strong> gcd-noreply@usmba.ac.ma</p>
                <p><strong>Objet :</strong> Activation de votre compte Candidat Doctorat 2026/2027</p>
                <p><strong>Clé d'activation :</strong> {pendingActivationEmail.token}</p>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs text-slate-600 mb-3">
                Pour reproduire fidèlement l'étape UML <em>"Activer son compte (via email)"</em> puis <em>"Se connecter"</em> :
              </p>
              <button
                onClick={handleSimulateActivation}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Activer mon compte et se connecter immédiatement</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            
            {/* Toggle Login / Register */}
            <div className="flex bg-slate-100 p-1 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className={`flex-1 py-1.5 font-medium rounded-md transition-all ${
                  mode === 'login' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                J'ai déjà un compte (Oui)
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); }}
                className={`flex-1 py-1.5 font-medium rounded-md transition-all ${
                  mode === 'register' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Créer un compte (Non)
              </button>
            </div>

            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                {error}
              </div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Adresse Email universitaire ou personnelle
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="salma.elamrani@gmail.com"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors mt-2"
                >
                  <span>Se connecter</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Quick login helper for demo */}
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[11px] text-slate-400 mb-2">Comptes candidats démo pré-enregistrés :</p>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => useDemoAccount('salma.elamrani@gmail.com')}
                      className="p-1.5 text-left bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 truncate"
                    >
                      Salma El Amrani (Présélect.)
                    </button>
                    <button
                      type="button"
                      onClick={() => useDemoAccount('omar.berrada@gmail.com')}
                      className="p-1.5 text-left bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 truncate"
                    >
                      Omar Berrada (Admis)
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nom</label>
                    <input
                      type="text"
                      required
                      value={nom}
                      onChange={e => setNom(e.target.value)}
                      placeholder="Ex: Bennani"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Prénom</label>
                    <input
                      type="text"
                      required
                      value={prenom}
                      onChange={e => setPrenom(e.target.value)}
                      placeholder="Ex: Youssef"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="youssef.bennani@univ.ma"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Créer un mot de passe</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors mt-3"
                >
                  <span>Créer mon compte & Recevoir l'email d'activation</span>
                </button>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
