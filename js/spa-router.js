// SPA Router
document.addEventListener('DOMContentLoaded', function() {
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav-link');
  
  function showPage(pageId) {
    // Скрыть все страницы
    pages.forEach(page => page.classList.remove('active'));
    
    // Показать выбранную страницу
    const activePage = document.getElementById(pageId + '-page');
    if (activePage) {
      activePage.classList.add('active');
    }
    
    // Обновить активную ссылку в навигации
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-page') === pageId) {
        link.classList.add('active');
      }
    });
    
    // Прокрутка к верху страницы
    window.scrollTo(0, 0);
  }
  
  // Обработчик для ВСЕХ элементов с data-page
  function handlePageClick(e) {
    e.preventDefault();
    const pageId = this.getAttribute('data-page');
    showPage(pageId);
    // Очищаем URL
    history.replaceState(null, null, window.location.pathname + window.location.search);
  }
  
  // Находим все элементы с data-page (ссылки, кнопки и т.д.)
  const pageElements = document.querySelectorAll('[data-page]');
  pageElements.forEach(element => {
    element.addEventListener('click', handlePageClick);
  });
  
  // Инициализация - показываем страницу на основе хэша или главную
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(hash + '-page')) {
    showPage(hash);
  } else {
    showPage('home');
  }
  
  // Очищаем URL при загрузке
  history.replaceState(null, null, window.location.pathname + window.location.search);
});