const fs = require('fs');
const path = require('path');

// Исправляем текст "ТССС" на "тссс" на всех страницах-заглушках

for (let i = 1; i <= 10; i++) {
    const projectPath = `6250-${i}/thank-you.html`;
    
    if (fs.existsSync(projectPath)) {
        console.log(`Исправляем текст в 6250-${i}/thank-you.html...`);
        
        let content = fs.readFileSync(projectPath, 'utf8');
        
        // Заменяем "ТССС" на "тссс"
        content = content.replace(/ТССС/g, 'тссс');
        
        fs.writeFileSync(projectPath, content);
        console.log(`✅ 6250-${i}: текст исправлен на "тссс"`);
    } else {
        console.log(`❌ 6250-${i}/thank-you.html не найден`);
    }
}

console.log('Готово! Текст "ТССС" заменен на "тссс" во всех проектах.');
