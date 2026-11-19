import React, { useState } from 'react';
import { useDoctorat } from '../../context/DoctoratContext';
import { Role } from '../../types';
import { 
  ShieldCheck, 
  Key, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ArrowRight, 
  UserPlus, 
  Globe, 
  School,
  Sparkles,
  LogIn,
  LogOut,
  RefreshCw,
  BadgeCheck
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetRolePrompt?: Role | null;
}

export const GoogleIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const AcademicLoginModal: React.FC<Props> = ({ 
  isOpen, 
  onClose,
  targetRolePrompt 
}) => {
  const { 
    accounts, 
    currentAccount, 
    loginWithAcademicAccount,
    loginWithGoogleAccount,
    loginAsActor,
    logoutAccount,
    createCandidateAcademicAccount
  } = useDoctorat();

  const [activeTab, setActiveTab] = useState<'google' | 'quick' | 'credentials' | 'register'>('google');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isAuthenticatingGoogle, setIsAuthenticatingGoogle] = useState(false);

  // Custom Google login input
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleRole, setCustomGoogleRole] = useState<Role>('candidat');
  const [showCustomGoogle, setShowCustomGoogle] = useState(false);

  // Registration state
  const [regNom, setRegNom] = useState('');
  const [regPrenom, setRegPrenom] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regFormation, setRegFormation] = useState('');

  if (!isOpen) return null;

  const handleGoogleAuth = (googleEmail: string, assignedRole?: Role, nom?: string, prenom?: string) => {
    setErrorMsg(null);
    setIsAuthenticatingGoogle(true);

    setTimeout(() => {
      const res = loginWithGoogleAccount(googleEmail, assignedRole, nom, prenom);
      setIsAuthenticatingGoogle(false);

      if (res.success) {
        setSuccessMsg(`Authentifié avec succès via Google : ${res.account?.prenom} ${res.account?.nom} (${res.account?.email})`);
        setTimeout(() => {
          onClose();
          setSuccessMsg(null);
        }, 750);
      } else {
        setErrorMsg(res.message);
      }
    }, 450);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = loginWithAcademicAccount(emailInput.trim(), passwordInput);
    if (res.success) {
      setSuccessMsg(`Authentification réussie. Bienvenue ${res.account?.prenom} ${res.account?.nom}`);
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 700);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleQuickLogin = (actorRole: Role) => {
    setErrorMsg(null);
    const target = accounts.find(a => a.role === actorRole);
    if (target) {
      const res = loginWithAcademicAccount(target.email);
      if (res.success) {
        setSuccessMsg(`Connecté en tant que ${target.prenom} ${target.nom} (${target.titre})`);
        setTimeout(() => {
          onClose();
          setSuccessMsg(null);
        }, 600);
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const res = createCandidateAcademicAccount({
      nom: regNom.trim(),
      prenom: regPrenom.trim(),
      email: regEmail.trim(),
      motDePasse: regPassword || 'candidat2026',
      structure: regFormation ? `Master Recherche ${regFormation}` : 'Faculté d\'origine'
    });

    if (res.success) {
      setSuccessMsg(`Compte académique activé avec succès pour ${regPrenom} ${regNom} !`);
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 800);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Academic Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <GoogleIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-400 font-semibold flex items-center gap-1.5">
                <span>Google Workspace Education · USMBA Fès · CEDoc</span>
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
              </span>
              <h2 className="text-lg font-bold tracking-tight text-white">
                Identification Google (@usmba.ac.ma) par Acteur
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
            Authentifiez-vous via Google avec le compte académique institutionnel correspondant à vos prérogatives (Enseignant, Labo, CEDoc, Scolarité, Candidat).
          </p>

          {targetRolePrompt && (
            <div className="mt-3 p-2.5 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                Accès restreint : Veuillez vous connecter avec le compte Google habilité pour cet espace.
              </span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 text-xs font-semibold gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('google')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'google'
                ? 'border-indigo-600 text-indigo-700 bg-white/70 rounded-t'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GoogleIcon className="w-3.5 h-3.5" />
            <span>Identification Google (Tous Acteurs)</span>
          </button>

          <button
            onClick={() => setActiveTab('quick')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'quick'
                ? 'border-indigo-600 text-indigo-700 bg-white/70 rounded-t'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Fiches Acteurs</span>
          </button>

          <button
            onClick={() => setActiveTab('credentials')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'credentials'
                ? 'border-indigo-600 text-indigo-700 bg-white/70 rounded-t'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Mot de passe</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'register'
                ? 'border-indigo-600 text-indigo-700 bg-white/70 rounded-t'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Créer Compte Candidat</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Notification alerts */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: GOOGLE WORKSPACE IDENTIFICATION (EACH ACTOR) */}
          {activeTab === 'google' && (
            <div className="space-y-4">
              
              {/* Google Header callout */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                    <GoogleIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Google Identity Services & SSO Université Sidi Mohamed Ben Abdellah
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Chaque acteur dispose d'une identité Google Workspace certifiée (@usmba.ac.ma ou Gmail).
                    </p>
                  </div>
                </div>

                {isAuthenticatingGoogle && (
                  <span className="text-[11px] text-indigo-600 font-medium flex items-center gap-1 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Authentification...
                  </span>
                )}
              </div>

              {/* Detected User Google Account (yhathat8@gmail.com from session metadata) */}
              <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    YH
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">Yassine Hathat</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">
                        Compte Google Actif
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">yhathat8@gmail.com</span>
                  </div>
                </div>

                <button
                  onClick={() => handleGoogleAuth('yhathat8@gmail.com', 'candidat', 'Hathat', 'Yassine')}
                  disabled={isAuthenticatingGoogle}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 shadow-2xs transition-colors shrink-0"
                >
                  <GoogleIcon className="w-4 h-4" />
                  <span>Continuer avec ce compte</span>
                </button>
              </div>

              {/* Grid of Official Google Workspace Accounts for Each Actor */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Identités Google Workspace des 6 Acteurs :
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {accounts.filter(a => a.id !== 'acc-user-google').map(acc => {
                    const isCurrent = currentAccount?.email === acc.email;

                    return (
                      <div
                        key={acc.id}
                        onClick={() => handleGoogleAuth(acc.email, acc.role, acc.nom, acc.prenom)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all hover:shadow-xs flex items-center justify-between gap-3 ${
                          isCurrent 
                            ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500' 
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-lg ${acc.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}>
                            {acc.initiales}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {acc.prenom} {acc.nom}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-mono truncate">
                              {acc.email}
                            </p>
                            <span className="text-[10px] text-slate-600 font-medium truncate block">
                              {acc.titre.split('·')[0]}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs hover:bg-indigo-50">
                          <GoogleIcon className="w-3.5 h-3.5" />
                          <span>Google</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Google Account Section */}
              <div className="pt-2 border-t border-slate-100">
                {!showCustomGoogle ? (
                  <button
                    onClick={() => setShowCustomGoogle(true)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                  >
                    <span>+ Utiliser une autre adresse Google (Gmail / Workspace)</span>
                  </button>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        Connexion avec un autre compte Google
                      </span>
                      <button
                        onClick={() => setShowCustomGoogle(false)}
                        className="text-[11px] text-slate-400 hover:text-slate-600"
                      >
                        Fermer
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Adresse Google (Gmail ou Workspace) :
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="mon.email@gmail.com"
                          value={customGoogleEmail}
                          onChange={e => setCustomGoogleEmail(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-mono outline-none focus:ring-1 focus:ring-indigo-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Rôle d'accès :
                        </label>
                        <select
                          value={customGoogleRole}
                          onChange={e => setCustomGoogleRole(e.target.value as Role)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-semibold outline-none focus:ring-1 focus:ring-indigo-600"
                        >
                          <option value="candidat">Candidat / Doctorant</option>
                          <option value="professeur">Professeur / Commission</option>
                          <option value="directeur_labo">Directeur Laboratoire</option>
                          <option value="directeur_ced">Directeur CEDoc</option>
                          <option value="administration">Scolarité & Admin</option>
                          <option value="plateforme_gcd">Superviseur GCD</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          if (!customGoogleEmail) return;
                          handleGoogleAuth(customGoogleEmail, customGoogleRole);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                      >
                        <GoogleIcon className="w-3.5 h-3.5" />
                        <span>Authentifier via Google</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: ACCOUNTS CARDS FOR EACH ACTOR */}
          {activeTab === 'quick' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Sélectionnez un compte académique pour vous connecter instantanément :</span>
                {currentAccount && (
                  <span className="font-medium text-emerald-700">
                    Connecté : {currentAccount.prenom} {currentAccount.nom}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {accounts.map(acc => {
                  const isCurrent = currentAccount?.id === acc.id;

                  return (
                    <div
                      key={acc.id}
                      onClick={() => handleQuickLogin(acc.role)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all hover:shadow-xs flex items-start gap-3 relative ${
                        isCurrent 
                          ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500' 
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg ${acc.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}>
                        {acc.initiales}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {acc.prenom} {acc.nom}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                            acc.role === 'candidat' ? 'bg-emerald-100 text-emerald-800' :
                            acc.role === 'professeur' ? 'bg-indigo-100 text-indigo-800' :
                            acc.role === 'directeur_labo' ? 'bg-amber-100 text-amber-800' :
                            acc.role === 'directeur_ced' ? 'bg-purple-100 text-purple-800' :
                            acc.role === 'administration' ? 'bg-rose-100 text-rose-800' : 'bg-sky-100 text-sky-800'
                          }`}>
                            {acc.role}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 font-medium truncate mt-0.5">
                          {acc.titre}
                        </p>

                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-1 truncate">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{acc.email}</span>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px]">
                          <span className="text-slate-500 truncate max-w-[170px]">{acc.structure}</span>
                          <span className="font-semibold text-indigo-600 flex items-center gap-1">
                            {isCurrent ? 'Actif' : 'Connexion'} <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Public search without account option */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span>Candidat : Vous pouvez également chercher des sujets en mode public.</span>
                </div>
                <button
                  onClick={onClose}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 underline"
                >
                  Continuer sans compte
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CREDENTIALS LOGIN FORM */}
          {activeTab === 'credentials' && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-xs">
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Adresse email institutionnelle USMBA (@usmba.ac.ma) :
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="prenom.nom@usmba.ac.ma"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-600 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Mot de passe académique :
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={passwordInput}
                      onChange={e => setPasswordInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>
              </div>

              {/* Demo passwords hint */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-500 space-y-1">
                <span className="font-bold text-slate-700 block">Identifiants officiels USMBA pour l'évaluation :</span>
                <p>• <strong>Professeur :</strong> k.bennani@usmba.ac.ma / <code>prof2026</code></p>
                <p>• <strong>Directeur Labo :</strong> h.idrissi@usmba.ac.ma / <code>labo2026</code></p>
                <p>• <strong>Directeur CEDoc :</strong> a.chraibi@usmba.ac.ma / <code>cedoc2026</code></p>
                <p>• <strong>Scolarité :</strong> scolarite.cedoc@usmba.ac.ma / <code>admin2026</code></p>
                <p>• <strong>Candidat :</strong> salma.elamrani@usmba.ac.ma / <code>candidat2026</code></p>
                <p>• <strong>Superviseur GCD :</strong> superviseur.gcd@usmba.ac.ma / <code>gcd2026</code></p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('google')}
                  className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold"
                >
                  <GoogleIcon className="w-3.5 h-3.5" />
                  <span>Préférer l'identification Google</span>
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Se connecter</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: REGISTER NEW CANDIDATE ACCOUNT */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900">
                <p className="font-semibold">Procédure Conforme au Diagramme d'Activité UML :</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Après validation du panier de sujets (1 à 3 choix), la plateforme GCD génère votre identifiant académique et active instantanément votre espace candidat.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Yassine"
                    value={regPrenom}
                    onChange={e => setRegPrenom(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Alami"
                    value={regNom}
                    onChange={e => setRegNom(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Email personnel ou institutionnel *</label>
                  <input
                    type="email"
                    required
                    placeholder="yassine.alami@gmail.com"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Mot de passe de connexion *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Diplôme / Master d'origine</label>
                  <input
                    type="text"
                    placeholder="Ex: Master Informatique / Ingénieur ENSIAS"
                    value={regFormation}
                    onChange={e => setRegFormation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Créer mon Compte & Activer l'Accès</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Modal Footer */}
        {currentAccount && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                Session active : <strong>{currentAccount.prenom} {currentAccount.nom}</strong> 
                {currentAccount.fournisseurAuth === 'google' && (
                  <span className="ml-1 text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded font-semibold inline-flex items-center gap-1">
                    <GoogleIcon className="w-2.5 h-2.5" /> Google
                  </span>
                )}
              </span>
            </div>

            <button
              onClick={() => {
                logoutAccount();
                setSuccessMsg('Session académique fermée.');
                setTimeout(() => setSuccessMsg(null), 1500);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Se déconnecter</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
