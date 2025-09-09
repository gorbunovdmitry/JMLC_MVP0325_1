const fs = require('fs');

// Обновляем аналитику для варианта 11
const files = ['landing.html', 'designer-advanced.html', 'thank-you.html'];

files.forEach(file => {
    const filePath = `6250-11/${file}`;
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Заменяем все события с var10 на var11
        content = content.replace(/var10/g, 'var11');
        
        fs.writeFileSync(filePath, content);
        console.log(`✅ Обновлен ${file} для варианта 11`);
    }
});

console.log('Готово! Аналитика обновлена для варианта 11.');
