const fs = require('fs');

// Исправляем позицию функции initCarousels в вариантах 4-9

for (let i = 4; i <= 9; i++) {
    console.log(`Исправляем позицию initCarousels в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Удаляем старую функцию initCarousels если она определена внутри другой функции
        const oldInitCarouselsRegex = /                function initCarousels\(\) \{[^}]+\}/g;
        content = content.replace(oldInitCarouselsRegex, '');
        
        // Добавляем правильную функцию initCarousels
        let initCarouselsFunction = '';
        
        if (i >= 4 && i <= 6) {
            // Варианты 4-6: только толщина и форма
            initCarouselsFunction = `        function initCarousels() {
            const thicknessCarousel = document.getElementById('thicknessCarousel');
            const shapeCarousel = document.getElementById('shapeCarousel');
            
            if (thicknessCarousel) {
                thicknessCarousel.addEventListener('click', (e) => {
                    const item = e.target.closest('.carousel-item');
                    if (item) {
                        // Remove selection from siblings
                        const siblings = thicknessCarousel.querySelectorAll('.carousel-item');
                        siblings.forEach(sibling => sibling.classList.remove('selected'));
                        
                        // Add selection to clicked item
                        item.classList.add('selected');
                        
                        // Update current selection
                        const value = item.dataset.value;
                        currentSelections.thickness = value;
                        
                        console.log('Thickness selected:', value);
                        
                        // Update sticker preview and button
                        updateStickerPreview();
                        updateOrderButton();
                    }
                });
            }
            
            if (shapeCarousel) {
                shapeCarousel.addEventListener('click', (e) => {
                    const item = e.target.closest('.carousel-item');
                    if (item) {
                        // Remove selection from siblings
                        const siblings = shapeCarousel.querySelectorAll('.carousel-item');
                        siblings.forEach(sibling => sibling.classList.remove('selected'));
                        
                        // Add selection to clicked item
                        item.classList.add('selected');
                        
                        // Update current selection
                        const value = item.dataset.value;
                        currentSelections.shape = value;
                        
                        console.log('Shape selected:', value);
                        
                        // Update sticker preview and button
                        updateStickerPreview();
                        updateOrderButton();
                    }
                });
            }
        }`;
        } else if (i >= 7 && i <= 9) {
            // Варианты 7-9: все параметры
            initCarouselsFunction = `        function initCarousels() {
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
        }
        
        // Добавляем функцию после updateOrderButton
        const insertPoint = '        function updateOrderButton() {';
        content = content.replace(insertPoint, initCarouselsFunction + '\n\n        ' + insertPoint);
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: функция initCarousels исправлена`);
    }
}

console.log('Готово! Функция initCarousels исправлена в вариантах 4-9.');
