// Google Apps Script для сбора данных о выборе стикеров
// Разместите этот код в Google Apps Script (script.google.com)

function doPost(e) {
  try {
    // Получаем данные из POST запроса
    const data = JSON.parse(e.postData.contents);
    
    // ID вашей Google Таблицы (замените на ваш)
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
    
    // Открываем таблицу
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
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
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Возвращаем ошибку
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Для тестирования
  return ContentService
    .createTextOutput('Google Apps Script is working!')
    .setMimeType(ContentService.MimeType.TEXT);
}
