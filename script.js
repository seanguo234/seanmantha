document.addEventListener("DOMContentLoaded", () => {
  // === 1. SELECTORS ===
  const video = document.querySelector('.hero-video');
  const unmuteBtn = document.getElementById('unmute-btn');
  const overlay = document.getElementById('dark-overlay');
  const jumpButtons = document.querySelectorAll('.jump-btn');

  // Carousel Selectors
  const carouselImage = document.getElementById('dress-code-carousel-image');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  // === 2. DATA STATES ===
  const positions = ["0%", "25%", "50%", "75%", "100%"];
  let fadeTimer = null; 

  const carouselImages = [
    { src: 'images/dresscode1.png', alt: 'Dress code 1' },
    { src: 'images/dresscode2.png', alt: 'Dress code 2' },
    { src: 'images/dresscode3.jpg', alt: 'Dress code 3' },
    { src: 'images/dresscode4.jpg', alt: 'Dress code 4' }
  ];
  let carouselIndex = 0;

  // === 3. CORE VIDEO NAVIGATION LOGIC ===
  function jumpToSlice(targetIndex) {
    if (targetIndex < 0 || targetIndex >= positions.length) return;

    clearTimeout(fadeTimer);

    // Wipe all text blocks
    document.querySelectorAll('.text-block').forEach(block => {
      block.classList.remove('active');
    });

    const targetText = document.getElementById(`text-state-${targetIndex + 1}`);

    // Pan video
    if (video) video.style.objectPosition = `${positions[targetIndex]} center`;

    // Overlay toggle
    if (overlay) {
      if (targetIndex === 2) {
        overlay.classList.remove('visible');
      } else {
        overlay.classList.add('visible');
      }
    }

    fadeTimer = setTimeout(() => {
      if (targetText) targetText.classList.add('active');
    }, 300);
  }

  // Bind Bottom Buttons
  if (jumpButtons.length > 0) {
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

  // === 4. DRESS CODE CAROUSEL LOGIC ===
  function updateCarousel() {
    if (!carouselImage) return;
    const image = carouselImages[carouselIndex];
    carouselImage.src = image.src;
    carouselImage.alt = image.alt;
  }

  // Only bind carousel listeners if the elements actually exist on the page
  if (carouselImage && prevBtn && nextBtn) {
    updateCarousel(); // Initialize first image

    prevBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevents click from bubbling up to background elements
      carouselIndex = (carouselIndex - 1 + carouselImages.length) % carouselImages.length;
      updateCarousel();
    });

    nextBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevents click from bubbling up to background elements
      carouselIndex = (carouselIndex + 1) % carouselImages.length;
      updateCarousel();
    });
  }
  
// === 5. HELP MODAL LOGIC ===
  const confusedBtn = document.getElementById('confused');
  const helpModal = document.getElementById('help-modal');
  const closeModalBtn = document.getElementById('close-modal');

  if (confusedBtn && helpModal && closeModalBtn) {
    // Open modal on click
    confusedBtn.addEventListener('click', () => {
      helpModal.classList.add('active');
    });

    // Close modal on clicking the 'X'
    closeModalBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      helpModal.classList.remove('active');
    });

    // Optional user-experience bonus: close modal if clicking the dark outer background
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        helpModal.classList.remove('active');
      }
    });
  }
});


  // === DYNAMIC TEXT GRADIENT SCROLLING MASK LOGIC ===
function checkTextOverflow() {
  const textBlocks = document.querySelectorAll('.text-block');
  
  textBlocks.forEach(block => {
    // Check if the actual content height is greater than the visible bounding box
    const hasOverflow = block.scrollHeight > block.clientHeight;
    
    if (hasOverflow) {
      block.classList.add('has-overflow');
    } else {
      block.classList.remove('has-overflow');
    }
  });
}
// 1. Run the layout test immediately when the document finishes building
document.addEventListener('DOMContentLoaded', () => {
  // Give transitions a split second to settle, then verify dimensions
  setTimeout(checkTextOverflow, 200);

  // 2. Clear the gradient overlay dynamically as the user scrolls to the bottom
  document.querySelectorAll('.text-block').forEach(block => {
    block.addEventListener('scroll', () => {
      // Calculate how close the user is to hitting the baseline margin
      const distanceToBottom = block.scrollHeight - block.scrollTop - block.clientHeight;
      
      // If within 15px of the bottom, clear the gradient mask entirely
      if (distanceToBottom < 15) {
        block.classList.remove('has-overflow');
      } else if (block.scrollHeight > block.clientHeight) {
        // If they scroll back up, pop the gradient hint back on screen
        block.classList.add('has-overflow');
      }
    });
  });
});
// 3. Recalculate dimensions cleanly if your user rotates their phone into landscape
window.addEventListener('resize', checkTextOverflow);
window.addEventListener('orientationchange', () => {
  setTimeout(checkTextOverflow, 300);
});