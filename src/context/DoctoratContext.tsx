import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Role, 
  PortalMode,
  ThesisSubject, 
  CandidateApplication, 
  UserAccount, 
  InterviewDetails,
  DoctoralReEnrollment,
  ActivityReport,
  DirectorOpinion,
  AuditLogEntry,
  UserRoleAssignment,
  ObjectPrivilegeMatrix,
  BusinessObject,
  PrivilegeRule,
  CandidatureMilestone,
  ActionType,
  AcademicAccount
} from '../types';
import { 
  INITIAL_SUBJECTS, 
  INITIAL_CANDIDATES, 
  INITIAL_USER, 
  INITIAL_REINSCRIPTIONS 
} from '../data/mockData';
import {
  DEFAULT_OBJECT_PRIVILEGES,
  INITIAL_USER_ROLE_ASSIGNMENTS,
  INITIAL_AUDIT_LOGS
} from '../data/rbacAndAuditData';
import { INITIAL_ACADEMIC_ACCOUNTS } from '../data/academicAccounts';

interface DoctoratContextType {
  role: Role;
  setRole: (role: Role) => void;
  portalMode: PortalMode;
  setPortalMode: (mode: PortalMode) => void;
  
  // Comptes Académiques & Authentification Multi-Acteurs
  accounts: AcademicAccount[];
  currentAccount: AcademicAccount | null;
  isAcademicAuthModalOpen: boolean;
  setIsAcademicAuthModalOpen: (open: boolean) => void;
  loginWithAcademicAccount: (email: string, motDePasse?: string) => { success: boolean; message: string; account?: AcademicAccount };
  loginWithGoogleAccount: (googleEmail: string, role?: Role, nom?: string, prenom?: string) => { success: boolean; message: string; account?: AcademicAccount };
  loginAsActor: (actorRole: Role) => void;
  logoutAccount: () => void;
  createCandidateAcademicAccount: (data: { nom: string; prenom: string; email: string; motDePasse: string; structure?: string }) => { success: boolean; message: string; account?: AcademicAccount };

  // Volet Inscription
  subjects: ThesisSubject[];
  cart: string[];
  addToCart: (subjectId: string) => { success: boolean; message: string };
  removeFromCart: (subjectId: string) => void;
  clearCart: () => void;
  user: UserAccount | null;
  pendingActivationEmail: { email: string; token: string } | null;
  registerAccount: (email: string, nom: string, prenom: string, typeCompte?: 'candidat' | 'doctorant_inscrit') => void;
  activateAccount: (token: string) => boolean;
  login: (email: string) => boolean;
  logout: () => void;
  applications: CandidateApplication[];
  submitApplication: (formData: {
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
    documents: {
      cvNom: string;
      diplomeNom: string;
      relevesNom: string;
      lettreMotivationNom: string;
      projetRechercheNom: string;
      pieceIdentiteNom: string;
    };
  }) => { success: boolean; message: string; applicationId?: string };
  
  // Commission actions (Inscription)
  proposeSubject: (newSubject: Omit<ThesisSubject, 'id' | 'code' | 'status' | 'dateCreation'>) => void;
  preselectCandidate: (appId: string, preselected: boolean, noteDossier?: number, motif?: string) => void;
  scheduleInterviewAndPv: (appId: string, interview: InterviewDetails, decision: 'admis' | 'non_admis') => void;
  validateLabSubject: (subjectId: string, validate: boolean) => void;
  confirmCedSubject: (subjectId: string) => void;
  validateLabHosting: (appId: string, accorde: boolean, remarques?: string) => void;
  homologateCedApplication: (appId: string, homologue: boolean, observations?: string) => void;
  submitAdminDossier: (appId: string) => void;
  checkAdministrativeConformity: (appId: string, isConforme: boolean, remarks?: string) => void;
  correctDossier: (appId: string, comment: string) => void;
  notifyNonAdmission: (appId: string) => void;
  
  // Volet Réinscription (Tableau de synthèse 2)
  reinscriptions: DoctoralReEnrollment[];
  submitActivityReport: (id: string, report: ActivityReport) => void;
  giveDirectorOpinion: (id: string, opinion: DirectorOpinion) => void;
  validateLabReinscription: (id: string, isValide: boolean, commentaire: string) => void;
  confirmCedReinscription: (id: string, isConfirme: boolean, observations?: string) => void;
  auditReinscriptionAdmin: (id: string, isConforme: boolean, piecesManquantes?: string[]) => void;
  startNewReinscription: (matricule: string) => { success: boolean; message: string; item?: DoctoralReEnrollment };

  // Suivi de progression & Prolongation de dates
  prolongMilestoneDate: (
    applicationId: string, 
    milestoneCode: 'depot' | 'preselection' | 'entretien' | 'dossier_admin' | 'validation_finale', 
    newDate: string, 
    motif: string, 
    auteur?: string
  ) => void;

  // Journalisation & Audit des tâches
  auditLogs: AuditLogEntry[];
  logTask: (entry: {
    tacheCode: string;
    tacheNom: string;
    objetType: 'Candidature' | 'Sujet' | 'RapportActivite' | 'DossierAdmin' | 'RolePrivilege' | 'Calendrier';
    objetRef: string;
    actionType: ActionType;
    details: string;
    statutResultat: string;
    acteurNom?: string;
    acteurRole?: Role;
    dureeMs?: number;
  }) => void;
  clearAuditLogs: () => void;

  // Gestion des attributions de rôles & Privilèges (RBAC)
  userAssignments: UserRoleAssignment[];
  updateUserRole: (userId: string, newRole: Role, structure?: string) => void;
  toggleUserStatus: (userId: string) => void;
  addUserAssignment: (newUser: Omit<UserRoleAssignment, 'userId' | 'dateAttribution'>) => void;
  privilegeMatrix: ObjectPrivilegeMatrix[];
  updatePrivilege: (objectCode: BusinessObject, targetRole: Role, privilege: keyof PrivilegeRule, value: boolean) => void;
  resetPrivilegesToDefault: () => void;

  // Conception / Débat des acteurs
  isDiagramModalOpen: boolean;
  setIsDiagramModalOpen: (open: boolean) => void;
  conceptionTab: 'inscription' | 'reinscription' | 'uml';
  setConceptionTab: (tab: 'inscription' | 'reinscription' | 'uml') => void;
  highlightedDiagramStep: string | null;
  setHighlightedDiagramStep: (step: string | null) => void;
  
  // Reset demo
  resetDataToDefault: () => void;
}

const DoctoratContext = createContext<DoctoratContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_SUBJECTS = 'gcd_doctorat_subjects_v2';
const LOCAL_STORAGE_KEY_APPS = 'gcd_doctorat_apps_v2';
const LOCAL_STORAGE_KEY_REINSCR = 'gcd_doctorat_reinscriptions_v2';
const LOCAL_STORAGE_KEY_USER = 'gcd_doctorat_user_v2';
const LOCAL_STORAGE_KEY_CART = 'gcd_doctorat_cart_v2';
const LOCAL_STORAGE_KEY_AUDIT = 'gcd_doctorat_audit_logs_v2';
const LOCAL_STORAGE_KEY_USERS_RBAC = 'gcd_doctorat_user_roles_v2';
const LOCAL_STORAGE_KEY_PRIVILEGES = 'gcd_doctorat_rbac_matrix_v2';
const LOCAL_STORAGE_KEY_ACCOUNTS = 'gcd_doctorat_academic_accounts_usmba_v4';
const LOCAL_STORAGE_KEY_CURRENT_ACCOUNT = 'gcd_doctorat_current_account_usmba_v4';

export const DoctoratProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<AcademicAccount[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ACCOUNTS);
      return saved ? JSON.parse(saved) : INITIAL_ACADEMIC_ACCOUNTS;
    } catch {
      return INITIAL_ACADEMIC_ACCOUNTS;
    }
  });

  const [currentAccount, setCurrentAccount] = useState<AcademicAccount | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT_ACCOUNT);
      if (saved) return JSON.parse(saved);
      return INITIAL_ACADEMIC_ACCOUNTS[1]; // Default connected as Prof. Karim Bennani
    } catch {
      return INITIAL_ACADEMIC_ACCOUNTS[1];
    }
  });

  const [isAcademicAuthModalOpen, setIsAcademicAuthModalOpen] = useState(false);
  const [role, setRole] = useState<Role>(() => currentAccount ? currentAccount.role : 'professeur');
  const [portalMode, setPortalMode] = useState<PortalMode>('inscription');
  const [isDiagramModalOpen, setIsDiagramModalOpen] = useState(false);
  const [conceptionTab, setConceptionTab] = useState<'inscription' | 'reinscription' | 'uml'>('inscription');
  const [highlightedDiagramStep, setHighlightedDiagramStep] = useState<string | null>(null);

  const [subjects, setSubjects] = useState<ThesisSubject[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SUBJECTS);
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  });

  const [applications, setApplications] = useState<CandidateApplication[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_APPS);
      return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
    } catch {
      return INITIAL_CANDIDATES;
    }
  });

  const [reinscriptions, setReinscriptions] = useState<DoctoralReEnrollment[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_REINSCR);
      return saved ? JSON.parse(saved) : INITIAL_REINSCRIPTIONS;
    } catch {
      return INITIAL_REINSCRIPTIONS;
    }
  });

  const [cart, setCart] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CART);
      return saved ? JSON.parse(saved) : ['subj-1', 'subj-2'];
    } catch {
      return ['subj-1', 'subj-2'];
    }
  });

  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_AUDIT);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [userAssignments, setUserAssignments] = useState<UserRoleAssignment[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USERS_RBAC);
      return saved ? JSON.parse(saved) : INITIAL_USER_ROLE_ASSIGNMENTS;
    } catch {
      return INITIAL_USER_ROLE_ASSIGNMENTS;
    }
  });

  const [privilegeMatrix, setPrivilegeMatrix] = useState<ObjectPrivilegeMatrix[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PRIVILEGES);
      return saved ? JSON.parse(saved) : DEFAULT_OBJECT_PRIVILEGES;
    } catch {
      return DEFAULT_OBJECT_PRIVILEGES;
    }
  });

  const [pendingActivationEmail, setPendingActivationEmail] = useState<{ email: string; token: string } | null>(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_APPS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_REINSCR, JSON.stringify(reinscriptions));
  }, [reinscriptions]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_USERS_RBAC, JSON.stringify(userAssignments));
  }, [userAssignments]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PRIVILEGES, JSON.stringify(privilegeMatrix));
  }, [privilegeMatrix]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
    }
  }, [user]);

  // Inscription Methods
  const addToCart = (subjectId: string): { success: boolean; message: string } => {
    if (cart.includes(subjectId)) {
      return { success: false, message: 'Ce sujet est déjà dans votre panier.' };
    }
    if (cart.length >= 3) {
      setHighlightedDiagramStep('panier_non_conforme');
      return { 
        success: false, 
        message: 'Règle stricte du CED : Le panier ne peut contenir que 3 sujets au maximum. Veuillez modifier votre panier avant d\'ajouter un autre sujet.' 
      };
    }
    const newCart = [...cart, subjectId];
    setCart(newCart);
    return { success: true, message: 'Sujet ajouté au panier.' };
  };

  const removeFromCart = (subjectId: string) => {
    setCart(prev => prev.filter(id => id !== subjectId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const registerAccount = (email: string, nom: string, prenom: string, typeCompte: 'candidat' | 'doctorant_inscrit' = 'candidat') => {
    const token = 'ACT-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    setPendingActivationEmail({ email, token });
    setHighlightedDiagramStep('email_activation');
  };

  const activateAccount = (token: string): boolean => {
    if (pendingActivationEmail && pendingActivationEmail.token === token) {
      const newUser: UserAccount = {
        id: 'usr-' + Date.now(),
        email: pendingActivationEmail.email,
        nom: 'Nouveau',
        prenom: 'Doctorant',
        estActif: true,
        dateCreation: new Date().toISOString(),
        typeCompte: 'candidat'
      };
      setUser(newUser);
      setPendingActivationEmail(null);
      setHighlightedDiagramStep('se_connecter');
      return true;
    }
    return false;
  };

  const login = (email: string): boolean => {
    // Check in candidate applications
    const existingCand = applications.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (existingCand) {
      setUser({
        id: existingCand.candidatId,
        email: existingCand.email,
        nom: existingCand.nom,
        prenom: existingCand.prenom,
        estActif: true,
        dateCreation: '2026-10-01',
        typeCompte: 'candidat'
      });
      return true;
    }

    // Check in re-enrollment doctorants
    const existingDoctorant = reinscriptions.find(r => r.email.toLowerCase() === email.toLowerCase());
    if (existingDoctorant) {
      setUser({
        id: existingDoctorant.doctorantId,
        email: existingDoctorant.email,
        nom: existingDoctorant.nom,
        prenom: existingDoctorant.prenom,
        estActif: true,
        dateCreation: '2025-10-01',
        typeCompte: 'doctorant_inscrit',
        matricule: existingDoctorant.matriculeDoctorant
      });
      return true;
    }

    // Default demo login
    setUser({
      id: 'usr-candidat-1',
      email: email,
      nom: 'El Amrani',
      prenom: 'Salma',
      estActif: true,
      dateCreation: '2026-10-17',
      typeCompte: 'candidat'
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const submitApplication = (formData: {
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
    documents: {
      cvNom: string;
      diplomeNom: string;
      relevesNom: string;
      lettreMotivationNom: string;
      projetRechercheNom: string;
      pieceIdentiteNom: string;
    };
  }) => {
    if (cart.length === 0) {
      return { success: false, message: 'Votre panier est vide. Sélectionnez au moins un sujet de thèse.' };
    }
    if (cart.length > 3) {
      return { success: false, message: 'Votre panier dépasse la limite autorisée de 3 sujets maximum.' };
    }

    const referenceDossier = `DOS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const newApp: CandidateApplication = {
      id: 'cand-app-' + Date.now(),
      referenceDossier,
      candidatId: user?.id || 'usr-' + Date.now(),
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      telephone: formData.telephone,
      cinOuPasseport: formData.cinOuPasseport,
      dateNaissance: formData.dateNaissance,
      nationalite: formData.nationalite,
      derniereFormation: formData.derniereFormation,
      universiteOrigine: formData.universiteOrigine,
      mentionMaster: formData.mentionMaster,
      moyenneGenerale: formData.moyenneGenerale,
      choixSujets: cart.map((sId, idx) => ({
        subjectId: sId,
        priorite: idx + 1
      })),
      documentsDeposes: {
        cvNom: formData.documents.cvNom || 'CV_Officiel.pdf',
        diplomeNom: formData.documents.diplomeNom || 'Diplome_Master.pdf',
        relevesNom: formData.documents.relevesNom || 'Releves_Notes_S1_S4.pdf',
        lettreMotivationNom: formData.documents.lettreMotivationNom || 'Lettre_Motivation.pdf',
        projetRechercheNom: formData.documents.projetRechercheNom || 'Projet_These.pdf',
        pieceIdentiteNom: formData.documents.pieceIdentiteNom || 'Piece_Identite.pdf',
        dateDepot: now
      },
      status: 'soumise',
      dateSoumission: now,
      jalons: [
        {
          code: 'depot',
          nomEtape: 'Dépôt & Choix de sujets (Panier max 3)',
          statut: 'termine',
          dateInitiale: formattedDate.split(' ')[0],
          datePrevueOuEffective: formattedDate.split(' ')[0],
          estProlongee: false
        },
        {
          code: 'preselection',
          nomEtape: 'Examen des dossiers & Présélection',
          statut: 'en_cours',
          dateInitiale: '05/11/2026',
          datePrevueOuEffective: '05/11/2026',
          estProlongee: false
        },
        {
          code: 'entretien',
          nomEtape: 'Entretien oral & Délibération du PV',
          statut: 'a_venir',
          dateInitiale: '12/11/2026',
          datePrevueOuEffective: '12/11/2026',
          estProlongee: false
        },
        {
          code: 'dossier_admin',
          nomEtape: 'Vérification du dossier administratif & originaux',
          statut: 'a_venir',
          dateInitiale: '18/11/2026',
          datePrevueOuEffective: '18/11/2026',
          estProlongee: false
        },
        {
          code: 'validation_finale',
          nomEtape: 'Inscription définitive & Attribution du matricule',
          statut: 'a_venir',
          dateInitiale: '25/11/2026',
          datePrevueOuEffective: '25/11/2026',
          estProlongee: false
        }
      ],
      historique: [
        {
          date: formattedDate,
          auteur: 'Plateforme GCD',
          action: `Candidature enregistrée avec succès sous la référence ${referenceDossier} (${cart.length} vœux formulés).`
        }
      ]
    };

    setApplications(prev => [newApp, ...prev]);
    setCart([]);
    setHighlightedDiagramStep('enregistrer_candidature');

    logTask({
      tacheCode: 'TASK_CANDIDATURE_SUBMIT',
      tacheNom: 'Soumission du dossier de candidature',
      objetType: 'Candidature',
      objetRef: referenceDossier,
      actionType: 'CREATION',
      details: `Dossier soumis par ${formData.prenom} ${formData.nom} pour ${cart.length} sujet(s). Mention Master : ${formData.mentionMaster}.`,
      statutResultat: 'Enregistrée (GCD)',
      acteurNom: `${formData.prenom} ${formData.nom}`,
      acteurRole: 'candidat'
    });

    return { success: true, message: 'Candidature soumise et enregistrée par la Plateforme GCD !', applicationId: newApp.id };
  };

  const proposeSubject = (newSubjectData: Omit<ThesisSubject, 'id' | 'code' | 'status' | 'dateCreation'>) => {
    const id = 'subj-' + Date.now();
    const code = `TH-2026-${newSubjectData.discipline.substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
    const newSubject: ThesisSubject = {
      ...newSubjectData,
      id,
      code,
      status: 'propose',
      dateCreation: new Date().toISOString().split('T')[0]
    };
    setSubjects(prev => [newSubject, ...prev]);
    setHighlightedDiagramStep('valider_sujets_labo');
  };

  const validateLabSubject = (subjectId: string, validate: boolean) => {
    setSubjects(prev => prev.map(s => {
      if (s.id === subjectId) {
        return {
          ...s,
          status: validate ? 'valide_labo' : 'rejete'
        };
      }
      return s;
    }));
  };

  const confirmCedSubject = (subjectId: string) => {
    setSubjects(prev => prev.map(s => {
      if (s.id === subjectId) {
        return {
          ...s,
          status: 'confirme_ced'
        };
      }
      return s;
    }));
  };

  const validateLabHosting = (appId: string, accorde: boolean, remarques?: string) => {
    const formattedDate = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          visaLaboAccueil: {
            accorde,
            dateVisa: formattedDate,
            directeurLaboNom: currentAccount ? `${currentAccount.prenom} ${currentAccount.nom}` : 'Direction du Laboratoire',
            laboratoire: currentAccount?.structure || 'Laboratoire de Recherche USMBA',
            remarques: remarques || (accorde ? 'Capacité d\'accueil confirmée et conformité des moyens de recherche.' : 'Capacité d\'accueil dépassée.')
          },
          historique: [
            ...app.historique,
            {
              date: formattedDate,
              auteur: 'Direction du Laboratoire',
              action: accorde
                ? `Visa d'accueil au laboratoire ACCORDÉ (Quotas d'encadrement vérifiés).`
                : `Visa d'accueil REFUSÉ ou en attente. Motif : ${remarques || 'Capacité saturée'}`
            }
          ]
        };
      }
      return app;
    }));

    logTask({
      tacheCode: 'TASK_LABO_HOSTING_VISA',
      tacheNom: 'Visa d\'accueil au laboratoire',
      objetType: 'Candidature',
      objetRef: appId,
      actionType: 'VALIDATION',
      details: accorde ? 'Visa d\'accueil accordé par la direction de recherche' : `Refus visa : ${remarques}`,
      statutResultat: accorde ? 'Accordé' : 'Refusé',
      acteurRole: 'directeur_labo'
    });
  };

  const homologateCedApplication = (appId: string, homologue: boolean, observations?: string) => {
    const formattedDate = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        // When homologated by CEDoc, candidate is confirmed admitted on primary list
        const nextStatus = homologue 
          ? (['preselectionne', 'soumise', 'en_examen'].includes(app.status) ? 'admis' : app.status)
          : app.status;

        const updatedJalons = (app.jalons || []).map(j => {
          if (homologue) {
            if (j.code === 'preselection' || j.code === 'entretien') {
              return { ...j, statut: 'termine' as const };
            }
            if (j.code === 'dossier_admin') {
              return { ...j, statut: 'en_cours' as const };
            }
          }
          return j;
        });

        const updatedInterview = app.entretien ? {
          ...app.entretien,
          avisCommission: app.entretien.avisCommission || 'Favorable',
          notesOral: app.entretien.notesOral || 17.5,
          datePv: app.entretien.datePv || formattedDate
        } : {
          dateHeure: formattedDate,
          lieuOuLien: 'Salle de Commission - Bâtiment CEDoc USMBA',
          mode: 'présentiel' as const,
          juryMembres: ['Commission Doctorale & Direction CEDoc'],
          notesDossier: 17,
          notesOral: 17.5,
          avisCommission: 'Favorable' as const,
          datePv: formattedDate
        };

        return {
          ...app,
          status: nextStatus,
          jalons: updatedJalons,
          entretien: updatedInterview,
          homologationCed: {
            homologue,
            dateHomologation: formattedDate,
            directeurCedNom: currentAccount ? `${currentAccount.prenom} ${currentAccount.nom}` : 'Direction du CEDoc (Prof. Amina Chraibi)',
            observations: observations || (homologue ? 'Liste principale homologuée par le Conseil du CEDoc. Quotas et bourses validés. Transmission autorisée à la Scolarité.' : 'Réserves émises par le CEDoc.')
          },
          historique: [
            ...app.historique,
            {
              date: formattedDate,
              auteur: 'Direction du CEDoc',
              action: homologue
                ? `Candidature et délibérations HOMOLOGUÉES par le CEDoc. Candidat déclaré Admis sur Liste Principale (Quotas et financement validés).`
                : `Homologation mise en réserve par le CEDoc : ${observations || 'Quotas à régulariser'}`
            }
          ]
        };
      }
      return app;
    }));

    logTask({
      tacheCode: 'TASK_CEDOC_HOMOLOGATION',
      tacheNom: 'Homologation des admissions CEDoc',
      objetType: 'Candidature',
      objetRef: appId,
      actionType: 'VALIDATION',
      details: homologue ? 'Homologation officielle de la liste principale' : `Réserves : ${observations}`,
      statutResultat: homologue ? 'Homologué' : 'En réserve',
      acteurRole: 'directeur_ced'
    });
  };

  const preselectCandidate = (appId: string, preselected: boolean, noteDossier?: number, motif?: string) => {
    const formattedDate = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const newStatus = preselected ? 'preselectionne' : 'rejetee_preselection';
        return {
          ...app,
          status: newStatus,
          entretien: preselected ? {
            dateHeure: '',
            lieuOuLien: '',
            mode: 'présentiel',
            juryMembres: [],
            notesDossier: noteDossier || 16
          } : undefined,
          historique: [
            ...app.historique,
            {
              date: formattedDate,
              auteur: 'Commission de Thèse',
              action: preselected 
                ? `Candidat présélectionné pour l'entretien (Note dossier : ${noteDossier || 16}/20).` 
                : `Candidature non présélectionnée.${motif ? ' Motif : ' + motif : ''}`
            }
          ]
        };
      }
      return app;
    }));
  };

  const scheduleInterviewAndPv = (appId: string, interview: InterviewDetails, decision: 'admis' | 'non_admis') => {
    const formattedDate = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const newStatus = decision === 'admis' ? 'admis' : 'non_admis';
        return {
          ...app,
          status: newStatus,
          entretien: {
            ...interview,
            datePv: formattedDate
          },
          historique: [
            ...app.historique,
            {
              date: formattedDate,
              auteur: 'Commission de Thèse',
              action: `Entretien évalué & PV établi (Oral : ${interview.notesOral || 17}/20, Avis : ${interview.avisCommission}). Décision de la Commission : ${decision === 'admis' ? 'CANDIDAT ADMIS' : 'NON ADMIS'}.`
            }
          ]
        };
      }
      return app;
    }));
  };

  const submitAdminDossier = (appId: string) => {
    const formattedDate = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: 'dossier_soumis',
          dossierAdministratif: {
            diplomeOriginalDepose: true,
            relevesOriginauxDeposes: true,
            charteTheseSignee: true,
            justificatifAssurance: true,
            autorisationEmployeurOuNonSalariat: true,
            quittanceFraisInscription: true
          },
          historique: [
            ...app.historique,
            {
              date: formattedDate,
              auteur: 'Candidat',
              action: 'Dossier administratif prérempli et pièces requises déposés pour vérification au guichet CED.'
            }
          ]
        };
      }
      return app;
    }));
  };

  const checkAdministrativeConformity = (appId: string, isConforme: boolean, remarks?: string) => {
    const formattedDate = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        if (isConforme) {
          const matricule = `DOC-2026-${app.nom.toUpperCase().replace(/\s+/g, '')}-${Math.floor(100 + Math.random() * 900)}`;
          return {
            ...app,
            status: 'inscription_validee',
            dossierAdministratif: {
              ...(app.dossierAdministratif || {
                diplomeOriginalDepose: true,
                relevesOriginauxDeposes: true,
                charteTheseSignee: true,
                justificatifAssurance: true,
                autorisationEmployeurOuNonSalariat: true,
                quittanceFraisInscription: true
              }),
              matriculeAttribue: matricule,
              dateValidationAdmin: formattedDate
            },
            historique: [
              ...app.historique,
              {
                date: formattedDate,
                auteur: 'Administration CED',
                action: `Dossier administratif CONFORME. Inscription en doctorat validée avec succès ! Matricule officiel : ${matricule}`
              }
            ]
          };
        } else {
          return {
            ...app,
            status: 'dossier_non_conforme',
            dossierAdministratif: {
              ...(app.dossierAdministratif || {
                diplomeOriginalDepose: false,
                relevesOriginauxDeposes: false,
                charteTheseSignee: false,
                justificatifAssurance: false,
                autorisationEmployeurOuNonSalariat: false,
                quittanceFraisInscription: false
              }),
              remarquesConformite: remarks || 'Pièces manquantes ou illisibles à compléter.'
            },
            historique: [
              ...app.historique,
              {
                date: formattedDate,
                auteur: 'Administration CED',
                action: `Dossier administratif NON CONFORME. Demande de régularisation envoyée au candidat. Motif : ${remarks || 'Documents à corriger'}`
              }
            ]
          };
        }
      }
      return app;
    }));
  };

  const correctDossier = (appId: string, comment: string) => {
    const formattedDate = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: 'dossier_soumis',
          dossierAdministratif: {
            ...app.dossierAdministratif,
            diplomeOriginalDepose: true,
            relevesOriginauxDeposes: true,
            charteTheseSignee: true,
            justificatifAssurance: true,
            autorisationEmployeurOuNonSalariat: true,
            quittanceFraisInscription: true,
            remarquesConformite: undefined
          },
          historique: [
            ...app.historique,
            {
              date: formattedDate,
              auteur: 'Candidat',
              action: `Dossier corrigé et renvoyé à l'administration. Note : ${comment}`
            }
          ]
        };
      }
      return app;
    }));
  };

  const notifyNonAdmission = (appId: string) => {
    const formattedDate = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          historique: [
            ...app.historique,
            {
              date: formattedDate,
              auteur: 'Administration CED',
              action: 'Notification officielle de non-admission transmise au candidat avec relevé des délibérations.'
            }
          ]
        };
      }
      return app;
    }));
  };

  // ==========================================
  // RÉINSCRIPTION (Synthèse 2 des Acteurs)
  // ==========================================

  // Étape 1 : Accès & création d'une nouvelle demande
  const startNewReinscription = (matricule: string) => {
    const existing = reinscriptions.find(r => r.matriculeDoctorant.toLowerCase() === matricule.toLowerCase());
    if (existing) {
      return { success: true, message: 'Dossier de réinscription déjà existant.', item: existing };
    }

    const newItem: DoctoralReEnrollment = {
      id: 're-2026-' + Date.now().toString().slice(-4),
      matriculeDoctorant: matricule,
      doctorantId: user?.id || 'usr-' + Date.now(),
      nom: user?.nom || 'Doctorant',
      prenom: user?.prenom || 'Inscrit',
      email: user?.email || 'doctorant@usmba.ac.ma',
      telephone: '+212 6 00 00 00 00',
      cin: 'AA' + Math.floor(100000 + Math.random() * 900000),
      sujetThese: 'Sujet de Recherche Doctorale Approuvé au CED',
      directeurThese: 'Prof. Karim Bennani',
      laboratoire: 'Laboratoire des Technologies de l\'Information et Systèmes Intelligents (LTISI)',
      anneeTheseEnCours: 1,
      anneeTheseSollicitee: 2,
      anneeUniversitaire: '2026/2027',
      status: 'rapport_en_cours',
      dateDebutDemande: new Date().toISOString().split('T')[0],
      rapportActivites: {
        anneeCible: 2,
        avancementPourcentage: 30,
        resumeAvancement: '',
        objectifsAtteints: '',
        difficultesEtSolutions: '',
        publications: [],
        formationsValideesHeures: 30,
        participationsCongres: '',
        calendrierPrevisionnelSoutenance: '2028'
      },
      dossierAdministratif: {
        quittanceDroitsPayee: false,
        attestationAssuranceValide: false,
        rapportValidePresent: false,
        ficheReinscriptionTelechargee: false,
        statutPieces: 'incomplet',
        piecesManquantes: ['Quittance des droits de réinscription', 'Attestation d\'assurance']
      },
      historique: [
        {
          date: new Date().toLocaleDateString('fr-FR') + ' ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          acteur: 'Doctorant',
          etape: '1. Accès réinscription',
          action: 'Ouverture du dossier de réinscription pour l\'année universitaire 2026/2027.'
        }
      ]
    };

    setReinscriptions(prev => [newItem, ...prev]);
    return { success: true, message: 'Dossier de réinscription ouvert avec succès !', item: newItem };
  };

  // Étape 2 : Rapport d'activités
  const submitActivityReport = (id: string, report: ActivityReport) => {
    const formattedDate = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    setReinscriptions(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'rapport_soumis',
          rapportActivites: {
            ...report,
            dateSoumission: formattedDate
          },
          historique: [
            ...item.historique,
            {
              date: formattedDate,
              acteur: 'Doctorant',
              etape: '2. Rapport d\'activités',
              action: `Rapport d'activités annuel renseigné et soumis sur GCD (${report.avancementPourcentage}% d'avancement, ${report.publications.length} publication(s)).`
            }
          ]
        };
      }
      return item;
    }));
  };

  // Étape 3 : Avis du directeur de thèse
  const giveDirectorOpinion = (id: string, opinion: DirectorOpinion) => {
    const formattedDate = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    setReinscriptions(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'avis_directeur_rendu',
          avisDirecteur: opinion,
          historique: [
            ...item.historique,
            {
              date: formattedDate,
              acteur: 'Directeur de Thèse',
              etape: '3. Avis Directeur',
              action: `Avis ${opinion.decision.toUpperCase()} accordé (Qualité : ${opinion.appreciationQualite}). Recommandations transmises.`
            }
          ]
        };
      }
      return item;
    }));
  };

  // Étape 4 : Validation de la structure / laboratoire
  const validateLabReinscription = (id: string, isValide: boolean, commentaire: string) => {
    const formattedDate = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    setReinscriptions(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: isValide ? 'valide_laboratoire' : 'rapport_en_cours',
          validationLabo: {
            decision: isValide ? 'Validé' : 'Rejeté',
            directeurLaboNom: 'Directeur du Laboratoire',
            commentaires: commentaire,
            dateValidation: formattedDate
          },
          historique: [
            ...item.historique,
            {
              date: formattedDate,
              acteur: 'Directeur Laboratoire',
              etape: '4. Validation Structure',
              action: isValide 
                ? 'Dossier de réinscription validé par le laboratoire d\'accueil.' 
                : `Demande de révision au niveau du laboratoire : ${commentaire}`
            }
          ]
        };
      }
      return item;
    }));
  };

  // Étape 5 : Confirmation du CED
  const confirmCedReinscription = (id: string, isConfirme: boolean, observations?: string) => {
    const formattedDate = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    setReinscriptions(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: isConfirme ? 'confirme_ced' : 'rapport_en_cours',
          confirmationCed: {
            decision: isConfirme ? 'Confirmé' : 'Réservé',
            directeurCedNom: 'Direction CED',
            commentaires: observations || 'Validation académique conforme au calendrier.',
            dateConfirmation: formattedDate
          },
          historique: [
            ...item.historique,
            {
              date: formattedDate,
              acteur: 'Directeur CED',
              etape: '5. Confirmation CED',
              action: isConfirme 
                ? 'Confirmation institutionnelle CED accordée. Prêt pour contrôle administratif.' 
                : `Réserves émises par le CED : ${observations}`
            }
          ]
        };
      }
      return item;
    }));
  };

  // Étape 6 & 7 : Vérification administrative & Validation finale
  const auditReinscriptionAdmin = (id: string, isConforme: boolean, piecesManquantes?: string[]) => {
    const formattedDate = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    setReinscriptions(prev => prev.map(item => {
      if (item.id === id) {
        if (isConforme) {
          const numAttestation = `RE-2026-${item.laboratoire.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-A${item.anneeTheseSollicitee}`;
          return {
            ...item,
            status: 'reinscription_validee',
            dateValidationFinale: formattedDate,
            nouvelleAttestationNumero: numAttestation,
            dossierAdministratif: {
              quittanceDroitsPayee: true,
              attestationAssuranceValide: true,
              rapportValidePresent: true,
              ficheReinscriptionTelechargee: true,
              statutPieces: 'conforme',
              piecesManquantes: [],
              dateControle: formattedDate
            },
            historique: [
              ...item.historique,
              {
                date: formattedDate,
                acteur: 'Administration CED',
                etape: '7. Validation finale',
                action: `Dossier administratif CONFORME. Réinscription en Année ${item.anneeTheseSollicitee} validée avec succès ! Attestation officielle n° ${numAttestation}.`
              }
            ]
          };
        } else {
          return {
            ...item,
            status: 'pieces_non_conformes',
            dossierAdministratif: {
              ...item.dossierAdministratif,
              statutPieces: 'a_corriger',
              piecesManquantes: piecesManquantes || ['Pièces justificatives incomplètes'],
              dateControle: formattedDate
            },
            historique: [
              ...item.historique,
              {
                date: formattedDate,
                acteur: 'Administration CED',
                etape: '6. Vérification administrative',
                action: `Signalement de pièces administratives manquantes : ${(piecesManquantes || []).join(', ')}.`
              }
            ]
          };
        }
      }
      return item;
    }));
  };

  // ==========================================
  // JOURNALISATION & AUDIT (TRAÇABILITÉ)
  // ==========================================
  const logTask = (entry: {
    tacheCode: string;
    tacheNom: string;
    objetType: 'Candidature' | 'Sujet' | 'RapportActivite' | 'DossierAdmin' | 'RolePrivilege' | 'Calendrier';
    objetRef: string;
    actionType: ActionType;
    details: string;
    statutResultat: string;
    acteurNom?: string;
    acteurRole?: Role;
    dureeMs?: number;
  }) => {
    const now = new Date();
    const formattedTimestamp = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0');

    const defaultActeurNom = user ? `${user.prenom} ${user.nom}` : 
      role === 'candidat' ? 'Candidat (Portail)' :
      role === 'professeur' ? 'Prof. Commission' :
      role === 'directeur_labo' ? 'Direction Laboratoire' :
      role === 'directeur_ced' ? 'Direction CEDoc' :
      role === 'administration' ? 'Scolarité Doctorat' : 'Plateforme GCD';

    const newLog: AuditLogEntry = {
      id: 'log-' + Date.now() + '-' + Math.floor(100 + Math.random() * 900),
      timestamp: formattedTimestamp,
      acteurNom: entry.acteurNom || defaultActeurNom,
      acteurRole: entry.acteurRole || role,
      tacheCode: entry.tacheCode,
      tacheNom: entry.tacheNom,
      objetType: entry.objetType,
      objetRef: entry.objetRef,
      actionType: entry.actionType,
      details: entry.details,
      statutResultat: entry.statutResultat,
      dureeMs: entry.dureeMs || Math.floor(120 + Math.random() * 380)
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY_AUDIT);
  };

  // ==========================================
  // COMPTES ACADÉMIQUES & AUTHENTIFICATION MULTI-ACTEURS
  // ==========================================
  const loginWithAcademicAccount = (email: string, motDePasse?: string) => {
    const found = accounts.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, message: 'Aucun compte académique trouvé avec cet email institutionnel.' };
    }
    if (found.statutCompte === 'Suspendu') {
      return { success: false, message: 'Ce compte académique a été suspendu par l\'administration du CEDoc.' };
    }
    if (motDePasse && found.motDePasse && found.motDePasse !== motDePasse) {
      return { success: false, message: 'Mot de passe académique incorrect.' };
    }

    const updatedAccount: AcademicAccount = {
      ...found,
      derniereConnexion: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setCurrentAccount(updatedAccount);
    setRole(found.role);
    setUser({
      id: found.id,
      email: found.email,
      nom: found.nom,
      prenom: found.prenom,
      estActif: true,
      dateCreation: found.dateCreation,
      typeCompte: found.role === 'candidat' ? 'candidat' : 'doctorant_inscrit'
    });

    setAccounts(prev => prev.map(a => a.id === found.id ? updatedAccount : a));

    logTask({
      tacheCode: 'AUTH-LOGIN',
      tacheNom: 'Authentification Compte Académique',
      objetType: 'RolePrivilege',
      objetRef: found.email,
      actionType: 'VALIDATION',
      details: `Connexion réussie : ${found.prenom} ${found.nom} (${found.titre}) - ${found.structure}`,
      statutResultat: 'SUCCÈS',
      acteurNom: `${found.prenom} ${found.nom}`,
      acteurRole: found.role
    });

    return { success: true, message: `Bienvenue, ${found.prenom} ${found.nom}`, account: updatedAccount };
  };

  const loginWithGoogleAccount = (googleEmail: string, role?: Role, nom?: string, prenom?: string) => {
    // Check if an existing account matches googleEmail or email
    const found = accounts.find(a => 
      (a.googleEmail && a.googleEmail.toLowerCase() === googleEmail.toLowerCase()) ||
      a.email.toLowerCase() === googleEmail.toLowerCase()
    );

    if (found) {
      const updatedAccount: AcademicAccount = {
        ...found,
        fournisseurAuth: 'google',
        estLieAGoogle: true,
        googleEmail: googleEmail,
        derniereConnexion: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };

      setCurrentAccount(updatedAccount);
      setRole(found.role);
      setUser({
        id: found.id,
        email: found.email,
        nom: found.nom,
        prenom: found.prenom,
        estActif: true,
        dateCreation: found.dateCreation,
        typeCompte: found.role === 'candidat' ? 'candidat' : 'doctorant_inscrit'
      });

      setAccounts(prev => prev.map(a => a.id === found.id ? updatedAccount : a));

      logTask({
        tacheCode: 'AUTH-GOOGLE-SSO',
        tacheNom: 'Authentification Google Workspace SSO',
        objetType: 'RolePrivilege',
        objetRef: googleEmail,
        actionType: 'VALIDATION',
        details: `Connexion Google OAuth certifiée : ${found.prenom} ${found.nom} (${googleEmail}) - Rôle : ${found.role}`,
        statutResultat: 'SUCCÈS',
        acteurNom: `${found.prenom} ${found.nom}`,
        acteurRole: found.role
      });

      return { success: true, message: `Connexion Google réussie. Bienvenue ${found.prenom} ${found.nom}`, account: updatedAccount };
    }

    // If new Google user, create linked account
    const assignedRole = role || 'candidat';
    const parsedPrenom = prenom || googleEmail.split('@')[0].split('.')[0] || 'Utilisateur';
    const parsedNom = nom || googleEmail.split('@')[0].split('.')[1] || 'Google';

    const newAcc: AcademicAccount = {
      id: 'acc-google-' + Date.now(),
      email: googleEmail,
      googleEmail: googleEmail,
      estLieAGoogle: true,
      fournisseurAuth: 'google',
      motDePasse: 'google_sso',
      nom: parsedNom.charAt(0).toUpperCase() + parsedNom.slice(1),
      prenom: parsedPrenom.charAt(0).toUpperCase() + parsedPrenom.slice(1),
      role: assignedRole,
      titre: assignedRole === 'candidat' ? 'Candidat au Doctorat · Compte Google' : `Acteur CEDoc (${assignedRole}) · Compte Google`,
      structure: 'Université Hassan II · Authentification Google Workspace',
      avatarBg: 'bg-blue-600',
      initiales: `${parsedPrenom.charAt(0)}${parsedNom.charAt(0)}`.toUpperCase(),
      statutCompte: 'Actif',
      dateCreation: new Date().toISOString().replace('T', ' ').substring(0, 16),
      derniereConnexion: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setAccounts(prev => [newAcc, ...prev]);
    setCurrentAccount(newAcc);
    setRole(assignedRole);
    setUser({
      id: newAcc.id,
      email: newAcc.email,
      nom: newAcc.nom,
      prenom: newAcc.prenom,
      estActif: true,
      dateCreation: newAcc.dateCreation,
      typeCompte: assignedRole === 'candidat' ? 'candidat' : 'doctorant_inscrit'
    });

    logTask({
      tacheCode: 'AUTH-GOOGLE-SSO',
      tacheNom: 'Authentification Google Workspace SSO',
      objetType: 'RolePrivilege',
      objetRef: googleEmail,
      actionType: 'CREATION',
      details: `Création & liaison de compte Google pour ${newAcc.prenom} ${newAcc.nom} (${googleEmail}) - Rôle : ${assignedRole}`,
      statutResultat: 'SUCCÈS',
      acteurNom: `${newAcc.prenom} ${newAcc.nom}`,
      acteurRole: assignedRole
    });

    return { success: true, message: `Bienvenue via Google, ${newAcc.prenom} ${newAcc.nom}`, account: newAcc };
  };

  const loginAsActor = (actorRole: Role) => {
    const target = accounts.find(a => a.role === actorRole);
    if (target) {
      loginWithAcademicAccount(target.email);
    }
  };

  const logoutAccount = () => {
    if (currentAccount) {
      logTask({
        tacheCode: 'AUTH-LOGOUT',
        tacheNom: 'Déconnexion Compte Académique',
        objetType: 'RolePrivilege',
        objetRef: currentAccount.email,
        actionType: 'MODIFICATION',
        details: `Session fermée pour ${currentAccount.prenom} ${currentAccount.nom} (${currentAccount.email})`,
        statutResultat: 'SUCCÈS',
        acteurNom: `${currentAccount.prenom} ${currentAccount.nom}`,
        acteurRole: currentAccount.role
      });
    }
    setCurrentAccount(null);
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY_CURRENT_ACCOUNT);
  };

  const createCandidateAcademicAccount = (data: { nom: string; prenom: string; email: string; motDePasse: string; structure?: string }) => {
    const existing = accounts.find(a => a.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Un compte académique existe déjà avec cette adresse email.' };
    }

    const newAcc: AcademicAccount = {
      id: 'acc-candidat-' + Date.now(),
      email: data.email,
      motDePasse: data.motDePasse || 'candidat2026',
      nom: data.nom,
      prenom: data.prenom,
      role: 'candidat',
      titre: 'Candidat au Doctorat 2026/2027',
      structure: data.structure || 'Faculté des Sciences (Candidature en cours)',
      avatarBg: 'bg-emerald-600',
      initiales: `${data.prenom.charAt(0)}${data.nom.charAt(0)}`.toUpperCase(),
      statutCompte: 'Actif',
      dateCreation: new Date().toISOString().replace('T', ' ').substring(0, 16),
      derniereConnexion: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setAccounts(prev => [...prev, newAcc]);
    setCurrentAccount(newAcc);
    setRole('candidat');
    setUser({
      id: newAcc.id,
      email: newAcc.email,
      nom: newAcc.nom,
      prenom: newAcc.prenom,
      estActif: true,
      dateCreation: newAcc.dateCreation,
      typeCompte: 'candidat'
    });

    logTask({
      tacheCode: 'AUTH-REGISTER',
      tacheNom: 'Création Compte Académique Candidat',
      objetType: 'RolePrivilege',
      objetRef: newAcc.email,
      actionType: 'CREATION',
      details: `Création du compte académique pour ${newAcc.prenom} ${newAcc.nom} (${newAcc.email})`,
      statutResultat: 'SUCCÈS',
      acteurNom: `${newAcc.prenom} ${newAcc.nom}`,
      acteurRole: 'candidat'
    });

    return { success: true, message: 'Compte académique activé avec succès !', account: newAcc };
  };

  // ==========================================
  // PROGRESSION & PROLONGATION DE DÉLAIS
  // ==========================================
  const prolongMilestoneDate = (
    applicationId: string, 
    milestoneCode: 'depot' | 'preselection' | 'entretien' | 'dossier_admin' | 'validation_finale', 
    newDate: string, 
    motif: string, 
    auteur?: string
  ) => {
    const formattedDate = new Date().toLocaleDateString('fr-FR');
    const authorName = auteur || (user ? `${user.prenom} ${user.nom}` : 'Administration Scolarité CEDoc');

    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        let changedMilestoneName = '';
        let originalDate = '';
        const updatedJalons = (app.jalons || []).map(j => {
          if (j.code === milestoneCode) {
            changedMilestoneName = j.nomEtape;
            originalDate = j.datePrevueOuEffective;
            return {
              ...j,
              datePrevueOuEffective: newDate,
              estProlongee: true,
              motifProlongation: motif,
              auteurProlongation: authorName,
              dateProlongation: formattedDate
            };
          }
          return j;
        });

        const updatedHistory = [
          ...app.historique,
          {
            date: formattedDate + ' ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            auteur: authorName,
            action: `Échéance modifiée/prolongée pour "${changedMilestoneName}". Date initiale (${originalDate}) reportée au ${newDate}. Motif : ${motif}`
          }
        ];

        return {
          ...app,
          jalons: updatedJalons,
          historique: updatedHistory
        };
      }
      return app;
    }));

    // Auto record in audit logs
    logTask({
      tacheCode: 'TASK_EXTEND_DEADLINE',
      tacheNom: `Prolongation jalon "${milestoneCode}"`,
      objetType: 'Calendrier',
      objetRef: applicationId,
      actionType: 'PROLONGATION',
      details: `Nouvelle date limite : ${newDate}. Motif : ${motif}`,
      statutResultat: 'Date Prolongée',
      acteurNom: authorName,
      acteurRole: role
    });
  };

  // ==========================================
  // GESTION DES ATTRIBUTIONS & RBAC
  // ==========================================
  const updateUserRole = (userId: string, newRole: Role, structure?: string) => {
    setUserAssignments(prev => prev.map(u => {
      if (u.userId === userId) {
        const updated: UserRoleAssignment = {
          ...u,
          role: newRole,
          structure: structure || u.structure,
          dateAttribution: new Date().toISOString().replace('T', ' ').substring(0, 16),
          attribuPar: user ? `${user.prenom} ${user.nom}` : 'Direction CEDoc'
        };
        logTask({
          tacheCode: 'TASK_ROLE_ASSIGNMENT',
          tacheNom: 'Attribution / Modification rôle utilisateur',
          objetType: 'RolePrivilege',
          objetRef: u.email,
          actionType: 'MODIFICATION',
          details: `Rôle de ${u.prenom} ${u.nom} réassigné vers "${newRole}". Structure rattachée : ${updated.structure}`,
          statutResultat: 'Rôle Attribué'
        });
        return updated;
      }
      return u;
    }));
  };

  const toggleUserStatus = (userId: string) => {
    setUserAssignments(prev => prev.map(u => {
      if (u.userId === userId) {
        const nextStatus = u.statutCompte === 'Actif' ? 'Suspendu' : 'Actif';
        logTask({
          tacheCode: 'TASK_ACCOUNT_STATUS',
          tacheNom: 'Modification statut de compte',
          objetType: 'RolePrivilege',
          objetRef: u.email,
          actionType: 'MODIFICATION',
          details: `Compte de ${u.prenom} ${u.nom} passé à l'état "${nextStatus}".`,
          statutResultat: nextStatus
        });
        return {
          ...u,
          statutCompte: nextStatus
        };
      }
      return u;
    }));
  };

  const addUserAssignment = (newUser: Omit<UserRoleAssignment, 'userId' | 'dateAttribution'>) => {
    const assignment: UserRoleAssignment = {
      ...newUser,
      userId: 'usr-' + Date.now(),
      dateAttribution: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setUserAssignments(prev => [assignment, ...prev]);
    logTask({
      tacheCode: 'TASK_USER_CREATE',
      tacheNom: 'Création compte & attribution rôle',
      objetType: 'RolePrivilege',
      objetRef: assignment.email,
      actionType: 'CREATION',
      details: `Création du profil utilisateur ${assignment.prenom} ${assignment.nom} avec rôle "${assignment.role}".`,
      statutResultat: 'Attribué'
    });
  };

  const updatePrivilege = (objectCode: BusinessObject, targetRole: Role, privilege: keyof PrivilegeRule, value: boolean) => {
    setPrivilegeMatrix(prev => prev.map(mat => {
      if (mat.objet === objectCode) {
        const currentRules = mat.privilegesParRole[targetRole];
        const updatedRules = {
          ...currentRules,
          [privilege]: value
        };
        return {
          ...mat,
          privilegesParRole: {
            ...mat.privilegesParRole,
            [targetRole]: updatedRules
          }
        };
      }
      return mat;
    }));

    logTask({
      tacheCode: 'TASK_PRIVILEGE_UPDATE',
      tacheNom: 'Modification matrice de privilèges',
      objetType: 'RolePrivilege',
      objetRef: `${objectCode}:${targetRole}`,
      actionType: 'MODIFICATION',
      details: `Privilège [${privilege}] sur l'objet "${objectCode}" pour le rôle "${targetRole}" passé à ${value ? 'AUTORISÉ' : 'REFUSÉ'}.`,
      statutResultat: value ? 'Autorisé' : 'Révoqué'
    });
  };

  const resetPrivilegesToDefault = () => {
    setPrivilegeMatrix(DEFAULT_OBJECT_PRIVILEGES);
    logTask({
      tacheCode: 'TASK_PRIVILEGES_RESET',
      tacheNom: 'Réinitialisation matrice des privilèges',
      objetType: 'RolePrivilege',
      objetRef: 'GLOBAL_RBAC',
      actionType: 'MODIFICATION',
      details: 'Rétablissement des privilèges par défaut du CEDoc sur l\'ensemble des 9 objets métier.',
      statutResultat: 'Restauré'
    });
  };

  const resetDataToDefault = () => {
    setSubjects(INITIAL_SUBJECTS);
    setApplications(INITIAL_CANDIDATES);
    setReinscriptions(INITIAL_REINSCRIPTIONS);
    setUser(INITIAL_USER);
    setCart(['subj-1', 'subj-2']);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setUserAssignments(INITIAL_USER_ROLE_ASSIGNMENTS);
    setPrivilegeMatrix(DEFAULT_OBJECT_PRIVILEGES);
    setAccounts(INITIAL_ACADEMIC_ACCOUNTS);
    setCurrentAccount(INITIAL_ACADEMIC_ACCOUNTS[1]);

    localStorage.removeItem(LOCAL_STORAGE_KEY_SUBJECTS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_APPS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_REINSCR);
    localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
    localStorage.removeItem(LOCAL_STORAGE_KEY_CART);
    localStorage.removeItem(LOCAL_STORAGE_KEY_AUDIT);
    localStorage.removeItem(LOCAL_STORAGE_KEY_USERS_RBAC);
    localStorage.removeItem(LOCAL_STORAGE_KEY_PRIVILEGES);
    localStorage.removeItem(LOCAL_STORAGE_KEY_ACCOUNTS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_CURRENT_ACCOUNT);
  };

  return (
    <DoctoratContext.Provider
      value={{
        role,
        setRole,
        portalMode,
        setPortalMode,
        accounts,
        currentAccount,
        isAcademicAuthModalOpen,
        setIsAcademicAuthModalOpen,
        loginWithAcademicAccount,
        loginWithGoogleAccount,
        loginAsActor,
        logoutAccount,
        createCandidateAcademicAccount,
        subjects,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        user,
        pendingActivationEmail,
        registerAccount,
        activateAccount,
        login,
        logout,
        applications,
        submitApplication,
        proposeSubject,
        preselectCandidate,
        scheduleInterviewAndPv,
        validateLabSubject,
        confirmCedSubject,
        validateLabHosting,
        homologateCedApplication,
        submitAdminDossier,
        checkAdministrativeConformity,
        correctDossier,
        notifyNonAdmission,
        reinscriptions,
        submitActivityReport,
        giveDirectorOpinion,
        validateLabReinscription,
        confirmCedReinscription,
        auditReinscriptionAdmin,
        startNewReinscription,
        prolongMilestoneDate,
        auditLogs,
        logTask,
        clearAuditLogs,
        userAssignments,
        updateUserRole,
        toggleUserStatus,
        addUserAssignment,
        privilegeMatrix,
        updatePrivilege,
        resetPrivilegesToDefault,
        isDiagramModalOpen,
        setIsDiagramModalOpen,
        conceptionTab,
        setConceptionTab,
        highlightedDiagramStep,
        setHighlightedDiagramStep,
        resetDataToDefault
      }}
    >
      {children}
    </DoctoratContext.Provider>
  );
};

export const useDoctorat = () => {
  const context = useContext(DoctoratContext);
  if (!context) {
    throw new Error('useDoctorat must be used within a DoctoratProvider');
  }
  return context;
};
