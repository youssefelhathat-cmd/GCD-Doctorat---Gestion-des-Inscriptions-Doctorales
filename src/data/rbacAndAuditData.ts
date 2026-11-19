import { ObjectPrivilegeMatrix, UserRoleAssignment, AuditLogEntry, Role, BusinessObject } from '../types';

export const DEFAULT_OBJECT_PRIVILEGES: ObjectPrivilegeMatrix[] = [
  {
    objet: 'sujets_these',
    labelObjet: 'Sujets de Thèse',
    description: 'Offres doctorales, descriptifs scientifiques, financements et critères d\'accueil.',
    privilegesParRole: {
      candidat: { lecture: true, creation: false, modification: false, suppression: false, validation: false, prolongation_delai: false },
      professeur: { lecture: true, creation: true, modification: true, suppression: false, validation: false, prolongation_delai: false },
      directeur_labo: { lecture: true, creation: false, modification: true, suppression: false, validation: true, prolongation_delai: false },
      directeur_ced: { lecture: true, creation: false, modification: true, suppression: false, validation: true, prolongation_delai: true },
      administration: { lecture: true, creation: false, modification: true, suppression: true, validation: true, prolongation_delai: true },
      plateforme_gcd: { lecture: true, creation: true, modification: true, suppression: true, validation: true, prolongation_delai: true }
    }
  },
  {
    objet: 'panier_voeux',
    labelObjet: 'Panier de Candidature',
    description: 'Sélection des choix ordonnés (1 à 3 maximum par candidat).',
    privilegesParRole: {
      candidat: { lecture: true, creation: true, modification: true, suppression: true, validation: false, prolongation_delai: false },
      professeur: { lecture: false, creation: false, modification: false, suppression: false, validation: false, prolongation_delai: false },
      directeur_labo: { lecture: false, creation: false, modification: false, suppression: false, validation: false, prolongation_delai: false },
      directeur_ced: { lecture: false, creation: false, modification: false, suppression: false, validation: false, prolongation_delai: false },
      administration: { lecture: true, creation: false, modification: false, suppression: false, validation: false, prolongation_delai: false },
      plateforme_gcd: { lecture: true, creation: true, modification: true, suppression: true, validation: true, prolongation_delai: false }
    }
  },
  {
    objet: 'dossier_candidature',
    labelObjet: 'Dossier de Candidature',
    description: 'État civil, diplômes Master, relevés de notes, CV et avant-projet.',
    privilegesParRole: {
      candidat: { lecture: true, creation: true, modification: true, suppression: false, validation: false, prolongation_delai: false },
      professeur: { lecture: true, creation: false, modification: false, suppression: false, validation: true, prolongation_delai: false },
      directeur_labo: { lecture: true, creation: false, modification: false, suppression: false, validation: false, prolongation_delai: false },
      directeur_ced: { lecture: true, creation: false, modification: false, suppression: false, validation: false, prolongation_delai: false },
      administration: { lecture: true, creation: false, modification: true, suppression: true, validation: true, prolongation_delai: true },
      plateforme_gcd: { lecture: true, creation: true, modification: true, suppression: true, validation: true, prolongation_delai: true }
    }
  },
  {
    objet: 'pv_entretien',
    labelObjet: 'Procès-Verbal & Délibération Oral',
    description: 'Notes d\'oral, avis de la commission et liste principale/d\'attente.',
    privilegesParRole: {
      candidat: { lecture: true, creation: false, modification: false, suppression: false, validation: false, prolongation_delai: false },
      professeur: { lecture: true, creation: true, modification: true, suppression: false, validation: true, prolongation_delai: true },
      directeur_labo: { lecture: true, creation: false, modification: false, suppression: false, validation: false, prolongation_delai: false },
      directeur_ced: { lecture: true, creation: false, modification: false, suppression: false, validation: true, prolongation_delai: true },
      administration: { lecture: true, creation: false, modification: false, suppression: false, validation: true, prolongation_delai: true },
      plateforme_gcd: { lecture: true, creation: true, modification: true, suppression: true, validation: true, prolongation_delai: true }
    }
  },
  {
    objet: 'rapport_activites',
    labelObjet: 'Rapport Annuel d\'Avancement',
    description: 'Jauge %, résumé des résultats, publications, formations CEDoc.',
    privilegesParRole: {
      candidat: { lecture: true, creation: true, modification: true, suppression: false, validation: false, prolongation_delai: false },
      professeur: { lecture: true, creation: false, modification: false, suppression: false, validation: true, prolongation_delai: false },
      directeur_labo: { lecture: true, creation: false, modification: false, suppression: false, validation: true, prolongation_delai: false },
      directeur_ced: { lecture: true, creation: false, modification: false, suppression: false, validation: true, prolongation_delai: false },
      administration: { lecture: true, creation: false, modification: false, suppression: false, validation: false, prolongation_delai: true },
      plateforme_gcd: { lecture: true, creation: true, modification: true, suppression: true, validation: true, prolongation_delai: true }
    }
  },
  {
    objet: 'visas_reinscription',
    labelObjet: 'Visas de Réinscription',
    description: 'Avis motivé du directeur, visa du labo et confirmation académique CEDoc.',
    privilegesParRole: {
      candidat: { lecture: true, creation: false, modification: false, suppression: false, validation: false, prolongation_delai: false },
      professeur: { lecture: true, creation: true, modification: true, suppression: false, validation: true, prolongation_delai: false },
      directeur_labo: { lecture: true, creation: true, modification: true, suppression: false, validation: true, prolongation_delai: false },
      directeur_ced: { lecture: true, creation: true, modification: true, suppression: false, validation: true, prolongation_delai: true },
      administration: { lecture: true, creation: false, modification: false, suppression: false, validation: true, prolongation_delai: true },
      plateforme_gcd: { lecture: true, creation: true, modification: true, suppression: true, validation: true, prolongation_delai: true }
    }
  },
  {
    objet: 'dossier_admin_quittance',
    labelObjet: 'Dossier Administratif & Quittance',
    description: 'Paiement des droits, assurance étudiante, originaux de diplômes.',
    privilegesParRole: {
      candidat: { lecture: true, creation: true, modification: true, suppression: false, validation: false, prolongation_delai: false },
      professeur: { lecture: false, creation: false, modification: false, suppression: false, validation: false, prolongation_delai: false },
      directeur_labo: { lecture: false, creation: false, modification: false, suppression: false, validation: false, prolongation_delai: false },
      directeur_ced: { lecture: true, creation: false, modification: false, suppression: false, validation: false, prolongation_delai: false },
      administration: { lecture: true, creation: true, modification: true, suppression: false, validation: true, prolongation_delai: true },
      plateforme_gcd: { lecture: true, creation: true, modification: true, suppression: true, validation: true, prolongation_delai: true }
    }
  },
  {
    objet: 'attestation_matricule',
    labelObjet: 'Attestation & Matricule Officiel',
    description: 'Attribution du matricule doctorant et certificat officiel d\'inscription.',
    privilegesParRole: {
      candidat: { lecture: true, creation: false, modification: false, suppression: false, validation: false, prolongation_delai: false },
      professeur: { lecture: true, creation: false, modification: false, suppression: false, validation: false, prolongation_delai: false },
      directeur_labo: { lecture: true, creation: false, modification: false, suppression: false, validation: false, prolongation_delai: false },
      directeur_ced: { lecture: true, creation: false, modification: false, suppression: false, validation: true, prolongation_delai: false },
      administration: { lecture: true, creation: true, modification: true, suppression: false, validation: true, prolongation_delai: false },
      plateforme_gcd: { lecture: true, creation: true, modification: true, suppression: true, validation: true, prolongation_delai: false }
    }
  },
  {
    objet: 'calendrier_delais',
    labelObjet: 'Calendrier & Prolongation des Délais',
    description: 'Dates limites de campagne, délais de délibération et reports autorisés.',
    privilegesParRole: {
      candidat: { lecture: true, creation: false, modification: false, suppression: false, validation: false, prolongation_delai: false },
      professeur: { lecture: true, creation: false, modification: false, suppression: false, validation: false, prolongation_delai: true },
      directeur_labo: { lecture: true, creation: false, modification: false, suppression: false, validation: false, prolongation_delai: false },
      directeur_ced: { lecture: true, creation: true, modification: true, suppression: false, validation: true, prolongation_delai: true },
      administration: { lecture: true, creation: true, modification: true, suppression: false, validation: true, prolongation_delai: true },
      plateforme_gcd: { lecture: true, creation: true, modification: true, suppression: true, validation: true, prolongation_delai: true }
    }
  }
];

export const INITIAL_USER_ROLE_ASSIGNMENTS: UserRoleAssignment[] = [
  {
    userId: 'usr-candidat-1',
    nom: 'El Amrani',
    prenom: 'Salma',
    email: 'salma.elamrani@gmail.com',
    role: 'candidat',
    structure: 'Faculté des Sciences - Candidat 1ère Année',
    statutCompte: 'Actif',
    dateAttribution: '2026-10-17 08:30',
    attribuPar: 'Plateforme GCD (Auto-Inscription)',
    derniereConnexion: '2026-11-03 01:14'
  },
  {
    userId: 'usr-prof-bennani',
    nom: 'Bennani',
    prenom: 'Karim (Prof.)',
    email: 'k.bennani@usmba.ac.ma',
    role: 'professeur',
    structure: 'Laboratoire LTISI · Commission Doctorale Informatique',
    statutCompte: 'Actif',
    dateAttribution: '2026-09-01 09:00',
    attribuPar: 'Présidence CEDoc',
    derniereConnexion: '2026-11-02 18:45'
  },
  {
    userId: 'usr-labo-idrissi',
    nom: 'Idrissi',
    prenom: 'Hassan (Directeur)',
    email: 'h.idrissi@usmba.ac.ma',
    role: 'directeur_labo',
    structure: 'Laboratoire LBBV · Direction de Structure',
    statutCompte: 'Actif',
    dateAttribution: '2026-09-05 11:20',
    attribuPar: 'Conseil de Laboratoire',
    derniereConnexion: '2026-11-01 14:10'
  },
  {
    userId: 'usr-ced-chraibi',
    nom: 'Chraibi',
    prenom: 'Amina (Prof. Direction)',
    email: 'a.chraibi@usmba.ac.ma',
    role: 'directeur_ced',
    structure: 'Centre d\'Études Doctorales (CEDoc)',
    statutCompte: 'Actif',
    dateAttribution: '2026-08-15 10:00',
    attribuPar: 'Conseil de l\'Université',
    derniereConnexion: '2026-11-03 00:30'
  },
  {
    userId: 'usr-admin-scolarite',
    nom: 'Benjelloun',
    prenom: 'Fatima (Responsable Scolarité)',
    email: 'scolarite.cedoc@usmba.ac.ma',
    role: 'administration',
    structure: 'Service Central des Inscriptions Doctorales',
    statutCompte: 'Actif',
    dateAttribution: '2026-09-01 08:00',
    attribuPar: 'Secrétaire Général',
    derniereConnexion: '2026-11-03 01:25'
  },
  {
    userId: 'usr-doc-tazi',
    nom: 'Tazi',
    prenom: 'Yassine',
    email: 'yassine.tazi@usmba.ac.ma',
    role: 'candidat',
    structure: 'Laboratoire LTISI · Doctorant Réinscrit (3e Année)',
    statutCompte: 'Actif',
    dateAttribution: '2024-10-15 11:00',
    attribuPar: 'Scolarité CEDoc',
    derniereConnexion: '2026-11-02 21:10'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-001',
    timestamp: '2026-10-15 10:00:12',
    acteurNom: 'Salma El Amrani',
    acteurRole: 'candidat',
    tacheCode: 'TASK_PANIER_SUBMIT',
    tacheNom: 'Ajout de sujets au panier',
    objetType: 'Candidature',
    objetRef: 'PANIER-BK718293',
    actionType: 'CREATION',
    details: 'Ajout des sujets TH-2026-IA-01 et TH-2026-MATH-03 (Total: 2/3 vœux). Panier conforme.',
    statutResultat: 'Conforme',
    dureeMs: 140
  },
  {
    id: 'log-002',
    timestamp: '2026-10-18 11:15:45',
    acteurNom: 'Salma El Amrani',
    acteurRole: 'candidat',
    tacheCode: 'TASK_CANDIDATURE_SUBMIT',
    tacheNom: 'Soumission du dossier académique',
    objetType: 'Candidature',
    objetRef: 'DOS-2026-0841',
    actionType: 'CREATION',
    details: 'Dépôt unique des 6 pièces justificatives (Master UMV, relevés S1-S4, CV). Référence attribuée : DOS-2026-0841.',
    statutResultat: 'Enregistrée (GCD)',
    dureeMs: 620
  },
  {
    id: 'log-003',
    timestamp: '2026-10-22 14:00:00',
    acteurNom: 'Prof. Karim Bennani',
    acteurRole: 'professeur',
    tacheCode: 'TASK_PRESELECTION_EXAM',
    tacheNom: 'Examen de candidature & Présélection',
    objetType: 'Candidature',
    objetRef: 'DOS-2026-0841',
    actionType: 'VALIDATION',
    details: 'Dossier évalué conforme aux prérequis de recherche. Note académique attribuée : 17.5 / 20.',
    statutResultat: 'Présélectionné',
    dureeMs: 850
  },
  {
    id: 'log-004',
    timestamp: '2026-10-23 09:00:30',
    acteurNom: 'Commission Doctorale',
    acteurRole: 'professeur',
    tacheCode: 'TASK_SCHEDULE_INTERVIEW',
    tacheNom: 'Programmation de l\'entretien oral',
    objetType: 'Candidature',
    objetRef: 'DOS-2026-0841',
    actionType: 'CREATION',
    details: 'Convocation planifiée pour le 26/10/2026 à 09h30 en Salle A2 CEDoc.',
    statutResultat: 'Convoqué',
    dureeMs: 220
  },
  {
    id: 'log-005',
    timestamp: '2026-10-24 10:15:00',
    acteurNom: 'Administration CEDoc',
    acteurRole: 'administration',
    tacheCode: 'TASK_EXTEND_DEADLINE',
    tacheNom: 'Prolongation de la date de l\'entretien',
    objetType: 'Calendrier',
    objetRef: 'DOS-2026-0841',
    actionType: 'PROLONGATION',
    details: 'Date initiale du 26/10/2026 reportée au 04/11/2026 à 09h30. Motif : Déplacement du rapporteur en mission officielle.',
    statutResultat: 'Date Prolongée',
    dureeMs: 310
  },
  {
    id: 'log-006',
    timestamp: '2026-10-24 16:30:00',
    acteurNom: 'Prof. Mohamed Tazi',
    acteurRole: 'professeur',
    tacheCode: 'TASK_INTERVIEW_PV_SIGN',
    tacheNom: 'Établissement du PV d\'entretien oral',
    objetType: 'Candidature',
    objetRef: 'DOS-2026-0792',
    actionType: 'SIGNATURE',
    details: 'Candidat Omar Berrada auditionné. Note orale : 18.5/20. Avis Très Favorable. Délibération : ADMIS sur liste principale.',
    statutResultat: 'Admis',
    dureeMs: 980
  },
  {
    id: 'log-007',
    timestamp: '2026-10-26 14:15:20',
    acteurNom: 'Fatima Benjelloun',
    acteurRole: 'administration',
    tacheCode: 'TASK_ADMIN_VALIDATION',
    tacheNom: 'Contrôle des originaux & Inscription finale',
    objetType: 'DossierAdmin',
    objetRef: 'DOS-2026-0504',
    actionType: 'VALIDATION',
    details: 'Contrôle original diplôme Master USMBA + quitus acquitté. Inscription définitive validée. Matricule attribué : DOC-2026-CMACS-0042.',
    statutResultat: 'Inscrit Officiellement',
    dureeMs: 440
  },
  {
    id: 'log-008',
    timestamp: '2026-10-28 11:00:00',
    acteurNom: 'Direction du CEDoc',
    acteurRole: 'directeur_ced',
    tacheCode: 'TASK_EXTEND_CAMPAIGN_DEADLINE',
    tacheNom: 'Prolongation de la campagne de réinscription',
    objetType: 'Calendrier',
    objetRef: 'CAMPAGNE-REINSCRIPTION-2026',
    actionType: 'PROLONGATION',
    details: 'Prolongation générale de la date limite de dépôt des rapports d\'avancement du 30/10/2026 au 15/11/2026. Motif : Délibérations tardives des jurys de Master dans certains établissements partenaires.',
    statutResultat: 'Campagne Prolongée',
    dureeMs: 510
  }
];
