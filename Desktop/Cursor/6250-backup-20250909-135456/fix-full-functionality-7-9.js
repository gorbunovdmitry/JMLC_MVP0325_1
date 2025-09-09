const fs = require('fs');

// Исправляем функционал в вариантах 7-9 для полного выбора параметров

for (let i = 7; i <= 9; i++) {
    console.log(`Исправляем полный функционал в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Заменяем функцию initCarousels на полную версию
        const oldInitCarousels = `        function initCarousels() {
            const thicknessCarousel = document.getElementById('thicknessCarousel');
            
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
        }`;
        
        const newInitCarousels = `        function initCarousels() {
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
        
        content = content.replace(oldInitCarousels, newInitCarousels);
        
        // Заменяем функцию updateStickerPreview на полную версию
        const oldUpdateStickerPreview = `        // Simple sticker update for 6250-1 - only thickness selection
        function updateStickerPreview() {
            const preview = document.getElementById('stickerPreview');
            if (!preview) return;
            
            // Show specific stickers based on thickness
            let stickerNumber, stickerName, shape;
            if (currentSelections.thickness === 'thin') {
                stickerNumber = 15;
                stickerName = 'sticker-15-stick.png';
                shape = 'cutout'; // Тонкий как cut
            } else {
                stickerNumber = 11;
                stickerName = 'sticker-11-stick.png';
                shape = 'small-rectangle'; // Толстый как small rectangle
            }
            
            const imageSrc = \`images/\${stickerName}\`;
            preview.innerHTML = \`<img src="\${imageSrc}" alt="Стикер \${stickerNumber}" style="width: 100%; height: 100%; object-fit: contain;">\`;
            positionSticker(preview, shape);
        }`;
        
        const newUpdateStickerPreview = `        // Update sticker preview based on all selections
        function updateStickerPreview() {
            const preview = document.getElementById('stickerPreview');
            const customText = document.getElementById('customText');
            
            // Show/hide custom text based on selection
            if (currentSelections.picture === 'own') {
                customText.style.display = 'block';
            } else {
                customText.style.display = 'none';
            }
            
            // Map UI values to classification values
            const pictureMap = {
                'empty': 'empty',
                'cat': 'cat',
                'robocat': 'robot-cat',
                'smile': 'smile-hearts',
                'cookie': 'gingerbread',
                'slider': 'slider-smile',
                'donut': 'donut',
                'own': 'custom'
            };
            
            const mappedPicture = pictureMap[currentSelections.picture] || 'empty';
            
            // Get sticker classification
            const classification = getStickerClassificationFromSelections(
                mappedPicture,
                currentSelections.color,
                currentSelections.thickness,
                currentSelections.shape
            );
            
            if (classification) {
                const imageSrc = \`images/\${classification.fileName}\`;
                preview.innerHTML = \`<img src="\${imageSrc}" alt="Стикер \${classification.stickerNumber}" style="width: 100%; height: 100%; object-fit: contain;">\`;
                positionSticker(preview, classification.shape);
            }
        }`;
        
        content = content.replace(oldUpdateStickerPreview, newUpdateStickerPreview);
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: полный функционал восстановлен`);
    }
}

console.log('Готово! Полный функционал восстановлен в вариантах 7-9.');
