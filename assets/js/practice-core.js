/* =======================================================================
   练习中心 · 共享数据层（assets/js/practice-core.js）
   —— 以普通全局 <script> 方式加载（非 ES module，不使用 export）
   —— 提供：题库与方案数据常量、无 UI 依赖的辅助函数、resolvePlan 便捷函数
   —— 页面级状态（state）由各页面自行维护，不在此定义
   ======================================================================= */

/* ---- 高职提招院校校测形式表：值为 true 表示校测含面试 ---- */
var GAOZHI_INTERVIEW_SCHOOLS = {
  '金华职业技术学院': true,
  '浙江师范高等专科学校': true,
  '杭州职业技术学院': true,
  '宁波卫生职业技术学院': true,
  '绍兴职业技术学院': true
};

/* ---- 示例方案（当 localStorage 无真实方案时兜底，与「我的方案」列表一致） ---- */
var DEMO_PLANS = [
  {
    id: 'demo-zjut', name: '浙江工业大学 · 三位一体', planType: '三位一体', generatedAt: '2026-08-12 14:30', score: '优秀',
    majors: [
      { school: '浙江工业大学', major: '计算机类', needsInterview: true, testForm: '综合素质测试（含面试）' },
      { school: '浙江工业大学', major: '电子信息类', needsInterview: true, testForm: '综合素质测试（含面试）' },
      { school: '浙江工业大学', major: '机械工程', needsInterview: true, testForm: '综合素质测试（含面试）' },
      { school: '浙江工业大学', major: '汉语言文学', needsInterview: true, testForm: '综合素质测试（含面试）' }
    ]
  },
  {
    id: 'demo-zjnu', name: '浙江师范大学 · 三位一体', planType: '三位一体', generatedAt: '2026-08-10 09:15', score: '良好',
    majors: [
      { school: '浙江师范大学', major: '汉语言文学', needsInterview: true, testForm: '综合素质测试（含面试）' },
      { school: '浙江师范大学', major: '数学与应用数学', needsInterview: true, testForm: '综合素质测试（含面试）' },
      { school: '浙江师范大学', major: '英语', needsInterview: true, testForm: '综合素质测试（含面试）' }
    ]
  },
  {
    id: 'demo-gaozhi', name: '宁波大学 · 高职提前招生', planType: '高职提招', generatedAt: '2026-08-08 16:45', score: '合格',
    majors: [
      { school: '金华职业技术学院', major: '计算机应用技术', needsInterview: true, testForm: '职业适应性测试（含面试）' },
      { school: '杭州职业技术学院', major: '电子商务', needsInterview: true, testForm: '职业适应性测试（含面试）' },
      { school: '浙江金融职业学院', major: '金融管理', needsInterview: false, testForm: '职业适应性测试（仅笔试）' },
      { school: '宁波职业技术学院', major: '物流管理', needsInterview: false, testForm: '职业适应性测试（仅笔试）' }
    ]
  },
  {
    id: 'demo-gaozhi-written', name: '浙江金融职业学院 · 高职提招（笔试）', planType: '高职提招', generatedAt: '2026-08-05 10:20', score: '需优化',
    majors: [
      { school: '浙江金融职业学院', major: '金融管理', needsInterview: false, testForm: '职业适应性测试（仅笔试）' },
      { school: '浙江金融职业学院', major: '会计', needsInterview: false, testForm: '职业适应性测试（仅笔试）' },
      { school: '宁波职业技术学院', major: '物流管理', needsInterview: false, testForm: '职业适应性测试（仅笔试）' }
    ]
  },
  {
    id: 'demo-interview-only', name: '上海交通大学 · 综合评价（面试）', planType: '综合评价', generatedAt: '2026-08-03 09:00', score: '冲刺',
    majors: [
      { school: '上海交通大学', major: '计算机科学与技术', needsInterview: true, needsWritten: false, testForm: '综合面试（无笔试）' },
      { school: '上海交通大学', major: '电子信息工程', needsInterview: true, needsWritten: false, testForm: '综合面试（无笔试）' },
      { school: '上海交通大学', major: '机械工程', needsInterview: true, needsWritten: false, testForm: '综合面试（无笔试）' },
      { school: '上海交通大学', major: '生物医学工程', needsInterview: true, needsWritten: false, testForm: '综合面试（无笔试）' }
    ]
  }
];

/* ---- 笔试题库（单选 / 多选） ---- */
var WRITTEN_POOL = [
  { type: 'single', subject: '数学', difficulty: '中',
    stem: '已知函数 f(x) = x² - 2x + 3，则 f(x) 的最小值为（ ）',
    options: [{ k: 'A', t: '1' }, { k: 'B', t: '2' }, { k: 'C', t: '3' }, { k: 'D', t: '4' }], answer: ['B'],
    analysis: 'f(x) = x² - 2x + 3 配方得 f(x) = (x - 1)² + 2。二次项系数为正，开口向上，在顶点 x = 1 处取得最小值 2，故选 B。',
    tips: '① 识别为二次函数；② 配方化为顶点式；③ 由开口方向判断最值；④ 取顶点纵坐标。' },
  { type: 'single', subject: '数学', difficulty: '易',
    stem: '等差数列 {aₙ} 中，a₁ = 1，公差 d = 2，则 a₁₀ = （ ）',
    options: [{ k: 'A', t: '17' }, { k: 'B', t: '18' }, { k: 'C', t: '19' }, { k: 'D', t: '20' }], answer: ['C'],
    analysis: '由通项公式 aₙ = a₁ + (n - 1)d，得 a₁₀ = 1 + 9 × 2 = 19，故选 C。',
    tips: '记住等差通项公式 aₙ = a₁ + (n−1)d，直接代入即可。' },
  { type: 'single', subject: '数学', difficulty: '难',
    stem: '等比数列 {aₙ} 中，a₁ = 2，公比 q = 3，则前 4 项和 S₄ = （ ）',
    options: [{ k: 'A', t: '78' }, { k: 'B', t: '80' }, { k: 'C', t: '81' }, { k: 'D', t: '84' }], answer: ['B'],
    analysis: '逐项相加：2 + 6 + 18 + 54 = 80；也可用公式 S₄ = a₁(1 − q⁴)/(1 − q) = 2 × (1 − 81)/(1 − 3) = 80，故选 B。',
    tips: '项数较少时逐项相加更稳妥；项数多时用等比求和公式。' },
  { type: 'single', subject: '逻辑推理', difficulty: '中',
    stem: '若 A > B，且 B > C，则以下哪项必然成立？（ ）',
    options: [{ k: 'A', t: 'A > C' }, { k: 'B', t: 'A < C' }, { k: 'C', t: 'A = C' }, { k: 'D', t: '无法确定' }], answer: ['A'],
    analysis: '由不等式的传递性，A > B 且 B > C 可得 A > C，故选 A。',
    tips: '不等号同向可传递，这是大小关系推理的基本性质。' },
  { type: 'single', subject: '逻辑推理', difficulty: '难',
    stem: '甲、乙、丙三人中只有一人说真话。甲说：“乙在说谎。”乙说：“丙在说谎。”丙说：“甲和乙都在说谎。”谁说的是真话？（ ）',
    options: [{ k: 'A', t: '甲' }, { k: 'B', t: '乙' }, { k: 'C', t: '丙' }, { k: 'D', t: '无法确定' }], answer: ['C'],
    analysis: '假设丙说真话，则甲、乙都说谎，与“只有一人说真话”一致；此时甲说“乙说谎”为假（即乙说真话）会矛盾。逐一枚举可验证，只有丙为真时自洽，故选 C。',
    tips: '真假话题用“假设法”逐个代入，找到唯一自洽的情形。' },
  { type: 'single', subject: '语言表达', difficulty: '易',
    stem: '下列句子中没有语病的一项是（ ）',
    options: [
      { k: 'A', t: '通过这次活动，使我明白了团队合作的重要性。' },
      { k: 'B', t: '学校采取了各种办法，防止校园欺凌事件不再发生。' },
      { k: 'C', t: '阅读经典能够提升我们的思维能力和人文素养。' },
      { k: 'D', t: '我们要认真克服并随时发现自己的缺点。' }
    ], answer: ['C'],
    analysis: 'A 项“通过……使……”导致主语残缺；B 项“防止……不再发生”否定不当；D 项“克服并发现”语序不当，应为“发现并克服”。C 项没有语病，故选 C。',
    tips: '病句常见类型：成分残缺、否定不当、语序不当、搭配不当，逐项排查即可。' },
  { type: 'single', subject: '数量关系', difficulty: '中',
    stem: '某校校测合格率为 60%，今年有 1200 人报名，预计约有多少人入围？（ ）',
    options: [{ k: 'A', t: '600 人' }, { k: 'B', t: '720 人' }, { k: 'C', t: '840 人' }, { k: 'D', t: '960 人' }], answer: ['B'],
    analysis: '1200 × 60% = 720，预计约 720 人入围，故选 B。',
    tips: '百分数计算先把百分数化为小数，再与总量相乘。' },
  { type: 'single', subject: '时事政治', difficulty: '易',
    stem: '关于“新质生产力”，下列说法正确的是（ ）',
    options: [
      { k: 'A', t: '以科技创新为核心驱动，强调高科技、高效能、高质量' },
      { k: 'B', t: '仅指传统制造业的规模扩张' },
      { k: 'C', t: '与绿色发展没有关系' },
      { k: 'D', t: '主要依靠增加劳动力投入实现增长' }
    ], answer: ['A'],
    analysis: '新质生产力以科技创新为核心驱动力，具有高科技、高效能、高质量特征，并与绿色发展密切相关，故选 A。',
    tips: '时政类题目抓住“创新驱动”“高质量发展”两个关键词。' },
  { type: 'single', subject: '综合素养', difficulty: '中',
    stem: '面试中遇到完全不熟悉的专业问题时，最恰当的做法是（ ）',
    options: [
      { k: 'A', t: '胡乱编造一个答案，避免冷场' },
      { k: 'B', t: '直接回答“不知道”后沉默' },
      { k: 'C', t: '诚实说明，并尝试从相关角度进行分析' },
      { k: 'D', t: '转移话题，谈自己擅长的问题' }
    ], answer: ['C'],
    analysis: '考官更看重思维过程与诚实态度。坦诚说明并尝试从相关角度分析，能体现应变与思考能力，故选 C。',
    tips: '遇到不会的问题：承认 + 迁移思考 + 表达学习意愿。' },
  { type: 'single', subject: '英语', difficulty: '中',
    stem: 'Choose the sentence with correct grammar.（ ）',
    options: [
      { k: 'A', t: 'He suggested me to take part in the activity.' },
      { k: 'B', t: 'He suggested that I should take part in the activity.' },
      { k: 'C', t: 'He suggested me taking part in the activity.' },
      { k: 'D', t: 'He suggested to take part in the activity for me.' }
    ], answer: ['B'],
    analysis: 'suggest 后不接“sb. to do”，常用 “suggest that + 主语 + (should) do” 或 “suggest doing”。B 项符合搭配，故选 B。',
    tips: '牢记 suggest 的两种正确结构：suggest doing / suggest that … (should) do。' },
  { type: 'single', subject: '物理', difficulty: '中',
    stem: '一物体做匀速直线运动，下列说法正确的是（ ）',
    options: [
      { k: 'A', t: '物体所受合力为零' },
      { k: 'B', t: '物体一定不受任何力' },
      { k: 'C', t: '物体的速度不断增大' },
      { k: 'D', t: '物体的加速度不断增大' }
    ], answer: ['A'],
    analysis: '匀速直线运动是平衡状态，速度大小方向均不变，加速度为零，所受合力为零，故选 A。',
    tips: '平衡状态 ⇔ 合力为零 ⇔ 静止或匀速直线运动。' },
  { type: 'single', subject: '化学', difficulty: '易',
    stem: '下列变化中属于化学变化的是（ ）',
    options: [{ k: 'A', t: '冰雪融化' }, { k: 'B', t: '铁生锈' }, { k: 'C', t: '水分蒸发' }, { k: 'D', t: '玻璃破碎' }], answer: ['B'],
    analysis: '铁生锈生成了新物质氧化铁，属于化学变化；其余均为物理变化，故选 B。',
    tips: '判断依据：是否生成新物质。' },
  { type: 'multi', subject: '逻辑推理', difficulty: '中',
    stem: '下列关于命题推理的说法，正确的有（ ）',
    options: [
      { k: 'A', t: '原命题与其逆否命题等价' },
      { k: 'B', t: '“有些 A 不是 B”与“所有 A 都是 B”可以同时为真' },
      { k: 'C', t: '“并非所有 A 都是 B”等价于“有些 A 不是 B”' },
      { k: 'D', t: '若“所有 A 都是 B”为真，则“有些 B 是 A”不一定为真' }
    ], answer: ['A', 'C', 'D'],
    analysis: 'A 项原命题与逆否命题等价，正确；B 项两者互为矛盾，不能同真，错误；C 项量词否定等价，正确；D 项当 A 为空集时“有些 B 是 A”为假，故“不一定为真”，正确。故答案为 A、C、D。',
    tips: '量词否定：全称的否定是存在否定，存在的否定是全称否定。' },
  { type: 'multi', subject: '时事政治', difficulty: '中',
    stem: '关于“高质量发展”，下列表述正确的有（ ）',
    options: [
      { k: 'A', t: '要把发展质量问题摆在更为突出的位置' },
      { k: 'B', t: '强调创新成为第一动力' },
      { k: 'C', t: '坚持绿色成为普遍形态' },
      { k: 'D', t: '以牺牲生态环境换取短期增长' }
    ], answer: ['A', 'B', 'C'],
    analysis: '高质量发展强调创新、协调、绿色、开放、共享，D 项与绿色发展理念相悖，故答案为 A、B、C。',
    tips: '新发展理念五个关键词：创新、协调、绿色、开放、共享。' },
  { type: 'multi', subject: '综合素养', difficulty: '中',
    stem: '在小组合作学习中，下列做法有利于团队协作的有（ ）',
    options: [
      { k: 'A', t: '认真倾听他人观点后再表达意见' },
      { k: 'B', t: '主动承担自己擅长的任务' },
      { k: 'C', t: '遇到分歧时坚持己见，拒绝沟通' },
      { k: 'D', t: '及时向同伴反馈进度与困难' }
    ], answer: ['A', 'B', 'D'],
    analysis: '倾听、分工、反馈都是有效协作行为；C 项拒绝沟通不利于团队合作，故答案为 A、B、D。',
    tips: '团队协作三要素：倾听、分工、反馈。' },
  { type: 'multi', subject: '数学', difficulty: '中',
    stem: '下列函数中，在 R 上为增函数的有（ ）',
    options: [
      { k: 'A', t: 'y = x + 1' },
      { k: 'B', t: 'y = x³' },
      { k: 'C', t: 'y = -x' },
      { k: 'D', t: 'y = x²' }
    ], answer: ['A', 'B'],
    analysis: 'y = x + 1 与 y = x³ 在 R 上单调递增；y = -x 在 R 上递减；y = x² 在 R 上不单调，故答案为 A、B。',
    tips: '判断单调性要注意定义域；y = x² 在 R 上先减后增。' }
];

/* ---- 面试题库 ---- */
var INTERVIEW_POOL = [
  { topic: '自我介绍', question: '请用 1 分钟向考官介绍你自己，突出与报考专业相关的经历。', tips: '结构：基本信息 + 专业相关经历 + 报考理由，控制在 3 层意思内。' },
  { topic: '专业认知', question: '你为什么报考本专业？谈谈你对这个专业的理解与未来设想。', tips: '从兴趣来源、专业内涵、职业方向三个角度组织答案。' },
  { topic: '综合素质', question: '谈谈你对“内卷”与“躺平”的看法，并结合你的学习经历。', tips: '先界定概念，再表明立场，最后给出自己的行动选择。' },
  { topic: '时事热点', question: '请谈谈“新质生产力”对青年学生成长发展的启示。', tips: '结合创新驱动、终身学习、跨学科能力展开。' },
  { topic: '逻辑思维', question: '如果团队中两名成员产生严重分歧，你作为组长会如何处理？', tips: '按“倾听—找共识—定方案—跟进”四步回答。' },
  { topic: '职业规划', question: '进入大学后的四年，你打算如何规划自己的学习与发展？', tips: '分学年阐述，体现目标清晰的成长路径。' },
  { topic: '抗压能力', question: '请描述一次你面对挫折并走出困境的经历，你收获了什么？', tips: '用 STAR 法：情境、任务、行动、结果。' },
  { topic: '创新实践', question: '请举例说明你参与过的一次创新或实践活动，你的收获是什么？', tips: '突出你的具体贡献与可迁移能力。' }
];

/* ---- 面试基础视频课程 ---- */
var VIDEO_COURSES = [
  { title: '面试礼仪与仪态基础', duration: '08:32',
    desc: '从进场问候、坐姿、眼神交流到肢体语言，帮你建立良好的第一印象。',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20interview%20etiquette%20training%20cover%2C%20confident%20young%20Chinese%20student%20sitting%20upright%20for%20an%20interview%2C%20clean%20studio%20background%2C%20soft%20teal%20color%20tone%2C%20modern%20flat%20illustration%2C%20no%20text&image_size=landscape_4_3' },
  { title: '自我介绍的结构化表达', duration: '12:10',
    desc: '掌握“身份—优势—匹配”三段式模板，一分钟讲清楚你是谁、你适合什么。',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=structured%20self%20introduction%20coaching%20cover%2C%20confident%20student%20speaking%20into%20a%20microphone%2C%20minimal%20flat%20illustration%2C%20teal%20and%20white%20palette%2C%20no%20text&image_size=landscape_4_3' },
  { title: '专业认知类问题答题框架', duration: '15:45',
    desc: '拆解“专业理解 / 报考动机 / 发展规划”三类高频问题的答题逻辑。',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mind%20map%20and%20answer%20framework%20for%20major%20related%20interview%20questions%2C%20clean%20flat%20vector%20illustration%2C%20teal%20accents%2C%20white%20background%2C%20no%20text&image_size=landscape_4_3' },
  { title: '时事热点类问题快速破题', duration: '10:20',
    desc: '教你用“背景—内涵—意义—行动”四步法快速组织时政类答题结构。',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=news%20and%20current%20affairs%20discussion%20cover%2C%20newspaper%20and%20globe%20icons%2C%20clean%20flat%20vector%20illustration%2C%20teal%20accent%2C%20white%20background%2C%20no%20text&image_size=landscape_4_3' },
  { title: '无领导小组讨论入门', duration: '18:05',
    desc: '了解无领导小组讨论的角色定位、发言时机与团队贡献方式。',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=group%20discussion%20round%20table%20with%20several%20students%2C%20clean%20flat%20illustration%2C%20teal%20palette%2C%20white%20background%2C%20no%20text&image_size=landscape_4_3' },
  { title: '面试常见失误与避坑', duration: '06:40',
    desc: '盘点紧张、跑题、答非所问等常见失误，并给出可操作的改进建议。',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=common%20interview%20mistakes%20concept%20cover%2C%20warning%20sign%20and%20checklist%20icons%2C%20flat%20vector%20illustration%2C%20teal%20and%20amber%20palette%2C%20no%20text&image_size=landscape_4_3' }
];

/* =======================================================================
   数据层
   ======================================================================= */
var MAX_MAJORS = 10;
var PLAN_STORE_KEY = 'practice-selected-plan';
var PROGRESS_STORE_KEY = 'practice-progress';

function readJSON(key) {
  try { var v = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(v) ? v : []; }
  catch (e) { return []; }
}
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function refreshIcons() { if (window.lucide) { try { lucide.createIcons(); } catch (e) {} } }

/* 将真实方案数据归一化为 majors 列表 */
function normalizeSanyi(items) {
  return items.map(function (it) {
    return {
      school: it.schoolName || it.school || '',
      major: it.groupName ? it.groupName : (it.majors || []).join('、'),
      needsInterview: true,
      testForm: '综合素质测试（含面试）'
    };
  }).filter(function (m) { return m.school; });
}
function normalizeGaozhi(items) {
  return items.map(function (it) {
    var school = it.school || it.schoolName || '';
    var major = it.major || (it.majors || []).join('、') || '';
    var needs = !!GAOZHI_INTERVIEW_SCHOOLS[school];
    return { school: school, major: major, needsInterview: needs, testForm: needs ? '职业适应性测试（含面试）' : '职业适应性测试（仅笔试）' };
  }).filter(function (m) { return m.school; });
}

/* 汇总所有可用方案：优先真实数据，否则用示例方案 */
function loadPlans() {
  var plans = [];
  var sanyi = normalizeSanyi(readJSON('edu_plan_selected_majors'));
  if (sanyi.length) {
    plans.push({ id: 'sanyi', name: '三位一体志愿方案', planType: '三位一体', generatedAt: '已保存', score: '', majors: sanyi, real: true });
  }
  var gaozhi = normalizeGaozhi(readJSON('gaozhi-saved-majors'));
  if (gaozhi.length) {
    plans.push({ id: 'gaozhi', name: '高职提招志愿方案', planType: '高职提招', generatedAt: '已保存', score: '', majors: gaozhi, real: true });
  }
  if (!plans.length) {
    plans = DEMO_PLANS.map(function (p) {
      return { id: p.id, name: p.name, planType: p.planType, generatedAt: p.generatedAt, score: p.score, majors: p.majors.slice(), real: false };
    });
  }
  return plans;
}

/* 依据方案生成笔试题 */
function buildWritten(plan) {
  /* 只对明确需要笔试的专业出题；未显式标注 needsWritten 的专业默认需要笔试（兼容既有方案） */
  var majors = plan.majors.slice(0, MAX_MAJORS).filter(function (m) {
    return m.needsWritten !== false;
  });
  var out = [];
  majors.forEach(function (m, i) {
    for (var k = 0; k < 3; k++) {
      var base = WRITTEN_POOL[(i * 2 + k) % WRITTEN_POOL.length];
      out.push({
        id: plan.id + '-w-' + i + '-' + k, type: base.type, subject: base.subject, difficulty: base.difficulty,
        stem: base.stem, options: base.options, answer: base.answer, analysis: base.analysis, tips: base.tips,
        school: m.school, major: m.major
      });
    }
  });
  return out;
}

/* 依据方案生成面试题
   —— 不传 opts：沿用「每所院校 2 题」的概览题单
   —— 传 opts.school：按面试配置（时长折算题量 + 题型配比）生成一场面试的题目序列 */
function buildInterview(plan, opts) {
  opts = opts || {};
  var majors = plan.majors.slice(0, MAX_MAJORS);
  if (opts.school) {
    var target = majors.filter(function (m) {
      return m.school === opts.school && (m.major || '') === (opts.major || '');
    })[0] || majors.filter(function (m) { return m.school === opts.school; })[0] ||
      { school: opts.school, major: opts.major || '' };
    var prefix = plan.id + '-q-' + (opts.major || 'all');
    return weightedInterviewQuestions(target, opts.count || 6, opts.ratioKey, prefix);
  }
  var out = [];
  majors.forEach(function (m, i) {
    for (var k = 0; k < 2; k++) {
      var base = INTERVIEW_POOL[(i + k) % INTERVIEW_POOL.length];
      out.push({
        id: plan.id + '-i-' + i + '-' + k, school: m.school, major: m.major,
        topic: base.topic, question: base.question, tips: base.tips
      });
    }
  });
  return out;
}

/* 按题型配比抽题：高权重题型出现次数更多，权重用尽后按题库顺序补齐 */
function weightedInterviewQuestions(target, count, ratioKey, idPrefix) {
  var weights = TOPIC_WEIGHTS[ratioKey] || TOPIC_WEIGHTS.balanced;
  var out = [];
  function makeItem(base, idx) {
    return {
      id: idPrefix + '-i-' + idx, school: target.school, major: target.major || '',
      topic: base.topic, question: base.question, tips: base.tips
    };
  }
  function usedCount(topic) {
    var n = 0;
    out.forEach(function (o) { if (o.topic === topic) n++; });
    return n;
  }
  var guard = 0;
  while (out.length < count && guard++ < 50) {
    var picked = false;
    for (var i = 0; i < INTERVIEW_POOL.length && out.length < count; i++) {
      var base = INTERVIEW_POOL[i];
      if (usedCount(base.topic) >= (weights[base.topic] || 1)) continue;
      out.push(makeItem(base, out.length));
      picked = true;
    }
    if (!picked) break;
  }
  var k = 0;
  while (out.length < count && k < 30) {
    out.push(makeItem(INTERVIEW_POOL[k % INTERVIEW_POOL.length], out.length));
    k++;
  }
  return out;
}

/* ---- 进度 / 错题 / 收藏 持久化 ---- */
function loadAllProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_STORE_KEY) || '{}') || {}; } catch (e) { return {}; }
}
function saveAllProgress(all) { localStorage.setItem(PROGRESS_STORE_KEY, JSON.stringify(all)); }
function getProg(planId) {
  var all = loadAllProgress();
  return all[planId] || { done: 0, correct: 0, wrong: [], fav: [], sessions: 0, scores: [], answered: {} };
}
function setProg(planId, obj) {
  var all = loadAllProgress();
  all[planId] = obj;
  saveAllProgress(all);
}

function planHasInterview(plan) { return plan.majors.some(function (m) { return m.needsInterview; }); }
function planHasWritten(plan) { return plan.majors.some(function (m) { return m.needsWritten !== false; }); }
function planWrittenCount(plan) { return plan.majors.filter(function (m) { return m.needsWritten !== false; }).length * 3; }
function planInterviewCount(plan) { return Math.min(plan.majors.length, MAX_MAJORS) * 2; }

/* 读取当前已选方案；planId 为空时取 localStorage 中记录的那个 */
function resolvePlan(planId) {
  var plans = loadPlans();
  var id = planId || localStorage.getItem(PLAN_STORE_KEY);
  if (!id) return null;
  return plans.filter(function (p) { return p.id === id; })[0] || null;
}

/* =======================================================================
   面试模块：配置项 / 追问库 / 示范库 / 评分 / 练习记录
   ======================================================================= */
var INTERVIEW_CONFIG_KEY = 'interview-config';
var INTERVIEW_RECORD_KEY = 'interview-records';

/* ---- 面试模式 ---- */
var INTERVIEW_MODES = [
  { key: 'video', label: '视频模式', icon: 'video', desc: '开启摄像头，数字人面对面沟通，最接近真实考场（推荐）' },
  { key: 'voice', label: '语音模式', icon: 'mic', desc: '关闭摄像头，保留考官口播与语音作答，适合网络较弱的环境' },
  { key: 'text', label: '文字模式', icon: 'keyboard', desc: '键盘作答，关闭摄像头与考官语音，适合设备受限时' }
];

/* ---- 面试时长（按每题约 2.5 分钟折算题量） ---- */
var INTERVIEW_DURATIONS = [
  { min: 15, label: '15 分钟' },
  { min: 20, label: '20 分钟' },
  { min: 30, label: '30 分钟' }
];

/* ---- 题型配比：数值为该题型在面试中出现的次数上限 ---- */
var TOPIC_WEIGHTS = {
  balanced: { '自我介绍': 1, '专业认知': 1, '综合素质': 1, '时事热点': 1, '逻辑思维': 1, '职业规划': 1, '抗压能力': 1, '创新实践': 1 },
  major: { '专业认知': 3, '综合素质': 2, '职业规划': 2, '创新实践': 2, '自我介绍': 1, '时事热点': 1, '逻辑思维': 1, '抗压能力': 1 },
  hot: { '时事热点': 3, '综合素质': 2, '逻辑思维': 2, '抗压能力': 1, '创新实践': 1, '自我介绍': 1, '专业认知': 1, '职业规划': 1 }
};

var INTERVIEW_RATIOS = [
  { key: 'balanced', label: '均衡配比', desc: '八大题型均衡覆盖，适合首次摸底（默认）' },
  { key: 'major', label: '专业侧重', desc: '专业认知最多 3 题，强化报考动机与专业理解' },
  { key: 'hot', label: '热点侧重', desc: '时事热点最多 3 题，强化时政观点与思辨表达' }
];

/* ---- 面试须知 ---- */
var INTERVIEW_NOTICE = [
  '请选择安静、光线充足的环境；视频模式建议正对摄像头、保持坐姿端正。',
  '每题开始后先有 15 秒思考时间，听到「请开始作答」后可键盘输入或点击「语音作答」口述。',
  '每题作答后会有一道追问，追问可留空跳过，不影响成绩计入。',
  '结束后系统生成五维评估报告，数据仅保存在本机浏览器中，不会上传。'
];

/* ---- 五维评估维度（顺序即雷达图顺序） ---- */
var INTERVIEW_DIMS = [
  { key: 'express', label: '表达能力', icon: 'mic' },
  { key: 'logic', label: '逻辑思维', icon: 'brain' },
  { key: 'major', label: '专业认知', icon: 'book-open' },
  { key: 'adapt', label: '应变能力', icon: 'shuffle' },
  { key: 'manner', label: '仪态举止', icon: 'user-check' }
];

var DIM_COMMENTS = {
  express: { good: '语速与用词自然，表达连贯清晰', bad: '口语化停顿偏多，建议用连接词串联观点' },
  logic: { good: '结构清晰，能分点论证', bad: '层次欠分明，建议先给结论再分点展开' },
  major: { good: '能结合院校与专业实际展开', bad: '专业相关内容偏少，建议补充课程、实践或案例' },
  adapt: { good: '追问应答及时，接得住问题', bad: '追问回答较短，建议先停顿思考再补充论据' },
  manner: { good: '态度自然、礼貌得体', bad: '建议保持微笑与眼神交流，语气更自信' }
};

/* ---- 每题追问（按题型生成，追问环节使用） ---- */
var INTERVIEW_FOLLOWUPS = {
  '自我介绍': '请再具体讲一段最能体现你与报考专业匹配的经历，你从中收获了什么？',
  '专业认知': '如果入学后发现这个专业与你的想象有差距，你会怎么调整？',
  '综合素质': '请举一个你自己践行这种观点的具体例子，当时的结果如何？',
  '时事热点': '如果让你为身边同学提一条行动建议，你会提什么？为什么？',
  '逻辑思维': '如果沟通后双方仍各持己见，你的下一步方案是什么？',
  '职业规划': '如果计划中途受挫，你会用什么标准判断是否需要调整方向？',
  '抗压能力': '回想那次经历，如果重来一次，你会在哪一步做得不同？',
  '创新实践': '这次实践中最难的一点是什么，你是如何解决的？'
};

/* ---- 优秀回答示范（报告页「优秀回答示范」使用） ---- */
var EXCELLENT_ANSWERS = {
  '自我介绍': {
    demo: '各位老师好，我是来自杭州的考生，高中三年担任班级学习委员，负责组织班级学习小组与错题整理。这段经历让我发现自己擅长把复杂信息讲清楚，也让我对教育学产生了持续兴趣。报考本专业是因为我希望未来成为一名能把知识讲“活”的老师：我曾在社区做过一学期的志愿辅导，把一名同学的数学从及格线提升到班级中游，那种成就感让我确认了方向。',
    points: ['身份 + 经历 + 报考理由三段式，一分钟内讲清', '用“学习委员 / 志愿辅导”两个具体事实支撑能力', '结尾落到专业与职业目标，体现目标感']
  },
  '专业认知': {
    demo: '我理解这个专业不只是知识传授，更包含课程设计、学生心理与教学评价三个层面。我读过《给教师的建议》，也关注到新课标强调的跨学科主题学习，这说明未来教师需要更强的课程整合能力。我的规划是大一打牢学科基础，大二进入实验室或教学实践基地积累案例，大三争取参加师范生技能竞赛，毕业后回到浙江基层学校任教。',
    points: ['从“是什么—为什么—怎么做”三层展开专业理解', '引用书籍与政策文件，体现真实调研', '规划分阶段、可执行，与专业培养路径对齐']
  },
  '综合素质': {
    demo: '我理解的“内卷”是同质化竞争带来的低效消耗，“躺平”则是对这种消耗的消极退出。我的选择是“定向努力”：先明确目标，比如我要成为小学数学教师，那我在意的是解题讲解能力与课堂组织能力，而不是盲目刷题排名。这学期我主动报名了学校的教学技能工作坊，也控制每天刷题时间不超过一小时，把省下的时间用来备课与练讲。',
    points: ['先界定概念，再表明自己的立场', '用“定向努力”提出第三种选择，避免非黑即白', '用具体行动（工作坊、练讲）支撑观点']
  },
  '时事热点': {
    demo: '新质生产力以科技创新为核心驱动，对青年学生的启示有三点：一是要具备持续学习能力，因为技术迭代速度快于课程更新；二是要有跨学科视野，比如把数据分析能力用到教育评价中；三是要有实践意识，把想法做成原型。我在高中阶段参加过创客社团，用传感器做过教室光照自动调节的小装置，这让我体会到“技术落到真实问题”才有价值。',
    points: ['用“三点启示”结构化回应热点概念', '把宏观概念落到个人能力要求，不空谈', '以创客项目为例，体现实践意识']
  },
  '逻辑思维': {
    demo: '作为组长我不会急着表态，而是分四步处理：第一，分别单独听两人把诉求讲完整，避免当面争执升级；第二，找出双方真正的共识点，比如都希望方案按时交付；第三，把分歧拆成可选项，让两人各自评估成本与风险，用数据而不是情绪做判断；第四，形成书面分工并约定复盘时间。如果仍然僵持，我会把问题上升给老师，同时保证任务不因此停滞。',
    points: ['“倾听—找共识—定方案—跟进”四步结构清晰', '用共识点与数据降低情绪对抗', '给出僵持时的兜底方案，考虑周全']
  },
  '职业规划': {
    demo: '大一我会先解决“基础关”：把专业核心课学扎实，同时加入一个社团锻炼表达与协作；大二解决“实践关”，进入教学实践基地听课、试讲，累计不少于 30 课时；大三解决“能力关”，备考教师资格证并参加师范生技能比赛，争取拿到一次校级奖项；大四解决“出口关”，完成实习与毕业设计，同时做两手准备：报考教师编制或继续深造。每学年结束我会做一次复盘，对照目标调整。',
    points: ['按学年分阶段阐述，路径清晰', '每阶段有可量化的目标（课时、证书、奖项）', '结尾提到复盘机制与备选方案，体现稳健']
  },
  '抗压能力': {
    demo: '高二上学期我的英语从班级前列掉到中下游，一度很焦虑。我先做了两件事：一是把近三次试卷逐题归因，发现失分集中在听力和完形；二是不盲目报班，而是给自己定了每天 20 分钟听力、每天整理 5 个完形高频词的计划，并请同桌每周检查一次。三个月后英语回到班级前列，提升了 20 多分。更重要的是我学会了用数据定位问题、用计划推动改变，这个方法后来也用在了其他科目上。',
    points: ['STAR 结构完整：情境、任务、行动、结果', '结果可量化（20 多分），过程有方法', '升华到可迁移能力，体现反思深度']
  },
  '创新实践': {
    demo: '我和同学做过一个“校园二手书循环”的小项目。最难的一点不是想到点子，而是让同学愿意把书交出来。我们先在班级做了问卷，发现大家最担心的是书弄丢和无法估价。于是我们设计了“登记—编号—拍照存档”的流程，并用积分兑换文具作为激励。两周内回收图书 180 余册，流转率超过一半。我负责流程设计与数据统计，这段经历让我掌握了从需求调研到落地迭代的完整方法。',
    points: ['先讲难点，突出解决问题的过程', '用问卷、流程设计体现方法论', '明确个人贡献（流程与数据），不泛泛而谈']
  }
};

/* ---- 小工具 ---- */
function clampNum(n, a, b) { return Math.max(a, Math.min(b, Math.round(n))); }
function fmtDuration(sec) {
  sec = Math.max(0, Math.round(sec || 0));
  var m = Math.floor(sec / 60), s = sec % 60;
  return m ? (m + ' 分 ' + s + ' 秒') : (s + ' 秒');
}
function fmtDateTime(d) {
  d = d || new Date();
  function p(n) { return String(n).padStart(2, '0'); }
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
}
function modeLabelOf(key) {
  var m = INTERVIEW_MODES.filter(function (x) { return x.key === key; })[0];
  return m ? m.label : '视频模式';
}
function ratioLabelOf(key) {
  var r = INTERVIEW_RATIOS.filter(function (x) { return x.key === key; })[0];
  return r ? r.label : '均衡配比';
}
function interviewQuestionCount(minutes) {
  return clampNum((minutes || 20) / 2.5, 4, 10);
}

/* ---- 作答评分：基于作答文本的确定性启发式评分（无后端） ---- */
function evaluateAnswer(text, ctx) {
  ctx = ctx || {};
  var s = String(text == null ? '' : text).replace(/\s+/g, '');
  var len = s.length;
  var base = 54;
  if (len >= 15) base = 63;
  if (len >= 40) base = 71;
  if (len >= 80) base = 78;
  if (len >= 130) base = 83;
  if (len >= 200) base = 86;

  var connectors = ['首先', '其次', '再次', '最后', '第一', '第二', '第三', '一方面', '另一方面', '因此', '所以', '因为', '例如', '比如', '综上', '总之', '总的来说', '换句话说'];
  var cHits = 0;
  connectors.forEach(function (c) { if (s.indexOf(c) >= 0) cHits++; });
  var numHits = (s.match(/\d+/g) || []).length;
  var fillers = (s.match(/嗯|呃|那个|然后然后|就是就是/g) || []).length;
  var fu = String(ctx.followUpText == null ? '' : ctx.followUpText).replace(/\s+/g, '');

  var express = clampNum(base + Math.min(4, cHits) * 2 - Math.min(9, fillers * 3), 50, 96);
  var logic = clampNum(base + cHits * 3 + (numHits ? 1 : 0), 54, 96);
  var major = clampNum(base
    + (ctx.major && s.indexOf(ctx.major) >= 0 ? 6 : 0)
    + (ctx.school && s.indexOf(ctx.school) >= 0 ? 3 : 0)
    + (/(专业|课程|就业|职业|能力|实践|研究|学习|规划|素养)/.test(s) ? 4 : 0), 52, 96);
  var adapt = clampNum((fu.length >= 15 ? 78 : (fu.length ? 69 : (len >= 60 ? 68 : 60)))
    + Math.min(8, cHits) - Math.min(6, fillers * 2), 54, 95);
  var manner = clampNum(base
    + (ctx.mode === 'video' ? (ctx.cameraOn ? 7 : 2) : 4)
    + (/(谢谢|感谢|老师|请|抱歉|我认为)/.test(s) ? 4 : 0), 58, 97);

  var byKey = { express: express, logic: logic, major: major, adapt: adapt, manner: manner };
  var dims = INTERVIEW_DIMS.map(function (d) {
    return { key: d.key, label: d.label, icon: d.icon, score: byKey[d.key] };
  });
  var score = clampNum(express * 0.22 + logic * 0.22 + major * 0.20 + adapt * 0.18 + manner * 0.18, 45, 97);

  var sorted = dims.slice().sort(function (a, b) { return b.score - a.score; });
  var best = sorted[0], worst = sorted[sorted.length - 1];
  var highlight, advice, quick;
  if (!len) {
    highlight = '本次未作答，无有效表达可评。';
    advice = '建议下题至少给出 3 句话的结构化回答，避免空白。';
    quick = '这道题你没有作答，我们先看下一题。';
  } else {
    highlight = best.label + ' ' + best.score + ' 分：' + DIM_COMMENTS[best.key].good + '。';
    advice = '建议加强' + worst.label + '（' + worst.score + ' 分）：' + DIM_COMMENTS[worst.key].bad + '。';
    if (len < 40) advice = '回答篇幅偏短，建议补充一个具体事例或数据来支撑观点。' + advice;
    quick = len >= 90 ? '内容比较充实，结构也基本清晰。' : '感谢回答，如果能把观点再展开一点会更好。';
  }
  return { score: score, dims: dims, highlight: highlight, advice: advice, quickComment: quick, textLen: len };
}

/* ---- 组装一场面试记录 ---- */
function buildInterviewRecord(input) {
  input = input || {};
  var answers = input.answers || [];
  var cfg = input.cfg || { mode: 'video', ratio: 'balanced', minutes: 20 };
  var agg = {};
  INTERVIEW_DIMS.forEach(function (d) { agg[d.key] = []; });
  answers.forEach(function (a) {
    (a.dims || []).forEach(function (d) { if (agg[d.key]) agg[d.key].push(d.score); });
  });
  var dims = INTERVIEW_DIMS.map(function (d) {
    var arr = agg[d.key];
    var sc = arr.length ? Math.round(arr.reduce(function (x, y) { return x + y; }, 0) / arr.length) : 0;
    return {
      key: d.key, label: d.label, icon: d.icon, score: sc,
      comment: sc >= 82 ? DIM_COMMENTS[d.key].good : DIM_COMMENTS[d.key].bad
    };
  });
  var total = 0;
  answers.forEach(function (a) { total += a.score; });
  total = answers.length ? Math.round(total / answers.length) : 0;
  var weakestTopics = answers.slice().sort(function (a, b) { return a.score - b.score; }).slice(0, 2).map(function (a) { return a.topic; });

  return {
    id: 'ir-' + Date.now().toString(36) + Math.floor(Math.random() * 1000),
    planId: input.plan ? input.plan.id : '',
    planName: input.plan ? input.plan.name : '',
    school: input.school || '', major: input.major || '',
    mode: cfg.mode, modeLabel: modeLabelOf(cfg.mode),
    ratio: cfg.ratio, ratioLabel: ratioLabelOf(cfg.ratio),
    minutes: cfg.minutes,
    durationSec: input.durationSec || 0,
    durationLabel: fmtDuration(input.durationSec || 0),
    createdAt: fmtDateTime(new Date()),
    totalScore: total,
    dims: dims,
    answers: answers.map(function (a, i) {
      return {
        index: i + 1, topic: a.topic, question: a.question,
        text: a.text || '', followUp: a.followUp || '',
        score: a.score, highlight: a.highlight, advice: a.advice
      };
    }),
    weakestTopics: weakestTopics
  };
}

/* ---- 面试记录持久化 ---- */
function loadRecords() {
  try {
    var v = JSON.parse(localStorage.getItem(INTERVIEW_RECORD_KEY) || '[]');
    return Array.isArray(v) ? v : [];
  } catch (e) { return []; }
}
function saveRecord(rec) {
  var all = loadRecords();
  all.unshift(rec);
  if (all.length > 20) all = all.slice(0, 20);
  localStorage.setItem(INTERVIEW_RECORD_KEY, JSON.stringify(all));
}
function findRecord(id) {
  if (!id) return null;
  var hit = loadRecords().filter(function (r) { return r.id === id; })[0];
  return hit || null;
}
function latestRecord(planId) {
  var all = loadRecords();
  if (planId) {
    var f = all.filter(function (r) { return r.planId === planId; });
    if (f.length) return f[0];
  }
  return all[0] || null;
}
function recordsOfPlan(planId, limit) {
  var all = loadRecords().filter(function (r) { return !planId || r.planId === planId; });
  return limit ? all.slice(0, limit) : all;
}

/* ---- 面试配置持久化 ---- */
function getInterviewConfig() {
  try {
    var v = JSON.parse(localStorage.getItem(INTERVIEW_CONFIG_KEY) || 'null');
    return (v && v.mode) ? v : null;
  } catch (e) { return null; }
}
function setInterviewConfig(cfg) {
  if (!cfg) return;
  localStorage.setItem(INTERVIEW_CONFIG_KEY, JSON.stringify({
    mode: cfg.mode, minutes: cfg.minutes, ratio: cfg.ratio
  }));
}
