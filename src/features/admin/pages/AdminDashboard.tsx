import { Activity, Shield, Users, Server, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

export const AdminDashboard = () => {
    return (
        <div className="container mx-auto p-6 space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Administration Système</h1>
                    <p className="text-gray-500">Vue d'ensemble et maintenance de la plateforme</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Activity className="mr-2 h-4 w-4" /> Logs
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                        <AlertTriangle className="mr-2 h-4 w-4" /> Urgence
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
                        <Users className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2,543</div>
                        <p className="text-xs text-muted-foreground">En ligne actuellement: 142</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">État du Serveur</CardTitle>
                        <Server className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">99.9%</div>
                        <p className="text-xs text-muted-foreground">Uptime (30 jours)</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Incidents Sécurité</CardTitle>
                        <Shield className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Derniers 7 jours</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Charge Système</CardTitle>
                        <Activity className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45%</div>
                        <p className="text-xs text-muted-foreground">CPU Usage</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Gestion des Utilisateurs Récents</CardTitle>
                        <CardDescription>Dernières inscriptions et activités</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3">Utilisateur</th>
                                        <th className="px-4 py-3">Rôle</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="px-4 py-3 font-medium">Sarah Connor</td>
                                        <td className="px-4 py-3"><span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Étudiant</span></td>
                                        <td className="px-4 py-3 text-green-600">Actif</td>
                                        <td className="px-4 py-3">Il y a 2 min</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="px-4 py-3 font-medium">John Smith</td>
                                        <td className="px-4 py-3"><span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">Enseignant</span></td>
                                        <td className="px-4 py-3 text-green-600">Actif</td>
                                        <td className="px-4 py-3">Il y a 15 min</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="px-4 py-3 font-medium">T-800 Model</td>
                                        <td className="px-4 py-3"><span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Suspicious</span></td>
                                        <td className="px-4 py-3 text-red-600">Flagged</td>
                                        <td className="px-4 py-3">Il y a 1h</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Actions Rapides</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start">
                            <Users className="mr-2 h-4 w-4" /> Gérer les Rôles
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            <Server className="mr-2 h-4 w-4" /> Maintenance BDD
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            <Shield className="mr-2 h-4 w-4" /> Audit Sécurité
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
