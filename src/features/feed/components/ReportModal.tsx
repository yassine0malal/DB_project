import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { usePostStore } from '../store/usePostStore';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetId: string;
    type: 'post' | 'comment';
}

const REASONS = [
    "Contenu inapproprié ou offensant",
    "Spam ou publicité indésirable",
    "Harcèlement ou intimidation",
    "Fausses informations",
    "Autre"
];

export const ReportModal = ({ isOpen, onClose, targetId, type }: ReportModalProps) => {
    const { reportContent } = usePostStore();
    const [selectedReason, setSelectedReason] = useState("");

    const handleSubmit = () => {
        if (!selectedReason) return;
        reportContent(targetId, type, selectedReason);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{`Signaler ${type === 'post' ? 'cette publication' : 'ce commentaire'}`}</DialogTitle>
                </DialogHeader>
                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-500">
                        Aidez-nous à comprendre ce qui ne va pas avec ce contenu.
                    </p>
                    <div className="space-y-2">
                        {REASONS.map((reason) => (
                            <div key={reason} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    id={reason}
                                    name="reason"
                                    value={reason}
                                    checked={selectedReason === reason}
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor={reason} className="text-sm font-medium text-gray-700 cursor-pointer">
                                    {reason}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" onClick={onClose}>Annuler</Button>
                        <Button
                            disabled={!selectedReason}
                            onClick={handleSubmit}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Signaler
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
