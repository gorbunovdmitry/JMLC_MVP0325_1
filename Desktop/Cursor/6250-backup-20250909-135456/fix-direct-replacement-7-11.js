const fs = require('fs');

// Прямая замена проблемного кода в вариантах 7-11

for (let i = 7; i <= 11; i++) {
    console.log(`Исправляем прямой заменой в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Ищем и заменяем проблемную строку
        content = content.replace(/(\s*}\s*)\s*}\s*function initCarousels/g, '$1}\n\n        function initCarousels');
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: прямая замена выполнена`);
    }
}

console.log('Готово! Прямая замена выполнена в вариантах 7-11.');
