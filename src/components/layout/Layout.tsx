import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { Button } from '../ui/button';
import { Home, Users, UsersRound, LogOut, LayoutDashboard, Calendar, Bell, MessageSquare, Settings } from 'lucide-react';
import { useNotificationStore } from '../../features/notifications/store/useNotificationStore';
import { useChatStore } from '../../features/chat/store/useChatStore';
import { useUserStore } from '../../features/profile/store/useUserStore';
import { cn } from '../../utils/cn';
import { useEffect } from 'react';

export const Layout = () => {
    const { logout, user } = useAuthStore();
    const { getUnreadCount } = useNotificationStore();
    const { conversations } = useChatStore();
    const { fetchUsers } = useUserStore();
    const unreadCount = getUnreadCount();
    const totalUnreadMessages = conversations.reduce((acc, conv) => acc + conv.unreadCount, 0);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const NavItem = ({ to, icon: Icon, label, badgeCount, badgeColor }: any) => {
        const isActive = location.pathname.startsWith(to);
        return (
            <Link
                to={to}
                className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                    isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400"
                )}
            >
                <div className={cn("absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 transition-opacity", isActive && "opacity-100")} />
                <Icon className={cn("h-5 w-5 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                <span className="font-bold tracking-wide">{label}</span>
                {badgeCount > 0 && (
                    <span className={cn(
                        "ml-auto text-xs font-black px-2 py-0.5 rounded-full shadow-sm",
                        isActive ? "bg-white text-blue-600" : (badgeColor || "bg-red-500 text-white")
                    )}>
                        {badgeCount}
                    </span>
                )}
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row transition-colors duration-200">
            {/* Sidebar */}
            <aside className="w-full md:w-72 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 min-h-screen p-6 flex flex-col fixed md:relative z-10">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <img src="/logo.png" alt="N7social" className="h-10 w-10 object-contain drop-shadow-md" />
                    <span className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">N7social</span>
                </div>

                <nav className="flex-1 space-y-1.5">
                    <NavItem to="/feed" icon={Home} label="Feed" />
                    <NavItem to="/clubs" icon={Users} label="Clubs" />
                    <NavItem to="/groups" icon={UsersRound} label="Groupes" />
                    <NavItem to="/events" icon={Calendar} label="Événements" />
                    <NavItem to="/notifications" icon={Bell} label="Notifications" badgeCount={unreadCount} />
                    <NavItem to="/messages" icon={MessageSquare} label="Messages" badgeCount={totalUnreadMessages} badgeColor="bg-blue-500 text-white" />
                    <div className="pt-4 pb-2">
                        <div className="h-px bg-gray-100 dark:bg-gray-700/50" />
                    </div>
                    <NavItem to="/settings" icon={Settings} label="Paramètres" />

                    {user?.role === 'teacher' && (
                        <NavItem to="/teacher/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    )}
                    {user?.role === 'admin' && (
                        <NavItem to="/admin" icon={LayoutDashboard} label="Admin" />
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
