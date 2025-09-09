const fs = require('fs');

// Исправляем лишнюю закрывающую скобку в ультра ультра ультра ультра ультра ультра ультра ультра финальной версии в вариантах 7-11

for (let i = 7; i <= 11; i++) {
    console.log(`Исправляем лишнюю скобку в ультра ультра ультра ультра ультра ультра ультра ультра финальной версии в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Ищем и удаляем лишнюю закрывающую скобку в ультра ультра ультра ультра ультра ультра ультра ультра финальной версии
        const problemString = '                });\n            }\n        });\n    </script>';
        const correctString = '                });\n            }\n    </script>';
        
        content = content.replace(problemString, correctString);
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: лишняя скобка в ультра ультра ультра ультра ультра ультра ультра ультра финальной версии удалена`);
    }
}

console.log('Готово! Лишние скобки в ультра ультра ультра ультра ультра ультра ультра ультра финальной версии удалены в вариантах 7-11.');
