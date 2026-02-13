import { Router, Request, Response } from 'express';
import { supabase } from '../supabaseClient.js';

const router = Router();

// GET /api/exams - List exams
router.get('/', async (req: Request, res: Response) => {
    try {
        const { search } = req.query;
        let query = supabase.from('exams').select('*').order('created_at', { ascending: false });

        if (search) {
            query = query.ilike('title', `%${search}%`);
        }

        const { data, error } = await query;
        if (error) throw error;

        const exams = (data || []).map(row => ({
            id: row.id,
            title: row.title,
            date: row.date,
            score: row.score,
            tags: row.tags || [],
            status: row.status
        }));

        res.json(exams);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/exams/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('exams')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/exams - Create exam
router.post('/', async (req: Request, res: Response) => {
    try {
        const { title, date, score, tags, status } = req.body;

        const { data, error } = await supabase
            .from('exams')
            .insert({
                title: title || '新试卷',
                date: date || new Date().toLocaleDateString('zh-CN'),
                score: score || '待分析',
                tags: tags || [],
                status: status || 'processing'
            })
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/exams/:id
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const updates: any = {};
        if (req.body.title !== undefined) updates.title = req.body.title;
        if (req.body.score !== undefined) updates.score = req.body.score;
        if (req.body.status !== undefined) updates.status = req.body.status;
        if (req.body.tags !== undefined) updates.tags = req.body.tags;

        const { data, error } = await supabase
            .from('exams')
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

export default router;
