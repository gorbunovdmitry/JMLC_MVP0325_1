// Google Apps Script для сбора данных о выборе стикеров
// Разместите этот код в Google Apps Script (script.google.com)

function doPost(e) {
  try {
    // Получаем данные из POST запроса
    const data = JSON.parse(e.postData.contents);
    
    // Создаем новую таблицу или используем существующую
    let spreadsheet;
    try {
      // Пытаемся найти существующую таблицу по названию
      const files = DriveApp.getFilesByName('Sticker Orders Data');
      if (files.hasNext()) {
        spreadsheet = SpreadsheetApp.open(files.next());
      } else {
        // Создаем новую таблицу
        spreadsheet = SpreadsheetApp.create('Sticker Orders Data');
      }
    } catch (error) {
      // Если не удалось создать/найти таблицу, создаем временную
      spreadsheet = SpreadsheetApp.create('Sticker Orders Data - ' + new Date().getTime());
    }
    
    const sheet = spreadsheet.getActiveSheet();
    
    // Если это первая запись, добавляем заголовки
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 7).setValues([
        ['Дата и время', 'Номер варианта', 'Толщина', 'Форма', 'Цвет', 'Картинка', 'Цена']
      ]);
    }
    
    // Добавляем новую строку с данными
    const newRow = [
      new Date(data.timestamp),
      data.variant,
      data.thickness,
      data.shape,
      data.color,
      data.picture,
      data.price
    ];
    
    sheet.appendRow(newRow);
    
    // Возвращаем успешный ответ с CORS заголовками
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true, 
        message: 'Данные успешно сохранены',
        spreadsheetUrl: spreadsheet.getUrl()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Возвращаем ошибку с подробной информацией и CORS заголовками
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false, 
        error: error.toString(),
        message: 'Ошибка при сохранении данных'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Для тестирования
  return ContentService
    .createTextOutput('Google Apps Script is working!')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Функция для создания тестовой таблицы
function createTestSpreadsheet() {
  const spreadsheet = SpreadsheetApp.create('Sticker Orders Test - ' + new Date().getTime());
  const sheet = spreadsheet.getActiveSheet();
  
  sheet.getRange(1, 1, 1, 7).setValues([
    ['Дата и время', 'Номер варианта', 'Толщина', 'Форма', 'Цвет', 'Картинка', 'Цена']
  ]);
  
  return spreadsheet.getUrl();
}
