// Функция для получения названия формы по значению
function getShapeName(shapeValue) {
    const shapeNames = {
        'rectangle': 'Прямоугольник',
        'square': 'Квадрат', 
        'circle': 'Круг',
        'small-rectangle': 'Маленький прямоугольник',
        'cutout': 'С вырезом',
        'dzen': 'Дзынь стикер',
        'potato': 'Картошка'
    };
    return shapeNames[shapeValue] || shapeValue;
}

// Функция для получения названия цвета по значению
function getColorName(colorValue) {
    const colorNames = {
        'red': 'Красный',
        'green': 'Зеленый',
        'gradient': 'Градиент',
        'white': 'Белый',
        'black': 'Черный'
    };
    return colorNames[colorValue] || colorValue;
}

// Функция для получения названия картинки по значению
function getPictureName(pictureValue) {
    const pictureNames = {
        'empty': 'Пустой',
        'cat': 'Кот',
        'slider-smile': 'Слайдер-смайл',
        'robot-cat': 'Робокот',
        'heart-smile': 'Смайл с сердцами',
        'custom': 'Свой вариант',
        'gingerbread': 'Пряничный человек',
        'donut': 'Пончик',
        'tape': 'Лента'
    };
    return pictureNames[pictureValue] || pictureValue;
}

// Функция для получения цены в зависимости от варианта и толщины
function getPrice(variant, thickness) {
    const prices = {
        1: 199,
        2: 299,
        3: 499,
        4: 199,
        5: 299,
        6: 499,
        7: 199,
        8: 299,
        9: 499,
        10: thickness === 'thin' ? 990 : 690
    };
    return prices[variant] || 0;
}

// Функция для получения номера варианта
function getVariantNumber() {
    return VARIANT_NUMBER_PLACEHOLDER;
}

// Функция для сбора всех данных пользователя
function collectUserData() {
    const variant = getVariantNumber();
    
    const data = {
        timestamp: new Date().toISOString(),
        variant: variant,
        thickness: currentSelections.thickness || 'thick',
        shape: getShapeName(currentSelections.shape || 'rectangle'),
        color: getColorName(currentSelections.color || 'red'),
        picture: getPictureName(currentSelections.picture || 'empty'),
        price: getPrice(variant, currentSelections.thickness || 'thick')
    };
    
    return data;
}

// Функция для отправки данных в Google Таблицу
async function sendDataToGoogleSheets(data) {
    try {
        // Замените на ваш URL Google Apps Script
        const GOOGLE_SCRIPT_URL = 'YOUR_SCRIPT_URL_HERE';
        
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('Данные успешно отправлены в Google Таблицу');
            return true;
        } else {
            console.error('Ошибка при отправке данных:', result.error);
            return false;
        }
    } catch (error) {
        console.error('Ошибка при отправке данных:', error);
        return false;
    }
}

async function selectDesign() {
    // Собираем данные пользователя
    const userData = collectUserData();
    console.log('Собранные данные:', userData);
    
    // Отправляем данные в Google Таблицу
    const success = await sendDataToGoogleSheets(userData);
    
    if (success) {
        // Перенаправляем на страницу-заглушку
        window.location.href = 'thank-you.html';
    } else {
        // В случае ошибки все равно перенаправляем, но показываем предупреждение
        alert('Произошла ошибка при сохранении данных, но заказ принят!');
        window.location.href = 'thank-you.html';
    }
}
