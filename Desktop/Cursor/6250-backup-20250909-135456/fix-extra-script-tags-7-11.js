const fs = require('fs');

// Исправляем лишние закрывающие script теги в вариантах 7-11

for (let i = 7; i <= 11; i++) {
    console.log(`Исправляем лишние script теги в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Удаляем лишние закрывающие script теги
        // Оставляем только те, которые соответствуют открывающим
        const lines = content.split('\n');
        let scriptCount = 0;
        let newLines = [];
        
        for (let line of lines) {
            if (line.includes('<script')) {
                scriptCount++;
                newLines.push(line);
            } else if (line.includes('</script>')) {
                if (scriptCount > 0) {
                    newLines.push(line);
                    scriptCount--;
                }
                // Пропускаем лишние закрывающие теги
            } else {
                newLines.push(line);
            }
        }
        
        content = newLines.join('\n');
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: лишние script теги удалены`);
    }
}

console.log('Готово! Лишние script теги удалены в вариантах 7-11.');
