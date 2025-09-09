// Google Apps Script для сбора данных о выборе стикеров (JSONP версия)
// Разместите этот код в Google Apps Script (script.google.com)

function doPost(e) {
  try {
    // Получаем данные из POST запроса
    const data = JSON.parse(e.postData.contents);
    
    // Используем конкретную таблицу по ID
    const SPREADSHEET_ID = '1scE64eswvTxVFjNtIQlXmVY3ndiC5dccglXtofIJOU0';
    let spreadsheet;
    try {
      spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (error) {
      // Если не удалось открыть таблицу, создаем новую
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
    
    // Возвращаем успешный ответ
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true, 
        message: 'Данные успешно сохранены',
        spreadsheetUrl: spreadsheet.getUrl()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Возвращаем ошибку с подробной информацией
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
  // Обработка JSONP запросов
  const callback = e.parameter.callback;
  const dataParam = e.parameter.data;
  
  if (callback && dataParam) {
    // JSONP запрос с данными
    try {
      const data = JSON.parse(dataParam);
      
      // Используем конкретную таблицу по ID
      const SPREADSHEET_ID = '1scE64eswvTxVFjNtIQlXmVY3ndiC5dccglXtofIJOU0';
      let spreadsheet;
      try {
        spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      } catch (error) {
        // Если не удалось открыть таблицу, создаем новую
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
      
      const result = {
        success: true,
        message: 'Данные успешно сохранены',
        spreadsheetUrl: spreadsheet.getUrl(),
        timestamp: new Date().toISOString()
      };
      
      return ContentService
        .createTextOutput(callback + '(' + JSON.stringify(result) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
        
    } catch (error) {
      const result = {
        success: false,
        error: error.toString(),
        message: 'Ошибка при сохранении данных',
        timestamp: new Date().toISOString()
      };
      
      return ContentService
        .createTextOutput(callback + '(' + JSON.stringify(result) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
  } else if (callback) {
    // JSONP запрос без данных (тест)
    const result = {
      success: true,
      message: 'Google Apps Script is working!',
      timestamp: new Date().toISOString()
    };
    
    return ContentService
      .createTextOutput(callback + '(' + JSON.stringify(result) + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    // Обычный GET запрос
    return ContentService
      .createTextOutput('Google Apps Script is working!')
      .setMimeType(ContentService.MimeType.TEXT);
  }
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
