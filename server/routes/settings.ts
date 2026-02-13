import { Router, Request, Response } from 'express';
import { supabase } from '../supabaseClient.js';

const router = Router();

// GET /api/settings - Get current settings
router.get('/', async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .order('id', { ascending: true })
            .limit(1)
            .single();

        if (error) throw error;

        res.json({
            id: data.id,
            engine: data.engine,
            apiProvider: data.api_provider,
            apiKey: data.api_key,
            temperature: data.temperature,
            maxTokens: data.max_tokens,
            offlineMode: data.offline_mode
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/settings - Update settings
router.put('/', async (req: Request, res: Response) => {
    try {
        const updates: any = { updated_at: new Date().toISOString() };
        const fieldMap: Record<string, string> = {
            engine: 'engine',
            apiProvider: 'api_provider',
            apiKey: 'api_key',
            temperature: 'temperature',
            maxTokens: 'max_tokens',
            offlineMode: 'offline_mode'
        };

        for (const [k, v] of Object.entries(fieldMap)) {
            if (req.body[k] !== undefined) updates[v] = req.body[k];
        }

        // Get the first settings row id
        const { data: existing } = await supabase
            .from('settings')
            .select('id')
            .order('id', { ascending: true })
            .limit(1)
            .single();

        if (!existing) {
            // Create if doesn't exist
            const { data, error } = await supabase
                .from('settings')
                .insert(updates)
                .select()
                .single();
            if (error) throw error;
            res.json(data);
            return;
        }

        const { data, error } = await supabase
            .from('settings')
            .update(updates)
            .eq('id', existing.id)
            .select()
            .single();

        if (error) throw error;
        res.json({
            id: data.id,
            engine: data.engine,
            apiProvider: data.api_provider,
            apiKey: data.api_key,
            temperature: data.temperature,
            maxTokens: data.max_tokens,
            offlineMode: data.offline_mode
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
