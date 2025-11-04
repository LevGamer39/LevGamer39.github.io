// SPA Router
document.addEventListener('DOMContentLoaded', function() {
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav-link');
  const btnLinks = document.querySelectorAll('.btn[data-page]');
  
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
  
  // Обработчик клика по навигационным ссылкам
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const pageId = this.getAttribute('data-page');
      showPage(pageId);
      history.replaceState(null, null, ' ');
    });
  });
  
  // Обработчик для кнопок с data-page
  btnLinks.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const pageId = this.getAttribute('data-page');
      showPage(pageId);
      history.replaceState(null, null, ' ');
    });
  });
  
  // Инициализация - всегда показываем главную
  showPage('home');
});