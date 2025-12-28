import { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { api } from '../../../lib/api';
import { Message } from '../../groups/types/discussion';
import { cn } from '../../../utils/cn';

interface GroupChatProps {
    groupId: string;
    isMember: boolean;
}

export const GroupChat = ({ groupId, isMember }: GroupChatProps) => {
    const { user } = useAuthStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const data = await api.getGroupMessages(groupId);
                setMessages(data.messages);
            } catch (error) {
                console.error("Failed to fetch messages", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
        // Optional: Poll every 5s for new messages
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [groupId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        setIsSending(true);
        try {
            const message = await api.sendGroupMessage(groupId, user.id, newMessage);
            setMessages([...messages, message]);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;
    }

    return (
        <div className="flex flex-col h-[600px] bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 my-auto h-full flex items-center justify-center flex-col">
                        <p>Aucun message pour le moment.</p>
                        <p className="text-sm">Soyez le premier à écrire !</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.author.id === user?.id;
                        return (
                            <div key={msg.id} className={cn("flex gap-3 max-w-[80%]", isMe ? "ml-auto flex-row-reverse" : "")}>
                                <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                    {msg.author.avatarUrl ? (
                                        <img src={msg.author.avatarUrl} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-xs font-bold text-gray-500">
                                            {msg.author.firstName[0]}
                                        </div>
                                    )}
                                </div>
                                <div className={cn("flex flex-col gap-1", isMe ? "items-end" : "items-start")}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            {msg.author.firstName} {msg.author.lastName}
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className={cn(
                                        "px-4 py-2 rounded-2xl text-sm shadow-sm",
                                        isMe
                                            ? "bg-blue-600 text-white rounded-tr-none"
                                            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                {isMember ? (
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Écrivez un message..."
                            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-full border-none focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!newMessage.trim() || isSending}
                            className="rounded-full h-10 w-10 shrink-0 bg-blue-600 hover:bg-blue-700"
                        >
                            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                    </form>
                ) : (
                    <div className="text-center py-2 text-gray-500 text-sm bg-gray-50 dark:bg-gray-900 rounded-lg">
                        Vous devez rejoindre le groupe pour participer à la discussion.
                    </div>
                )}
            </div>
        </div>
    );
};
