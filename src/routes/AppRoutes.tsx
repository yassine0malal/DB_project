import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { Layout } from '../components/layout/Layout';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// Lazy load all page components
const LandingPage = lazy(() => import('../features/landing/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const FeedPage = lazy(() => import('../features/feed/pages/FeedPage').then(m => ({ default: m.FeedPage })));
const ClubDetailsPage = lazy(() => import('../features/clubs/pages/ClubDetailsPage').then(m => ({ default: m.ClubDetailsPage })));
const ClubListPage = lazy(() => import('../features/clubs/pages/ClubListPage').then(m => ({ default: m.ClubListPage })));
const EventsPage = lazy(() => import('../features/events/pages/EventsPage').then(m => ({ default: m.EventsPage })));
const EventDetailsPage = lazy(() => import('../features/events/pages/EventDetailsPage').then(m => ({ default: m.EventDetailsPage })));
const NotificationsPage = lazy(() => import('../features/notifications/pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const ProfilePage = lazy(() => import('../features/profile/pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const MessagesPage = lazy(() => import('../features/chat/pages/MessagesPage').then(m => ({ default: m.MessagesPage })));
const GroupListPage = lazy(() => import('../features/groups/pages/GroupListPage').then(m => ({ default: m.GroupListPage })));
const GroupDetailsPage = lazy(() => import('../features/groups/pages/GroupDetailsPage').then(m => ({ default: m.GroupDetailsPage })));
const TeacherDashboard = lazy(() => import('../features/teacher/pages/TeacherDashboard').then(m => ({ default: m.TeacherDashboard })));
const AdminDashboard = lazy(() => import('../features/admin/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const SettingsPage = lazy(() => import('../features/settings/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

const HomeRedirect = () => {
    const { user } = useAuthStore();

    // If user is authenticated, redirect to their dashboard
    if (user) {
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
        return <Navigate to="/feed" replace />;
    }

    // If not authenticated, show landing page
    return <LandingPage />;
};

export const AppRoutes = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                {/* Landing page for unauthenticated users, redirect for authenticated */}
                <Route path="/" element={<HomeRedirect />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/unauthorized" element={<div className="p-10 text-center text-red-600 font-bold">Accès non autorisé</div>} />

                {/* Student/General Routes - Accessible by Students and Teachers */}
                <Route element={
                    <ProtectedRoute allowedRoles={['student', 'teacher']}>
                        <Layout />
                    </ProtectedRoute>
                }>
                    <Route path="/feed" element={<FeedPage />} />
                    <Route path="/clubs" element={<ClubListPage />} />
                    <Route path="/clubs/:id" element={<ClubDetailsPage />} />
                    <Route path="/groups" element={<GroupListPage />} />
                    <Route path="/groups/:id" element={<GroupDetailsPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/events/:id" element={<EventDetailsPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/profile/:id" element={<ProfilePage />} />
                    <Route path="/messages" element={<MessagesPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>

                {/* Teacher Routes */}
                <Route path="/teacher" element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                        <Layout />
                    </ProtectedRoute>
                }>
                    <Route path="dashboard" element={<TeacherDashboard />} />
                    {/* Re-use Profile page for teachers too? Maybe later specialized one */}
                    <Route path="profile" element={<ProfilePage />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Layout />
                    </ProtectedRoute>
                }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
};
