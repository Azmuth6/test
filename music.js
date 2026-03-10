/* ══════════════════════════════════════
   music.js — مشغّل الأغنية العائم
   بيشتغل في كل الصفحات ويكمل من نفس المكان
   ══════════════════════════════════════ */

const MUSIC_SRC = 'audio/7obk-Rezk.mp3';

/* ── إنشاء الزرار العائم ── */
const btn = document.createElement('div');
btn.id = 'musicFloatBtn';
btn.innerHTML = '🎵';
btn.title = 'شغّل / وقّف الأغنية';
document.body.appendChild(btn);

/* ── CSS الزرار ── */
const style = document.createElement('style');
style.textContent = `
  #musicFloatBtn {
    position: fixed;
    bottom: 1.6rem;
    left: 1.6rem;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: linear-gradient(135deg, #e8476a, #7b1535);
    color: #fff;
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 9000;
    box-shadow: 0 4px 20px rgba(232,71,106,.5);
    transition: transform .2s, box-shadow .2s;
    user-select: none;
    animation: pulse 2s ease-in-out infinite;
  }
  #musicFloatBtn:hover {
    transform: scale(1.12);
    box-shadow: 0 8px 28px rgba(232,71,106,.7);
  }
  #musicFloatBtn.paused {
    animation: none;
    opacity: .7;
  }
  @keyframes pulse {
    0%,100% { box-shadow: 0 4px 20px rgba(232,71,106,.5); }
    50%      { box-shadow: 0 4px 32px rgba(232,71,106,.85); }
  }
`;
document.head.appendChild(style);

/* ── إنشاء عنصر الصوت ── */
const music = document.createElement('audio');
music.loop = true;
music.src  = MUSIC_SRC;
document.body.appendChild(music);

/* ── استرجاع الوقت والحالة من sessionStorage ── */
const savedTime    = parseFloat(sessionStorage.getItem('musicTime') || '0');
const savedPlaying = sessionStorage.getItem('musicPlaying') === 'true';

music.currentTime = savedTime;

/* ── حفظ الوقت قبل مغادرة الصفحة ── */
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('musicTime',    music.currentTime);
  sessionStorage.setItem('musicPlaying', (!music.paused).toString());
});

/* ── تشغيل لو كانت شغالة في الصفحة السابقة ── */
if (savedPlaying) {
  music.play().then(() => {
    btn.innerHTML = '🎵';
    btn.classList.remove('paused');
  }).catch(() => {
    /* المتصفح مش سامح — نستنى ضغطة ── */
    btn.innerHTML = '▶️';
    btn.classList.add('paused');
    window.addEventListener('click', () => {
      music.play();
      btn.innerHTML = '🎵';
      btn.classList.remove('paused');
    }, { once: true });
  });
} else if (savedTime === 0) {
  /* أول مرة يفتح الموقع — نشغل عند أول ضغطة */
  btn.innerHTML = '▶️';
  btn.classList.add('paused');
  window.addEventListener('click', function startFirst(e) {
    if (e.target === btn) return; /* مش نشغله مرتين */
    music.play();
    btn.innerHTML = '🎵';
    btn.classList.remove('paused');
    window.removeEventListener('click', startFirst);
  });
}

/* ── الزرار: شغّل / وقّف ── */
btn.addEventListener('click', () => {
  if (music.paused) {
    music.play();
    btn.innerHTML = '🎵';
    btn.classList.remove('paused');
  } else {
    music.pause();
    btn.innerHTML = '⏸';
    btn.classList.add('paused');
  }
});
