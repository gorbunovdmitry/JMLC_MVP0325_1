const fs = require('fs');

// Добавляем недостающую инициализацию в варианты 3-11

for (let i = 3; i <= 11; i++) {
    console.log(`Добавляем инициализацию в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Ищем место для добавления инициализации - перед последним script тегом
        const scriptEndRegex = /(\s*<\/script>\s*<script>\s*\/\/ Отправляем событие просмотра конструктора)/;
        
        const initializationCode = `
        // Initialize on page load
        document.addEventListener('DOMContentLoaded', () => {
            initCarousels();
            updateStickerPreview();
            updateOrderButton();
        });
    </script>

    <script>
        // Отправляем событие просмотра конструктора`;
        
        content = content.replace(scriptEndRegex, initializationCode);
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: инициализация добавлена`);
    }
}

console.log('Готово! Инициализация добавлена в варианты 3-11.');
