// Basic functionality for the landing page
document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // CTA Button click handlers
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Handle different CTA actions
            const buttonText = this.textContent.trim();
            
            switch(buttonText) {
                case 'I\'m in':
                    showModal('early-access');
                    break;
                case 'Show me more':
                    scrollToSection('use-cases');
                    break;
                case 'Yes, I want this':
                    showModal('purchase');
                    break;
                case 'Count me in':
                    showModal('privacy-signup');
                    break;
                case 'Reserve my spot':
                    showModal('early-access');
                    break;
                default:
                    showModal('contact');
            }
        });
    });

    // Initialize carousel immediately
    initializeCarousel();
    
    // Also initialize after a short delay to ensure styles are loaded
    setTimeout(() => {
        console.log('Re-initializing carousel after delay...');
        initializeCarousel();
    }, 100);
    
    // And after window load to be absolutely sure
    window.addEventListener('load', function() {
        console.log('Re-initializing carousel after window load...');
        initializeCarousel();
        
        // Force another update after images are fully loaded
        setTimeout(() => {
            console.log('Final carousel update after images loaded...');
            const track = document.querySelector('.carousel-track');
            if (track) {
                const containerWidth = track.parentElement.offsetWidth;
                const cards = track.querySelectorAll('.case-card');
                const firstCard = cards[0];
                if (firstCard) {
                    const cardWidth = firstCard.offsetWidth;
                    const gap = 32;
                    const totalContentWidth = (cards.length * cardWidth) + ((cards.length - 1) * gap);
                    const maxScroll = -(totalContentWidth - containerWidth);
                    console.log('Final dimensions - Container:', containerWidth, 'Content:', totalContentWidth, 'Cards:', cards.length, 'Max scroll:', maxScroll);
                    updateCarouselButtons(0, maxScroll);
                }
            }
        }, 500);
    });
});

// Modal functionality
function showModal(type) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    let modalContent = '';
    
    switch(type) {
        case 'early-access':
            modalContent = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Reserve Your Spot</h2>
                    <p>Be among the first to experience the future of AI cameras.</p>
                    <form class="modal-form">
                        <input type="email" placeholder="Enter your email" required>
                        <button type="submit" class="cta-button primary">Reserve Now</button>
                    </form>
                </div>
            `;
            break;
        case 'purchase':
            modalContent = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Get Your AI Camera</h2>
                    <p>Choose your preferred model and shipping option.</p>
                    <div class="pricing-options">
                        <div class="pricing-option">
                            <h3>Early Bird</h3>
                            <p class="price">$299</p>
                            <p>Limited time offer</p>
                        </div>
                        <div class="pricing-option">
                            <h3>Standard</h3>
                            <p class="price">$399</p>
                            <p>Regular price</p>
                        </div>
                    </div>
                    <button class="cta-button primary">Select Option</button>
                </div>
            `;
            break;
        default:
            modalContent = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Contact Us</h2>
                    <p>Have questions? We'd love to hear from you.</p>
                    <form class="modal-form">
                        <input type="text" placeholder="Your name" required>
                        <input type="email" placeholder="Your email" required>
                        <textarea placeholder="Your message" rows="4" required></textarea>
                        <button type="submit" class="cta-button primary">Send Message</button>
                    </form>
                </div>
            `;
    }
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        
        .modal-content {
            background: white;
            border: 1px solid #DFE1E6;
            border-radius: 12px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            text-align: center;
            position: relative;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .close {
            position: absolute;
            top: 1rem;
            right: 1.5rem;
            font-size: 1.5rem;
            cursor: pointer;
            color: #5E6C84;
            transition: color 0.2s ease;
        }
        
        .close:hover {
            color: #0052CC;
        }
        
        .modal-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 1.5rem;
        }
        
        .modal-form input,
        .modal-form textarea {
            padding: 0.75rem;
            border: 1px solid #DFE1E6;
            border-radius: 6px;
            background: white;
            color: #172B4D;
            font-family: inherit;
            font-size: 0.9rem;
        }
        
        .modal-form input::placeholder,
        .modal-form textarea::placeholder {
            color: #97A0AF;
        }
        
        .pricing-options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin: 1.5rem 0;
        }
        
        .pricing-option {
            padding: 1rem;
            border: 1px solid #DFE1E6;
            border-radius: 8px;
            background: #F8F9FA;
        }
        
        .price {
            font-size: 1.5rem;
            font-weight: 600;
            color: #0052CC;
            margin: 0.5rem 0;
        }
    `;
    document.head.appendChild(modalStyles);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        modal.remove();
        modalStyles.remove();
    });
    
    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            modalStyles.remove();
        }
    });
    
    // Form submission
    const form = modal.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would typically send the data to your backend
            alert('Thank you! We\'ll be in touch soon.');
            modal.remove();
            modalStyles.remove();
        });
    }
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.querySelector(`.${sectionId}`);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
} 

// Carousel functionality for Use Cases
function initializeCarousel() {
    console.log('Initializing carousel...');
    
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    if (!track) {
        console.log('Track not found');
        return;
    }
    
    console.log('Track found, adding event listeners');
    
    // Force layout recalculation
    track.offsetHeight;
    
    // Add event listeners to carousel buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            console.log('Prev button clicked');
            scrollCarousel(-1);
        });
        console.log('Prev button listener added');
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            console.log('Next button clicked');
            scrollCarousel(1);
        });
        console.log('Next button listener added');
    }
    
    // Test button functionality
    console.log('Testing button functionality...');
    if (nextBtn) {
        console.log('Next button element:', nextBtn);
        console.log('Next button onclick:', nextBtn.onclick);
        console.log('Next button event listeners:', nextBtn.onclick !== null);
    }
    
    // Add touch/swipe support for mobile
    addTouchSupport(track);
    
    // Force initial button state update with actual dimensions
    setTimeout(() => {
        console.log('Forcing initial button update...');
        const containerWidth = track.parentElement.offsetWidth;
        const cards = track.querySelectorAll('.case-card');
        const firstCard = cards[0];
        if (firstCard) {
            const cardWidth = firstCard.offsetWidth;
            const gap = 32;
            const totalContentWidth = (cards.length * cardWidth) + ((cards.length - 1) * gap);
            const maxScroll = -(totalContentWidth - containerWidth);
            console.log('Initial dimensions - Container:', containerWidth, 'Content:', totalContentWidth, 'Cards:', cards.length, 'Max scroll:', maxScroll);
            updateCarouselButtons(0, maxScroll);
        }
    }, 50);
    
    console.log('Carousel initialized');
}

function addTouchSupport(track) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    // Touch events for mobile
    track.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    track.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
    });
    
    track.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        
        const diffX = startX - currentX;
        const threshold = 50; // minimum swipe distance
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                // Swipe left - next
                scrollCarousel(1);
            } else {
                // Swipe right - previous
                scrollCarousel(-1);
            }
        }
        
        isDragging = false;
    });
    
    // Mouse events for desktop
    track.addEventListener('mousedown', function(e) {
        startX = e.clientX;
        isDragging = true;
        track.style.cursor = 'grabbing';
    });
    
    track.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        currentX = e.clientX;
    });
    
    track.addEventListener('mouseup', function(e) {
        if (!isDragging) return;
        
        const diffX = startX - currentX;
        const threshold = 50; // minimum drag distance
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                // Drag left - next
                scrollCarousel(1);
            } else {
                // Drag right - previous
                scrollCarousel(-1);
            }
        }
        
        isDragging = false;
        track.style.cursor = 'grab';
    });
    
    track.addEventListener('mouseleave', function(e) {
        if (isDragging) {
            isDragging = false;
            track.style.cursor = 'grab';
        }
    });
    
    // Set initial cursor
    track.style.cursor = 'grab';
}

function scrollCarousel(direction) {
    console.log('scrollCarousel called with direction:', direction);
    
    const track = document.querySelector('.carousel-track');
    if (!track) {
        console.log('Track not found in scrollCarousel');
        return;
    }
    
    // Get actual card dimensions
    const firstCard = track.querySelector('.case-card');
    if (!firstCard) {
        console.log('No cards found');
        return;
    }
    
    const cardWidth = firstCard.offsetWidth;
    const gap = 32; // 2rem gap
    const totalCardWidth = cardWidth + gap;
    
    console.log('Actual card width:', cardWidth, 'Gap:', gap, 'Total card width:', totalCardWidth);
    
    let currentScroll = 0;
    if (track.style.transform) {
        const match = track.style.transform.match(/translateX\(([-\d.]+)px\)/);
        if (match) {
            currentScroll = parseFloat(match[1]);
        }
    }
    
    let newScroll = currentScroll + (direction * totalCardWidth);
    
    // Calculate max scroll based on actual content with gaps
    const containerWidth = track.parentElement.offsetWidth;
    const cards = track.querySelectorAll('.case-card');
    const totalContentWidth = (cards.length * cardWidth) + ((cards.length - 1) * gap);
    const maxScroll = -(totalContentWidth - containerWidth);
    
    console.log('Container width:', containerWidth, 'Total content width:', totalContentWidth, 'Cards:', cards.length, 'Max scroll:', maxScroll);
    
    // Limit scrolling
    if (newScroll > 0) newScroll = 0;
    if (newScroll < maxScroll) newScroll = maxScroll;
    
    console.log('Scrolling from', currentScroll, 'to', newScroll);
    
    // Force the transform to be applied
    track.style.transform = `translateX(${newScroll}px)`;
    track.style.transition = 'transform 0.3s ease';
    
    // Force a reflow to ensure the transform is applied
    track.offsetHeight;
    
    console.log('Transform applied:', track.style.transform);
    
    // Update button states
    updateCarouselButtons(newScroll, maxScroll);
}

function updateCarouselButtons(currentScroll, maxScroll) {
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    console.log('Updating buttons - Current scroll:', currentScroll, 'Max scroll:', maxScroll);
    
    if (prevBtn) {
        prevBtn.disabled = currentScroll >= 0;
        console.log('Prev button disabled:', prevBtn.disabled);
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentScroll <= maxScroll;
        console.log('Next button disabled:', nextBtn.disabled);
    }
}

// Test function to check if carousel is working
function testCarousel() {
    console.log('=== TESTING CAROUSEL ===');
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    console.log('Track:', track);
    console.log('Prev button:', prevBtn);
    console.log('Next button:', nextBtn);
    
    if (track && prevBtn && nextBtn) {
        console.log('All elements found, testing scroll...');
        
        // Test manual scroll
        track.style.transform = 'translateX(-100px)';
        console.log('Manual transform applied:', track.style.transform);
        
        // Test button click
        nextBtn.click();
        console.log('Next button clicked programmatically');
    }
}

// Make test function globally available
window.testCarousel = testCarousel;

// Make functions globally available
window.scrollCarousel = scrollCarousel;
window.updateCarouselButtons = updateCarouselButtons;
window.initializeCarousel = initializeCarousel; 