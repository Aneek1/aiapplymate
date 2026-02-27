import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Zap,
  Menu,
  X,
  Home
} from 'lucide-react';
import ThemeCustomizer from '@/components/ThemeCustomizer';
import { useTheme } from '@/contexts/ThemeContext';

const Layout = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { resolvedMode } = useTheme();
  const dark = resolvedMode === 'dark';

  const navigation = [
    { name: 'Tailor Workspace', href: '/app/dashboard', icon: LayoutDashboard },
    { name: 'My Resumes', href: '/app/resume-manager', icon: FileText },
    { name: 'Applications', href: '/app/applications', icon: Zap },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`min-h-screen ${dark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Top Navigation */}
      <nav className={`${dark ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200'} backdrop-blur-md border-b fixed w-full z-40 top-0`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center flex-1">
              <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                <div className="bg-primary p-1.5 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xl font-extrabold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>AI<span className="text-primary">ApplyMate</span></span>
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
                        ? dark ? 'bg-primary/15 text-primary' : 'bg-primary/10 text-primary'
                        : dark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Desktop - Theme + Home */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeCustomizer />
              <Link
                to="/"
                className={`flex items-center gap-2 transition-colors text-sm font-bold ${dark ? 'text-slate-400 hover:text-primary' : 'text-slate-500 hover:text-primary'}`}
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeCustomizer />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-xl transition-colors ${dark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}
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
          <div className={`md:hidden border-t p-4 space-y-4 animate-in slide-in-from-top-4 duration-200 ${dark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-colors ${isActive(item.href)
                      ? dark ? 'bg-primary/15 text-primary' : 'bg-primary/10 text-primary'
                      : dark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className={`pt-4 border-t ${dark ? 'border-slate-700' : 'border-slate-100'}`}>
              <Link
                to="/"
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl transition-colors text-sm font-bold ${dark ? 'text-slate-400 hover:text-primary' : 'text-slate-500 hover:text-primary'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
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
