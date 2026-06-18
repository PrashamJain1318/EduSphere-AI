import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Bot,
  CalendarDays,
  FileQuestion,
  HelpCircle,
  Award,
  BookOpen,
  FolderLock,
  UserCheck,
  GraduationCap,
  Users,
  Trophy,
  Bookmark,
  Flame
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  const getStudentDashboardLink = () => {
    return user.class === '10' ? '/dashboard/class10' : '/dashboard/class12';
  };

  // Sidebar Links based on role
  const getLinks = () => {
    if (user.role === 'admin') {
      return [
        {
          name: 'Admin Panel',
          path: '/admin/dashboard',
          icon: <FolderLock className="h-5 w-5" />,
        },
        {
          name: 'Doubt Forum',
          path: '/forum',
          icon: <HelpCircle className="h-5 w-5" />,
        },
      ];
    }

    if (user.role === 'teacher') {
      return [
        {
          name: 'Teacher Dashboard',
          path: '/teacher/dashboard',
          icon: <UserCheck className="h-5 w-5" />,
        },
        {
          name: 'Doubt Forum',
          path: '/forum',
          icon: <HelpCircle className="h-5 w-5" />,
        },
      ];
    }

    // Default: Student links
    return [
      {
        name: `Class ${user.class} Dashboard`,
        path: getStudentDashboardLink(),
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        name: 'AI Doubt Assistant',
        path: '/ai-assistant',
        icon: <Bot className="h-5 w-5" />,
      },
      {
        name: 'AI Study Planner',
        path: '/ai-planner',
        icon: <CalendarDays className="h-5 w-5" />,
      },
      {
        name: 'Mock & AI Tests',
        path: '/mock-tests',
        icon: <FileQuestion className="h-5 w-5" />,
      },
      {
        name: 'Board Papers (PYQs)',
        path: '/papers',
        icon: <GraduationCap className="h-5 w-5" />,
      },
      {
        name: 'Watch Later',
        path: '/watch-later',
        icon: <Bookmark className="h-5 w-5" />,
      },
      {
        name: 'Revision Shorts',
        path: '/shorts-reels',
        icon: <Flame className="h-5 w-5" />,
      },
      {
        name: 'Study Groups',
        path: '/community',
        icon: <Users className="h-5 w-5" />,
      },
      {
        name: 'Scholarship Hub',
        path: '/scholarships',
        icon: <Trophy className="h-5 w-5" />,
      },
      {
        name: 'Doubt Forum',
        path: '/forum',
        icon: <HelpCircle className="h-5 w-5" />,
      },
      {
        name: 'Achievements',
        path: '/achievements',
        icon: <Award className="h-5 w-5" />,
      },
    ];
  };

  const links = getLinks();

  return (
    <aside className="w-64 hidden md:block glass-sidebar h-[calc(100vh-64px)] sticky top-16 p-4 border-r border-slate-200/50 dark:border-slate-800/50 shadow-sm">
      <div className="flex flex-col space-y-2">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Navigation
        </div>
        {links.map((link, idx) => (
          <NavLink
            key={idx}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-600/15'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400'
              }`
            }
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </div>

      {user.role === 'student' && (
        <div className="mt-8 p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-600/5 dark:to-indigo-600/5 rounded-2xl border border-blue-500/10 dark:border-blue-500/5">
          <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-semibold text-xs mb-1.5">
            <BookOpen className="h-4 w-4" />
            <span>Learning Stream</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Board: <strong>{user.board}</strong>
            {user.stream && (
              <>
                <br />
                Stream: <strong>{user.stream}</strong>
              </>
            )}
          </p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
