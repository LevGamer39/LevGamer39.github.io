// js/router.js
document.addEventListener('DOMContentLoaded', function() {
    // Функция переключения страниц
    function showPage(pageId) {
        // Если pageId пустой или #, показываем главную
        if (!pageId || pageId === '#') pageId = 'home';
        
        // Убираем # из ID
        pageId = pageId.replace('#', '');
        
        // Скрыть все страницы
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Показать выбранную страницу
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            
            // Прокрутить к верху страницы
            window.scrollTo(0, 0);
            
            // Обновить историю браузера
            window.history.pushState({page: pageId}, '', `#${pageId}`);
        }
        
        // Обновить активную ссылку в навигации
        updateActiveNavLink(pageId);
    }
    
    // Обновление активной ссылки в навигации
    function updateActiveNavLink(activePage) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href').replace('#', '');
            if (linkHref === activePage) {
                link.classList.add('active');
            }
        });
    }
    
    // Обработчик кликов по навигации
    document.addEventListener('click', function(e) {
        // Обработка ссылок навигации
        if (e.target.matches('.nav-link')) {
            e.preventDefault();
            const targetPage = e.target.getAttribute('href');
            showPage(targetPage);
        }
        
        // Обработка кнопок с href
        if (e.target.matches('.btn[href^="#"]')) {
            e.preventDefault();
            const targetPage = e.target.getAttribute('href');
            showPage(targetPage);
        }
    });
    
    // Обработчик изменения хэша в URL
    window.addEventListener('hashchange', function() {
        const page = window.location.hash;
        showPage(page);
    });
    
    // Обработчик кнопок "Назад/Вперед"
    window.addEventListener('popstate', function(event) {
        const page = (event.state && event.state.page) || window.location.hash || 'home';
        showPage(page);
    });
    
    // Инициализация при загрузке
    function init() {
        const initialPage = window.location.hash || '#home';
        showPage(initialPage);
        
        // Добавляем класс для плавного появления после загрузки
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
    }
    
    init();
});