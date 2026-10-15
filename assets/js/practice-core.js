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
  var majors = plan.majors.slice(0, MAX_MAJORS);
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

/* 依据方案生成面试题 */
function buildInterview(plan) {
  var majors = plan.majors.slice(0, MAX_MAJORS);
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

/* ---- 进度 / 错题 / 收藏 持久化 ---- */
function loadAllProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_STORE_KEY) || '{}') || {}; } catch (e) { return {}; }
}
function saveAllProgress(all) { localStorage.setItem(PROGRESS_STORE_KEY, JSON.stringify(all)); }
function getProg(planId) {
  var all = loadAllProgress();
  return all[planId] || { done: 0, correct: 0, wrong: [], fav: [], sessions: 0, scores: [] };
}
function setProg(planId, obj) {
  var all = loadAllProgress();
  all[planId] = obj;
  saveAllProgress(all);
}

function planHasInterview(plan) { return plan.majors.some(function (m) { return m.needsInterview; }); }
function planWrittenCount(plan) { return Math.min(plan.majors.length, MAX_MAJORS) * 3; }
function planInterviewCount(plan) { return Math.min(plan.majors.length, MAX_MAJORS) * 2; }

/* 读取当前已选方案；planId 为空时取 localStorage 中记录的那个 */
function resolvePlan(planId) {
  var plans = loadPlans();
  var id = planId || localStorage.getItem(PLAN_STORE_KEY);
  if (!id) return null;
  return plans.filter(function (p) { return p.id === id; })[0] || null;
}
