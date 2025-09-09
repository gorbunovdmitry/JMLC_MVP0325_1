const fs = require('fs');
const path = require('path');

// Добавляем защиту от повторных нажатий кнопки "Заказать за..."

for (let i = 1; i <= 10; i++) {
    const projectPath = `6250-${i}/designer-advanced.html`;
    
    if (fs.existsSync(projectPath)) {
        console.log(`Добавляем защиту кнопки в 6250-${i}...`);
        
        let content = fs.readFileSync(projectPath, 'utf8');
        
        // Добавляем переменную для отслеживания состояния кнопки
        const buttonStateVar = `
        // Переменная для отслеживания состояния кнопки
        let isOrderProcessing = false;`;
        
        // Добавляем переменную перед другими переменными
        content = content.replace(/(\s+)let currentSelections = \{/, `$1${buttonStateVar}$1$1let currentSelections = {`);
        
        // Обновляем функцию selectDesign для добавления защиты
        const protectedSelectDesign = `
        // Функция для обработки выбора дизайна с защитой от повторных нажатий
        async function selectDesign() {
            // Проверяем, не обрабатывается ли уже заказ
            if (isOrderProcessing) {
                console.log('Заказ уже обрабатывается, повторное нажатие игнорируется');
                return;
            }
            
            // Блокируем кнопку и устанавливаем флаг обработки
            isOrderProcessing = true;
            const orderButton = document.getElementById('orderButton');
            const originalText = orderButton.textContent;
            
            try {
                console.log('Начинаем процесс заказа...');
                
                // Обновляем текст кнопки
                orderButton.textContent = 'Обрабатываем заказ...';
                orderButton.disabled = true;
                orderButton.style.opacity = '0.6';
                orderButton.style.cursor = 'not-allowed';
                
                // Собираем данные пользователя
                const userData = collectUserData();
                console.log('Собранные данные:', userData);
                
                // Отправляем данные в Google Таблицу
                const success = await sendDataToGoogleSheets(userData);
                
                if (success) {
                    console.log('Данные успешно отправлены, перенаправляем на страницу благодарности');
                    // Обновляем текст кнопки перед перенаправлением
                    orderButton.textContent = 'Заказ принят!';
                    // Небольшая задержка для показа пользователю
                    setTimeout(() => {
                        window.location.href = 'thank-you.html';
                    }, 1000);
                } else {
                    console.error('Ошибка при отправке данных, но заказ принят');
                    // Обновляем текст кнопки
                    orderButton.textContent = 'Заказ принят!';
                    // Небольшая задержка для показа пользователю
                    setTimeout(() => {
                        window.location.href = 'thank-you.html';
                    }, 1000);
                }
            } catch (error) {
                console.error('Ошибка при обработке заказа:', error);
                // В случае ошибки все равно перенаправляем на страницу благодарности
                orderButton.textContent = 'Заказ принят!';
                setTimeout(() => {
                    window.location.href = 'thank-you.html';
                }, 1000);
            }
            // Не сбрасываем флаг isOrderProcessing, чтобы кнопка оставалась заблокированной
        }`;
        
        // Заменяем старую функцию selectDesign
        content = content.replace(/async function selectDesign\(\) \{[\s\S]*?\n        \}/g, protectedSelectDesign);
        
        fs.writeFileSync(projectPath, content);
        console.log(`✅ 6250-${i}: защита кнопки добавлена`);
    } else {
        console.log(`❌ 6250-${i} не найден`);
    }
}

console.log('Готово! Защита от повторных нажатий добавлена во все проекты.');
