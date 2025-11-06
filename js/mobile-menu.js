// js/mobile-menu.js
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');
  const body = document.body;
  
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isActive = mainNav.classList.contains('active');
      
      // Переключаем меню
      mainNav.classList.toggle('active');
      this.classList.toggle('active');
      
      // Блокируем скролл тела когда меню открыто
      if (!isActive) {
        body.classList.add('menu-open');
      } else {
        body.classList.remove('menu-open');
      }
    });
    
    // Закрытие меню при клике на ссылку
    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
    
    // Закрытие меню при клике вне его области
    document.addEventListener('click', function(e) {
      if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });
    
    // Закрытие меню при изменении размера окна
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    });
    
    // Закрытие меню при нажатии Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });
    
    // Функция закрытия мобильного меню
    function closeMobileMenu() {
      mainNav.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
      body.classList.remove('menu-open');
    }
  }
});