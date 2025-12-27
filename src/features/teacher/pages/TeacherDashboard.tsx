import { BookOpen, Calendar, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

export const TeacherDashboard = () => {
    return (
        <div className="container mx-auto p-6 space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Espace Enseignant</h1>
                    <p className="text-gray-500">Gérez vos cours et consultez votre emploi du temps</p>
                </div>
                <Button>
                    <BookOpen className="mr-2 h-4 w-4" /> Nouveau Cours
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Étudiants Total</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">128</div>
                        <p className="text-xs text-muted-foreground">+4% par rapport au mois dernier</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Heures de Cours</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24h</div>
                        <p className="text-xs text-muted-foreground">Cette semaine</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Prochains Cours</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">Aujourd'hui</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Vos Cours Actuels</CardTitle>
                        <CardDescription>Liste des matières enseignées ce semestre</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { name: 'Base de Données Avancées', code: 'BD-204', students: 45, time: 'Lun 08:30' },
                                { name: 'Intelligence Artificielle', code: 'IA-301', students: 38, time: 'Mar 14:00' },
                                { name: 'Projet de Développement', code: 'DEV-402', students: 25, time: 'Jeu 10:00' },
                            ].map((course, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h3 className="font-semibold">{course.name}</h3>
                                        <p className="text-sm text-gray-500">{course.code} • {course.students} Étudiants</p>
                                    </div>
                                    <div className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                                        {course.time}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Notifications Académiques</CardTitle>
                        <CardDescription>Dernières mises à jour administratives</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
                                <p className="text-sm text-yellow-800 font-medium">Réunion Pédagogique</p>
                                <p className="text-xs text-yellow-600">Demain à 16h00 - Salle des Professeurs</p>
                            </div>
                            <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                                <p className="text-sm text-blue-800 font-medium">Remise des notes</p>
                                <p className="text-xs text-blue-600">Date limite: 15 Janvier 2025</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
