import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { GraduationCap } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '../../../components/ui/card';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../../../lib/api';

const loginSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Mot de passe trop court'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: 'lucas.martin@edu.univ.fr',
            password: 'password123'
        }
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const response = await api.login(data);
            login(response.user, response.token);

            // Redirect based on role
            if (response.user.role === 'admin') navigate('/admin');
            else if (response.user.role === 'teacher') navigate('/teacher/dashboard');
            else navigate('/feed');
        } catch (error) {
            console.error('Login error:', error);
            setError('root', {
                type: 'manual',
                message: (error as Error).message || 'Échec de la connexion'
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 flex flex-col items-center">
                    <div className="bg-primary/10 p-3 rounded-full mb-2">
                        <GraduationCap className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
                    <CardDescription>
                        Entrez vos identifiants pour accéder au réseau
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-gray-200" htmlFor="email">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nom@ecole.edu"
                                {...register('email')}
                            />
                            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-gray-200" htmlFor="password">Mot de passe</label>
                            <Input
                                id="password"
                                type="password"
                                {...register('password')}
                            />
                            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                        </div>

                        {errors.root && (
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600 dark:text-red-400">
                                {errors.root.message}
                            </div>
                        )}

                        <Button className="w-full" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-sm text-center text-gray-500 dark:text-gray-400">
                        Pas encore de compte ?{' '}
                        <Link to="/register" className="text-primary hover:underline">
                            S'inscrire
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};
