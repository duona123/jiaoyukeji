/* ============================================================
   浙招智达 - 页面交互脚本 (pages.js)
   按当前页面初始化对应交互：聊天、面试向导、成绩录入、题库、用户中心、VIP
   ============================================================ */

(function () {
  'use strict';

  const path = location.pathname.split('/').pop() || 'index.html';

  /* ---------- 通用工具 ---------- */
  function showToast(message, type) {
    type = type || 'success';
    const colors = {
      success: 'bg-[var(--edu-state-success)]',
      error: 'bg-[var(--edu-state-error)]',
      info: 'bg-primary',
    };
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-lg text-white text-sm font-medium shadow-lg ' + (colors[type] || colors.info);
    toast.style.animation = 'toastIn 0.3s ease';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2200);
  }

  // inject toast keyframe once
  if (!document.getElementById('toast-style')) {
    const s = document.createElement('style');
    s.id = 'toast-style';
    s.textContent = '@keyframes toastIn{from{opacity:0;transform:translate(-50%,-10px)}to{opacity:1;transform:translate(-50%,0)}}';
    document.head.appendChild(s);
  }

  /* ============================================================
     ai-chat.html - 智能问答
     ============================================================ */
  if (path === 'ai-chat.html') {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const chatSection = document.querySelector('#page-content > section');

    // AI 回复模板库（关键词匹配）
    const replies = [
      { keys: ['成绩', '报哪些', '学校', '院校'], text: '根据你的学考成绩，推荐关注以下院校：\n• 浙江工业大学（冲刺）\n• 浙江师范大学（稳妥）\n• 宁波大学（保底）\n建议点击「志愿方案」生成完整冲稳保方案。' },
      { keys: ['三位一体', '三一', '要求'], text: '三位一体综合评价招生要求：\n1. 学考等级折算（各校规则不同，A=10/15分等）\n2. 校测（面试/笔试）成绩\n3. 高考成绩\n三者按比例合成综合分，按综合分择优录取。' },
      { keys: ['高职', '提招', '提前招生', '流程'], text: '高职提前招生流程：\n1. 网上报名（3月左右）\n2. 院校校测（4月）\n3. 一档多投录取（5月）\n4. 录取后不再参加高考\n学考等级折算 + 校测成绩决定录取。' },
      { keys: ['面试', '准备'], text: '面试准备建议：\n1. 自我介绍（1分钟）突出亮点\n2. 了解报考专业与院校特色\n3. 关注近期时政热点\n4. 练习结构化表达：观点+论据+总结\n可使用「AI 面试模拟」进行实战演练。' },
      { keys: ['折算', '分数', '计算'], text: '学考折算规则因校而异，常见方式：\nA=10分/15分，B=8分/12分，C=6分/9分，D=4分/6分，E=2分/3分\n10门学考满分约100-150分。建议录入学考成绩后由系统自动折算。' },
      { keys: ['一档多投'], text: '一档多投是高职提招的录取方式：\n考生档案可同时投向多所报考院校，各校按综合分从高到低录取，考生可在录取结果中选择确认就读院校，已录取则不再参加后续高考招生。' },
    ];

    function getReply(question) {
      const q = question.toLowerCase();
      for (const r of replies) {
        if (r.keys.some(k => q.includes(k.toLowerCase()))) return r.text;
      }
      return '这是一个很好的问题。我可以帮你解读三位一体/高职提招政策、推荐院校、生成志愿方案、模拟面试等。请问你想了解哪方面？';
    }

    function ensureChatContainer() {
      let container = document.getElementById('chat-messages');
      if (container) return container;
      // Replace the centered welcome with a scrollable message list
      const main = document.querySelector('#page-content > section');
      if (!main) return null;
      const welcome = main.querySelector('.flex-1.flex.flex-col.items-center.justify-center');
      container = document.createElement('div');
      container.id = 'chat-messages';
      container.className = 'flex-1 overflow-y-auto px-4 py-6 space-y-4 w-full max-w-3xl mx-auto';
      if (welcome) welcome.replaceWith(container);
      else main.insertBefore(container, main.firstChild);
      return container;
    }

    function addMessage(text, isUser) {
      const container = ensureChatContainer();
      if (!container) return;
      const wrap = document.createElement('div');
      wrap.className = 'flex gap-3 ' + (isUser ? 'justify-end' : '');
      const avatar = document.createElement('div');
      avatar.className = 'w-8 h-8 rounded-full flex items-center justify-center shrink-0 ' +
        (isUser ? 'bg-muted text-muted-foreground order-2' : 'bg-primary/10 text-primary');
      avatar.innerHTML = '<i data-lucide="' + (isUser ? 'user' : 'bot') + '" class="w-4 h-4"></i>';
      const bubble = document.createElement('div');
      bubble.className = (isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground') +
        ' rounded-2xl px-4 py-3 text-sm max-w-[80%] ' + (isUser ? 'rounded-tr-sm' : 'rounded-tl-sm');
      bubble.style.whiteSpace = 'pre-wrap';
      bubble.textContent = text;
      wrap.appendChild(avatar);
      wrap.appendChild(bubble);
      container.appendChild(wrap);
      if (window.lucide) window.lucide.createIcons();
      container.scrollTop = container.scrollHeight;
    }

    function addTyping() {
      const container = ensureChatContainer();
      if (!container) return null;
      const wrap = document.createElement('div');
      wrap.className = 'flex gap-3';
      wrap.innerHTML = '<div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0"><i data-lucide="bot" class="w-4 h-4"></i></div>' +
        '<div class="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 text-sm"><span class="typing-dot inline-block w-2 h-2 rounded-full bg-muted-foreground/60 mr-1"></span><span class="typing-dot inline-block w-2 h-2 rounded-full bg-muted-foreground/60 mr-1"></span><span class="typing-dot inline-block w-2 h-2 rounded-full bg-muted-foreground/60"></span></div>';
      container.appendChild(wrap);
      if (window.lucide) window.lucide.createIcons();
      container.scrollTop = container.scrollHeight;
      return wrap;
    }

    function sendMessage(text) {
      const msg = (text || input.value || '').trim();
      if (!msg) return;
      addMessage(msg, true);
      input.value = '';
      input.style.height = 'auto';
      const typing = addTyping();
      setTimeout(() => {
        if (typing) typing.remove();
        addMessage(getReply(msg), false);
      }, 900 + Math.random() * 600);
    }

    if (sendBtn) sendBtn.addEventListener('click', () => sendMessage());
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
      });
    }

    // 工具按钮 -> 填入输入框
    const toolMap = {
      'tool-recommend': '根据我的学考成绩推荐院校',
      'tool-plan': '帮我生成冲稳保志愿方案',
      'tool-policy': '解读三位一体最新政策',
      'tool-interview': '面试应该怎么准备？',
      'tool-score': '分析我的学考成绩折算分',
    };
    Object.keys(toolMap).forEach(id => {
      const btn = document.getElementById(id);
      if (btn && input) btn.addEventListener('click', () => { input.value = toolMap[id]; input.focus(); });
    });

    // 新对话按钮
    const newChat = document.getElementById('sidebar-new-chat');
    if (newChat) newChat.addEventListener('click', () => {
      const c = document.getElementById('chat-messages');
      if (c) c.innerHTML = '';
      showToast('已开始新对话', 'info');
    });
  }

  /* ============================================================
     ai-interview.html - AI 面试模拟（向导步骤 + 开始按钮）
     ============================================================ */
  if (path === 'ai-interview.html') {
    // 题目占比总和实时校验
    const ratioInputs = document.querySelectorAll('input[type="range"][name^="ratio-"]');
    const totalEl = document.getElementById('ratio-total');
    function updateRatioTotal() {
      if (!totalEl) return;
      let sum = 0;
      ratioInputs.forEach(r => sum += parseInt(r.value, 10) || 0);
      totalEl.textContent = sum + '%';
      totalEl.style.color = sum === 100 ? 'var(--edu-primary)' : 'var(--edu-state-error)';
    }
    if (typeof updateRatioTotal === 'function') updateRatioTotal();
    ratioInputs.forEach(r => r.addEventListener('input', updateRatioTotal));

    // 开始面试按钮 -> 跳转评估报告
    const startBtn = document.querySelector('a[href="interview-report.html"], button[data-action="start-interview"]');
    if (startBtn) {
      startBtn.addEventListener('click', (e) => {
        // 校验占比
        let sum = 0;
        ratioInputs.forEach(r => sum += parseInt(r.value, 10) || 0);
        if (sum !== 100) {
          e.preventDefault();
          showToast('题目类型占比总和需为 100%，当前为 ' + sum + '%', 'error');
          return;
        }
        showToast('面试配置已保存，正在进入面试...', 'info');
      });
    }
  }

  /* ============================================================
     grade-input-*.html - 学考成绩录入（提交跳转方案结果）
     ============================================================ */
  if (path === 'grade-input-sanyi.html' || path === 'grade-input-gaozhi.html') {
    const submitBtn = document.querySelector('a[href^="plan-result"], button[data-action="generate-plan"]');
    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        // 简单校验：检查是否有未填的学考等级
        const selects = document.querySelectorAll('select[name^="grade-"], select[data-grade]');
        let unfilled = 0;
        selects.forEach(s => { if (!s.value || s.value === '') unfilled++; });
        if (unfilled > 0) {
          e.preventDefault();
          showToast('请填写所有学考科目等级后再生成方案', 'error');
          return;
        }
        showToast('正在为你生成志愿方案...', 'info');
      });
    }
  }

  /* ============================================================
     question-bank.html - 题库刷题（答题反馈）
     ============================================================ */
  if (path === 'question-bank.html') {
    // 适配设计稿结构：.options label（含 radio），正确选项带 success 边框
    const optionsContainer = document.querySelector('.options');
    if (optionsContainer) {
      const labels = optionsContainer.querySelectorAll('label');
      // 初始化时锁定正确答案（带 success 边框的选项）
      let correctValue = null;
      labels.forEach(lbl => {
        if (lbl.classList.contains('border-edu-state-success') || lbl.querySelector('[data-lucide="check"]')) {
          const radio = lbl.querySelector('input[type="radio"]');
          if (radio) correctValue = radio.value;
        }
      });

      // 提交答案按钮
      const submitBtn = document.querySelector('.options + div button, button[type="button"]');
      const answerFeedback = document.querySelector('.answer-feedback');
      if (answerFeedback) answerFeedback.style.display = 'none';

      if (submitBtn) {
        submitBtn.addEventListener('click', () => {
          const selected = optionsContainer.querySelector('input[type="radio"]:checked');
          if (!selected) {
            showToast('请先选择一个答案', 'error');
            return;
          }
          if (answerFeedback) answerFeedback.style.display = '';
          if (selected.value === correctValue) {
            showToast('回答正确！', 'success');
          } else {
            showToast('回答错误，正确答案为 ' + correctValue, 'error');
            // 高亮正确选项
            labels.forEach(lbl => {
              const r = lbl.querySelector('input[type="radio"]');
              if (r && r.value === correctValue) {
                lbl.classList.add('border-edu-state-success', 'bg-edu-state-success-bg/30');
              }
            });
          }
        });
      }
    }

    // 收藏按钮切换
    document.querySelectorAll('button[aria-label="收藏题目"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const icon = btn.querySelector('[data-lucide="star"]');
        if (icon) {
          const filled = icon.classList.toggle('fill-current');
          btn.classList.toggle('text-edu-primary');
          showToast(filled ? '已收藏' : '已取消收藏', 'info');
        }
      });
    });
  }

  /* ============================================================
     user-center.html - 用户中心（侧边栏平滑滚动 + 当前项高亮）
     ============================================================ */
  if (path === 'user-center.html') {
    const links = document.querySelectorAll('.sidebar-link[href^="#"]');
    const sections = [];
    links.forEach(link => {
      const id = link.getAttribute('href').slice(1);
      const sec = document.getElementById(id);
      if (sec) sections.push({ link, sec });
    });

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href').slice(1);
        const sec = document.getElementById(id);
        if (sec) {
          e.preventDefault();
          sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // 滚动时高亮当前章节
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            links.forEach(l => l.classList.remove('bg-primary/10', 'text-primary'));
            const active = sections.find(s => s.sec === entry.target);
            if (active) active.link.classList.add('bg-primary/10', 'text-primary');
          }
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      sections.forEach(s => io.observe(s.sec));
    }
  }

  /* ============================================================
     vip-pricing.html - VIP 购买（套餐选择 + 模拟支付）
     ============================================================ */
  if (path === 'vip-pricing.html') {
    // 月付/年付切换
    const billingToggle = document.querySelector('[data-billing-toggle]');
    if (billingToggle) {
      billingToggle.addEventListener('click', () => {
        const isYearly = billingToggle.getAttribute('data-billing') !== 'yearly';
        billingToggle.setAttribute('data-billing', isYearly ? 'yearly' : 'monthly');
        document.querySelectorAll('[data-price-monthly], [data-price-yearly]').forEach(el => {
          const showYearly = isYearly ? el.hasAttribute('data-price-yearly') : el.hasAttribute('data-price-monthly');
          el.classList.toggle('hidden', !showYearly);
        });
        billingToggle.textContent = isYearly ? '按年付（省更多）' : '按月付';
      });
    }
    // 购买按钮
    document.querySelectorAll('[data-action="buy-vip"]').forEach(btn => {
      btn.addEventListener('click', () => {
        showToast('正在跳转支付...（演示环境）', 'info');
      });
    });
  }

  /* ============================================================
     direction.html - 升学方向选择（卡片悬浮已在 CSS，无额外）
     ============================================================ */

  // 重新渲染图标（动态插入的元素）
  if (window.lucide) window.lucide.createIcons();
})();
