/* ============================================================================
   PRODUCTS PAGE ENHANCEMENTS - SCOPED TO PRODUCTS PAGE ONLY
   Premium filtering, animations, and UX enhancements
   ============================================================================ */

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', initProductsPage);
    
    function initProductsPage() {
        // Only run on products page
        if (!document.body.classList.contains('products-page')) {
            return;
        }
        
        // Cache DOM elements
        const grid = document.querySelector('.premium-product-grid');
        const tabs = document.querySelectorAll('.shop-tab');
        const productCards = document.querySelectorAll('.premium-product-card');
        
        if (!grid || !tabs.length || !productCards.length) {
            console.warn('Products page elements not found');
            return;
        }
        
        // Attach tab click handlers
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const category = this.getAttribute('data-tab');
                filterProducts(category);
            });
        });
        
        // Apply default filter on load (digital)
        setTimeout(() => {
            filterProducts('digital');
        }, 100);
        
        /**
         * Filter products by category with premium animations
         */
        function filterProducts(category) {
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            const activeTab = document.querySelector(`[data-tab="${category}"]`);
            if (activeTab) {
                activeTab.classList.add('active');
            }
            
            // Fade out grid
            grid.classList.add('is-fading');
            grid.classList.remove('is-visible');
            
            // Remove view classes
            grid.classList.remove('books-view', 'physical-view');
            
            // Add appropriate view class
            if (category === 'books') {
                grid.classList.add('books-view');
            } else if (category === 'physical') {
                grid.classList.add('physical-view');
            }
            
            // Wait for fade out, then filter
            setTimeout(() => {
                let visibleCount = 0;
                
                productCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    // Reset animation states
                    card.classList.remove('is-entering', 'is-entered');
                    
                    // Show/hide based on category match
                    if (category === 'digital' && cardCategory === 'digital') {
                        card.classList.remove('hidden');
                        applyStaggeredAnimation(card, visibleCount);
                        visibleCount++;
                    } else if (category === 'books' && cardCategory === 'book') {
                        card.classList.remove('hidden');
                        applyStaggeredAnimation(card, visibleCount);
                        visibleCount++;
                    } else if (category === 'physical' && cardCategory === 'physical') {
                        card.classList.remove('hidden');
                        applyStaggeredAnimation(card, visibleCount);
                        visibleCount++;
                    } else {
                        card.classList.add('hidden');
                    }
                });
                
                // Fade in grid
                grid.classList.remove('is-fading');
                grid.classList.add('is-visible');
                
                // Smooth scroll to grid
                setTimeout(() => {
                    const gridTop = grid.getBoundingClientRect().top + window.pageYOffset - 100;
                    window.scrollTo({
                        top: gridTop,
                        behavior: 'smooth'
                    });
                }, 100);
                
            }, 300); // Match fade-out transition
        }
        
        /**
         * Apply staggered enter animation to visible cards
         */
        function applyStaggeredAnimation(card, index) {
            // Apply entering state immediately
            card.classList.add('is-entering');
            
            // Apply entered state with stagger delay
            const delay = index * 80; // 80ms stagger between cards
            
            setTimeout(() => {
                card.classList.remove('is-entering');
                card.classList.add('is-entered');
            }, delay);
        }
        
        /**
         * Scroll hint auto-hide when CTA is visible
         * Uses IntersectionObserver for performance
         */
        initScrollHints();
        
        function initScrollHints() {
            productCards.forEach(card => {
                const scrollHint = card.querySelector('.scroll-hint');
                const cta = card.querySelector('.premium-product-cta');
                
                if (!scrollHint || !cta) return;
                
                // Create observer to watch CTA visibility
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // CTA is visible - hide hint
                            scrollHint.classList.add('hidden');
                        } else {
                            // CTA is not fully visible - show hint on hover
                            scrollHint.classList.remove('hidden');
                        }
                    });
                }, {
                    root: null, // viewport
                    threshold: 0.5 // trigger when 50% visible
                });
                
                observer.observe(cta);
            });
        }
        
        console.log('✨ Products page enhancements initialized');
    }
    
})();
