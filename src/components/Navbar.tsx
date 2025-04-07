
import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { animations } from '@/utils/animations';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    // Apply entrance animation
    if (navRef.current) {
      animations.fadeIn(navRef.current, 0.1, 0.5);
    }
  }, []);
  
  return (
    <nav ref={navRef} className="sticky top-0 z-10 w-full bg-white/80 backdrop-blur-md border-b border-border py-3 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <div className="font-bold text-2xl text-groww-purple">
            AptMatch<span className="text-groww-dark">Buddy</span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`font-medium ${location.pathname === '/' ? 'text-groww-purple' : 'text-gray-700'} hover:text-groww-purple transition-colors`}
          >
            Home
          </Link>
          <Link 
            to="/questionnaire" 
            className={`font-medium ${location.pathname === '/questionnaire' ? 'text-groww-purple' : 'text-gray-700'} hover:text-groww-purple transition-colors`}
          >
            Find Your Match
          </Link>
          <Link 
            to="/results" 
            className={`font-medium ${location.pathname === '/results' ? 'text-groww-purple' : 'text-gray-700'} hover:text-groww-purple transition-colors`}
          >
            Apartments
          </Link>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-medium hover:text-groww-purple transition-colors">
                  {user?.name?.split(' ')[0] || 'Account'} <span className="ml-1">▼</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full cursor-pointer">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/favorites" className="w-full cursor-pointer">Favorites</Link>
                </DropdownMenuItem>
                
                {user?.role === 'broker' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/broker" className="w-full cursor-pointer">Broker Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/broker/listings" className="w-full cursor-pointer">My Listings</Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                {user?.role === 'admin' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="w-full cursor-pointer">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-medium hover:text-groww-purple transition-colors">
                  Login <span className="ml-1">▼</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/login" className="w-full cursor-pointer">User Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/login?role=broker" className="w-full cursor-pointer">Broker Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/login?role=admin" className="w-full cursor-pointer">Admin Login</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {!isAuthenticated && (
            <Link 
              to="/register" 
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 border border-groww-purple text-groww-purple rounded-lg hover:bg-groww-soft-purple transition-colors"
            >
              Register
            </Link>
          )}
          <Link 
            to={isAuthenticated ? "/questionnaire" : "/login"} 
            className="inline-flex items-center justify-center px-4 py-2 bg-groww-purple text-white rounded-lg hover:bg-groww-purple-dark transition-colors"
          >
            {isAuthenticated ? "Get Started" : "Login"}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
