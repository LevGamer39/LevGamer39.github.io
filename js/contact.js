// contact.js - защищенная версия с Telegram ботом и валидацией
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contact-form');
  const messageField = document.getElementById('c-msg');
  const charCounter = document.querySelector('.char-counter');
  const statusMessage = document.createElement('div');
  const phoneField = document.getElementById('c-phone');
  
  // Конфигурация (ЗАМЕНИТЕ на ваши реальные значения)
  const CONFIG = {
    // PythonAnywhere бот URL (замените yourusername на ваш)
    pythonAnywhereBot: 'https://yourusername.pythonanywhere.com/api/send-message',
    
    // Публичный API токен (можно менять)
    apiToken: 'levgamer39-public-token-2024',
    
    // Резервный email
    fallbackEmail: 'mailto:your-email@example.com',
    
    // Настройки защиты
    maxMessageLength: 1000,
    minMessageLength: 10,
    rateLimitDelay: 2000 // 2 секунды между запросами
  };

  // Защита от частых отправок
  let lastSubmissionTime = 0;
  let isSubmitting = false;

  if (!form) return;

  // Инициализация UI
  statusMessage.className = 'status-message';
  form.parentNode.insertBefore(statusMessage, form.nextSibling);

  // Инициализация маски телефона
  initPhoneMask();

  // Инициализация счетчика символов
  initAutoResizeTextarea(); 
  // Валидация в реальном времени
  initRealTimeValidation();

  // Основной обработчик отправки формы
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (isSubmitting) {
      showStatus('Пожалуйста, подождите...', 'warning');
      return;
    }

    // Защита от частых отправок
    const now = Date.now();
    if (now - lastSubmissionTime < CONFIG.rateLimitDelay) {
      showStatus('Слишком частые запросы. Подождите немного.', 'warning');
      return;
    }

    hideStatus();
    clearAllErrors();
    
    if (!validateForm()) {
      showStatus('Пожалуйста, исправьте ошибки в форме', 'error');
      return;
    }

    // Проверка honeypot поля
    if (document.querySelector('input[name="bot-field"]').value) {
      console.log('Bot detected');
      showStatus('Ошибка безопасности', 'error');
      return;
    }

    await submitForm();
  });

  // Кнопка очистки формы
  const clearBtn = document.getElementById('clear-form');
  if (clearBtn) {
    clearBtn.addEventListener('click', function(e) {
      e.preventDefault();
      clearForm();
    });
  }

  // ==================== ОСНОВНЫЕ ФУНКЦИИ ====================

  async function submitForm() {
    isSubmitting = true;
    lastSubmissionTime = Date.now();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalContent = submitBtn.innerHTML;
    
    // Показываем индикатор загрузки
    submitBtn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">Отправка...</span>';
    submitBtn.disabled = true;

    try {
      // Пытаемся отправить через Telegram бота
      await sendViaTelegramBot();
      
      showStatus('✅ Сообщение успешно отправлено! Я свяжусь с вами в ближайшее время.', 'success');
      clearForm();
      
    } catch (error) {
      console.error('Ошибка отправки:', error);
      
      if (error.includes('Rate limit') || error.includes('429')) {
        showStatus('❌ Слишком много запросов. Пожалуйста, попробуйте позже.', 'error');
      } else if (error.includes('Network') || error.includes('Failed to fetch')) {
        showStatus('❌ Проблемы с сетью. Проверьте подключение к интернету.', 'error');
      } else {
        // Показываем резервный вариант
        showFallbackOption();
      }
    } finally {
      // Восстанавливаем кнопку
      submitBtn.innerHTML = originalContent;
      submitBtn.disabled = false;
      isSubmitting = false;
    }
  }

  async function sendViaTelegramBot() {
    const formData = getFormData();
    
    const payload = {
      ...formData,
      timestamp: Date.now(),
      source: 'levgamer39-website'
    };

    const response = await fetch(CONFIG.pythonAnywhereBot, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.apiToken}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Unknown error from bot');
    }
  }

  function showFallbackOption() {
    const formData = getFormData();
    const emailBody = formatEmailBody(formData);
    const emailSubject = `Сообщение с сайта LevGamer39: ${formData.subject}`;
    
    createFallbackModal(emailSubject, emailBody);
    showStatus('❌ Автоматическая отправка недоступна. Используйте альтернативный способ ниже.', 'error');
  }

  // ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

  function initPhoneMask() {
    if (!phoneField) return;

    phoneField.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length > 0) {
        // Убираем код страны если он есть
        if (value[0] === '7' || value[0] === '8') {
          value = value.substring(1);
        }
        
        let formattedValue = '+7 ';
        
        if (value.length > 0) {
          formattedValue += '(' + value.substring(0, 3);
        }
        if (value.length >= 4) {
          formattedValue += ') ' + value.substring(3, 6);
        }
        if (value.length >= 7) {
          formattedValue += '-' + value.substring(6, 8);
        }
        if (value.length >= 9) {
          formattedValue += '-' + value.substring(8, 10);
        }
        
        e.target.value = formattedValue;
      }
    });

    // Валидация формата при потере фокуса
    phoneField.addEventListener('blur', function() {
      if (this.value && !this.value.match(/\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}/)) {
        showError(this, 'Неверный формат телефона');
      }
    });
  }

  function initCharCounter() {
    if (!messageField || !charCounter) return;

    messageField.addEventListener('input', function() {
      const currentLength = this.value.length;
      charCounter.textContent = `${currentLength}/${CONFIG.maxMessageLength} символов`;
      
      charCounter.classList.remove('warning', 'error');
      if (currentLength > CONFIG.maxMessageLength * 0.8) {
        charCounter.classList.add('warning');
      }
      if (currentLength > CONFIG.maxMessageLength) {
        charCounter.classList.add('error');
      }
    });
  }

  function initRealTimeValidation() {
    // Валидация email в реальном времени
    const emailField = document.getElementById('c-email');
    emailField.addEventListener('blur', function() {
      if (this.value && !isValidEmail(this.value)) {
        showError(this, 'Введите корректный email адрес');
      } else {
        clearError(this);
      }
    });

    // Валидация имен (только буквы)
    const nameFields = ['c-lastname', 'c-firstname', 'c-middlename'];
    nameFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener('input', function() {
          // Сохраняем позицию курсора
          const cursorPosition = this.selectionStart;
          
          this.value = this.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s\-]/g, '');
          
          // Восстанавливаем позицию курсора
          this.setSelectionRange(cursorPosition, cursorPosition);
        });

        field.addEventListener('blur', function() {
          if (this.value && !this.value.match(/^[A-Za-zА-Яа-яЁё\s\-]+$/)) {
            showError(this, 'Можно использовать только буквы, пробелы и дефисы');
          }
        });
      }
    });
  }

  function validateForm() {
    let isValid = true;
    clearAllErrors();

    // Проверка обязательных полей
    const requiredFields = [
      { id: 'c-lastname', name: 'Фамилия' },
      { id: 'c-firstname', name: 'Имя' },
      { id: 'c-email', name: 'Email' },
      { id: 'c-subject', name: 'Тема сообщения' },
      { id: 'c-msg', name: 'Сообщение' }
    ];

    requiredFields.forEach(field => {
      const element = document.getElementById(field.id);
      if (!element.value.trim()) {
        showError(element, `Поле "${field.name}" обязательно для заполнения`);
        isValid = false;
      }
    });

    // Валидация email
    const emailField = document.getElementById('c-email');
    if (emailField.value && !isValidEmail(emailField.value)) {
      showError(emailField, 'Введите корректный email адрес');
      isValid = false;
    }

    // Валидация длины сообщения
    if (messageField.value.length < CONFIG.minMessageLength) {
      showError(messageField, `Сообщение должно содержать минимум ${CONFIG.minMessageLength} символов`);
      isValid = false;
    }

    if (messageField.value.length > CONFIG.maxMessageLength) {
      showError(messageField, `Сообщение слишком длинное (максимум ${CONFIG.maxMessageLength} символов)`);
      isValid = false;
    }

    // Проверка согласия
    const agreementField = document.getElementById('c-agreement');
    if (!agreementField.checked) {
      showError(agreementField, 'Необходимо согласие на обработку данных');
      isValid = false;
    }

    return isValid;
  }

  function getFormData() {
    return {
      lastName: document.getElementById('c-lastname').value.trim(),
      firstName: document.getElementById('c-firstname').value.trim(),
      middlename: document.getElementById('c-middlename').value.trim(),
      email: document.getElementById('c-email').value.trim(),
      phone: document.getElementById('c-phone').value.trim(),
      subject: document.getElementById('c-subject').value,
      message: document.getElementById('c-msg').value.trim(),
      agreement: document.getElementById('c-agreement').checked
    };
  }

  function formatEmailBody(data) {
    const fullName = `${data.lastName} ${data.firstName} ${data.middlename || ''}`.trim();
    
    return `
ФИО: ${fullName}
Email: ${data.email}
Телефон: ${data.phone || 'Не указан'}
Тема: ${data.subject}

Сообщение:
${data.message}

---
Отправлено с сайта LevGamer39
Время: ${new Date().toLocaleString('ru-RU')}
    `.trim();
  }

  function createFallbackModal(subject, body) {
    const modal = document.createElement('div');
    modal.className = 'fallback-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>📧 Альтернативный способ отправки</h3>
        <p>Автоматическая отправка временно недоступна. Вы можете:</p>
        
        <div class="fallback-options">
          <a href="${CONFIG.fallbackEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}" 
             class="btn" style="margin: 10px 0; text-align: center; display: block;">
            <span class="btn-icon">📧</span>
            <span class="btn-text">Открыть в почтовом клиенте</span>
          </a>
          
          <div style="margin: 20px 0;">
            <p><strong>Или скопируйте текст ниже и отправьте вручную:</strong></p>
            <textarea readonly class="fallback-textarea">${body}</textarea>
            <button onclick="copyFormText()" class="btn secondary" style="width: 100%; margin-top: 10px;">
              <span class="btn-icon">📋</span>
              <span class="btn-text">Скопировать текст</span>
            </button>
          </div>
        </div>
        
        <button onclick="this.closest('.fallback-modal').remove()" class="btn ghost" style="width: 100%; margin-top: 10px;">
          Закрыть
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Закрытие по клику вне модального окна
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  function clearForm() {
    form.reset();
    clearAllErrors();
    hideStatus();
    if (charCounter) {
      charCounter.textContent = `0/${CONFIG.maxMessageLength} символов`;
      charCounter.classList.remove('warning', 'error');
    }
  }

  // ==================== УТИЛИТЫ ====================

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showError(field, message) {
    field.style.borderColor = 'var(--danger)';
    
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
    
    // Анимация "тряски" для поля
    field.classList.add('shake');
    setTimeout(() => field.classList.remove('shake'), 500);
  }

  function clearError(field) {
    field.style.borderColor = '';
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

  function clearAllErrors() {
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
      field.style.borderColor = '';
      const errorElement = field.parentNode.querySelector('.error-message');
      if (errorElement) {
        errorElement.remove();
      }
    });
  }

  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
  }

  function hideStatus() {
    statusMessage.className = 'status-message';
  }

  // Глобальная функция для копирования текста
  window.copyFormText = function() {
    const textarea = document.querySelector('.fallback-textarea');
    textarea.select();
    
    try {
      const successful = document.execCommand('copy');
      const btn = document.querySelector('.fallback-modal .btn.secondary');
      const originalHTML = btn.innerHTML;
      
      if (successful) {
        btn.innerHTML = '<span class="btn-icon">✅</span><span class="btn-text">Скопировано!</span>';
        setTimeout(() => {
          btn.innerHTML = originalHTML;
        }, 2000);
      }
    } catch (err) {
      console.error('Copy failed:', err);
      alert('Не удалось скопировать текст. Скопируйте вручную.');
    }
  };
});
// Функция авто-высоты textarea
function initAutoResizeTextarea() {
  const textarea = document.getElementById('c-msg');
  if (!textarea) return;

  function autoResize() {
    // Сбрасываем высоту чтобы получить правильный scrollHeight
    textarea.style.height = 'auto';
    
    // Устанавливаем новую высоту
    const newHeight = Math.min(textarea.scrollHeight, 400); // 400px максимум
    textarea.style.height = newHeight + 'px';
    
    // Обновляем счетчик символов
    updateCharCounter();
  }

  function updateCharCounter() {
    if (!charCounter) return;
    const currentLength = textarea.value.length;
    charCounter.textContent = `${currentLength}/${CONFIG.maxMessageLength} символов`;
    
    charCounter.classList.remove('warning', 'error');
    if (currentLength > CONFIG.maxMessageLength * 0.8) {
      charCounter.classList.add('warning');
    }
    if (currentLength > CONFIG.maxMessageLength) {
      charCounter.classList.add('error');
    }
  }

  // События для авто-высоты
  textarea.addEventListener('input', autoResize);
  textarea.addEventListener('focus', autoResize);
  textarea.addEventListener('change', autoResize);
  
  // Инициализация при загрузке
  setTimeout(autoResize, 100);
}

// Обновленная функция инициализации счетчика символов
function initCharCounter() {
  const textarea = document.getElementById('c-msg');
  if (!textarea || !charCounter) return;

  function updateCounter() {
    const currentLength = textarea.value.length;
    charCounter.textContent = `${currentLength}/${CONFIG.maxMessageLength} символов`;
    
    charCounter.classList.remove('warning', 'error');
    if (currentLength > CONFIG.maxMessageLength * 0.8) {
      charCounter.classList.add('warning');
    }
    if (currentLength > CONFIG.maxMessageLength) {
      charCounter.classList.add('error');
      // Обрезаем текст если превышен лимит
      textarea.value = textarea.value.substring(0, CONFIG.maxMessageLength);
    }
  }

  textarea.addEventListener('input', updateCounter);
  
  // Инициализация
  updateCounter();
}