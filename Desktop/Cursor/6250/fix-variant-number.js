const fs = require('fs');
const path = require('path');

// Исправляем функцию getVariantNumber во всех проектах

for (let i = 1; i <= 10; i++) {
    const projectPath = `6250-${i}/designer-advanced.html`;
    
    if (fs.existsSync(projectPath)) {
        console.log(`Исправляем номер варианта в 6250-${i}...`);
        
        let content = fs.readFileSync(projectPath, 'utf8');
        
        // Удаляем все старые функции getVariantNumber
        content = content.replace(/function getVariantNumber\(\) \{[^}]*\}/g, '');
        
        // Добавляем правильную функцию getVariantNumber
        const correctFunction = `
        // Функция для получения номера варианта
        function getVariantNumber() {
            return ${i};
        }`;
        
        // Добавляем функцию перед collectUserData
        content = content.replace(/(\s+)function collectUserData\(\) \{/, `$1${correctFunction}$1$1function collectUserData() {`);
        
        fs.writeFileSync(projectPath, content);
        console.log(`✅ 6250-${i} исправлен - номер варианта: ${i}`);
    } else {
        console.log(`❌ 6250-${i} не найден`);
    }
}

console.log('Готово! Теперь все проекты будут отправлять правильные номера вариантов.');
