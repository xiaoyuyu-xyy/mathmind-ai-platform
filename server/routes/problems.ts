import { Router, Request, Response } from 'express';
import { supabase } from '../supabaseClient.js';

const router = Router();

// GET /api/problems - List problems
router.get('/', async (req: Request, res: Response) => {
    try {
        const { difficulty, source } = req.query;
        let query = supabase.from('problems').select('*').order('created_at', { ascending: false });

        if (difficulty && difficulty !== '全部难度') {
            query = query.eq('difficulty', difficulty as string);
        }
        if (source && source !== '全部来源') {
            if (source === '错题集') query = query.eq('is_ai_variant', false);
            if (source === 'AI 变式') query = query.eq('is_ai_variant', true);
        }

        const { data, error } = await query;
        if (error) throw error;

        const problems = (data || []).map(row => ({
            id: row.id,
            displayId: row.display_id,
            content: row.content,
            difficulty: row.difficulty,
            source: row.source,
            tags: row.tags || [],
            date: row.date,
            isAiVariant: row.is_ai_variant,
            isSelected: row.is_selected
        }));

        res.json(problems);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/problems - Create a problem
router.post('/', async (req: Request, res: Response) => {
    try {
        const { displayId, content, difficulty, source, tags, date, isAiVariant } = req.body;

        const { data, error } = await supabase
            .from('problems')
            .insert({
                display_id: displayId || `#${Date.now()}`,
                content,
                difficulty: difficulty || '中等',
                source: source || '错题',
                tags: tags || [],
                date: date || new Date().toLocaleDateString('zh-CN'),
                is_ai_variant: isAiVariant || false,
                is_selected: false
            })
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/problems/:id - Update a problem
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const updates: any = {};
        if (req.body.isSelected !== undefined) updates.is_selected = req.body.isSelected;
        if (req.body.content !== undefined) updates.content = req.body.content;
        if (req.body.tags !== undefined) updates.tags = req.body.tags;

        const { data, error } = await supabase
            .from('problems')
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

// DELETE /api/problems/:id
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { error } = await supabase.from('problems').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
