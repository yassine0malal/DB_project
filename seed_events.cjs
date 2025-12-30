const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Importing Events Data...');

// Des événements variés avec images appropriées et dates passées/futures
const events = [
    {
        id: '1',
        club_id: '1', // Club Informatique
        title: 'Hackathon 2024',
        description: '24h de programmation intensive avec des défis passionnants. Prix pour les gagnants !',
        start_time: '2024-11-15 09:00:00',
        end_time: '2024-11-16 09:00:00',
        location: 'Amphi B - Bâtiment Informatique',
        cover_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200&h=400',
        status: 'past',
        max_participants: 100
    },
    {
        id: '2',
        club_id: '2', // Club de Débat
        title: 'Débat: IA et Éthique',
        description: 'Discussion sur les questions éthiques liées à l\'intelligence artificielle',
        start_time: '2024-12-20 18:00:00',
        end_time: '2024-12-20 20:00:00',
        location: 'Amphi A',
        cover_url: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&q=80&w=1200&h=400',
        status: 'past',
        max_participants: 150
    },
    {
        id: '3',
        club_id: '3', // Club Robotique
        title: 'Compétition Robotique 2025',
        description: 'Première compétition inter-universitaire de robots autonomes',
        start_time: '2025-02-10 10:00:00',
        end_time: '2025-02-10 18:00:00',
        location: 'Gymnase Universitaire',
        cover_url: 'https://images.unsplash.com/photo-1563521106825-6deac5c4f17c?auto=format&fit=crop&q=80&w=1200&h=400',
        status: 'upcoming',
        max_participants: 200
    },
    {
        id: '4',
        club_id: '4', // Club Photo
        title: 'Exposition "Regards sur la Ville"',
        description: 'Vernissage de notre exposition photo annuelle',
        start_time: '2025-01-15 19:00:00',
        end_time: '2025-01-15 22:00:00',
        location: 'Galerie Universitaire',
        cover_url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200&h=400',
        status: 'upcoming',
        max_participants: 80
    },
    {
        id: '5',
        club_id: '5', // Club Théâtre
        title: 'Pièce: "Les Misérables"',
        description: 'Représentation de la célèbre œuvre de Victor Hugo',
        start_time: '2025-03-20 20:00:00',
        end_time: '2025-03-20 22:30:00',
        location: 'Théâtre Universitaire',
        cover_url: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&q=80&w=1200&h=400',
        status: 'upcoming',
        max_participants: 250
    },
    {
        id: '6',
        club_id: '1',
        title: 'Workshop: React & Next.js',
        description: 'Atelier pratique sur les frameworks modernes de développement web',
        start_time: '2024-10-05 14:00:00',
        end_time: '2024-10-05 18:00:00',
        location: 'Salle Informatique 3',
        cover_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1200&h=400',
        status: 'past',
        max_participants: 50
    },
    {
        id: '7',
        club_id: '4',
        title: 'Sortie Photo Nature',
        description: 'Journée photo dans le parc naturel régional',
        start_time: '2025-02-22 08:00:00',
        end_time: '2025-02-22 17:00:00',
        location: 'Parc Naturel Régional',
        cover_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200&h=400',
        status: 'upcoming',
        max_participants: 30
    },
    {
        id: '8',
        club_id: '2',
        title: 'Conférence: Changement Climatique',
        description: 'Débat avec des experts sur les enjeux climatiques',
        start_time: '2024-09-28 17:00:00',
        end_time: '2024-09-28 19:30:00',
        location: 'Grand Amphi',
        cover_url: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?auto=format&fit=crop&q=80&w=1200&h=400',
        status: 'past',
        max_participants: 200
    },
    {
        id: '9',
        club_id: '3',
        title: 'Atelier Initiation Robotique',
        description: 'Découverte de la robotique pour débutants',
        start_time: '2025-01-25 14:00:00',
        end_time: '2025-01-25 17:00:00',
        location: 'Labo Robotique',
        cover_url: 'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?auto=format&fit=crop&q=80&w=1200&h=400',
        status: 'upcoming',
        max_participants: 40
    },
    {
        id: '10',
        club_id: '5',
        title: 'Atelier Improvisation',
        description: 'Session d\'improvisation théâtrale ouverte à tous',
        start_time: '2025-02-05 18:30:00',
        end_time: '2025-02-05 21:00:00',
        location: 'Salle de Théâtre',
        cover_url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=1200&h=400',
        status: 'upcoming',
        max_participants: 25
    }
];

db.serialize(() => {
    const stmt = db.prepare(`
        INSERT OR REPLACE INTO events 
        (id, club_id, title, description, start_time, end_time, location, cover_url, status, max_attendees)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    events.forEach(event => {
        stmt.run(
            event.id,
            event.club_id,
            event.title,
            event.description,
            event.start_time,
            event.end_time,
            event.location,
            event.cover_url,
            event.status,
            event.max_participants,
            function(err) {
                if (err) {
                    console.error(`✗ Error adding event "${event.title}":`, err.message);
                } else {
                    console.log(`✓ Added event: ${event.title} (${event.status})`);
                }
            }
        );
    });

    stmt.finalize((err) => {
        if (err) console.error('Error finalizing statement:', err.message);
        console.log('\nEvents data import process completed.');
    });
});

db.close();
