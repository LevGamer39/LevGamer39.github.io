/* easter-eggs.js */
/* #pragma region Easter Eggs Logic */
document.addEventListener('DOMContentLoaded', function() {
  let konamiCode = [];
  const konamiSequence = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  
  document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key.toLowerCase());
    
    if (konamiCode.length > konamiSequence.length) {
      konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
      activateRetroWaveEffect();
      konamiCode = [];
    }
  });

  function activateRetroWaveEffect() {
    console.log('🌈 Retro Wave эффект активирован!');
    
    const effectContainer = document.createElement('div');
    effectContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10000;
      overflow: hidden;
      font-family: 'Courier New', monospace;
    `;
    document.body.appendChild(effectContainer);

    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    `;
    effectContainer.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');

    const waves = [];
    const waveCount = 8;
    
    for (let i = 0; i < waveCount; i++) {
      waves.push({
        amplitude: 50 + Math.random() * 100,
        frequency: 0.005 + Math.random() * 0.01,
        speed: 1 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        color: `hsl(${i * 45}, 100%, 60%)`,
        width: 3,
        y: (i + 1) * (canvas.height / (waveCount + 1))
      });
    }

    const particles = [];
    const particleCount = 200;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 0.5,
        color: `hsl(${Math.random() * 360}, 100%, 60%)`,
        waveOffset: Math.random() * Math.PI * 2
      });
    }

    const shapes = [];
    const shapeCount = 15;
    
    for (let i = 0; i < shapeCount; i++) {
      shapes.push({
        type: Math.floor(Math.random() * 3),
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 20 + Math.random() * 40,
        speedX: (Math.random() - 0.5) * 4,
        speedY: (Math.random() - 0.5) * 4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        color: `hsl(${Math.random() * 360}, 100%, 60%)`,
        alpha: 0.3 + Math.random() * 0.4
      });
    }

    let startTime = Date.now();
    let animationId;

    function animate() {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      waves.forEach((wave, index) => {
        ctx.beginPath();
        ctx.moveTo(0, wave.y);
        
        for (let x = 0; x < canvas.width; x += 2) {
          const y = wave.y + Math.sin(x * wave.frequency + wave.phase + elapsed * 0.001 * wave.speed) * wave.amplitude;
          ctx.lineTo(x, y);
        }
        
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = wave.width;
        ctx.stroke();
        
        for (let x = 0; x < canvas.width; x += 50) {
          const y = wave.y + Math.sin(x * wave.frequency + wave.phase + elapsed * 0.001 * wave.speed) * wave.amplitude;
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
          gradient.addColorStop(0, wave.color);
          gradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, 20, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      particles.forEach(particle => {
        particle.x += particle.speed;
        particle.y += Math.sin(particle.x * 0.01 + particle.waveOffset + elapsed * 0.001) * 2;
        
        if (particle.x > canvas.width) {
          particle.x = 0;
          particle.y = Math.random() * canvas.height;
        }
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;
        
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        const glow = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        glow.addColorStop(0, particle.color);
        glow.addColorStop(1, 'transparent');
        
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      shapes.forEach(shape => {
        shape.x += shape.speedX;
        shape.y += shape.speedY;
        shape.rotation += shape.rotationSpeed;
        
        if (shape.x < 0 || shape.x > canvas.width) shape.speedX *= -1;
        if (shape.y < 0 || shape.y > canvas.height) shape.speedY *= -1;
        
        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rotation);
        ctx.globalAlpha = shape.alpha;
        ctx.fillStyle = shape.color;
        
        switch (shape.type) {
          case 0:
            ctx.beginPath();
            ctx.moveTo(0, -shape.size / 2);
            ctx.lineTo(shape.size / 2, shape.size / 2);
            ctx.lineTo(-shape.size / 2, shape.size / 2);
            ctx.closePath();
            ctx.fill();
            break;
          case 1:
            ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
            break;
          case 2:
            ctx.beginPath();
            ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
        }
        
        ctx.restore();
      });

      ctx.save();
      ctx.globalAlpha = Math.sin(elapsed * 0.002) * 0.5 + 0.5;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Courier New';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('RETRO WAVE', canvas.width / 2, canvas.height / 2);
      
      ctx.font = '20px Courier New';
      ctx.fillText('KONAMI CODE ACTIVATED', canvas.width / 2, canvas.height / 2 + 50);
      
      ctx.font = '18px Courier New';
      ctx.fillStyle = '#0f0';
      ctx.fillText('Press any key to close', canvas.width / 2, canvas.height / 2 + 100);
      ctx.restore();

      animationId = requestAnimationFrame(animate);
    }

    function closeEffect() {
      cancelAnimationFrame(animationId);
      
      effectContainer.style.opacity = '1';
      let opacity = 1;
      const fadeOut = setInterval(() => {
        opacity -= 0.05;
        effectContainer.style.opacity = opacity;
        if (opacity <= 0) {
          clearInterval(fadeOut);
          if (effectContainer.parentNode) {
            document.body.removeChild(effectContainer);
          }
          document.removeEventListener('keydown', handleAnyKeyClose);
          document.removeEventListener('click', handleAnyKeyClose);
        }
      }, 16);
    }

    function handleAnyKeyClose() {
      closeEffect();
    }
    
    document.addEventListener('keydown', handleAnyKeyClose);
    document.addEventListener('click', handleAnyKeyClose);

    animate();

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 1);
    } catch (e) {
      console.log('Аудио не поддерживается');
    }

    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
  }
/* #pragma endregion */

/* #pragma region Logo Secret */
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
      heart.textContent = '💻';
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
/* #pragma endregion */

/* #pragma region Avatar Secret */
  const avatar = document.querySelector('.user-avatar');
  if (avatar) {
    avatar.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      activateAvatarSecret();
    });
  }

  function activateAvatarSecret() {
    console.log('👤 Клик по аватару активирован!');
    
    const avatar = document.querySelector('.user-avatar');
    if (!avatar) return;
    
    const originalBorder = avatar.style.border;
    const originalBoxShadow = avatar.style.boxShadow;
    
    avatar.style.border = '2px solid #ff00ff';
    avatar.style.boxShadow = '0 0 20px #ff00ff';
    
    setTimeout(() => {
      avatar.style.border = originalBorder;
      avatar.style.boxShadow = originalBoxShadow;
    }, 1000);
    
    const notification = document.createElement('div');
    notification.textContent = '👋 Привет! Клик по аватару активирован!';
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
/* #pragma endregion */

/* #pragma region Console Message */
  console.log(`%c
   🔍 Добро пожаловать в консоль!
   
   Исходный код: https://github.com/LevGamer39/LevGamer39.github.io
   
   Нашел пасхалки?
   - Konami Code: ↑↑↓↓←→←→BA (Retro Wave эффект)
   - 5 кликов по логотипу
   - Клик по аватару
   - Команды в терминале: matrix, sudo, hack, secret
   
   Удачи в исследовании! 🚀
  `, 'color: #4DA3FF; font-family: "JetBrains Mono", monospace; font-size: 14px;');
});
/* #pragma endregion */