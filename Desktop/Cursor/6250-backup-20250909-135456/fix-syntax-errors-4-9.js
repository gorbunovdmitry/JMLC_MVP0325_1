const fs = require('fs');

// Исправляем синтаксические ошибки в вариантах 4-9

for (let i = 4; i <= 9; i++) {
    console.log(`Исправляем синтаксические ошибки в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Удаляем лишний текст после закрывающих скобок функций
        content = content.replace(/\} - fixed price for 6250-\d+/g, '}');
        content = content.replace(/\} based on thickness/g, '}');
        content = content.replace(/\} - Update order button price/g, '}');
        content = content.replace(/\} - Simple sticker update/g, '}');
        content = content.replace(/\} - Get sticker classification/g, '}');
        content = content.replace(/\} - Sticker classification system/g, '}');
        content = content.replace(/\} - Update sticker preview/g, '}');
        content = content.replace(/\} - Initialize on page load/g, '}');
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: синтаксические ошибки исправлены`);
    }
}

console.log('Готово! Синтаксические ошибки исправлены в вариантах 4-9.');
