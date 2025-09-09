const fs = require('fs');

// Заменяем функцию initCarousels в вариантах 7-11 на рабочую версию из резервной копии

const correctInitCarousels = `        function initCarousels() {
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

for (let i = 7; i <= 11; i++) {
    console.log(`Исправляем функцию initCarousels в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Удаляем старую сломанную функцию initCarousels и все что после нее до следующей функции
        const oldFunctionRegex = /\s*}\s*function initCarousels\(\)\s*\{[\s\S]*?\s*}\s*\n\s*\/\/ Update only sticker position/;
        content = content.replace(oldFunctionRegex, correctInitCarousels + '\n\n        // Update only sticker position');
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: функция initCarousels заменена на рабочую версию`);
    }
}

console.log('Готово! Функция initCarousels заменена в вариантах 7-11 на рабочую версию.');
