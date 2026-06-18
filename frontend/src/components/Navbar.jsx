import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice.js';
import { Sun, Moon, LogOut, Flame, Trophy, Award, BookOpen, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'teacher') return '/teacher/dashboard';
    return user.class === '10' ? '/dashboard/class10' : '/dashboard/class12';
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-card border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
              <BookOpen className="h-6 w-6" />
              <span>EduSphere <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">AI</span></span>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-blue-500">Home</Link>
            <Link to="/forum" className="text-sm font-medium hover:text-blue-500">Doubt Forum</Link>

            {isAuthenticated && user && (
              <>
                <Link to={getDashboardLink()} className="text-sm font-medium text-indigo-500 dark:text-indigo-400 hover:underline">
                  Dashboard
                </Link>

                {/* Gamification Stats */}
                {user.role === 'student' && (
                  <div className="flex items-center space-x-4 bg-slate-100/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-200/40 dark:border-slate-700/40">
                    <div className="flex items-center text-amber-500 font-bold text-xs" title="Daily Streak">
                      <Flame className="h-4 w-4 mr-0.5 fill-current" />
                      <span>{user.streak || 0} Days</span>
                    </div>
                    <div className="flex items-center text-blue-500 font-bold text-xs" title="XP Points">
                      <Trophy className="h-4 w-4 mr-0.5" />
                      <span>{user.xp || 0} XP</span>
                    </div>
                    {user.badges && user.badges.length > 0 && (
                      <div className="flex items-center text-indigo-500 font-bold text-xs" title={`${user.badges.length} Badges Earned`}>
                        <Award className="h-4 w-4 mr-0.5" />
                        <span>{user.badges.length} Badges</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Light/Dark Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold border-l pl-4 border-slate-300 dark:border-slate-700">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-md transition-all"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-sm font-medium hover:text-blue-500">Login</Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-t border-slate-200/50 dark:border-slate-800/50 px-4 pt-2 pb-4 space-y-3">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium">Home</Link>
          <Link to="/forum" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium">Doubt Forum</Link>
          
          {isAuthenticated && user && (
            <>
              <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium text-indigo-500">
                Dashboard
              </Link>
              {user.role === 'student' && (
                <div className="flex items-center space-x-4 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                  <div className="flex items-center text-amber-500 font-bold text-xs">
                    <Flame className="h-4 w-4 mr-0.5 fill-current" />
                    <span>{user.streak || 0} Days</span>
                  </div>
                  <div className="flex items-center text-blue-500 font-bold text-xs">
                    <Trophy className="h-4 w-4 mr-0.5" />
                    <span>{user.xp || 0} XP</span>
                  </div>
                  <div className="flex items-center text-indigo-500 font-bold text-xs">
                    <Award className="h-4 w-4 mr-0.5" />
                    <span>{user.badges?.length || 0} Badges</span>
                  </div>
                </div>
              )}
            </>
          )}

          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="px-3 py-1.5 text-xs text-slate-500">Logged in as: <strong>{user.name}</strong></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md text-sm font-semibold shadow-md"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2 flex flex-col">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center px-4 py-2 border rounded-md text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium shadow-md"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
