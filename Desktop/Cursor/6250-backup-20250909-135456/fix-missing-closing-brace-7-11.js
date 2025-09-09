const fs = require('fs');

// Исправляем отсутствующую закрывающую скобку для DOMContentLoaded в вариантах 7-11

for (let i = 7; i <= 11; i++) {
    console.log(`Исправляем отсутствующую закрывающую скобку в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Ищем и исправляем отсутствующую закрывающую скобку для DOMContentLoaded
        const problemString = `        // Initialize on page load
        document.addEventListener('DOMContentLoaded', () => {
            initCarousels();
            updateStickerPreview();
            updateOrderButton();
    </script>`;
        
        const correctString = `        // Initialize on page load
        document.addEventListener('DOMContentLoaded', () => {
            initCarousels();
            updateStickerPreview();
            updateOrderButton();
        });
    </script>`;
        
        content = content.replace(problemString, correctString);
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: добавлена отсутствующая закрывающая скобка`);
    }
}

console.log('Готово! Отсутствующие закрывающие скобки добавлены в вариантах 7-11.');
