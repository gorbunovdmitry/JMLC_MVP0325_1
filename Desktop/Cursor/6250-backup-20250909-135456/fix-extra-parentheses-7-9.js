const fs = require('fs');

// Исправляем лишние скобки в вариантах 7-9

for (let i = 7; i <= 9; i++) {
    console.log(`Исправляем лишние скобки в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Удаляем лишние ); на строках 309-310
        content = content.replace(/\n\s*\)\;\s*\n\s*\}\s*\n/g, '\n    }\n');
        
        // Удаляем лишние ); в конце функций
        content = content.replace(/\n\s*\)\;\s*\n\s*function/g, '\n    }\n    function');
        
        // Исправляем неправильные закрывающие скобки
        content = content.replace(/\n\s*\)\;\s*\n\s*\}\s*\n\s*function/g, '\n    });\n    function');
        
        // Очищаем лишние пустые строки
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: лишние скобки удалены`);
    }
}

console.log('Готово! Лишние скобки удалены в вариантах 7-9.');
