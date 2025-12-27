import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { Button } from '../ui/button';
import { Home, Users, UsersRound, LogOut, GraduationCap, LayoutDashboard, Calendar, Bell, MessageSquare, Settings } from 'lucide-react';
import { useNotificationStore } from '../../features/notifications/store/useNotificationStore';
import { useChatStore } from '../../features/chat/store/useChatStore';

export const Layout = () => {
    const { logout, user } = useAuthStore();
    const { getUnreadCount } = useNotificationStore();
    const { conversations } = useChatStore();
    const unreadCount = getUnreadCount();
    const totalUnreadMessages = conversations.reduce((acc, conv) => acc + conv.unreadCount, 0);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row transition-colors duration-200">
            {/* Sidebar (Desktop) / Navbar (Mobile) could be improved here. For now, simple sidebar */}
            <aside className="w-full md:w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 min-h-screen p-4 flex flex-col fixed md:relative z-10 transition-colors duration-200">
                <div className="flex items-center gap-2 mb-8 px-2">
                    <GraduationCap className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold text-primary">UniSocial</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <Link to="/feed" className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                        <Home className="h-5 w-5" />
                        Feed
                    </Link>
                    <Link to="/clubs" className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                        <Users className="h-5 w-5" />
                        Clubs
                    </Link>
                    <Link to="/groups" className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                        <UsersRound className="h-5 w-5" />
                        Groupes
                    </Link>
                    <Link to="/events" className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                        <Calendar className="h-5 w-5" />
                        Événements
                    </Link>
                    <Link to="/notifications" className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                        <Bell className="h-5 w-5" />
                        Notifications
                        {unreadCount > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </Link>
                    <Link to="/messages" className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                        <MessageSquare className="h-5 w-5" />
                        Messages
                        {totalUnreadMessages > 0 && (
                            <span className="ml-auto bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {totalUnreadMessages}
                            </span>
                        )}
                    </Link>
                    <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                        <Settings className="h-5 w-5" />
                        Paramètres
                    </Link>
                    {user?.role === 'teacher' && (
                        <Link to="/teacher/dashboard" className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                            <LayoutDashboard className="h-5 w-5" />
                            Dashboard
                        </Link>
                    )}
                    {user?.role === 'admin' && (
                        <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                            <LayoutDashboard className="h-5 w-5" />
                            Admin
                        </Link>
                    )}
                </nav>

                <div className="mt-auto border-t dark:border-gray-700 pt-4">
                    <Link
                        to={user?.role === 'teacher' ? '/teacher/profile' : user?.role === 'admin' ? '/admin/profile' : '/profile'}
                        className="flex items-center gap-3 px-2 mb-4 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
                    >
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                            {user?.avatarUrl ? <img src={user.avatarUrl} alt={user.firstName} className="h-full w-full object-cover" /> : <span className="text-gray-500 dark:text-gray-300 font-bold">{user?.firstName?.[0]}</span>}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                        </div>
                    </Link>
                    <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
