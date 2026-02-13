import React from 'react';
import { 
  Search, 
  Sparkles, 
  Lightbulb, 
  Bookmark, 
  LineChart, 
  Brain, 
  TrendingUp, 
  Clock, 
  Star, 
  AlertCircle, 
  PlusCircle, 
  LayoutGrid, 
  List, 
  ChevronDown
} from 'lucide-react';

const Skills: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row gap-8 h-full">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8">
        {/* Progress Card */}
        <div className="bg-white dark:bg-surface-dark rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">你的进度</h3>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-700 dark:text-slate-200">已掌握技巧</span>
                        <span className="text-primary font-bold">24/50</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: '48%' }}></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-700 dark:text-slate-200">诊断准确率</span>
                        <span className="text-green-500 font-bold">92%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Recent Insights */}
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">最近洞察</h3>
            
            <a href="#" className="block p-4 rounded-xl bg-white dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-slate-200 dark:border-slate-800 transition-all group">
                <div className="flex items-start gap-3">
                    <Sparkles className="text-primary mt-0.5" size={20} />
                    <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">分部积分法</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">AI 在你最近 3 次错误中检测到了某种模式。</p>
                    </div>
                </div>
            </a>

            <a href="#" className="block p-4 rounded-xl bg-white dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-slate-200 dark:border-slate-800 transition-all group">
                <div className="flex items-start gap-3">
                    <Lightbulb className="text-amber-500 mt-0.5" size={20} />
                    <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">特征值速算法</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">建议用于线性代数复习。</p>
                    </div>
                </div>
            </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-6 min-w-0">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">解题技巧库</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2">
                    <Brain size={18} />
                    基于你解题历史的 AI 精选策略。
                </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-surface-dark p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <button className="p-2 rounded bg-white dark:bg-slate-700 shadow-sm text-primary">
                    <LayoutGrid size={20} />
                </button>
                <button className="p-2 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors">
                    <List size={20} />
                </button>
            </div>
        </header>

        {/* Search & Filter */}
        <section className="sticky top-20 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm py-2 -mx-2 px-2">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm text-slate-900 dark:text-white placeholder-slate-400" 
                        placeholder="搜索定理、公式或方法..." 
                        type="text"
                    />
                    <div className="absolute right-3 top-2.5 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 font-mono">
                        CMD+K
                    </div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide no-scrollbar">
                    <FilterTab label="所有学科" active />
                    <FilterTab label="微积分" />
                    <FilterTab label="线性代数" />
                    <FilterTab label="概率论" />
                    <FilterTab label="最优化" />
                </div>
            </div>
        </section>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
            
            {/* Card 1: Taylor */}
            <SkillCard 
                category="微积分 II"
                color="blue"
                title="泰勒级数展开"
                desc="利用多项式逼近函数。"
                formula={<>f(x) = ∑<span className="text-xs align-super">∞</span><span className="text-xs align-sub">n=0</span> <span className="inline-block text-center mx-1"><span className="block border-b border-current leading-none text-xs">f<sup>(n)</sup>(a)</span><span className="block leading-none text-xs">n!</span></span>(x - a)<sup>n</sup></>}
                steps={['求 a 点的导数', '代入公式计算']}
                stats="已在 12 道题中使用"
            />

            {/* Card 2: L'Hopital */}
            <SkillCard 
                category="极限"
                color="amber"
                title="洛必达法则"
                desc="解决 0/0 等不定式极限问题。"
                formula={<>lim<span className="text-xs align-sub">x→a</span> <span className="inline-block text-center mx-1"><span className="block border-b border-current leading-none text-xs">f(x)</span><span className="block leading-none text-xs">g(x)</span></span> = lim<span className="text-xs align-sub">x→a</span> <span className="inline-block text-center mx-1"><span className="block border-b border-current leading-none text-xs">f'(x)</span><span className="block leading-none text-xs">g'(x)</span></span></>}
                aiAdvice="在习题集 #4 出错后建议"
                status="高度掌握"
                statusIcon={<TrendingUp size={16} className="text-amber-500" />}
                ping
            />

            {/* Card 3: Eigenvalues */}
            <SkillCard 
                category="线性代数"
                color="purple"
                title="特征值与特征向量"
                desc="确定矩阵的不变方向。"
                formula={<>Av = λv<div className="mt-2 text-xs text-slate-500">det(A - λI) = 0</div></>}
                steps={['计算特征多项式', '求根得到特征值']}
                lastReview="上次复习于 2 天前"
                lastReviewIcon={<Clock size={16} className="text-slate-400" />}
            />

            {/* Card 4: Gradient Descent */}
            <SkillCard 
                category="最优化"
                color="emerald"
                title="梯度下降法"
                desc="迭代优化算法。"
                formula={<>x<sub>n+1</sub> = x<sub>n</sub> − γ∇F(x<sub>n</sub>)</>}
                aiAdvice="即将到来的考试中的高频考点"
                aiIcon={<Star size={16} className="text-primary" />}
                stats="已在 8 道题中使用"
            />

            {/* Card 5: Bayes */}
            <SkillCard 
                category="统计学"
                color="pink"
                title="贝叶斯定理"
                desc="基于先验条件计算事件概率。"
                formula={<>P(A|B) = <span className="inline-block text-center mx-1"><span className="block border-b border-current leading-none text-xs">P(B|A)P(A)</span><span className="block leading-none text-xs">P(B)</span></span></>}
                steps={['确定先验概率 P(A)', '计算似然度 P(B|A)']}
                status="需要复习"
                statusIcon={<AlertCircle size={16} className="text-red-400" />}
            />

             {/* Add New Card */}
             <div className="group relative bg-slate-50 dark:bg-surface-dark/30 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-100 dark:hover:bg-surface-dark transition-all duration-300 flex flex-col items-center justify-center p-8 text-center cursor-pointer min-h-[320px]">
                <div className="w-16 h-16 rounded-full bg-white dark:bg-surface-dark flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <PlusCircle className="text-primary" size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">练习更多题目</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                    AI 将根据你的解题记录自动生成新的技巧卡片。
                </p>
                <button className="mt-6 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                    前往习题集
                </button>
            </div>

        </div>
        
        <div className="flex justify-center pt-4 pb-12">
            <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors shadow-sm">
                加载更多技巧
                <ChevronDown size={16} />
            </button>
        </div>

      </div>
    </div>
  );
};

const FilterTab = ({ label, active }: any) => (
    <button className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium whitespace-nowrap transition-all ${active ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 hover:scale-105' : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary/50'}`}>
        {label}
    </button>
);

const SkillCard = ({ category, color, title, desc, formula, steps, aiAdvice, aiIcon, stats, status, statusIcon, lastReview, lastReviewIcon, ping }: any) => {
    // Map color names to Tailwind classes
    const colorMap: any = {
        blue: { bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-300' },
        amber: { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-300' },
        purple: { bg: 'bg-purple-50 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-300' },
        emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-300' },
        pink: { bg: 'bg-pink-50 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-300' },
    };
    const c = colorMap[color] || colorMap.blue;

    return (
        <div className="group relative bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden flex flex-col">
            {color === 'blue' && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-cyan-400"></div>}
            
            {ping && (
                <div className="absolute top-4 right-4 z-10">
                    <span className="flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                </div>
            )}

            <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                    <div className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide ${c.bg} ${c.text}`}>
                        {category}
                    </div>
                    <Bookmark className="text-slate-300 dark:text-slate-600 group-hover:text-primary cursor-pointer transition-colors" size={20} />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{desc}</p>
                
                <div className="bg-slate-50 dark:bg-surface-dark/50 rounded-lg p-4 mb-4 border border-slate-100 dark:border-slate-800/50 font-serif text-center flex items-center justify-center min-h-[80px]">
                    <div className="text-xl font-serif text-slate-800 dark:text-slate-100">
                        {formula}
                    </div>
                </div>

                {steps && (
                    <div className="space-y-2">
                        {steps.map((step: string, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                                {step}
                            </div>
                        ))}
                    </div>
                )}

                {aiAdvice && (
                    <div className="flex items-center gap-2 p-2 rounded bg-primary/5 border border-primary/10 mb-2 mt-4">
                        {aiIcon || <Brain size={16} className="text-primary" />}
                        <span className="text-xs text-primary font-medium">{aiAdvice}</span>
                    </div>
                )}
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-surface-dark/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {stats && (
                        <>
                             <LineChart size={16} className="text-primary" />
                             <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{stats}</span>
                        </>
                    )}
                    {status && (
                        <>
                            {statusIcon}
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{status}</span>
                        </>
                    )}
                    {lastReview && (
                        <>
                            {lastReviewIcon}
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{lastReview}</span>
                        </>
                    )}
                </div>
                <button className="text-xs font-bold text-primary hover:text-primary-hover transition-colors">查看指南</button>
            </div>
        </div>
    );
};

export default Skills;