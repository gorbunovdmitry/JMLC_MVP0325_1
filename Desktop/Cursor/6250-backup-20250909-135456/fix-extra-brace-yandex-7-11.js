const fs = require('fs');

// Исправляем лишнюю закрывающую скобку в Яндекс.Метрике в вариантах 7-11

for (let i = 7; i <= 11; i++) {
    console.log(`Исправляем лишнюю скобку в Яндекс.Метрике в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Ищем и удаляем лишнюю закрывающую скобку в Яндекс.Метрике
        const problemString = '        });\n        });\n    </script>';
        const correctString = '        });\n    </script>';
        
        content = content.replace(problemString, correctString);
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: лишняя скобка в Яндекс.Метрике удалена`);
    }
}

console.log('Готово! Лишние скобки в Яндекс.Метрике удалены в вариантах 7-11.');
