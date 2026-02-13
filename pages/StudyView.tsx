import React, { useState, useRef, useEffect } from 'react';
import {
    ChevronLeft,
    ZoomIn,
    ZoomOut,
    Crop,
    Settings,
    LayoutDashboard,
    FolderOpen,
    History,
    Activity,
    ThumbsUp,
    ThumbsDown,
    RefreshCw,
    Camera,
    ArrowUp,
    Copy,
    Upload,
    ScanLine,
    X,
    Sparkles,
    MousePointer2,
    AlertCircle,
    FileText,
    Lightbulb,
    BookOpen,
    Layers,
    Trash2,
    Plus,
    Zap,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { aiApi } from '../lib/api';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs`;

// Mock Analysis Results for Pre-loading
const MOCK_RESULT_1 = {
    core_concepts: ["分部积分法", "导数降幂", "不定积分"],
    insight: "这是一个典型的“反对数幂函数”积分模型。核心矛盾在于被积函数是多项式 x² 与指数函数 eˣ 的乘积。因为多项式求导能降低次数，而指数函数积分不变，所以直觉告诉我们：必须使用分部积分法。",
    steps: [
        {
            title: "第一阶段：建立降幂策略",
            content: "我们使用分部积分公式 ∫ u dv = uv - ∫ v du。\n令 u = x²，dv = eˣ dx。\n则 du = 2x dx，v = eˣ。\n代入公式得到：∫ x²eˣ dx = x²eˣ - ∫ 2x eˣ dx"
        },
        {
            title: "第二阶段：彻底消灭多项式",
            content: "对剩余部分 ∫ 2x eˣ dx 再次使用分部积分。\n令 u = 2x，dv = eˣ dx。\n计算得到：2xeˣ - 2eˣ。"
        },
        {
            title: "第三阶段：重组与验证",
            content: "最终结果为：eˣ(x² - 2x + 2) + C"
        }
    ],
    summary: "对于 ∫ P(x)eᵃˣ dx 形式的积分，使用 n 次分部积分法即可。",
    final_answer: "eˣ(x² - 2x + 2) + C"
};

const MOCK_RESULT_2 = {
    core_concepts: ["洛必达法则", "等价无穷小", "泰勒展开"],
    insight: "题目要求计算 0/0 型极限。观察分子包含三角函数 sin x，分母是幂函数。这提示我们可以使用泰勒公式将 sin x 展开，或者直接使用洛必达法则求导。",
    steps: [
        {
            title: "方法一：洛必达法则",
            content: "原式属于 0/0 型，且函数可导。\n分子求导：(x - sin x)' = 1 - cos x\n分母求导：(x³)' = 3x²\n原式 = lim (1 - cos x) / 3x²"
        },
        {
            title: "继续求导或等价代换",
            content: "此时仍为 0/0 型。已知 1 - cos x ~ x²/2 (当 x→0)。\n或者再次求导：sin x / 6x -> 1/6。"
        }
    ],
    summary: "处理 0/0 型极限时，优先考虑等价无穷小代换简化算式，再结合洛必达法则。",
    final_answer: "1/6"
};

// Types for Detected Regions
interface DetectedProblem {
    id: string;
    rect: { x: number; y: number; w: number; h: number }; // Percentages (0-100)
    status: 'analyzing' | 'ready';
    result?: typeof MOCK_RESULT_1;
}

const StudyView: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Page Management State
    const [pages, setPages] = useState<string[]>([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    // Initial Load
    useEffect(() => {
        if (location.state?.fileUrl) {
            setPages([location.state.fileUrl]);
        } else {
            setPages(["https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2940&auto=format&fit=crop"]);
        }
    }, [location.state]);

    const imageSrc = pages[currentPageIndex] || "";

    const [isSelecting, setIsSelecting] = useState(false);
    const [selectionBox, setSelectionBox] = useState<{ x: number, y: number, w: number, h: number } | null>(null);
    const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);
    const [analysisState, setAnalysisState] = useState<'idle' | 'analyzing' | 'done' | 'error' | 'loading_pdf'>('idle');
    const [analysisResult, setAnalysisResult] = useState<typeof MOCK_RESULT_1>(MOCK_RESULT_1);
    const [zoom, setZoom] = useState(100);
    const [showThumbnails, setShowThumbnails] = useState(true);

    // Auto-Scan State
    const [isScanning, setIsScanning] = useState(false);
    const [detectedProblems, setDetectedProblems] = useState<DetectedProblem[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Auto Scan Logic ---
    useEffect(() => {
        if (!imageSrc) return;

        // Start scanning animation
        setIsScanning(true);
        setDetectedProblems([]);
        setAnalysisState('idle');

        // Simulate Scanning Process
        const scanTimer = setTimeout(() => {
            setIsScanning(false);

            // Generate Mock Detected Problems based on image (simulated positions)
            const newProblems: DetectedProblem[] = [
                {
                    id: 'p1',
                    rect: { x: 10, y: 15, w: 80, h: 30 }, // Top part
                    status: 'analyzing'
                },
                {
                    id: 'p2',
                    rect: { x: 10, y: 55, w: 80, h: 35 }, // Bottom part
                    status: 'analyzing'
                }
            ];
            setDetectedProblems(newProblems);

            // Simulate Background Analysis finishing one by one
            setTimeout(() => {
                setDetectedProblems(prev => prev.map(p =>
                    p.id === 'p1' ? { ...p, status: 'ready', result: MOCK_RESULT_1 } : p
                ));
            }, 1500);

            setTimeout(() => {
                setDetectedProblems(prev => prev.map(p =>
                    p.id === 'p2' ? { ...p, status: 'ready', result: MOCK_RESULT_2 } : p
                ));
            }, 3000);

        }, 2000); // Scan duration

        return () => clearTimeout(scanTimer);
    }, [imageSrc]);

    // Helper: Crop Image
    const getCroppedImg = async (sourceUrl: string, box: { x: number, y: number, w: number, h: number }) => {
        if (!containerRef.current) return null;

        const image = new Image();
        image.src = sourceUrl;
        image.crossOrigin = "anonymous";
        await new Promise((resolve) => { image.onload = resolve; });

        const rect = containerRef.current.getBoundingClientRect();
        const cssScale = zoom / 100;
        const renderedWidthUnscaled = rect.width / cssScale;
        const renderedHeightUnscaled = rect.height / cssScale;
        const ratioX = image.naturalWidth / renderedWidthUnscaled;
        const ratioY = image.naturalHeight / renderedHeightUnscaled;

        const pixelCrop = {
            x: (box.x / cssScale) * ratioX,
            y: (box.y / cssScale) * ratioY,
            w: (box.w / cssScale) * ratioX,
            h: (box.h / cssScale) * ratioY
        };

        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.w;
        canvas.height = pixelCrop.h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.drawImage(
            image,
            pixelCrop.x, pixelCrop.y, pixelCrop.w, pixelCrop.h,
            0, 0, pixelCrop.w, pixelCrop.h
        );

        return canvas.toDataURL('image/jpeg', 0.9);
    };

    // Handle File Upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setSelectionBox(null);
        setAnalysisState('loading_pdf');

        const newPages: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type === 'application/pdf') {
                try {
                    const url = URL.createObjectURL(file);
                    const loadingTask = pdfjsLib.getDocument(url);
                    const pdf = await loadingTask.promise;
                    const page = await pdf.getPage(1);
                    const viewport = page.getViewport({ scale: 2.0 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    if (context) {
                        await page.render({ canvasContext: context, viewport: viewport }).promise;
                        newPages.push(canvas.toDataURL('image/jpeg', 0.9));
                    }
                    URL.revokeObjectURL(url);
                } catch (error) { console.error(error); }
            } else if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                await new Promise<void>((resolve) => {
                    reader.onload = (ev) => { if (ev.target?.result) newPages.push(ev.target.result as string); resolve(); };
                    reader.readAsDataURL(file);
                });
            }
        }

        if (newPages.length > 0) {
            setPages(prev => [...prev, ...newPages]);
            setCurrentPageIndex(prev => prev === 0 && pages.length === 1 && pages[0].includes("unsplash") ? 0 : pages.length);
        }
        setAnalysisState('idle');
        e.target.value = '';
    };

    const deletePage = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newPages = pages.filter((_, i) => i !== index);
        setPages(newPages.length ? newPages : [""]);
        if (currentPageIndex >= index && currentPageIndex > 0) setCurrentPageIndex(currentPageIndex - 1);
    };

    // Selection Interactions
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        if ((e.target as HTMLElement).closest('button')) return;
        // Don't start selection if clicking a detected box
        if ((e.target as HTMLElement).closest('.detected-box')) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setStartPos({ x, y });
        setSelectionBox({ x, y, w: 0, h: 0 });
        setIsSelecting(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isSelecting || !startPos || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        setSelectionBox({
            x: Math.min(currentX, startPos.x),
            y: Math.min(currentY, startPos.y),
            w: Math.abs(currentX - startPos.x),
            h: Math.abs(currentY - startPos.y)
        });
    };

    const handleMouseUp = () => {
        setIsSelecting(false);
        if (selectionBox && (selectionBox.w < 10 || selectionBox.h < 10)) {
            setSelectionBox(null);
        } else if (selectionBox) {
            // Check intersection with detected problems for instant analysis
            checkOverlapAndAnalyze(selectionBox);
        }
    };

    const checkOverlapAndAnalyze = (box: { x: number, y: number, w: number, h: number }) => {
        if (!containerRef.current) return;

        // Convert pixel box to percentage
        const rect = containerRef.current.getBoundingClientRect();
        const cssScale = zoom / 100;
        const w = rect.width / cssScale;
        const h = rect.height / cssScale;

        const boxRect = {
            x: box.x / cssScale,
            y: box.y / cssScale,
            w: box.w / cssScale,
            h: box.h / cssScale
        };

        // Simple overlap check
        const match = detectedProblems.find(p => {
            if (p.status !== 'ready') return false;
            // Convert p.rect % to pixels
            const px = (p.rect.x / 100) * w;
            const py = (p.rect.y / 100) * h;
            const pw = (p.rect.w / 100) * w;
            const ph = (p.rect.h / 100) * h;

            // Check if center of user box is inside detected box
            const cx = boxRect.x + boxRect.w / 2;
            const cy = boxRect.y + boxRect.h / 2;

            return cx > px && cx < px + pw && cy > py && cy < py + ph;
        });

        if (match && match.result) {
            setAnalysisResult(match.result);
            setAnalysisState('done');
            // Optional: Snap selection to the detected box?
            // For now, let's just show the result and keep user box
        }
    };

    const handleDetectedClick = (problem: DetectedProblem) => {
        if (problem.status === 'ready' && problem.result) {
            setAnalysisResult(problem.result);
            setAnalysisState('done');
            setSelectionBox(null); // Clear manual selection
        }
    };

    const handleAnalyze = async () => {
        if (!selectionBox || !imageSrc) return;
        console.log("Starting AI analysis via backend proxy...");
        setAnalysisState('analyzing');

        try {
            const base64Image = await getCroppedImg(imageSrc, selectionBox);
            if (!base64Image) throw new Error("Failed to crop image");

            const base64Data = base64Image.split(',')[1];

            // Call backend AI proxy instead of direct Gemini API
            const data = await aiApi.analyze(base64Data);
            setAnalysisResult(data);
            setAnalysisState('done');

        } catch (e) {
            console.error("AI Analysis Failed", e);
            setAnalysisState('error');
            setTimeout(() => { setAnalysisResult(MOCK_RESULT_1); setAnalysisState('done'); }, 2000);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200">

            {/* Left Icon Sidebar */}
            <aside className="w-16 h-full bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-6 z-20 flex-shrink-0">
                <div className="mb-8 p-2 bg-primary/10 rounded-xl cursor-pointer" onClick={() => navigate('/library')}>
                    <ChevronLeft className="text-primary" />
                </div>
                <div className="flex-1 flex flex-col gap-6 w-full items-center">
                    <NavIcon icon={<LayoutDashboard />} label="工作台" active />
                    <NavIcon icon={<FolderOpen />} label="资料库" />
                    <NavIcon icon={<Activity />} label="诊断报告" />
                    <NavIcon icon={<History />} label="历史记录" />
                </div>
                <div className="flex flex-col gap-4 mb-4">
                    <button className="p-3 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <Settings size={24} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden border-2 border-slate-600">
                        <img src="https://picsum.photos/id/64/100/100" className="w-full h-full object-cover" />
                    </div>
                </div>
            </aside>

            {/* Main Split Content */}
            <main className="flex-1 flex flex-col md:flex-row h-full overflow-hidden relative">

                {/* Document Viewer / Canvas */}
                <section className="w-full md:w-[50%] h-full flex flex-col bg-slate-100 dark:bg-[#0f1115] border-r border-slate-200 dark:border-slate-800 relative z-10 select-none">
                    {/* Toolbar */}
                    <div className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-surface-dark/50 backdrop-blur-sm z-20">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowThumbnails(!showThumbnails)}
                                className={`p-2 rounded-lg transition-colors ${showThumbnails ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                title="Toggle Page Sidebar"
                            >
                                <Layers size={18} />
                            </button>
                            <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/png, image/jpeg, image/jpg, application/pdf" multiple />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
                            >
                                <Plus size={14} />
                                添加页/题
                            </button>
                            <span className="text-xs text-slate-400 hidden sm:inline-block">支持多选上传</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white dark:bg-surface-dark rounded-lg p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <button onClick={() => setZoom(z => Math.max(z - 10, 50))} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"><ZoomOut size={16} /></button>
                            <span className="text-xs font-mono px-2 text-slate-500 dark:text-slate-400 w-12 text-center">{zoom}%</span>
                            <button onClick={() => setZoom(z => Math.min(z + 10, 200))} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"><ZoomIn size={16} /></button>
                        </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Thumbnails Sidebar */}
                        {showThumbnails && (
                            <div className="w-24 md:w-32 bg-white dark:bg-card-dark border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-y-auto p-3 gap-3 flex-shrink-0 z-20">
                                {pages.map((page, idx) => (
                                    <div
                                        key={idx}
                                        className={`relative group aspect-[3/4] rounded-lg border-2 cursor-pointer overflow-hidden transition-all ${idx === currentPageIndex ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'}`}
                                        onClick={() => { setCurrentPageIndex(idx); setSelectionBox(null); setAnalysisState('idle'); }}
                                    >
                                        <img src={page} className="w-full h-full object-cover" />
                                        <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 rounded backdrop-blur-sm">
                                            {idx + 1}
                                        </div>
                                        <button
                                            onClick={(e) => deletePage(idx, e)}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-[3/4] rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-colors gap-2"
                                >
                                    <Plus size={24} />
                                    <span className="text-xs">添加</span>
                                </button>
                            </div>
                        )}

                        {/* Canvas Area */}
                        <div className="flex-1 overflow-auto p-8 flex justify-center items-start relative cursor-crosshair bg-slate-50 dark:bg-[#0f1115]" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
                            <div
                                ref={containerRef}
                                className="relative bg-white shadow-2xl transition-transform duration-100 origin-top inline-block"
                                style={{ transform: `scale(${zoom / 100})` }}
                            >
                                {analysisState === 'loading_pdf' ? (
                                    <div className="w-[500px] h-[700px] flex flex-col items-center justify-center bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700">
                                        <RefreshCw className="animate-spin text-primary mb-4" size={32} />
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">正在解析文件...</p>
                                    </div>
                                ) : (
                                    <>
                                        <img src={imageSrc} className="max-w-full md:max-w-xl block pointer-events-none" alt="Document" />

                                        {/* Scanning Effect */}
                                        {isScanning && (
                                            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-sm">
                                                <div className="w-full h-1 bg-primary/80 shadow-[0_0_15px_rgba(19,91,236,0.8)] animate-[scan_2s_linear_infinite]"></div>
                                                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent h-20 animate-[scan_2s_linear_infinite] -translate-y-full"></div>
                                                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                                                    <Loader2 className="animate-spin" size={12} />
                                                    AI 正在扫描全页题目...
                                                </div>
                                            </div>
                                        )}

                                        {/* Detected Problems Overlay */}
                                        {!isScanning && detectedProblems.map(problem => (
                                            <div
                                                key={problem.id}
                                                className={`absolute detected-box border-2 rounded-lg cursor-pointer transition-all duration-300 group z-10 ${problem.status === 'ready'
                                                        ? 'border-green-500/50 bg-green-500/5 hover:bg-green-500/10 hover:border-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                                                        : 'border-amber-400/50 bg-amber-400/5 animate-pulse'
                                                    }`}
                                                style={{
                                                    left: `${problem.rect.x}%`,
                                                    top: `${problem.rect.y}%`,
                                                    width: `${problem.rect.w}%`,
                                                    height: `${problem.rect.h}%`
                                                }}
                                                onClick={(e) => { e.stopPropagation(); handleDetectedClick(problem); }}
                                            >
                                                <div className={`absolute -top-3 -right-3 rounded-full p-1 shadow-sm transition-transform duration-300 ${problem.status === 'ready' ? 'bg-green-500 text-white scale-100' : 'bg-amber-400 text-white scale-90'}`}>
                                                    {problem.status === 'ready' ? <CheckCircle2 size={14} /> : <Loader2 size={14} className="animate-spin" />}
                                                </div>

                                                {/* Hover Tooltip */}
                                                {problem.status === 'ready' && (
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap backdrop-blur-sm pointer-events-none transform scale-95 group-hover:scale-100">
                                                        <div className="flex items-center gap-1.5">
                                                            <Zap size={12} className="text-yellow-400 fill-current" />
                                                            点击查看秒级解析
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </>
                                )}

                                {/* Empty State Hint */}
                                {!selectionBox && analysisState === 'idle' && !isScanning && detectedProblems.length === 0 && (
                                    <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md pointer-events-none animate-pulse flex items-center gap-2 border border-white/20 z-30">
                                        <MousePointer2 size={16} />
                                        框选题目区域以开始分析
                                    </div>
                                )}

                                {/* Manual Selection Box */}
                                {selectionBox && (
                                    <div
                                        className="absolute border-2 border-primary bg-primary/10 z-30 group"
                                        style={{
                                            left: selectionBox.x,
                                            top: selectionBox.y,
                                            width: selectionBox.w,
                                            height: selectionBox.h
                                        }}
                                    >
                                        {!isSelecting && selectionBox.w > 20 && (
                                            <div
                                                className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2 animate-in fade-in zoom-in duration-200 z-50"
                                                onMouseDown={(e) => e.stopPropagation()}
                                            >
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectionBox(null); setAnalysisState('idle'); }}
                                                    className="p-2 bg-slate-800 text-white rounded-lg shadow-lg hover:bg-slate-700 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleAnalyze(); }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-lg hover:bg-primary-hover transition-colors font-medium whitespace-nowrap"
                                                >
                                                    <ScanLine size={16} />
                                                    精准解析
                                                </button>
                                            </div>
                                        )}
                                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary rounded-full"></div>
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
                                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary rounded-full"></div>
                                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right AI Analysis */}
                <section className="flex-1 h-full flex flex-col bg-white dark:bg-surface-dark relative z-0 border-l border-slate-200 dark:border-slate-800">
                    <header className="sticky top-0 z-20 bg-white/90 dark:bg-surface-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4">
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                                {analysisState === 'analyzing' ? (
                                    <RefreshCw className="animate-spin text-primary" size={20} />
                                ) : (
                                    <Sparkles className="text-primary" size={20} />
                                )}
                                {analysisState === 'idle' ? 'AI 助手就绪' : 'AI 深度解析'}
                                {analysisState === 'error' && <span className="text-red-500 text-sm">(连接失败, 使用缓存)</span>}
                            </h1>
                            {(analysisState === 'done' || analysisState === 'error') && (
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Gemini 3 Pro</span>
                            )}
                        </div>

                        {(analysisState === 'done' || analysisState === 'error') && (
                            <div className="flex flex-wrap gap-2 items-center animate-fade-in-up">
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1 uppercase tracking-wide">关键考点:</span>
                                {analysisResult.core_concepts.map((concept, i) => (
                                    <Badge key={i} text={concept} active={i === 0} />
                                ))}
                            </div>
                        )}
                    </header>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scroll-smooth pb-32">

                        {analysisState === 'idle' && (
                            <div className="flex flex-col items-center justify-center h-[60%] text-center opacity-50">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                    <Crop size={32} className="text-slate-400" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-800 dark:text-white">请在左侧框选题目</h3>
                                <p className="text-sm text-slate-500 max-w-xs mt-2">框选或点击绿色预加载区域，AI 将为你拆解详细步骤。</p>
                            </div>
                        )}

                        {analysisState === 'analyzing' && (
                            <div className="space-y-6 animate-pulse">
                                <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/4"></div>
                                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-5/6"></div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/4"></div>
                                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-4/6"></div>
                                </div>
                            </div>
                        )}

                        {(analysisState === 'done' || analysisState === 'error') && (
                            <div className="animate-fade-in-up space-y-8">
                                {/* Insight Section - Clean Text Style */}
                                <div className="relative">
                                    <div className="flex items-start gap-3 mb-2">
                                        <Lightbulb className="text-amber-500 mt-1" size={20} />
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">深度洞察</h3>
                                    </div>
                                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-8 font-serif">
                                        {analysisResult.insight}
                                    </p>
                                </div>

                                <hr className="border-slate-100 dark:border-slate-800" />

                                {/* Steps - Clean Textbook Style */}
                                <div className="space-y-8">
                                    {analysisResult.steps.map((step, index) => (
                                        <div key={index} className="relative pl-8 border-l-2 border-slate-200 dark:border-slate-800">
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 border-4 border-white dark:border-surface-dark"></div>
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                                                {step.title}
                                            </h4>
                                            <div className="text-base text-slate-800 dark:text-slate-200 leading-relaxed font-serif whitespace-pre-wrap">
                                                {step.content}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <hr className="border-slate-100 dark:border-slate-800" />

                                {/* Summary & Generalization */}
                                <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-xl border border-primary/10">
                                    <div className="flex items-center gap-2 mb-3 text-primary">
                                        <BookOpen size={18} />
                                        <h4 className="font-bold text-sm uppercase tracking-wide">举一反三 · 通法总结</h4>
                                    </div>
                                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                                        {analysisResult.summary}
                                    </p>
                                </div>

                                {/* Final Answer */}
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">最终答案</span>
                                    <div className="text-xl font-serif font-bold text-slate-900 dark:text-white tracking-wide">
                                        {analysisResult.final_answer}
                                    </div>
                                </div>

                                {/* Generate Similar */}
                                <div className="pt-4">
                                    <button className="w-full group relative flex items-center justify-center gap-3 p-4 rounded-xl bg-surface-dark dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary hover:bg-primary/5 transition-all duration-300">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                            <RefreshCw size={16} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">
                                            基于此题生成变式训练
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Input Area */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 p-4 z-30">
                        <div className="relative flex items-center gap-2 max-w-4xl mx-auto">
                            <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                <Camera size={20} />
                            </button>
                            <div className="relative flex-1">
                                <input type="text" className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-full py-3 pl-4 pr-12 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary placeholder-slate-400 dark:placeholder-slate-500" placeholder="哪一步没看懂？问问 AI..." />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-white rounded-full hover:bg-blue-600 transition-colors">
                                    <ArrowUp size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                </section>
            </main>
        </div>
    );
};

const NavIcon = ({ icon, label, active }: any) => (
    <button className={`p-3 rounded-xl transition-colors relative group ${active ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
        {React.cloneElement(icon, { size: 24 })}
        <span className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">{label}</span>
    </button>
);

const Badge = ({ text, active }: any) => (
    <button className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${active ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}>
        {text}
    </button>
);

export default StudyView;