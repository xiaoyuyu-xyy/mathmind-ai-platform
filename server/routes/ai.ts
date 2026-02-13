import { Router, Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';

const router = Router();

// POST /api/ai/analyze - Proxy AI analysis request
router.post('/analyze', async (req: Request, res: Response) => {
    try {
        const { image, prompt } = req.body;

        if (!image) {
            res.status(400).json({ error: 'Image data is required' });
            return;
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
            // Return mock result when no valid API key is configured
            res.json({
                core_concepts: ["分部积分法", "导数降幂", "不定积分"],
                insight: `这是一个典型的"反对数幂函数"积分模型。核心矛盾在于被积函数是多项式 x² 与指数函数 eˣ 的乘积。因为多项式求导能降低次数，而指数函数积分不变，所以直觉告诉我们：必须使用分部积分法。`,
                steps: [
                    { title: "第一阶段：建立降幂策略", content: "我们使用分部积分公式 ∫ u dv = uv - ∫ v du。\n令 u = x²，dv = eˣ dx。\n则 du = 2x dx，v = eˣ。\n代入公式得到：∫ x²eˣ dx = x²eˣ - ∫ 2x eˣ dx" },
                    { title: "第二阶段：彻底消灭多项式", content: "对剩余部分 ∫ 2x eˣ dx 再次使用分部积分。\n令 u = 2x，dv = eˣ dx。\n计算得到：2xeˣ - 2eˣ。" },
                    { title: "第三阶段：重组与验证", content: "最终结果为：eˣ(x² - 2x + 2) + C" }
                ],
                summary: "对于 ∫ P(x)eᵃˣ dx 形式的积分，使用 n 次分部积分法即可。",
                final_answer: "eˣ(x² - 2x + 2) + C"
            });
            return;
        }

        const ai = new GoogleGenAI({ apiKey });

        const defaultPrompt = prompt || `你是一位世界顶级的数学导师。请分析这道数学题目，给出详细的解题思路和步骤。请用 JSON 格式返回结果，包含以下字段：
- core_concepts: 关键考点数组
- insight: 深度洞察，解释解题的核心思路
- steps: 步骤数组，每个步骤包含 title 和 content
- summary: 举一反三的通法总结
- final_answer: 最终答案`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: image } },
                    { text: defaultPrompt }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        core_concepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                        insight: { type: Type.STRING },
                        steps: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    content: { type: Type.STRING }
                                }
                            }
                        },
                        summary: { type: Type.STRING },
                        final_answer: { type: Type.STRING }
                    }
                }
            }
        });

        if (response.text) {
            const data = JSON.parse(response.text);
            res.json(data);
        } else {
            throw new Error('No response from AI');
        }
    } catch (err: any) {
        console.error('AI Analysis Error:', err.message);
        // Return mock data on error as graceful fallback
        res.json({
            core_concepts: ["分部积分法", "导数降幂", "不定积分"],
            insight: "（AI 连接失败，使用缓存数据）这是一个典型的积分模型。",
            steps: [
                { title: "步骤一", content: "请稍后重试 AI 分析。" }
            ],
            summary: "AI 服务暂时不可用，请检查 GEMINI_API_KEY 配置。",
            final_answer: "请重试"
        });
    }
});

export default router;
