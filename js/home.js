// home.js - page-specific behavior
console.log('Home page loaded');

// Функция для фокуса на терминале при переходе на домашнюю страницу
function focusTerminal() {
  const terminalInput = document.getElementById('terminal-input');
  if (terminalInput && document.getElementById('home-page').classList.contains('active')) {
    setTimeout(() => {
      terminalInput.focus();
    }, 100);
  }
}

// Слушаем изменения страниц
document.addEventListener('DOMContentLoaded', function() {
  // Наблюдатель за изменениями в DOM для отслеживания смены страниц
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        if (mutation.target.id === 'home-page' && mutation.target.classList.contains('active')) {
          focusTerminal();
        }
      }
    });
  });
  
  // Начинаем наблюдение за домашней страницей
  const homePage = document.getElementById('home-page');
  if (homePage) {
    observer.observe(homePage, { attributes: true });
  }
  
  // Первоначальный фокус если мы на домашней странице
  if (homePage && homePage.classList.contains('active')) {
    focusTerminal();
  }
});