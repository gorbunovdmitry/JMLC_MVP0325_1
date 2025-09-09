const fs = require('fs');
const path = require('path');

// Исправляем параметры для всех вариантов

for (let i = 1; i <= 10; i++) {
    const projectPath = `6250-${i}/designer-advanced.html`;
    
    if (fs.existsSync(projectPath)) {
        console.log(`Исправляем все параметры в 6250-${i}...`);
        
        let content = fs.readFileSync(projectPath, 'utf8');
        
        // Для вариантов 1-3,10: все параметры "Нет выбора"
        if (i === 1 || i === 2 || i === 3 || i === 10) {
            // Заменяем все параметры на "Нет выбора"
            content = content.replace(
                /shape: getShapeName\(currentSelections\.shape \|\| '[^']*'\)/g,
                "shape: 'Нет выбора'"
            );
            content = content.replace(
                /color: getColorName\(currentSelections\.color \|\| '[^']*'\)/g,
                "color: 'Нет выбора'"
            );
            content = content.replace(
                /picture: getPictureName\(currentSelections\.picture \|\| '[^']*'\)/g,
                "picture: 'Нет выбора'"
            );
            console.log(`✅ 6250-${i}: все параметры установлены как "Нет выбора"`);
        }
        
        // Для вариантов 4-6: только цвет и картинка "Нет выбора"
        if (i === 4 || i === 5 || i === 6) {
            // Заменяем цвет на "Нет выбора"
            content = content.replace(
                /color: getColorName\(currentSelections\.color \|\| '[^']*'\)/g,
                "color: 'Нет выбора'"
            );
            
            // Заменяем логику картинки - убираем специальную логику для дзынь/картошка
            content = content.replace(
                /\/\/ Специальная логика для картинок в вариантах 4-6[\s\S]*?pictureName;/g,
                ''
            );
            content = content.replace(
                /picture: pictureName/g,
                "picture: 'Нет выбора'"
            );
            
            console.log(`✅ 6250-${i}: цвет и картинка установлены как "Нет выбора"`);
        }
        
        fs.writeFileSync(projectPath, content);
    } else {
        console.log(`❌ 6250-${i} не найден`);
    }
}

console.log('Готово! Все параметры исправлены.');
