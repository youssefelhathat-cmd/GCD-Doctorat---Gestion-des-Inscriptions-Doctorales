import { ThesisSubject, CandidateApplication, UserAccount, DoctoralReEnrollment } from '../types';

export const INITIAL_SUBJECTS: ThesisSubject[] = [
  {
    id: 'subj-1',
    code: 'TH-2026-IA-01',
    titre: 'Apprentissage Fédéré Robuste et Préservant la Vie Privée pour les Systèmes de Santé Connectés',
    discipline: 'Informatique & Intelligence Artificielle',
    laboratoire: 'Laboratoire des Technologies de l\'Information et Systèmes Intelligents (LTISI)',
    directeurThese: 'Prof. Karim Bennani',
    coDirecteur: 'Dr. Sofia Alami',
    emailContact: 'k.bennani@usmba.ac.ma',
    resume: 'Ce projet de thèse vise à concevoir des architectures d\'apprentissage fédéré décentralisées tolérantes aux attaques byzantines et garantissant la confidentialité différentielle stricte sur des données biomédicales hétérogènes.',
    objectifs: [
      'Modéliser un consensus distribué résistant aux empoisonnements de gradients',
      'Optimiser la bande passante de communication entre nœuds cliniques',
      'Déployer et évaluer sur une cohorte multi-hôpitaux de radiographies thoraciques'
    ],
    prerequis: ['Master Recherche ou Diplôme d\'Ingénieur en Informatique / Data Science', 'Maîtrise de PyTorch ou JAX', 'Bases solides en cryptographie / optimisation mathématique'],
    motsCles: ['Apprentissage Fédéré', 'Differential Privacy', 'Santé Numérique', 'PyTorch'],
    financement: 'Bourse d\'Excellence CED + Projet Européen Horizon (100% financé)',
    status: 'confirme_ced',
    dateCreation: '2026-09-15',
    placesDisponibles: 1
  },
  {
    id: 'subj-2',
    code: 'TH-2026-ENERG-02',
    titre: 'Contrôle Prédictif et Gestion Intelligente d\'un Micro-réseau Hybride Solaire-Hydrogène Vert',
    discipline: 'Génie Électrique & Énergies Renouvelables',
    laboratoire: 'Laboratoire d\'Énergétique et Matériaux Avancés (LEMA)',
    directeurThese: 'Prof. Mohamed Tazi',
    emailContact: 'm.tazi@usmba.ac.ma',
    resume: 'Étude et implémentation d\'algorithmes de contrôle prédictif basé sur modèle (MPC) pour arbitrer en temps réel entre le stockage électrochimique et l\'électrolyse PEM pour la production d\'hydrogène vert décarboné.',
    objectifs: [
      'Développer un modèle thermodynamique couplé électrolyseur / pile à combustible',
      'Formuler une optimisation non linéaire temps-réel sous incertitude météo',
      'Validation sur banc d\'essai expérimental de 50 kW'
    ],
    prerequis: ['Master / Ingénieur Génie Électrique ou Automatique Industrielle', 'Simulink / MATLAB / Python', 'Connaissances en électronique de puissance'],
    motsCles: ['Hydrogène Vert', 'Micro-Réseaux', 'Contrôle MPC', 'Stockage d\'Énergie'],
    financement: 'Contrat Doctoral Industriel (Partenariat OCP / IRESEN)',
    status: 'confirme_ced',
    dateCreation: '2026-09-18',
    placesDisponibles: 1
  },
  {
    id: 'subj-3',
    code: 'TH-2026-MATH-03',
    titre: 'Optimisation Topologique Stochastique de Métamatériaux Acoustiques par Éléments Finis',
    discipline: 'Mathématiques Appliquées & Modélisation',
    laboratoire: 'Centre de Mathématiques Appliquées et Calcul Scientifique (CMACS)',
    directeurThese: 'Prof. Amina Chraibi',
    coDirecteur: 'Prof. Vincent Lambert',
    emailContact: 'a.chraibi@usmba.ac.ma',
    resume: 'Conception inverse de cristaux phononiques et métamatériaux pour l\'atténuation acoustique sélective dans l\'aéronautique, en intégrant des gradients d\'homogénéisation asymptotique.',
    objectifs: [
      'Formulation mathématique variationnelle pour l\'inversion acoustique',
      'Résolution par solveurs éléments finis haute performance (HPC)',
      'Fabrication additive et caractérisation en chambre anéchoïque'
    ],
    prerequis: ['Master en Mathématiques Appliquées, Mécanique Théorique ou Calcul Scientifique', 'C++ / FreeFEM / FEniCS'],
    motsCles: ['Optimisation Topologique', 'Calcul HPC', 'Acoustique', 'Éléments Finis'],
    financement: 'Allocation Ministérielle de Recherche',
    status: 'confirme_ced',
    dateCreation: '2026-09-20',
    placesDisponibles: 1
  },
  {
    id: 'subj-4',
    code: 'TH-2026-BIO-04',
    titre: 'Caractérisation Métagénomique et Criblage Énantiomérique de Nouvelles Enzymes Extrêmophiles',
    discipline: 'Biotechnologie & Génomique',
    laboratoire: 'Laboratoire de Biodiversité et Biotechnologies Végétales (LBBV)',
    directeurThese: 'Prof. Hassan Idrissi',
    emailContact: 'h.idrissi@usmba.ac.ma',
    resume: 'Exploration des sources hydrothermales et hypersalines pour isoler des biocatalyseurs thermotolérants applicables en bioremédiation des rejets industriels textiles.',
    objectifs: [
      'Séquençage métagénomique short & long reads (Oxford Nanopore)',
      'Expression hétérologue chez Pichia pastoris',
      'Dosage enzymatique et cinétique de dégradation'
    ],
    prerequis: ['Master en Biochimie, Biotechnologie ou Microbiologie Moléculaire', 'Bonne maîtrise des outils bioinformatiques'],
    motsCles: ['Métagénomique', 'Biocatalyse', 'Extrêmophiles', 'Bioremédiation'],
    financement: 'Bourse CNRST',
    status: 'confirme_ced',
    dateCreation: '2026-09-22',
    placesDisponibles: 2
  },
  {
    id: 'subj-5',
    code: 'TH-2026-IA-05',
    titre: 'Génération de Code Sécurisé et Vérification Formelle Automatisée par Modèles de Langage Hybrides',
    discipline: 'Informatique & Intelligence Artificielle',
    laboratoire: 'Laboratoire des Technologies de l\'Information et Systèmes Intelligents (LTISI)',
    directeurThese: 'Prof. Yassine Mansouri',
    emailContact: 'y.mansouri@usmba.ac.ma',
    resume: 'Hybridation de Large Language Models avec des prouveurs automatiques (SMT / Z3) pour certifier l\'absence de vulnérabilités mémoires dans les noyaux temps-réel.',
    objectifs: [
      'Intégration de contraintes formelles dans le sampling autoregressif',
      'Génération guidée de contrats de preuve pour le langage Rust / SPARK Ada',
      'Benchmark rigoureux sur CVE critiques'
    ],
    prerequis: ['Diplôme d\'Ingénieur ou Master Recherche en Informatique', 'Connaissances en sémantique des langages et compilation'],
    motsCles: ['Vérification Formelle', 'LLM', 'Sécurité des Systèmes', 'SMT Solvers'],
    financement: 'Projet National de Recherche en Cybersécurité',
    status: 'propose',
    dateCreation: '2026-10-10',
    placesDisponibles: 1
  },
  {
    id: 'subj-6',
    code: 'TH-2026-MAT-06',
    titre: 'Synthèse Verte de Nanomatériaux Carbonés 2D pour Supercondensateurs à Électrolyte Solide',
    discipline: 'Chimie & Science des Matériaux',
    laboratoire: 'Laboratoire d\'Énergétique et Matériaux Avancés (LEMA)',
    directeurThese: 'Prof. Nadia Barrak',
    emailContact: 'n.barrak@usmba.ac.ma',
    resume: 'Valorisation de sous-produits agro-industriels par pyrolyse hydrothermale assistée micro-ondes pour produire des graphènes dopés à l\'azote pour le stockage électrochimique.',
    objectifs: [
      'Synthèse écologique sans acides forts',
      'Spectroscopie Raman, XPS et microscopie HRTEM',
      'Mesures de capacitance spécifique et cyclabilité > 20 000 cycles'
    ],
    prerequis: ['Master en Chimie des Matériaux ou Électrochimie', 'Expérience en caractérisation physico-chimique'],
    motsCles: ['Supercondensateurs', 'Matériaux 2D', 'Chimie Verte', 'Électrolytes Solides'],
    financement: 'Bourse Régionale de Développement Durable',
    status: 'valide_labo',
    dateCreation: '2026-10-12',
    placesDisponibles: 1
  }
];

export const INITIAL_CANDIDATES: CandidateApplication[] = [
  {
    id: 'cand-app-1',
    referenceDossier: 'DOS-2026-0841',
    candidatId: 'usr-candidat-1',
    nom: 'El Amrani',
    prenom: 'Salma',
    email: 'salma.elamrani@gmail.com',
    telephone: '+212 6 61 24 55 89',
    cinOuPasseport: 'BK718293',
    dateNaissance: '1999-05-14',
    nationalite: 'Marocaine',
    derniereFormation: 'Master Recherche en Informatique Décisionnelle & Big Data',
    universiteOrigine: 'Faculté des Sciences, Université Mohammed V',
    mentionMaster: 'Très Bien',
    moyenneGenerale: 16.85,
    choixSujets: [
      { subjectId: 'subj-1', priorite: 1 },
      { subjectId: 'subj-3', priorite: 2 }
    ],
    documentsDeposes: {
      cvNom: 'CV_Salma_ElAmrani_2026.pdf',
      diplomeNom: 'Diplome_Master_FS_UM5.pdf',
      relevesNom: 'Releves_Notes_S1_S4_Officiels.pdf',
      lettreMotivationNom: 'Lettre_Motivation_Federated_Learning.pdf',
      projetRechercheNom: 'Projet_Recherche_Robustesse_Byzantine.pdf',
      pieceIdentiteNom: 'CIN_Recto_Verso_BK718293.pdf',
      dateDepot: '2026-10-18T10:30:00Z'
    },
    status: 'preselectionne',
    dateSoumission: '2026-10-18T11:15:00Z',
    entretien: {
      dateHeure: '2026-11-04T09:30:00Z',
      lieuOuLien: 'Salle de Soutenance A2 - Bâtiment Doctoral CED',
      mode: 'présentiel',
      juryMembres: ['Prof. Karim Bennani (Président)', 'Dr. Sofia Alami (Rapporteur)', 'Prof. Amina Chraibi (Examinatrice)'],
      notesDossier: 17.5
    },
    jalons: [
      {
        code: 'depot',
        nomEtape: 'Dépôt & Choix de sujets (Panier max 3)',
        statut: 'termine',
        dateInitiale: '18/10/2026',
        datePrevueOuEffective: '18/10/2026',
        estProlongee: false
      },
      {
        code: 'preselection',
        nomEtape: 'Examen des dossiers & Présélection',
        statut: 'termine',
        dateInitiale: '22/10/2026',
        datePrevueOuEffective: '22/10/2026',
        estProlongee: false
      },
      {
        code: 'entretien',
        nomEtape: 'Entretien oral & Délibération du PV',
        statut: 'en_cours',
        dateInitiale: '26/10/2026',
        datePrevueOuEffective: '04/11/2026',
        estProlongee: true,
        motifProlongation: 'Mission officielle à l\'étranger du rapporteur principal (Dr. Sofia Alami). Report convenu en commission.',
        auteurProlongation: 'Administration CEDoc (Mme Benjelloun)',
        dateProlongation: '24/10/2026'
      },
      {
        code: 'dossier_admin',
        nomEtape: 'Vérification du dossier administratif & originaux',
        statut: 'a_venir',
        dateInitiale: '08/11/2026',
        datePrevueOuEffective: '12/11/2026',
        estProlongee: false
      },
      {
        code: 'validation_finale',
        nomEtape: 'Inscription définitive & Attribution du matricule',
        statut: 'a_venir',
        dateInitiale: '15/11/2026',
        datePrevueOuEffective: '18/11/2026',
        estProlongee: false
      }
    ],
    historique: [
      { date: '2026-10-18 11:15', auteur: 'Plateforme GCD', action: 'Candidature enregistrée avec succès (2 sujets choisis).' },
      { date: '2026-10-22 14:00', auteur: 'Commission de Thèse (Prof. Bennani)', action: 'Examen de candidature : Présélection validée (Note dossier : 17.5/20).' },
      { date: '2026-10-23 09:00', auteur: 'Commission de Thèse', action: 'Entretien programmé pour le 04/11/2026 à 09h30.' }
    ]
  },
  {
    id: 'cand-app-2',
    referenceDossier: 'DOS-2026-0792',
    candidatId: 'usr-candidat-2',
    nom: 'Berrada',
    prenom: 'Omar',
    email: 'omar.berrada@gmail.com',
    telephone: '+212 6 72 11 90 43',
    cinOuPasseport: 'A491820',
    dateNaissance: '1998-11-03',
    nationalite: 'Marocaine',
    derniereFormation: 'Diplôme d\'Ingénieur d\'État en Électrotechnique & Énergies Renouvelables',
    universiteOrigine: 'École Nationale Supérieure d\'Électricité et de Mécanique (ENSEM)',
    mentionMaster: 'Très Bien',
    moyenneGenerale: 17.10,
    choixSujets: [
      { subjectId: 'subj-2', priorite: 1 }
    ],
    documentsDeposes: {
      cvNom: 'CV_Omar_Berrada_Ingenieur.pdf',
      diplomeNom: 'Diplome_Ingenieur_ENSEM_2025.pdf',
      relevesNom: 'Releves_Notes_ENSEM_Complets.pdf',
      lettreMotivationNom: 'Motivation_These_Hydrogene.pdf',
      projetRechercheNom: 'Synthese_Projet_MPC_Microgrids.pdf',
      pieceIdentiteNom: 'Scan_CIN_Omar_Berrada.pdf',
      dateDepot: '2026-10-15T09:00:00Z'
    },
    status: 'admis',
    dateSoumission: '2026-10-15T10:00:00Z',
    entretien: {
      dateHeure: '2026-10-24T14:00:00Z',
      lieuOuLien: 'Amphi Hassan II - Faculté des Sciences et Techniques',
      mode: 'présentiel',
      juryMembres: ['Prof. Mohamed Tazi (Président)', 'Prof. Nadia Barrak', 'Dr. Khalid Belhaj'],
      notesDossier: 18.0,
      notesOral: 18.5,
      avisCommission: 'Très favorable',
      pvCommentaire: 'Excellente maîtrise théorique du contrôle prédictif et solide bagage expérimental acquis lors de son PFE chez Masen. Recommandation unanime pour admission sur liste principale.',
      datePv: '2026-10-24 16:30'
    },
    jalons: [
      {
        code: 'depot',
        nomEtape: 'Dépôt & Choix de sujets (Panier max 3)',
        statut: 'termine',
        dateInitiale: '15/10/2026',
        datePrevueOuEffective: '15/10/2026',
        estProlongee: false
      },
      {
        code: 'preselection',
        nomEtape: 'Examen des dossiers & Présélection',
        statut: 'termine',
        dateInitiale: '19/10/2026',
        datePrevueOuEffective: '19/10/2026',
        estProlongee: false
      },
      {
        code: 'entretien',
        nomEtape: 'Entretien oral & Délibération du PV',
        statut: 'termine',
        dateInitiale: '24/10/2026',
        datePrevueOuEffective: '24/10/2026',
        estProlongee: false
      },
      {
        code: 'dossier_admin',
        nomEtape: 'Vérification du dossier administratif & originaux',
        statut: 'en_cours',
        dateInitiale: '30/10/2026',
        datePrevueOuEffective: '06/11/2026',
        estProlongee: true,
        motifProlongation: 'Délai d\'obtention de l\'attestation d\'assurance complémentaire et accord de non-salariat.',
        auteurProlongation: 'Commission Doctorale (Prof. Mohamed Tazi)',
        dateProlongation: '29/10/2026'
      },
      {
        code: 'validation_finale',
        nomEtape: 'Inscription définitive & Attribution du matricule',
        statut: 'a_venir',
        dateInitiale: '10/11/2026',
        datePrevueOuEffective: '14/11/2026',
        estProlongee: false
      }
    ],
    historique: [
      { date: '2026-10-15 10:00', auteur: 'Plateforme GCD', action: 'Candidature enregistrée.' },
      { date: '2026-10-19 16:00', auteur: 'Commission (Prof. Tazi)', action: 'Candidat présélectionné.' },
      { date: '2026-10-24 16:30', auteur: 'Commission (Prof. Tazi)', action: 'PV d\'entretien établi : Candidat ADMIS avec avis Très Favorable.' }
    ]
  },
  {
    id: 'cand-app-4',
    referenceDossier: 'DOS-2026-0504',
    candidatId: 'usr-candidat-4',
    nom: 'Fassi',
    prenom: 'Hamza',
    email: 'hamza.fassi@hotmail.com',
    telephone: '+212 6 63 45 78 12',
    cinOuPasseport: 'EE450912',
    dateNaissance: '1999-08-25',
    nationalite: 'Marocaine',
    derniereFormation: 'Master Modélisation Mathématique et Data Science',
    universiteOrigine: 'Université Sidi Mohamed Ben Abdellah, Fès',
    mentionMaster: 'Très Bien',
    moyenneGenerale: 17.45,
    choixSujets: [
      { subjectId: 'subj-3', priorite: 1 }
    ],
    documentsDeposes: {
      cvNom: 'CV_Hamza_Fassi.pdf',
      diplomeNom: 'Diplome_Master_USMBA.pdf',
      relevesNom: 'Releves_Notes_Officiels_S1_S4.pdf',
      lettreMotivationNom: 'Motivation_Topologie_Acoustique.pdf',
      projetRechercheNom: 'Projet_Elements_Finis_Acoustique.pdf',
      pieceIdentiteNom: 'Scan_CIN_Fassi.pdf',
      dateDepot: '2026-10-08T08:00:00Z'
    },
    status: 'inscription_validee',
    dateSoumission: '2026-10-08T09:30:00Z',
    entretien: {
      dateHeure: '2026-10-16T15:00:00Z',
      lieuOuLien: 'Salle Visio Dédiée CED',
      mode: 'visio',
      juryMembres: ['Prof. Amina Chraibi', 'Prof. Vincent Lambert'],
      notesDossier: 18.5,
      notesOral: 19.0,
      avisCommission: 'Très favorable',
      pvCommentaire: 'Candidat exceptionnel, publication déjà soumise en M2. Admission sans réserve.',
      datePv: '2026-10-16 16:45'
    },
    dossierAdministratif: {
      diplomeOriginalDepose: true,
      relevesOriginauxDeposes: true,
      charteTheseSignee: true,
      justificatifAssurance: true,
      autorisationEmployeurOuNonSalariat: true,
      quittanceFraisInscription: true,
      matriculeAttribue: 'DOC-2026-CMACS-0042',
      dateValidationAdmin: '2026-10-26 14:15'
    },
    jalons: [
      {
        code: 'depot',
        nomEtape: 'Dépôt & Choix de sujets (Panier max 3)',
        statut: 'termine',
        dateInitiale: '08/10/2026',
        datePrevueOuEffective: '08/10/2026',
        estProlongee: false
      },
      {
        code: 'preselection',
        nomEtape: 'Examen des dossiers & Présélection',
        statut: 'termine',
        dateInitiale: '12/10/2026',
        datePrevueOuEffective: '12/10/2026',
        estProlongee: false
      },
      {
        code: 'entretien',
        nomEtape: 'Entretien oral & Délibération du PV',
        statut: 'termine',
        dateInitiale: '16/10/2026',
        datePrevueOuEffective: '16/10/2026',
        estProlongee: false
      },
      {
        code: 'dossier_admin',
        nomEtape: 'Vérification du dossier administratif & originaux',
        statut: 'termine',
        dateInitiale: '22/10/2026',
        datePrevueOuEffective: '22/10/2026',
        estProlongee: false
      },
      {
        code: 'validation_finale',
        nomEtape: 'Inscription définitive & Attribution du matricule',
        statut: 'termine',
        dateInitiale: '26/10/2026',
        datePrevueOuEffective: '26/10/2026',
        estProlongee: false
      }
    ],
    historique: [
      { date: '2026-10-08 09:30', auteur: 'Plateforme GCD', action: 'Candidature enregistrée.' },
      { date: '2026-10-16 16:45', auteur: 'Commission (Prof. Chraibi)', action: 'PV d\'entretien : Candidat ADMIS.' },
      { date: '2026-10-22 11:00', auteur: 'Candidat (Hamza Fassi)', action: 'Dossier administratif déposé.' },
      { date: '2026-10-26 14:15', auteur: 'Administration CED', action: 'Dossier contrôlé CONFORME. Inscription définitive validée ! Matricule attribué : DOC-2026-CMACS-0042.' }
    ]
  }
];

export const INITIAL_REINSCRIPTIONS: DoctoralReEnrollment[] = [
  {
    id: 're-2026-001',
    matriculeDoctorant: 'DOC-2025-LTISI-0019',
    doctorantId: 'usr-doc-tazi',
    nom: 'Tazi',
    prenom: 'Yassine',
    email: 'yassine.tazi@usmba.ac.ma',
    telephone: '+212 6 62 18 90 22',
    cin: 'AB671209',
    sujetThese: 'Sécurité Distribuée et Détection d\'Intrusions dans les Réseaux IoT par Edge Computing',
    directeurThese: 'Prof. Karim Bennani',
    laboratoire: 'Laboratoire des Technologies de l\'Information et Systèmes Intelligents (LTISI)',
    anneeTheseEnCours: 2,
    anneeTheseSollicitee: 3,
    anneeUniversitaire: '2026/2027',
    status: 'pieces_en_verification',
    dateDebutDemande: '2026-10-05',
    rapportActivites: {
      anneeCible: 3,
      avancementPourcentage: 75,
      resumeAvancement: 'Durant cette 2ème année, nous avons achevé la modélisation formelle du protocole d\'authentification ultraléger et réalisé un banc d\'essai de 40 nœuds Raspberry Pi 4 avec contraintes d\'énergie strictes.',
      objectifsAtteints: 'Preuve mathématique de sécurité via ProVerif validée ; Réduction de la latence de handshake de 38% ; 1er article publié dans IEEE Transactions on Consumer Electronics.',
      difficultesEtSolutions: 'Difficulté temporaire sur la surcharge mémoire du nœud coordinateur, résolue par un schéma de hachage probabiliste de type Bloom Filter compact.',
      publications: [
        {
          titre: 'Lightweight Mutual Authentication for Edge-Assisted Smart Microgrids',
          revueOuConference: 'IEEE Transactions on Consumer Electronics',
          statut: 'Publié',
          indexation: 'Scopus Q1 (IF: 4.3)',
          annee: 2026
        },
        {
          titre: 'Formal Verification of Resilient Gossip Protocols under Byzantine Adversaries',
          revueOuConference: 'ACM SAC 2026 Conference',
          statut: 'Accepté',
          indexation: 'Core B',
          annee: 2026
        }
      ],
      formationsValideesHeures: 140, // sur 200h demandées par CED
      participationsCongres: 'Présentation orale à la conférence internationale IEEE CSNet 2026 (Paris).',
      calendrierPrevisionnelSoutenance: 'Avril / Mai 2027',
      dateSoumission: '2026-10-10 14:30'
    },
    avisDirecteur: {
      decision: 'Très favorable',
      appreciationQualite: 'Excellente',
      commentairesEtRecommandations: 'Excellent avancement du doctorant. Rythme de publication remarquable et autonomie scientifique avérée. Avis très favorable pour la réinscription en 3ème année.',
      dateAvis: '2026-10-14 10:15',
      delaiRespecte: true
    },
    validationLabo: {
      decision: 'Validé',
      directeurLaboNom: 'Prof. Karim Bennani (Directeur LTISI)',
      commentaires: 'Ressources de calcul et équipement IoT garantis pour la finalisation de la thèse.',
      dateValidation: '2026-10-18 16:00'
    },
    confirmationCed: {
      decision: 'Confirmé',
      directeurCedNom: 'Prof. Directeur CED',
      commentaires: 'Validation des crédits doctoraux (140h acquises) et calendrier de soutenance 2027 validé.',
      dateConfirmation: '2026-10-22 11:30'
    },
    dossierAdministratif: {
      quittanceDroitsPayee: true,
      attestationAssuranceValide: true,
      rapportValidePresent: true,
      ficheReinscriptionTelechargee: true,
      statutPieces: 'conforme',
      piecesManquantes: []
    },
    historique: [
      { date: '2026-10-05 09:00', acteur: 'Doctorant', etape: '1. Accès réinscription', action: 'Ouverture du dossier de réinscription en 3ème année.' },
      { date: '2026-10-10 14:30', acteur: 'Doctorant', etape: '2. Rapport d\'activités', action: 'Saisie et soumission du rapport annuel sur GCD (Avancement: 75%).' },
      { date: '2026-10-14 10:15', acteur: 'Directeur de Thèse', etape: '3. Avis Directeur', action: 'Avis Très Favorable formulé dans les délais.' },
      { date: '2026-10-18 16:00', acteur: 'Directeur Laboratoire', etape: '4. Validation Labo', action: 'Dossier validé au niveau de la structure d\'accueil.' },
      { date: '2026-10-22 11:30', acteur: 'Directeur CED', etape: '5. Confirmation CED', action: 'Confirmation académique institutionnelle accordée.' },
      { date: '2026-10-26 15:00', acteur: 'Doctorant', etape: '6. Dépôt pièces', action: 'Dépôt de la quittance et de l\'assurance maladie.' }
    ]
  },
  {
    id: 're-2026-002',
    matriculeDoctorant: 'DOC-2024-LEMA-0088',
    doctorantId: 'usr-doc-alami',
    nom: 'Alami',
    prenom: 'Nadia',
    email: 'nadia.alami@univ-lema.ma',
    telephone: '+212 6 54 88 11 02',
    cin: 'CD451290',
    sujetThese: 'Production d\'Hydrogène Décarboné par Électrolyse PEM à Haute Température',
    directeurThese: 'Prof. Mohamed Tazi',
    laboratoire: 'Laboratoire d\'Énergétique et Matériaux Avancés (LEMA)',
    anneeTheseEnCours: 1,
    anneeTheseSollicitee: 2,
    anneeUniversitaire: '2026/2027',
    status: 'rapport_soumis',
    dateDebutDemande: '2026-10-12',
    rapportActivites: {
      anneeCible: 2,
      avancementPourcentage: 45,
      resumeAvancement: 'Durant cette 1ère année, réalisation d\'une revue systématique de la littérature sur les membranes polymères conductrices de protons et assemblage d\'une monocellule pilote de 5 cm² en laboratoire.',
      objectifsAtteints: 'État de l\'art complet finalisé ; Synthèse d\'un premier lot de catalyseurs à base d\'iridium supporté sur oxyde de titane dopé au niobium.',
      difficultesEtSolutions: 'Délais de livraison des réactifs chimiques importés, compensés par des simulations multiphysiques préalables sous COMSOL.',
      publications: [
        {
          titre: 'A Review on High-Temperature PEM Water Electrolysis: Degradation Mechanisms and Mitigation Strategies',
          revueOuConference: 'International Journal of Hydrogen Energy',
          statut: 'Soumis',
          indexation: 'Scopus Q1 (IF: 7.2)',
          annee: 2026
        }
      ],
      formationsValideesHeures: 65,
      participationsCongres: 'Participation au Séminaire National des Énergies Renouvelables (Rabat 2026).',
      calendrierPrevisionnelSoutenance: 'Décembre 2027',
      dateSoumission: '2026-10-19 16:40'
    },
    dossierAdministratif: {
      quittanceDroitsPayee: false,
      attestationAssuranceValide: true,
      rapportValidePresent: false,
      ficheReinscriptionTelechargee: false,
      statutPieces: 'incomplet',
      piecesManquantes: ['Quittance des droits de réinscription 2026/2027']
    },
    historique: [
      { date: '2026-10-12 11:00', acteur: 'Doctorant', etape: '1. Accès réinscription', action: 'Accès rubrique réinscription.' },
      { date: '2026-10-19 16:40', acteur: 'Doctorant', etape: '2. Rapport d\'activités', action: 'Saisie et transmission du rapport d\'activités annuel (45% avancement).' }
    ]
  },
  {
    id: 're-2026-003',
    matriculeDoctorant: 'DOC-2023-CMACS-0012',
    doctorantId: 'usr-doc-fassi',
    nom: 'Fassi',
    prenom: 'Hamza',
    email: 'hamza.fassi@hotmail.com',
    telephone: '+212 6 63 45 78 12',
    cin: 'EE450912',
    sujetThese: 'Optimisation Topologique Stochastique de Métamatériaux Acoustiques',
    directeurThese: 'Prof. Amina Chraibi',
    laboratoire: 'Centre de Mathématiques Appliquées et Calcul Scientifique (CMACS)',
    anneeTheseEnCours: 2,
    anneeTheseSollicitee: 3,
    anneeUniversitaire: '2026/2027',
    status: 'reinscription_validee',
    dateDebutDemande: '2026-09-25',
    rapportActivites: {
      anneeCible: 3,
      avancementPourcentage: 90,
      resumeAvancement: 'Finalisation des campagnes d\'essais en chambre anéchoïque. Rédaction du manuscrit de thèse entamée (3 chapitres finalisés).',
      objectifsAtteints: '2 articles majeurs parus ; 200 heures de formations doctorales CED validées.',
      difficultesEtSolutions: 'Aucune difficulté majeure.',
      publications: [
        {
          titre: 'Stochastic Topology Optimization for Broadband Acoustic Metamaterials',
          revueOuConference: 'Journal of the Mechanics and Physics of Solids',
          statut: 'Publié',
          indexation: 'Scopus Q1 (IF: 5.8)',
          annee: 2026
        }
      ],
      formationsValideesHeures: 200,
      participationsCongres: 'Congrès Français d\'Acoustique.',
      calendrierPrevisionnelSoutenance: 'Février 2027',
      dateSoumission: '2026-09-28 10:00'
    },
    avisDirecteur: {
      decision: 'Très favorable',
      appreciationQualite: 'Excellente',
      commentairesEtRecommandations: 'Thèse de niveau exceptionnel. Soutenance prévue au début 2027.',
      dateAvis: '2026-09-30 14:00',
      delaiRespecte: true
    },
    validationLabo: {
      decision: 'Validé',
      directeurLaboNom: 'Prof. Amina Chraibi',
      commentaires: 'Validation sans réserve.',
      dateValidation: '2026-10-02 11:00'
    },
    confirmationCed: {
      decision: 'Confirmé',
      directeurCedNom: 'Direction CED',
      commentaires: 'Dossier modèle. Félicitations pour les 200h de formations validées.',
      dateConfirmation: '2026-10-04 15:30'
    },
    dossierAdministratif: {
      quittanceDroitsPayee: true,
      attestationAssuranceValide: true,
      rapportValidePresent: true,
      ficheReinscriptionTelechargee: true,
      statutPieces: 'conforme',
      piecesManquantes: []
    },
    dateValidationFinale: '2026-10-06 12:00',
    nouvelleAttestationNumero: 'RE-2026-CMACS-0012-A3',
    historique: [
      { date: '2026-09-25 10:00', acteur: 'Doctorant', etape: '1. Accès', action: 'Accès rubrique réinscription.' },
      { date: '2026-09-28 10:00', acteur: 'Doctorant', etape: '2. Rapport', action: 'Rapport annuel validé (90%).' },
      { date: '2026-09-30 14:00', acteur: 'Directeur', etape: '3. Avis', action: 'Avis Très Favorable formulé.' },
      { date: '2026-10-02 11:00', acteur: 'Laboratoire', etape: '4. Labo', action: 'Validé par la structure.' },
      { date: '2026-10-04 15:30', acteur: 'CED', etape: '5. CED', action: 'Confirmé par le CED.' },
      { date: '2026-10-06 12:00', acteur: 'Administration', etape: '7. Finalisation', action: 'Réinscription définitive 3ème année validée ! Attestation générée : RE-2026-CMACS-0012-A3' }
    ]
  }
];

export const INITIAL_USER: UserAccount = {
  id: 'usr-candidat-1',
  email: 'salma.elamrani@gmail.com',
  nom: 'El Amrani',
  prenom: 'Salma',
  estActif: true,
  dateCreation: '2026-10-17',
  typeCompte: 'candidat'
};
