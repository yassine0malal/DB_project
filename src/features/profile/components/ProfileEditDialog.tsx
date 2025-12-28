import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../../auth/types';
import { useProfileStore } from '../store/useProfileStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { Edit } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';

interface ProfileEditDialogProps {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ProfileEditDialog = ({ user, open, onOpenChange }: ProfileEditDialogProps) => {
    const { updateProfile, updateDetails } = useProfileStore();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit } = useForm({
        defaultValues: {
            // Common
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatarUrl: user.avatarUrl || '',
            bio: user.bio || '',

            // Student
            major: user.role === 'student' ? user.major : '',
            level: user.role === 'student' ? user.level : '',

            // Teacher
            officeLocation: user.role === 'teacher' ? user.officeLocation : '',
            officeHours: user.role === 'teacher' ? user.officeHours : '',
            currentResearch: user.role === 'teacher' ? user.currentResearch : '',

            // Admin
            adminRole: user.role === 'admin' ? user.adminRole : '',
            availabilityHours: user.role === 'admin' ? user.availabilityHours : '',
            emergencyContact: user.role === 'admin' ? user.emergencyContact : '',

            // Socials (simplified for form)
            linkedin: (user as any).socialLinks?.linkedin || '',
            github: (user as any).socialLinks?.github || '',
            website: (user as any).socialLinks?.website || '',
        }
    });

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            // 1. Update basic info
            await updateProfile(user.id, {
                firstName: data.firstName,
                lastName: data.lastName,
                bio: data.bio,
                avatarUrl: data.avatarUrl,
            });

            // 2. Update details & socials
            const details: any = {};
            if (user.role === 'student') {
                details.major = data.major;
                details.level = data.level;
                // Preserve existing arrays if not in form
                details.skills = user.skills || [];
                details.interests = user.interests || [];
                details.academicYear = user.academicYear || '2024-2025';
            } else if (user.role === 'teacher') {
                details.department = user.department; // Not in form?
                details.officeLocation = data.officeLocation;
                details.officeHours = data.officeHours;
            } else if (user.role === 'admin') {
                details.department = user.department;
                details.adminRole = data.adminRole;
            }

            const social = {
                linkedin: data.linkedin,
                github: data.github,
                website: data.website
            };

            await updateDetails(user.id, user.role, details, social);

            onOpenChange(false);
        } catch (error) {
            console.error('Failed to update profile', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-none bg-white dark:bg-gray-800 shadow-2xl">
                <DialogHeader>
                    <DialogTitle>
                        <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 text-white">
                            <Edit className="h-5 w-5" />
                        </div>
                        Modifier mon profil
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-6 space-y-10">

                    {/* Common Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">Informations Générales</h3>
                            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-700/50" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2.5">
                                <Label htmlFor="firstName" className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Prénom</Label>
                                <Input id="firstName" {...register('firstName')} className="rounded-xl border-gray-100 dark:border-gray-700 dark:bg-gray-900/50 focus:ring-blue-500 transition-all font-medium py-6" />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="lastName" className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Nom</Label>
                                <Input id="lastName" {...register('lastName')} className="rounded-xl border-gray-100 dark:border-gray-700 dark:bg-gray-900/50 focus:ring-blue-500 transition-all font-medium py-6" />
                            </div>
                        </div>
                        <div className="space-y-2.5">
                            <Label htmlFor="bio" className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Bio</Label>
                            <Textarea id="bio" {...register('bio')} placeholder="Parlez-nous de vous..." className="rounded-xl border-gray-100 dark:border-gray-700 dark:bg-gray-900/50 focus:ring-blue-500 transition-all font-medium min-h-[120px] p-4 text-sm" />
                        </div>
                        <div className="space-y-2.5">
                            <Label htmlFor="avatarUrl" className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">URL Photo de profil</Label>
                            <Input id="avatarUrl" {...register('avatarUrl')} placeholder="https://..." className="rounded-xl border-gray-100 dark:border-gray-700 dark:bg-gray-900/50 focus:ring-blue-500 transition-all font-medium py-6" />
                        </div>
                    </div>

                    {/* Role Specific */}
                    {user.role === 'student' && (
                        <div className="space-y-6 animate-in slide-in-from-top-2 duration-500">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">Détails Étudiant</h3>
                                <div className="h-px flex-1 bg-gray-100 dark:bg-gray-700/50" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2.5">
                                    <Label htmlFor="major" className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Filière</Label>
                                    <Input id="major" {...register('major')} className="rounded-xl border-gray-100 dark:border-gray-700 dark:bg-gray-900/50 py-6" />
                                </div>
                                <div className="space-y-2.5">
                                    <Label htmlFor="level" className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Niveau</Label>
                                    <Input id="level" {...register('level')} className="rounded-xl border-gray-100 dark:border-gray-700 dark:bg-gray-900/50 py-6" />
                                </div>
                            </div>
                        </div>
                    )}

                    {user.role === 'teacher' && (
                        <div className="space-y-6 animate-in slide-in-from-top-2 duration-500">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xs font-black text-green-600 dark:text-green-400 uppercase tracking-[0.2em]">Détails Enseignant</h3>
                                <div className="h-px flex-1 bg-gray-100 dark:bg-gray-700/50" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2.5">
                                    <Label htmlFor="officeLocation" className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Bureau</Label>
                                    <Input id="officeLocation" {...register('officeLocation')} className="rounded-xl border-gray-100 dark:border-gray-700 dark:bg-gray-900/50 py-6" />
                                </div>
                                <div className="space-y-2.5">
                                    <Label htmlFor="officeHours" className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Permanence</Label>
                                    <Input id="officeHours" {...register('officeHours')} className="rounded-xl border-gray-100 dark:border-gray-700 dark:bg-gray-900/50 py-6" />
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="currentResearch" className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Recherches en cours</Label>
                                <Textarea id="currentResearch" {...register('currentResearch')} className="rounded-xl border-gray-100 dark:border-gray-700 dark:bg-gray-900/50 min-h-[100px]" />
                            </div>
                        </div>
                    )}

                    {user.role === 'admin' && (
                        <div className="space-y-6 animate-in slide-in-from-top-2 duration-500">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-[0.2em]">Détails Admin</h3>
                                <div className="h-px flex-1 bg-gray-100 dark:bg-gray-700/50" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2.5">
                                    <Label htmlFor="adminRole" className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Rôle Administratif</Label>
                                    <Input id="adminRole" {...register('adminRole')} className="rounded-xl border-gray-100 dark:border-gray-700 dark:bg-gray-900/50 py-6" />
                                </div>
                                <div className="space-y-2.5">
                                    <Label htmlFor="availabilityHours" className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Disponibilité</Label>
                                    <Input id="availabilityHours" {...register('availabilityHours')} className="rounded-xl border-gray-100 dark:border-gray-700 dark:bg-gray-900/50 py-6" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Social Links */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Réseaux Sociaux</h3>
                            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-700/50" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2.5">
                                <Label htmlFor="linkedin" className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">LinkedIn</Label>
                                <Input id="linkedin" {...register('linkedin')} placeholder="URL LinkedIn" className="rounded-xl border-gray-100 dark:border-gray-700 dark:bg-gray-900/50 py-6" />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="github" className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">GitHub</Label>
                                <Input id="github" {...register('github')} placeholder="URL GitHub" className="rounded-xl border-gray-100 dark:border-gray-700 dark:bg-gray-900/50 py-6" />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="website" className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Site Web</Label>
                                <Input id="website" {...register('website')} placeholder="URL Site Web" className="rounded-xl border-gray-100 dark:border-gray-700 dark:bg-gray-900/50 py-6" />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold uppercase tracking-widest text-[10px]">Annuler</Button>
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 rounded-xl px-10 shadow-lg shadow-blue-500/20 font-bold uppercase tracking-widest text-[10px] transition-all active:scale-95 disabled:opacity-50">
                            {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
