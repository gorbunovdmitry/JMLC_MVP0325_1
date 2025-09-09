const fs = require('fs');

// Добавляем функцию initCarousels в варианты 7-11

for (let i = 7; i <= 11; i++) {
    console.log(`Добавляем функцию initCarousels в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Ищем место для вставки функции initCarousels (после updateOrderButton)
        const insertPoint = '        // Update order button price - fixed price for 6250-' + i;
        const initCarouselsFunction = `
        function initCarousels() {
            const carousels = document.querySelectorAll('.carousel');
            
            carousels.forEach(carousel => {
                carousel.addEventListener('click', (e) => {
                    const item = e.target.closest('.carousel-item');
                    if (item) {
                        // Remove selection from siblings
                        const siblings = carousel.querySelectorAll('.carousel-item');
                        siblings.forEach(sibling => sibling.classList.remove('selected'));
                        
                        // Add selection to clicked item
                        item.classList.add('selected');
                        
                        // Update current selection
                        const carouselId = carousel.id;
                        const value = item.dataset.value;
                        
                        console.log('Carousel clicked:', carouselId, 'Value:', value);
                        
                        if (carouselId === 'pictureCarousel') {
                            currentSelections.picture = value;
                        } else if (carouselId === 'colorCarousel') {
                            currentSelections.color = value;
                        } else if (carouselId === 'thicknessCarousel') {
                            currentSelections.thickness = value;
                        } else if (carouselId === 'shapeCarousel') {
                            currentSelections.shape = value;
                        }
                        
                        console.log('Updated selections:', currentSelections);
                        
                        // Always update sticker preview when any parameter changes
                        updateStickerPreview();
                        
                        // Update order button price
                        updateOrderButton();
                    }
                });
            });
        }`;
        
        // Вставляем функцию после updateOrderButton
        content = content.replace(insertPoint, insertPoint + initCarouselsFunction);
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: функция initCarousels добавлена`);
    }
}

console.log('Готово! Функция initCarousels добавлена в варианты 7-11.');
