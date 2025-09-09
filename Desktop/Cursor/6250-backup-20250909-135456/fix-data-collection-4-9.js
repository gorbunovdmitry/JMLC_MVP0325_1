const fs = require('fs');

// Исправляем сбор данных в вариантах 4-9

for (let i = 4; i <= 9; i++) {
    console.log(`Исправляем сбор данных в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Определяем тип варианта
        let variantType = '';
        let collectUserDataFunction = '';
        
        if (i >= 4 && i <= 6) {
            // Варианты 4-6: только толщина и форма
            variantType = 'thickness-shape';
            collectUserDataFunction = `        function collectUserData() {
            const variant = getVariantNumber();
            
            return {
                timestamp: new Date().toISOString(),
                variant: variant,
                thickness: currentSelections.thickness === 'thin' ? 'thin' : 'thick',
                shape: currentSelections.shape || 'rectangle',
                color: 'Нет выбора',
                picture: 'Нет выбора',
                price: getPrice(variant, currentSelections.thickness || 'thick')
            };
        }`;
        } else if (i >= 7 && i <= 9) {
            // Варианты 7-9: все параметры
            variantType = 'full';
            collectUserDataFunction = `        function collectUserData() {
            const variant = getVariantNumber();
            
            return {
                timestamp: new Date().toISOString(),
                variant: variant,
                thickness: currentSelections.thickness === 'thin' ? 'thin' : 'thick',
                shape: currentSelections.shape || 'rectangle',
                color: currentSelections.color || 'black',
                picture: currentSelections.picture || 'empty',
                price: getPrice(variant, currentSelections.thickness || 'thick')
            };
        }`;
        }
        
        // Удаляем старую функцию collectUserData если есть
        const oldCollectUserDataRegex = /function collectUserData\(\) \{[^}]+\}/g;
        content = content.replace(oldCollectUserDataRegex, '');
        
        // Добавляем новую функцию collectUserData
        const insertPoint = '        // Update order button price';
        content = content.replace(insertPoint, insertPoint + '\n' + collectUserDataFunction);
        
        // Добавляем функцию getPrice если её нет
        if (!content.includes('function getPrice')) {
            const getPriceFunction = `
        function getPrice(variant, thickness) {
            const prices = {
                4: '199',
                5: '299', 
                6: '499',
                7: '199',
                8: '299',
                9: '499'
            };
            return prices[variant] || '199';
        }`;
            content = content.replace(insertPoint, insertPoint + getPriceFunction);
        }
        
        // Добавляем функцию getVariantNumber если её нет
        if (!content.includes('function getVariantNumber')) {
            const getVariantNumberFunction = `
        function getVariantNumber() {
            return ${i};
        }`;
            content = content.replace(insertPoint, insertPoint + getVariantNumberFunction);
        }
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: сбор данных исправлен (${variantType})`);
    }
}

console.log('Готово! Сбор данных исправлен в вариантах 4-9.');
