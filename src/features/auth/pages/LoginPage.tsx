import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { GraduationCap, UserCircle, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '../../../components/ui/card';
import { useAuthStore } from '../store/useAuthStore';
import { MOCK_STUDENT, MOCK_TEACHER, MOCK_ADMIN } from '../data/mockUsers';
import { useState } from 'react';

const loginSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Mot de passe trop court'),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type LoginRole = 'student' | 'teacher' | 'admin';

export const LoginPage = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [selectedRole, setSelectedRole] = useState<LoginRole>('student');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: 'alex.dupont@univ.edu', // Default for faster testing
            password: 'password123'
        }
    });

    const onSubmit = async (data: LoginFormValues) => {
        // Mock login logic
        console.log('Login data:', data, 'Role:', selectedRole);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        let userToLogin;

        switch (selectedRole) {
            case 'teacher':
                userToLogin = MOCK_TEACHER;
                break;
            case 'admin':
                userToLogin = MOCK_ADMIN;
                break;
            case 'student':
            default:
                userToLogin = MOCK_STUDENT;
                break;
        }

        // Override email with input email just for show, though usually API returns the user associated with email
        // For this mock, we'll just use the mock profile but maybe update email if we wanted consistency
        // But let's just use the selected mock profile as is to ensure correct role data structure

        login(userToLogin, 'fake-jwt-token');

        // Redirect based on role
        if (selectedRole === 'admin') navigate('/admin');
        else if (selectedRole === 'teacher') navigate('/teacher/dashboard');
        else navigate('/feed');
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
                        {/* Role Selection */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <button
                                type="button"
                                onClick={() => setSelectedRole('student')}
                                className={`flex flex-col items-center p-2 rounded-lg border transition-all ${selectedRole === 'student'
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                                    }`}
                            >
                                <GraduationCap className="h-5 w-5 mb-1" />
                                <span className="text-xs font-medium">Étudiant</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedRole('teacher')}
                                className={`flex flex-col items-center p-2 rounded-lg border transition-all ${selectedRole === 'teacher'
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                                    }`}
                            >
                                <UserCircle className="h-5 w-5 mb-1" />
                                <span className="text-xs font-medium">Enseignant</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedRole('admin')}
                                className={`flex flex-col items-center p-2 rounded-lg border transition-all ${selectedRole === 'admin'
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                                    }`}
                            >
                                <ShieldCheck className="h-5 w-5 mb-1" />
                                <span className="text-xs font-medium">Admin</span>
                            </button>
                        </div>

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
