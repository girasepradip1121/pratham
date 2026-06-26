import { useState, useContext } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import { AuthContext } from '../../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const { user } = useContext(AuthContext);
  const plan = user?.plan || 'FREE';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#020817] flex">

      {/* Sidebar */}
      <DashboardSidebar plan={plan} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header with name and plan */}
          <DashboardHeader 
            name={user?.name || ''} 
            plan={plan} 
            onMenuClick={() => setIsSidebarOpen(true)} 
          />
          {children}
        </div>
      </main>

    </div>
  );
};

export default DashboardLayout;