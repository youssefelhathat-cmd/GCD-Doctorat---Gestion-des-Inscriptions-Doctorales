import React, { useState } from 'react';
import { useDoctorat } from '../../context/DoctoratContext';
import { 
  Role, 
  BusinessObject, 
  PrivilegeRule, 
  UserRoleAssignment, 
  ObjectPrivilegeMatrix 
} from '../../types';
import { 
  ShieldCheck, 
  Users, 
  Key, 
  Check, 
  X, 
  RotateCcw, 
  Plus, 
  Building2, 
  Sliders, 
  FileCheck2, 
  UserCheck, 
  Lock, 
  Unlock,
  AlertCircle,
  HelpCircle,
  Shield
} from 'lucide-react';

export const RolePrivilegeManagerView: React.FC = () => {
  const { 
    userAssignments, 
    updateUserRole, 
    toggleUserStatus, 
    addUserAssignment, 
    privilegeMatrix, 
    updatePrivilege, 
    resetPrivilegesToDefault 
  } = useDoctorat();

  const [activeTab, setActiveTab] = useState<'attributions' | 'matrice'>('attributions');
  const [selectedObjectCode, setSelectedObjectCode] = useState<BusinessObject>('sujets_these');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // New user form state
  const [newNom, setNewNom] = useState('');
  const [newPrenom, setNewPrenom] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<Role>('professeur');
  const [newStructure, setNewStructure] = useState('Laboratoire LTISI');

  const roleLabels: Record<Role, string> = {
    candidat: 'Candidat / Doctorant',
    professeur: 'Professeur / Commission',
    directeur_labo: 'Directeur du Laboratoire',
    directeur_ced: 'Directeur du CEDoc',
    administration: 'Administration Scolarité',
    plateforme_gcd: 'Plateforme Système GCD'
  };

  const privilegeColumns: { key: keyof PrivilegeRule; label: string; desc: string }[] = [
    { key: 'lecture', label: 'Lecture', desc: 'Consulter l\'objet et ses pièces justificatives' },
    { key: 'creation', label: 'Création', desc: 'Renseigner, créer ou soumettre une nouvelle fiche' },
    { key: 'modification', label: 'Modification', desc: 'Mettre à jour ou corriger les données' },
    { key: 'suppression', label: 'Suppression', desc: 'Archiver ou supprimer définitivement' },
    { key: 'validation', label: 'Validation', desc: 'Émettre un visa, avis favorable ou attestation' },
    { key: 'prolongation_delai', label: 'Prolongation de délai', desc: 'Reporter l\'échéance ou accorder un délai de grâce' }
  ];

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNom || !newPrenom || !newEmail) return;

    addUserAssignment({
      nom: newNom,
      prenom: newPrenom,
      email: newEmail,
      role: newRole,
      structure: newStructure,
      statutCompte: 'Actif',
      attribuPar: 'Direction CEDoc (Interface RBAC)'
    });

    setNewNom('');
    setNewPrenom('');
    setNewEmail('');
    setIsAddUserModalOpen(false);
  };

  const selectedMatrix = privilegeMatrix.find(m => m.objet === selectedObjectCode) || privilegeMatrix[0];

  return (
    <div className="space-y-5">
      
      {/* Header - Clean, Structured & Visual */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Rôles & Droits d'Accès (RBAC)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gouvernance universitaire · Gestion des comptes et matrice des privilèges par objet
          </p>
        </div>

        {/* View Switcher & Action */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/60 text-xs">
            <button
              onClick={() => setActiveTab('attributions')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'attributions'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Utilisateurs ({userAssignments.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('matrice')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'matrice'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Matrice par Objet</span>
            </button>
          </div>

          {activeTab === 'attributions' ? (
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter</span>
            </button>
          ) : (
            <button
              onClick={resetPrivilegesToDefault}
              className="px-3 py-1.5 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Restaurer la politique de sécurité standard du CEDoc"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser</span>
            </button>
          )}
        </div>
      </div>

      {/* SECTION 1: ATTRIBUTION DES RÔLES PAR UTILISATEUR */}
      {activeTab === 'attributions' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              Comptes & Rôles Universitaires
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">
              {userAssignments.length} comptes actifs
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Utilisateur</th>
                  <th className="px-4 py-3">Email Institutionnel</th>
                  <th className="px-4 py-3">Structure / Laboratoire</th>
                  <th className="px-4 py-3">Rôle Assigné</th>
                  <th className="px-4 py-3">Statut Compte</th>
                  <th className="px-4 py-3">Attribué Par & Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userAssignments.map(userItem => {
                  const isActive = userItem.statutCompte === 'Actif';

                  return (
                    <tr key={userItem.userId} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name */}
                      <td className="px-4 py-3.5 font-medium text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                            {userItem.prenom.charAt(0)}{userItem.nom.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{userItem.prenom} {userItem.nom}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{userItem.userId}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3.5 font-mono text-slate-600">
                        {userItem.email}
                      </td>

                      {/* Structure */}
                      <td className="px-4 py-3.5 text-slate-700 max-w-xs">
                        <span className="inline-flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{userItem.structure}</span>
                        </span>
                      </td>

                      {/* Role Selector Dropdown */}
                      <td className="px-4 py-3.5">
                        <select
                          value={userItem.role}
                          onChange={(e) => updateUserRole(userItem.userId, e.target.value as Role)}
                          className="border border-slate-300 rounded-lg px-2.5 py-1 bg-slate-50 text-slate-900 font-semibold focus:outline-emerald-600 text-xs shadow-2xs"
                        >
                          {(Object.keys(roleLabels) as Role[]).map(r => (
                            <option key={r} value={r}>
                              {roleLabels[r]}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Statut Toggle */}
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => toggleUserStatus(userItem.userId)}
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border transition-colors ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                          }`}
                          title="Cliquer pour basculer le statut"
                        >
                          {isActive ? <Lock className="w-3 h-3 text-emerald-600" /> : <Unlock className="w-3 h-3 text-rose-600" />}
                          <span>{userItem.statutCompte}</span>
                        </button>
                      </td>

                      {/* Attribution Info */}
                      <td className="px-4 py-3.5 text-slate-500 text-[11px]">
                        <p className="font-medium text-slate-700">{userItem.attribuPar}</p>
                        <p className="font-mono text-[10px] text-slate-400">{userItem.dateAttribution}</p>
                      </td>

                      {/* Quick Edit button */}
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => {
                            const newStruct = prompt('Modifier la structure rattachée :', userItem.structure);
                            if (newStruct !== null) {
                              updateUserRole(userItem.userId, userItem.role, newStruct);
                            }
                          }}
                          className="text-xs text-indigo-600 font-semibold hover:underline"
                        >
                          Éditer
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: MATRICE DES PRIVILÈGES SUR LES OBJETS (RBAC) */}
      {activeTab === 'matrice' && (
        <div className="space-y-5">
          
          {/* Object Selector Bar - Compact & Visual */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-700" />
                Objets du cursus
              </span>
              <span className="text-[11px] text-slate-400">
                Sélectionnez un objet pour configurer les permissions
              </span>
            </div>

            {/* Object Buttons Strip */}
            <div className="flex flex-wrap gap-1.5">
              {privilegeMatrix.map(m => (
                <button
                  key={m.objet}
                  onClick={() => setSelectedObjectCode(m.objet)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedObjectCode === m.objet
                      ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span>{m.labelObjet}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Privilege Matrix Table for the Selected Object */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200/80 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    Droits d'accès : {selectedMatrix.labelObjet}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {selectedMatrix.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <Check className="w-3.5 h-3.5" /> Autorisé
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <X className="w-3.5 h-3.5" /> Refusé
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 min-w-[200px]">Type d'Acteur (Rôle)</th>
                    {privilegeColumns.map(col => (
                      <th key={col.key} className="px-3 py-3 text-center" title={col.desc}>
                        <div className="font-bold text-slate-900">{col.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{col.key}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(Object.keys(roleLabels) as Role[]).map(r => {
                    const rules = selectedMatrix.privilegesParRole[r] || {
                      lecture: false,
                      creation: false,
                      modification: false,
                      suppression: false,
                      validation: false,
                      prolongation_delai: false
                    };

                    return (
                      <tr key={r} className="hover:bg-slate-50/70 transition-colors">
                        {/* Role Name */}
                        <td className="px-4 py-3.5 font-medium text-slate-900">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                            <div>
                              <p className="font-bold text-slate-900">{roleLabels[r]}</p>
                              <p className="text-[10px] font-mono text-slate-400">{r}</p>
                            </div>
                          </div>
                        </td>

                        {/* Interactive Checkbox for each privilege */}
                        {privilegeColumns.map(col => {
                          const isAllowed = rules[col.key];

                          return (
                            <td key={col.key} className="px-3 py-3.5 text-center">
                              <button
                                onClick={() => updatePrivilege(selectedMatrix.objet, r, col.key, !isAllowed)}
                                className={`w-7 h-7 rounded-lg border inline-flex items-center justify-center transition-all cursor-pointer ${
                                  isAllowed
                                    ? col.key === 'prolongation_delai'
                                      ? 'bg-amber-500 border-amber-600 text-white shadow-xs font-bold'
                                      : 'bg-emerald-600 border-emerald-700 text-white shadow-xs'
                                    : 'bg-white border-slate-300 text-slate-300 hover:border-slate-400 hover:text-slate-500'
                                }`}
                                title={`Cliquer pour ${isAllowed ? 'révoquer' : 'accorder'} le privilège [${col.label}] à ${roleLabels[r]}`}
                              >
                                {isAllowed ? (
                                  <Check className="w-4 h-4 stroke-[3]" />
                                ) : (
                                  <X className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Matrix Rule Notice */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                <strong>Séparation des pouvoirs (UML) :</strong> Seuls l'Administration et la Direction CEDoc peuvent valider ou prolonger les échéances.
              </span>
            </div>

          </div>

        </div>
      )}

      {/* MODAL: AJOUTER / ATTRIBUER UN COMPTE */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-slate-900">
                  Attribuer un Profil & Rôle Utilisateur
                </h3>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prénom :</label>
                  <input
                    type="text"
                    required
                    value={newPrenom}
                    onChange={(e) => setNewPrenom(e.target.value)}
                    placeholder="Ex: Mehdi"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nom :</label>
                  <input
                    type="text"
                    required
                    value={newNom}
                    onChange={(e) => setNewNom(e.target.value)}
                    placeholder="Ex: Alaoui"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Institutionnel :</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Ex: m.alaoui@usmba.ac.ma"
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rôle Attribué :</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as Role)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 font-medium focus:outline-emerald-600"
                >
                  {(Object.keys(roleLabels) as Role[]).map(r => (
                    <option key={r} value={r}>{roleLabels[r]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Structure / Laboratoire rattaché :</label>
                <input
                  type="text"
                  required
                  value={newStructure}
                  onChange={(e) => setNewStructure(e.target.value)}
                  placeholder="Ex: Laboratoire LEMA · Faculté des Sciences"
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-emerald-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Enregistrer l'attribution</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
