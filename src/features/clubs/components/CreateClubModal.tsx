import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { useClubStore } from '../store/useClubStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { Club } from '../types';
import { ChevronRight, ChevronLeft, Check, Upload, Layout } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface CreateClubModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateClubModal = ({ isOpen, onClose }: CreateClubModalProps) => {
    // ... rest of the component state same as before
    const { createClub } = useClubStore();
    const { user } = useAuthStore();
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Tech',
        logoUrl: '',
        coverUrl: '',
        website: '',
        contactEmail: ''
    });

    const categories = ['Tech', 'Sport', 'Art', 'Academic', 'Social', 'Gaming'];

    const handleNext = () => setStep(s => Math.min(s + 1, 3));
    const handleBack = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = () => {
        if (!user) return;

        const newClub: Club = {
            id: Date.now().toString(),
            name: formData.name,
            description: formData.description,
            category: formData.category,
            logoUrl: formData.logoUrl,
            coverUrl: formData.coverUrl || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200&h=400',
            contactEmail: formData.contactEmail || user.email,
            website: formData.website,
            createdAt: new Date().toISOString(),
            members: [{
                user: user,
                role: 'admin',
                joinedAt: new Date().toISOString()
            }],
            events: [],
            posts: []
        };

        createClub(newClub);
        onClose();
        setStep(1);
        setFormData({
            name: '',
            description: '',
            category: 'Tech',
            logoUrl: '',
            coverUrl: '',
            website: '',
            contactEmail: ''
        });
    };

    const isStep1Valid = formData.name.length > 3 && formData.description.length > 10;

    return (
        <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Créer un nouveau club</DialogTitle>
                </DialogHeader>

                <div className="p-6">
                    {/* Stepper */}
                    <div className="flex items-center justify-between px-8 mb-8 relative">
                        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-100 -z-10" />
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors border-2 bg-white",
                                    step >= s ? "border-blue-600 text-blue-600" : "border-gray-200 text-gray-400",
                                    step > s && "bg-blue-600 text-white border-blue-600"
                                )}
                            >
                                {step > s ? <Check className="h-4 w-4" /> : s}
                            </div>
                        ))}
                    </div>

                    <div className="min-h-[300px] px-2">
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Nom du club</label>
                                    <Input
                                        placeholder="Ex: Club Robotique"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Description courte</label>
                                    <textarea
                                        className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none min-h-[100px]"
                                        placeholder="Décrivez l'objectif de votre club..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Catégorie</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setFormData({ ...formData, category: cat })}
                                                className={cn(
                                                    "px-3 py-2 rounded-lg text-sm border transition-all",
                                                    formData.category === cat ? "bg-blue-50 border-blue-200 text-blue-700 font-semibold" : "border-gray-200 hover:bg-gray-50 text-gray-600"
                                                )}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center space-y-2">
                                    <div className="mx-auto w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-blue-500">
                                        <Layout className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold">Image de couverture</h4>
                                        <p className="text-xs text-gray-500 mb-3">Recommandé: 1200x400px</p>
                                        <Input
                                            placeholder="https://..."
                                            value={formData.coverUrl}
                                            onChange={e => setFormData({ ...formData, coverUrl: e.target.value })}
                                            className="bg-white"
                                        />
                                    </div>
                                    {formData.coverUrl && (
                                        <img src={formData.coverUrl} className="w-full h-32 object-cover rounded-lg mt-2 shadow-sm" />
                                    )}
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center space-y-2">
                                    <div className="mx-auto w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-purple-500">
                                        <Upload className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold">Logo du club</h4>
                                        <p className="text-xs text-gray-500 mb-3">Carré (400x400px)</p>
                                        <Input
                                            placeholder="https://..."
                                            value={formData.logoUrl}
                                            onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
                                            className="bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h3 className="font-bold text-xl text-gray-900 mb-1">{formData.name}</h3>
                                    <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{formData.category}</span>
                                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">{formData.description}</p>

                                    <div className="mt-6 space-y-2">
                                        <Input
                                            placeholder="Site web (optionnel)"
                                            value={formData.website}
                                            onChange={e => setFormData({ ...formData, website: e.target.value })}
                                            className="bg-white"
                                        />
                                        <Input
                                            placeholder="Email de contact"
                                            value={formData.contactEmail}
                                            onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                                            className="bg-white"
                                        />
                                    </div>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm text-yellow-800">
                                    En créant ce club, vous acceptez d'en être l'administrateur responsable et de respecter la charte de la vie associative.
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between pt-6 border-t mt-4">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            disabled={step === 1}
                            className="text-gray-500"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Retour
                        </Button>

                        {step < 3 ? (
                            <Button
                                onClick={handleNext}
                                disabled={step === 1 && !isStep1Valid}
                                className="bg-gray-900 hover:bg-black text-white px-6 rounded-full"
                            >
                                Suivant
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-full shadow-lg shadow-blue-200"
                            >
                                Créer le club
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
