// redirect.js - для локальной работы без .html в URL
document.addEventListener('DOMContentLoaded', function() {
    // Функция для загрузки страницы
    function loadPage(url) {
        // Для GitHub Pages оставляем как есть
        // Для локального использования добавляем .html
        if (window.location.hostname === 'localhost' || window.location.protocol === 'file:') {
            if (!url.endsWith('.html') && url !== '/') {
                window.location.href = url + '.html';
                return false;
            }
        }
        return true;
    }

    // Обработка всех ссылок на сайте
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href]')) {
            const href = e.target.getAttribute('href');
            
            // Игнорируем внешние ссылки, якоря и ссылки с протоколом
            if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                return;
            }
            
            // Для локального использования добавляем .html
            if ((window.location.hostname === 'localhost' || window.location.protocol === 'file:') && 
                !href.endsWith('.html') && href !== '/') {
                e.preventDefault();
                window.location.href = href + '.html';
            }
        }
    });
});