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

const Layout = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Tailor Workspace', href: '/app/dashboard', icon: LayoutDashboard },
    { name: 'My Resumes', href: '/app/resume-manager', icon: FileText },
    { name: 'Applications', href: '/app/applications', icon: Zap },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 fixed w-full z-40 top-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center flex-1">
              <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                <div className="bg-emerald-600 p-1.5 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">AI<span className="text-emerald-600">ApplyMate</span></span>
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

            {/* Desktop - Back to Home */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors text-sm font-bold"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
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
              <Link
                to="/"
                className="w-full flex items-center gap-2 text-slate-500 hover:text-emerald-600 px-4 py-3 rounded-xl transition-colors text-sm font-bold"
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
