
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building, Home, List, LogOut, Settings, User } from 'lucide-react';

interface BrokerLayoutProps {
  children: React.ReactNode;
}

const BrokerLayout: React.FC<BrokerLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-groww-purple text-white' : 'text-gray-700 hover:bg-groww-soft-purple';
  };

  const navItems = [
    { href: '/broker', label: 'Dashboard', icon: Home },
    { href: '/broker/listings', label: 'My Listings', icon: Building },
    { href: '/broker/inquiries', label: 'Inquiries', icon: List },
    { href: '/broker/profile', label: 'Profile', icon: User },
    { href: '/broker/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 w-full bg-white/80 backdrop-blur-md border-b border-border py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <div className="font-bold text-2xl text-groww-purple">
              AptMatch<span className="text-groww-dark">Buddy</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/">
              <button className="text-gray-700 hover:text-groww-purple">
                View Site
              </button>
            </Link>
            <Link to="/login">
              <button className="flex items-center text-gray-700 hover:text-groww-purple">
                <LogOut size={18} className="mr-1" /> Logout
              </button>
            </Link>
          </div>
        </div>
      </header>
      
      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-gray-50 border-r border-border">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${isActive(item.href)}`}
              >
                <item.icon size={18} className="mr-2" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-grow p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BrokerLayout;
