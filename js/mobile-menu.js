// js/mobile-menu.js
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');
  
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      mainNav.classList.toggle('active');
      this.classList.toggle('active');
    });
    
    // Закрытие меню при клике на ссылку
    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      });
    });
    
    // Закрытие меню при клике вне его области
    document.addEventListener('click', function(e) {
      if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mainNav.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      }
    });
    
    // Закрытие меню при изменении размера окна (на десктоп)
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        mainNav.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      }
    });
  }
});