import React, { useState, useRef, useEffect } from 'react';
import {
    ChevronRight,
    Play,
    BookmarkPlus,
    Lightbulb,
    Target,
    CheckCircle2,
    MoreHorizontal,
    Upload,
    FileText,
    Clock,
    BarChart3,
    Search,
    Filter,
    ArrowLeft,
    GraduationCap,
    Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { examsApi } from '../lib/api';

const Analysis: React.FC = () => {
    const navigate = useNavigate();
    const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
    const [isUploading, setIsUploading] = useState(false);
    const [exams, setExams] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        examsApi.list().then(setExams).catch(console.error);
    }, []);

    // Handle file upload simulation
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            // Simulate upload delay
            setTimeout(() => {
                setIsUploading(false);
                setCurrentView('detail'); // Switch to analysis view after "upload"
            }, 1500);
        }
    };

    const handleExamClick = (examId: number) => {
        setCurrentView('detail');
    };

    // --- View 1: Exam List & Upload Landing ---
    if (currentView === 'list') {
        return (
            <div className="w-full h-full flex flex-col">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <nav className="flex text-sm text-slate-500 mb-2">
                            <span onClick={() => navigate('/library')} className="hover:text-primary cursor-pointer transition-colors">首页</span>
                            <span className="mx-2">/</span>
                            <span className="text-slate-900 dark:text-slate-200 font-medium">考卷分析</span>
                        </nav>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">智能考卷分析</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
                            上传试卷图片或 PDF，AI 将自动识别题目、分析考点分布，并生成个性化的专项提升方案。
                        </p>
                    </div>
                </div>

                {/* Upload Section */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="mb-10 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-card-dark hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group p-10 text-center relative overflow-hidden shadow-sm"
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                    />

                    {isUploading ? (
                        <div className="flex flex-col items-center justify-center py-4">
                            <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-primary animate-spin mb-4"></div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">正在上传并解析试卷...</h3>
                            <p className="text-sm text-slate-500 mt-2">AI 正在识别题型与考点结构</p>
                        </div>
                    ) : (
                        <div className="relative z-10 flex flex-col items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Upload size={40} className="text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">点击或拖拽上传试卷</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                                支持 JPG, PNG, PDF 格式。建议上传清晰的整页试卷，AI 助手将为您生成深度诊断报告。
                            </p>
                            <button className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium shadow-lg shadow-primary/25 hover:bg-primary-hover transition-colors flex items-center gap-2">
                                <Plus size={18} />
                                选择文件
                            </button>
                        </div>
                    )}
                </div>

                {/* Recent Exams List */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Clock size={20} className="text-slate-400" />
                            历年真题与记录
                        </h2>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                <input type="text" placeholder="搜索试卷..." className="pl-9 pr-4 py-2 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none" />
                            </div>
                            <button className="p-2 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:text-primary transition-colors">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam: any) => (
                            <div
                                key={exam.id}
                                onClick={() => handleExamClick(exam.id)}
                                className="group bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-primary hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <FileText size={20} />
                                    </div>
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${exam.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                        {exam.status === 'completed' ? '已分析' : '分析中'}
                                    </span>
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">{exam.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                                    <span>{exam.date}</span>
                                    {exam.status === 'completed' && <span className="font-medium text-slate-700 dark:text-slate-300">得分: {exam.score}</span>}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {exam.tags.map(tag => (
                                        <span key={tag} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // --- View 2: Detailed Analysis (Existing View) ---
    return (
        <div className="w-full">
            {/* Breadcrumb */}
            <div className="mb-8">
                <nav className="flex text-sm text-slate-500 mb-2">
                    <span onClick={() => navigate('/library')} className="hover:text-primary cursor-pointer transition-colors">首页</span>
                    <span className="mx-2">/</span>
                    <span onClick={() => setCurrentView('list')} className="hover:text-primary cursor-pointer transition-colors">历年真题</span>
                    <span className="mx-2">/</span>
                    <span className="text-slate-900 dark:text-slate-200">2023年高等数学期末模拟卷A</span>
                </nav>
                <div className="flex items-center gap-4">
                    <button onClick={() => setCurrentView('list')} className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">考卷分析 - 考点分类专项练习版</h1>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Sidebar: 考点指纹 */}
                <aside className="w-full lg:w-80 shrink-0 space-y-4">
                    <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">考点指纹</h2>
                            <span className="text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full">共 6 个核心考点</span>
                        </div>

                        <div className="space-y-2">
                            <TopicButton
                                title="洛必达法则"
                                count={3}
                                percent={15}
                                active
                                color="blue"
                            />
                            <TopicButton
                                title="泰勒公式展开"
                                count={2}
                                percent={10}
                            />
                            <TopicButton
                                title="三重积分计算"
                                count={4}
                                percent={20}
                            />
                            <TopicButton
                                title="线性方程组求解"
                                count={2}
                                percent={10}
                            />
                            <TopicButton
                                title="曲面切平面"
                                count={1}
                                percent={5}
                            />
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="text-xs text-slate-400 text-center mb-2">掌握程度预估</div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 mb-1">
                                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                                <span>基础</span>
                                <span className="font-medium text-blue-500">良好 (70%)</span>
                                <span>精通</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <section className="flex-1 w-full space-y-6">

                    {/* Header Card */}
                    <div className="bg-white dark:bg-card-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Target className="text-blue-500" size={24} />
                                当前考点：洛必达法则
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">该考点在试卷中共涉及 3 道题目，建议重点复习 0/0 型及 ∞/∞ 型极限。</p>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm shadow-blue-500/20">
                            <Play size={18} />
                            开始专项练习
                        </button>
                    </div>

                    {/* Questions List */}
                    <div className="space-y-6">

                        {/* Question 3 */}
                        <QuestionCard
                            title="题目 3"
                            mathContent={<>求极限：<span className="math-font">lim<sub>x→0</sub> (x - sin x) / x³</span></>}
                            hint="这是一个 0/0 型的未定式，可以直接使用洛必达法则，也可以尝试泰勒公式展开。注意 x → 0 时，sin x ≈ x - x³/6。"
                        />

                        {/* Question 8 */}
                        <QuestionCard
                            title="题目 8 (选择题)"
                            mathContent={
                                <>
                                    <p className="mb-4">若 <span className="math-font">lim<sub>x→∞</sub> ((x²+1)/(x+1) - ax - b) = 0</span>，则常数 <span className="math-font">a, b</span> 分别为：</p>
                                    <div className="space-y-2">
                                        <Option label="A" content="a=1, b=0" />
                                        <Option label="B" content="a=1, b=-1" />
                                        <Option label="C" content="a=0, b=1" />
                                        <Option label="D" content="a=-1, b=1" />
                                    </div>
                                </>
                            }
                            actionLabel="提交答案"
                        />

                        {/* Question 12 */}
                        <QuestionCard
                            title="题目 12"
                            mathContent={<>计算极限：<span className="math-font">lim<sub>x→0⁺</sub> x<sup>sin x</sup></span></>}
                        />

                    </div>
                </section>
            </div>
        </div>
    );
};

const TopicButton = ({ title, count, percent, active, color }: any) => (
    <button className={`w-full text-left p-3 rounded-lg flex items-center justify-between group transition-all ${active ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 shadow-sm' : 'hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}>
        <div>
            <div className={`font-medium ${active ? 'text-blue-900 dark:text-blue-100' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>{title}</div>
            <div className={`text-xs mt-1 ${active ? 'text-blue-600 dark:text-blue-300' : 'text-slate-400'}`}>出现 {count} 次 · 占比 {percent}%</div>
        </div>
        <ChevronRight className={`text-xl ${active ? 'text-blue-500' : 'text-slate-300 group-hover:text-slate-400'}`} size={20} />
    </button>
);

const QuestionCard = ({ title, mathContent, hint, actionLabel = "立即练习" }: any) => (
    <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6">
            <div className="flex justify-between items-start mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {title}
                </span>
                <div className="flex gap-2">
                    <button className="text-slate-400 hover:text-blue-500 p-1 transition-colors" title="添加到错题本">
                        <BookmarkPlus size={20} />
                    </button>
                </div>
            </div>
            <div className="text-slate-800 dark:text-slate-200 text-base leading-relaxed mb-6 font-serif">
                {mathContent}
            </div>
            {hint && (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
                        <Lightbulb size={16} />
                        <span>解题思路提示：</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {hint}
                    </p>
                </div>
            )}
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/30 px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium px-3 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                查看解析
            </button>
            <button className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 text-slate-700 dark:text-slate-200 text-sm font-medium px-4 py-1.5 rounded shadow-sm transition-colors">
                {actionLabel}
            </button>
        </div>
    </div>
);

const Option = ({ label, content }: any) => (
    <div className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer transition-colors group">
        <span className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400 font-medium group-hover:border-blue-500 group-hover:text-blue-500">
            {label}
        </span>
        <span className="text-slate-700 dark:text-slate-300 font-serif">{content}</span>
    </div>
);

export default Analysis;