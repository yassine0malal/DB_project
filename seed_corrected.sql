-- Données de test complètes pour le schéma corrigé (MCD Optimisé)

-- 1. Insertion des UTILISATEURS (20 utilisateurs)
INSERT INTO UTILISATEUR (nom, prenom, email, mot_de_passe, bio, photo_profil, role) VALUES
-- Étudiants (12)
('Martin', 'Lucas', 'lucas.martin@edu.univ.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Étudiant en informatique passionné par le développement web', 'profile1.jpg', 'etudiant'),
('Bernard', 'Emma', 'emma.bernard@edu.univ.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Étudiante en médecine, membre du club de théâtre', 'profile2.jpg', 'etudiant'),
('Dubois', 'Hugo', 'hugo.dubois@edu.univ.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Passionné de robotique et de AI', 'profile3.jpg', 'etudiant'),
('Thomas', 'Chloé', 'chloe.thomas@edu.univ.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Étudiante en droit, présidente du club de débat', NULL, 'etudiant'),
('Robert', 'Louis', 'louis.robert@edu.univ.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Membre actif du club de programmation', 'profile5.jpg', 'etudiant'),
('Richard', 'Léa', 'lea.richard@edu.univ.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Étudiante en biologie, adepte de photographie', 'profile6.jpg', 'etudiant'),
('Petit', 'Gabriel', 'gabriel.petit@edu.univ.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Développeur Full-Stack en formation', NULL, 'etudiant'),
('Durand', 'Jade', 'jade.durand@edu.univ.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Membre du bureau des étudiants', 'profile8.jpg', 'etudiant'),
('Leroy', 'Nathan', 'nathan.leroy@edu.univ.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Passionné de cyber-sécurité', 'profile9.jpg', 'etudiant'),
('Moreau', 'Manon', 'manon.moreau@edu.univ.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Étudiante en architecture', NULL, 'etudiant'),
('Simon', 'Tom', 'tom.simon@edu.univ.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Membre du club de robotique', 'profile11.jpg', 'etudiant'),
('Laurent', 'Inès', 'ines.laurent@edu.univ.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Étudiante en marketing digital', 'profile12.jpg', 'etudiant'),

-- Enseignants (7)
('Michel', 'Sophie', 'sophie.michel@univ.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Professeur d''informatique, spécialisée en bases de données', 'profile13.jpg', 'enseignant'),
('Garcia', 'Pierre', 'pierre.garcia@univ.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Professeur de physique quantique', NULL, 'enseignant'),
('David', 'Marie', 'marie.david@univ.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Professeure de littérature française', 'profile15.jpg', 'enseignant'),
('Bertrand', 'Philippe', 'philippe.bertrand@univ.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Professeur de mathématiques appliquées', 'profile16.jpg', 'enseignant'),
('Roux', 'Catherine', 'catherine.roux@univ.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Professeure de biologie moléculaire', NULL, 'enseignant'),
('Vincent', 'Alain', 'alain.vincent@univ.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Professeur d''histoire contemporaine', 'profile18.jpg', 'enseignant'),
('Fournier', 'Isabelle', 'isabelle.fournier@univ.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Professeure de droit international', 'profile19.jpg', 'enseignant'),

-- Admin (1)
('Admin', 'System', 'admin@univ.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrateur système de la plateforme', 'admin.jpg', 'admin');

-- 2. Insertion des ETUDIANTS (12 étudiants)
INSERT INTO ETUDIANT (id_etudiant, cne, niveau_etude, filiere) VALUES
(1, 'G123456789', '2ème année', 'Informatique'),
(2, 'G987654321', '3ème année', 'Médecine'),
(3, 'G456789123', '1ère année', 'Génie Robotique'),
(4, 'G321654987', '4ème année', 'Droit'),
(5, 'G789123456', '2ème année', 'Informatique'),
(6, 'G147258369', '3ème année', 'Biologie'),
(7, 'G258369147', '1ère année', 'Développement Web'),
(8, 'G369258147', '2ème année', 'Sciences Politiques'),
(9, 'G741852963', '3ème année', 'Cybersécurité'),
(10, 'G852963741', '2ème année', 'Architecture'),
(11, 'G963852741', '1ère année', 'Robotique'),
(12, 'G159753486', '3ème année', 'Marketing Digital');

-- 3. Insertion des ENSEIGNANTS (7 enseignants)
INSERT INTO ENSEIGNANT (id_enseignant, matricule, grade, specialite, departement) VALUES
(13, 'PROF001', 'Professeur Agrégé', 'Bases de Données', 'Informatique'),
(14, 'PROF002', 'Professeur des Universités', 'Physique Quantique', 'Physique'),
(15, 'PROF003', 'Maître de Conférences', 'Littérature Française', 'Lettres'),
(16, 'PROF004', 'Professeur Agrégé', 'Mathématiques Appliquées', 'Mathématiques'),
(17, 'PROF005', 'Professeure des Universités', 'Biologie Moléculaire', 'Biologie'),
(18, 'PROF006', 'Maître de Conférences', 'Histoire Contemporaine', 'Histoire'),
(19, 'PROF007', 'Professeure Agrégée', 'Droit International', 'Droit');

-- 4. Insertion des CLUBS (5 clubs)
INSERT INTO CLUB (nom_club, description, date_creation, logo_url) VALUES
('Club Informatique', 'Club dédié à la programmation, développement web et nouvelles technologies', '2023-01-15 10:00:00', 'club_info.png'),
('Club de Débat', 'Espace d''échange et de discussion sur des sujets d''actualité et philosophiques', '2022-09-20 14:30:00', 'club_debat.png'),
('Club Robotique', 'Conception et programmation de robots pour des compétitions universitaires', '2023-03-10 09:00:00', 'club_robot.png'),
('Club Photo', 'Ateliers de photographie et sorties photo en extérieur', '2022-11-05 16:00:00', 'club_photo.png'),
('Club Théâtre', 'Ateliers de théâtre et représentations publiques', '2023-02-28 18:00:00', 'club_theatre.png');

-- 5. Insertion des ADHESIONS (25 adhésions)
INSERT INTO ADHESION (id_utilisateur, id_club, date_adhesion, role_membre) VALUES
-- Club Informatique
(1, 1, '2023-01-20 11:00:00', 'bureau'),
(3, 1, '2023-01-22 15:30:00', 'membre'),
(5, 1, '2023-01-25 09:45:00', 'bureau'),
(7, 1, '2023-02-01 14:20:00', 'membre'),
(9, 1, '2023-02-05 10:15:00', 'membre'),
(13, 1, '2023-01-18 16:00:00', 'president'),

-- Club de Débat
(4, 2, '2022-09-25 17:30:00', 'president'),
(8, 2, '2022-10-01 13:45:00', 'bureau'),
(12, 2, '2022-10-10 10:00:00', 'membre'),
(19, 2, '2022-09-22 11:30:00', 'bureau'),

-- Club Robotique
(3, 3, '2023-03-15 14:00:00', 'president'),
(9, 3, '2023-03-20 09:30:00', 'bureau'),
(11, 3, '2023-03-18 16:45:00', 'membre'),
(14, 3, '2023-03-12 15:20:00', 'bureau'),

-- Club Photo
(6, 4, '2022-11-10 18:00:00', 'president'),
(2, 4, '2022-11-15 14:30:00', 'membre'),
(10, 4, '2022-11-20 10:00:00', 'membre'),
(17, 4, '2022-11-08 16:15:00', 'bureau'),

-- Club Théâtre
(2, 5, '2023-03-05 19:00:00', 'president'),
(4, 5, '2023-03-10 17:45:00', 'membre'),
(8, 5, '2023-03-12 18:30:00', 'bureau'),
(10, 5, '2023-03-08 20:00:00', 'membre'),
(15, 5, '2023-03-01 19:30:00', 'bureau');

-- 6. Insertion des EVENEMENTS (8 événements)
INSERT INTO EVENEMENT (titre, description, date_debut, lieu, id_club, id_organisateur) VALUES
('Hackathon 2023', '24h de programmation non-stop avec des défis variés', '2023-04-15 09:00:00', 'Bâtiment Informatique - Salle 201', 1, 13),
('Débat: IA et Société', 'Discussion sur l''impact de l''IA sur notre quotidien', '2023-05-10 18:30:00', 'Amphithéâtre B', 2, 4),
('Compétition Robotique', 'Première compétition inter-universitaire de robots', '2023-06-20 10:00:00', 'Gymnase Universitaire', 3, 3),
('Exposition Photo', 'Vernissage de l''exposition "Regards sur la ville"', '2023-05-25 19:00:00', 'Galerie d''Art Universitaire', 4, 6),
('Pièce: "Les Misérables"', 'Représentation théâtrale de la célèbre œuvre', '2023-06-15 20:00:00', 'Théâtre Universitaire', 5, 2),
('Conférence: Cybersécurité', 'Les nouveaux enjeux de la sécurité informatique', '2023-04-30 14:00:00', 'Salle de Conférence A', 1, 9),
('Atelier Photo Nature', 'Sortie photo dans le parc naturel régional', '2023-05-20 08:00:00', 'Parc Naturel Régional', 4, 17),
('Débat: Éthique en Science', 'Questions éthiques dans la recherche scientifique', '2023-06-05 17:00:00', 'Salle des Colloques', 2, 19);

-- 7. Insertion des PARTICIPATIONS (30 participations)
INSERT INTO PARTICIPATION (id_utilisateur, id_evenement, date_inscription) VALUES
-- Hackathon
(1, 1, '2023-04-01 10:00:00'),
(3, 1, '2023-04-02 14:30:00'),
(5, 1, '2023-04-03 09:45:00'),
(7, 1, '2023-04-04 11:20:00'),
(9, 1, '2023-04-05 16:00:00'),

-- Débat IA
(4, 2, '2023-04-20 18:00:00'),
(8, 2, '2023-04-21 10:30:00'),
(12, 2, '2023-04-22 15:45:00'),
(13, 2, '2023-04-23 09:15:00'),
(16, 2, '2023-04-24 14:00:00'),

-- Compétition Robotique
(3, 3, '2023-05-15 08:30:00'),
(9, 3, '2023-05-16 10:00:00'),
(11, 3, '2023-05-17 13:45:00'),
(14, 3, '2023-05-18 16:20:00'),
(1, 3, '2023-05-19 11:10:00'),

-- Exposition Photo
(2, 4, '2023-05-10 12:00:00'),
(6, 4, '2023-05-11 14:30:00'),
(10, 4, '2023-05-12 18:45:00'),
(17, 4, '2023-05-13 10:15:00'),
(5, 4, '2023-05-14 16:40:00'),

-- Pièce de théâtre
(2, 5, '2023-05-25 09:00:00'),
(4, 5, '2023-05-26 14:20:00'),
(8, 5, '2023-05-27 11:30:00'),
(10, 5, '2023-05-28 17:45:00'),
(15, 5, '2023-05-29 19:10:00'),

-- Conférence Cybersécurité
(9, 6, '2023-04-15 13:00:00'),
(1, 6, '2023-04-16 15:30:00'),
(7, 6, '2023-04-17 10:45:00'),
(13, 6, '2023-04-18 14:20:00');

-- 8. Insertion des VISITEURS (10 visiteurs pour événements)
INSERT INTO VISITEUR (nom, prenom, email, id_evenement) VALUES
('Dupont', 'Jean', 'jean.dupont@external.com', 1),
('Lambert', 'Sarah', 'sarah.lambert@external.com', 2),
('Chevalier', 'Marc', 'marc.chevalier@external.com', 3),
('Benoit', 'Laura', 'laura.benoit@external.com', 4),
('Renaud', 'Thomas', 'thomas.renaud@external.com', 5),
('Lemoine', 'Clara', 'clara.lemoine@external.com', 1),
('Girard', 'Antoine', 'antoine.girard@external.com', 2),
('Barbier', 'Julie', 'julie.barbier@external.com', 3),
('Perrin', 'Nicolas', 'nicolas.perrin@external.com', 4),
('Clement', 'Elodie', 'elodie.clement@external.com', 5);

-- 9. Insertion des PUBLICATIONS (15 publications)
INSERT INTO PUBLICATION (contenu, image_url, date_publication, id_auteur, id_club) VALUES
('Notre prochain hackathon aura lieu le 15 avril ! Inscriptions ouvertes.', 'hackathon_poster.jpg', '2023-03-20 10:00:00', 1, 1),
('Photos de notre dernière sortie photo au parc naturel. Magnifiques paysages !', 'nature_photos.jpg', '2023-04-05 15:30:00', 6, 4),
('Débat passionnant hier soir sur l''IA et ses implications éthiques.', NULL, '2023-05-11 09:15:00', 4, 2),
('Notre équipe de robotique a remporté la 2ème place à la compétition régionale !', 'robot_prize.jpg', '2023-06-25 16:45:00', 3, 3),
('Représentation théâtrale de samedi dernier : un grand succès ! Merci à tous.', 'theatre_success.jpg', '2023-06-18 11:20:00', 2, 5),
('Nouveau projet : développement d''une application mobile pour l''université', 'mobile_app.jpg', '2023-04-10 14:00:00', 5, 1),
('Atelier photo portrait ce weekend. Inscrivez-vous vite !', 'portrait_workshop.jpg', '2023-05-08 12:30:00', 10, 4),
('Discussion intéressante sur la réforme de l''enseignement supérieur', NULL, '2023-06-02 18:45:00', 8, 2),
('Découverte du nouveau laboratoire de robotique : équipement de pointe !', 'lab_robot.jpg', '2023-07-05 10:15:00', 9, 3),
('Merci à notre metteur en scène pour ce travail exceptionnel', NULL, '2023-06-20 20:30:00', 15, 5),
('Rappel : réunion du club informatique demain à 18h', NULL, '2023-04-14 16:00:00', 7, 1),
('Exposition photo prolongée jusqu''à la fin du mois !', 'expo_extended.jpg', '2023-06-10 09:45:00', 17, 4),
('Appel à participants pour le prochain tournoi de débat', 'debate_tournament.jpg', '2023-07-01 13:20:00', 19, 2),
('Construction de notre nouveau robot pour la compétition nationale', 'new_robot.jpg', '2023-08-15 15:10:00', 11, 3),
('Casting pour la prochaine pièce de théâtre : "Le Malade Imaginaire"', 'casting_call.jpg', '2023-09-05 11:00:00', 2, 5);

-- 10. Insertion des COMMENTAIRES (25 commentaires)
INSERT INTO COMMENTAIRE (contenu, date_commentaire, id_auteur, id_publication) VALUES
('Super initiative ! Je suis inscrit.', '2023-03-21 11:30:00', 3, 1),
('Les photos sont magnifiques, bravo à tous les participants !', '2023-04-06 09:45:00', 2, 2),
('Débat très enrichissant, merci pour l''organisation', '2023-05-12 14:20:00', 8, 3),
('Félicitations à toute l''équipe ! Continuez comme ça.', '2023-06-26 18:15:00', 5, 4),
('Je suis fier de faire partie de cette équipe théâtrale', '2023-06-19 20:45:00', 4, 5),
('Génial ! Je veux participer au développement.', '2023-04-11 16:30:00', 9, 6),
('Dommage, je ne suis pas disponible ce weekend...', '2023-05-09 08:15:00', 6, 7),
('Sujet très important, merci de l''avoir abordé', '2023-06-03 21:00:00', 12, 8),
('Impressionnant ! On peut venir visiter ?', '2023-07-06 11:45:00', 1, 9),
('Bravo à tous les acteurs, c''était émouvant', '2023-06-21 22:30:00', 10, 10),
('Je serai présent à la réunion, merci pour le rappel', '2023-04-15 10:20:00', 3, 11),
('Excellente nouvelle, j''irai voir l''exposition !', '2023-06-11 14:50:00', 8, 12),
('Je m''inscris pour le tournoi, hâte d''y être !', '2023-07-02 17:25:00', 4, 13),
('Vous avez besoin d''aide pour la programmation ?', '2023-08-16 09:30:00', 7, 14),
('Je participe au casting ! Quel est le processus ?', '2023-09-06 15:40:00', 2, 15),
('Quel langage de programmation utiliserez-vous ?', '2023-03-22 13:15:00', 7, 1),
('Quel appareil photo recommandez-vous pour débuter ?', '2023-04-07 18:20:00', 10, 2),
('Avez-vous des références bibliographiques sur le sujet ?', '2023-05-13 10:45:00', 13, 3),
('Quelle était la difficulté du challenge ?', '2023-06-27 12:30:00', 11, 4),
('Quelle est la prochaine pièce au programme ?', '2023-06-20 19:15:00', 6, 5),
('L''application sera-t-elle disponible sur iOS et Android ?', '2023-04-12 14:10:00', 1, 6),
('Y aura-t-il d''autres ateliers photo bientôt ?', '2023-05-10 11:25:00', 4, 7),
('Quel est le prochain sujet de débat ?', '2023-06-04 16:50:00', 16, 8),
('Quel est le budget d''un tel laboratoire ?', '2023-07-07 15:35:00', 14, 9),
('Bravo pour cette belle performance !', '2023-06-22 21:20:00', 17, 10);

-- 11. Insertion des AIMER_PUBLICATION (40 likes)
INSERT INTO AIMER_PUBLICATION (id_utilisateur, id_publication, date_reaction) VALUES
(2, 1, '2023-03-21 10:05:00'),
(4, 1, '2023-03-21 11:20:00'),
(6, 1, '2023-03-21 14:30:00'),
(8, 1, '2023-03-21 16:45:00'),
(3, 2, '2023-04-05 18:10:00'),
(5, 2, '2023-04-06 09:25:00'),
(7, 2, '2023-04-06 11:40:00'),
(9, 2, '2023-04-06 13:55:00'),
(1, 3, '2023-05-11 15:10:00'),
(10, 3, '2023-05-11 17:25:00'),
(12, 3, '2023-05-12 08:40:00'),
(2, 4, '2023-06-25 19:55:00'),
(4, 4, '2023-06-26 10:10:00'),
(6, 4, '2023-06-26 12:25:00'),
(8, 4, '2023-06-26 14:40:00'),
(10, 5, '2023-06-18 16:55:00'),
(3, 5, '2023-06-19 09:10:00'),
(5, 5, '2023-06-19 11:25:00'),
(7, 6, '2023-04-10 18:40:00'),
(9, 6, '2023-04-11 08:55:00'),
(11, 6, '2023-04-11 11:10:00'),
(1, 7, '2023-05-08 13:25:00'),
(3, 7, '2023-05-08 15:40:00'),
(5, 7, '2023-05-09 10:55:00'),
(2, 8, '2023-06-02 19:10:00'),
(6, 8, '2023-06-03 09:25:00'),
(8, 9, '2023-07-05 11:40:00'),
(10, 9, '2023-07-05 13:55:00'),
(12, 9, '2023-07-06 10:10:00'),
(4, 10, '2023-06-20 21:25:00'),
(6, 10, '2023-06-21 08:40:00'),
(8, 10, '2023-06-21 10:55:00'),
(1, 11, '2023-04-14 17:10:00'),
(3, 11, '2023-04-15 09:25:00'),
(2, 12, '2023-06-10 11:40:00'),
(4, 12, '2023-06-10 13:55:00'),
(6, 13, '2023-07-01 15:10:00'),
(8, 13, '2023-07-01 17:25:00'),
(10, 14, '2023-08-15 19:40:00'),
(12, 15, '2023-09-05 21:55:00');

-- 12. Insertion des SUIVRE (15 relations de suivi)
INSERT INTO SUIVRE (id_suiveur, id_suivi, date_suivi) VALUES
-- Étudiants qui suivent des enseignants
(1, 13, '2023-03-01 10:00:00'),
(3, 13, '2023-03-02 14:30:00'),
(5, 16, '2023-03-03 09:45:00'),
(7, 13, '2023-03-04 11:20:00'),
(9, 14, '2023-03-05 16:00:00'),

-- Étudiants qui se suivent entre eux
(2, 4, '2023-03-06 18:30:00'),
(4, 2, '2023-03-07 10:15:00'),
(6, 10, '2023-03-08 13:45:00'),
(8, 12, '2023-03-09 15:20:00'),
(10, 6, '2023-03-10 17:55:00'),

-- Enseignants qui suivent des étudiants prometteurs
(13, 1, '2023-03-11 09:10:00'),
(13, 3, '2023-03-12 14:25:00'),
(14, 9, '2023-03-13 11:40:00'),
(16, 5, '2023-03-14 16:15:00'),
(19, 4, '2023-03-15 18:50:00');

-- 13. Insertion des SIGNALEMENTS (8 signalements)
INSERT INTO SIGNALEMENT (motif, statut, date_signalement, id_signaleur, id_publication_cible, id_commentaire_cible, id_utilisateur_cible) VALUES
-- Signalements de publications
('Contenu inapproprié', 'en_attente', '2023-04-02 14:30:00', 2, 6, NULL, NULL),
('Spam commercial', 'resolu', '2023-05-12 16:45:00', 4, NULL, 8, NULL),
('Harcèlement', 'rejete', '2023-06-20 09:15:00', 6, NULL, NULL, 3),
('Contenu trompeur', 'en_attente', '2023-07-01 11:30:00', 8, 14, NULL, NULL),

-- Signalements de commentaires
('Commentaire insultant', 'resolu', '2023-04-15 18:20:00', 10, NULL, 12, NULL),
('Fausse information', 'en_attente', '2023-05-22 13:45:00', 12, NULL, 18, NULL),

-- Signalements d'utilisateurs
('Compte fake', 'resolu', '2023-06-10 15:10:00', 1, NULL, NULL, 7),
('Comportement inapproprié', 'en_attente', '2023-07-05 17:25:00', 3, NULL, NULL, 11);

-- Vérification fin de script
SELECT 'Données complètes insérées avec succès.' as status;
