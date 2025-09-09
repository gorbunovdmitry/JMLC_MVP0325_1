const fs = require('fs');
const path = require('path');

// JSONP функция для замены
const jsonpFunction = `        // Функция для отправки данных через JSONP (обход CORS)
        function sendDataToGoogleSheets(data) {
            return new Promise((resolve, reject) => {
                try {
                    console.log('Отправляем данные через JSONP:', data);
                    
                    // Создаем уникальное имя функции для JSONP
                    const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
                    
                    // Создаем глобальную функцию для обработки ответа
                    window[callbackName] = function(response) {
                        // Удаляем функцию после использования
                        delete window[callbackName];
                        if (document.getElementById('jsonp_script')) {
                            document.head.removeChild(document.getElementById('jsonp_script'));
                        }
                        
                        if (response.success) {
                            console.log('Данные успешно отправлены в Google Таблицу');
                            resolve(true);
                        } else {
                            console.error('Ошибка при отправке данных:', response.error);
                            reject(new Error(response.error));
                        }
                    };
                    
                    // Создаем script тег для JSONP запроса
                    const script = document.createElement('script');
                    script.id = 'jsonp_script';
                    
                    // URL Google Apps Script с параметрами
                    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxeoRBN7KAnDzvn6a6TuzIgYWK0JlOuBfs-PY0MkIqljVnK7RPKndUqNGydGbYzFYjt/exec';
                    const params = new URLSearchParams({
                        callback: callbackName,
                        data: JSON.stringify(data)
                    });
                    
                    script.src = GOOGLE_SCRIPT_URL + '?' + params.toString();
                    script.onerror = function() {
                        delete window[callbackName];
                        if (document.getElementById('jsonp_script')) {
                            document.head.removeChild(document.getElementById('jsonp_script'));
                        }
                        reject(new Error('Ошибка загрузки JSONP скрипта'));
                    };
                    
                    document.head.appendChild(script);
                    
                } catch (error) {
                    console.error('Ошибка при создании JSONP запроса:', error);
                    reject(error);
                }
            });
        }`;

// Обновляем проекты 2-10
for (let i = 2; i <= 10; i++) {
    const projectPath = `6250-${i}/designer-advanced.html`;
    
    if (fs.existsSync(projectPath)) {
        console.log(`Обновляем 6250-${i}...`);
        
        let content = fs.readFileSync(projectPath, 'utf8');
        
        // Удаляем все старые функции sendDataToGoogleSheets
        content = content.replace(/async function sendDataToGoogleSheets\(data\) \{[\s\S]*?\n        \}/g, '');
        
        // Добавляем новую JSONP функцию перед selectDesign
        content = content.replace(/(\s+)async function selectDesign\(\) \{/, `$1${jsonpFunction}\n\n$1async function selectDesign() {`);
        
        fs.writeFileSync(projectPath, content);
        console.log(`✅ 6250-${i} обновлен`);
    } else {
        console.log(`❌ 6250-${i} не найден`);
    }
}

console.log('Готово!');
