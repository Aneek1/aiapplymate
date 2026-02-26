import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Zap,
  Menu,
  X,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Tailor Workspace', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Resumes', href: '/resume-manager', icon: FileText },
    { name: 'Applications', href: '/applications', icon: Zap },
  ];

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 fixed w-full z-40 top-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center flex-1">
              <Link to="/dashboard" className="flex items-center gap-2 flex-shrink-0">
                <div className="bg-emerald-600 p-1.5 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">Tailor<span className="text-emerald-600">CV</span></span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex ml-10 space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-4 py-2 text-sm font-bold transition-all duration-200 rounded-xl ${isActive(item.href)
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs ring-2 ring-emerald-50">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-slate-900 leading-none">{user.fullName}</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">{user.subscription?.plan} Account</p>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors text-sm font-bold"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-4 animate-in slide-in-from-top-4 duration-200">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-colors ${isActive(item.href)
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100">
              {user && (
                <div className="flex items-center gap-3 px-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{user.fullName}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-red-500 bg-red-50 hover:bg-red-100 px-4 py-3 rounded-xl transition-colors text-sm font-bold"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        <div className="animate-in fade-in duration-700">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
