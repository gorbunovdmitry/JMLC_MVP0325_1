# Настройка сбора данных через Google Forms (решение проблемы CORS)

## Проблема
Google Apps Script блокирует CORS запросы с GitHub Pages. Это стандартная политика безопасности браузеров.

## Решение: Google Forms
Используем Google Forms для сбора данных - это обходит проблему CORS и проще в настройке.

## Пошаговая инструкция

### Шаг 1: Создайте Google Form

1. Перейдите на [Google Forms](https://forms.google.com)
2. Создайте новую форму
3. Назовите форму "Sticker Orders Data"
4. Добавьте поля в следующем порядке:

| Поле | Тип | Название |
|------|-----|----------|
| 1 | Короткий ответ | Дата и время |
| 2 | Короткий ответ | Номер варианта |
| 3 | Короткий ответ | Толщина |
| 4 | Короткий ответ | Форма |
| 5 | Короткий ответ | Цвет |
| 6 | Короткий ответ | Картинка |
| 7 | Короткий ответ | Цена |

### Шаг 2: Получите URL формы

1. Нажмите "Отправить" в правом верхнем углу
2. Скопируйте ссылку на форму
3. Замените `viewform` на `formResponse` в URL

**Пример:**
```
https://docs.google.com/forms/d/FORM_ID/viewform
↓
https://docs.google.com/forms/d/FORM_ID/formResponse
```

### Шаг 3: Получите ID полей формы

1. Откройте форму в режиме редактирования
2. Нажмите F12 (Developer Tools)
3. Найдите элементы `<input>` с атрибутом `name="entry.XXXXXXX"`
4. Скопируйте эти ID

**Пример:**
```html
<input type="text" name="entry.1234567890" ...> <!-- Дата и время -->
<input type="text" name="entry.1234567891" ...> <!-- Номер варианта -->
<input type="text" name="entry.1234567892" ...> <!-- Толщина -->
<input type="text" name="entry.1234567893" ...> <!-- Форма -->
<input type="text" name="entry.1234567894" ...> <!-- Цвет -->
<input type="text" name="entry.1234567895" ...> <!-- Картинка -->
<input type="text" name="entry.1234567896" ...> <!-- Цена -->
```

### Шаг 4: Обновите код в проектах

1. В каждом проекте найдите функцию `sendDataToGoogleSheets`
2. Замените `YOUR_GOOGLE_FORM_URL_HERE` на URL вашей формы
3. Замените `entry.1234567890` на реальные ID полей

**Пример обновленного кода:**
```javascript
async function sendDataToGoogleSheets(data) {
  try {
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/YOUR_FORM_ID/formResponse';
    
    console.log('Отправляем данные:', data);
    
    const formData = new FormData();
    formData.append('entry.1234567890', data.timestamp); // Дата и время
    formData.append('entry.1234567891', data.variant);   // Номер варианта
    formData.append('entry.1234567892', data.thickness); // Толщина
    formData.append('entry.1234567893', data.shape);     // Форма
    formData.append('entry.1234567894', data.color);     // Цвет
    formData.append('entry.1234567895', data.picture);   // Картинка
    formData.append('entry.1234567896', data.price);     // Цена
    
    const response = await fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors' // Обходит CORS
    });
    
    console.log('Данные отправлены в Google Form');
    return true;
  } catch (error) {
    console.error('Ошибка при отправке данных:', error);
    return false;
  }
}
```

### Шаг 5: Тестирование

1. Откройте любой из ваших проектов
2. Выберите параметры стикера
3. Нажмите "Заказать за..."
4. Проверьте, что данные появились в Google Form

## Преимущества Google Forms

✅ **Нет проблем с CORS** - работает с любого домена
✅ **Простая настройка** - не нужен Google Apps Script
✅ **Автоматическое создание таблицы** - данные сохраняются в Google Sheets
✅ **Надежность** - Google Forms стабильно работает
✅ **Бесплатно** - не требует дополнительных разрешений

## Структура данных в Google Sheets

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| **Дата и время** | **Номер варианта** | **Толщина** | **Форма** | **Цвет** | **Картинка** | **Цена** |
| 2024-01-15T10:30:00.000Z | 1 | thick | Прямоугольник | Красный | Пустой | 199 |

## Устранение неполадок

1. **Данные не сохраняются**: Проверьте URL формы и ID полей
2. **Неправильные данные**: Убедитесь, что ID полей соответствуют порядку в форме
3. **Ошибка 404**: Проверьте, что URL содержит `formResponse` вместо `viewform`
