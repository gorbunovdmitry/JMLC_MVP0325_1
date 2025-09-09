const fs = require('fs');

// Удаляем дублированную функцию initCarousels в вариантах 7-11

for (let i = 7; i <= 11; i++) {
    console.log(`Удаляем дублированную функцию initCarousels в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Ищем и удаляем дублированную функцию initCarousels
        // Ищем от "function initCarousels() {" до следующей функции или конца скрипта
        const duplicateRegex = /\s*function initCarousels\(\)\s*\{[\s\S]*?\s*}\s*\n\s*\/\/ Update only sticker position/;
        content = content.replace(duplicateRegex, '\n        // Update only sticker position');
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: дублированная функция initCarousels удалена`);
    }
}

console.log('Готово! Дублированные функции initCarousels удалены в вариантах 7-11.');
