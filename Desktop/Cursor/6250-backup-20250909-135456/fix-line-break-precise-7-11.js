const fs = require('fs');

// Исправляем отсутствие переноса строки перед функцией initCarousels в вариантах 7-11 - точно

for (let i = 7; i <= 11; i++) {
    console.log(`Исправляем перенос строки в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Исправляем отсутствие переноса строки перед функцией initCarousels - более точный regex
        const lineBreakRegex = /(\s*}\s*)\s*}\s*function initCarousels/;
        content = content.replace(lineBreakRegex, '$1}\n\n        function initCarousels');
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: перенос строки исправлен`);
    }
}

console.log('Готово! Переносы строк исправлены в вариантах 7-11.');
