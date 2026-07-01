document.addEventListener("DOMContentLoaded", () => {
  const video = document.querySelector('.hero-video');
  const unmuteBtn = document.getElementById('unmute-btn');
  const overlay = document.getElementById('dark-overlay');
  const jumpButtons = document.querySelectorAll('.jump-btn');

  const positions = ["0%", "25%", "50%", "75%", "100%"];
  
  // This variable will hold onto our timer so we can kill it if needed
  let fadeTimer = null; 

  function jumpToSlice(targetIndex) {
    if (targetIndex < 0 || targetIndex >= positions.length) return;

    // CRITICAL FIX 1: Clear any pending text fade-ins instantly
    clearTimeout(fadeTimer);

    // CRITICAL FIX 2: Force ALL text blocks to lose the "active" class immediately.
    // This stops rapid clicks from stacking multiple layers.
    document.querySelectorAll('.text-block').forEach(block => {
      block.classList.remove('active');
    });

    const targetText = document.getElementById(`text-state-${targetIndex + 1}`);

    // Pan video instantly to selected percentage
    video.style.objectPosition = `${positions[targetIndex]} center`;

    // Toggle dark overlay if it isn't home (index 2)
    if (targetIndex === 2) {
      overlay.classList.remove('visible');
    } else {
      overlay.classList.add('visible');
    }

    // Queue up the next text fade-in, storing it in our tracker variable
    fadeTimer = setTimeout(() => {
      if (targetText) targetText.classList.add('active');
    }, 300);
  }

  // Bind direct clicks to every side menu button dynamically
  if (jumpButtons.length > 0 && video && overlay) {
    jumpButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetSlice = parseInt(button.getAttribute('data-slice'), 10);
        jumpToSlice(targetSlice);
      });
    });
  }

  // Unmute handling
  if (unmuteBtn && video) {
    unmuteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      unmuteBtn.textContent = video.muted ? "🔊" : "🔇";
    });
  }
});