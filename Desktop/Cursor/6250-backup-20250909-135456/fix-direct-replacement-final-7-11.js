const fs = require('fs');

// Прямая замена проблемной строки в вариантах 7-11 - финальная версия

for (let i = 7; i <= 11; i++) {
    console.log(`Исправляем проблемную строку в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Ищем и заменяем проблемную строку - точная замена
        const problemString = '            });        function initCarousels() {';
        const correctString = '            });\n\n        function initCarousels() {';
        
        content = content.replace(problemString, correctString);
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: проблемная строка исправлена`);
    }
}

console.log('Готово! Проблемные строки исправлены в вариантах 7-11.');
