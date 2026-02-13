// =============================================
// MathMind AI Platform - API Client
// =============================================

const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${url}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(error.error || `Request failed: ${res.status}`);
    }

    return res.json();
}

// ---- Books API ----

export interface Book {
    id: number;
    title: string;
    author: string;
    progress: number;
    tags: string[];
    coverUrl: string;
    status: string;
    statusColor: string;
    nodes?: number[];
    isProcessing?: boolean;
    category: string;
    fileUrl?: string;
}

export const booksApi = {
    list: (params?: { search?: string; category?: string }) => {
        const qs = new URLSearchParams();
        if (params?.search) qs.set('search', params.search);
        if (params?.category) qs.set('category', params.category);
        const q = qs.toString();
        return request<Book[]>(`/books${q ? '?' + q : ''}`);
    },
    get: (id: number) => request<Book>(`/books/${id}`),
    create: (data: Partial<Book>) => request<Book>('/books', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id: number, data: Partial<Book>) => request<Book>(`/books/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id: number) => request<{ success: boolean }>(`/books/${id}`, {
        method: 'DELETE',
    }),
    upload: async (file: File, title?: string) => {
        const formData = new FormData();
        formData.append('file', file);
        if (title) formData.append('title', title);
        const res = await fetch(`${API_BASE}/books/upload`, {
            method: 'POST',
            body: formData,
        });
        if (!res.ok) throw new Error('Upload failed');
        return res.json() as Promise<Book>;
    },
};

// ---- Chapters & Concepts API ----

export interface Concept {
    id?: number;
    title: string;
    status: 'mastered' | 'learning' | 'pending';
}

export interface Chapter {
    id?: number;
    title: string;
    progress: number;
    mastered?: boolean;
    locked?: boolean;
    expanded?: boolean;
    concepts?: Concept[];
}

export const chaptersApi = {
    list: (bookId: number) => request<Chapter[]>(`/books/${bookId}/chapters`),
    create: (bookId: number, data: any) =>
        request<Chapter>(`/books/${bookId}/chapters`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    updateChapter: (bookId: number, chapterId: number, data: any) =>
        request<any>(`/books/${bookId}/chapters/${chapterId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    updateConcept: (bookId: number, chapterId: number, conceptId: number, data: any) =>
        request<any>(`/books/${bookId}/chapters/${chapterId}/concepts/${conceptId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
};

// ---- Problems API ----

export interface Problem {
    id: number;
    displayId: string;
    content: string;
    difficulty: string;
    source: string;
    tags: string[];
    date: string;
    isAiVariant: boolean;
    isSelected: boolean;
}

export const problemsApi = {
    list: (params?: { difficulty?: string; source?: string }) => {
        const qs = new URLSearchParams();
        if (params?.difficulty) qs.set('difficulty', params.difficulty);
        if (params?.source) qs.set('source', params.source);
        const q = qs.toString();
        return request<Problem[]>(`/problems${q ? '?' + q : ''}`);
    },
    create: (data: Partial<Problem>) =>
        request<any>('/problems', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Problem>) =>
        request<any>(`/problems/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) =>
        request<{ success: boolean }>(`/problems/${id}`, { method: 'DELETE' }),
};

// ---- Exams API ----

export interface Exam {
    id: number;
    title: string;
    date: string;
    score: string;
    tags: string[];
    status: string;
}

export const examsApi = {
    list: (search?: string) => {
        const qs = search ? `?search=${encodeURIComponent(search)}` : '';
        return request<Exam[]>(`/exams${qs}`);
    },
    get: (id: number) => request<Exam>(`/exams/${id}`),
    create: (data: Partial<Exam>) =>
        request<Exam>('/exams', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Exam>) =>
        request<Exam>(`/exams/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// ---- Skills API ----

export interface Skill {
    id: number;
    category: string;
    color: string;
    title: string;
    description: string;
    formula: string;
    steps: string[];
    aiAdvice?: string;
    stats?: string;
    status?: string;
    lastReview?: string;
    ping: boolean;
}

export const skillsApi = {
    list: (category?: string) => {
        const qs = category ? `?category=${encodeURIComponent(category)}` : '';
        return request<Skill[]>(`/skills${qs}`);
    },
    create: (data: Partial<Skill>) =>
        request<Skill>('/skills', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Skill>) =>
        request<Skill>(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) =>
        request<{ success: boolean }>(`/skills/${id}`, { method: 'DELETE' }),
};

// ---- Settings API ----

export interface Settings {
    id: number;
    engine: string;
    apiProvider: string;
    apiKey: string;
    temperature: number;
    maxTokens: number;
    offlineMode: boolean;
}

export const settingsApi = {
    get: () => request<Settings>('/settings'),
    update: (data: Partial<Settings>) =>
        request<Settings>('/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

// ---- AI Analysis API ----

export interface AnalysisResult {
    core_concepts: string[];
    insight: string;
    steps: { title: string; content: string }[];
    summary: string;
    final_answer: string;
}

export const aiApi = {
    analyze: (image: string, prompt?: string) =>
        request<AnalysisResult>('/ai/analyze', {
            method: 'POST',
            body: JSON.stringify({ image, prompt }),
        }),
};

// ---- Upload History API ----

export interface UploadRecord {
    id: number;
    filename: string;
    sizeMb: number;
    status: string;
    createdAt: string;
}

export const uploadHistoryApi = {
    list: () => request<UploadRecord[]>('/upload-history'),
};
