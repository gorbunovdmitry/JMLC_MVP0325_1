const fs = require('fs');

// Исправляем дублированные функции в вариантах 7-9

for (let i = 7; i <= 9; i++) {
    console.log(`Исправляем дублированные функции в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Удаляем дублированные функции initCarousels
        const initCarouselsRegex = /function initCarousels\(\) \{[\s\S]*?\n\}/g;
        const matches = content.match(initCarouselsRegex);
        if (matches && matches.length > 1) {
            // Оставляем только первую функцию
            content = content.replace(initCarouselsRegex, (match, offset) => {
                if (offset === content.indexOf(match)) {
                    return match; // Первое вхождение оставляем
                }
                return ''; // Остальные удаляем
            });
        }
        
        // Удаляем дублированные функции getStickerClassification
        const getStickerClassificationRegex = /function getStickerClassification\(stickerNumber\) \{[\s\S]*?\n\}/g;
        const classificationMatches = content.match(getStickerClassificationRegex);
        if (classificationMatches && classificationMatches.length > 1) {
            content = content.replace(getStickerClassificationRegex, (match, offset) => {
                if (offset === content.indexOf(match)) {
                    return match; // Первое вхождение оставляем
                }
                return ''; // Остальные удаляем
            });
        }
        
        // Удаляем дублированные функции getShapeName, getColorName, getPictureName, getPrice
        const duplicateFunctions = [
            'getShapeName', 'getColorName', 'getPictureName', 'getPrice'
        ];
        
        duplicateFunctions.forEach(funcName => {
            const regex = new RegExp(`function ${funcName}\\([^)]*\\) \\{[\\s\\S]*?\\n\\}`, 'g');
            const funcMatches = content.match(regex);
            if (funcMatches && funcMatches.length > 1) {
                content = content.replace(regex, (match, offset) => {
                    if (offset === content.indexOf(match)) {
                        return match; // Первое вхождение оставляем
                    }
                    return ''; // Остальные удаляем
                });
            }
        });
        
        // Очищаем лишние пустые строки
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: дублированные функции удалены`);
    }
}

console.log('Готово! Дублированные функции удалены в вариантах 7-9.');
