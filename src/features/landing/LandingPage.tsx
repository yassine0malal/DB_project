import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { GraduationCap, Users, Calendar, MessageSquare, TrendingUp, Shield, Sparkles, ArrowRight } from 'lucide-react';

export const LandingPage = () => {
    const features = [
        {
            icon: Users,
            title: 'Connexion Communautaire',
            description: 'Connectez-vous avec vos camarades, enseignants et alumni de l\'ENSET Mohammedia'
        },
        {
            icon: Calendar,
            title: 'Événements & Clubs',
            description: 'Découvrez et participez aux événements du campus, rejoignez des clubs passionnants'
        },
        {
            icon: MessageSquare,
            title: 'Communication Fluide',
            description: 'Partagez vos projets, discutez et collaborez avec votre communauté académique'
        },
        {
            icon: TrendingUp,
            title: 'Opportunités',
            description: 'Accédez à des opportunités de stage, projets et développement professionnel'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-200">
            {/* Header/Navbar */}
            <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm dark:shadow-gray-800 z-50 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            EnsetReseux
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost" className="font-semibold">
                                Se connecter
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                S'inscrire
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
                                <Sparkles className="h-4 w-4" />
                                Rejoignez la communauté ENSET
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                                Connectez-vous à votre
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Campus Digital</span>
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                                La plateforme sociale dédiée aux étudiants et enseignants de l'ENSET Mohammedia.
                                Partagez, collaborez et développez votre réseau académique.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/register">
                                    <Button size="lg" className="font-bold text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all">
                                        Créer un compte
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button size="lg" variant="outline" className="font-bold text-lg px-8 py-6 border-2 hover:bg-gray-50 dark:hover:bg-gray-800">
                                        Se connecter
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex items-center gap-8 pt-4">
                                <div>
                                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">500+</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Étudiants actifs</div>
                                </div>
                                <div className="h-12 w-px bg-gray-200 dark:bg-gray-700" />
                                <div>
                                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">50+</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Enseignants</div>
                                </div>
                                <div className="h-12 w-px bg-gray-200 dark:bg-gray-700" />
                                <div>
                                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">20+</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Clubs actifs</div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-3xl blur-3xl opacity-20 animate-pulse" />
                            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500" />
                                        <div className="flex-1">
                                            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2" />
                                            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-1/2" />
                                        </div>
                                    </div>
                                    <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl" />
                                    <div className="flex gap-2">
                                        <div className="h-8 bg-gray-100 rounded flex-1" />
                                        <div className="h-8 bg-gray-100 rounded flex-1" />
                                        <div className="h-8 bg-gray-100 rounded flex-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 transition-colors duration-200">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            Tout ce dont vous avez besoin
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Une plateforme complète pour enrichir votre expérience universitaire
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="group p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <feature.icon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-grid-white/10" />
                        <div className="relative">
                            <Shield className="h-16 w-16 text-white/20 mx-auto mb-6" />
                            <h2 className="text-4xl font-bold text-white mb-4">
                                Prêt à commencer ?
                            </h2>
                            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                                Rejoignez des centaines d'étudiants et enseignants qui utilisent déjà EnsetReseux pour rester connectés
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link to="/register">
                                    <Button size="lg" className="font-bold text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100 shadow-lg">
                                        Créer mon compte gratuitement
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="h-6 w-6" />
                            <span className="text-lg font-bold">EnsetReseux</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            © 2024 EnsetReseux - ENSET Mohammedia. Tous droits réservés.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
