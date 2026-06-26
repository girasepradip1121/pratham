import { useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    User,
    GraduationCap,
    FileText,
    LogOut,
    Bell,
    Lock,
    PhoneCall,
    CreditCard,
    HelpCircle,
    Award,
    Compass,
    X
} from 'lucide-react';

import logoImg from '../../assets/image.png';

const DashboardSidebar = ({ plan, isOpen, onClose }) => {
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);

    const isFree = !plan || plan.toUpperCase() === 'FREE';

    // Parse active tab from URL search query
    const searchParams = new URLSearchParams(location.search);
    const activeTab = searchParams.get('tab') || 'overview';

    const menus = [
        {
            name: 'Dashboard Overview',
            icon: LayoutDashboard,
            tab: 'overview',
            premium: false
        },
        {
            name: 'Documents',
            icon: FileText,
            tab: 'documents',
            premium: true
        },
        {
            name: 'College Predictor',
            icon: GraduationCap,
            tab: 'college-predictor',
            premium: false
        },
        {
            name: 'Profile Settings',
            icon: User,
            tab: 'profile',
            premium: false
        }
    ];

    const renderSidebarContent = (isMobile = false) => {
        return (
            <div className="flex flex-col justify-between h-full">
                <div>
                    {/* Logo Banner */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2.5">
                            <img 
                                src={logoImg} 
                                alt="CET Counselling Logo" 
                                className="h-9 w-auto object-contain" 
                            />
                            <div className="flex flex-col justify-center">
                                <span className="text-base font-extrabold tracking-wider text-white leading-none uppercase">
                                    PRATHAM
                                </span>
                                <span className="text-[8px] font-bold tracking-[0.25em] text-primary-500 uppercase leading-none mt-1">
                                    MENTORSHIP
                                </span>
                            </div>
                        </div>

                        {/* Mobile close button */}
                        {isMobile && (
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    {/* Account Plan Tier Indicator */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 mb-6 text-xs flex justify-between items-center">
                        <div>
                            <span className="text-gray-500 text-[10px] block uppercase tracking-wider">Current Plan</span>
                            <span className="text-white font-bold tracking-wide">{plan || 'FREE'}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${isFree ? 'bg-gray-500/20 text-gray-400' : 'bg-primary-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.3)]'}`}>
                            {isFree ? 'Free Account' : 'PRO'}
                        </span>
                    </div>

                    {/* Sidebar Navigation */}
                    <div className="space-y-1.5">
                        {menus.map((menu) => {
                            const Icon = menu.icon;
                            const isLocked = menu.premium && isFree;
                            const active = activeTab === menu.tab;
                            const isProfileIncomplete = !user?.phone || !user?.cetScore || !user?.category || !user?.city;

                            // Resolve target route
                            let targetUrl = `/dashboard?tab=${menu.tab}`;
                            if (menu.tab === 'college-predictor') {
                                targetUrl = `/${menu.tab}`;
                            }

                            if (isProfileIncomplete && menu.tab !== 'profile') {
                                targetUrl = `/student/profile`;
                            } else if (isLocked) {
                                targetUrl = `/#pricing`;
                            }

                            return (
                                <Link
                                    key={menu.tab}
                                    to={targetUrl}
                                    onClick={isMobile ? onClose : undefined}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm group ${active
                                        ? 'bg-primary-500 text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={18} className={active ? 'text-black' : 'text-gray-400 group-hover:text-white'} />
                                        <span>{menu.name}</span>
                                    </div>
                                    {isLocked && (
                                        <Lock size={12} className="text-gray-500 group-hover:text-primary-400 transition-colors" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Logout Trigger */}
                <button
                    onClick={() => {
                        if (isMobile) onClose();
                        logout();
                    }}
                    className="mt-8 flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-semibold border border-transparent hover:border-red-500/10"
                >
                    <LogOut size={18} />
                    Logout Session
                </button>
            </div>
        );
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 bg-[#071028] border-r border-white/10 flex-col justify-between p-6 overflow-y-auto custom-scrollbar z-30">
                {renderSidebarContent(false)}
            </aside>

            {/* Mobile Drawer Overlay Backdrop */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden transition-all duration-300"
                />
            )}

            {/* Mobile Drawer Content */}
            <aside
                className={`fixed left-0 top-0 h-screen w-72 bg-[#071028] border-r border-white/10 flex flex-col justify-between p-6 overflow-y-auto custom-scrollbar z-50 transition-transform duration-300 transform lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {renderSidebarContent(true)}
            </aside>
        </>
    );
}

export default DashboardSidebar;