const fs = require('fs');

// Исправляем недостающие закрывающие скобки в вариантах 7-11 - ультра версия

for (let i = 7; i <= 11; i++) {
    console.log(`Исправляем недостающие скобки в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Ищем и добавляем недостающие закрывающие скобки - ультра точная замена
        const problemString = '        });\n    </script>';
        const correctString = '        });\n        });\n    </script>';
        
        content = content.replace(problemString, correctString);
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: недостающие скобки добавлены`);
    }
}

console.log('Готово! Недостающие скобки добавлены в вариантах 7-11.');
