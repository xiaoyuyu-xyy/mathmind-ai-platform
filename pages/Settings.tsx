import React, { useState, useEffect } from 'react';
import { Cloud, Server, GraduationCap, Eye, EyeOff, Lock, CheckCircle, RotateCcw } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';

const data = [
    { value: 30 }, { value: 45 }, { value: 25 }, { value: 60 }, { value: 55 }, { value: 40 },
    { value: 35 }, { value: 20 }, { value: 70 }, { value: 65 }, { value: 50 }, { value: 45 },
];

const Settings: React.FC = () => {
    const [apiKey, setApiKey] = useState('sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    const [showKey, setShowKey] = useState(false);
    const [temp, setTemp] = useState(0.2);
    const [tokens, setTokens] = useState(2048);
    const [engine, setEngine] = useState('cloud');

    // Load settings from backend
    useEffect(() => {
        fetch('/api/settings').then(r => r.json()).then(data => {
            if (data.apiKey) setApiKey(data.apiKey);
            if (data.temperature !== undefined) setTemp(data.temperature);
            if (data.maxTokens) setTokens(data.maxTokens);
            if (data.engine) setEngine(data.engine);
        }).catch(console.error);
    }, []);

    // Save settings to backend
    const handleSave = () => {
        fetch('/api/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apiKey, temperature: temp, maxTokens: tokens, engine })
        }).catch(console.error);
    };

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">AI 引擎配置</h1>
                    <p className="text-slate-500 dark:text-slate-400">管理数学推理引擎、API 连接和模型微调参数。</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 border border-green-500/20 text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                        系统运行正常
                    </div>
                    <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">
                        查看日志
                    </button>
                    <button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium shadow-lg shadow-primary/25 transition-all">
                        保存更改
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Main Settings */}
                <div className="xl:col-span-2 space-y-6">

                    {/* Engine Selection */}
                    <section className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <GraduationCap className="text-primary" size={24} />
                                核心引擎选择
                            </h2>
                            <div className="flex items-center gap-2">
                                <label className="inline-flex items-center cursor-pointer">
                                    <input type="checkbox" value="" className="sr-only peer" />
                                    <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                    <span className="ms-3 text-xs font-medium text-slate-500 dark:text-slate-400">离线安全模式</span>
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <EngineOption
                                icon={<Cloud size={24} />}
                                title="云端通用 API"
                                desc="连接 OpenAI GPT-4 或 Claude 3，适合高难度逻辑推理。"
                                active={engine === 'cloud'}
                                onClick={() => setEngine('cloud')}
                                color="text-blue-500"
                                bg="bg-blue-100 dark:bg-blue-900/30"
                            />
                            <EngineOption
                                icon={<Server size={24} />}
                                title="本地私有模型"
                                desc="运行 MathGLM-10B，数据不离本地，低延迟响应。"
                                active={engine === 'local'}
                                onClick={() => setEngine('local')}
                                color="text-purple-500"
                                bg="bg-purple-100 dark:bg-purple-900/30"
                            />
                            <EngineOption
                                icon={<GraduationCap size={24} />}
                                title="专业学术引擎"
                                desc="连接 WolframAlpha 或 SageMath 接口，专注符号计算。"
                                active={engine === 'academic'}
                                onClick={() => setEngine('academic')}
                                color="text-orange-500"
                                bg="bg-orange-100 dark:bg-orange-900/30"
                            />
                        </div>
                    </section>

                    {/* API Keys */}
                    <section className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
                            <Lock className="text-primary" size={24} />
                            认证与连接
                        </h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                <label className="md:col-span-3 text-sm font-medium text-slate-600 dark:text-slate-300">API 服务商</label>
                                <div className="md:col-span-9 relative">
                                    <select className="w-full bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none">
                                        <option>OpenAI (GPT-4 Turbo)</option>
                                        <option>Anthropic (Claude 3.5 Sonnet)</option>
                                        <option>DeepSeek Math</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                <label className="md:col-span-3 text-sm font-medium text-slate-600 dark:text-slate-300">API 密钥</label>
                                <div className="md:col-span-9 flex gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type={showKey ? "text" : "password"}
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-mono text-sm tracking-wide"
                                        />
                                        <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-2.5 text-slate-400 hover:text-primary transition-colors">
                                            {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-medium text-sm transition-colors whitespace-nowrap">
                                        测试连接
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 md:pl-[25%]">
                                <Lock size={12} />
                                您的密钥在本地加密存储，绝不上传至我们的服务器。
                            </div>
                        </div>
                    </section>

                    {/* Model Params */}
                    <section className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <RotateCcw className="text-primary" size={24} />
                                模型微调参数
                            </h2>
                            <button className="text-sm text-primary hover:text-primary-hover font-medium">恢复默认</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">随机性 (Temperature)</label>
                                    <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{temp}</span>
                                </div>
                                <input type="range" min="0" max="1" step="0.1" value={temp} onChange={(e) => setTemp(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-primary" />
                                <p className="text-xs text-slate-500">数学任务建议设置较低值 (0.0 - 0.3) 以保证精确性。</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">最大长度 (Max Tokens)</label>
                                    <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{tokens}</span>
                                </div>
                                <input type="range" min="256" max="8192" step="256" value={tokens} onChange={(e) => setTokens(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-primary" />
                                <p className="text-xs text-slate-500">控制单次响应的最大字符数，影响生成步骤的完整性。</p>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="bg-primary rounded-xl p-6 text-white shadow-lg shadow-primary/20 relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                        <h3 className="text-sm font-medium text-blue-100 mb-6 uppercase tracking-wider">今日用量统计</h3>
                        <div className="space-y-6 relative z-10">
                            <div>
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-3xl font-bold">14,205</span>
                                    <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded text-white">+12%</span>
                                </div>
                                <p className="text-sm text-blue-200">Token 消耗量</p>
                            </div>
                            <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-white h-full rounded-full" style={{ width: '65%' }}></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <span className="block text-xl font-bold">0.8s</span>
                                    <span className="text-xs text-blue-200">平均延迟</span>
                                </div>
                                <div>
                                    <span className="block text-xl font-bold">$1.24</span>
                                    <span className="text-xs text-blue-200">预计成本</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Latency Chart */}
                    <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h3 className="text-sm font-semibold mb-4 text-slate-500 dark:text-slate-400 uppercase tracking-wider">响应延迟趋势 (MS)</h3>
                        <div className="h-40 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <Bar dataKey="value" fill="#135bec" radius={[2, 2, 0, 0]}>
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fillOpacity={index === 11 ? 1 : 0.3} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-slate-400">
                            <span>00:00</span>
                            <span>12:00</span>
                            <span>24:00</span>
                        </div>
                    </div>

                    {/* Recent Logs */}
                    <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h3 className="text-sm font-semibold mb-4 text-slate-500 dark:text-slate-400 uppercase tracking-wider">最近调用记录</h3>
                        <div className="space-y-4">
                            <LogItem status="success" id="A102" desc="Linear Algebra Solver" time="14ms" />
                            <LogItem status="success" id="A101" desc="Calculus Integration" time="320ms" />
                            <LogItem status="warning" id="A100" desc="Geometry Proof (Timeout)" time="5.0s" />
                            <LogItem status="success" id="A099" desc="Basic Arithmetic" time="8ms" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

const EngineOption = ({ icon, title, desc, active, onClick, color, bg }: any) => (
    <div onClick={onClick} className={`relative cursor-pointer h-full p-5 rounded-xl border-2 transition-all ${active ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-surface-dark hover:border-primary/50'}`}>
        <div className="flex justify-between items-start mb-3">
            <div className={`p-2 rounded-lg ${color} ${bg}`}>
                {icon}
            </div>
            {active && <CheckCircle size={16} className="text-green-500" />}
        </div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
    </div>
);

const LogItem = ({ status, id, desc, time }: any) => (
    <div className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
        <div className={`w-2 h-2 mt-1.5 rounded-full ${status === 'success' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
        <div className="flex-1">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Request #{id}</p>
            <p className="text-xs text-slate-500">{desc}</p>
        </div>
        <span className="text-xs font-mono text-slate-400">{time}</span>
    </div>
)

export default Settings;