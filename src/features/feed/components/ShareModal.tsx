import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { useChatStore } from '../../chat/store/useChatStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { Message } from '../../chat/types';
import { Link2, MessageSquare, ChevronRight, Check } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    url: string;
}

export const ShareModal = ({ isOpen, onClose, title, url }: ShareModalProps) => {
    const [step, setStep] = useState<'choice' | 'chat'>('choice');
    const [sentTo, setSentTo] = useState<string[]>([]);

    const { conversations, addMessage } = useChatStore();
    const { user } = useAuthStore();

    const handleCopyLink = () => {
        navigator.clipboard.writeText(url);
        onClose();
        setTimeout(() => setStep('choice'), 300);
    };

    const handleSendToChat = (conversationId: string) => {
        if (!user) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            senderId: user.id,
            content: `J'ai partagé "${title}" avec vous : ${url}`,
            timestamp: new Date().toISOString(),
            isRead: false,
            type: 'text'
        };

        addMessage(conversationId, newMessage);
        setSentTo([...sentTo, conversationId]);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {step === 'choice' ? 'Partager' : 'Envoyer à...'}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6">
                    {step === 'choice' ? (
                        <div className="space-y-3">
                            <button
                                onClick={handleCopyLink}
                                className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Link2 className="h-5 w-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-gray-900">Copier le lien</p>
                                        <p className="text-xs text-gray-500">Partager via URL</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => setStep('chat')}
                                className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                        <MessageSquare className="h-5 w-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-gray-900">Envoyer en message</p>
                                        <p className="text-xs text-gray-500">Partager avec vos contacts</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="max-h-60 overflow-y-auto space-y-1 mb-4">
                                {conversations.length === 0 ? (
                                    <p className="text-center text-sm text-gray-500 py-4">Aucune conversation récente</p>
                                ) : (
                                    conversations.map(conv => {
                                        const otherParticipant = conv.participants.find(p => p.id !== user?.id);
                                        const isAlreadySent = sentTo.includes(conv.id);

                                        return (
                                            <div key={conv.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 overflow-hidden flex-shrink-0">
                                                        {otherParticipant?.avatarUrl ? (
                                                            <img src={otherParticipant.avatarUrl} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-blue-600 font-bold">
                                                                {otherParticipant?.firstName[0]}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {otherParticipant?.firstName} {otherParticipant?.lastName}
                                                    </p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant={isAlreadySent ? "outline" : "default"}
                                                    disabled={isAlreadySent}
                                                    onClick={() => handleSendToChat(conv.id)}
                                                    className={cn(
                                                        "h-8 px-4 rounded-full text-xs font-bold transition-all",
                                                        isAlreadySent ? "bg-white text-green-600 border-green-200" : "bg-blue-600 text-white"
                                                    )}
                                                >
                                                    {isAlreadySent ? <Check className="h-3 w-3 mr-1" /> : null}
                                                    {isAlreadySent ? 'Envoyé' : 'Envoyer'}
                                                </Button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <Button variant="ghost" size="sm" onClick={() => setStep('choice')} className="text-gray-500">
                                    Retour
                                </Button>
                                {sentTo.length > 0 && (
                                    <Button size="sm" onClick={onClose} className="bg-gray-900 text-white px-6 rounded-full font-bold">
                                        Terminer
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
