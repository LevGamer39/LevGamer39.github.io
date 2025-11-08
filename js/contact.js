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

    const nameFields = ['c-lastname', 'c-firstname', 'c-middlename'];
    nameFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener('blur', validateNameField);
        field.addEventListener('input', handleNameInput);
        field.addEventListener('keydown', preventSpacesInName);
        field.addEventListener('focus', clearFieldStyles);
      }
    });

    const phoneField = document.getElementById('c-phone');
    if (phoneField) {
      phoneField.addEventListener('input', handlePhoneInput);
      phoneField.addEventListener('keydown', handlePhoneKeydown);
      phoneField.addEventListener('focus', clearFieldStyles);
    }

    const socialField = document.getElementById('c-social');
    if (socialField) {
      socialField.addEventListener('blur', validateSocial);
      socialField.addEventListener('focus', clearFieldStyles);
    }

    const emailField = document.getElementById('c-email');
    if (emailField) {
      emailField.addEventListener('blur', validateEmail);
      emailField.addEventListener('input', handleEmailInput);
      emailField.addEventListener('focus', clearFieldStyles);
    }

    const subjectField = document.getElementById('c-subject');
    if (subjectField) {
      subjectField.addEventListener('focus', clearFieldStyles);
    }

    if (messageField) {
      messageField.addEventListener('focus', clearFieldStyles);
    }

    initSelectStyles();

    form.addEventListener('submit', handleFormSubmit);

    if (clearBtn) {
      clearBtn.addEventListener('click', clearForm);
    }
  }

  function clearFieldStyles() {
    this.classList.remove('valid', 'invalid');
    const errorElement = this.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

  function initSelectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .form-select {
        background: var(--panel) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234DA3FF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E") no-repeat right 16px center / 16px;
        color: var(--text);
      }
      .form-select option {
        background: var(--panel);
        color: var(--text);
        padding: 12px;
        border: none;
      }
      .form-select option:hover {
        background: var(--accent);
        color: white;
      }
      .form-select option:checked {
        background: var(--accent);
        color: white;
      }
    `;
    document.head.appendChild(style);
  }

  function preventSpacesInName(e) {
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      return false;
    }
  }

  function handleNameInput(e) {
    const value = this.value.replace(/\s/g, '');
    if (value !== this.value) {
      this.value = value;
    }
    
    if (this.classList.contains('invalid')) {
      clearFieldError(this);
    }
  }

  function handleEmailInput(e) {
    if (this.classList.contains('invalid')) {
      clearFieldError(this);
    }
  }

  function validateNameField() {
    const value = this.value.trim();
    const fieldName = this.id === 'c-lastname' ? 'Фамилия' : 
                     this.id === 'c-firstname' ? 'Имя' : 'Отчество';
    
    if (this.id === 'c-middlename' && !value) {
      clearFieldError(this);
      return true;
    }
    
    if (!value) {
      showFieldError(this, `${fieldName} обязательно для заполнения`);
      return false;
    }
    
    if (/\s/.test(value)) {
      showFieldError(this, `${fieldName} не должно содержать пробелы`);
      return false;
    }
    
    if (value.length < 2) {
      showFieldError(this, `${fieldName} должно содержать минимум 2 символа`);
      return false;
    }
    
    if (value.length > 50) {
      showFieldError(this, `${fieldName} должно содержать не более 50 символов`);
      return false;
    }
    
    if (!/^[a-zA-Zа-яА-ЯёЁ\-']+$/u.test(value)) {
      showFieldError(this, `${fieldName} может содержать только буквы, дефисы и апострофы`);
      return false;
    }
    
    if (/[-']{2,}/.test(value) || /^[-']|[-']$/.test(value)) {
      showFieldError(this, `${fieldName} содержит некорректное использование дефисов или апострофов`);
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
    
    if (value.includes(' ')) {
      showFieldError(this, 'Email не должен содержать пробелы');
      return false;
    }
    
    if (!value.includes('@')) {
      showFieldError(this, 'Email должен содержать символ @');
      return false;
    }
    
    const parts = value.split('@');
    if (parts.length !== 2) {
      showFieldError(this, 'Некорректный формат email');
      return false;
    }
    
    const localPart = parts[0];
    const domainPart = parts[1];
    
    if (!localPart) {
      showFieldError(this, 'Отсутствует локальная часть email (перед @)');
      return false;
    }
    
    if (!domainPart) {
      showFieldError(this, 'Отсутствует доменная часть email (после @)');
      return false;
    }
    
    if (!domainPart.includes('.')) {
      showFieldError(this, 'Доменная часть должна содержать точку');
      return false;
    }
    
    if (domainPart.startsWith('.') || domainPart.endsWith('.')) {
      showFieldError(this, 'Доменная часть не может начинаться или заканчиваться точкой');
      return false;
    }
    
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
      showFieldError(this, 'Локальная часть не может начинаться или заканчиваться точкой');
      return false;
    }
    
    if (localPart.includes('..') || domainPart.includes('..')) {
      showFieldError(this, 'Email не может содержать две точки подряд');
      return false;
    }
    
    const domainParts = domainPart.split('.');
    if (domainParts.length < 2) {
      showFieldError(this, 'Доменная часть должна содержать как минимум одну точку');
      return false;
    }
    
    const tld = domainParts[domainParts.length - 1];
    if (tld.length < 2) {
      showFieldError(this, 'Доменная зона должна содержать минимум 2 символа');
      return false;
    }
    
    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
      showFieldError(this, 'Некорректный формат email адреса');
      return false;
    }
    
    if (value.length > 254) {
      showFieldError(this, 'Email слишком длинный (максимум 254 символа)');
      return false;
    }
    
    if (localPart.length > 64) {
      showFieldError(this, 'Локальная часть email слишком длинная');
      return false;
    }
    
    clearFieldError(this);
    return true;
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
    
    const nameFields = [
      { id: 'c-lastname', required: true },
      { id: 'c-firstname', required: true },
      { id: 'c-middlename', required: false }
    ];
    
    nameFields.forEach(({ id, required }) => {
      const field = document.getElementById(id);
      if (field && (required || field.value.trim())) {
        if (!validateNameField.call(field)) {
          isValid = false;
        }
      }
    });

    const requiredFields = [
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