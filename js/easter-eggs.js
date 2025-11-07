// js/easter-eggs.js
document.addEventListener('DOMContentLoaded', function() {
  // Konami Code
  let konamiCode = [];
  const konamiSequence = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  
  document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key.toLowerCase());
    
    if (konamiCode.length > konamiSequence.length) {
      konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
      activateKonamiEffect();
      konamiCode = [];
    }
  });

  function activateKonamiEffect() {
    console.log('🎉 Konami Code активирован!');
    
    // Создаем эффект конфетти
    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10000;
    `;
    document.body.appendChild(confettiContainer);
    
    // Создаем частицы конфетти
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: absolute;
        width: 8px;
        height: 8px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        top: -20px;
        left: ${Math.random() * 100}%;
        animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
        border-radius: 50%;
      `;
      confettiContainer.appendChild(confetti);
    }
    
    // Добавляем анимацию
    const style = document.createElement('style');
    style.textContent = `
      @keyframes confetti-fall {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Показываем сообщение
    const message = document.createElement('div');
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: #fff;
      padding: 20px 40px;
      border-radius: 10px;
      font-size: 24px;
      font-weight: bold;
      z-index: 10001;
      border: 2px solid #4DA3FF;
      font-family: "Styrene A Web", sans-serif;
    `;
    message.textContent = '🎉 Konami Code активирован!';
    document.body.appendChild(message);
    
    // Убираем эффекты через 5 секунд
    setTimeout(() => {
      if (confettiContainer.parentNode) {
        document.body.removeChild(confettiContainer);
      }
      if (message.parentNode) {
        document.body.removeChild(message);
      }
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    }, 5000);
  }

  // Секретный клик по логотипу
  const logo = document.querySelector('.brand-logo');
  if (logo) {
    let clickCount = 0;
    let lastClickTime = 0;
    
    logo.addEventListener('click', function() {
      const currentTime = new Date().getTime();
      
      if (currentTime - lastClickTime > 1000) {
        clickCount = 0;
      }
      
      clickCount++;
      lastClickTime = currentTime;
      
      if (clickCount === 5) {
        activateLogoSecret();
        clickCount = 0;
      }
    });
  }

  function activateLogoSecret() {
    console.log('🔍 Секретный клик по логотипу активирован!');
    
    // Создаем плавающие сердца
    const heartsContainer = document.createElement('div');
    heartsContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(heartsContainer);
    
    for (let i = 0; i < 20; i++) {
      const heart = document.createElement('div');
      heart.textContent = '💙';
      heart.style.cssText = `
        position: absolute;
        font-size: ${Math.random() * 20 + 15}px;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: heart-float ${Math.random() * 3 + 2}s ease-in-out forwards;
        pointer-events: none;
      `;
      heartsContainer.appendChild(heart);
    }
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes heart-float {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(-100px) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
      if (heartsContainer.parentNode) {
        document.body.removeChild(heartsContainer);
      }
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    }, 3000);
  }

  // Секретный клик по аватару
  const avatar = document.querySelector('.user-avatar');
  if (avatar) {
    avatar.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      activateAvatarSecret();
    });
  }

  function activateAvatarSecret() {
    console.log('👤 Секретный клик по аватару активирован!');
    
    const avatar = document.querySelector('.user-avatar');
    if (!avatar) return;
    
    // Анимация подмигивания
    const originalBorder = avatar.style.border;
    const originalBoxShadow = avatar.style.boxShadow;
    
    avatar.style.border = '2px solid #ff00ff';
    avatar.style.boxShadow = '0 0 20px #ff00ff';
    
    setTimeout(() => {
      avatar.style.border = originalBorder;
      avatar.style.boxShadow = originalBoxShadow;
    }, 1000);
    
    // Создаем notification внизу экрана (гарантированно видно)
    const notification = document.createElement('div');
    notification.textContent = '👋 Привет! Секретный клик по аватару активирован!';
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 0, 255, 0.9);
      color: white;
      padding: 12px 20px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: bold;
      z-index: 10001;
      font-family: "Styrene A Web", sans-serif;
      animation: notification-fade 3s ease-in-out forwards;
      pointer-events: none;
      text-align: center;
      max-width: 90%;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
      @keyframes notification-fade {
        0% { 
          opacity: 0; 
          transform: translateX(-50%) translateY(20px); 
        }
        20% { 
          opacity: 1; 
          transform: translateX(-50%) translateY(0); 
        }
        80% { 
          opacity: 1; 
          transform: translateX(-50%) translateY(0); 
        }
        100% { 
          opacity: 0; 
          transform: translateX(-50%) translateY(-20px); 
        }
      }
    `;
    document.head.appendChild(notificationStyle);
    
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
      if (notificationStyle.parentNode) {
        document.head.removeChild(notificationStyle);
      }
    }, 3000);
  }

  // Секретное сообщение в консоли браузера
  console.log(`%c
   🔍 Добро пожаловать в консоль!
   
   Исходный код: https://github.com/LevGamer39/LevGamer39.github.io
   
   Нашел пасхалки?
   - Konami Code: ↑↑↓↓←→←→BA
   - 5 кликов по логотипу
   - Клик по аватару
   - Команды в терминале: matrix, sudo, hack, secret
   
   Удачи в исследовании! 🚀
  `, 'color: #4DA3FF; font-family: "JetBrains Mono", monospace; font-size: 14px;');
});