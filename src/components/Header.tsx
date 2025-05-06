import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Leaf, BarChart2, User, LogOut, LogIn, Database } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userData, logout, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // All users can see these links
  const publicNavLinks = [
    { name: 'Dashboard', path: '/' },
  ];

  // Only authenticated users can see these links
  const protectedNavLinks = [
    { name: 'Data Entry', path: '/entry' },
    { name: 'Disease Detection', path: '/disease-detection' },
    { name: 'Profit Trends', path: '/profit-trends' },
    { name: 'Farm Management', path: '/farm-management' },
    { name: 'CRUD Test', path: '/crud-test', icon: <Database className="h-4 w-4 mr-1" /> }
  ];

  // Show all links to authenticated users, only public links to non-authenticated users
  const navLinks = currentUser 
    ? [...publicNavLinks, ...protectedNavLinks]
    : publicNavLinks;

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-agri-green-dark" />
            <span className="text-xl font-semibold text-agri-neutral-900">AgriCare</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-300 hover:text-agri-green-dark flex items-center ${
                  location.pathname === link.path 
                    ? 'text-agri-green-dark' 
                    : 'text-agri-neutral-600'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            {/* User dropdown or login button */}
            {loading ? (
              // Show nothing while loading auth state
              <div className="w-10 h-10"></div>
            ) : currentUser ? (
              // Show user avatar and dropdown for logged in users
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-agri-blue text-white">
                        {userData?.displayName 
                          ? getInitials(userData.displayName) 
                          : currentUser.email?.substring(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {userData?.displayName || currentUser.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Show login/register buttons for non-logged in users
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <LogIn className="h-4 w-4" />
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-agri-neutral-700 hover:bg-agri-neutral-100 focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-md shadow-md">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-3 py-3 rounded-md text-base font-medium transition-colors duration-300 flex items-center ${
                location.pathname === link.path 
                  ? 'text-agri-green-dark bg-agri-green-light' 
                  : 'text-agri-neutral-600 hover:bg-agri-neutral-100'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          
          {/* Mobile profile and logout options */}
          {currentUser ? (
            <>
              <Link
                to="/profile"
                className="block px-3 py-3 rounded-md text-base font-medium text-agri-neutral-600 hover:bg-agri-neutral-100"
              >
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  <span>Profile</span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-3 py-3 rounded-md text-base font-medium text-agri-neutral-600 hover:bg-agri-neutral-100"
              >
                <div className="flex items-center">
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Log out</span>
                </div>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-3 rounded-md text-base font-medium text-agri-neutral-600 hover:bg-agri-neutral-100"
              >
                <div className="flex items-center">
                  <LogIn className="h-5 w-5 mr-2" />
                  <span>Log in</span>
                </div>
              </Link>
              <Link
                to="/register"
                className="block px-3 py-3 rounded-md text-base font-medium text-white bg-agri-blue hover:bg-agri-blue-dark"
              >
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
