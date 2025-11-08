/* spa-router.js */
/* #pragma region SPA Router Logic */
document.addEventListener('DOMContentLoaded', function() {
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav-link');
  
  function showPage(pageId) {
    pages.forEach(page => page.classList.remove('active'));
    
    const activePage = document.getElementById(pageId + '-page');
    if (activePage) {
      activePage.classList.add('active');
    }
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-page') === pageId) {
        link.classList.add('active');
      }
    });
    
    window.scrollTo(0, 0);
    
    if (window.innerWidth <= 768) {
      document.documentElement.style.overflow = '';
      document.body.classList.remove('menu-open');
    }
  }
  
  function handlePageClick(e) {
    if (window.innerWidth <= 768) {
      const nav = document.getElementById('main-nav');
      const menuBtn = document.getElementById('mobile-menu-btn');
      
      if (nav && nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuBtn.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.documentElement.style.overflow = '';
      }
    }
    
    e.preventDefault();
    const pageId = this.getAttribute('data-page');
    showPage(pageId);
  }
  
  function handleLinkClick(e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      const pageId = href.substring(1);
      showPage(pageId);
    }
  }
  
  const pageElements = document.querySelectorAll('[data-page]');
  pageElements.forEach(element => {
    if (element.classList.contains('nav-link')) {
      element.addEventListener('click', handlePageClick);
    }
  });
  
  const contentLinks = document.querySelectorAll('.link[data-page], .note-card .link[href^="#"]');
  contentLinks.forEach(link => {
    link.addEventListener('click', handleLinkClick);
  });
  
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(hash + '-page')) {
    showPage(hash);
  } else {
    showPage('home');
  }
  
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      const nav = document.getElementById('main-nav');
      const menuBtn = document.getElementById('mobile-menu-btn');
      
      if (nav && nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuBtn.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.documentElement.style.overflow = '';
      }
    }
  });
});
/* #pragma endregion */