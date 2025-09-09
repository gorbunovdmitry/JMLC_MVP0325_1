const fs = require('fs');

// Извлекаем и проверяем JavaScript из HTML файлов

for (let i = 4; i <= 9; i++) {
    console.log(`=== Проверяем JavaScript в 6250-${i} ===`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        const content = fs.readFileSync(designerPath, 'utf8');
        
        // Извлекаем JavaScript из script тегов
        const scriptMatches = content.match(/<script[^>]*>([\s\S]*?)<\/script>/g);
        if (scriptMatches) {
            let allJS = '';
            scriptMatches.forEach(script => {
                const jsContent = script.replace(/<\/?script[^>]*>/g, '');
                allJS += jsContent + '\n';
            });
            
            // Сохраняем во временный файл
            const tempFile = `temp-js-${i}.js`;
            fs.writeFileSync(tempFile, allJS);
            
            // Проверяем синтаксис
            try {
                require('child_process').execSync(`node -c ${tempFile}`, {stdio: 'pipe'});
                console.log(`✅ 6250-${i}: JavaScript синтаксис корректен`);
            } catch (error) {
                console.log(`❌ 6250-${i}: Ошибка в JavaScript:`);
                console.log(error.stdout ? error.stdout.toString() : error.message);
                
                // Показываем проблемные строки
                const lines = allJS.split('\n');
                lines.forEach((line, index) => {
                    if (line.trim() && (line.includes('function') || line.includes('addEventListener') || line.includes('}') || line.includes(');'))) {
                        console.log(`Строка ${index + 1}: ${line.trim()}`);
                    }
                });
            }
            
            // Удаляем временный файл
            try {
                fs.unlinkSync(tempFile);
            } catch (e) {}
        }
    }
}
