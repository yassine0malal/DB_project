import { useState, useEffect } from 'react';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { api } from '../../../lib/api';

const API_URL = 'http://localhost:3000/api/simple-chat';

interface SimpleMessage {
    id: string;
    content: string;
    created_at: string;
    author_id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
}

interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    role: string;
}

export const SimpleMessagesPage = () => {
    const { user } = useAuthStore();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [messages, setMessages] = useState<SimpleMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Load contacts
    useEffect(() => {
        if (user) {
            api.getFollowing(user.id)
                .then(data => setContacts(data.following || []))
                .catch(err => console.error('Error loading contacts:', err));
        }
    }, [user]);

    // Load messages when contact is selected
    useEffect(() => {
        if (user && selectedContact) {
            loadMessages();
        }
    }, [user, selectedContact]);

    const loadMessages = async () => {
        if (!user || !selectedContact) return;

        try {
            const res = await fetch(`${API_URL}/messages/${user.id}/${selectedContact.id}`);
            if (!res.ok) throw new Error('Failed to load messages');
            const data = await res.json();
            setMessages(data.messages || []);
        } catch (err) {
            console.error('Error loading messages:', err);
        }
    };

    const handleSendMessage = async () => {
        if (!user || !selectedContact || !newMessage.trim()) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/messages/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId1: user.id,
                    userId2: selectedContact.id,
                    senderId: user.id,
                    content: newMessage
                })
            });

            if (!res.ok) throw new Error('Failed to send message');

            setNewMessage('');
            await loadMessages(); // Reload messages
        } catch (err) {
            console.error('Error sending message:', err);
            alert('Erreur lors de l\'envoi du message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
            {/* Contacts List */}
            <div className="w-80 flex-shrink-0 border-r border-gray-100 dark:border-gray-800 flex flex-col">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Messages</h2>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {contacts.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Aucun contact trouvé.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50 dark:divide-gray-800">
                            {contacts.map(contact => (
                                <div
                                    key={contact.id}
                                    onClick={() => setSelectedContact(contact)}
                                    className={`flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${selectedContact?.id === contact.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                        }`}
                                >
                                    <img
                                        src={contact.avatarUrl || `https://ui-avatars.com/api/?name=${contact.firstName}+${contact.lastName}&background=random`}
                                        alt={`${contact.firstName} ${contact.lastName}`}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="ml-3 flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                            {contact.firstName} {contact.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {contact.role}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
                {selectedContact ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center">
                            <img
                                src={selectedContact.avatarUrl || `https://ui-avatars.com/api/?name=${selectedContact.firstName}+${selectedContact.lastName}&background=random`}
                                alt={`${selectedContact.firstName} ${selectedContact.lastName}`}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="ml-3">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                    {selectedContact.firstName} {selectedContact.lastName}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {selectedContact.role}
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 ? (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Aucun message. Commencez la discussion !
                                    </p>
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isMe = msg.author_id === user?.id;
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                                                }`}>
                                                <p className="text-sm">{msg.content}</p>
                                                <p className={`text-xs mt-1 ${isMe ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                                                    }`}>
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
                                    placeholder="Écrivez votre message..."
                                    className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                                    disabled={loading}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={loading || !newMessage.trim()}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                                >
                                    {loading ? 'Envoi...' : 'Envoyer'}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-8 space-y-4 bg-gray-50 dark:bg-gray-800/50">
                        <div className="h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Sélectionnez un contact</h3>
                            <p className="text-sm max-w-[250px]">
                                Choisissez un contact dans la liste pour commencer à discuter.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
