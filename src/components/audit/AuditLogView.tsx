import React, { useState, useMemo } from 'react';
import { useDoctorat } from '../../context/DoctoratContext';
import { Role, ActionType, AuditLogEntry } from '../../types';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  CalendarClock, 
  FileText, 
  Play, 
  FileSpreadsheet,
  X,
  Eye,
  Info,
  Calendar,
  Layers,
  ChevronDown,
  RefreshCw
} from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs, clearAuditLogs, logTask, setPortalMode } = useDoctorat();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>('all');
  const [selectedObjectTypeFilter, setSelectedObjectTypeFilter] = useState<string>('all');
  const [selectedLogDetail, setSelectedLogDetail] = useState<AuditLogEntry | null>(null);

  // Stats
  const totalLogs = auditLogs.length;
  const countCreations = auditLogs.filter(l => l.actionType === 'CREATION').length;
  const countValidations = auditLogs.filter(l => l.actionType === 'VALIDATION').length;
  const countProlongations = auditLogs.filter(l => l.actionType === 'PROLONGATION').length;
  const countSignatures = auditLogs.filter(l => l.actionType === 'SIGNATURE').length;

  // Filter audit logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      // Role filter
      if (selectedRoleFilter !== 'all' && log.acteurRole !== selectedRoleFilter) {
        return false;
      }
      // Action type filter
      if (selectedActionFilter !== 'all' && log.actionType !== selectedActionFilter) {
        return false;
      }
      // Object type filter
      if (selectedObjectTypeFilter !== 'all' && log.objetType !== selectedObjectTypeFilter) {
        return false;
      }
      // Search term
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const matchActeur = log.acteurNom.toLowerCase().includes(term);
        const matchCode = log.tacheCode.toLowerCase().includes(term);
        const matchNom = log.tacheNom.toLowerCase().includes(term);
        const matchRef = log.objetRef.toLowerCase().includes(term);
        const matchDetails = log.details.toLowerCase().includes(term);
        return matchActeur || matchCode || matchNom || matchRef || matchDetails;
      }
      return true;
    });
  }, [auditLogs, selectedRoleFilter, selectedActionFilter, selectedObjectTypeFilter, searchTerm]);

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `journal_audit_doctorat_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Horodatage', 'Acteur', 'Role', 'CodeTache', 'NomTache', 'TypeAction', 'ObjetType', 'ObjetRef', 'Details', 'Resultat', 'DureeMs'];
    const rows = auditLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.acteurNom}"`,
      `"${l.acteurRole}"`,
      `"${l.tacheCode}"`,
      `"${l.tacheNom}"`,
      `"${l.actionType}"`,
      `"${l.objetType}"`,
      `"${l.objetRef}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.statutResultat}"`,
      l.dureeMs || 0
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', csvContent);
    downloadAnchor.setAttribute('download', `journal_audit_doctorat_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Simulate test audit entry
  const handleSimulateAction = () => {
    logTask({
      tacheCode: 'TASK_VERIFICATION_RAPPORT',
      tacheNom: 'Vérification de rapport de conformité',
      objetType: 'Candidature',
      objetRef: 'DOS-2026-TEST-' + Math.floor(100 + Math.random() * 900),
      actionType: 'VALIDATION',
      details: 'Audit instantané généré pour démonstration du suivi des opérations en temps réel.',
      statutResultat: 'Exécuté avec succès'
    });
  };

  const getActionBadgeColor = (type: ActionType) => {
    switch (type) {
      case 'CREATION':
        return 'bg-slate-100 text-slate-700 border-slate-200/80';
      case 'VALIDATION':
        return 'bg-emerald-50/80 text-emerald-800 border-emerald-200/70';
      case 'PROLONGATION':
        return 'bg-amber-50 text-amber-900 border-amber-200/80 font-medium';
      case 'SIGNATURE':
        return 'bg-indigo-50/70 text-indigo-800 border-indigo-200/70';
      case 'REJET':
        return 'bg-rose-50/70 text-rose-800 border-rose-200/70';
      case 'MODIFICATION':
        return 'bg-slate-100 text-slate-700 border-slate-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200/80';
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-700" />
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Journal d'Audit des Tâches
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Traçabilité horodatée et immuable de chaque action exécutée sur la plateforme
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button
            onClick={() => setPortalMode('diagramme')}
            className="px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Diagramme</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>JSON</span>
          </button>

          <button
            onClick={handleSimulateAction}
            className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span>Simuler tâche</span>
          </button>
        </div>
      </div>

      {/* KPI Cards - Clean, Muted & Restful for the Eyes */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Total Tâches</p>
          <p className="text-lg font-semibold text-slate-900 mt-0.5 font-mono tabular-nums">{totalLogs}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Créations</p>
          <p className="text-lg font-semibold text-slate-800 mt-0.5 font-mono tabular-nums">{countCreations}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-emerald-800 uppercase tracking-wide">Validations</p>
          <p className="text-lg font-semibold text-emerald-900 mt-0.5 font-mono tabular-nums">{countValidations}</p>
        </div>

        <div className="bg-white rounded-xl border border-amber-200/80 bg-amber-50/20 p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-amber-800 uppercase tracking-wide">Dates Prolongées</p>
          <p className="text-lg font-semibold text-amber-900 mt-0.5 font-mono tabular-nums">{countProlongations}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Signatures & PV</p>
          <p className="text-lg font-semibold text-slate-800 mt-0.5 font-mono tabular-nums">{countSignatures}</p>
        </div>
      </div>

      {/* Main Table with Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Rechercher par acteur, code, référence ou mot-clé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-slate-900 focus:outline-indigo-600"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Role Filter */}
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 font-medium focus:outline-indigo-600"
            >
              <option value="all">Tous les acteurs</option>
              <option value="candidat">Candidat</option>
              <option value="professeur">Professeur / Commission</option>
              <option value="directeur_labo">Directeur Laboratoire</option>
              <option value="directeur_ced">Directeur CEDoc</option>
              <option value="administration">Administration Scolarité</option>
              <option value="plateforme_gcd">Plateforme Système GCD</option>
            </select>

            {/* Action Type Filter */}
            <select
              value={selectedActionFilter}
              onChange={(e) => setSelectedActionFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 font-medium focus:outline-indigo-600"
            >
              <option value="all">Tous types d'action</option>
              <option value="CREATION">Création</option>
              <option value="VALIDATION">Validation</option>
              <option value="PROLONGATION">Prolongation de date</option>
              <option value="SIGNATURE">Signature PV</option>
              <option value="MODIFICATION">Modification</option>
              <option value="REJET">Rejet</option>
            </select>

            {/* Object Type Filter */}
            <select
              value={selectedObjectTypeFilter}
              onChange={(e) => setSelectedObjectTypeFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 font-medium focus:outline-indigo-600"
            >
              <option value="all">Tous les objets</option>
              <option value="Candidature">Candidature</option>
              <option value="Sujet">Sujet de thèse</option>
              <option value="RapportActivite">Rapport d'activité</option>
              <option value="DossierAdmin">Dossier administratif</option>
              <option value="RolePrivilege">Rôle / Privilège</option>
              <option value="Calendrier">Calendrier & Délais</option>
            </select>

            {(searchTerm || selectedRoleFilter !== 'all' || selectedActionFilter !== 'all' || selectedObjectTypeFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRoleFilter('all');
                  setSelectedActionFilter('all');
                  setSelectedObjectTypeFilter('all');
                }}
                className="text-xs text-rose-600 hover:underline px-2 py-1"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Horodatage</th>
                <th className="px-4 py-3">Acteur & Rôle</th>
                <th className="px-4 py-3">Code & Tâche</th>
                <th className="px-4 py-3">Type d'Action</th>
                <th className="px-4 py-3">Objet Ciblé & Réf</th>
                <th className="px-4 py-3">Détails d'Exécution</th>
                <th className="px-4 py-3">Résultat</th>
                <th className="px-4 py-3 text-right">Durée</th>
                <th className="px-4 py-3 text-center">Fiche</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                    Aucune entrée d'audit ne correspond aux critères de filtre.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => {
                  const isProlongation = log.actionType === 'PROLONGATION';

                  return (
                    <tr 
                      key={log.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isProlongation ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      {/* Timestamp */}
                      <td className="px-4 py-3.5 font-mono text-slate-600 whitespace-nowrap">
                        {log.timestamp}
                      </td>

                      {/* Actor */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <p className="font-semibold text-slate-900">{log.acteurNom}</p>
                        <p className="text-[10px] text-slate-500 uppercase">{log.acteurRole.replace(/_/g, ' ')}</p>
                      </td>

                      {/* Task */}
                      <td className="px-4 py-3.5">
                        <p className="font-mono text-[11px] font-semibold text-indigo-700">{log.tacheCode}</p>
                        <p className="text-slate-600 text-[11px]">{log.tacheNom}</p>
                      </td>

                      {/* Action Type */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getActionBadgeColor(log.actionType)}`}>
                          {log.actionType}
                        </span>
                      </td>

                      {/* Object */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-[11px] border border-slate-200">
                          {log.objetRef}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{log.objetType}</p>
                      </td>

                      {/* Details */}
                      <td className="px-4 py-3.5 max-w-sm text-slate-700 leading-relaxed">
                        {log.details}
                      </td>

                      {/* Result */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                          isProlongation
                            ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {log.statutResultat}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="px-4 py-3.5 text-right font-mono text-slate-400 whitespace-nowrap">
                        {log.dureeMs ? `${log.dureeMs}ms` : '—'}
                      </td>

                      {/* Inspect details button */}
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => setSelectedLogDetail(log)}
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          title="Voir les détails complets de la tâche"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            Affichage de <strong>{filteredLogs.length}</strong> sur <strong>{auditLogs.length}</strong> tâches enregistrées
          </span>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (window.confirm('Voulez-vous réinitialiser le journal d\'audit ?')) {
                  clearAuditLogs();
                }
              }}
              className="text-rose-600 hover:text-rose-800 font-medium inline-flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vider le journal</span>
            </button>
          </div>
        </div>

      </div>

      {/* DETAIL MODAL / DRAWER */}
      {selectedLogDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Détail de la Tâche Exécutée
                </h3>
              </div>
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 block">Horodatage :</span>
                  <span className="font-mono font-semibold text-slate-800">{selectedLogDetail.timestamp}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Durée d'exécution :</span>
                  <span className="font-mono font-semibold text-slate-800">{selectedLogDetail.dureeMs || 0} ms</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Acteur :</span>
                  <span className="font-semibold text-slate-900">{selectedLogDetail.acteurNom} ({selectedLogDetail.acteurRole})</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Type d'action :</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getActionBadgeColor(selectedLogDetail.actionType)}`}>
                    {selectedLogDetail.actionType}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Code & Intitulé de la tâche :</span>
                <p className="font-mono text-indigo-700 font-bold bg-indigo-50/60 p-2 rounded border border-indigo-100">
                  {selectedLogDetail.tacheCode} — {selectedLogDetail.tacheNom}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Objet Métier ciblé :</span>
                <p className="font-mono text-slate-800 bg-slate-100 p-2 rounded border border-slate-200">
                  Type : {selectedLogDetail.objetType} · Réf : {selectedLogDetail.objetRef}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Description détaillée / Payload :</span>
                <p className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {selectedLogDetail.details}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Statut Résultat :</span>
                <span className="inline-block px-2.5 py-1 rounded-md text-emerald-800 bg-emerald-50 border border-emerald-200 font-semibold">
                  {selectedLogDetail.statutResultat}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-semibold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
