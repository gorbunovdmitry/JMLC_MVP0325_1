// Альтернативная версия сбора данных с использованием JSONP для обхода CORS
// Замените YOUR_SCRIPT_URL на URL вашего Google Apps Script

const GOOGLE_SCRIPT_URL = 'YOUR_SCRIPT_URL_HERE';

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
  // Можно определить по URL или другим способом
  const path = window.location.pathname;
  const match = path.match(/6250-(\d+)/);
  return match ? parseInt(match[1]) : 1;
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

// Функция для отправки данных через JSONP (обход CORS)
function sendDataToGoogleSheetsJSONP(data) {
  return new Promise((resolve, reject) => {
    // Создаем уникальное имя функции для JSONP
    const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    
    // Создаем глобальную функцию для обработки ответа
    window[callbackName] = function(response) {
      // Удаляем функцию после использования
      delete window[callbackName];
      document.head.removeChild(script);
      
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
    const params = new URLSearchParams({
      callback: callbackName,
      data: JSON.stringify(data)
    });
    
    script.src = GOOGLE_SCRIPT_URL + '?' + params.toString();
    script.onerror = function() {
      delete window[callbackName];
      document.head.removeChild(script);
      reject(new Error('Ошибка загрузки скрипта'));
    };
    
    document.head.appendChild(script);
  });
}

// Функция для отправки данных через обычный POST (если CORS разрешен)
async function sendDataToGoogleSheets(data) {
  try {
    console.log('Отправляем данные:', data);
    
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    console.log('Ответ сервера:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Результат:', result);
    
    if (result.success) {
      console.log('Данные успешно отправлены в Google Таблицу');
      if (result.spreadsheetUrl) {
        console.log('Ссылка на таблицу:', result.spreadsheetUrl);
      }
      return true;
    } else {
      console.error('Ошибка при отправке данных:', result.error);
      console.error('Сообщение:', result.message);
      return false;
    }
  } catch (error) {
    console.error('Ошибка при отправке данных:', error);
    console.error('Тип ошибки:', error.name);
    console.error('Сообщение ошибки:', error.message);
    return false;
  }
}

// Обновленная функция selectDesign с fallback на JSONP
async function selectDesignWithDataCollection() {
  // Собираем данные пользователя
  const userData = collectUserData();
  console.log('Собранные данные:', userData);
  
  try {
    // Сначала пробуем обычный POST запрос
    const success = await sendDataToGoogleSheets(userData);
    
    if (success) {
      // Перенаправляем на страницу-заглушку
      window.location.href = 'thank-you.html';
    } else {
      throw new Error('POST запрос не удался');
    }
  } catch (error) {
    console.log('POST запрос не удался, пробуем JSONP...');
    
    try {
      // Fallback на JSONP
      await sendDataToGoogleSheetsJSONP(userData);
      // Перенаправляем на страницу-заглушку
      window.location.href = 'thank-you.html';
    } catch (jsonpError) {
      console.error('JSONP тоже не удался:', jsonpError);
      // В случае ошибки все равно перенаправляем, но показываем предупреждение
      alert('Произошла ошибка при сохранении данных, но заказ принят!');
      window.location.href = 'thank-you.html';
    }
  }
}
