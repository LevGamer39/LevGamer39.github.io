/* mobile-menu.js */
/* #pragma region Mobile Menu Logic */
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');
  const body = document.body;
  
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isActive = mainNav.classList.contains('active');
      
      mainNav.classList.toggle('active');
      this.classList.toggle('active');
      
      if (!isActive) {
        body.classList.add('menu-open');
      } else {
        body.classList.remove('menu-open');
      }
    });
    
    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
    
    document.addEventListener('click', function(e) {
      if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });
    
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });
    
    function closeMobileMenu() {
      mainNav.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
      body.classList.remove('menu-open');
    }
  }
});
/* #pragma endregion */