import React, { useState } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import Library from './pages/Library';
import Settings from './pages/Settings';
import StudyView from './pages/StudyView';
import ProblemSet from './pages/ProblemSet';
import Analysis from './pages/Analysis';
import Skills from './pages/Skills';
import BookDetail from './pages/BookDetail';
import { Menu, X } from 'lucide-react';

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  // Determine layout type based on path
  const isSidebarLayout = ['/settings', '/problems'].includes(location.pathname);
  const isStudyLayout = location.pathname === '/study';
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isStudyLayout) {
    return <div className="h-screen w-full overflow-hidden flex flex-col">{children}</div>;
  }

  if (isSidebarLayout) {
    return (
      <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden fixed top-4 left-4 z-50">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-card-dark rounded-lg border border-slate-700">
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
        </div>

        <div className={`${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform fixed md:relative z-40 h-full`}>
            <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto w-full md:w-auto">
          {children}
        </main>
      </div>
    );
  }

  // Default TopNav Layout (Library, Analysis, Skills, BookDetail)
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex flex-col">
      <TopNav />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/library" replace />} />
          <Route path="/library" element={<Library />} />
          <Route path="/library/:bookId" element={<BookDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/study" element={<StudyView />} />
          <Route path="/problems" element={<ProblemSet />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/skills" element={<Skills />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;