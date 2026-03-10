/* ── Cursor ── */
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});

/* ── Floating hearts ── */
const canvas = document.getElementById('heartsCanvas');
const ctx    = canvas.getContext('2d');
let W, H, hearts = [];

function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();

const EMOJIS = ['💕','💗','💓','💞','✨','🌸','💘'];
function Heart() {
  this.reset = function() {
    this.x     = Math.random() * W;
    this.y     = H + 30;
    this.size  = 12 + Math.random() * 16;
    this.speed = .4 + Math.random() * .7;
    this.drift = (Math.random() - .5) * .5;
    this.rot   = Math.random() * Math.PI * 2;
    this.rotS  = (Math.random() - .5) * .03;
    this.alpha = .6 + Math.random() * .4;
    this.emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  };
  this.reset();
  this.y = Math.random() * H;
}
for (let i = 0; i < 24; i++) hearts.push(new Heart());

function animHearts() {
  ctx.clearRect(0, 0, W, H);
  hearts.forEach(h => {
    ctx.save();
    ctx.globalAlpha = h.alpha;
    ctx.translate(h.x, h.y);
    ctx.rotate(h.rot);
    ctx.font = h.size + 'px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(h.emoji, 0, 0);
    ctx.restore();
    h.y -= h.speed;
    h.x += h.drift;
    h.rot += h.rotS;
    if (h.y < -40) h.reset();
  });
  requestAnimationFrame(animHearts);
}
animHearts();

/* ── تطبيع التاريخ ── */
function normalizeDate(d) {
  const nums = d.replace(/[^\d]/g, '');
  if (!d.includes('/') && !d.includes('-') && !d.includes('.')) {
    if (nums.length === 8) return parseInt(nums.slice(0,2)) + '/' + parseInt(nums.slice(2,4)) + '/' + parseInt(nums.slice(4));
    if (nums.length === 7) return parseInt(nums.slice(0,1)) + '/' + parseInt(nums.slice(1,3)) + '/' + parseInt(nums.slice(3));
    if (nums.length === 6) return parseInt(nums.slice(0,1)) + '/' + parseInt(nums.slice(1,2)) + '/' + parseInt(nums.slice(2));
  }
  const sep = d.includes('/') ? '/' : d.includes('-') ? '-' : '.';
  return d.split(sep).map(p => parseInt(p, 10)).join('/');
}

/* ── تشفير SHA-256 ── */
async function hashText(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

const _h1 = '312eddecf65d25e7f04f411d5046a8541a5b3b2aee12bafe4590342f1516d4c2'; 
const _h2 = '5b7b2069bbc6f187dbd2ac6d2f1b10ae8a11eac3379f5a780be51258b765d7fb';

/* ── التحقق من الباسورد ── */
async function checkPassword() {
  const ans1 = document.getElementById('field1').value.trim();
  const ans2 = document.getElementById('field2').value.trim();
  const err  = document.getElementById('errorMsg');

  const [hash1, hash2] = await Promise.all([
    hashText(normalizeDate(ans1)),
    hashText(normalizeDate(ans2))
  ]);

  if (hash1 === _h1 && hash2 === _h2) {
    err.style.display = 'none';
    document.getElementById('successOverlay').classList.add('show');
    sessionStorage.setItem('auth', 'true');
    setTimeout(() => { window.location.href = 'home.html'; }, 2000);
  } else {
    err.style.display = 'block';
    err.style.animation = 'none';
    setTimeout(() => { err.style.animation = 'shake .4s ease'; }, 10);
    document.getElementById('field1').value = '';
    document.getElementById('field2').value = '';
    document.getElementById('field1').focus();
  }
}

/* ── Enter key ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') checkPassword();
});
