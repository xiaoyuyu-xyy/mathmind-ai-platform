import { Router, Request, Response } from 'express';
import { supabase } from '../supabaseClient.js';

const router = Router();

// GET /api/books/:bookId/chapters - Get chapters with concepts for a book
router.get('/:bookId/chapters', async (req: Request, res: Response) => {
    try {
        const { bookId } = req.params;

        const { data: chapters, error } = await supabase
            .from('chapters')
            .select('*')
            .eq('book_id', bookId)
            .order('sort_order', { ascending: true });

        if (error) throw error;

        // Fetch concepts for each chapter
        const chapterIds = (chapters || []).map(c => c.id);
        const { data: concepts, error: conceptErr } = await supabase
            .from('concepts')
            .select('*')
            .in('chapter_id', chapterIds.length ? chapterIds : [0])
            .order('sort_order', { ascending: true });

        if (conceptErr) throw conceptErr;

        // Group concepts by chapter
        const conceptsByChapter = new Map<number, any[]>();
        for (const concept of (concepts || [])) {
            const list = conceptsByChapter.get(concept.chapter_id) || [];
            list.push({
                id: concept.id,
                title: concept.title,
                status: concept.status
            });
            conceptsByChapter.set(concept.chapter_id, list);
        }

        const result = (chapters || []).map((ch, idx) => ({
            id: ch.id,
            title: ch.title,
            progress: ch.progress,
            mastered: ch.mastered,
            locked: ch.locked,
            expanded: idx < 2, // Expand first 2 by default
            concepts: conceptsByChapter.get(ch.id) || undefined
        }));

        res.json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/books/:bookId/chapters - Create a chapter
router.post('/:bookId/chapters', async (req: Request, res: Response) => {
    try {
        const { bookId } = req.params;
        const { title, progress, mastered, locked, sortOrder, concepts } = req.body;

        const { data: chapter, error } = await supabase
            .from('chapters')
            .insert({
                book_id: parseInt(bookId),
                title,
                progress: progress || 0,
                mastered: mastered || false,
                locked: locked || false,
                sort_order: sortOrder || 0
            })
            .select()
            .single();

        if (error) throw error;

        // Insert concepts if provided
        if (concepts && concepts.length > 0) {
            const conceptRows = concepts.map((c: any, i: number) => ({
                chapter_id: chapter.id,
                title: c.title,
                status: c.status || 'pending',
                sort_order: i
            }));
            await supabase.from('concepts').insert(conceptRows);
        }

        res.status(201).json(chapter);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/books/:bookId/chapters/:chapterId - Update a chapter
router.put('/:bookId/chapters/:chapterId', async (req: Request, res: Response) => {
    try {
        const { chapterId } = req.params;
        const updates: any = {};

        if (req.body.title !== undefined) updates.title = req.body.title;
        if (req.body.progress !== undefined) updates.progress = req.body.progress;
        if (req.body.mastered !== undefined) updates.mastered = req.body.mastered;
        if (req.body.locked !== undefined) updates.locked = req.body.locked;

        const { data, error } = await supabase
            .from('chapters')
            .update(updates)
            .eq('id', chapterId)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/books/:bookId/chapters/:chapterId/concepts/:conceptId - Update concept status
router.put('/:bookId/chapters/:chapterId/concepts/:conceptId', async (req: Request, res: Response) => {
    try {
        const { conceptId } = req.params;
        const { status } = req.body;

        const { data, error } = await supabase
            .from('concepts')
            .update({ status })
            .eq('id', conceptId)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
