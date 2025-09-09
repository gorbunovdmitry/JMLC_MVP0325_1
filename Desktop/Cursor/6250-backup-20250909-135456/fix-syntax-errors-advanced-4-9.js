const fs = require('fs');

// Исправляем продвинутые синтаксические ошибки в вариантах 4-9

for (let i = 4; i <= 9; i++) {
    console.log(`Исправляем продвинутые синтаксические ошибки в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Исправляем лишние закрывающие скобки
        content = content.replace(/\n\s*}\);[\s\n]*}/g, '\n        }');
        content = content.replace(/\n\s*}\);[\s\n]*if/g, '\n        }\n        if');
        
        // Исправляем лишние return statements вне функций
        content = content.replace(/\n\s*;\s*\n\s*return data;\s*\n\s*}/g, '\n        }');
        content = content.replace(/\n\s*return data;\s*\n\s*}/g, '\n        }');
        
        // Исправляем дублированные комментарии
        content = content.replace(/\/\/ Функция для отправки данных в Google Таблицу\s*\n\s*\/\/ Функция для отправки данных в Google Таблицу/g, '// Функция для отправки данных в Google Таблицу');
        
        // Исправляем лишние пустые строки и точки с запятой
        content = content.replace(/\n\s*;\s*\n/g, '\n');
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: продвинутые синтаксические ошибки исправлены`);
    }
}

console.log('Готово! Продвинутые синтаксические ошибки исправлены в вариантах 4-9.');
