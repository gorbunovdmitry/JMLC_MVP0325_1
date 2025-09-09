const fs = require('fs');

// Обновляем шрифт кнопок на Roboto во всех лендингах

for (let i = 1; i <= 11; i++) {
    console.log(`Обновляем шрифт кнопок в 6250-${i}...`);
    
    // Обрабатываем landing.html
    const landingPath = `6250-${i}/landing.html`;
    if (fs.existsSync(landingPath)) {
        let content = fs.readFileSync(landingPath, 'utf8');
        
        // Добавляем Roboto в head
        const robotoLink = `    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap" rel="stylesheet">`;
        
        // Добавляем Roboto после существующих font links
        content = content.replace(/(<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter[^"]*" rel="stylesheet">)/, `$1\n${robotoLink}`);
        
        // Обновляем стили кнопки
        content = content.replace(/\.cta-button\s*\{[^}]*\}/g, `.cta-button {
            position: fixed;
            bottom: 16px;
            left: 20px;
            right: 20px;
            width: calc(100% - 40px);
            background: #000000;
            color: #ffffff;
            border: none;
            border-radius: 12px;
            padding: 16px 24px;
            font-size: 16px;
            font-weight: 600;
            font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            cursor: pointer;
            transition: background-color 0.3s ease;
            z-index: 1000;
        }`);
        
        fs.writeFileSync(landingPath, content);
        console.log(`✅ 6250-${i}/landing.html: шрифт кнопки обновлен на Roboto`);
    }
    
    // Обрабатываем designer-advanced.html
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Добавляем Roboto в head
        const robotoLink = `    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap" rel="stylesheet">`;
        
        // Добавляем Roboto после существующих font links
        content = content.replace(/(<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter[^"]*" rel="stylesheet">)/, `$1\n${robotoLink}`);
        
        // Обновляем стили кнопки
        content = content.replace(/\.cta-button\s*\{[^}]*\}/g, `.cta-button {
            width: 100%;
            background: #000000;
            color: #ffffff;
            border: none;
            border-radius: 12px;
            padding: 16px 24px;
            font-size: 16px;
            font-weight: 600;
            font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            cursor: pointer;
            transition: background-color 0.3s ease;
            margin: 20px 0 40px;
        }`);
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: шрифт кнопки обновлен на Roboto`);
    }
}

console.log('Готово! Шрифт кнопок обновлен на Roboto во всех лендингах.');
