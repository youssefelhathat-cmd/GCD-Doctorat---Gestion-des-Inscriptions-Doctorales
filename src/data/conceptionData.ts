import { DebateMatrix } from '../types';

export const SYNTHESE_INSCRIPTION: DebateMatrix = {
  titre: "Synthèse de l'inscription au cycle doctoral",
  sousTitre: "Plateforme GCD · Cycle Initial 1ère Année",
  type: "inscription",
  objectifGlobal: "Simplifier l'inscription au cycle doctoral grâce à une meilleure utilisabilité de la plateforme GCD, à la réduction des tâches répétitives et à un meilleur suivi des candidatures.",
  etapes: [
    {
      numeroEtape: 1,
      titreEtape: "Recherche des sujets",
      iconName: "Search",
      casUtilisation: [
        "Consulter les sujets disponibles.",
        "Comparer les propositions."
      ],
      processusPhysique: [
        "Se renseigner auprès des laboratoires.",
        "Consulter les affichages."
      ],
      processusNumerique: [
        "Accéder à la liste des sujets.",
        "Consulter les détails sur GCD."
      ],
      problemesRencontres: [
        "Manque d'informations.",
        "Difficulté à contacter les encadrants."
      ],
      solutionsOrganisationnelles: [
        "Mettre à jour régulièrement les sujets.",
        "Organiser des séances d'information."
      ],
      solutionsInformatiques: [
        "Moteur de recherche et filtres.",
        "Fiches de sujets plus détaillées."
      ],
      correspondanceApplication: {
        couleur: "text-amber-800 bg-amber-50 border-amber-200",
        description: "Catalogue public avec recherche temps-réel, filtre par discipline/laboratoire, fiches complètes avec objectifs, prérequis et contacts.",
        roleLie: "candidat"
      }
    },
    {
      numeroEtape: 2,
      titreEtape: "Choix des sujets / panier",
      iconName: "ShoppingBag",
      casUtilisation: [
        "Sélectionner les sujets qui correspondent au profil.",
        "Préparer ses choix avant candidature."
      ],
      processusPhysique: [
        "Demander conseil à l'encadrant si besoin."
      ],
      processusNumerique: [
        "Ajouter les sujets au panier.",
        "Modifier les choix avant validation."
      ],
      problemesRencontres: [
        "Choix peu clair.",
        "Risque de dépasser la limite autorisée."
      ],
      solutionsOrganisationnelles: [
        "Préciser clairement les règles de candidature."
      ],
      solutionsInformatiques: [
        "Panier de sujets.",
        "Contrôle automatique du nombre de choix (max 3 sujets)."
      ],
      correspondanceApplication: {
        couleur: "text-sky-800 bg-sky-50 border-sky-200",
        description: "Panier persistant bloquant strictement tout dépassement au-delà de 3 choix avec compteur visuel et ordonnancement des priorités.",
        roleLie: "candidat"
      }
    },
    {
      numeroEtape: 3,
      titreEtape: "Création / activation du compte",
      iconName: "UserPlus",
      casUtilisation: [
        "Créer un compte candidat.",
        "Activer le compte."
      ],
      processusPhysique: [
        "Aucune démarche physique normale."
      ],
      processusNumerique: [
        "Créer un compte.",
        "Recevoir puis valider l'e-mail d'activation."
      ],
      problemesRencontres: [
        "Création trop précoce du compte.",
        "Problèmes de connexion ou d'activation."
      ],
      solutionsOrganisationnelles: [
        "Expliquer quand créer le compte."
      ],
      solutionsInformatiques: [
        "Création du compte après le panier.",
        "Aide à la connexion / réinitialisation."
      ],
      correspondanceApplication: {
        couleur: "text-indigo-800 bg-indigo-50 border-indigo-200",
        description: "Compte déclenché uniquement après validation d'un panier conforme. Simulation de l'email d'activation GCD et connexion automatique.",
        roleLie: "candidat"
      }
    },
    {
      numeroEtape: 4,
      titreEtape: "Soumission de la candidature",
      iconName: "UploadCloud",
      casUtilisation: [
        "Compléter les informations.",
        "Déposer les documents demandés."
      ],
      processusPhysique: [
        "Préparer éventuellement certaines pièces justificatives."
      ],
      processusNumerique: [
        "Remplir le formulaire.",
        "Téléverser les documents une seule fois."
      ],
      problemesRencontres: [
        "Saisies répétitives.",
        "Documents manquants."
      ],
      solutionsOrganisationnelles: [
        "Liste claire des pièces à fournir."
      ],
      solutionsInformatiques: [
        "Préremplissage automatique.",
        "Contrôle des pièces obligatoires."
      ],
      correspondanceApplication: {
        couleur: "text-blue-800 bg-blue-50 border-blue-200",
        description: "Dépôt unique des pièces académiques (CV, Master, relevés, avant-projet). Transmission partagée aux 1 à 3 sujets sans re-saisie.",
        roleLie: "candidat"
      }
    },
    {
      numeroEtape: 5,
      titreEtape: "Examen des candidatures",
      iconName: "ClipboardCheck",
      casUtilisation: [
        "Étudier les dossiers.",
        "Présélectionner les candidats."
      ],
      processusPhysique: [
        "Réunion de la commission si nécessaire."
      ],
      processusNumerique: [
        "Consulter les candidatures.",
        "Enregistrer la présélection."
      ],
      problemesRencontres: [
        "Manque de transparence.",
        "Retard de traitement."
      ],
      solutionsOrganisationnelles: [
        "Définir des critères clairs."
      ],
      solutionsInformatiques: [
        "Tableau de bord.",
        "Historique des décisions."
      ],
      correspondanceApplication: {
        couleur: "text-orange-800 bg-orange-50 border-orange-200",
        description: "Interface dédiée Commission avec tableau de bord, notation sur 20, tri par moyenne de Master et journal d'audit complet.",
        roleLie: "professeur"
      }
    },
    {
      numeroEtape: 6,
      titreEtape: "Entretien et résultats",
      iconName: "Calendar",
      casUtilisation: [
        "Passer l'entretien.",
        "Consulter les résultats."
      ],
      processusPhysique: [
        "Se déplacer pour l'entretien."
      ],
      processusNumerique: [
        "Recevoir la convocation.",
        "Consulter la décision / notification."
      ],
      problemesRencontres: [
        "Informations peu visibles.",
        "Retard de publication."
      ],
      solutionsOrganisationnelles: [
        "Planifier les entretiens.",
        "Fixer une date de publication."
      ],
      solutionsInformatiques: [
        "Convocations et notifications automatiques.",
        "Publication claire des résultats (PV d'entretien)."
      ],
      correspondanceApplication: {
        couleur: "text-purple-800 bg-purple-50 border-purple-200",
        description: "Planificateur d'oraux, composition de jury, saisie du PV officiel avec avis unanime et notification temps-réel au candidat.",
        roleLie: "professeur"
      }
    },
    {
      numeroEtape: 7,
      titreEtape: "Inscription administrative",
      iconName: "FileCheck",
      casUtilisation: [
        "Déposer le dossier final.",
        "Finaliser l'inscription."
      ],
      processusPhysique: [
        "Présenter ou déposer les documents administratifs."
      ],
      processusNumerique: [
        "Préparer les documents préremplis.",
        "Suivre l'état du dossier."
      ],
      problemesRencontres: [
        "Double papier / numérique.",
        "Dossier incomplet."
      ],
      solutionsOrganisationnelles: [
        "Réduire les pièces en double."
      ],
      solutionsInformatiques: [
        "Vérification automatique du dossier.",
        "Statut clair : incomplet / conforme / validé."
      ],
      correspondanceApplication: {
        couleur: "text-emerald-800 bg-emerald-50 border-emerald-200",
        description: "Checklist d'audit avec signalement précis des manques, boucle 'Corriger le dossier', attribution du matricule officiel et attestation.",
        roleLie: "administration"
      }
    }
  ]
};

export const SYNTHESE_REINSCRIPTION: DebateMatrix = {
  titre: "Synthèse de la réinscription au cycle doctoral",
  sousTitre: "Plateforme GCD · Réinscription Annuelle (2ème, 3ème et 4ème Année)",
  type: "reinscription",
  objectifGlobal: "Simplifier et sécuriser la réinscription au cycle doctoral grâce à une meilleure organisation, à la réduction des tâches répétitives et à un meilleur suivi sur la plateforme GCD.",
  etapes: [
    {
      numeroEtape: 1,
      titreEtape: "Accès à la réinscription",
      iconName: "KeyRound",
      casUtilisation: [
        "Accéder à la rubrique de réinscription."
      ],
      processusPhysique: [
        "Se renseigner auprès du service concerné."
      ],
      processusNumerique: [
        "Se connecter à GCD.",
        "Accéder à la rubrique Réinscription."
      ],
      problemesRencontres: [
        "Rubrique difficile à trouver."
      ],
      solutionsOrganisationnelles: [
        "Fournir des informations claires."
      ],
      solutionsInformatiques: [
        "Mettre en évidence la rubrique Réinscription."
      ],
      correspondanceApplication: {
        couleur: "text-sky-800 bg-sky-50 border-sky-200",
        description: "Bouton d'accès rapide direct dans la barre de navigation supérieure et panneau de réinscription mis en avant dès la connexion du doctorant.",
        roleLie: "candidat"
      }
    },
    {
      numeroEtape: 2,
      titreEtape: "Rapport d'activités",
      iconName: "FileEdit",
      casUtilisation: [
        "Préparer le rapport d'activités.",
        "Décrire l'avancement des travaux."
      ],
      processusPhysique: [
        "Rédiger le contenu avec le directeur de thèse."
      ],
      processusNumerique: [
        "Saisir le rapport sur la plateforme."
      ],
      problemesRencontres: [
        "Formulaire peu clair.",
        "Risque d'oublis."
      ],
      solutionsOrganisationnelles: [
        "Fournir un modèle de rapport."
      ],
      solutionsInformatiques: [
        "Interface plus guidée.",
        "Champs explicites (avancement %, publications, formations CED, calendrier de soutenance)."
      ],
      correspondanceApplication: {
        couleur: "text-amber-800 bg-amber-50 border-amber-200",
        description: "Assistant guidé pas à pas : saisie structurée du taux d'avancement, ajout des publications indexées, crédits d'heures CED et estimation de soutenance.",
        roleLie: "candidat"
      }
    },
    {
      numeroEtape: 3,
      titreEtape: "Avis du directeur de thèse",
      iconName: "Award",
      casUtilisation: [
        "Soumettre le rapport.",
        "Recevoir l'avis."
      ],
      processusPhysique: [
        "Échanger avec le directeur de thèse."
      ],
      processusNumerique: [
        "Transmission du rapport.",
        "Saisie de l'avis sur GCD."
      ],
      problemesRencontres: [
        "Retard dans la validation.",
        "Demandes de correction peu claires."
      ],
      solutionsOrganisationnelles: [
        "Fixer un délai de validation."
      ],
      solutionsInformatiques: [
        "Notifications.",
        "Suivi des validations."
      ],
      correspondanceApplication: {
        couleur: "text-orange-800 bg-orange-50 border-orange-200",
        description: "Alerte pour le directeur avec compte à rebours de délai réglementaire, appréciation qualitative et avis officiel motivé (Très favorable, Favorable, Réservé).",
        roleLie: "professeur"
      }
    },
    {
      numeroEtape: 4,
      titreEtape: "Validation de la structure / laboratoire",
      iconName: "Building2",
      casUtilisation: [
        "Soumettre la demande au niveau de la structure."
      ],
      processusPhysique: [
        "Si besoin, faire signer certains documents."
      ],
      processusNumerique: [
        "Examen et validation sur GCD."
      ],
      problemesRencontres: [
        "Retard de traitement.",
        "Critères peu visibles."
      ],
      solutionsOrganisationnelles: [
        "Clarifier le rôle du laboratoire."
      ],
      solutionsInformatiques: [
        "Historique et statut des validations."
      ],
      correspondanceApplication: {
        couleur: "text-emerald-800 bg-emerald-50 border-emerald-200",
        description: "Espace Directeur de Laboratoire avec contrôle des critères d'accueil, traçabilité de date et visa officiel sans paperasse.",
        roleLie: "directeur_labo"
      }
    },
    {
      numeroEtape: 5,
      titreEtape: "Confirmation du CED",
      iconName: "School",
      casUtilisation: [
        "Obtenir la confirmation finale académique."
      ],
      processusPhysique: [
        "Attendre la validation institutionnelle."
      ],
      processusNumerique: [
        "Validation du CED sur la plateforme."
      ],
      problemesRencontres: [
        "Délai parfois long."
      ],
      solutionsOrganisationnelles: [
        "Définir un calendrier."
      ],
      solutionsInformatiques: [
        "Notification du changement de statut."
      ],
      correspondanceApplication: {
        couleur: "text-purple-800 bg-purple-50 border-purple-200",
        description: "Confirmation institutionnelle par lot ou unitaire du CED avec vérification des crédits de formation doctorale et notification en temps réel.",
        roleLie: "directeur_ced"
      }
    },
    {
      numeroEtape: 6,
      titreEtape: "Vérification administrative",
      iconName: "FileCheck2",
      casUtilisation: [
        "Constituer le dossier administratif.",
        "Déposer ou présenter les pièces demandées."
      ],
      processusPhysique: [
        "Préparer le dossier et les copies requises."
      ],
      processusNumerique: [
        "Télécharger la fiche finale.",
        "Suivre l'état du dossier."
      ],
      problemesRencontres: [
        "Documents manquants.",
        "Allers-retours inutiles."
      ],
      solutionsOrganisationnelles: [
        "Liste précise des pièces."
      ],
      solutionsInformatiques: [
        "Contrôle automatique des pièces.",
        "Signalement des pièces manquantes."
      ],
      correspondanceApplication: {
        couleur: "text-indigo-800 bg-indigo-50 border-indigo-200",
        description: "Audit administratif automatisé : vérification quittance, assurance, téléchargement de la fiche récapitulative et notification des pièces incomplètes.",
        roleLie: "administration"
      }
    },
    {
      numeroEtape: 7,
      titreEtape: "Validation finale de la réinscription",
      iconName: "Award",
      casUtilisation: [
        "Consulter l'état final.",
        "Confirmer la réinscription."
      ],
      processusPhysique: [
        "Récupérer une confirmation si nécessaire."
      ],
      processusNumerique: [
        "Voir le statut final sur GCD."
      ],
      problemesRencontres: [
        "Manque de visibilité.",
        "Communication tardive."
      ],
      solutionsOrganisationnelles: [
        "Informer le doctorant rapidement."
      ],
      solutionsInformatiques: [
        "Statut final clair.",
        "Notification automatique."
      ],
      correspondanceApplication: {
        couleur: "text-emerald-900 bg-emerald-100 border-emerald-300",
        description: "Validation immédiate et définitive de l'année N+1, reconduction du statut étudiant-chercheur et génération de l'attestation officielle de réinscription.",
        roleLie: "administration"
      }
    }
  ]
};

export const DEBATE_MATRICES = {
  inscription: SYNTHESE_INSCRIPTION,
  reinscription: SYNTHESE_REINSCRIPTION
};

