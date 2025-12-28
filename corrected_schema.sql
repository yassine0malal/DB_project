-- Script de création de la base de données corrigée (MCD Optimisé)

-- 1. Table UTILISATEUR (Base pour Etudiants et Enseignants)
CREATE TABLE UTILISATEUR (
    id_utilisateur INTEGER PRIMARY KEY AUTOINCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    bio TEXT,
    photo_profil VARCHAR(255),
    role VARCHAR(50) CHECK(role IN ('etudiant', 'enseignant', 'admin')) NOT NULL,
    date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table ETUDIANT (Hérite de UTILISATEUR)
CREATE TABLE ETUDIANT (
    id_etudiant INTEGER PRIMARY KEY,
    cne VARCHAR(50) UNIQUE,
    niveau_etude VARCHAR(50), -- ex: 1ère année, 2ème année
    filiere VARCHAR(100),
    FOREIGN KEY (id_etudiant) REFERENCES UTILISATEUR(id_utilisateur) ON DELETE CASCADE
);

-- 3. Table ENSEIGNANT (Hérite de UTILISATEUR)
CREATE TABLE ENSEIGNANT (
    id_enseignant INTEGER PRIMARY KEY,
    matricule VARCHAR(50) UNIQUE,
    grade VARCHAR(100), -- ex: Professeur Agrégé
    specialite VARCHAR(100),
    departement VARCHAR(100),
    FOREIGN KEY (id_enseignant) REFERENCES UTILISATEUR(id_utilisateur) ON DELETE CASCADE
);

-- 4. Table CLUB
CREATE TABLE CLUB (
    id_club INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_club VARCHAR(100) NOT NULL,
    description TEXT,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    logo_url VARCHAR(255)
);

-- 5. Table ADHESION (Association N:M entre UTILISATEUR et CLUB)
-- "Simplify the link between User and Club"
CREATE TABLE ADHESION (
    id_utilisateur INTEGER,
    id_club INTEGER,
    date_adhesion DATETIME DEFAULT CURRENT_TIMESTAMP,
    role_membre VARCHAR(50) DEFAULT 'membre', -- membre, bureau, president
    PRIMARY KEY (id_utilisateur, id_club),
    FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_club) REFERENCES CLUB(id_club) ON DELETE CASCADE
);

-- 6. Table EVENEMENT
CREATE TABLE EVENEMENT (
    id_evenement INTEGER PRIMARY KEY AUTOINCREMENT,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    date_debut DATETIME NOT NULL,
    lieu VARCHAR(200),
    id_club INTEGER, -- Organisé par un Club
    id_organisateur INTEGER, -- Ou par un Enseignant/Utilisateur direct
    FOREIGN KEY (id_club) REFERENCES CLUB(id_club) ON DELETE SET NULL,
    FOREIGN KEY (id_organisateur) REFERENCES UTILISATEUR(id_utilisateur) ON DELETE SET NULL
);

-- 7. Table PARTICIPATION (Etudiants/Profs participant aux événements)
CREATE TABLE PARTICIPATION (
    id_utilisateur INTEGER,
    id_evenement INTEGER,
    date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_utilisateur, id_evenement),
    FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_evenement) REFERENCES EVENEMENT(id_evenement) ON DELETE CASCADE
);

-- 8. Table VISITEUR (Externes participant aux événements)
CREATE TABLE VISITEUR (
    id_visiteur INTEGER PRIMARY KEY AUTOINCREMENT,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(255),
    id_evenement INTEGER,
    FOREIGN KEY (id_evenement) REFERENCES EVENEMENT(id_evenement) ON DELETE CASCADE
);

-- 9. Table PUBLICATION
CREATE TABLE PUBLICATION (
    id_publication INTEGER PRIMARY KEY AUTOINCREMENT,
    contenu TEXT NOT NULL,
    image_url VARCHAR(255),
    date_publication DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_auteur INTEGER NOT NULL,
    id_club INTEGER, -- Optionnel: Publication liée à un club
    FOREIGN KEY (id_auteur) REFERENCES UTILISATEUR(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_club) REFERENCES CLUB(id_club) ON DELETE SET NULL
);

-- 10. Table COMMENTAIRE (Correction typo 'Commantaire')
CREATE TABLE COMMENTAIRE (
    id_commentaire INTEGER PRIMARY KEY AUTOINCREMENT,
    contenu TEXT NOT NULL,
    date_commentaire DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_auteur INTEGER NOT NULL,
    id_publication INTEGER NOT NULL,
    FOREIGN KEY (id_auteur) REFERENCES UTILISATEUR(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_publication) REFERENCES PUBLICATION(id_publication) ON DELETE CASCADE
);

-- 11. Table AIMER_PUBLICATION (Optimisation 'LIKE' en relation directe)
-- "Convert the LIKE entity into a direct Many-to-Many relationship"
CREATE TABLE AIMER_PUBLICATION (
    id_utilisateur INTEGER,
    id_publication INTEGER,
    date_reaction DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_utilisateur, id_publication),
    FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_publication) REFERENCES PUBLICATION(id_publication) ON DELETE CASCADE
);

-- 12. Table SUIVRE (Networking)
CREATE TABLE SUIVRE (
    id_suiveur INTEGER,
    id_suivi INTEGER,
    date_suivi DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_suiveur, id_suivi),
    FOREIGN KEY (id_suiveur) REFERENCES UTILISATEUR(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_suivi) REFERENCES UTILISATEUR(id_utilisateur) ON DELETE CASCADE
);

-- 13. Table SIGNALEMENT (Polymorphic Signalisation)
-- "Propose a clean SQL solution for Signalisation so it can reference either a PUBLICATION OR a COMMENTAIRE"
-- Solution: Clés étrangères changeables (Nullable Foreign Keys) + Check Constraint
CREATE TABLE SIGNALEMENT (
    id_signalement INTEGER PRIMARY KEY AUTOINCREMENT, -- Correction typo 'id_dignalement'
    motif TEXT NOT NULL,
    statut VARCHAR(50) DEFAULT 'en_attente', -- en_attente, resolu, rejete
    date_signalement DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_signaleur INTEGER NOT NULL, -- Celui qui signale
    
    -- Cibles (Polymorphisme) : Une seule doit être remplie
    id_publication_cible INTEGER,
    id_commentaire_cible INTEGER,
    id_utilisateur_cible INTEGER,
    
    FOREIGN KEY (id_signaleur) REFERENCES UTILISATEUR(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_publication_cible) REFERENCES PUBLICATION(id_publication) ON DELETE SET NULL,
    FOREIGN KEY (id_commentaire_cible) REFERENCES COMMENTAIRE(id_commentaire) ON DELETE SET NULL,
    FOREIGN KEY (id_utilisateur_cible) REFERENCES UTILISATEUR(id_utilisateur) ON DELETE SET NULL,
    
    -- Contrainte: Une seule cible doit être définie
    CHECK (
        (id_publication_cible IS NOT NULL AND id_commentaire_cible IS NULL AND id_utilisateur_cible IS NULL) OR
        (id_publication_cible IS NULL AND id_commentaire_cible IS NOT NULL AND id_utilisateur_cible IS NULL) OR
        (id_publication_cible IS NULL AND id_commentaire_cible IS NULL AND id_utilisateur_cible IS NOT NULL)
    )
);

-- Fin du script
