import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  Database, 
  ShieldCheck, 
  BookOpen, 
  Calculator,
  LineChart
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <nav className="w-64 h-full bg-white dark:bg-card-dark border-r border-slate-200 dark:border-slate-800 flex flex-col flex-shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold">
          M
        </div>
        <span className="text-xl font-bold tracking-tight">MathMind AI</span>
      </div>

      <div className="px-4 py-2">
        <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3 px-2">主要设置</h3>
        <ul className="space-y-1">
          <li>
            <NavLink to="/library" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <LayoutDashboard size={20} />
              <span>返回图书馆</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/settings" 
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary dark:text-white dark:bg-primary font-medium' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <Settings size={20} />
              <span>AI 引擎配置</span>
            </NavLink>
          </li>
           <li>
            <NavLink 
              to="/problems" 
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary dark:text-white dark:bg-primary font-medium' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <Calculator size={20} />
              <span>题目管理</span>
            </NavLink>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Database size={20} />
              <span>数据集管理</span>
            </a>
          </li>
           <li>
            <NavLink 
              to="/analysis" 
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary dark:text-white dark:bg-primary font-medium' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <LineChart size={20} />
              <span>分析报告</span>
            </NavLink>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ShieldCheck size={20} />
              <span>API 安全</span>
            </a>
          </li>
        </ul>
      </div>

      <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <img
            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-800"
            src="https://picsum.photos/id/64/100/100"
            alt="User avatar"
          />
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-slate-500">Pro License</p>
          </div>
        </div>
      </div>
    </nav>
  );
};