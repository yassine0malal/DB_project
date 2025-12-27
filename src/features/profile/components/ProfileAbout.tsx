import { User } from '../../auth/types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { BookOpen, Clock, Github, Linkedin, Globe, Building, Briefcase, Award, FlaskConical, MapPin, GraduationCap, ShieldCheck } from 'lucide-react';

export const ProfileAbout = ({ user, isOwnProfile: _isOwnProfile }: { user: User; isOwnProfile: boolean }) => {
    return (
        <div className="space-y-6">
            {/* 1. Informations Card (Always in sidebar or stack) */}
            <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                        Informations
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    {user.role === 'student' && (
                        <>
                            <div className="py-2 border-b border-gray-50">
                                <span className="text-gray-500 block text-xs font-bold uppercase tracking-wider mb-1">Filière</span>
                                <span className="font-semibold text-gray-900">{user.major}</span>
                            </div>
                            <div className="py-2 border-b border-gray-50">
                                <span className="text-gray-500 block text-xs font-bold uppercase tracking-wider mb-1">Niveau</span>
                                <Badge variant="outline" className="font-bold border-blue-100 text-blue-700 bg-blue-50/50">{user.level}</Badge>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Statut stage</span>
                                <Badge variant={user.internshipStatus === 'seeking_internship' ? 'default' : 'secondary'} className="font-bold">
                                    {user.internshipStatus === 'seeking_internship' ? 'Recherche Stage' : 'À l\'écoute'}
                                </Badge>
                            </div>
                        </>
                    )}

                    {user.role === 'teacher' && (
                        <>
                            <div className="py-2 border-b border-gray-50">
                                <div className="text-gray-500 flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider">
                                    <Building className="h-3.5 w-3.5" /> Département
                                </div>
                                <span className="font-semibold text-gray-900">{user.department}</span>
                            </div>
                            <div className="py-2 border-b border-gray-50">
                                <div className="text-gray-500 flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider">
                                    <MapPin className="h-3.5 w-3.5" /> Bureau
                                </div>
                                <span className="font-medium text-gray-900">{user.officeLocation}</span>
                            </div>
                            <div className="py-2">
                                <div className="text-gray-500 flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider">
                                    <Clock className="h-3.5 w-3.5" /> Permanence
                                </div>
                                <span className="font-medium text-green-700">{user.officeHours}</span>
                            </div>
                        </>
                    )}

                    {user.role === 'admin' && (
                        <>
                            <div className="py-2 border-b border-gray-50">
                                <div className="text-gray-500 flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider">
                                    <ShieldCheck className="h-3.5 w-3.5" /> Rôle
                                </div>
                                <span className="font-semibold text-gray-900">{user.adminRole}</span>
                            </div>
                            <div className="py-2">
                                <div className="text-gray-500 flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider">
                                    <Clock className="h-3.5 w-3.5" /> Disponibilité
                                </div>
                                <span className="font-medium text-gray-900">{user.availabilityHours}</span>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* 2. Skills & Interests (Sidebar) */}
            {user.role === 'student' && (user.skills || user.interests) && (
                <Card className="shadow-sm border-gray-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Award className="h-5 w-5 text-blue-600" />
                            Compétences & Intérêts
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {user.skills && (
                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                                    COMPÉTENCES TECHNIQUES
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map(s => <Badge key={s} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none px-2.5 py-0.5">{s}</Badge>)}
                                </div>
                            </div>
                        )}
                        {user.interests && (
                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                                    INTÉRÊTS ACADÉMIQUES
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {user.interests.map(i => <Badge key={i} variant="outline" className="text-gray-600 border-gray-200 px-2.5 py-0.5">{i}</Badge>)}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* 3. Networking/Social (Sidebar) */}
            {(user as any).socialLinks && (
                <Card className="shadow-sm border-gray-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Réseaux</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {(user as any).socialLinks.linkedin && (
                            <a href={(user as any).socialLinks.linkedin} target="_blank" className="flex items-center gap-3 text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors p-2 hover:bg-blue-50 rounded-lg group">
                                <Linkedin className="h-5 w-5 text-gray-400 group-hover:text-blue-600" /> LinkedIn
                            </a>
                        )}
                        {(user as any).socialLinks.github && (
                            <a href={(user as any).socialLinks.github} target="_blank" className="flex items-center gap-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg group">
                                <Github className="h-5 w-5 text-gray-400 group-hover:text-gray-900" /> GitHub
                            </a>
                        )}
                        {(user as any).socialLinks.website && (
                            <a href={(user as any).socialLinks.website} target="_blank" className="flex items-center gap-3 text-sm font-medium text-gray-600 hover:text-blue-500 transition-colors p-2 hover:bg-blue-50 rounded-lg group">
                                <Globe className="h-5 w-5 text-gray-400 group-hover:text-blue-500" /> Site Web
                            </a>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* 4. Student Meta Badge (Sidebar) */}
            {user.role === 'student' && (
                <div className="p-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-md text-white overflow-hidden relative group">
                    <div className="relative z-10">
                        <h4 className="font-black text-xs uppercase tracking-widest opacity-80 mb-1">Fiche Étudiant</h4>
                        <p className="text-xl font-bold">{user.level}</p>
                        <p className="text-sm opacity-90 mb-4">Inscrit en {user.academicYear}</p>
                        <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono inline-block border border-white/30">
                            ID: {user.studentId}
                        </div>
                    </div>
                    <GraduationCap className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10 transform -rotate-12 group-hover:scale-110 transition-transform" />
                </div>
            )}
        </div>
    );
};

export const ProfileNarrative = ({ user }: { user: User }) => {
    return (
        <div className="space-y-6">
            {/* 1. BIO */}
            {/* @ts-ignore */}
            {user.bio && (
                <Card className="shadow-sm border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-600" />
                            À propos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* @ts-ignore */}
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-md">{user.bio}</p>
                    </CardContent>
                </Card>
            )}

            {/* 2. Projects (Students) */}
            {user.role === 'student' && user.projects && user.projects.length > 0 && (
                <Card className="shadow-sm border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FlaskConical className="h-5 w-5 text-blue-600" />
                            Projets Réalisés
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.projects.map((p, i) => (
                            <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all group">
                                <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase text-xs tracking-wider mb-2">{p.title}</h4>
                                <p className="text-sm text-gray-600 leading-relaxed mb-3">{p.description}</p>
                                {p.url && (
                                    <a href={p.url} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                        Voir le projet <ArrowUpRight className="h-3 w-3" />
                                    </a>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* 3. Teacher Specific Narrative */}
            {user.role === 'teacher' && (
                <Card className="shadow-sm border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            Enseignement & Recherche
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h4 className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">MATIÈRES ENSEIGNÉES</h4>
                            <div className="flex flex-wrap gap-2">
                                {user.subjects.map(s => <Badge key={s} className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100">{s}</Badge>)}
                            </div>
                        </div>

                        {user.currentResearch && (
                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">RECHERCHES EN COURS</h4>
                                <p className="text-sm text-gray-700 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 italic leading-relaxed">
                                    {user.currentResearch}
                                </p>
                            </div>
                        )}

                        {user.publications && user.publications.length > 0 && (
                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">PUBLICATIONS RÉCENTES</h4>
                                <ul className="space-y-3">
                                    {user.publications.map((pub, i) => (
                                        <li key={i} className="text-sm text-gray-700 flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                            <div className="mt-1 h-5 w-5 rounded bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 text-[10px] font-bold">
                                                {i + 1}
                                            </div>
                                            {pub}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

const ArrowUpRight = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
);
