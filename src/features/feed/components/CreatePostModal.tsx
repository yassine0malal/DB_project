import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { usePostStore } from '../store/usePostStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { PollOption } from '../types';
import { Image, BarChart2, X, Plus } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Tab = 'post' | 'poll';

export const CreatePostModal = ({ isOpen, onClose }: CreatePostModalProps) => {
    const { addPost } = usePostStore();
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<Tab>('post');

    // Post State
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    // Poll State
    const [pollQuestion, setPollQuestion] = useState("");
    const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);

    const handleAddOption = () => {
        if (pollOptions.length < 5) {
            setPollOptions([...pollOptions, ""]);
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

    const handleRemoveOption = (index: number) => {
        if (pollOptions.length > 2) {
            const newOptions = pollOptions.filter((_, i) => i !== index);
            setPollOptions(newOptions);
        }
    };

    const handleSubmit = () => {
        if (!user) return;

        if (activeTab === 'poll') {
            if (!pollQuestion.trim() || pollOptions.some(o => !o.trim())) return;

            const options: PollOption[] = pollOptions.map((opt, i) => ({
                id: `opt-${i}`,
                label: opt,
                votes: 0
            }));

            addPost({
                type: 'poll',
                content: pollQuestion,
                poll: {
                    id: `poll-${Date.now()}`,
                    question: pollQuestion,
                    options,
                    totalVotes: 0
                },
                author: user,
                authorId: user.id
            });
        } else {
            if (!content.trim()) return;

            addPost({
                type: imageUrl ? 'image' : 'text',
                content,
                imageUrl: imageUrl || undefined,
                author: user,
                authorId: user.id
            });
        }

        // Reset and Close
        setContent("");
        setImageUrl("");
        setPollQuestion("");
        setPollOptions(["", ""]);
        onClose();
    };

    const isValid = activeTab === 'poll'
        ? pollQuestion.trim() && pollOptions.every(o => o.trim())
        : content.trim();

    return (
        <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Créer une publication</DialogTitle>
                </DialogHeader>

                <div className="p-6">
                    <div className="flex gap-2 mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                        <Button
                            variant="ghost"
                            onClick={() => setActiveTab('post')}
                            className={cn("flex-1 gap-2 rounded-lg", activeTab === 'post' ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold" : "text-gray-500 dark:text-gray-400")}
                        >
                            <Image className="h-4 w-4" />
                            Publication
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setActiveTab('poll')}
                            className={cn("flex-1 gap-2 rounded-lg", activeTab === 'poll' ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold" : "text-gray-500 dark:text-gray-400")}
                        >
                            <BarChart2 className="h-4 w-4" />
                            Sondage
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0 overflow-hidden border border-gray-100 dark:border-gray-700">
                                {user?.avatarUrl ? <img src={user.avatarUrl} className="h-full w-full object-cover" /> : null}
                            </div>

                            <div className="flex-1 space-y-3">
                                {activeTab === 'post' ? (
                                    <>
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-300 dark:focus:border-blue-600 transition-all resize-none font-medium"
                                            placeholder={`Quoi de neuf, ${user?.firstName} ?`}
                                            rows={4}
                                        />
                                        <div className="space-y-2">
                                            <Input
                                                value={imageUrl}
                                                onChange={(e) => setImageUrl(e.target.value)}
                                                placeholder="URL de l'image (optionnel)..."
                                                className="text-xs bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                                            />
                                            {imageUrl && (
                                                <div className="h-32 w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                                    <img src={imageUrl} className="h-full w-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <textarea
                                            value={pollQuestion}
                                            onChange={(e) => setPollQuestion(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-300 dark:focus:border-blue-600 transition-all resize-none font-bold text-lg placeholder:font-normal"
                                            placeholder="Posez votre question..."
                                            rows={2}
                                        />
                                        <div className="space-y-2">
                                            {pollOptions.map((opt, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <Input
                                                        value={opt}
                                                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                                                        placeholder={`Option ${idx + 1}`}
                                                        className="bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 text-sm"
                                                    />
                                                    {pollOptions.length > 2 && (
                                                        <button onClick={() => handleRemoveOption(idx)} className="text-gray-400 dark:text-gray-500 hover:text-red-500">
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            {pollOptions.length < 5 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleAddOption}
                                                    className="text-blue-600 text-xs gap-1 h-8 pl-1"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                    Ajouter une option
                                                </Button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button
                                onClick={handleSubmit}
                                disabled={!isValid}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-6 shadow-md shadow-blue-200 disabled:opacity-50"
                            >
                                Publier
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
