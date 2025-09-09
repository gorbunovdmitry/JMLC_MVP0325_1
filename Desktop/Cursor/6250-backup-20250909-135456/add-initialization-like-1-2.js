const fs = require('fs');

// Добавляем инициализацию как в вариантах 1-2 для вариантов 3-11

for (let i = 3; i <= 11; i++) {
    console.log(`Добавляем инициализацию в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Ищем место для добавления инициализации - перед закрытием основного script тега
        const scriptEndRegex = /(\s*\/\/ Не сбрасываем флаг isOrderProcessing, чтобы кнопка оставалась заблокированной\s*\}\s*)\s*<\/script>/;
        
        const initializationCode = `
        // Не сбрасываем флаг isOrderProcessing, чтобы кнопка оставалась заблокированной
        }
        
        // Initialize on page load
        document.addEventListener('DOMContentLoaded', () => {
            initCarousels();
            updateStickerPreview();
            updateOrderButton();
        });
    </script>`;
        
        content = content.replace(scriptEndRegex, initializationCode);
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: инициализация добавлена`);
    }
}

console.log('Готово! Инициализация добавлена в варианты 3-11 как в вариантах 1-2.');
