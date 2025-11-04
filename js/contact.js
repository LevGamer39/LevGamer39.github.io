// js/contact.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.elements['name']?.value || '';
    const email = form.elements['email']?.value || '';
    const msg = form.elements['message']?.value || '';

    // Пока просто показываем локальную подсказку / имитацию отправки
    // Здесь можно собрать payload и отправить на почтовый сервис (future)
    alert('Спасибо! Ваше сообщение сохранено локально. (Заглушка отправки)');
    form.reset();
  });
});
