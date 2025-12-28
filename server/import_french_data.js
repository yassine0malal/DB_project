
import sqlite3Pkg from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const sqlite3 = sqlite3Pkg.verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);
const schemaPath = path.resolve(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

console.log('Importing French data into English schema...');

const FRENCH_DATA = {
    users: [
        { id: 1, nom: 'Martin', prenom: 'Lucas', email: 'lucas.martin@edu.univ.fr', role: 'student', bio: 'Étudiant en informatique passionné par le développement web', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e' },
        { id: 2, nom: 'Bernard', prenom: 'Emma', email: 'emma.bernard@edu.univ.fr', role: 'student', bio: 'Étudiante en médecine, membre du club de théâtre', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' },
        { id: 3, nom: 'Dubois', prenom: 'Hugo', email: 'hugo.dubois@edu.univ.fr', role: 'student', bio: 'Passionné de robotique et de AI', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
        { id: 4, nom: 'Thomas', prenom: 'Chloé', email: 'chloe.thomas@edu.univ.fr', role: 'student', bio: 'Étudiante en droit, présidente du club de débat', photo: null },
        { id: 5, nom: 'Robert', prenom: 'Louis', email: 'louis.robert@edu.univ.fr', role: 'student', bio: 'Membre actif du club de programmation', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d' },
        { id: 6, nom: 'Richard', prenom: 'Léa', email: 'lea.richard@edu.univ.fr', role: 'student', bio: 'Étudiante en biologie, adepte de photographie', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' },
        { id: 7, nom: 'Petit', prenom: 'Gabriel', email: 'gabriel.petit@edu.univ.fr', role: 'student', bio: 'Développeur Full-Stack en formation', photo: null },
        { id: 8, nom: 'Durand', prenom: 'Jade', email: 'jade.durand@edu.univ.fr', role: 'student', bio: 'Membre du bureau des étudiants', photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04' },
        { id: 9, nom: 'Leroy', prenom: 'Nathan', email: 'nathan.leroy@edu.univ.fr', role: 'student', bio: 'Passionné de cyber-sécurité', photo: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12' },
        { id: 10, nom: 'Moreau', prenom: 'Manon', email: 'manon.moreau@edu.univ.fr', role: 'student', bio: 'Étudiante en architecture', photo: null },
        { id: 11, nom: 'Simon', prenom: 'Tom', email: 'tom.simon@edu.univ.fr', role: 'student', bio: 'Membre du club de robotique', photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61' },
        { id: 12, nom: 'Laurent', prenom: 'Inès', email: 'ines.laurent@edu.univ.fr', role: 'student', bio: 'Étudiante en marketing digital', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2' },
        // Enseignants
        { id: 13, nom: 'Michel', prenom: 'Sophie', email: 'sophie.michel@univ.fr', role: 'teacher', bio: 'Professeur d\'informatique, spécialisée en bases de données', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956' },
        { id: 14, nom: 'Garcia', prenom: 'Pierre', email: 'pierre.garcia@univ.fr', role: 'teacher', bio: 'Professeur de physique quantique', photo: null },
        { id: 15, nom: 'David', prenom: 'Marie', email: 'marie.david@univ.fr', role: 'teacher', bio: 'Professeure de littérature française', photo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df' },
        { id: 16, nom: 'Bertrand', prenom: 'Philippe', email: 'philippe.bertrand@univ.fr', role: 'teacher', bio: 'Professeur de mathématiques appliquées', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e' },
        { id: 17, nom: 'Roux', prenom: 'Catherine', email: 'catherine.roux@univ.fr', role: 'teacher', bio: 'Professeure de biologie moléculaire', photo: null },
        { id: 18, nom: 'Vincent', prenom: 'Alain', email: 'alain.vincent@univ.fr', role: 'teacher', bio: 'Professeur d\'histoire contemporaine', photo: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6' },
        { id: 19, nom: 'Fournier', prenom: 'Isabelle', email: 'isabelle.fournier@univ.fr', role: 'teacher', bio: 'Professeure de droit international', photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5' },
        // Admin
        { id: 20, nom: 'Admin', prenom: 'System', email: 'admin@univ.fr', role: 'admin', bio: 'Administrateur système de la plateforme', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e' }
    ],
    students: [
        { id: 1, major: 'Informatique', level: '2ème année' },
        { id: 2, major: 'Médecine', level: '3ème année' },
        { id: 3, major: 'Génie Robotique', level: '1ère année' },
        { id: 4, major: 'Droit', level: '4ème année' },
        { id: 5, major: 'Informatique', level: '2ème année' },
        { id: 6, major: 'Biologie', level: '3ème année' },
        { id: 7, major: 'Développement Web', level: '1ère année' },
        { id: 8, major: 'Sciences Politiques', level: '2ème année' },
        { id: 9, major: 'Cybersécurité', level: '3ème année' },
        { id: 10, major: 'Architecture', level: '2ème année' },
        { id: 11, major: 'Robotique', level: '1ère année' },
        { id: 12, major: 'Marketing Digital', level: '3ème année' },
    ],
    teachers: [
        { id: 13, department: 'Informatique', title: 'Professeur Agrégé' },
        { id: 14, department: 'Physique', title: 'Professeur des Universités' },
        { id: 15, department: 'Lettres', title: 'Maître de Conférences' },
        { id: 16, department: 'Mathématiques', title: 'Professeur Agrégé' },
        { id: 17, department: 'Biologie', title: 'Professeure des Universités' },
        { id: 18, department: 'Histoire', title: 'Maître de Conférences' },
        { id: 19, department: 'Droit', title: 'Professeure Agrégée' }
    ],
    clubs: [
        { id: 1, name: 'Club Informatique', description: 'Club dédié à la programmation, développement web et nouvelles technologies', category: 'Tech', logo: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97' },
        { id: 2, name: 'Club de Débat', description: 'Espace d\'échange et de discussion sur des sujets d\'actualité et philosophiques', category: 'Academic', logo: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655' },
        { id: 3, name: 'Club Robotique', description: 'Conception et programmation de robots pour des compétitions universitaires', category: 'Tech', logo: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837' },
        { id: 4, name: 'Club Photo', description: 'Ateliers de photographie et sorties photo en extérieur', category: 'Art', logo: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32' },
        { id: 5, name: 'Club Théâtre', description: 'Ateliers de théâtre et représentations publiques', category: 'Art', logo: 'https://images.unsplash.com/photo-1507676184212-d033912996c7' }
    ],
    memberships: [
        // Club Informatique
        { userId: 1, clubId: 1, role: 'moderator' },
        { userId: 3, clubId: 1, role: 'member' },
        { userId: 5, clubId: 1, role: 'moderator' },
        { userId: 7, clubId: 1, role: 'member' },
        { userId: 9, clubId: 1, role: 'member' },
        { userId: 13, clubId: 1, role: 'admin' },
        // Club de Débat
        { userId: 4, clubId: 2, role: 'admin' },
        { userId: 8, clubId: 2, role: 'moderator' },
        { userId: 12, clubId: 2, role: 'member' },
        { userId: 19, clubId: 2, role: 'moderator' },
        // Club Robotique
        { userId: 3, clubId: 3, role: 'admin' },
        { userId: 9, clubId: 3, role: 'moderator' },
        { userId: 11, clubId: 3, role: 'member' },
        { userId: 14, clubId: 3, role: 'moderator' },
        // Club Photo
        { userId: 6, clubId: 4, role: 'admin' },
        { userId: 2, clubId: 4, role: 'member' },
        { userId: 10, clubId: 4, role: 'member' },
        { userId: 17, clubId: 4, role: 'moderator' },
        // Club Théâtre
        { userId: 2, clubId: 5, role: 'admin' },
        { userId: 4, clubId: 5, role: 'member' },
        { userId: 8, clubId: 5, role: 'moderator' },
        { userId: 10, clubId: 5, role: 'member' },
        { userId: 15, clubId: 5, role: 'moderator' }
    ],
    events: [
        { id: 1, clubId: 1, title: 'Hackathon 2023', description: '24h de programmation non-stop avec des défis variés', date: '2023-04-15 09:00:00', location: 'Bâtiment Informatique - Salle 201' },
        { id: 2, clubId: 2, title: 'Débat: IA et Société', description: 'Discussion sur l\'impact de l\'IA sur notre quotidien', date: '2023-05-10 18:30:00', location: 'Amphithéâtre B' },
        { id: 3, clubId: 3, title: 'Compétition Robotique', description: 'Première compétition inter-universitaire de robots', date: '2023-06-20 10:00:00', location: 'Gymnase Universitaire' },
        { id: 4, clubId: 4, title: 'Exposition Photo', description: 'Vernissage de l\'exposition "Regards sur la ville"', date: '2023-05-25 19:00:00', location: 'Galerie d\'Art Universitaire' },
        { id: 5, clubId: 5, title: 'Pièce: "Les Misérables"', description: 'Représentation théâtrale de la célèbre œuvre', date: '2023-06-15 20:00:00', location: 'Théâtre Universitaire' },
        { id: 6, clubId: 1, title: 'Conférence: Cybersécurité', description: 'Les nouveaux enjeux de la sécurité informatique', date: '2023-04-30 14:00:00', location: 'Salle de Conférence A' },
        { id: 7, clubId: 4, title: 'Atelier Photo Nature', description: 'Sortie photo dans le parc naturel régional', date: '2023-05-20 08:00:00', location: 'Parc Naturel Régional' },
        { id: 8, clubId: 2, title: 'Débat: Éthique en Science', description: 'Questions éthiques dans la recherche scientifique', date: '2023-06-05 17:00:00', location: 'Salle des Colloques' }
    ],
    participations: [
        // Hackathon
        { userId: 1, eventId: 1 }, { userId: 3, eventId: 1 }, { userId: 5, eventId: 1 },
        { userId: 7, eventId: 1 }, { userId: 9, eventId: 1 },
        // Débat IA
        { userId: 4, eventId: 2 }, { userId: 8, eventId: 2 }, { userId: 12, eventId: 2 },
        { userId: 13, eventId: 2 }, { userId: 16, eventId: 2 },
        // Compétition Robotique
        { userId: 3, eventId: 3 }, { userId: 9, eventId: 3 }, { userId: 11, eventId: 3 },
        { userId: 14, eventId: 3 }, { userId: 1, eventId: 3 },
        // Exposition Photo
        { userId: 2, eventId: 4 }, { userId: 6, eventId: 4 }, { userId: 10, eventId: 4 },
        { userId: 17, eventId: 4 }, { userId: 5, eventId: 4 },
        // Pièce de théâtre
        { userId: 2, eventId: 5 }, { userId: 4, eventId: 5 }, { userId: 8, eventId: 5 },
        { userId: 10, eventId: 5 }, { userId: 15, eventId: 5 },
        // Conférence Cybersécurité
        { userId: 9, eventId: 6 }, { userId: 1, eventId: 6 }, { userId: 7, eventId: 6 },
        { userId: 13, eventId: 6 }
    ],
    visitors: [
        { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@external.com', eventId: 1 },
        { id: 2, nom: 'Lambert', prenom: 'Sarah', email: 'sarah.lambert@external.com', eventId: 2 },
        { id: 3, nom: 'Chevalier', prenom: 'Marc', email: 'marc.chevalier@external.com', eventId: 3 },
        { id: 4, nom: 'Benoit', prenom: 'Laura', email: 'laura.benoit@external.com', eventId: 4 },
        { id: 5, nom: 'Renaud', prenom: 'Thomas', email: 'thomas.renaud@external.com', eventId: 5 },
        { id: 6, nom: 'Lemoine', prenom: 'Clara', email: 'clara.lemoine@external.com', eventId: 1 },
        { id: 7, nom: 'Girard', prenom: 'Antoine', email: 'antoine.girard@external.com', eventId: 2 },
        { id: 8, nom: 'Barbier', prenom: 'Julie', email: 'julie.barbier@external.com', eventId: 3 },
        { id: 9, nom: 'Perrin', prenom: 'Nicolas', email: 'nicolas.perrin@external.com', eventId: 4 },
        { id: 10, nom: 'Clement', prenom: 'Elodie', email: 'elodie.clement@external.com', eventId: 5 }
    ],
    posts: [
        { id: 1, authorId: 1, clubId: 1, content: 'Notre prochain hackathon aura lieu le 15 avril ! Inscriptions ouvertes.', imageUrl: 'https://images.unsplash.com/photo-1504384308090-c54be3852f92', type: 'image' },
        { id: 2, authorId: 6, clubId: 4, content: 'Photos de notre dernière sortie photo au parc naturel. Magnifiques paysages !', imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05', type: 'image' },
        { id: 3, authorId: 4, clubId: 2, content: 'Débat passionnant hier soir sur l\'IA et ses implications éthiques.', imageUrl: null, type: 'text' },
        { id: 4, authorId: 3, clubId: 3, content: 'Notre équipe de robotique a remporté la 2ème place à la compétition régionale !', imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e', type: 'image' },
        { id: 5, authorId: 2, clubId: 5, content: 'Représentation théâtrale de samedi dernier : un grand succès ! Merci à tous.', imageUrl: 'https://images.unsplash.com/photo-1507676184212-d033912996c7', type: 'image' },
        { id: 6, authorId: 5, clubId: 1, content: 'Nouveau projet : développement d\'une application mobile pour l\'université', imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', type: 'image' },
        { id: 7, authorId: 10, clubId: 4, content: 'Atelier photo portrait ce weekend. Inscrivez-vous vite !', imageUrl: 'https://images.unsplash.com/photo-1520390138845-fd2d229dd552', type: 'image' },
        { id: 8, authorId: 8, clubId: 2, content: 'Discussion intéressante sur la réforme de l\'enseignement supérieur', imageUrl: null, type: 'text' },
        { id: 9, authorId: 9, clubId: 3, content: 'Découverte du nouveau laboratoire de robotique : équipement de pointe !', imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc', type: 'image' },
        { id: 10, authorId: 15, clubId: 5, content: 'Merci à notre metteur en scène pour ce travail exceptionnel', imageUrl: null, type: 'text' },
        { id: 11, authorId: 7, clubId: 1, content: 'Rappel : réunion du club informatique demain à 18h', imageUrl: null, type: 'text' },
        { id: 12, authorId: 17, clubId: 4, content: 'Exposition photo prolongée jusqu\'à la fin du mois !', imageUrl: 'https://images.unsplash.com/photo-1554048612-387768052bf7', type: 'image' },
        { id: 13, authorId: 19, clubId: 2, content: 'Appel à participants pour le prochain tournoi de débat', imageUrl: 'https://images.unsplash.com/photo-1475721027767-pka1434x', type: 'image' },
        { id: 14, authorId: 11, clubId: 3, content: 'Construction de notre nouveau robot pour la compétition nationale', imageUrl: 'https://images.unsplash.com/photo-1535378437346-5d22123d8c13', type: 'image' },
        { id: 15, authorId: 2, clubId: 5, content: 'Casting pour la prochaine pièce de théâtre : "Le Malade Imaginaire"', imageUrl: 'https://images.unsplash.com/photo-1503095392233-1759743a50d5', type: 'image' }
    ],
    comments: [
        { id: 1, postId: 1, authorId: 3, content: 'Super initiative ! Je suis inscrit.' },
        { id: 2, postId: 2, authorId: 2, content: 'Les photos sont magnifiques, bravo à tous les participants !' },
        { id: 3, postId: 3, authorId: 8, content: 'Débat très enrichissant, merci pour l\'organisation' },
        { id: 4, postId: 4, authorId: 5, content: 'Félicitations à toute l\'équipe ! Continuez comme ça.' },
        { id: 5, postId: 5, authorId: 4, content: 'Je suis fier de faire partie de cette équipe théâtrale' },
        { id: 6, postId: 6, authorId: 9, content: 'Génial ! Je veux participer au développement.' },
        { id: 7, postId: 7, authorId: 6, content: 'Dommage, je ne suis pas disponible ce weekend...' },
        { id: 8, postId: 8, authorId: 12, content: 'Sujet très important, merci de l\'avoir abordé' },
        { id: 9, postId: 9, authorId: 1, content: 'Impressionnant ! On peut venir visiter ?' },
        { id: 10, postId: 10, authorId: 10, content: 'Bravo à tous les acteurs, c\'était émouvant' },
        { id: 11, postId: 11, authorId: 3, content: 'Je serai présent à la réunion, merci pour le rappel' },
        { id: 12, postId: 12, authorId: 8, content: 'Excellente nouvelle, j\'irai voir l\'exposition !' },
        { id: 13, postId: 13, authorId: 4, content: 'Je m\'inscris pour le tournoi, hâte d\'y être !' },
        { id: 14, postId: 14, authorId: 7, content: 'Vous avez besoin d\'aide pour la programmation ?' },
        { id: 15, postId: 15, authorId: 2, content: 'Je participe au casting ! Quel est le processus ?' },
        { id: 16, postId: 1, authorId: 7, content: 'Quel langage de programmation utiliserez-vous ?' },
        { id: 17, postId: 2, authorId: 10, content: 'Quel appareil photo recommandez-vous pour débuter ?' },
        { id: 18, postId: 3, authorId: 13, content: 'Avez-vous des références bibliographiques sur le sujet ?' },
        { id: 19, postId: 4, authorId: 11, content: 'Quelle était la difficulté du challenge ?' },
        { id: 20, postId: 5, authorId: 6, content: 'Quelle est la prochaine pièce au programme ?' },
        { id: 21, postId: 6, authorId: 1, content: 'L\'application sera-t-elle disponible sur iOS et Android ?' },
        { id: 22, postId: 7, authorId: 4, content: 'Y aura-t-il d\'autres ateliers photo bientôt ?' },
        { id: 23, postId: 8, authorId: 16, content: 'Quel est le prochain sujet de débat ?' },
        { id: 24, postId: 9, authorId: 14, content: 'Quel est le budget d\'un tel laboratoire ?' },
        { id: 25, postId: 10, authorId: 17, content: 'Bravo pour cette belle performance !' }
    ],
    likes: [
        { userId: 2, postId: 1 }, { userId: 4, postId: 1 }, { userId: 6, postId: 1 }, { userId: 8, postId: 1 },
        { userId: 3, postId: 2 }, { userId: 5, postId: 2 }, { userId: 7, postId: 2 }, { userId: 9, postId: 2 },
        { userId: 1, postId: 3 }, { userId: 10, postId: 3 }, { userId: 12, postId: 3 },
        { userId: 2, postId: 4 }, { userId: 4, postId: 4 }, { userId: 6, postId: 4 }, { userId: 8, postId: 4 },
        { userId: 10, postId: 5 }, { userId: 3, postId: 5 }, { userId: 5, postId: 5 },
        { userId: 7, postId: 6 }, { userId: 9, postId: 6 }, { userId: 11, postId: 6 },
        { userId: 1, postId: 7 }, { userId: 3, postId: 7 }, { userId: 5, postId: 7 },
        { userId: 2, postId: 8 }, { userId: 6, postId: 8 },
        { userId: 8, postId: 9 }, { userId: 10, postId: 9 }, { userId: 12, postId: 9 },
        { userId: 4, postId: 10 }, { userId: 6, postId: 10 }, { userId: 8, postId: 10 },
        { userId: 1, postId: 11 }, { userId: 3, postId: 11 },
        { userId: 2, postId: 12 }, { userId: 4, postId: 12 },
        { userId: 6, postId: 13 }, { userId: 8, postId: 13 },
        { userId: 10, postId: 14 },
        { userId: 12, postId: 15 }
    ],
    follows: [
        { followerId: 1, followingId: 13 }, { followerId: 3, followingId: 13 },
        { followerId: 5, followingId: 16 }, { followerId: 7, followingId: 13 },
        { followerId: 9, followingId: 14 },
        { followerId: 2, followingId: 4 }, { followerId: 4, followingId: 2 },
        { followerId: 6, followingId: 10 }, { followerId: 8, followingId: 12 },
        { followerId: 10, followingId: 6 },
        { followerId: 13, followingId: 1 }, { followerId: 13, followingId: 3 },
        { followerId: 14, followingId: 9 }, { followerId: 16, followingId: 5 },
        { followerId: 19, followingId: 4 }
    ],
    reports: [
        // Signalements de publications
        { reporterId: 2, postId: 6, status: 'pending', reason: 'Contenu inapproprié' },
        { reporterId: 8, postId: 14, status: 'pending', reason: 'Contenu trompeur' },
        // Signalements de commentaires
        { reporterId: 4, commentId: 8, status: 'resolved', reason: 'Spam commercial' },
        { reporterId: 10, commentId: 12, status: 'resolved', reason: 'Commentaire insultant' },
        { reporterId: 12, commentId: 18, status: 'pending', reason: 'Fausse information' },
        // Signalements d'utilisateurs
        { reporterId: 6, targetUserId: 3, status: 'rejected', reason: 'Harcèlement' },
        { reporterId: 1, targetUserId: 7, status: 'resolved', reason: 'Compte fake' },
        { reporterId: 3, targetUserId: 11, status: 'pending', reason: 'Comportement inapproprié' }
    ]
};

db.serialize(() => {
    // 1. Ensure Schema Exists
    db.exec(schema, (err) => {
        if (err) {
            console.error('Schema execution failed:', err);
            return;
        }

        db.run('PRAGMA foreign_keys = OFF');

        const logError = (context) => (err) => {

            if (err) console.error(`Error inserting ${context}:`, err.message);
        };

        // Users
        const userStmt = db.prepare("INSERT OR REPLACE INTO users (id, email, password_hash, first_name, last_name, role, avatar_url, bio) VALUES (?, ?, 'hashed_pass', ?, ?, ?, ?, ?)");
        const studentStmt = db.prepare("INSERT OR REPLACE INTO students (user_id, student_id, major, level, academic_year) VALUES (?, ?, ?, ?, '2023-2024')");
        const teacherStmt = db.prepare("INSERT OR REPLACE INTO teachers (user_id, department, title) VALUES (?, ?, ?)");

        FRENCH_DATA.users.forEach(u => {
            const uid = String(u.id);
            userStmt.run(uid, u.email, u.prenom, u.nom, u.role, u.photo, u.bio, logError(`User ${uid}`));

            if (u.role === 'student') {
                const detail = FRENCH_DATA.students.find(s => s.id === u.id);
                if (detail) studentStmt.run(uid, `STU${uid}`, detail.major, detail.level, logError(`Student ${uid}`));
            } else if (u.role === 'teacher') {
                const detail = FRENCH_DATA.teachers.find(t => t.id === u.id);
                if (detail) teacherStmt.run(uid, detail.department, detail.title, logError(`Teacher ${uid}`));
            }
        });
        userStmt.finalize();
        studentStmt.finalize();
        teacherStmt.finalize();

        // Clubs
        const clubStmt = db.prepare("INSERT OR REPLACE INTO clubs (id, name, description, category, logo_url) VALUES (?, ?, ?, ?, ?)");
        FRENCH_DATA.clubs.forEach(c => {
            const cid = String(c.id);
            clubStmt.run(cid, c.name, c.description, c.category, c.logo, logError(`Club ${cid}`));
        });
        clubStmt.finalize();

        // Memberships
        const memStmt = db.prepare("INSERT OR REPLACE INTO club_members (club_id, user_id, role) VALUES (?, ?, ?)");
        FRENCH_DATA.memberships.forEach(m => {
            memStmt.run(String(m.clubId), String(m.userId), m.role, logError(`Member ${m.userId}->${m.clubId}`));
        });
        memStmt.finalize();

        // Events
        const evtStmt = db.prepare("INSERT OR REPLACE INTO events (id, club_id, title, description, start_time, location) VALUES (?, ?, ?, ?, ?, ?)");
        FRENCH_DATA.events.forEach(e => {
            evtStmt.run(String(e.id), String(e.clubId), e.title, e.description, e.date, e.location, logError(`Event ${e.id}`));
        });
        evtStmt.finalize();

        // Posts
        const postStmt = db.prepare("INSERT OR REPLACE INTO posts (id, author_id, club_id, content, image_url, type) VALUES (?, ?, ?, ?, ?, ?)");
        FRENCH_DATA.posts.forEach(p => {
            postStmt.run(String(p.id), String(p.authorId), String(p.clubId), p.content, p.imageUrl, p.type, logError(`Post ${p.id}`));
        });
        postStmt.finalize();

        // Comments
        const commentStmt = db.prepare("INSERT OR REPLACE INTO comments (id, post_id, author_id, content) VALUES (?, ?, ?, ?)");
        FRENCH_DATA.comments.forEach(c => {
            commentStmt.run(String(c.id), String(c.postId), String(c.authorId), c.content, logError(`Comment ${c.id}`));
        });
        commentStmt.finalize();

        // Likes
        const likeStmt = db.prepare("INSERT OR REPLACE INTO likes (user_id, target_id, target_type) VALUES (?, ?, 'post')");
        FRENCH_DATA.likes.forEach(l => {
            likeStmt.run(String(l.userId), String(l.postId), logError(`Like ${l.userId}->${l.postId}`));
        });
        likeStmt.finalize();

        // Participations (Event Attendees)
        const partStmt = db.prepare("INSERT OR REPLACE INTO event_attendees (event_id, user_id, status) VALUES (?, ?, 'confirmed')");
        FRENCH_DATA.participations.forEach(p => {
            partStmt.run(String(p.eventId), String(p.userId), logError(`Part ${p.userId}->${p.eventId}`));
        });
        partStmt.finalize();

        // Follows
        const followStmt = db.prepare("INSERT OR REPLACE INTO user_follows (follower_id, following_id) VALUES (?, ?)");
        FRENCH_DATA.follows.forEach(f => {
            followStmt.run(String(f.followerId), String(f.followingId), logError(`Follow ${f.followerId}->${f.followingId}`));
        });
        followStmt.finalize();

        // Reports
        const reportStmt = db.prepare("INSERT OR REPLACE INTO reports (reporter_id, target_id, target_type, reason, status) VALUES (?, ?, ?, ?, ?)");
        FRENCH_DATA.reports.forEach(r => {
            let targetId = r.postId || r.commentId || r.targetUserId;
            let targetType = r.postId ? 'post' : (r.commentId ? 'comment' : 'user');
            let status = r.status;
            if (status === 'rejected' || status === 'rejete') status = 'dismissed'; // Map French/User status to Schema

            reportStmt.run(String(r.reporterId), String(targetId), targetType, r.reason, status, logError(`Report ${r.reporterId}->${targetType}`));
        });
        reportStmt.finalize();

        // Visitors
        const visitorStmt = db.prepare("INSERT OR REPLACE INTO visitors (id, first_name, last_name, email) VALUES (?, ?, ?, ?)");
        const eventVisitorStmt = db.prepare("INSERT OR REPLACE INTO event_visitor_attendance (event_id, visitor_id) VALUES (?, ?)");

        FRENCH_DATA.visitors.forEach(v => {
            visitorStmt.run(String(v.id), v.prenom, v.nom, v.email, logError(`Visitor ${v.id}`));
            eventVisitorStmt.run(String(v.eventId), String(v.id), logError(`VisitorEvent ${v.id}->${v.eventId}`));
        });
        visitorStmt.finalize();
        eventVisitorStmt.finalize();

        console.log('Import queued!');
        db.close(() => {
            console.log('Database connection closed.');
        });
    });
});
