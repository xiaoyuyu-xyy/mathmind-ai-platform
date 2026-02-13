import React from 'react';
import { 
  Calculator, 
  Search, 
  Bell, 
  CheckSquare, 
  Filter, 
  Printer,
  FileText,
  FileType,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';

const ProblemSet: React.FC = () => {
  return (
    <div className="flex h-full overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 scroll-smooth">
            
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">我的错题本</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">共找到 124 个题目，已选择 <span className="text-primary font-medium">3</span> 个</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <FilterDropdown label="筛选" options={['全部难度', '简单', '中等', '困难']} />
                    <FilterDropdown label="来源" options={['全部来源', '错题集', 'AI 变式']} />
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors ml-auto md:ml-0">
                        <CheckSquare size={18} />
                        全选当前页
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                <ProblemCard 
                    id="#9821" 
                    badges={[{text: '困难', color: 'red'}, {text: '错题', color: 'blue'}]}
                    date="2023-10-24"
                    content={<>已知函数 <span className="math-font">f(x) = ln x - ax</span> 在区间 <span className="math-font">(1, 2)</span> 上单调递增，求实数 <span className="math-font">a</span> 的取值范围。</>}
                    tags={['导数应用', '单调性']}
                />
                 <ProblemCard 
                    id="AI-8820" 
                    badges={[{text: 'AI 变式', color: 'purple', icon: <Sparkles size={12} />}, {text: '中等', color: 'green'}]}
                    date="刚刚"
                    content={<>若函数 <span className="math-font">g(x) = x³ - 3bx + 1</span> 在 <span className="math-font">x=1</span> 处取得极值，求 <span className="math-font">b</span> 的值。</>}
                    tags={['极值点', '多项式函数']}
                />
                 <ProblemCard 
                    id="#9823" 
                    badges={[{text: '困难', color: 'red'}, {text: '错题', color: 'blue'}]}
                    date="昨天"
                    content={<>在 <span className="math-font">△ABC</span> 中，已知 <span className="math-font">A = π/3</span>，<span className="math-font">b=4</span>，<span className="math-font">△ABC</span> 的面积为 <span className="math-font">4√3</span>，求 <span className="math-font">c</span> 的值。</>}
                    tags={['余弦定理', '三角形面积']}
                />
                 <ProblemCard 
                    id="AI-5521" 
                    badges={[{text: 'AI 变式', color: 'purple', icon: <Sparkles size={12} />}, {text: '中等', color: 'green'}]}
                    date="3天前"
                    content={<>数列 <span className="math-font">{"{aₙ}"}</span> 满足 <span className="math-font">a₁=1</span>, <span className="math-font">aₙ₊₁ = 2aₙ + 1</span>，求通项公式 <span className="math-font">aₙ</span>。</>}
                    tags={['数列递推', '等比数列']}
                    unchecked
                />
            </div>

        </div>

        {/* Right Sidebar */}
        <aside className="w-80 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark flex flex-col shrink-0 z-10 shadow-xl">
             <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Printer className="text-primary" size={20} />
                    导出设置
                </h3>
                <p className="text-xs text-gray-500 mt-1">配置您的错题本格式</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                 {/* Summary */}
                 <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-primary">已选择题目</span>
                        <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">3</span>
                    </div>
                    <p className="text-xs text-primary/70">
                        包含 2 道错题，1 道 AI 变式题。预计生成 2 页。
                    </p>
                </div>

                {/* Format */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-3">文件格式</label>
                    <div className="grid grid-cols-2 gap-3">
                         <label className="cursor-pointer">
                            <input type="radio" name="format" className="peer sr-only" defaultChecked />
                            <div className="flex flex-col items-center justify-center p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-background-dark peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                                <FileText className="text-blue-600 mb-1" size={24} />
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Word 文档</span>
                            </div>
                        </label>
                         <label className="cursor-pointer">
                            <input type="radio" name="format" className="peer sr-only" />
                            <div className="flex flex-col items-center justify-center p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-background-dark peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                                <FileType className="text-red-500 mb-1" size={24} />
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">PDF 文件</span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Options */}
                <div className="space-y-4">
                     <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200">排版选项</label>
                     <ToggleRow label="包含详细解析" />
                     <ToggleRow label="包含答案速查表" defaultChecked />
                     <ToggleRow label="预留手写空间" subLabel="每题下方留空 5cm" defaultChecked />
                </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-surface-dark/20">
                <button className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                    <Printer size={20} />
                    开始导出 (3题)
                </button>
            </div>
        </aside>
    </div>
  );
};

const FilterDropdown = ({ label, options }: any) => (
    <div className="flex items-center gap-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 shadow-sm">
        <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">{label}:</span>
        <select className="bg-transparent border-none text-sm text-gray-700 dark:text-gray-200 focus:ring-0 cursor-pointer py-1 pr-2 outline-none">
            {options.map((opt: string) => <option key={opt}>{opt}</option>)}
        </select>
    </div>
);

const ProblemCard = ({ id, badges, date, content, tags, unchecked }: any) => (
    <div className={`group relative bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-primary transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/5 ${unchecked ? 'opacity-80 hover:opacity-100' : ''}`}>
        <div className="absolute top-4 right-4 z-10">
            <input type="checkbox" defaultChecked={!unchecked} className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary bg-gray-100 dark:bg-gray-800 cursor-pointer" />
        </div>
        <div className="p-6">
            <div className="flex gap-2 mb-4">
                {badges.map((b: any, i: number) => (
                    <span key={i} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        b.color === 'red' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        b.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        b.color === 'purple' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                        {b.icon && <span className="mr-1">{b.icon}</span>}
                        {b.text}
                    </span>
                ))}
                <span className="text-xs text-gray-400 flex items-center ml-auto">
                    <Clock size={14} className="mr-1" /> {date}
                </span>
            </div>
            <div className="prose dark:prose-invert max-w-none mb-4">
                <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed font-serif">
                    {content}
                </p>
            </div>
            <div className="bg-background-light dark:bg-background-dark rounded-lg p-3 mt-4 border border-gray-100 dark:border-gray-700/50">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">关键知识点</p>
                <div className="flex flex-wrap gap-2">
                    {tags.map((t: string) => (
                        <span key={t} className="text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-surface-dark px-2 py-1 rounded border border-gray-200 dark:border-gray-700">{t}</span>
                    ))}
                </div>
            </div>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-background-dark/30 rounded-b-xl">
            <span className="text-xs text-gray-400">ID: {id}</span>
            <button className="text-xs text-primary hover:text-blue-400 font-medium flex items-center">
                查看解析 <ArrowRight size={14} className="ml-1" />
            </button>
        </div>
    </div>
);

const ToggleRow = ({ label, subLabel, defaultChecked }: any) => (
    <div className="flex items-center justify-between">
        <div className="flex flex-col">
            <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
            {subLabel && <span className="text-[10px] text-gray-400 dark:text-gray-500">{subLabel}</span>}
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
        </label>
    </div>
);

export default ProblemSet;