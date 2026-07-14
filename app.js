const slides = [...document.querySelectorAll('.slide')];
const counter = document.querySelector('#counter');
const progress = document.querySelector('#progress-bar');
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
const fullscreen = document.querySelector('#fullscreen');
let current = 0;

function setCurrent(index) {
  current = Math.max(0, Math.min(slides.length - 1, index));
  counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  progress.style.width = `${((current + 1) / slides.length) * 100}%`;
  previous.disabled = current === 0;
  next.disabled = current === slides.length - 1;
}

function goTo(index) {
  const target = Math.max(0, Math.min(slides.length - 1, index));
  slides[target].scrollIntoView({ behavior: 'smooth', block: 'start' });
}

previous.addEventListener('click', () => goTo(current - 1));
next.addEventListener('click', () => goTo(current + 1));

document.addEventListener('keydown', (event) => {
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) {
    event.preventDefault();
    goTo(current + 1);
  }
  if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
    event.preventDefault();
    goTo(current - 1);
  }
  if (event.key === 'Home') goTo(0);
  if (event.key === 'End') goTo(slides.length - 1);
});

fullscreen.addEventListener('click', async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
});

const observer = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) setCurrent(Number(visible.target.dataset.index) - 1);
}, { threshold: [0.45, 0.65, 0.85] });

slides.forEach((slide) => observer.observe(slide));
setCurrent(0);
