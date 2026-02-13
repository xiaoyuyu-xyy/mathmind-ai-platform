import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, TrendingUp, BrainCircuit, Search, Filter, History, Plus, CloudUpload, Play, ArrowRight, RefreshCw, X, FileText, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { booksApi, uploadHistoryApi, type Book, type UploadRecord } from '../lib/api';



const Library: React.FC = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState<Book[]>([]);
    const [uploadRecords, setUploadRecords] = useState<UploadRecord[]>([]);

    useEffect(() => {
        booksApi.list().then(setBooks).catch(console.error);
    }, []);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [activeTab, setActiveTab] = useState('全部');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredBooks = activeTab === '全部'
        ? books
        : books.filter(book => book.category === activeTab);

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setUploadProgress(10);

        try {
            // Show progress animation
            let progress = 10;
            const interval = setInterval(() => {
                progress = Math.min(progress + 15, 90);
                setUploadProgress(progress);
            }, 200);

            const newBook = await booksApi.upload(selectedFile);
            clearInterval(interval);
            setUploadProgress(100);

            setTimeout(() => {
                setBooks(prev => [newBook, ...prev]);
                setIsUploading(false);
                setUploadProgress(0);
                setSelectedFile(null);
                setIsUploadModalOpen(false);
            }, 400);
        } catch (err) {
            console.error('Upload failed:', err);
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const triggerFilePicker = () => {
        fileInputRef.current?.click();
    };

    const resetModal = () => {
        setIsUploadModalOpen(false);
        setSelectedFile(null);
        setIsUploading(false);
        setUploadProgress(0);
    };

    const handleBookClick = (book: Book) => {
        if (book.isProcessing) return;
        // Navigate to the Book Detail page instead of direct study view
        navigate(`/library/${book.id}`, { state: { book } });
    };

    return (
        <div className="w-full relative">
            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-card-dark w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">上传新教材</h3>
                            <button onClick={resetModal} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                                <X size={24} />
                            </button>
                        </div>

                        {!isUploading ? (
                            <>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".pdf,.epub,.png,.jpg,.jpeg"
                                    onChange={handleFileSelect}
                                />
                                <div
                                    onClick={triggerFilePicker}
                                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer mb-6 ${selectedFile ? 'border-primary bg-primary/5' : 'border-slate-300 dark:border-slate-600'}`}
                                >
                                    {selectedFile ? (
                                        <div className="text-center">
                                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto text-primary">
                                                <FileText size={32} />
                                            </div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{selectedFile.name}</p>
                                            <p className="text-xs text-slate-500 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            <p className="text-xs text-primary mt-4">点击更换文件</p>
                                        </div>
                                    ) : (
                                        <>
                                            <CloudUpload size={48} className="text-primary mb-4" />
                                            <p className="text-sm font-medium text-slate-900 dark:text-slate-200">点击或拖拽 PDF 文件到此处</p>
                                            <p className="text-xs text-slate-500 mt-2">支持 PDF, JPG (最大 100MB)</p>
                                        </>
                                    )}
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button onClick={resetModal} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors">取消</button>
                                    <button
                                        onClick={handleUpload}
                                        disabled={!selectedFile}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg ${selectedFile ? 'bg-primary hover:bg-primary-hover text-white shadow-primary/20' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'}`}
                                    >
                                        确认上传
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="py-8">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">正在上传...</span>
                                    <span className="text-sm font-medium text-primary">{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                                <p className="text-xs text-slate-500 mt-4 text-center">正在解析目录结构与知识点...</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* History Modal */}
            {isHistoryOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-card-dark w-full max-w-2xl rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">上传记录</h3>
                            <button onClick={() => setIsHistoryOpen(false)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                            {uploadRecords.map((rec) => (
                                <div key={rec.id} className="flex items-center p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
                                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 mr-4">
                                        <FileText size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-slate-900 dark:text-white">{rec.filename}</h4>
                                        <p className="text-xs text-slate-500">{rec.createdAt} • {rec.sizeMb}MB</p>
                                    </div>
                                    <div className="flex items-center text-green-500 text-xs font-medium">
                                        <CheckCircle size={14} className="mr-1" />
                                        {rec.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button onClick={() => setIsHistoryOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">关闭</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <header className="mb-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <nav className="flex text-sm text-slate-500 mb-2">
                            <span className="hover:text-primary transition-colors cursor-pointer">首页</span>
                            <span className="mx-2">/</span>
                            <span className="text-slate-800 dark:text-slate-200">教材库</span>
                        </nav>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">我的教材库</h1>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
                            AI 驱动的知识建模与个性化学习路径。上传 PDF 教材，系统将自动拆解知识点并生成学习树。
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsHistoryOpen(true)}
                            className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-card-dark hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        >
                            <History size={16} className="mr-2" />
                            上传记录
                        </button>
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover transition-all shadow-lg shadow-primary/30"
                        >
                            <Plus size={16} className="mr-2" />
                            上传新教材
                        </button>
                    </div>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatsCard
                    icon={<BookOpen size={48} className="text-primary" />}
                    label="已收录教材"
                    value={books.length}
                    subValue={`+${books.length - 4} 本周`}
                />
                <StatsCard
                    icon={<TrendingUp size={48} className="text-blue-400" />}
                    label="掌握知识点"
                    value="845"
                    subValue="+124 本周"
                />
                <StatsCard
                    icon={<BrainCircuit size={48} className="text-purple-400" />}
                    label="AI 分析进度"
                    value="100%"
                    subValue="全部就绪"
                    subValueColor="text-slate-500"
                />
            </div>

            {/* Filters & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center bg-white dark:bg-card-dark rounded-lg p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
                    {['全部', '数学分析', '线性代数', '概率论'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === tab
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-slate-400" />
                        </span>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-white dark:bg-card-dark placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm text-slate-900 dark:text-slate-100"
                            placeholder="搜索教材名称或作者..."
                        />
                    </div>
                    <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-card-dark text-slate-500 hover:text-primary dark:hover:text-blue-400">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Upload Dropzone */}
            <div
                onClick={() => setIsUploadModalOpen(true)}
                className="mb-10 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer group p-8 text-center relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <div className="relative z-10 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <CloudUpload size={32} className="text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200">点击或拖拽上传 PDF 教材</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">支持 PDF 格式，最大 100MB。AI 将自动识别目录结构。</p>
                </div>
            </div>

            {/* Book Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredBooks.map((book) => (
                    <BookCard
                        key={book.id}
                        title={book.title}
                        author={book.author}
                        progress={book.progress}
                        tags={book.tags}
                        coverUrl={book.coverUrl}
                        status={book.status}
                        statusColor={book.statusColor}
                        nodes={book.nodes}
                        isProcessing={book.isProcessing}
                        onClick={() => handleBookClick(book)}
                    />
                ))}
            </div>

            <div className="mt-12 text-center">
                <p className="text-slate-500 text-sm">显示 {filteredBooks.length} 本教材，共 {books.length} 本</p>
                <button className="mt-4 px-6 py-2 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">加载更多</button>
            </div>
        </div>
    );
};

const StatsCard = ({ icon, label, value, subValue, subValueColor = "text-green-500" }: any) => (
    <div className="bg-white dark:bg-card-dark rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            {icon}
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{value}</span>
            <span className={`text-sm font-medium ${subValueColor}`}>{subValue}</span>
        </div>
    </div>
);

const BookCard = ({ title, author, progress, tags, coverUrl, status, statusColor, nodes, isProcessing, onClick }: any) => (
    <div onClick={onClick} className={`group relative flex flex-col bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden ${isProcessing ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img src={coverUrl} alt="Book Cover" className={`w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ${isProcessing ? 'opacity-80 grayscale-[30%]' : ''}`} />

            {!isProcessing && (
                <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex justify-between items-end mb-1">
                            {progress > 0 && <span className="text-xs font-semibold text-white bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">已学习 {progress}%</span>}
                            {progress === 0 && <span className="text-xs font-semibold text-white bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">未开始</span>}
                        </div>
                        <div className="w-full bg-white/30 rounded-full h-1.5 backdrop-blur-sm">
                            <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </>
            )}

            {isProcessing && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center">
                    <div className="relative w-12 h-12 mb-3">
                        <RefreshCw className="animate-spin text-primary w-12 h-12" />
                    </div>
                    <span className="text-white font-medium tracking-wide text-sm">正在构建知识图谱...</span>
                    <span className="text-white/70 text-xs mt-1">剩余约 2 分钟</span>
                </div>
            )}

            <div className="absolute top-3 right-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-md border border-white/10 ${statusColor}`}>
                    {isProcessing ? <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1.5 animate-pulse"></span> : <span className="w-1.5 h-1.5 bg-current rounded-full mr-1.5"></span>}
                    {status}
                </span>
            </div>
        </div>

        <div className={`p-5 flex-1 flex flex-col ${isProcessing ? 'opacity-75' : ''}`}>
            <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{author}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag: string) => (
                        <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{tag}</span>
                    ))}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                {!isProcessing ? (
                    <>
                        <div className="flex -space-x-2">
                            {nodes && nodes.map((num: number, i: number) => (
                                <div key={i} className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] ${i === 0 ? 'bg-blue-500/20 border-blue-500/50 text-blue-500' : 'bg-purple-500/20 border-purple-500/50 text-purple-500 ml-[-8px] z-10'}`}>{num}</div>
                            ))}
                            {!nodes && <div className="w-6 h-6 rounded-full bg-slate-500/10 border border-slate-500/30 flex items-center justify-center text-[10px] text-slate-500">?</div>}
                        </div>
                        <button className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1 group/btn">
                            {progress > 0 ? '进入知识树' : '开始学习'}
                            {progress > 0 ? <ArrowRight size={14} className="transform group-hover/btn:translate-x-1 transition-transform" /> : <Play size={14} className="transform group-hover/btn:translate-x-1 transition-transform" />}
                        </button>
                    </>
                ) : (
                    <>
                        <span className="text-xs text-slate-500">等待处理完成...</span>
                        <button className="text-sm font-medium text-slate-400 cursor-not-allowed flex items-center gap-1" disabled>
                            稍候
                        </button>
                    </>
                )}
            </div>
        </div>
    </div>
);

export default Library;