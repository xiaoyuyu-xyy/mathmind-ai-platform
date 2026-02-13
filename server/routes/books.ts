import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { supabase } from '../supabaseClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

// GET /api/books - List all books
router.get('/', async (req: Request, res: Response) => {
    try {
        const { search, category } = req.query;
        let query = supabase.from('books').select('*').order('created_at', { ascending: false });

        if (category && category !== '全部') {
            query = query.eq('category', category as string);
        }
        if (search) {
            query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
        }

        const { data, error } = await query;
        if (error) throw error;

        // Transform to frontend format
        const books = (data || []).map(row => ({
            id: row.id,
            title: row.title,
            author: row.author,
            progress: row.progress,
            tags: row.tags || [],
            coverUrl: row.cover_url,
            status: row.status,
            statusColor: row.status_color,
            nodes: row.nodes?.length ? row.nodes : undefined,
            isProcessing: row.is_processing,
            category: row.category,
            fileUrl: row.file_url || undefined
        }));

        res.json(books);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/books/:id - Get single book
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!data) { res.status(404).json({ error: 'Book not found' }); return; }

        res.json({
            id: data.id,
            title: data.title,
            author: data.author,
            progress: data.progress,
            tags: data.tags || [],
            coverUrl: data.cover_url,
            status: data.status,
            statusColor: data.status_color,
            nodes: data.nodes?.length ? data.nodes : undefined,
            isProcessing: data.is_processing,
            category: data.category,
            fileUrl: data.file_url || undefined
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/books - Create a book
router.post('/', async (req: Request, res: Response) => {
    try {
        const { title, author, tags, category, coverUrl } = req.body;
        const { data, error } = await supabase
            .from('books')
            .insert({
                title,
                author: author || '本地上传文件',
                tags: tags || ['未分类'],
                category: category || '其他',
                cover_url: coverUrl || 'https://picsum.photos/id/175/300/400',
                status: '刚刚上传',
                status_color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300',
                progress: 0,
                is_processing: false
            })
            .select()
            .single();

        if (error) throw error;
        res.status(201).json({
            id: data.id,
            title: data.title,
            author: data.author,
            progress: data.progress,
            tags: data.tags || [],
            coverUrl: data.cover_url,
            status: data.status,
            statusColor: data.status_color,
            isProcessing: data.is_processing,
            category: data.category,
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/books/upload - Upload a book file
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
        const file = req.file;
        if (!file) { res.status(400).json({ error: 'No file uploaded' }); return; }

        const fileUrl = `/uploads/${file.filename}`;
        const title = req.body.title || file.originalname.replace(/\.[^/.]+$/, '');

        const { data, error } = await supabase
            .from('books')
            .insert({
                title,
                author: '本地上传文件',
                tags: ['未分类'],
                category: '其他',
                cover_url: 'https://picsum.photos/id/175/300/400',
                status: '刚刚上传',
                status_color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300',
                progress: 0,
                is_processing: false,
                file_url: fileUrl
            })
            .select()
            .single();

        if (error) throw error;

        // Also record in upload_history
        await supabase.from('upload_history').insert({
            filename: file.originalname,
            size_mb: parseFloat((file.size / 1024 / 1024).toFixed(2)),
            status: '已解析'
        });

        res.status(201).json({
            id: data.id,
            title: data.title,
            author: data.author,
            progress: 0,
            tags: ['未分类'],
            coverUrl: data.cover_url,
            status: data.status,
            statusColor: data.status_color,
            isProcessing: false,
            category: '其他',
            fileUrl
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/books/:id - Update a book
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const updates: any = { updated_at: new Date().toISOString() };
        const fieldMap: Record<string, string> = {
            title: 'title', author: 'author', progress: 'progress',
            tags: 'tags', coverUrl: 'cover_url', status: 'status',
            statusColor: 'status_color', nodes: 'nodes',
            isProcessing: 'is_processing', category: 'category',
            fileUrl: 'file_url'
        };

        for (const [frontKey, dbKey] of Object.entries(fieldMap)) {
            if (req.body[frontKey] !== undefined) {
                updates[dbKey] = req.body[frontKey];
            }
        }

        const { data, error } = await supabase
            .from('books')
            .update(updates)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/books/:id - Delete a book
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { error } = await supabase
            .from('books')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
