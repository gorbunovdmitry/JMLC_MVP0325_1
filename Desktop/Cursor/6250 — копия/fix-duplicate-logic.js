const fs = require('fs');
const path = require('path');

// Убираем дублированную логику и исправляем форматирование

for (let i = 4; i <= 6; i++) {
    const projectPath = `6250-${i}/designer-advanced.html`;
    
    if (fs.existsSync(projectPath)) {
        console.log(`Исправляем дублированную логику в 6250-${i}...`);
        
        let content = fs.readFileSync(projectPath, 'utf8');
        
        // Удаляем все дублированные блоки специальной логики
        content = content.replace(/\/\/ Специальная логика для картинок в вариантах 4-6[\s\S]*?pictureName;/g, '');
        
        // Добавляем правильную логику один раз
        const correctLogic = `
            // Специальная логика для картинок в вариантах 4-6
            let pictureName;
            if (currentSelections.shape === 'dzen') {
                pictureName = 'Дзынь стикер';
            } else if (currentSelections.shape === 'potato') {
                pictureName = 'Картошка';
            } else {
                pictureName = getPictureName(currentSelections.picture || 'cat');
            }`;
        
        // Заменяем picture: pictureName на правильную логику
        content = content.replace(
            /(\s+)picture: pictureName,/g,
            `$1${correctLogic}$1$1picture: pictureName,`
        );
        
        fs.writeFileSync(projectPath, content);
        console.log(`✅ 6250-${i}: дублированная логика исправлена`);
    }
}

console.log('Готово!');
