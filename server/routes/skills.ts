import { Router, Request, Response } from 'express';
import { supabase } from '../supabaseClient.js';

const router = Router();

// GET /api/skills - List skills
router.get('/', async (req: Request, res: Response) => {
    try {
        const { category } = req.query;
        let query = supabase.from('skills').select('*').order('created_at', { ascending: false });

        if (category && category !== '所有学科') {
            query = query.eq('category', category as string);
        }

        const { data, error } = await query;
        if (error) throw error;

        const skills = (data || []).map(row => ({
            id: row.id,
            category: row.category,
            color: row.color,
            title: row.title,
            description: row.description,
            formula: row.formula,
            steps: row.steps || [],
            aiAdvice: row.ai_advice || undefined,
            stats: row.stats || undefined,
            status: row.status || undefined,
            lastReview: row.last_review || undefined,
            ping: row.ping
        }));

        res.json(skills);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/skills - Create a skill
router.post('/', async (req: Request, res: Response) => {
    try {
        const { category, color, title, description, formula, steps, aiAdvice, stats } = req.body;

        const { data, error } = await supabase
            .from('skills')
            .insert({
                category,
                color: color || 'blue',
                title,
                description: description || '',
                formula: formula || '',
                steps: steps || [],
                ai_advice: aiAdvice || '',
                stats: stats || ''
            })
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/skills/:id
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const updates: any = {};
        const fieldMap: Record<string, string> = {
            category: 'category', color: 'color', title: 'title',
            description: 'description', formula: 'formula', steps: 'steps',
            aiAdvice: 'ai_advice', stats: 'stats', status: 'status',
            lastReview: 'last_review', ping: 'ping'
        };

        for (const [k, v] of Object.entries(fieldMap)) {
            if (req.body[k] !== undefined) updates[v] = req.body[k];
        }

        const { data, error } = await supabase
            .from('skills')
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

// DELETE /api/skills/:id
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { error } = await supabase.from('skills').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
