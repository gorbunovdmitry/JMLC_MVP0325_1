const fs = require('fs');

// Добавляем правило для картошки и дзынь стикера в варианты 4-6

for (let i = 4; i <= 6; i++) {
    console.log(`Добавляем правило для специальных форм в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Ищем функцию initCarousels и добавляем специальную логику для форм
        const initCarouselsRegex = /(function initCarousels\(\) \{[\s\S]*?currentSelections\.shape = value;[\s\S]*?)(updateStickerPreview\(\);[\s\S]*?updateOrderButton\(\);)/;
        
        const replacement = `$1
                        
                        // Специальная логика для картошки и дзынь стикера - скрываем тонкий вариант
                        const thickButton = document.querySelector('[data-value="bold"]');
                        const thinButton = document.querySelector('[data-value="thin"]');
                        
                        if (value === 'potato' || value === 'dzen') {
                            // Для картошки и дзынь стикера скрываем тонкий вариант
                            if (thinButton) thinButton.style.display = 'none';
                            if (thickButton) thickButton.style.display = 'flex';
                            // Автоматически выбираем толстый вариант
                            currentSelections.thickness = 'bold';
                            if (thickButton) thickButton.classList.add('selected');
                            if (thinButton) thinButton.classList.remove('selected');
                        } else {
                            // Для других форм показываем оба варианта
                            if (thickButton) thickButton.style.display = 'flex';
                            if (thinButton) thinButton.style.display = 'flex';
                        }
                        
                        $2`;
        
        content = content.replace(initCarouselsRegex, replacement);
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: специальная логика для форм добавлена`);
    }
}

console.log('Готово! Специальная логика для картошки и дзынь стикера добавлена в варианты 4-6.');
