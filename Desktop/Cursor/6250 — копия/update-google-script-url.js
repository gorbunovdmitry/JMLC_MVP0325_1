const fs = require('fs');
const path = require('path');

// Новый URL Google Apps Script
const NEW_GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxenb1I-6wje2xrnrbHsfbYpyxxEJ65zodB2Gqhfek6rcb0A_IAyM-VsbGa08o3tc9M/exec';

// Старый URL для замены
const OLD_GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxeoRBN7KAnDzvn6a6TuzIgYWK0JlOuBfs-PY0MkIqljVnK7RPKndUqNGydGbYzFYjt/exec';

// Обновляем проекты 1-10
for (let i = 1; i <= 10; i++) {
    const projectPath = `6250-${i}/designer-advanced.html`;
    
    if (fs.existsSync(projectPath)) {
        console.log(`Обновляем 6250-${i}...`);
        
        let content = fs.readFileSync(projectPath, 'utf8');
        
        // Заменяем старый URL на новый
        if (content.includes(OLD_GOOGLE_SCRIPT_URL)) {
            content = content.replace(new RegExp(OLD_GOOGLE_SCRIPT_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), NEW_GOOGLE_SCRIPT_URL);
            fs.writeFileSync(projectPath, content);
            console.log(`✅ 6250-${i} обновлен с новым URL`);
        } else {
            console.log(`⚠️ 6250-${i} не содержит старый URL`);
        }
    } else {
        console.log(`❌ 6250-${i} не найден`);
    }
}

// Обновляем тестовые файлы
const testFiles = ['test-jsonp.html', 'test-google-script.html', 'quick-test.html'];

testFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`Обновляем ${file}...`);
        let content = fs.readFileSync(file, 'utf8');
        
        if (content.includes(OLD_GOOGLE_SCRIPT_URL)) {
            content = content.replace(new RegExp(OLD_GOOGLE_SCRIPT_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), NEW_GOOGLE_SCRIPT_URL);
            fs.writeFileSync(file, content);
            console.log(`✅ ${file} обновлен с новым URL`);
        } else {
            console.log(`⚠️ ${file} не содержит старый URL`);
        }
    }
});

console.log('Готово!');
