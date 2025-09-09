const fs = require('fs');
const path = require('path');

// Восстанавливаем удаленные функции для вариантов 4-6

for (let i = 4; i <= 6; i++) {
    const projectPath = `6250-${i}/designer-advanced.html`;
    
    if (fs.existsSync(projectPath)) {
        console.log(`Восстанавливаем функции в 6250-${i}...`);
        
        let content = fs.readFileSync(projectPath, 'utf8');
        
        // Добавляем все необходимые функции перед selectDesign
        const functionsToAdd = `
        // Функция для получения номера варианта
        function getVariantNumber() {
            return ${i};
        }

        // Функция для получения названия формы
        function getShapeName(shape) {
            const shapeNames = {
                'small-rectangle': 'Маленький прямоугольник',
                'square': 'Квадрат',
                'rectangle': 'Прямоугольник',
                'cutout': 'С вырезом',
                'circle': 'Круг',
                'dzen': 'Дзынь стикер',
                'potato': 'Картошка'
            };
            return shapeNames[shape] || shape;
        }

        // Функция для получения названия цвета
        function getColorName(color) {
            const colorNames = {
                'red': 'Красный',
                'green': 'Зеленый',
                'gradient': 'Градиент',
                'white': 'Белый',
                'black': 'Черный'
            };
            return colorNames[color] || color;
        }

        // Функция для получения названия картинки
        function getPictureName(picture) {
            const pictureNames = {
                'empty': 'Пустой',
                'cat': 'Кот',
                'slider-smile': 'Слайдер-смайл',
                'robot-cat': 'Робокот',
                'heart-smile': 'Смайл с сердцами',
                'custom': 'Своя картинка',
                'gingerbread': 'Пряничный человек',
                'donut': 'Пончик',
                'ribbon': 'Лента'
            };
            return pictureNames[picture] || picture;
        }

        // Функция для получения цены
        function getPrice(variant, thickness) {
            const prices = {
                1: 199, 4: 199, 7: 199,
                2: 299, 5: 299, 8: 299,
                3: 499, 6: 499, 9: 499,
                10: thickness === 'thin' ? 990 : 690
            };
            return prices[variant] || 199;
        }

        // Функция для сбора данных пользователя
        function collectUserData() {
            const variant = getVariantNumber();
            const price = getPrice(variant, currentSelections.thickness);
            
            // Специальная логика для картинок в вариантах 4-6
            let pictureName;
            if (currentSelections.shape === 'dzen') {
                pictureName = 'Дзынь стикер';
            } else if (currentSelections.shape === 'potato') {
                pictureName = 'Картошка';
            } else {
                pictureName = getPictureName(currentSelections.picture || 'cat');
            }
            
            return {
                timestamp: new Date().toISOString(),
                variant: variant,
                thickness: currentSelections.thickness === 'thin' ? 'thin' : 'thick',
                shape: getShapeName(currentSelections.shape || 'small-rectangle'),
                color: getColorName(currentSelections.color || 'red'),
                picture: pictureName,
                price: price
            };
        }

        // Функция для отправки данных через JSONP (обход CORS)
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
                    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxenb1I-6wje2xrnrbHsfbYpyxxEJ65zodB2Gqhfek6rcb0A_IAyM-VsbGa08o3tc9M/exec';
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
        
        // Добавляем функции перед selectDesign
        content = content.replace(/(\s+)async function selectDesign\(\) \{/, `$1${functionsToAdd}$1$1async function selectDesign() {`);
        
        fs.writeFileSync(projectPath, content);
        console.log(`✅ 6250-${i}: функции восстановлены`);
    }
}

console.log('Готово!');
