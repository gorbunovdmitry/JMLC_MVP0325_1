const fs = require('fs');

// Заменяем JavaScript раздел в вариантах 7-11 на рабочий из резервной копии

// Читаем рабочий JavaScript раздел из резервной копии
const backupContent = fs.readFileSync('6250-7/javascript-section-backup.js', 'utf8');

for (let i = 7; i <= 11; i++) {
    console.log(`Заменяем JavaScript раздел в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Находим начало и конец JavaScript раздела
        const scriptStart = content.indexOf('<script>', content.indexOf('<script>') + 1); // Второй script
        const scriptEnd = content.lastIndexOf('</script>', content.lastIndexOf('</script>') - 1); // Предпоследний script
        
        if (scriptStart !== -1 && scriptEnd !== -1) {
            // Заменяем JavaScript раздел
            const beforeScript = content.substring(0, scriptStart);
            const afterScript = content.substring(scriptEnd + 9); // +9 для длины '</script>'
            
            // Адаптируем JavaScript для каждого варианта
            let adaptedScript = backupContent;
            
            // Заменяем номер варианта в аналитике
            adaptedScript = adaptedScript.replace(/var\d+/g, `var${i}`);
            
            // Адаптируем цены для каждого варианта
            if (i === 7 || i === 8 || i === 9) {
                // Варианты 7-9: полный функционал с разными ценами
                adaptedScript = adaptedScript.replace(/currentSelections = \{[^}]+\};/, `currentSelections = {
            picture: 'empty',
            color: 'black',
            thickness: 'thin',
            shape: 'rectangle'
        };`);
                
                // Обновляем функцию updateOrderButton для фиксированных цен
                const prices = { 7: '199', 8: '299', 9: '499' };
                adaptedScript = adaptedScript.replace(/function updateOrderButton\(\) \{[^}]+\}/, `function updateOrderButton() {
            const button = document.getElementById('orderButton');
            button.textContent = \`Заказать за ${prices[i]} ₽\`;
        }`);
            } else if (i === 10) {
                // Вариант 10: как 6250-1, но с динамическими ценами
                adaptedScript = adaptedScript.replace(/currentSelections = \{[^}]+\};/, `currentSelections = {
            thickness: 'thin'
        };`);
            } else if (i === 11) {
                // Вариант 11: как 6250-1, но с фиксированной ценой 499
                adaptedScript = adaptedScript.replace(/currentSelections = \{[^}]+\};/, `currentSelections = {
            thickness: 'thin'
        };`);
                adaptedScript = adaptedScript.replace(/function updateOrderButton\(\) \{[^}]+\}/, `function updateOrderButton() {
            const button = document.getElementById('orderButton');
            button.textContent = \`Заказать за 499 ₽\`;
        }`);
            }
            
            content = beforeScript + adaptedScript + afterScript;
            
            fs.writeFileSync(designerPath, content);
            console.log(`✅ 6250-${i}/designer-advanced.html: JavaScript раздел заменен на рабочий из резервной копии`);
        } else {
            console.log(`❌ 6250-${i}/designer-advanced.html: не удалось найти JavaScript раздел`);
        }
    }
}

console.log('Готово! JavaScript разделы заменены в вариантах 7-11.');
