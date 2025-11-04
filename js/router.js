// js/router.js
document.addEventListener('DOMContentLoaded', function() {
    // Функция переключения страниц
    function showPage(pageId) {
        // Скрыть все страницы
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Показать выбранную страницу
        const targetPage = document.getElementById(`page-${pageId}`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        
        // Обновить активную ссылку в навигации
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
        
        // Обновить URL в браузере
        window.history.pushState({page: pageId}, '', `#${pageId}`);
        
        // Прокрутить вверх
        window.scrollTo(0, 0);
    }
    
    // Обработчик кликов по навигации
    document.addEventListener('click', function(e) {
        if (e.target.matches('.nav-link') || e.target.matches('[data-page]')) {
            e.preventDefault();
            const page = e.target.getAttribute('data-page') || 
                        e.target.getAttribute('href').replace('#', '');
            showPage(page);
        }
    });
    
    // Обработчик изменения хэша в URL
    window.addEventListener('hashchange', function() {
        const page = window.location.hash.replace('#', '') || 'home';
        showPage(page);
    });
    
    // Обработчик кнопок "Назад/Вперед"
    window.addEventListener('popstate', function(event) {
        const page = (event.state && event.state.page) || 'home';
        showPage(page);
    });
    
    // Инициализация - показать страницу из URL или главную
    const initialPage = window.location.hash.replace('#', '') || 'home';
    showPage(initialPage);
});