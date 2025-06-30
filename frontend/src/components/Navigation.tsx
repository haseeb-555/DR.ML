
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, Brain, Droplets, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Alzheimer', path: '/alzheimer', icon: Brain },
    { name: 'Brain', path: '/brain', icon: Brain },
    { name: 'Heart', path: '/heart', icon: Heart },
    { name: 'Kidney', path: '/kidney', icon: Droplets },
    { name: 'History', path: '/history' },
    { name: 'Contact', path: '/contact' }
  ];

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-medical-blue to-medical-purple rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white animate-heartbeat" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-medical-blue to-medical-purple bg-clip-text text-transparent">
                DR.ML
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors ${
                    location.pathname === item.path
                      ? 'bg-medical-blue text-white'
                      : 'text-gray-700 hover:text-medical-blue hover:bg-gray-50'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {user ? (
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-sm text-gray-600">
                  {user.email}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                size="sm"
                className="ml-4"
              >
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </div>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-medical-blue"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 ${
                      location.pathname === item.path
                        ? 'bg-medical-blue text-white'
                        : 'text-gray-700 hover:text-medical-blue hover:bg-gray-50'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {user ? (
                <div className="pt-2 border-t border-gray-200">
                  <div className="px-3 py-2 text-sm text-gray-600">
                    {user.email}
                  </div>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    navigate('/auth');
                    setIsOpen(false);
                  }}
                  size="sm"
                  className="w-full mt-2"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
