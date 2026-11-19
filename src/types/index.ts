export type Role = 
  | 'candidat'
  | 'plateforme_gcd'
  | 'professeur'
  | 'directeur_labo'
  | 'directeur_ced'
  | 'administration';

export type PortalMode = 
  | 'inscription' 
  | 'reinscription' 
  | 'progression' 
  | 'journalisation' 
  | 'diagramme' 
  | 'audit' 
  | 'roles' 
  | 'conception';

export type SubjectStatus = 
  | 'propose'               // Proposé par le professeur
  | 'valide_labo'          // Validé par le directeur de laboratoire
  | 'confirme_ced'         // Confirmé par le directeur du CED -> Publié sur GCD
  | 'rejete';

export interface ThesisSubject {
  id: string;
  code: string;
  titre: string;
  discipline: string;
  laboratoire: string;
  directeurThese: string;
  coDirecteur?: string;
  emailContact: string;
  resume: string;
  objectifs: string[];
  prerequis: string[];
  motsCles: string[];
  financement: string;
  status: SubjectStatus;
  dateCreation: string;
  placesDisponibles: number;
}

export type CandidatureStatus =
  | 'panier'
  | 'soumise'              // Enregistrée par GCD
  | 'en_examen'            // En examen par commission
  | 'rejetee_preselection' // Non présélectionné
  | 'preselectionne'       // Présélectionné -> entretien convoqué
  | 'entretien_passe'      // Entretien passé & PV rédigé
  | 'non_admis'            // Non admis après entretien -> notification admin
  | 'admis'                // Admis -> préparation documents administratifs
  | 'dossier_soumis'       // Dossier administratif reçu par l'administration
  | 'dossier_non_conforme' // Dossier non conforme -> correction demandée au candidat
  | 'inscription_validee'; // Validé par l'administration -> Inscription définitive

export interface InterviewDetails {
  dateHeure: string;
  lieuOuLien: string;
  mode: 'présentiel' | 'visio';
  juryMembres: string[];
  notesDossier?: number;
  notesOral?: number;
  pvCommentaire?: string;
  avisCommission?: 'Favorable' | 'Très favorable' | 'Défavorable';
  datePv?: string;
}

export interface AdministrativeFile {
  diplomeOriginalDepose: boolean;
  relevesOriginauxDeposes: boolean;
  charteTheseSignee: boolean;
  justificatifAssurance: boolean;
  autorisationEmployeurOuNonSalariat: boolean;
  quittanceFraisInscription: boolean;
  remarquesConformite?: string;
  matriculeAttribue?: string;
  dateValidationAdmin?: string;
}

// Jalon de progression avec détection et traçabilité des prolongations de date
export interface CandidatureMilestone {
  code: 'depot' | 'preselection' | 'entretien' | 'dossier_admin' | 'validation_finale';
  nomEtape: string;
  statut: 'termine' | 'en_cours' | 'a_venir' | 'rejete';
  dateInitiale: string; // Ex: "15/10/2026"
  datePrevueOuEffective: string; // Ex: "22/10/2026"
  estProlongee: boolean;
  motifProlongation?: string;
  auteurProlongation?: string;
  dateProlongation?: string;
}

export interface CandidateApplication {
  id: string;
  referenceDossier: string;
  candidatId: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  cinOuPasseport: string;
  dateNaissance: string;
  nationalite: string;
  derniereFormation: string;
  universiteOrigine: string;
  mentionMaster: string;
  moyenneGenerale: number;
  
  choixSujets: {
    subjectId: string;
    priorite: number; // 1, 2, 3
  }[];
  
  documentsDeposes: {
    cvNom: string;
    diplomeNom: string;
    relevesNom: string;
    lettreMotivationNom: string;
    projetRechercheNom: string;
    pieceIdentiteNom: string;
    dateDepot: string;
  };
  
  status: CandidatureStatus;
  dateSoumission: string;
  entretien?: InterviewDetails;
  dossierAdministratif?: AdministrativeFile;
  
  // Progression détaillée avec dates et prolongations
  jalons: CandidatureMilestone[];
  
  // Visas institutionnels additionnels (Directeur de laboratoire & Directeur CEDoc)
  visaLaboAccueil?: {
    accorde: boolean;
    dateVisa: string;
    directeurLaboNom: string;
    laboratoire: string;
    remarques?: string;
  };
  homologationCed?: {
    homologue: boolean;
    dateHomologation: string;
    directeurCedNom: string;
    observations?: string;
  };
  
  historique: {
    date: string;
    auteur: string;
    action: string;
    commentaire?: string;
  }[];
}

// ==========================================
// VOLET RÉINSCRIPTION (TABLEAU DE SYNTHÈSE 2)
// ==========================================

export type ReinscriptionStatus =
  | 'acces_ouvert'
  | 'rapport_en_cours'
  | 'rapport_soumis'
  | 'avis_directeur_rendu'
  | 'valide_laboratoire'
  | 'confirme_ced'
  | 'pieces_en_verification'
  | 'pieces_non_conformes'
  | 'reinscription_validee';

export interface ActivityReportPublication {
  titre: string;
  revueOuConference: string;
  statut: 'Publié' | 'Accepté' | 'Soumis' | 'En révision';
  indexation: string;
  annee: number;
}

export interface ActivityReport {
  anneeCible: number;
  avancementPourcentage: number;
  resumeAvancement: string;
  objectifsAtteints: string;
  difficultesEtSolutions: string;
  publications: ActivityReportPublication[];
  formationsValideesHeures: number;
  participationsCongres: string;
  calendrierPrevisionnelSoutenance: string;
  dateSoumission?: string;
}

export interface DirectorOpinion {
  decision: 'Favorable' | 'Très favorable' | 'Réservé' | 'Défavorable';
  appreciationQualite: 'Excellente' | 'Très bonne' | 'Satisfaisante' | 'Insuffisante';
  commentairesEtRecommandations: string;
  dateAvis: string;
  delaiRespecte: boolean;
}

export interface LabValidation {
  decision: 'Validé' | 'Rejeté' | 'En attente';
  directeurLaboNom: string;
  commentaires: string;
  dateValidation: string;
}

export interface CedConfirmation {
  decision: 'Confirmé' | 'Réservé' | 'En attente';
  directeurCedNom: string;
  commentaires: string;
  dateConfirmation: string;
}

export interface ReinscriptionAdminAudit {
  quittanceDroitsPayee: boolean;
  attestationAssuranceValide: boolean;
  rapportValidePresent: boolean;
  ficheReinscriptionTelechargee: boolean;
  statutPieces: 'conforme' | 'incomplet' | 'a_corriger';
  piecesManquantes: string[];
  dateControle?: string;
}

export interface DoctoralReEnrollment {
  id: string;
  matriculeDoctorant: string;
  doctorantId: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  cin: string;
  sujetThese: string;
  directeurThese: string;
  laboratoire: string;
  anneeTheseEnCours: number;
  anneeTheseSollicitee: number;
  anneeUniversitaire: string;
  
  status: ReinscriptionStatus;
  dateDebutDemande: string;
  
  rapportActivites: ActivityReport;
  avisDirecteur?: DirectorOpinion;
  validationLabo?: LabValidation;
  confirmationCed?: CedConfirmation;
  dossierAdministratif: ReinscriptionAdminAudit;
  
  dateValidationFinale?: string;
  nouvelleAttestationNumero?: string;
  
  historique: {
    date: string;
    acteur: string;
    etape: string;
    action: string;
  }[];
}

export interface UserAccount {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  estActif: boolean;
  tokenActivation?: string;
  dateCreation: string;
  typeCompte?: 'candidat' | 'doctorant_inscrit';
  matricule?: string;
}

export interface AcademicAccount {
  id: string;
  email: string;
  motDePasse: string;
  nom: string;
  prenom: string;
  role: Role;
  titre: string;
  structure: string;
  departement?: string;
  matriculeOuCin?: string;
  avatarBg: string;
  initiales: string;
  statutCompte: 'Actif' | 'Suspendu';
  dateCreation: string;
  derniereConnexion?: string;
  fournisseurAuth?: 'google' | 'academique_standard';
  googleEmail?: string;
  estLieAGoogle?: boolean;
}

// ==========================================
// JOURNALISATION (AUDIT LOG & TÂCHES)
// ==========================================

export type ActionType = 
  | 'CREATION' 
  | 'VALIDATION' 
  | 'REJET' 
  | 'MODIFICATION' 
  | 'PROLONGATION' 
  | 'SIGNATURE'
  | 'CONNEXION';

export interface AuditLogEntry {
  id: string;
  timestamp: string; // Ex: "2026-11-03 10:24:15"
  acteurNom: string;
  acteurRole: Role;
  tacheCode: string; // Ex: "TASK_PROPOSE_THESIS", "TASK_PRESELECTION", "TASK_EXTEND_DEADLINE"
  tacheNom: string;
  objetType: 'Candidature' | 'Sujet' | 'RapportActivite' | 'DossierAdmin' | 'RolePrivilege' | 'Calendrier';
  objetRef: string; // Ex: "DOS-2026-0841", "TH-2026-IA-01"
  actionType: ActionType;
  details: string;
  statutResultat: string;
  dureeMs?: number;
}

// ==========================================
// GESTION DES ATTRIBUTIONS & PRIVILÈGES (RBAC)
// ==========================================

export type BusinessObject = 
  | 'sujets_these'
  | 'panier_voeux'
  | 'dossier_candidature'
  | 'pv_entretien'
  | 'rapport_activites'
  | 'visas_reinscription'
  | 'dossier_admin_quittance'
  | 'attestation_matricule'
  | 'calendrier_delais';

export interface PrivilegeRule {
  lecture: boolean;
  creation: boolean;
  modification: boolean;
  suppression: boolean;
  validation: boolean;
  prolongation_delai: boolean;
}

export interface ObjectPrivilegeMatrix {
  objet: BusinessObject;
  labelObjet: string;
  description: string;
  privilegesParRole: Record<Role, PrivilegeRule>;
}

export interface UserRoleAssignment {
  userId: string;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  structure: string;
  statutCompte: 'Actif' | 'Suspendu';
  dateAttribution: string;
  attribuPar: string;
  derniereConnexion?: string;
}

// ==========================================
// CONCEPTION / DÉBATS ACTEURS
// ==========================================

export interface DebateStep {
  numeroEtape: number;
  titreEtape: string;
  iconName: string;
  casUtilisation: string[];
  processusPhysique: string[];
  processusNumerique: string[];
  problemesRencontres: string[];
  solutionsOrganisationnelles: string[];
  solutionsInformatiques: string[];
  correspondanceApplication: {
    couleur: string;
    description: string;
    roleLie: Role;
    lienDirectAction?: string;
  };
}

export interface DebateMatrix {
  titre: string;
  sousTitre: string;
  objectifGlobal: string;
  type: 'inscription' | 'reinscription';
  etapes: DebateStep[];
}
