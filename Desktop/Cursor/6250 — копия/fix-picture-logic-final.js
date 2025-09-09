const fs = require('fs');
const path = require('path');

// Полностью переписываем логику картинок для вариантов 4-6

for (let i = 4; i <= 6; i++) {
    const projectPath = `6250-${i}/designer-advanced.html`;
    
    if (fs.existsSync(projectPath)) {
        console.log(`Полностью переписываем логику картинок в 6250-${i}...`);
        
        let content = fs.readFileSync(projectPath, 'utf8');
        
        // Находим функцию collectUserData и полностью переписываем её
        const newCollectUserData = `
        // Функция для сбора данных пользователя
        function collectUserData() {
            const variant = getVariantNumber();
            const price = getPrice(variant, currentSelections.thickness);
            
            // Специальная логика для картинок в вариантах 4-6
            let pictureName;
            if (currentSelections.shape === 'dzen') {
                pictureName = 'Дзынь стикер';
            } else if (currentSelections.shape === 'potato') {
                pictureName = 'Картошка';
            } else {
                pictureName = getPictureName(currentSelections.picture || 'cat');
            }
            
            return {
                timestamp: new Date().toISOString(),
                variant: variant,
                thickness: currentSelections.thickness === 'thin' ? 'thin' : 'thick',
                shape: getShapeName(currentSelections.shape || 'small-rectangle'),
                color: getColorName(currentSelections.color || 'red'),
                picture: pictureName,
                price: price
            };
        }`;
        
        // Заменяем всю функцию collectUserData
        content = content.replace(/function collectUserData\(\) \{[\s\S]*?\n        \}/g, newCollectUserData);
        
        fs.writeFileSync(projectPath, content);
        console.log(`✅ 6250-${i}: логика картинок полностью переписана`);
    }
}

console.log('Готово!');
