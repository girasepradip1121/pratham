import {
    Home,
    LogOut,
    Bell,
    Lock,
    Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const DashboardHeader = ({ name, onMenuClick }) => {

    const navigate = useNavigate();

    const { logout, user } = useContext(AuthContext);
    const plan = user?.plan || 'FREE';

    const handleLogout = () => {

        logout();

        navigate('/');
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

            {/* LEFT */}
            <div className="flex items-center gap-3">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={onMenuClick}
                    className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all lg:hidden"
                    aria-label="Toggle Sidebar"
                >
                    <Menu size={20} />
                </button>

                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-1.5">
                        Welcome,
                        <span className="text-primary-500"> {name}</span>
                    </h1>

                    <p className="text-gray-400 mt-1.5 text-sm">
                        Complete your counselling profile
                    </p>
                </div>

            </div>

            {/* RIGHT BUTTONS */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">

                {/* HOME */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-sm font-semibold"
                >
                    <Home size={18} />
                    Home
                </button>

                {/* LOGOUT */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm font-semibold"
                >
                    <LogOut size={18} />
                    Logout
                </button>

            </div>

        </div>
    );
};

export default DashboardHeader;