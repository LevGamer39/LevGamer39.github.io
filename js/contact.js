// js/contact.js
document.addEventListener('DOMContentLoaded', () => {
  // Обработчик будет работать когда страница контактов активна
  document.addEventListener('click', (e) => {
    if (e.target.matches('#contact-form .btn[type="submit"]')) {
      e.preventDefault();
      const form = document.getElementById('contact-form');
      if (!form) return;
      
      const name = form.elements['name']?.value || '';
      const email = form.elements['email']?.value || '';
      const msg = form.elements['message']?.value || '';
      
      alert('Спасибо! Ваше сообщение сохранено локально. (Заглушка отправки)');
      form.reset();
    }
  });
});