const fs = require('fs');
const path = require('path');

// Исправляем параметры формы и картинки для разных вариантов

for (let i = 1; i <= 10; i++) {
    const projectPath = `6250-${i}/designer-advanced.html`;
    
    if (fs.existsSync(projectPath)) {
        console.log(`Исправляем параметры в 6250-${i}...`);
        
        let content = fs.readFileSync(projectPath, 'utf8');
        
        // Для вариантов 1-3,10: форма должна быть "Нет выбора"
        if (i === 1 || i === 2 || i === 3 || i === 10) {
            // Заменяем логику для формы
            content = content.replace(
                /shape: getShapeName\(currentSelections\.shape \|\| '[^']*'\)/g,
                "shape: 'Нет выбора'"
            );
            console.log(`✅ 6250-${i}: форма установлена как "Нет выбора"`);
        }
        
        // Для вариантов 4-6: специальная логика для картинок
        if (i === 4 || i === 5 || i === 6) {
            // Находим функцию collectUserData и заменяем логику картинки
            const pictureLogic = `
            // Специальная логика для картинок в вариантах 4-6
            let pictureName;
            if (currentSelections.shape === 'dzen') {
                pictureName = 'Дзынь стикер';
            } else if (currentSelections.shape === 'potato') {
                pictureName = 'Картошка';
            } else {
                pictureName = getPictureName(currentSelections.picture || 'cat');
            }`;
            
            // Заменяем старую логику картинки
            content = content.replace(
                /picture: getPictureName\(currentSelections\.picture \|\| '[^']*'\)/g,
                'picture: pictureName'
            );
            
            // Добавляем новую логику перед picture
            content = content.replace(
                /(\s+)picture: pictureName/g,
                `$1${pictureLogic}$1$1picture: pictureName`
            );
            
            console.log(`✅ 6250-${i}: добавлена специальная логика для картинок`);
        }
        
        fs.writeFileSync(projectPath, content);
    } else {
        console.log(`❌ 6250-${i} не найден`);
    }
}

console.log('Готово! Параметры формы и картинки исправлены.');
