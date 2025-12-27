import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../../auth/types';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
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
    const { updateUser } = useAuthStore();
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
            // Construct the update object
            const updates: Partial<User> = {
                firstName: data.firstName,
                lastName: data.lastName,
                bio: data.bio,
                avatarUrl: data.avatarUrl,
                socialLinks: {
                    linkedin: data.linkedin,
                    github: data.github,
                    website: data.website
                }
            };

            // Role specific updates
            if (user.role === 'student') {
                Object.assign(updates, {
                    major: data.major,
                    level: data.level,
                });
            } else if (user.role === 'teacher') {
                Object.assign(updates, {
                    officeLocation: data.officeLocation,
                    officeHours: data.officeHours,
                    currentResearch: data.currentResearch,
                });
            } else if (user.role === 'admin') {
                Object.assign(updates, {
                    adminRole: data.adminRole,
                    availabilityHours: data.availabilityHours,
                    emergencyContact: data.emergencyContact,
                });
            }

            updateUser(updates);
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to update profile', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Modifier le profil</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Common Info */}
                    <div className="space-y-4">
                        <h3 className="font-semibold border-b pb-2">Informations Générales</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Prénom</Label>
                                <Input id="firstName" {...register('firstName')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Nom</Label>
                                <Input id="lastName" {...register('lastName')} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" {...register('bio')} placeholder="Parlez-nous de vous..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="avatarUrl">URL Photo de profil</Label>
                            <Input id="avatarUrl" {...register('avatarUrl')} placeholder="https://..." />
                        </div>
                    </div>

                    {/* Role Specific */}
                    {user.role === 'student' && (
                        <div className="space-y-4">
                            <h3 className="font-semibold border-b pb-2">Étudiant</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="major">Filière</Label>
                                    <Input id="major" {...register('major')} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="level">Niveau</Label>
                                    <Input id="level" {...register('level')} />
                                </div>
                            </div>
                        </div>
                    )}

                    {user.role === 'teacher' && (
                        <div className="space-y-4">
                            <h3 className="font-semibold border-b pb-2">Enseignant</h3>
                            <div className="space-y-2">
                                <Label htmlFor="officeLocation">Bureau</Label>
                                <Input id="officeLocation" {...register('officeLocation')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="officeHours">Heures de permanence</Label>
                                <Input id="officeHours" {...register('officeHours')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currentResearch">Recherches en cours</Label>
                                <Textarea id="currentResearch" {...register('currentResearch')} />
                            </div>
                        </div>
                    )}

                    {user.role === 'admin' && (
                        <div className="space-y-4">
                            <h3 className="font-semibold border-b pb-2">Admin</h3>
                            <div className="space-y-2">
                                <Label htmlFor="adminRole">Rôle Administratif</Label>
                                <Input id="adminRole" {...register('adminRole')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="availabilityHours">Disponibilité</Label>
                                <Input id="availabilityHours" {...register('availabilityHours')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="emergencyContact">Contact d'urgence</Label>
                                <Input id="emergencyContact" {...register('emergencyContact')} />
                            </div>
                        </div>
                    )}

                    {/* Social Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold border-b pb-2">Réseaux Sociaux</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="linkedin">LinkedIn</Label>
                                <Input id="linkedin" {...register('linkedin')} placeholder="URL LinkedIn" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="github">GitHub</Label>
                                <Input id="github" {...register('github')} placeholder="URL GitHub" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Site Web</Label>
                                <Input id="website" {...register('website')} placeholder="URL Site Web" />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
                        <Button type="submit" disabled={isLoading}>Enregistrer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
