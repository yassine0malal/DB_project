import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { TrendingUp, Hash } from 'lucide-react';

interface Trend {
    tag: string;
    count: number;
}

export const TrendingHashtags = () => {
    const [trends, setTrends] = useState<Trend[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                // Directly call fetch since api wrapper might not have this specific method typed yet
                // But we can use the base fetch or axios if api is an instance. 
                // Assuming api.get exists or using fetch directly.
                const response = await fetch('http://localhost:3000/api/trends/hashtags');
                const data = await response.json();
                setTrends(data.trends || []);
            } catch (error) {
                console.error('Failed to fetch trends', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrends();
    }, []);

    if (isLoading) return <div className="animate-pulse h-40 bg-gray-100 dark:bg-gray-800 rounded-xl" />;

    return (
        <Card className="shadow-sm border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    Tendances
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {trends.map((trend, index) => (
                        <div key={index} className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <Hash className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {trend.tag}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {trend.count} publications
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {trends.length === 0 && (
                        <p className="text-sm text-gray-500">Aucune tendance pour le moment.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
