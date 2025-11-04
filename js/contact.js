// js/contact.js
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = contactForm.elements['name']?.value || '';
      const email = contactForm.elements['email']?.value || '';
      const msg = contactForm.elements['message']?.value || '';
      
      if (!name || !email || !msg) {
        alert('Пожалуйста, заполните все поля');
        return;
      }
      
      // Имитация отправки
      alert(`Спасибо, ${name}! Ваше сообщение отправлено. (Это демо - сообщение никуда не отправляется)`);
      contactForm.reset();
    });
  }
});