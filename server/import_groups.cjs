const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Importing Groups Data from French Source...');

// Data from user request
const groups = [
    { id: 1, name: 'BDE Informatique 2024', description: 'Coordination des activités des étudiants en informatique.', type: 'student' }, // Mapped from 'Etudiant'
    { id: 2, name: 'Recherche IA & Santé', description: "Groupe d'échange entre enseignants et doctorants sur l'IA.", type: 'teacher' }, // Mapped from 'Enseignant' -> 'teacher' (schema type constraint? let's check)
    { id: 3, name: 'Club Robotique - Projet A', description: 'Équipe dédiée à la conception du robot pour la RoboCup.', type: 'club' },
    { id: 4, name: 'Entraide Master Génie Logiciel', description: 'Partage de ressources et révisions pour le M1.', type: 'class' }, // Mapped from 'Etudiant' -> 'class'? Or 'friends'? SChema says: 'friends', 'apartment', 'class', 'club'
    { id: 5, name: 'Commission Pédagogique', description: 'Réunion des enseignants pour la révision des programmes.', type: 'teacher' }, // Schema doesn't have 'teacher' type. Maybe 'class' or 'club'? Let's use 'club' or 'class' broadly or add to constraint? Schema: 'friends', 'apartment', 'class', 'club'
    { id: 6, name: 'Volontaires Événements', description: "Groupe logistique pour l'organisation des journées portes ouvertes.", type: 'club' }, // Mixed -> club/friends
    { id: 7, name: "Anciens de l'Université", description: "Réseau d'alumni pour l'insertion professionnelle.", type: 'club' }, // Externe -> club
    { id: 8, name: 'Laboratoire de Physique', description: "Discussion sur les expériences en cours au labo de physique.", type: 'class' }, // Enseignant -> class
    { id: 9, name: 'Préparation Concours', description: "Groupe d'étude intensif pour les concours d'ingénieurs.", type: 'class' }, // Etudiant -> class
    { id: 10, name: 'Club Cinéma - Bureau', description: 'Organisation des projections hebdomadaires.', type: 'club' }
];

const groupMap = {
    'Etudiant': 'class',
    'Enseignant': 'club', // or class?
    'Club': 'club',
    'Mixte': 'friends',
    'Externe': 'club'
};
// Manual Override based on schema (friends, apartment, class, club)
// 1: BDE -> club
// 2: Recherche -> club
// 3: Robotique -> club
// 4: Entraide -> class
// 5: Commission -> club
// 6: Volontaires -> friends ? Or club. Let's say club.
// 7: Anciens -> club
// 8: Labo -> class (research group)
// 9: Prepa -> class
// 10: Cinema -> club

const refinedGroups = [
    { id: '1', name: 'BDE Informatique 2024', description: 'Coordination des activités des étudiants en informatique.', type: 'club' },
    { id: '2', name: 'Recherche IA & Santé', description: "Groupe d'échange entre enseignants et doctorants sur l'IA.", type: 'club' },
    { id: '3', name: 'Club Robotique - Projet A', description: 'Équipe dédiée à la conception du robot pour la RoboCup.', type: 'club' },
    { id: '4', name: 'Entraide Master Génie Logiciel', description: 'Partage de ressources et révisions pour le M1.', type: 'class' },
    { id: '5', name: 'Commission Pédagogique', description: 'Réunion des enseignants pour la révision des programmes.', type: 'club' },
    { id: '6', name: 'Volontaires Événements', description: "Groupe logistique pour l'organisation des journées portes ouvertes.", type: 'club' },
    { id: '7', name: "Anciens de l'Université", description: "Réseau d'alumni pour l'insertion professionnelle.", type: 'club' },
    { id: '8', name: 'Laboratoire de Physique', description: "Discussion sur les expériences en cours au labo de physique.", type: 'class' },
    { id: '9', name: 'Préparation Concours', description: "Groupe d'étude intensif pour les concours d'ingénieurs.", type: 'class' },
    { id: '10', name: 'Club Cinéma - Bureau', description: 'Organisation des projections hebdomadaires.', type: 'club' }
];


const members = [
    // Group 1
    { uid: '1', gid: '1', role: 'admin' }, { uid: '3', gid: '1', role: 'moderator' }, { uid: '5', gid: '1', role: 'member' }, { uid: '7', gid: '1', role: 'member' }, { uid: '13', gid: '1', role: 'member' },
    // Group 2
    { uid: '13', gid: '2', role: 'admin' }, { uid: '14', gid: '2', role: 'member' }, { uid: '1', gid: '2', role: 'member' }, { uid: '9', gid: '2', role: 'member' }, { uid: '17', gid: '2', role: 'member' },
    // Group 3
    { uid: '3', gid: '3', role: 'admin' }, { uid: '9', gid: '3', role: 'moderator' }, { uid: '11', gid: '3', role: 'member' }, { uid: '14', gid: '3', role: 'member' },
    // Group 4
    { uid: '1', gid: '4', role: 'admin' }, { uid: '5', gid: '4', role: 'moderator' }, { uid: '7', gid: '4', role: 'member' }, { uid: '9', gid: '4', role: 'member' },
    // Group 5
    { uid: '13', gid: '5', role: 'admin' }, { uid: '16', gid: '5', role: 'moderator' }, { uid: '19', gid: '5', role: 'member' }, { uid: '14', gid: '5', role: 'member' },
    // Group 6
    { uid: '2', gid: '6', role: 'admin' }, { uid: '4', gid: '6', role: 'moderator' }, { uid: '8', gid: '6', role: 'member' }, { uid: '15', gid: '6', role: 'member' }, { uid: '10', gid: '6', role: 'member' },
    // Group 7
    { uid: '13', gid: '7', role: 'admin' }, { uid: '1', gid: '7', role: 'member' }, { uid: '4', gid: '7', role: 'member' }, { uid: '8', gid: '7', role: 'member' }, { uid: '20', gid: '7', role: 'member' },
    // Group 8
    { uid: '14', gid: '8', role: 'admin' }, { uid: '16', gid: '8', role: 'member' }, { uid: '3', gid: '8', role: 'member' }, { uid: '17', gid: '8', role: 'member' },
    // Group 9
    { uid: '5', gid: '9', role: 'admin' }, { uid: '7', gid: '9', role: 'moderator' }, { uid: '9', gid: '9', role: 'member' }, { uid: '11', gid: '9', role: 'member' }, { uid: '1', gid: '9', role: 'member' },
    // Group 10
    { uid: '2', gid: '10', role: 'admin' }, { uid: '6', gid: '10', role: 'moderator' }, { uid: '10', gid: '10', role: 'member' }, { uid: '15', gid: '10', role: 'member' }
];

const messages = [
    // Group 1
    { content: "Bienvenue dans le groupe du BDE Informatique 2024 ! Notre première réunion aura lieu lundi prochain.", uid: '1', gid: '1' },
    { content: "Qui est intéressé pour organiser le hackathon de printemps ?", uid: '3', gid: '1' },
    { content: "Je peux m'en occuper, j'ai déjà des contacts avec des sponsors.", uid: '5', gid: '1' },
    // Group 2
    { content: "Bonjour à tous les chercheurs en IA et santé. Notre prochain séminaire aura lieu le 15 avril.", uid: '13', gid: '2' },
    { content: "J'ai un nouvel article à présenter sur l'IA pour le diagnostic précoce.", uid: '17', gid: '2' },
    { content: "Excellent ! Je suis impatient de le découvrir.", uid: '1', gid: '2' },
    // Group 3
    { content: "Première réunion du projet A le 15 avril. Nous allons finaliser les spécifications du robot.", uid: '3', gid: '3' },
    { content: "J'ai commandé les nouveaux capteurs pour le robot.", uid: '9', gid: '3' },
    { content: "Parfait ! On avance bien.", uid: '14', gid: '3' },
    // Group 4
    { content: "Qui a des notes sur le cours de bases de données avancées ?", uid: '1', gid: '4' },
    { content: "Je les ai, je peux les partager sur le drive.", uid: '5', gid: '4' },
    { content: "Super merci ! On fait une session de révision ce weekend ?", uid: '7', gid: '4' },
    // Group 5
    { content: "Prochaine réunion le 20 mai pour discuter de la réforme du master.", uid: '13', gid: '5' },
    { content: "J'ai préparé un document avec mes propositions.", uid: '16', gid: '5' },
    { content: "Je le consulte et je vous fais mes retours.", uid: '19', gid: '5' },
    // Group 6
    { content: "Nous avons besoin de volontaires pour l'accueil des nouveaux étudiants le 5 septembre.", uid: '2', gid: '6' },
    { content: "Je suis disponible toute la journée !", uid: '4', gid: '6' },
    { content: "Moi aussi, je peux aider.", uid: '8', gid: '6' },
    // Group 7
    { content: "Retrouvailles annuelles des anciens le 15 juin ! Inscrivez-vous vite.", uid: '13', gid: '7' },
    { content: "Je serai présent avec plaisir !", uid: '1', gid: '7' },
    { content: "Je propage l'info sur LinkedIn.", uid: '4', gid: '7' },
    // Group 8
    { content: "Nouvelle expérience sur la supraconductivité en cours. Premiers résultats prometteurs.", uid: '14', gid: '8' },
    { content: "Intéressant ! On peut en discuter lors de notre prochaine réunion.", uid: '16', gid: '8' },
    { content: "Je voudrais bien observer l'expérience.", uid: '3', gid: '8' },
    // Group 9
    { content: "Qui est disponible pour une session de révision intensive ce weekend ?", uid: '5', gid: '9' },
    { content: "Moi, je propose qu'on se retrouve à la bibliothèque.", uid: '7', gid: '9' },
    { content: "Parfait, j'apporte les annales des concours.", uid: '9', gid: '9' },
    // Group 10
    { content: "Prochaine projection : \"Le Dîner de Cons\" vendredi à 20h. Qui gère le popcorn ?", uid: '2', gid: '10' },
    { content: "Je m'en occupe !", uid: '6', gid: '10' },
    { content: "Je prépare les affiches pour la communication.", uid: '10', gid: '10' },
    // Supplementary
    { content: "Rappel : notre hackathon commence dans 2 semaines, finalisez vos inscriptions !", uid: '1', gid: '1' },
    { content: "Nouveau sujet de recherche : IA et maladies neurodégénératives. Qui est intéressé ?", uid: '13', gid: '2' },
    { content: "Le châssis du robot est arrivé, on peut commencer l'assemblage.", uid: '9', gid: '3' },
    { content: "Session de révision annulée demain, reportée à samedi.", uid: '5', gid: '4' },
    { content: "Document pédagogique à revoir avant la prochaine réunion.", uid: '16', gid: '5' },
    { content: "Besoin de 3 volontaires supplémentaires pour la logistique.", uid: '4', gid: '6' },
    { content: "Photos des dernières retrouvailles disponibles sur le drive.", uid: '20', gid: '7' },
    { content: "Résultats de l'expérience publiés dans Nature Physics !", uid: '14', gid: '8' },
    { content: "Annales 2023 ajoutées dans le dossier partagé.", uid: '7', gid: '9' },
    { content: "Changement de film : on projettera \"Amélie Poulain\" à la place.", uid: '6', gid: '10' }
];

db.serialize(() => {
    db.run("PRAGMA foreign_keys = OFF"); // Temporarily disable FKs to avoid ordering constraints if any

    const stmtGroup = db.prepare("INSERT OR REPLACE INTO groups (id, name, description, type, created_by, visibility) VALUES (?, ?, ?, ?, ?, 'public')");
    const stmtMember = db.prepare("INSERT OR REPLACE INTO group_members (group_id, user_id, role) VALUES (?, ?, ?)");
    const stmtDiscussion = db.prepare("INSERT OR REPLACE INTO discussions (id, group_id, title, created_by) VALUES (?, ?, 'Général', ?)");
    const stmtMessage = db.prepare("INSERT INTO messages (id, discussion_id, author_id, content) VALUES (?, ?, ?, ?)");

    refinedGroups.forEach(group => {
        // Find owner (admin)
        const owner = members.find(m => m.gid === group.id && m.role === 'admin')?.uid || members.find(m => m.gid === group.id)?.uid || '1';
        stmtGroup.run(group.id, group.name, group.description, group.type, owner);

        // Ensure discussion exists (ID = GroupID for simplicity in this mapping)
        stmtDiscussion.run(group.id, group.id, owner);
    });

    members.forEach(member => {
        stmtMember.run(member.gid, member.uid, member.role);
    });

    let msgId = 1;
    messages.forEach(msg => {
        // Use group ID as discussion ID since we mapped them 1:1 above
        stmtMessage.run(msgId.toString(), msg.gid, msg.uid, msg.content);
        msgId++;
    });

    stmtGroup.finalize();
    stmtMember.finalize();
    stmtDiscussion.finalize();
    stmtMessage.finalize();

    db.run("PRAGMA foreign_keys = ON");
    console.log("Groups data imported successfully.");
});

db.close();
