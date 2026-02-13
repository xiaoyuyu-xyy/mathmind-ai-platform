-- ============================================
-- MathMind AI Platform - Supabase Database Schema
-- ============================================

-- 教材表
CREATE TABLE IF NOT EXISTS books (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT DEFAULT '',
  progress INT DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  cover_url TEXT DEFAULT '',
  status TEXT DEFAULT '待学习',
  status_color TEXT DEFAULT 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300',
  nodes INT[] DEFAULT '{}',
  is_processing BOOLEAN DEFAULT FALSE,
  category TEXT DEFAULT '其他',
  file_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 章节表
CREATE TABLE IF NOT EXISTS chapters (
  id BIGSERIAL PRIMARY KEY,
  book_id BIGINT REFERENCES books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  progress INT DEFAULT 0,
  mastered BOOLEAN DEFAULT FALSE,
  locked BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 知识点/概念表
CREATE TABLE IF NOT EXISTS concepts (
  id BIGSERIAL PRIMARY KEY,
  chapter_id BIGINT REFERENCES chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('mastered', 'learning', 'pending')),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 错题本
CREATE TABLE IF NOT EXISTS problems (
  id BIGSERIAL PRIMARY KEY,
  display_id TEXT NOT NULL,
  content TEXT NOT NULL,
  difficulty TEXT DEFAULT '中等' CHECK (difficulty IN ('简单', '中等', '困难')),
  source TEXT DEFAULT '错题',
  tags TEXT[] DEFAULT '{}',
  date TEXT DEFAULT '',
  is_ai_variant BOOLEAN DEFAULT FALSE,
  is_selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 考卷表
CREATE TABLE IF NOT EXISTS exams (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT DEFAULT '',
  score TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'processing' CHECK (status IN ('completed', 'processing')),
  file_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 技巧卡片表
CREATE TABLE IF NOT EXISTS skills (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  color TEXT DEFAULT 'blue',
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  formula TEXT DEFAULT '',
  steps TEXT[] DEFAULT '{}',
  ai_advice TEXT DEFAULT '',
  stats TEXT DEFAULT '',
  status TEXT DEFAULT '',
  last_review TEXT DEFAULT '',
  ping BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI 引擎设置表
CREATE TABLE IF NOT EXISTS settings (
  id BIGSERIAL PRIMARY KEY,
  engine TEXT DEFAULT 'cloud',
  api_provider TEXT DEFAULT 'OpenAI (GPT-4 Turbo)',
  api_key TEXT DEFAULT '',
  temperature FLOAT DEFAULT 0.2,
  max_tokens INT DEFAULT 2048,
  offline_mode BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 上传记录表
CREATE TABLE IF NOT EXISTS upload_history (
  id BIGSERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  size_mb FLOAT DEFAULT 0,
  status TEXT DEFAULT '已解析',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 插入初始种子数据
-- ============================================

-- 初始教材
INSERT INTO books (title, author, progress, tags, cover_url, status, status_color, nodes, is_processing, category) VALUES
('高等数学（上册）', '同济大学数学系 · 第七版', 45, ARRAY['微积分', '极限'], 'https://picsum.photos/id/24/300/400', 'AI 分析完成', 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300', ARRAY[12, 8], FALSE, '数学分析'),
('工程数学：线性代数', '同济大学数学系 · 第六版', 0, ARRAY['矩阵', '向量'], 'https://picsum.photos/id/20/300/400', '处理中', 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300', '{}', TRUE, '线性代数'),
('概率论与数理统计', '浙江大学 · 第四版', 0, ARRAY['统计', '概率'], 'https://picsum.photos/id/250/300/400', '待学习', 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300', '{}', FALSE, '概率论'),
('离散数学及其应用', 'Rosen · 第八版', 85, ARRAY['逻辑', '图论'], 'https://picsum.photos/id/134/300/400', '深度掌握', 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300', ARRAY[42], FALSE, '其他');

-- 为第一本书插入章节和知识点
INSERT INTO chapters (book_id, title, progress, mastered, locked, sort_order) VALUES
(1, '函数与极限', 100, TRUE, FALSE, 1),
(1, '导数与微分', 80, FALSE, FALSE, 2),
(1, '微分中值定理与导数的应用', 10, FALSE, FALSE, 3),
(1, '不定积分', 0, FALSE, TRUE, 4),
(1, '定积分', 0, FALSE, TRUE, 5);

INSERT INTO concepts (chapter_id, title, status, sort_order) VALUES
(1, '映射与函数', 'mastered', 1),
(1, '数列的极限', 'mastered', 2),
(1, '函数的极限', 'mastered', 3),
(1, '无穷小与无穷大', 'mastered', 4),
(1, '极限运算法则', 'mastered', 5),
(2, '导数概念', 'mastered', 1),
(2, '函数的求导法则', 'mastered', 2),
(2, '高阶导数', 'learning', 3),
(2, '隐函数及由参数方程所确定的函数的导数', 'learning', 4),
(3, '微分中值定理', 'learning', 1),
(3, '洛必达法则', 'pending', 2),
(3, '泰勒公式', 'pending', 3);

-- 初始错题
INSERT INTO problems (display_id, content, difficulty, source, tags, date, is_ai_variant, is_selected) VALUES
('#9821', '已知函数 f(x) = ln x - ax 在区间 (1, 2) 上单调递增，求实数 a 的取值范围。', '困难', '错题', ARRAY['导数应用', '单调性'], '2023-10-24', FALSE, TRUE),
('AI-8820', '若函数 g(x) = x³ - 3bx + 1 在 x=1 处取得极值，求 b 的值。', '中等', 'AI 变式', ARRAY['极值点', '多项式函数'], '刚刚', TRUE, TRUE),
('#9823', '在 △ABC 中，已知 A = π/3，b=4，△ABC 的面积为 4√3，求 c 的值。', '困难', '错题', ARRAY['余弦定理', '三角形面积'], '昨天', FALSE, TRUE),
('AI-5521', '数列 {aₙ} 满足 a₁=1, aₙ₊₁ = 2aₙ + 1，求通项公式 aₙ。', '中等', 'AI 变式', ARRAY['数列递推', '等比数列'], '3天前', TRUE, FALSE);

-- 初始考卷
INSERT INTO exams (title, date, score, tags, status) VALUES
('2023年高等数学期末模拟卷A', '2023-10-24', '85/100', ARRAY['微积分', '极限', '导数'], 'completed'),
('线性代数第一次月考', '2023-09-15', '92/100', ARRAY['矩阵', '行列式'], 'completed'),
('概率论期中测试', '2023-11-02', '待分析', ARRAY['概率', '随机变量'], 'processing');

-- 初始技巧卡片
INSERT INTO skills (category, color, title, description, formula, steps, ai_advice, stats, status, last_review, ping) VALUES
('微积分 II', 'blue', '泰勒级数展开', '利用多项式逼近函数。', 'f(x) = Σ f⁽ⁿ⁾(a)/n! · (x-a)ⁿ', ARRAY['求 a 点的导数', '代入公式计算'], '', '已在 12 道题中使用', '', '', FALSE),
('极限', 'amber', '洛必达法则', '解决 0/0 等不定式极限问题。', 'lim f(x)/g(x) = lim f''(x)/g''(x)', '{}', '在习题集 #4 出错后建议', '', '高度掌握', '', TRUE),
('线性代数', 'purple', '特征值与特征向量', '确定矩阵的不变方向。', 'Av = λv, det(A - λI) = 0', ARRAY['计算特征多项式', '求根得到特征值'], '', '', '', '上次复习于 2 天前', FALSE),
('最优化', 'emerald', '梯度下降法', '迭代优化算法。', 'xₙ₊₁ = xₙ − γ∇F(xₙ)', '{}', '即将到来的考试中的高频考点', '已在 8 道题中使用', '', '', FALSE),
('统计学', 'pink', '贝叶斯定理', '基于先验条件计算事件概率。', 'P(A|B) = P(B|A)P(A) / P(B)', ARRAY['确定先验概率 P(A)', '计算似然度 P(B|A)'], '', '', '需要复习', '', FALSE);

-- 默认设置
INSERT INTO settings (engine, api_provider, api_key, temperature, max_tokens, offline_mode) VALUES
('cloud', 'OpenAI (GPT-4 Turbo)', 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 0.2, 2048, FALSE);

-- 上传历史
INSERT INTO upload_history (filename, size_mb, status, created_at) VALUES
('高等数学_同济第七版_1.pdf', 24.6, '已解析', '2023-10-20'),
('高等数学_同济第七版_2.pdf', 24.7, '已解析', '2023-10-21'),
('高等数学_同济第七版_3.pdf', 24.8, '已解析', '2023-10-22'),
('高等数学_同济第七版_4.pdf', 24.9, '已解析', '2023-10-23'),
('高等数学_同济第七版_5.pdf', 25.0, '已解析', '2023-10-24');
