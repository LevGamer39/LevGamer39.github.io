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
  }
  
  function handlePageClick(e) {
    e.preventDefault();
    const pageId = this.getAttribute('data-page');
    showPage(pageId);
    history.replaceState(null, null, window.location.pathname + window.location.search);
  }
  
  const pageElements = document.querySelectorAll('[data-page]');
  pageElements.forEach(element => {
    element.addEventListener('click', handlePageClick);
  });
  
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(hash + '-page')) {
    showPage(hash);
  } else {
    showPage('home');
  }
  
  history.replaceState(null, null, window.location.pathname + window.location.search);
});
/* #pragma endregion */