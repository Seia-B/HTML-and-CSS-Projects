(function() {
    'use strict';

    // RECIPE TOGGLE ANIMATION
    
    function initToggle() {
        // Get all toggle elements
        const toggles = document.querySelectorAll('.toggle');

        toggles.forEach(toggle => {
            const content = toggle.querySelector('.toggle-content');
            
            if (!content) return;

            // Set initial state
            if (!toggle.hasAttribute('open')) {
                content.style.maxHeight = '0';
                content.style.padding = '0 16px';
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.padding = '16px';
            }

            // Listen for toggle events
            toggle.addEventListener('toggle', function() {
                if (this.hasAttribute('open')) {
                    // Opening
                    content.style.maxHeight = content.scrollHeight + 'px';
                    content.style.padding = '16px';
                } else {
                    // Closing
                    content.style.maxHeight = '0';
                    content.style.padding = '0 16px';
                }
            });

            // Update max-height when window resizes
            window.addEventListener('resize', function() {
                if (toggle.hasAttribute('open')) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        });
    }

    // IMAGE LIGHTBOX
    
    function initLightbox() {
        // Create lightbox HTML structure
        const lightboxHTML = `
            <div id="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-label="Image gallery">
                <div class="lightbox-overlay"></div>
                <div class="lightbox-content">
                    <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
                    <button class="lightbox-prev" aria-label="Previous image">&#10094;</button>
                    <img src="" alt="" class="lightbox-image">
                    <button class="lightbox-next" aria-label="Next image">&#10095;</button>
                    <div class="lightbox-caption"></div>
                </div>
            </div>
        `;

        // Insert lightbox into the document
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);

        // Get all recipe images
        const recipeImages = document.querySelectorAll('.recipe-img');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = lightbox.querySelector('.lightbox-image');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        
        let currentIndex = 0;
        const imageData = [];

        // Prepare image data array
        recipeImages.forEach((img, index) => {
            // Create larger version path 
            const largeSrc = img.src.replace(/(\.[^.]+)$/, '_large$1');
            
            imageData.push({
                src: largeSrc,
                alt: img.alt,
                caption: img.closest('.recipe-card').querySelector('.recipe-title').textContent
            });

            // Make images clickable
            img.style.cursor = 'pointer';
            img.setAttribute('tabindex', '0');
            
            // Click event
            img.addEventListener('click', function() {
                openLightbox(index);
            });

            // Keyboard accessibility
            img.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                }
            });
        });

        // Open lightbox function
        function openLightbox(index) {
            currentIndex = index;
            updateLightboxImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            lightboxImg.focus();
        }

        // Close lightbox function
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Update lightbox image
        function updateLightboxImage() {
            const data = imageData[currentIndex];
            lightboxImg.src = data.src;
            lightboxImg.alt = data.alt;
            lightboxCaption.textContent = data.caption;

            // Show/hide navigation buttons
            prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
            nextBtn.style.display = currentIndex < imageData.length - 1 ? 'block' : 'none';
        }

        // Navigate to previous image
        function showPrev() {
            if (currentIndex > 0) {
                currentIndex--;
                updateLightboxImage();
            }
        }

        // Navigate to next image
        function showNext() {
            if (currentIndex < imageData.length - 1) {
                currentIndex++;
                updateLightboxImage();
            }
        }

        // Event listeners
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;

            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPrev();
                    break;
                case 'ArrowRight':
                    showNext();
                    break;
            }
        });

        // Prevent body scroll when lightbox is open
        lightbox.addEventListener('wheel', function(e) {
            if (lightbox.classList.contains('active')) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    // INITIALIZE ALL FEATURES
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initToggle();
            initLightbox();
        });
    } else {
        // DOM already loaded
        initToggle();
        initLightbox();
    }

})();