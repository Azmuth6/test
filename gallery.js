/* ══════════ GALLERY JS ══════════ */

const cards = document.querySelectorAll('.photo-card');
let currentIndex = 0;
const photos = [];

cards.forEach((card, i) => {
  const img     = card.querySelector('img');
  const caption = card.querySelector('.photo-caption').textContent.trim();
  const wrap    = card.querySelector('.photo-wrap');

  photos.push({ src: img ? img.src : '', caption });

  card.addEventListener('click', () => {
    if (wrap.classList.contains('empty')) return;
    openLightbox(i);
  });

  card.style.animationDelay = (i * 0.1) + 's';
});

function openLightbox(index) {
  currentIndex = index;
  const lb = document.getElementById('lightbox');
  document.getElementById('lbImg').src = photos[index].src;
  document.getElementById('lbCaption').textContent = photos[index].caption;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function changePhoto(dir) {
  currentIndex = (currentIndex + dir + photos.length) % photos.length;
  document.getElementById('lbImg').src = photos[currentIndex].src;
  document.getElementById('lbCaption').textContent = photos[currentIndex].caption;
}

document.getElementById('lightbox').addEventListener('click', function(e) {
  if (e.target === this) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('active')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowRight') changePhoto(-1);
  if (e.key === 'ArrowLeft')  changePhoto(1);
});
