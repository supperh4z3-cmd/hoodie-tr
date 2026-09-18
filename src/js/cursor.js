export function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  const dot = document.getElementById('customCursorDot');
  if (!cursor || !dot) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
    if (!isMoving) {
      isMoving = true;
      requestAnimationFrame(renderCursor);
    }
  });

  function renderCursor() {
    // Smooth lerp follow
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    const dx = Math.abs(mouseX - cursorX);
    const dy = Math.abs(mouseY - cursorY);
    if (dx > 0.1 || dy > 0.1) {
      requestAnimationFrame(renderCursor);
    } else {
      isMoving = false;
    }
  }

  // Interactive hover states
  const interactives = 'a, button, input, [role="button"], .product-card, .size-btn, .filter-btn';
  
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(interactives);
    if (target) {
      cursor.classList.add('hovered');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(interactives);
    if (target) {
      cursor.classList.remove('hovered');
    }
  });

  document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.85)';
  });

  document.addEventListener('mouseup', () => {
    cursor.style.transform = '';
  });
}
