import { User } from '../../auth/types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { BookOpen, Clock, Github, Linkedin, Globe, Building, Briefcase, Award, FlaskConical, MapPin, GraduationCap, ShieldCheck } from 'lucide-react';
import { cn } from '../../../utils/cn';

export const ProfileAbout = ({ user, isOwnProfile: _isOwnProfile }: { user: User; isOwnProfile: boolean }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-1000">
            {/* 1. Informations Card (Always in sidebar or stack) */}
            <Card className="shadow-lg shadow-blue-500/5 border-gray-100 dark:border-gray-700/50 dark:bg-gray-800/50 backdrop-blur-sm overflow-hidden group">
                <CardHeader className="pb-4 border-b border-gray-50 dark:border-gray-700/50">
                    <CardTitle className="text-base font-black flex items-center gap-3 text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                        <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                            <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        Informations
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5 text-sm">
                    {user.role === 'student' && (
                        <>
                            <div className="space-y-1.5">
                                <span className="text-gray-400 dark:text-gray-500 block text-[10px] font-black uppercase tracking-widest">Filière</span>
                                <span className="font-bold text-gray-800 dark:text-gray-200 text-base">{user.major}</span>
                            </div>
                            <div className="space-y-1.5">
                                <span className="text-gray-400 dark:text-gray-500 block text-[10px] font-black uppercase tracking-widest">Niveau Académique</span>
                                <Badge variant="outline" className="font-black border-blue-100 dark:border-blue-900/50 text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 px-3 py-1 rounded-lg">
                                    {user.level}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                <span className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest">Statut</span>
                                <Badge variant={user.internshipStatus === 'seeking_internship' ? 'default' : 'secondary'} className={cn(
                                    "font-black text-[10px] uppercase tracking-tighter px-2.5",
                                    user.internshipStatus === 'seeking_internship' ? "bg-blue-600 shadow-lg shadow-blue-500/20" : "dark:bg-gray-700 dark:text-gray-300"
                                )}>
                                    {user.internshipStatus === 'seeking_internship' ? 'Recherche Stage' : 'À l\'écoute'}
                                </Badge>
                            </div>
                        </>
                    )}

                    {user.role === 'teacher' && (
                        <>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                                    <div className="text-gray-400 dark:text-gray-500 flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest">
                                        <Building className="h-3.5 w-3.5" /> Département
                                    </div>
                                    <span className="font-black text-gray-800 dark:text-gray-100 uppercase tracking-tighter">{user.department}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <div className="p-3 bg-gray-50/50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <div className="text-gray-400 dark:text-gray-500 flex items-center gap-1.5 mb-1.5 text-[9px] font-black uppercase tracking-widest">
                                            <MapPin className="h-3 w-3" /> Bureau
                                        </div>
                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{user.officeLocation}</span>
                                    </div>
                                    <div className="p-3 bg-green-50/30 dark:bg-green-900/10 rounded-xl border border-green-100/50 dark:border-green-900/30">
                                        <div className="text-green-600 dark:text-green-500 flex items-center gap-1.5 mb-1.5 text-[9px] font-black uppercase tracking-widest">
                                            <Clock className="h-3 w-3" /> Permanence
                                        </div>
                                        <span className="text-xs font-bold text-green-700 dark:text-green-400">{user.officeHours}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {user.role === 'admin' && (
                        <>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <div className="text-gray-400 dark:text-gray-500 flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest">
                                        <ShieldCheck className="h-3.5 w-3.5" /> Responsabilité
                                    </div>
                                    <span className="font-black text-gray-800 dark:text-gray-100 uppercase tracking-tight">{user.adminRole}</span>
                                </div>
                                <div className="p-4 bg-blue-50/30 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                                    <div className="text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest">
                                        <Clock className="h-3.5 w-3.5" /> Disponibilité
                                    </div>
                                    <span className="font-bold text-gray-900 dark:text-gray-100">{user.availabilityHours}</span>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* 2. Skills & Interests (Sidebar) */}
            {user.role === 'student' && (user.skills || user.interests) && (
                <Card className="shadow-lg shadow-blue-500/5 border-gray-100 dark:border-gray-700/50 dark:bg-gray-800/50 backdrop-blur-sm">
                    <CardHeader className="pb-4 border-b border-gray-50 dark:border-gray-700/50">
                        <CardTitle className="text-base font-black flex items-center gap-3 text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                                <Award className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            Compétences
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-8">
                        {user.skills && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    MAÎTRISE TECHNIQUE
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map(s => (
                                        <Badge key={s} variant="secondary" className="bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white border-none px-3 py-1 text-[10px] font-bold transition-all transform hover:scale-105 cursor-default">
                                            {s}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                        {user.interests && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    PASSIONS ACADÉMIQUES
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {user.interests.map(i => (
                                        <Badge key={i} variant="outline" className="text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 px-3 py-1 text-[10px] font-medium hover:border-blue-400 transition-colors">
                                            #{i}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* 3. Networking/Social (Sidebar) */}
            {(user as any).socialLinks && (
                <Card className="shadow-lg shadow-blue-500/5 border-gray-100 dark:border-gray-700/50 dark:bg-gray-800/50 backdrop-blur-sm">
                    <CardHeader className="pb-4 border-b border-gray-50 dark:border-gray-700/50">
                        <CardTitle className="text-base font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">Réseaux</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-2">
                        {(user as any).socialLinks.linkedin && (
                            <a href={(user as any).socialLinks.linkedin} target="_blank" className="flex items-center gap-3 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-all p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl group border border-transparent hover:border-blue-100 dark:hover:border-blue-800">
                                <Linkedin className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" /> LinkedIn
                            </a>
                        )}
                        {(user as any).socialLinks.github && (
                            <a href={(user as any).socialLinks.github} target="_blank" className="flex items-center gap-3 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl group border border-transparent hover:border-gray-100 dark:hover:border-gray-600">
                                <Github className="h-5 w-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" /> GitHub
                            </a>
                        )}
                        {(user as any).socialLinks.website && (
                            <a href={(user as any).socialLinks.website} target="_blank" className="flex items-center gap-3 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-all p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl group border border-transparent hover:border-blue-100 dark:hover:border-blue-800">
                                <Globe className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" /> Site Web
                            </a>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* 4. Student Meta Badge (Sidebar) */}
            {user.role === 'student' && (
                <div className="p-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 rounded-3xl shadow-2xl shadow-blue-500/30 text-white overflow-hidden relative group transition-transform hover:scale-[1.02] duration-500">
                    <div className="relative z-10 space-y-6">
                        <div className="space-y-1">
                            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] opacity-80">CARTE D'IDENTITÉ ÉTUDIANTE</h4>
                            <p className="text-3xl font-black tracking-tighter">{user.level}</p>
                        </div>
                        <div className="space-y-3">
                            <p className="text-sm font-medium border-l-2 border-white/30 pl-3 leading-tight opacity-90 uppercase tracking-wider">Promotion<br /><span className="text-lg font-black">{user.academicYear}</span></p>
                            <div className="bg-white/10 backdrop-blur-xl px-4 py-2.5 rounded-xl text-[11px] font-mono font-black inline-flex items-center gap-2 border border-white/20 shadow-inner">
                                <span className="opacity-50 tracking-widest uppercase">Matricule :</span> {user.studentId}
                            </div>
                        </div>
                    </div>
                    <GraduationCap className="absolute -bottom-6 -right-6 h-32 w-32 opacity-10 transform -rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-all duration-700" />
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <div className="h-24 w-24 rounded-full border-[20px] border-white" />
                    </div>
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
