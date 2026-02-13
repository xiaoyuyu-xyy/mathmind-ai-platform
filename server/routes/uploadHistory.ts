import { Router, Request, Response } from 'express';
import { supabase } from '../supabaseClient.js';

const router = Router();

// GET /api/upload-history - List upload history
router.get('/', async (_req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('upload_history')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const history = (data || []).map(row => ({
            id: row.id,
            filename: row.filename,
            sizeMb: row.size_mb,
            status: row.status,
            createdAt: row.created_at
        }));

        res.json(history);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
