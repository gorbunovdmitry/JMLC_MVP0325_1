const fs = require('fs');
const path = require('path');

// Полностью очищаем и переписываем файлы для вариантов 4-6

for (let i = 4; i <= 6; i++) {
    const projectPath = `6250-${i}/designer-advanced.html`;
    
    if (fs.existsSync(projectPath)) {
        console.log(`Полностью очищаем и переписываем 6250-${i}...`);
        
        let content = fs.readFileSync(projectPath, 'utf8');
        
        // Удаляем все дублированные функции collectUserData
        const collectUserDataRegex = /function collectUserData\(\) \{[\s\S]*?\n        \}/g;
        const matches = content.match(collectUserDataRegex);
        
        if (matches && matches.length > 1) {
            // Оставляем только первое вхождение, удаляем остальные
            content = content.replace(collectUserDataRegex, (match, offset) => {
                if (content.indexOf(match) === offset) {
                    return match; // Оставляем первое вхождение
                }
                return ''; // Удаляем остальные
            });
        }
        
        // Удаляем все дублированные функции sendDataToGoogleSheets
        const sendDataRegex = /function sendDataToGoogleSheets\(data\) \{[\s\S]*?\n        \}/g;
        const sendMatches = content.match(sendDataRegex);
        
        if (sendMatches && sendMatches.length > 1) {
            content = content.replace(sendDataRegex, (match, offset) => {
                if (content.indexOf(match) === offset) {
                    return match; // Оставляем первое вхождение
                }
                return ''; // Удаляем остальные
            });
        }
        
        fs.writeFileSync(projectPath, content);
        console.log(`✅ 6250-${i}: дублированные функции удалены`);
    }
}

console.log('Готово!');
