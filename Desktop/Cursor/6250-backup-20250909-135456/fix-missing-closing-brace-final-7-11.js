const fs = require('fs');

// Исправляем отсутствующую закрывающую скобку для второго DOMContentLoaded в вариантах 7-11

for (let i = 7; i <= 11; i++) {
    console.log(`Исправляем отсутствующую закрывающую скобку в 6250-${i}...`);
    
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Ищем и исправляем отсутствующую закрывающую скобку для второго DOMContentLoaded
        const problemString = `        // Отслеживаем клик на кнопку "Заказать за Х р"
        document.addEventListener('DOMContentLoaded', function() {
            const orderBtn = document.getElementById('orderButton');
            if (orderBtn) {
                orderBtn.addEventListener('click', function() {
                    gtag('event', '6250_click_buy_var${i}');
                    ym(96171108, 'reachGoal', '6250_click_buy_var${i}');
                });
            }
    </script>`;
        
        const correctString = `        // Отслеживаем клик на кнопку "Заказать за Х р"
        document.addEventListener('DOMContentLoaded', function() {
            const orderBtn = document.getElementById('orderButton');
            if (orderBtn) {
                orderBtn.addEventListener('click', function() {
                    gtag('event', '6250_click_buy_var${i}');
                    ym(96171108, 'reachGoal', '6250_click_buy_var${i}');
                });
            }
        });
    </script>`;
        
        content = content.replace(problemString, correctString);
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: добавлена отсутствующая закрывающая скобка`);
    }
}

console.log('Готово! Отсутствующие закрывающие скобки добавлены в вариантах 7-11.');
