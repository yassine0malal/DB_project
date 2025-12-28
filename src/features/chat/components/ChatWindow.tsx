import { useState, useRef, useEffect } from 'react';
import { Conversation, Message } from '../types';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { Send, Image, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { cn } from '../../../utils/cn';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ChatWindowProps {
    conversation: Conversation;
    messages: Message[];
    onSendMessage: (content: string) => void;
}

export const ChatWindow = ({ conversation, messages, onSendMessage }: ChatWindowProps) => {
    const { user: currentUser } = useAuthStore();
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const otherParticipant = conversation.participants.find(p => p.id !== currentUser?.id);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage("");
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-gray-900/50">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 p-4 border-b dark:border-gray-800 flex items-center justify-between shadow-sm z-10 text-gray-900 dark:text-gray-100">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 overflow-hidden">
                        {otherParticipant?.avatarUrl ? (
                            <img src={otherParticipant.avatarUrl} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-blue-600 font-bold">
                                {otherParticipant?.firstName[0]}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">
                            {otherParticipant?.firstName} {otherParticipant?.lastName}
                        </h3>
                        <p className="text-xs text-green-500 font-medium">En ligne</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="text-gray-400"><Phone className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-gray-400"><Video className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-gray-400"><MoreVertical className="h-4 w-4" /></Button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <div className="h-20 w-20 bg-blue-50 dark:bg-blue-900/10 rounded-full flex items-center justify-center mb-4">
                            <Send className="h-10 w-10 text-blue-200 dark:text-blue-800" />
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100">Démarrer une conversation</h4>
                        <p className="text-sm text-gray-500 max-w-[200px]">
                            Envoyez un message pour commencer à discuter avec {otherParticipant?.firstName}.
                        </p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMine = msg.senderId === currentUser?.id;
                        const showTime = idx === messages.length - 1 ||
                            new Date(messages[idx + 1].timestamp).getTime() - new Date(msg.timestamp).getTime() > 300000;

                        return (
                            <div key={msg.id} className={cn("flex flex-col", isMine ? "items-end" : "items-start")}>
                                <div className={cn(
                                    "max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm",
                                    isMine
                                        ? "bg-blue-600 text-white rounded-tr-none"
                                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700"
                                )}>
                                    {msg.content}
                                </div>
                                {showTime && (
                                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                                        {format(new Date(msg.timestamp), 'HH:mm', { locale: fr })}
                                    </span>
                                )}
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white dark:bg-gray-900 p-4 border-t dark:border-gray-800">
                <form onSubmit={handleSend} className="flex gap-2">
                    <Button type="button" variant="ghost" size="icon" className="text-gray-400 dark:text-gray-500 shrink-0">
                        <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="text-gray-400 shrink-0">
                        <Image className="h-5 w-5" />
                    </Button>
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Écrivez votre message..."
                        className="flex-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-blue-100 dark:focus:ring-blue-900 dark:text-gray-100 dark:placeholder:text-gray-500"
                    />
                    <Button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
};
