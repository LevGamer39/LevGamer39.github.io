/* mobile-menu.js */
/* #pragma region Mobile Menu Logic */
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');
  const body = document.body;
  
  if (mobileMenuBtn && mainNav) {
    let menuClickInProgress = false;
    
    mobileMenuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      
      if (menuClickInProgress) return;
      menuClickInProgress = true;
      
      const isActive = mainNav.classList.contains('active');
      
      if (isActive) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
      
      setTimeout(() => {
        menuClickInProgress = false;
      }, 400);
    });
    
    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();
          
          if (menuClickInProgress) return;
          menuClickInProgress = true;
          
          const pageId = this.getAttribute('data-page');
          
          closeMobileMenuWithDelay(() => {
            if (pageId) {
              const pageElements = document.querySelectorAll(`[data-page="${pageId}"]`);
              if (pageElements.length > 0) {
                setTimeout(() => {
                  pageElements[0].click();
                }, 50);
              }
            }
          });
          
          setTimeout(() => {
            menuClickInProgress = false;
          }, 400);
        }
      });
    });
    
    document.addEventListener('click', function(e) {
      if (mainNav.classList.contains('active') && 
          !mainNav.contains(e.target) && 
          !mobileMenuBtn.contains(e.target) &&
          !menuClickInProgress) {
        closeMobileMenu();
      }
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mainNav.classList.contains('active')) {
        closeMobileMenu();
      }
    });
    
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
        closeMobileMenu();
      }
    });
    
    function openMobileMenu() {
      mainNav.style.display = 'flex';
      body.classList.add('menu-open');
      document.documentElement.style.overflow = 'hidden';
      
      setTimeout(() => {
        mainNav.classList.add('active');
        mobileMenuBtn.classList.add('active');
      }, 10);
    }
    
    function closeMobileMenu() {
      mainNav.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
      body.classList.remove('menu-open');
      document.documentElement.style.overflow = '';
      
      setTimeout(() => {
        if (!mainNav.classList.contains('active')) {
          mainNav.style.display = 'none';
        }
      }, 300);
    }
    
    function closeMobileMenuWithDelay(callback) {
      mainNav.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
      body.classList.remove('menu-open');
      document.documentElement.style.overflow = '';
      
      setTimeout(() => {
        if (!mainNav.classList.contains('active')) {
          mainNav.style.display = 'none';
        }
        if (callback) callback();
      }, 300);
    }
    
    function handleTouchMove(e) {
      if (mainNav.classList.contains('active')) {
        e.preventDefault();
      }
    }
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    function handleFocusIn(e) {
      if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        e.preventDefault();
        mobileMenuBtn.focus();
      }
    }
    
    document.addEventListener('focusin', handleFocusIn);
  }
});
/* #pragma endregion */