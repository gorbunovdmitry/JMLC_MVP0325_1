const fs = require('fs');

// Добавляем функцию initCarousels в варианты 7-11

const initCarousels7to11 = `        function initCarousels() {
            const thicknessCarousel = document.getElementById('thicknessCarousel');
            const shapeCarousel = document.getElementById('shapeCarousel');
            const colorCarousel = document.getElementById('colorCarousel');
            const pictureCarousel = document.getElementById('pictureCarousel');
            
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
            
            if (colorCarousel) {
                colorCarousel.addEventListener('click', (e) => {
                    const item = e.target.closest('.carousel-item');
                    if (item) {
                        // Remove selection from siblings
                        const siblings = colorCarousel.querySelectorAll('.carousel-item');
                        siblings.forEach(sibling => sibling.classList.remove('selected'));
                        
                        // Add selection to clicked item
                        item.classList.add('selected');
                        
                        // Update current selection
                        const value = item.dataset.value;
                        currentSelections.color = value;
                        
                        console.log('Color selected:', value);
                        
                        // Update sticker preview and button
                        updateStickerPreview();
                        updateOrderButton();
                    }
                });
            }
            
            if (pictureCarousel) {
                pictureCarousel.addEventListener('click', (e) => {
                    const item = e.target.closest('.carousel-item');
                    if (item) {
                        // Remove selection from siblings
                        const siblings = pictureCarousel.querySelectorAll('.carousel-item');
                        siblings.forEach(sibling => sibling.classList.remove('selected'));
                        
                        // Add selection to clicked item
                        item.classList.add('selected');
                        
                        // Update current selection
                        const value = item.dataset.value;
                        currentSelections.picture = value;
                        
                        console.log('Picture selected:', value);
                        
                        // Update sticker preview and button
                        updateStickerPreview();
                        updateOrderButton();
                    }
                });
            }
        }`;

for (let i = 7; i <= 11; i++) {
    console.log(`Добавляем функцию initCarousels в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Добавляем функцию initCarousels перед функцией updateStickerPosition
        const insertPointRegex = /(\s*\/\/ Update only sticker position)/;
        content = content.replace(insertPointRegex, initCarousels7to11 + '\n\n        $1');
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: функция initCarousels добавлена`);
    }
}

console.log('Готово! Функция initCarousels добавлена в варианты 7-11.');
