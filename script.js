/* ============================================
   Per-App Grayscale — Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeroToggle();
  initScrollAnimations();
  initPetitionForm();
  initShareButtons();
});

/* ---- Hero grayscale toggle with image rotation ---- */
function initHeroToggle() {
  const img = document.getElementById('hero-screenshot');
  const label = document.getElementById('toggle-label');
  const dotColor = document.getElementById('dot-color');
  const dotGray = document.getElementById('dot-gray');
  if (!img) return;

  const screens = (img.dataset.screens || '').split(',').filter(Boolean);
  let screenIndex = 0;
  let isGrayscale = false;

  // Preload all images
  screens.forEach(src => { const i = new Image(); i.src = src; });

  function step() {
    if (isGrayscale) {
      // Currently grayscale — switch to next image in color
      isGrayscale = false;
      screenIndex = (screenIndex + 1) % screens.length;
      img.classList.remove('grayscale');
      img.src = screens[screenIndex];
    } else {
      // Currently color — go grayscale
      isGrayscale = true;
      img.classList.add('grayscale');
    }
    if (label) label.textContent = isGrayscale ? 'Grayscale — less addictive' : 'Full color';
    if (dotColor) dotColor.classList.toggle('active', !isGrayscale);
    if (dotGray) dotGray.classList.toggle('active', isGrayscale);
  }

  // Auto-step with different durations: color 1.3s, grayscale 2.0s
  function autoStep() {
    const delay = isGrayscale ? 2000 : 1300;
    setTimeout(() => { step(); autoStep(); }, delay);
  }
  autoStep();

  // Click advances manually
  const mockup = document.querySelector('.phone-mockup');
  if (mockup) mockup.addEventListener('click', step);
}

/* ---- Scroll fade-in ---- */
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ---- Petition form ---- */
function initPetitionForm() {
  const form = document.getElementById('petition-form');
  const success = document.getElementById('form-success');
  const countEl = document.getElementById('sig-count');
  if (!form) return;

  // Load count
  loadSignatureCount(countEl);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-sign');
    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();

    if (!name || !email) return;

    btn.disabled = true;
    btn.textContent = 'Signing…';

    try {
      // Try to post to API endpoint
      const res = await fetch('/api/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (res.ok) {
        const data = await res.json();
        if (countEl && data.count) {
          countEl.textContent = Number(data.count).toLocaleString();
        }
      }
    } catch {
      // If no backend, store locally as fallback
      const sigs = JSON.parse(localStorage.getItem('pag-signatures') || '[]');
      sigs.push({ name, email, ts: Date.now() });
      localStorage.setItem('pag-signatures', JSON.stringify(sigs));
      if (countEl) {
        const currentCount = parseInt(countEl.textContent.replace(/,/g, '')) || 0;
        countEl.textContent = (currentCount + 1).toLocaleString();
      }
    }

    form.style.display = 'none';
    if (success) success.classList.add('visible');
    btn.disabled = false;
    btn.textContent = 'Sign the Petition';
  });
}

async function loadSignatureCount(el) {
  if (!el) return;
  try {
    const res = await fetch('/api/count');
    if (res.ok) {
      const data = await res.json();
      el.textContent = Number(data.count).toLocaleString();
    }
  } catch {
    // Use local storage count as fallback
    const sigs = JSON.parse(localStorage.getItem('pag-signatures') || '[]');
    const base = parseInt(el.textContent.replace(/,/g, '')) || 0;
    el.textContent = (base + sigs.length).toLocaleString();
  }
}

/* ---- Share buttons ---- */
function initShareButtons() {
  const copyBtn = document.getElementById('btn-copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const url = window.location.href;
      try {
        await navigator.clipboard.writeText(url);
        const original = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = original; }, 2000);
      } catch {
        // fallback
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();
      }
    });
  }
}
