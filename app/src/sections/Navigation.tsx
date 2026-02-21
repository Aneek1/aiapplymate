import { useState } from 'react'
import { Menu, X, Zap, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/AuthContext'
import type { View } from '../App'

interface NavigationProps {
  currentView: View
  setCurrentView: (view: View) => void
  onLoginClick: () => void
  onRegisterClick: () => void
  onLogout: () => void
  scrolled: boolean
}

const Navigation = ({ 
  currentView, 
  setCurrentView, 
  onLoginClick,
  onRegisterClick,
  onLogout, 
  scrolled 
}: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated, user } = useAuth()

  const navItems = isAuthenticated ? [
    { label: 'Dashboard', view: 'dashboard' as View },
    { label: 'Resume', view: 'resume' as View },
    { label: 'Preferences', view: 'preferences' as View },
    { label: 'Tracker', view: 'tracker' as View },
  ] : [
    { label: 'Features', view: 'home' as View },
    { label: 'Testimonials', view: 'home' as View },
    { label: 'FAQ', view: 'home' as View },
  ]

  const handleNavClick = (view: View) => {
    setCurrentView(view)
    setMobileMenuOpen(false)
    if (view === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleLogoutClick = () => {
    onLogout()
    setMobileMenuOpen(false)
  }

  // Get user initials for avatar
  const getInitials = () => {
    if (!user) return 'U'
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-lg shadow-soft' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavClick('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">AutoApply</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.view)}
                className={`nav-link ${currentView === item.view ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                      {getInitials()}
                    </div>
                    <span className="font-medium">{user?.firstName || 'User'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setCurrentView('dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentView('resume')}>
                    My Resume
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentView('preferences')}>
                    Preferences
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogoutClick} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={onLoginClick}
                  className="font-medium"
                >
                  Log in
                </Button>
                <Button 
                  onClick={onRegisterClick}
                  className="btn-primary"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-down">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.view)}
                  className="px-4 py-3 text-left font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-colors"
                >
                  {item.label}
                </button>
              ))}
              {!isAuthenticated && (
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    onClick={onLoginClick}
                    className="w-full"
                  >
                    Log in
                  </Button>
                  <Button 
                    onClick={onRegisterClick}
                    className="btn-primary w-full"
                  >
                    Get Started
                  </Button>
                </div>
              )}
              {isAuthenticated && (
                <button
                  onClick={handleLogoutClick}
                  className="px-4 py-3 text-left font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-4 pt-4 border-t border-gray-100"
                >
                  <LogOut className="w-4 h-4 inline mr-2" />
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
