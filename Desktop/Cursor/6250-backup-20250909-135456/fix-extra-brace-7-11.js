const fs = require('fs');

// Исправляем лишнюю закрывающую скобку в вариантах 7-11

for (let i = 7; i <= 11; i++) {
    console.log(`Исправляем лишнюю скобку в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Ищем и удаляем лишнюю закрывающую скобку
        const extraBraceRegex = /(\s*}\s*)\s*}\s*\)\s*;\s*\/\/ Update only sticker position/;
        content = content.replace(extraBraceRegex, '$1\n        // Update only sticker position');
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: лишняя скобка удалена`);
    }
}

console.log('Готово! Лишние скобки удалены в вариантах 7-11.');
