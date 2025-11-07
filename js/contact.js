/* contact.js */
/* #pragma region Contact Form Logic */
document.addEventListener('DOMContentLoaded', function() {
  const API_BASE_URL = 'https://levgamer39.pythonanywhere.com';
  const form = document.getElementById('contact-form');
  const statusMessage = document.getElementById('form-status');
  const charCounter = document.querySelector('.char-counter');
  const messageField = document.getElementById('c-msg');
  const submitBtn = document.getElementById('submit-btn');
  const clearBtn = document.getElementById('clear-form');
  
  if (!form) return;

  initContactForm();

  function initContactForm() {
    if (messageField && charCounter) {
      messageField.addEventListener('input', function() {
        updateCharCounter.call(this);
        autoResizeTextarea.call(this);
      });
      autoResizeTextarea.call(messageField);
    }

    const phoneField = document.getElementById('c-phone');
    if (phoneField) {
      phoneField.addEventListener('input', handlePhoneInput);
      phoneField.addEventListener('keydown', handlePhoneKeydown);
    }

    const socialField = document.getElementById('c-social');
    if (socialField) {
      socialField.addEventListener('blur', validateSocial);
    }

    form.addEventListener('submit', handleFormSubmit);

    if (clearBtn) {
      clearBtn.addEventListener('click', clearForm);
    }
  }

  function autoResizeTextarea() {
    this.style.height = 'auto';
    const newHeight = Math.min(this.scrollHeight, 300);
    this.style.height = newHeight + 'px';
    this.style.overflowY = newHeight >= 300 ? 'auto' : 'hidden';
  }

  function updateCharCounter() {
    const maxLength = 1000;
    const currentLength = this.value.length;
    
    if (charCounter) {
      charCounter.textContent = `${currentLength}/${maxLength} символов`;
      
      charCounter.classList.remove('normal', 'warning', 'danger');
      
      if (currentLength >= maxLength) {
        charCounter.classList.add('danger');
        this.value = this.value.substring(0, maxLength);
        charCounter.textContent = `${maxLength}/${maxLength} символов (лимит)`;
      } else if (currentLength >= maxLength * 0.8) {
        charCounter.classList.add('warning');
      } else {
        charCounter.classList.add('normal');
      }
    }
  }

  function handlePhoneInput(e) {
    const input = e.target;
    const value = input.value;
    
    const cursorPosition = input.selectionStart;
    
    let cleanValue = '';
    let hasPlus = false;
    
    for (let i = 0; i < value.length; i++) {
      const char = value[i];
      if (i === 0 && char === '+') {
        hasPlus = true;
        cleanValue += '+';
      } else if (/\d/.test(char)) {
        cleanValue += char;
      }
    }
    
    if (!hasPlus && cleanValue.length > 0) {
      if (cleanValue[0] === '8') {
        cleanValue = '+7' + cleanValue.substring(1);
      } else {
        cleanValue = '+7' + cleanValue;
      }
    }
    
    const formattedValue = formatPhoneNumber(cleanValue);
    input.value = formattedValue;
    
    input.setSelectionRange(formattedValue.length, formattedValue.length);
  }

  function formatPhoneNumber(value) {
    if (!value || value === '+') return value;
    if (value === '+') return '+';
    
    const digits = value.substring(1).replace(/\D/g, '');
    if (digits.length === 0) return '+';
    
    let result = '+7';
    
    if (digits.length > 1) {
      result += ` (${digits.substring(1, 4)}`;
    }
    if (digits.length > 4) {
      result += `) ${digits.substring(4, 7)}`;
    }
    if (digits.length > 7) {
      result += `-${digits.substring(7, 9)}`;
    }
    if (digits.length > 9) {
      result += `-${digits.substring(9, 11)}`;
    }
    
    return result;
  }

  function handlePhoneKeydown(e) {
    const input = e.target;
    const cursorPos = input.selectionStart;
    const value = input.value;
    
    const allowedKeys = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 
      'Tab', 'Home', 'End', 'Enter'
    ];
    
    if (allowedKeys.includes(e.key)) {
      if (e.key === 'Backspace' && cursorPos === 1 && value.startsWith('+')) {
        return;
      }
      return;
    }
    
    if ((e.ctrlKey || e.metaKey) && 
        (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x')) {
      return;
    }
    
    if (e.key === '+' && cursorPos === 0 && !value.startsWith('+')) {
      return;
    }
    
    if (/\d/.test(e.key)) {
      return;
    }
    
    e.preventDefault();
  }

  function validateSocial() {
    const value = this.value.trim();
    
    if (!value) {
      clearFieldError(this);
      return true;
    }
    
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    const usernameRegex = /^@[a-zA-Z0-9_.]{3,30}$/;
    
    if (urlRegex.test(value) || usernameRegex.test(value)) {
      clearFieldError(this);
      return true;
    } else {
      showFieldError(this, 'Введите ссылку (https://example.com) или юзернейм (@username)');
      return false;
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    
    hideStatus();
    clearAllErrors();
    
    if (!validateAllFields()) {
      showStatus('❌ Пожалуйста, исправьте ошибки в форме', 'error');
      return;
    }
    
    setLoadingState(true);
    
    try {
      const formData = prepareFormData();
      const result = await sendToAPI(formData);
      
      if (result.success) {
        showStatus('✅ Сообщение отправлено! Отвечу в течение 1-2 часов.', 'success');
        resetForm();
        
        setTimeout(() => {
          hideStatus();
        }, 5000);
      } else {
        throw new Error(result.error || 'Ошибка отправки');
      }
      
    } catch (error) {
      showStatus('❌ Ошибка отправки: ' + error.message, 'error');
    } finally {
      setLoadingState(false);
    }
  }

  function validateAllFields() {
    let isValid = true;
    
    const requiredFields = [
      { id: 'c-lastname', validator: validateRequired },
      { id: 'c-firstname', validator: validateRequired },
      { id: 'c-email', validator: validateEmail },
      { id: 'c-subject', validator: validateSelect },
      { id: 'c-msg', validator: validateMessage }
    ];
    
    requiredFields.forEach(({ id, validator }) => {
      const field = document.getElementById(id);
      if (field && !validator.call(field)) {
        isValid = false;
      }
    });

    const socialField = document.getElementById('c-social');
    if (socialField && socialField.value.trim() && !validateSocial.call(socialField)) {
      isValid = false;
    }
    
    return isValid;
  }

  function validateRequired() {
    const value = this.value.trim();
    if (!value) {
      showFieldError(this, 'Это поле обязательно для заполнения');
      return false;
    }
    clearFieldError(this);
    return true;
  }

  function validateEmail() {
	  const value = this.value.trim();
	  
	  if (!value) {
		showFieldError(this, 'Email обязателен для заполнения');
		return false;
	  }
	  
	  if (/[а-яА-Я]/.test(value)) {
		showFieldError(this, 'Email не должен содержать русские буквы');
		return false;
	  }
	  
	  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
		showFieldError(this, 'Введите корректный email адрес');
		return false;
	  }
	  
	  clearFieldError(this);
	  return true;
	}

  function validateSelect() {
    if (!this.value) {
      showFieldError(this, 'Пожалуйста, выберите тему сообщения');
      return false;
    }
    
    clearFieldError(this);
    return true;
  }

  function validateMessage() {
    const value = this.value.trim();
    const minLength = 10;
    const maxLength = 1000;
    
    if (!value) {
      showFieldError(this, 'Сообщение обязательно для заполнения');
      return false;
    }
    
    if (value.length < minLength) {
      showFieldError(this, `Минимум ${minLength} символов`);
      return false;
    }
    
    if (value.length > maxLength) {
      showFieldError(this, `Максимум ${maxLength} символов`);
      return false;
    }
    
    clearFieldError(this);
    return true;
  }

  function prepareFormData() {
    return {
      lastname: document.getElementById('c-lastname').value.trim(),
      firstname: document.getElementById('c-firstname').value.trim(),
      middlename: document.getElementById('c-middlename').value.trim(),
      phone: document.getElementById('c-phone').value.trim(),
      email: document.getElementById('c-email').value.trim(),
      social: document.getElementById('c-social').value.trim(),
      subject: document.getElementById('c-subject').value,
      message: document.getElementById('c-msg').value.trim(),
      source: 'portfolio-site'
    };
  }

  async function sendToAPI(data) {
    try {
      const response = await fetch(API_BASE_URL + '/webhook/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Не удалось подключиться к серверу');
      }
      throw error;
    }
  }

  function setLoadingState(loading) {
    if (submitBtn) {
      submitBtn.disabled = loading;
      submitBtn.classList.toggle('loading', loading);
    }
  }

  function resetForm() {
    form.reset();
    clearAllErrors();
    if (charCounter) {
      charCounter.textContent = '0/1000 символов';
      charCounter.classList.remove('warning', 'danger');
      charCounter.classList.add('normal');
    }
    if (messageField) {
      messageField.style.height = 'auto';
      messageField.style.overflowY = 'hidden';
    }
  }

  function clearForm(e) {
    if (e) e.preventDefault();
    
    if (confirm('Очистить все поля формы?')) {
      resetForm();
      hideStatus();
    }
  }

  function showFieldError(field, message) {
    field.classList.add('invalid');
    field.classList.remove('valid');
    
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  function clearFieldError(field) {
    field.classList.remove('invalid');
    field.classList.add('valid');
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

  function clearAllErrors() {
    const fields = form.querySelectorAll('.form-input, .form-select, .form-textarea');
    fields.forEach(field => {
      field.classList.remove('invalid', 'valid');
      const errorElement = field.parentNode.querySelector('.error-message');
      if (errorElement) {
        errorElement.remove();
      }
    });
  }

  function showStatus(message, type) {
    if (statusMessage) {
      statusMessage.textContent = message;
      statusMessage.className = `status-message ${type}`;
      statusMessage.style.display = 'block';
    }
  }

  function hideStatus() {
    if (statusMessage) {
      statusMessage.style.display = 'none';
    }
  }
});
/* #pragma endregion */