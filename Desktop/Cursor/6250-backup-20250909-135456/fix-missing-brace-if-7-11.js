const fs = require('fs');

// Исправляем недостающую закрывающую скобку для if в вариантах 7-11

for (let i = 7; i <= 11; i++) {
    console.log(`Исправляем недостающую скобку для if в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Ищем и добавляем недостающую закрывающую скобку для if
        const problemString = '                });\n            }\n    </script>';
        const correctString = '                });\n            }\n        });\n    </script>';
        
        content = content.replace(problemString, correctString);
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: недостающая скобка для if добавлена`);
    }
}

console.log('Готово! Недостающие скобки для if добавлены в вариантах 7-11.');
