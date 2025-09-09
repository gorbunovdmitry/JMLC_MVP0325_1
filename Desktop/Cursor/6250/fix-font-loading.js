const fs = require('fs');
const path = require('path');

// Исправляем проблему с фиолетовой страницей при загрузке шрифтов

for (let i = 1; i <= 10; i++) {
    const projectPath = `6250-${i}`;
    const landingFile = `${projectPath}/landing.html`;
    const designerFile = `${projectPath}/designer-advanced.html`;
    
    console.log(`Исправляем загрузку шрифтов в 6250-${i}...`);
    
    // Исправляем landing.html
    if (fs.existsSync(landingFile)) {
        let content = fs.readFileSync(landingFile, 'utf8');
        
        // Убираем пустой @font-face
        content = content.replace(/@font-face\s*\{[^}]*src:\s*url\('data:font\/woff2;base64,'\)[^}]*\}/g, '/* Убран пустой @font-face */');
        
        // Заменяем SF Pro Display на системные шрифты
        content = content.replace(/'SF Pro Display',\s*/g, '');
        content = content.replace(/font-family:\s*'SF Pro Display',\s*/g, 'font-family: ');
        
        // Убираем font-display: swap из body (не нужно для системных шрифтов)
        content = content.replace(/font-display:\s*swap;\s*/g, '');
        
        fs.writeFileSync(landingFile, content);
        console.log(`✅ ${landingFile} исправлен`);
    }
    
    // Исправляем designer-advanced.html
    if (fs.existsSync(designerFile)) {
        let content = fs.readFileSync(designerFile, 'utf8');
        
        // Убираем пустой @font-face
        content = content.replace(/@font-face\s*\{[^}]*src:\s*url\('data:font\/woff2;base64,'\)[^}]*\}/g, '/* Убран пустой @font-face */');
        
        // Заменяем SF Pro Display на системные шрифты
        content = content.replace(/'SF Pro Display',\s*/g, '');
        content = content.replace(/font-family:\s*'SF Pro Display',\s*/g, 'font-family: ');
        
        // Убираем font-display: swap из body
        content = content.replace(/font-display:\s*swap;\s*/g, '');
        
        fs.writeFileSync(designerFile, content);
        console.log(`✅ ${designerFile} исправлен`);
    }
}

console.log('Готово! Фиолетовая страница больше не должна появляться.');
