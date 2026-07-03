(function() {
  'use strict';

  // Client-side search filtering (instant, no page reload)
  const searchInput = document.getElementById('search');
  const grid = document.getElementById('app-grid');
  const countEl = document.getElementById('visible-count');

  if (!searchInput || !grid) return;

  let debounceTimer;

  searchInput.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(filterApps, 80);
  });

  // Submit search via URL on Enter (for shareable links + server-side filtering)
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      const params = new URLSearchParams(window.location.search);
      const val = searchInput.value.trim();
      if (val) { params.set('q', val); } else { params.delete('q'); }
      window.location.search = params.toString();
    }
  });

  function filterApps() {
    const q = searchInput.value.trim().toLowerCase();
    const cards = grid.querySelectorAll('.app-card');
    let visible = 0;

    cards.forEach(card => {
      const name = card.dataset.name || '';
      const cat = card.dataset.category || '';
      const match = !q || name.includes(q) || cat.includes(q);
      card.classList.toggle('hidden', !match);
      if (match) visible++;
    });

    if (countEl) countEl.textContent = visible;
  }

  // Animate score bars on detail page (trigger once visible)
  const bars = document.querySelectorAll('.score-bar-fill');
  if (bars.length > 0) {
    bars.forEach(bar => {
      const target = bar.style.width;
      bar.style.width = '0%';
      requestAnimationFrame(() => {
        setTimeout(() => { bar.style.width = target; }, 100);
      });
    });
  }

  // Animate score ring
  const ring = document.querySelector('.score-ring-svg circle:nth-child(2)');
  if (ring) {
    const target = ring.getAttribute('stroke-dasharray');
    ring.setAttribute('stroke-dasharray', '0, 264');
    setTimeout(() => { ring.setAttribute('stroke-dasharray', target); }, 150);
  }
})();
