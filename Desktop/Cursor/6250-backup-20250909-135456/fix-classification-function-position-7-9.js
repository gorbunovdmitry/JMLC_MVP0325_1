const fs = require('fs');

// Исправляем позицию функции getStickerClassificationFromSelections в вариантах 7-9

for (let i = 7; i <= 9; i++) {
    console.log(`Исправляем позицию функции классификации в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Удаляем функцию из CSS раздела
        const cssFunction = `        // Get sticker classification from current selections
        function getStickerClassificationFromSelections(picture, color, thickness, shape) {
            // Map UI values to classification values
            const colorMap = {
                'red': 'red',
                'green': 'green', 
                'gradient': 'gradient',
                'white': 'white',
                'black': 'black'
            };
            
            const shapeMap = {
                'small-rectangle': 'small-rectangle',
                'square': 'square',
                'rectangle': 'rectangle',
                'cutout': 'cutout',
                'circle': 'circle'
            };
            
            const thicknessMap = {
                'thin': 'thin',
                'thick': 'thick'
            };
            
            const mappedColor = colorMap[color] || 'black';
            const mappedShape = shapeMap[shape] || 'rectangle';
            const mappedThickness = thicknessMap[thickness] || 'thin';
            
            // Find sticker number based on classification
            let stickerNumber = 1; // Default
            
            // Picture-based decade calculation
            const pictureDecades = {
                'empty': 0,
                'cat': 1,
                'robot-cat': 3,
                'smile-hearts': 4,
                'gingerbread': 11,
                'slider-smile': 2,
                'donut': 12,
                'custom': 9
            };
            
            const decade = pictureDecades[picture] || 0;
            const baseNumber = decade * 10;
            
            // Shape and thickness position within decade
            const shapePositions = {
                'small-rectangle': 0,
                'square': 1,
                'rectangle': 2,
                'cutout': 3,
                'circle': 5
            };
            
            const shapePos = shapePositions[mappedShape] || 0;
            const thicknessOffset = mappedThickness === 'thin' ? 4 : 0;
            
            stickerNumber = baseNumber + shapePos + thicknessOffset + 1;
            
            // Generate filename
            const fileName = \`sticker-\${stickerNumber}-stick.png\`;
            
            return {
                stickerNumber: stickerNumber,
                fileName: fileName,
                shape: mappedShape,
                color: mappedColor,
                thickness: mappedThickness,
                picture: picture
            };
        }`;
        
        content = content.replace(cssFunction, '');
        
        // Добавляем функцию в правильный JavaScript раздел (после updateStickerPreview)
        const insertPoint = '        }';
        const jsFunction = `
        
        // Get sticker classification from current selections
        function getStickerClassificationFromSelections(picture, color, thickness, shape) {
            // Map UI values to classification values
            const colorMap = {
                'red': 'red',
                'green': 'green', 
                'gradient': 'gradient',
                'white': 'white',
                'black': 'black'
            };
            
            const shapeMap = {
                'small-rectangle': 'small-rectangle',
                'square': 'square',
                'rectangle': 'rectangle',
                'cutout': 'cutout',
                'circle': 'circle'
            };
            
            const thicknessMap = {
                'thin': 'thin',
                'thick': 'thick'
            };
            
            const mappedColor = colorMap[color] || 'black';
            const mappedShape = shapeMap[shape] || 'rectangle';
            const mappedThickness = thicknessMap[thickness] || 'thin';
            
            // Find sticker number based on classification
            let stickerNumber = 1; // Default
            
            // Picture-based decade calculation
            const pictureDecades = {
                'empty': 0,
                'cat': 1,
                'robot-cat': 3,
                'smile-hearts': 4,
                'gingerbread': 11,
                'slider-smile': 2,
                'donut': 12,
                'custom': 9
            };
            
            const decade = pictureDecades[picture] || 0;
            const baseNumber = decade * 10;
            
            // Shape and thickness position within decade
            const shapePositions = {
                'small-rectangle': 0,
                'square': 1,
                'rectangle': 2,
                'cutout': 3,
                'circle': 5
            };
            
            const shapePos = shapePositions[mappedShape] || 0;
            const thicknessOffset = mappedThickness === 'thin' ? 4 : 0;
            
            stickerNumber = baseNumber + shapePos + thicknessOffset + 1;
            
            // Generate filename
            const fileName = \`sticker-\${stickerNumber}-stick.png\`;
            
            return {
                stickerNumber: stickerNumber,
                fileName: fileName,
                shape: mappedShape,
                color: mappedColor,
                thickness: mappedThickness,
                picture: picture
            };
        }`;
        
        // Вставляем функцию после updateStickerPreview
        content = content.replace(insertPoint, insertPoint + jsFunction);
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: функция классификации перемещена в правильное место`);
    }
}

console.log('Готово! Функция классификации перемещена в правильное место в вариантах 7-9.');
