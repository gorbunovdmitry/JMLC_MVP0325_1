const fs = require('fs');
const path = require('path');

// Добавляем Google Analytics 4 и Яндекс.Метрику на все лендинги

const GA_MEASUREMENT_ID = 'G-VNG605KE2R';
const YANDEX_METRIKA_ID = '96171108';

for (let i = 1; i <= 10; i++) {
    console.log(`Добавляем аналитику в 6250-${i}...`);
    
    // Обрабатываем landing.html
    const landingPath = `6250-${i}/landing.html`;
    if (fs.existsSync(landingPath)) {
        let content = fs.readFileSync(landingPath, 'utf8');
        
        // Добавляем Google Analytics и Яндекс.Метрику в head
        const analyticsHead = `
    <!-- Google Analytics 4 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}');
    </script>
    
    <!-- Yandex Metrika -->
    <script type="text/javascript">
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        ym(${YANDEX_METRIKA_ID}, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true
        });
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>`;
        
        // Добавляем аналитику перед закрывающим тегом head
        content = content.replace(/(\s+)(<\/head>)/, `$1${analyticsHead}$1$2`);
        
        // Добавляем событие просмотра лендинга
        const landingEvent = `
    <script>
        // Отправляем событие просмотра лендинга только при первом рендере
        let landingViewed = false;
        if (!landingViewed) {
            landingViewed = true;
            gtag('event', '6250_page_view_landing_var${i}');
            ym(${YANDEX_METRIKA_ID}, 'reachGoal', '6250_page_view_landing_var${i}');
        }
        
        // Отслеживаем клик на кнопку "Выбрать дизайн"
        document.addEventListener('DOMContentLoaded', function() {
            const chooseDesignBtn = document.querySelector('.cta-button');
            if (chooseDesignBtn) {
                chooseDesignBtn.addEventListener('click', function() {
                    gtag('event', '6250_click_choose_design_var${i}');
                    ym(${YANDEX_METRIKA_ID}, 'reachGoal', '6250_choose_design_var${i}');
                });
            }
        });
    </script>`;
        
        // Добавляем скрипт перед закрывающим тегом body
        content = content.replace(/(\s+)(<\/body>)/, `$1${landingEvent}$1$2`);
        
        fs.writeFileSync(landingPath, content);
        console.log(`✅ 6250-${i}/landing.html: аналитика добавлена`);
    }
    
    // Обрабатываем designer-advanced.html
    const designerPath = `6250-${i}/designer-advanced.html`;
    if (fs.existsSync(designerPath)) {
        let content = fs.readFileSync(designerPath, 'utf8');
        
        // Добавляем Google Analytics и Яндекс.Метрику в head
        const analyticsHead = `
    <!-- Google Analytics 4 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}');
    </script>
    
    <!-- Yandex Metrika -->
    <script type="text/javascript">
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        ym(${YANDEX_METRIKA_ID}, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true
        });
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>`;
        
        // Добавляем аналитику перед закрывающим тегом head
        content = content.replace(/(\s+)(<\/head>)/, `$1${analyticsHead}$1$2`);
        
        // Добавляем события для конструктора
        const designerEvents = `
    <script>
        // Отправляем событие просмотра конструктора только при первом рендере
        let constructorViewed = false;
        if (!constructorViewed) {
            constructorViewed = true;
            gtag('event', '6250_page_view_constructor_var${i}');
            ym(${YANDEX_METRIKA_ID}, 'reachGoal', '6250_page_view_constructor_var${i}');
        }
        
        // Отслеживаем клик на кнопку "Заказать за Х р"
        document.addEventListener('DOMContentLoaded', function() {
            const orderBtn = document.getElementById('orderButton');
            if (orderBtn) {
                orderBtn.addEventListener('click', function() {
                    gtag('event', '6250_click_buy_var${i}');
                    ym(${YANDEX_METRIKA_ID}, 'reachGoal', '6250_click_buy_var${i}');
                });
            }
        });
    </script>`;
        
        // Добавляем скрипт перед закрывающим тегом body
        content = content.replace(/(\s+)(<\/body>)/, `$1${designerEvents}$1$2`);
        
        fs.writeFileSync(designerPath, content);
        console.log(`✅ 6250-${i}/designer-advanced.html: аналитика добавлена`);
    }
    
    // Обрабатываем thank-you.html
    const thankYouPath = `6250-${i}/thank-you.html`;
    if (fs.existsSync(thankYouPath)) {
        let content = fs.readFileSync(thankYouPath, 'utf8');
        
        // Добавляем Google Analytics и Яндекс.Метрику в head
        const analyticsHead = `
    <!-- Google Analytics 4 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}');
    </script>
    
    <!-- Yandex Metrika -->
    <script type="text/javascript">
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        ym(${YANDEX_METRIKA_ID}, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true
        });
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>`;
        
        // Добавляем аналитику перед закрывающим тегом head
        content = content.replace(/(\s+)(<\/head>)/, `$1${analyticsHead}$1$2`);
        
        // Добавляем событие просмотра финальной страницы
        const thankYouEvent = `
    <script>
        // Отправляем событие просмотра финальной страницы только при первом рендере
        let endPageViewed = false;
        if (!endPageViewed) {
            endPageViewed = true;
            gtag('event', '6250_end_page_view_var${i}');
            ym(${YANDEX_METRIKA_ID}, 'reachGoal', '6250_end_page_view_var${i}');
        }
    </script>`;
        
        // Добавляем скрипт перед закрывающим тегом body
        content = content.replace(/(\s+)(<\/body>)/, `$1${thankYouEvent}$1$2`);
        
        fs.writeFileSync(thankYouPath, content);
        console.log(`✅ 6250-${i}/thank-you.html: аналитика добавлена`);
    }
}

console.log('Готово! Google Analytics 4 и Яндекс.Метрика добавлены во все проекты.');
