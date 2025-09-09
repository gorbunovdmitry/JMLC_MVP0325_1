const fs = require('fs');
const path = require('path');

// Функция selectDesign с JSONP
const selectDesignFunction = `
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

        // Функция для получения номера варианта
        function getVariantNumber() {
            // Определяем номер варианта по URL или другим способом
            const path = window.location.pathname;
            const match = path.match(/6250-(\d+)/);
            return match ? parseInt(match[1]) : 1;
        }

        // Функция для сбора данных пользователя
        function collectUserData() {
            const variant = getVariantNumber();
            const price = getPrice(variant, currentSelections.thickness);
            
            return {
                timestamp: new Date().toISOString(),
                variant: variant,
                thickness: currentSelections.thickness === 'thin' ? 'thin' : 'thick',
                shape: getShapeName(currentSelections.shape || 'small-rectangle'),
                color: getColorName(currentSelections.color || 'red'),
                picture: getPictureName(currentSelections.picture || 'empty'),
                price: price
            };
        }

        // Функция для обработки выбора дизайна
        async function selectDesign() {
            try {
                console.log('Начинаем процесс заказа...');
                
                // Собираем данные пользователя
                const userData = collectUserData();
                console.log('Собранные данные:', userData);
                
                // Отправляем данные в Google Таблицу
                const success = await sendDataToGoogleSheets(userData);
                
                if (success) {
                    console.log('Данные успешно отправлены, перенаправляем на страницу благодарности');
                    // Перенаправляем на страницу благодарности
                    window.location.href = 'thank-you.html';
                } else {
                    console.error('Ошибка при отправке данных, но заказ принят');
                    // Все равно перенаправляем на страницу благодарности
                    window.location.href = 'thank-you.html';
                }
            } catch (error) {
                console.error('Ошибка при обработке заказа:', error);
                // В случае ошибки все равно перенаправляем на страницу благодарности
                window.location.href = 'thank-you.html';
            }
        }`;

// Обновляем проекты 3-10 (в 1-2 уже есть функция)
for (let i = 3; i <= 10; i++) {
    const projectPath = `6250-${i}/designer-advanced.html`;
    
    if (fs.existsSync(projectPath)) {
        console.log(`Добавляем функцию selectDesign в 6250-${i}...`);
        
        let content = fs.readFileSync(projectPath, 'utf8');
        
        // Проверяем, есть ли уже функция selectDesign
        if (!content.includes('function selectDesign()')) {
            // Добавляем функцию перед закрывающим тегом script
            content = content.replace(/(\s+)(<\/script>)/, `$1${selectDesignFunction}$1$2`);
            fs.writeFileSync(projectPath, content);
            console.log(`✅ 6250-${i} обновлен с функцией selectDesign`);
        } else {
            console.log(`⚠️ 6250-${i} уже содержит функцию selectDesign`);
        }
    } else {
        console.log(`❌ 6250-${i} не найден`);
    }
}

console.log('Готово!');
