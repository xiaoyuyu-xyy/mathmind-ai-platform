import React, { useState, useMemo, useEffect } from 'react';
import {
    ArrowLeft,
    BookOpen,
    Share2,
    MoreHorizontal,
    Play,
    CheckCircle2,
    Circle,
    Lock,
    Network,
    FileText,
    GraduationCap,
    ChevronDown,
    ChevronRight,
    BrainCircuit,
    PieChart,
    Sparkles
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { chaptersApi } from '../lib/api';

// --- Types ---
type Concept = { title: string; status: 'mastered' | 'learning' | 'pending' };
type Chapter = { title: string; progress: number; mastered?: boolean; locked?: boolean; expanded?: boolean; concepts?: Concept[] };



const BookDetail: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const book = location.state?.book || {
        id: 0,
        title: "未知教材",
        author: "未知作者",
        coverUrl: "https://picsum.photos/id/24/300/400"
    };

    const [activeTab, setActiveTab] = useState<'structure' | 'graph' | 'exercises'>('structure');

    const [apiChapters, setApiChapters] = useState<Chapter[] | null>(null);

    // Try to load chapters from API
    useEffect(() => {
        if (book.id) {
            chaptersApi.list(book.id)
                .then(data => { if (data && data.length > 0) setApiChapters(data as Chapter[]); })
                .catch(console.error);
        }
    }, [book.id]);

    // Use API data if available, otherwise generate generic structure
    const chapters = useMemo(() => {
        if (apiChapters) return apiChapters;

        // Fallback: Simulate AI generated structure for new uploads
        return [
            {
                title: "绪论与基础定义",
                progress: 0,
                expanded: true,
                concepts: [
                    { title: `${book.title} 的核心概念`, status: 'pending' as const },
                    { title: "基本术语界定", status: 'pending' as const },
                    { title: "学科发展背景", status: 'pending' as const }
                ]
            },
            {
                title: "第一章：基础理论框架",
                progress: 0,
                concepts: [
                    { title: "原理一：基础假设", status: 'pending' as const },
                    { title: "原理二：推导过程", status: 'pending' as const }
                ]
            },
            { title: "第二章：核心方法论", progress: 0, locked: true },
            { title: "第三章：进阶应用", progress: 0, locked: true },
            { title: "第四章：综合案例分析", progress: 0, locked: true },
        ] as Chapter[];
    }, [apiChapters, book.title]);

    const handleStartLearning = () => {
        // Navigate to StudyView with the file URL if available
        navigate('/study', { state: { fileUrl: book.fileUrl } });
    };

    const totalConcepts = chapters.reduce((acc, chap) => acc + (chap.concepts?.length || 0), 0) + (chapters.length * 3); // Estimate hidden concepts
    const completedConcepts = chapters.reduce((acc, chap) => acc + (chap.concepts?.filter(c => c.status === 'mastered').length || 0), 0);
    const percent = Math.round((completedConcepts / Math.max(totalConcepts, 1)) * 100);

    return (
        <div className="w-full flex flex-col h-[calc(100vh-8rem)]">
            {/* Header / Breadcrumb */}
            <div className="mb-6">
                <nav className="flex text-sm text-slate-500 mb-2">
                    <span onClick={() => navigate('/library')} className="hover:text-primary cursor-pointer transition-colors">教材库</span>
                    <span className="mx-2">/</span>
                    <span className="text-slate-900 dark:text-slate-200 font-medium">{book.title}</span>
                </nav>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/library')} className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {book.title}
                            {!apiChapters && (
                                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20 flex items-center gap-1">
                                    <Sparkles size={12} />
                                    AI 已解析结构
                                </span>
                            )}
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                            <Share2 size={18} />
                        </button>
                        <button
                            onClick={handleStartLearning}
                            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover shadow-lg shadow-primary/20 flex items-center gap-2"
                        >
                            <Play size={18} />
                            {book.progress > 0 ? '继续学习' : '开始阅读'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
                {/* Left Sidebar: Book Info & Progress */}
                <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-6 overflow-y-auto pb-8">
                    <div className="bg-white dark:bg-card-dark rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                        <div className="w-32 mx-auto aspect-[3/4] mb-4 shadow-xl rounded-md overflow-hidden relative group">
                            <img src={book.coverUrl} className="w-full h-full object-cover" alt="Book Cover" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">{book.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{book.author}</p>
                        <div className="flex items-center justify-center gap-4 text-sm border-t border-slate-100 dark:border-slate-800 pt-4">
                            <div className="text-center">
                                <div className="font-bold text-slate-900 dark:text-white">{chapters.length}</div>
                                <div className="text-xs text-slate-500">章节</div>
                            </div>
                            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                            <div className="text-center">
                                <div className="font-bold text-slate-900 dark:text-white">{totalConcepts}</div>
                                <div className="text-xs text-slate-500">考点</div>
                            </div>
                            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                            <div className="text-center">
                                <div className={`font-bold ${percent > 0 ? 'text-green-500' : 'text-slate-400'}`}>{percent}%</div>
                                <div className="text-xs text-slate-500">掌握度</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-card-dark rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <PieChart size={16} className="text-primary" />
                            学习状态
                        </h3>
                        <div className="space-y-4">
                            <StatusRow label="已掌握" count={completedConcepts} total={totalConcepts} color="bg-green-500" />
                            <StatusRow label="学习中" count={chapters.length} total={totalConcepts} color="bg-amber-500" />
                            <StatusRow label="未开始" count={totalConcepts - completedConcepts - chapters.length} total={totalConcepts} color="bg-slate-300 dark:bg-slate-600" />
                        </div>
                    </div>
                </aside>

                {/* Right Main Content */}
                <main className="flex-1 bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-200 dark:border-slate-700">
                        <TabButton
                            active={activeTab === 'structure'}
                            onClick={() => setActiveTab('structure')}
                            icon={<BookOpen size={18} />}
                            label="知识目录"
                        />
                        <TabButton
                            active={activeTab === 'graph'}
                            onClick={() => setActiveTab('graph')}
                            icon={<Network size={18} />}
                            label="知识图谱"
                        />
                        <TabButton
                            active={activeTab === 'exercises'}
                            onClick={() => setActiveTab('exercises')}
                            icon={<FileText size={18} />}
                            label="配套习题"
                        />
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-background-dark/50">

                        {activeTab === 'structure' && (
                            <div className="space-y-4 max-w-4xl mx-auto">
                                {!apiChapters && (
                                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg p-4 mb-6 flex items-start gap-3">
                                        <Sparkles className="text-primary mt-1 flex-shrink-0" size={18} />
                                        <div>
                                            <h4 className="font-medium text-slate-900 dark:text-white text-sm">AI 已自动生成知识结构</h4>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                                系统已分析您上传的教材目录，并构建了以下学习路径。您可以点击“开始阅读”进入教材原文，或点击具体知识点进行针对性学习。
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {chapters.map((chapter, index) => (
                                    <ChapterItem
                                        key={index}
                                        index={index + 1}
                                        title={chapter.title}
                                        progress={chapter.progress}
                                        mastered={chapter.mastered}
                                        locked={chapter.locked}
                                        expanded={chapter.expanded}
                                    >
                                        {chapter.concepts?.map((concept, cIndex) => (
                                            <ConceptItem key={cIndex} title={concept.title} status={concept.status} />
                                        ))}
                                    </ChapterItem>
                                ))}
                            </div>
                        )}

                        {activeTab === 'graph' && (
                            <div className="h-full flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-card-dark">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 animate-pulse">
                                    <BrainCircuit size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">知识图谱生成中...</h3>
                                <p className="text-slate-500 max-w-md">
                                    AI 正在分析全书 {totalConcepts} 个考点的逻辑引用关系。图谱将展示前驱知识点与后继应用，帮助您建立立体化的数学思维。
                                </p>
                            </div>
                        )}

                        {activeTab === 'exercises' && (
                            <div className="space-y-6 max-w-4xl mx-auto">
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex gap-4 items-start">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg text-blue-600 dark:text-blue-200">
                                        <GraduationCap size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">智能推荐习题</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                                            根据您在当前章节的学习进度，重点推荐以下 5 道强化训练题。
                                        </p>
                                        <button onClick={() => navigate('/study')} className="mt-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">开始专属训练</button>
                                    </div>
                                </div>

                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mt-8 mb-4">按章节练习</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {chapters.map((chapter, index) => (
                                        <ExerciseCard
                                            key={index}
                                            title={`第${index + 1}章：${chapter.title}`}
                                            count={Math.floor(Math.random() * 30) + 20}
                                            done={Math.floor(Math.random() * 10)}
                                            locked={chapter.locked}
                                            active={!chapter.locked && index === 0}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </main>
            </div>
        </div>
    );
};

// ... other components (StatusRow, TabButton, ChapterItem)

const StatusRow = ({ label, count, total, color }: any) => {
    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-300">{label}</span>
                <span className="text-slate-500">{count}/{total} ({percent}%)</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${active ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
    >
        {icon}
        {label}
    </button>
);

const ChapterItem = ({ index, title, progress, mastered, locked, expanded, children }: any) => {
    const [isOpen, setIsOpen] = useState(expanded || false);

    return (
        <div className={`bg-white dark:bg-card-dark border ${isOpen ? 'border-primary/30 ring-1 ring-primary/10' : 'border-slate-200 dark:border-slate-700'} rounded-xl overflow-hidden transition-all`}>
            <div
                onClick={() => !locked && setIsOpen(!isOpen)}
                className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${locked ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${mastered ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : locked ? 'bg-slate-100 text-slate-400 dark:bg-slate-800' : 'bg-primary/10 text-primary'}`}>
                    {mastered ? <CheckCircle2 size={18} /> : locked ? <Lock size={16} /> : index}
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-slate-900 dark:text-white">第{index}章 {title}</h4>
                        {progress > 0 && <span className="text-xs font-mono text-slate-500">{progress}%</span>}
                    </div>
                    {!locked && (
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${mastered ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${progress}%` }}></div>
                        </div>
                    )}
                </div>

                {!locked && (
                    <ChevronDown size={20} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                )}
            </div>

            {isOpen && children && (
                <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 p-2 space-y-1">
                    {children}
                </div>
            )}
        </div>
    );
};

// Updated ConceptItem with React.FC to handle props correctly
const ConceptItem: React.FC<{ title: string; status: 'mastered' | 'learning' | 'pending' }> = ({ title, status }) => {
    const navigate = useNavigate();

    // Map status to visual styles
    const config = {
        mastered: { icon: CheckCircle2, color: 'text-green-500', bg: 'hover:bg-green-50 dark:hover:bg-green-900/20' },
        learning: { icon: Play, color: 'text-primary', bg: 'hover:bg-blue-50 dark:hover:bg-blue-900/20' },
        pending: { icon: Circle, color: 'text-slate-300', bg: 'hover:bg-slate-100 dark:hover:bg-slate-800' }
    };

    const style = config[status];
    const Icon = style.icon;

    return (
        <div className={`flex items-center justify-between p-3 rounded-lg cursor-pointer group transition-colors ${style.bg}`}>
            <div className="flex items-center gap-3">
                <Icon size={16} className={style.color} />
                <span className={`text-sm ${status === 'mastered' ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-700 dark:text-slate-200'}`}>
                    {title}
                </span>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {status !== 'mastered' && (
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate('/study'); }}
                        className="text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2 py-1 rounded hover:text-primary hover:border-primary transition-colors"
                    >
                        开始学习
                    </button>
                )}
                <button className="text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2 py-1 rounded hover:text-primary hover:border-primary transition-colors">
                    练习
                </button>
            </div>
        </div>
    );
};

const ExerciseCard = ({ title, count, done, active, locked }: any) => (
    <div className={`p-4 rounded-xl border flex flex-col justify-between h-32 relative overflow-hidden group transition-all ${active ? 'bg-white dark:bg-card-dark border-primary shadow-md' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}>
        <div>
            <h5 className={`font-bold mb-1 ${active ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{title}</h5>
            <div className="text-xs text-slate-500">共 {count} 题 · 已完成 {done}</div>
        </div>

        {locked ? (
            <Lock className="text-slate-300 absolute bottom-4 right-4" size={24} />
        ) : (
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-4">
                <div className="bg-green-500 h-full" style={{ width: `${count > 0 ? (done / count) * 100 : 0}%` }}></div>
            </div>
        )}

        {!locked && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                <span className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
                    {active ? '继续练习' : '开始练习'}
                </span>
            </div>
        )}
    </div>
);

export default BookDetail;