import React from 'react';
import { NavLink } from 'react-router-dom';
import { Bell, Search, GraduationCap } from 'lucide-react';

export const TopNav: React.FC = () => {
  const navItems = [
    { name: '教材库', path: '/library' },
    { name: '考卷分析', path: '/analysis' }, 
    { name: '技巧库', path: '/skills' },
    { name: '错题本', path: '/problems' },
    { name: '深度学习', path: '/study' },
  ];

  return (
    <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <GraduationCap size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">MathMind AI</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary dark:text-blue-400'
                        : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-blue-400'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
               <NavLink to="/settings" className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}>
                  设置
               </NavLink>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">张伟</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">付费会员</p>
              </div>
              <img
                alt="User Avatar"
                className="h-9 w-9 rounded-full ring-2 ring-primary/20 object-cover"
                src="https://picsum.photos/id/64/100/100"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};