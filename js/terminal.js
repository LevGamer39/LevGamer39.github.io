// js/terminal.js — привязка к уже существующему DOM (не создаёт элементы)
(function(){
  // Получаем элементы, если их нет — выходим без создания ничего
  const out = document.getElementById('terminal-output');
  const input = document.getElementById('terminal-input');

  if (!out || !input) {
    // консоль не на странице — ничего не делаем
    return;
  }

  // История команд
  let commandHistory = JSON.parse(localStorage.getItem('terminalHistory') || '[]');
  let historyIndex = commandHistory.length;

  // Текущая директория (виртуальная файловая система)
  let currentDir = '/home/lev';
  const fileSystem = {
    '/': {
      'home': 'DIR'
    },
    '/home': {
      'lev': 'DIR'
    },
    '/home/lev': {
      'README.txt': 'Добро пожаловать в домашнюю директорию LevGamer39!',
      'projects': 'DIR',
      'skills': 'DIR', 
      'contacts.txt': 'GitHub: https://github.com/LevGamer39\nSteam: https://steamcommunity.com/profiles/76561199019925778/\nEmail: Levk039@yandex.ru',
      'resume.pdf': 'FILE',
      '.bashrc': 'FILE',
      '.secret': 'FILE - Попробуй команду: secret'
    },
    '/home/lev/projects': {
      'plant-defense': 'DIR - Игра на C#/Unity',
      'asf-termux': 'DIR - Автоматизация Steam',
      'slanglit-bot': 'DIR - Telegram бот',
      'pi-homelab': 'DIR - Raspberry Pi лаборатория',
      'portfolio': 'DIR - Сайт-портфолио',
      'lcd-monitor': 'DIR - LCD мониторинг'
    },
    '/home/lev/skills': {
      'backend.txt': 'C++, C#, Python, Bash',
      'systems.txt': 'Linux, Docker, Git, CI/CD',
      'web.txt': 'HTML, CSS, JavaScript, API',
      'embedded.txt': 'Raspberry Pi, ESP, Arduino, Unity'
    }
  };

  // Доступные команды для автодополнения
  const availableCommands = [
    'ls', 'dir', 'cd', 'pwd', 'cat', 'whoami', 'date', 'echo', 'clear',
    'help', 'projects', 'skills', 'info', 'system', 'check', 'goto',
    'game', 'matrix', 'sudo', 'hack', 'secret'
  ];

  // Состояние активной игры
  let activeGame = null;

  // Функция добавления строки в вывод
  function appendLine(text, cls) {
    const el = document.createElement('div');
    el.textContent = text;
    if (cls) el.className = cls;
    out.appendChild(el);
    out.scrollTop = out.scrollHeight;
  }

  // Функция сохранения истории
  function saveHistory() {
    localStorage.setItem('terminalHistory', JSON.stringify(commandHistory));
  }

  // Функция для работы с виртуальной файловой системой
  function resolvePath(path) {
    if (path.startsWith('/')) {
      return path;
    }
    
    const parts = path.split('/').filter(p => p !== '');
    let result = currentDir;
    
    for (const part of parts) {
      if (part === '..') {
        result = result.split('/').slice(0, -1).join('/') || '/';
      } else if (part !== '.') {
        result = result === '/' ? `/${part}` : `${result}/${part}`;
      }
    }
    
    return result;
  }

  // Функция проверки доступа к директории
  function canAccessDirectory(path) {
    // Запрещаем доступ к корневой и системным директориям
    const restrictedPaths = ['/', '/home'];
    return !restrictedPaths.includes(path);
  }

  // Функция автодополнения
  function autocomplete(currentInput) {
    const parts = currentInput.split(' ');
    const currentPart = parts[parts.length - 1];
    
    // Если это первое слово - дополняем команды
    if (parts.length === 1) {
      const matches = availableCommands.filter(cmd => 
        cmd.startsWith(currentPart.toLowerCase())
      );
      
      if (matches.length === 1) {
        return matches[0] + ' ';
      } else if (matches.length > 1) {
        appendLine('');
        appendLine('Доступные команды:');
        matches.forEach(match => appendLine('  ' + match));
        return currentInput;
      }
    }
    
    // Если это не первое слово - дополняем файлы/директории
    if (parts.length > 1 && (parts[0] === 'cd' || parts[0] === 'ls' || parts[0] === 'cat')) {
      const pathArg = parts.slice(1).join(' ');
      const lastSlashIndex = pathArg.lastIndexOf('/');
      const prefix = lastSlashIndex >= 0 ? pathArg.substring(0, lastSlashIndex + 1) : '';
      const searchTerm = lastSlashIndex >= 0 ? pathArg.substring(lastSlashIndex + 1) : pathArg;
      
      const searchPath = resolvePath(prefix || '.');
      const dir = fileSystem[searchPath];
      
      if (dir) {
        const matches = Object.keys(dir).filter(name => 
          name.startsWith(searchTerm)
        );
        
        if (matches.length === 1) {
          const completed = prefix + matches[0];
          if (dir[matches[0]].startsWith('DIR')) {
            return parts[0] + ' ' + completed + '/';
          }
          return parts[0] + ' ' + completed + ' ';
        } else if (matches.length > 1) {
          appendLine('');
          appendLine('Доступные варианты:');
          matches.forEach(match => {
            const type = dir[match].startsWith('DIR') ? '/' : '';
            appendLine('  ' + match + type);
          });
          return currentInput;
        }
      }
    }
    
    return currentInput;
  }

  // Набор команд с реальными данными с сайта + Linux команды + новые команды
  const commands = {
    // Linux команды
    ls(arg) {
      const path = arg ? resolvePath(arg) : currentDir;
      const dir = fileSystem[path];
      
      if (!dir) {
        appendLine(`ls: невозможно получить доступ к '${path}': Нет такого файла или каталога`);
        return;
      }
      
      if (!canAccessDirectory(path)) {
        appendLine(`ls: открытие каталога '${path}': Доступ запрещен`);
        return;
      }
      
      appendLine(`Содержимое ${path}:`);
      appendLine('');
      
      // Сначала директории, потом файлы
      const entries = Object.entries(dir);
      const directories = entries.filter(([name, type]) => type.startsWith('DIR'));
      const files = entries.filter(([name, type]) => !type.startsWith('DIR'));
      
      directories.forEach(([name, type]) => {
        appendLine(`  ${name}/`);
      });
      
      files.forEach(([name, type]) => {
        appendLine(`  ${name}`);
      });
      
      appendLine('');
      appendLine(`Всего: ${entries.length} элементов`);
    },

    dir(arg) {
      this.ls(arg); // Псевдоним для ls
    },

    pwd() {
      appendLine(currentDir);
    },

    cd(arg) {
      if (!arg) {
        currentDir = '/home/lev';
        appendLine('Переход в домашнюю директорию');
        return;
      }
      
      const newPath = resolvePath(arg);
      
      if (!fileSystem[newPath]) {
        appendLine(`cd: ${arg}: Нет такого файла или каталога`);
        return;
      }
      
      if (!canAccessDirectory(newPath)) {
        appendLine(`cd: ${arg}: Доступ запрещен`);
        return;
      }
      
      // Проверяем, что это директория
      const parent = newPath.split('/').slice(0, -1).join('/') || '/';
      const dirName = newPath.split('/').pop();
      
      if (newPath !== '/') {
        const parentDir = fileSystem[parent];
        if (!parentDir || !parentDir[dirName] || !parentDir[dirName].startsWith('DIR')) {
          appendLine(`cd: ${arg}: Не каталог`);
          return;
        }
      }
      
      currentDir = newPath;
    },

    cat(arg) {
      if (!arg) {
        appendLine('cat: отсутствует операнд');
        appendLine('Постарайтесь «cat --help» для получения дополнительной информации.');
        return;
      }
      
      const path = resolvePath(arg);
      const dirPath = path.split('/').slice(0, -1).join('/') || '/';
      const fileName = path.split('/').pop();
      const dir = fileSystem[dirPath];
      
      if (!dir || !dir[fileName]) {
        appendLine(`cat: ${arg}: Нет такого файла или каталога`);
        return;
      }
      
      const content = dir[fileName];
      if (content.startsWith('DIR')) {
        appendLine(`cat: ${arg}: Это каталог`);
        return;
      }
      
      appendLine(content);
    },

    whoami() {
      appendLine('lev');
    },

    date() {
      const now = new Date();
      appendLine(now.toLocaleString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      }));
    },

    echo(arg) {
      appendLine(arg || '');
    },

    clear() {
      out.innerHTML = '';
      activeGame = null;
    },

    // === ИГРОВЫЕ КОМАНДЫ ===
    game(arg) {
      if (activeGame) {
        appendLine('Игра уже активна. Завершите текущую игру.');
        return;
      }

      if (!arg) {
        appendLine('Доступные игры:');
        appendLine('  guess  - Угадай число');
        appendLine('  rps    - Камень-ножницы-бумага');
        appendLine('');
        appendLine('Использование: game <название>');
        return;
      }

      const gameName = arg.toLowerCase();
      
      switch (gameName) {
        case 'guess':
          startGuessGame();
          break;
        case 'rps':
          startRPSGame();
          break;
        default:
          appendLine(`Игра '${arg}' не найдена`);
          appendLine('Доступные игры: guess, rps');
      }
    },

    // === СЕКРЕТНЫЕ КОМАНДЫ ===
    matrix() {
      appendLine('Запуск эффекта Матрицы...');
      appendLine('Инициализация цифрового дождя...');
      
      // Создаем эффект матрицы
      const matrixOverlay = document.createElement('div');
      matrixOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 20, 0, 0.9);
        z-index: 9999;
        font-family: "JetBrains Mono", monospace;
        color: #0f0;
        overflow: hidden;
        pointer-events: none;
      `;
      
      document.body.appendChild(matrixOverlay);
      
      // Создаем колонки с падающими символами
      const columns = 30;
      for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.style.cssText = `
          position: absolute;
          top: -100px;
          left: ${(i / columns) * 100}%;
          font-size: 16px;
          animation: matrix-fall ${Math.random() * 3 + 2}s linear infinite;
          animation-delay: ${Math.random() * 2}s;
          white-space: pre;
        `;
        
        let text = '';
        const rows = 20;
        for (let j = 0; j < rows; j++) {
          text += String.fromCharCode(0x30A0 + Math.random() * 96) + '\n';
        }
        column.textContent = text;
        
        matrixOverlay.appendChild(column);
      }
      
      // Добавляем стили для анимации
      const style = document.createElement('style');
      style.textContent = `
        @keyframes matrix-fall {
          from { transform: translateY(-100px); }
          to { transform: translateY(100vh); }
        }
      `;
      document.head.appendChild(style);
      
      appendLine('Эффект Матрицы активирован!');
      appendLine('Для выхода нажмите Escape.');
      
      // Обработчик выхода
      const keyHandler = function(e) {
        if (e.key === 'Escape') {
          if (matrixOverlay.parentNode) {
            document.body.removeChild(matrixOverlay);
          }
          if (style.parentNode) {
            document.head.removeChild(style);
          }
          document.removeEventListener('keydown', keyHandler);
          appendLine('Эффект Матрицы деактивирован.');
        }
      };
      
      document.addEventListener('keydown', keyHandler);
    },

    sudo() {
      appendLine('sudo: недостаточно прав для выполнения этой команды');
    },

    hack() {
      appendLine('🚀 Инициализация протокола взлома...');
      appendLine('📡 Подключение к главному серверу...');
      
      const messages = [
        '🔍 Сканирование портов...',
        '💾 Обход защиты...',
        '🔑 Подбор паролей...',
        '📊 Анализ данных...',
        '🚪 Поиск уязвимостей...',
        '💻 Установка бэкдора...',
        '📨 Перехват трафика...',
        '🔓 Получение доступа...'
      ];
      
      let delay = 500;
      messages.forEach((msg, index) => {
        setTimeout(() => {
          appendLine(msg);
          if (index === messages.length - 1) {
            setTimeout(() => {
              appendLine('✅ Взлом завершен!');
              appendLine('🎉 Шучу! Это же мой сайт :)');
            }, 800);
          }
        }, delay);
        delay += 500;
      });
    },

    secret() {
      appendLine('🎊 Поздравляю! Ты нашел секретную команду!');
      appendLine('');
      appendLine('🔮 Доступные секреты:');
      appendLine('  matrix - Цифровой дождь в стиле Матрицы');
      appendLine('  hack   - Имитация процесса взлома');
      appendLine('');
      appendLine('💡 Подсказка: попробуй ввести код Konami на сайте!');
      appendLine('   (↑ ↑ ↓ ↓ ← → ← → B A)');
    },

    // Специальные команды сайта
    help() {
      appendLine('ДОСТУПНЫЕ КОМАНДЫ:');
      appendLine('');
      appendLine('LINUX КОМАНДЫ:');
      appendLine('  ls, dir     - список файлов и каталогов');
      appendLine('  cd <dir>    - сменить директорию');
      appendLine('  pwd         - текущая директория');
      appendLine('  cat <file>  - показать содержимое файла');
      appendLine('  whoami      - текущий пользователь');
      appendLine('  date        - текущая дата и время');
      appendLine('  echo <text> - вывести текст');
      appendLine('  clear       - очистить терминал');
      appendLine('');
      appendLine('СПЕЦИАЛЬНЫЕ КОМАНДЫ:');
      appendLine('  projects     - показать список проектов');
      appendLine('  skills       - показать навыки и технологии');
      appendLine('  info         - информация о разработчике');
      appendLine('  system check - проверка системы');
      appendLine('  goto <page>  - перейти на страницу (home|skills|projects|contact)');
      appendLine('');
      appendLine('🎮 ИГРЫ:');
      appendLine('  game guess  - Угадай число');
      appendLine('  game rps    - Камень-ножницы-бумага');
      appendLine('');
      appendLine('🔮 СЕКРЕТНЫЕ КОМАНДЫ:');
      appendLine('  matrix      - Эффект цифрового дождя');
      appendLine('  hack        - Имитация взлома');
      appendLine('  secret      - Секретная информация');
      appendLine('');
      appendLine('Подсказка: используйте Tab для автодополнения');
    },
    
    projects() {
      appendLine('МОИ ПРОЕКТЫ');
      appendLine('');
      appendLine('Plant Defense');
      appendLine('  Игра на C# (Unity) с системой автоматической обороны');
      appendLine('  Технологии: C# · Unity · Game Dev · 3D Game');
      appendLine('');
      appendLine('ASF on Termux');
      appendLine('  Автоматизация Steam через ASF на Android/Termux');
      appendLine('  Технологии: Python · Termux · Steam · Automation');
      appendLine('');
      appendLine('Slanglit Bot');
      appendLine('  Telegram-бот для работы с сленгом и разговорной речью');
      appendLine('  Технологии: Python · Telegram API · AI · NLP');
      appendLine('');
      appendLine('Raspberry Pi 5 Homelab');
      appendLine('  Домашняя лаборатория с Docker-контейнерами');
      appendLine('  Технологии: Docker · Linux · Raspberry Pi · Home Server');
      appendLine('');
      appendLine('Portfolio Website');
      appendLine('  Персональный сайт-портфолио с SPA-архитектурой');
      appendLine('  Технологии: HTML · CSS · JavaScript · SPA · Responsive');
      appendLine('');
      appendLine('LCD Monitor');
      appendLine('  Система мониторинга для Raspberry Pi на LCD-дисплее');
      appendLine('  Технологии: Python · Raspberry Pi · I2C · LCD · Systemd');
      appendLine('');
      appendLine('Для просмотра в браузере введите: goto projects');
      appendLine('Или посмотрите в файловой системе: ls projects');
    },

    skills() {
      appendLine('НАВЫКИ И ТЕХНОЛОГИИ');
      appendLine('');
      appendLine('BACKEND-РАЗРАБОТКА');
      appendLine('  C++ - системные утилиты, высокопроизводительные приложения');
      appendLine('  C# - серверные приложения, игры на Unity');
      appendLine('  Python - API, боты, системы автоматизации');
      appendLine('  Bash - системные скрипты, DevOps-задачи');
      appendLine('');
      appendLine('СИСТЕМЫ И ИНФРАСТРУКТУРА');
      appendLine('  Linux - администрирование (Ubuntu, Arch, Debian)');
      appendLine('  Docker - контейнеризация, управление сервисами');
      appendLine('  Git - контроль версий, совместная разработка');
      appendLine('  Автоматизация - скрипты, мониторинг, CI/CD');
      appendLine('');
      appendLine('ВЕБ-ТЕХНОЛОГИИ');
      appendLine('  Frontend - HTML, CSS, JavaScript (базовый уровень)');
      appendLine('  Backend - веб-приложения, API, интеграции');
      appendLine('  Инструменты - Visual Studio, веб-серверы');
      appendLine('  Протоколы - HTTP, REST, Telegram API');
      appendLine('');
      appendLine('ДОПОЛНИТЕЛЬНЫЕ НАВЫКИ');
      appendLine('  Raspberry Pi - одноплатные компьютеры, homelab');
      appendLine('  ESP32/8266 - IoT-устройства, микроконтроллеры');
      appendLine('  Arduino - прототипирование, электроника');
      appendLine('  Unity - разработка игр, C# скрипты');
      appendLine('');
      appendLine('Для просмотра в браузере введите: goto skills');
      appendLine('Или посмотрите в файловой системе: ls skills');
    },

    info() {
      appendLine('ИНФОРМАЦИЯ О РАЗРАБОТЧИКЕ');
      appendLine('');
      appendLine('Lev Kirillov (LevGamer39)');
      appendLine('Backend-разработчик');
      appendLine('');
      appendLine('ОПИСАНИЕ:');
      appendLine('  Backend-разработчик с фокусом на C++, C# и Python.');
      appendLine('  Создаю серверные приложения, системы автоматизации,');
      appendLine('  API и бизнес-логику. Работаю с Linux (Ubuntu, Arch, Debian),');
      appendLine('  настраиваю серверные среды и управляю сервисами через Docker.');
      appendLine('');
      appendLine('СПЕЦИАЛИЗАЦИЯ:');
      appendLine('  Backend-разработка и системное программирование');
      appendLine('  Создание веб-интерфейсов как дополнение к основным проектам');
      appendLine('  Разработка игр на Unity');
      appendLine('  Работа с микроконтроллерами Raspberry Pi, ESP и Arduino');
      appendLine('');
      appendLine('КОНТАКТЫ:');
      appendLine('  GitHub: https://github.com/LevGamer39');
      appendLine('  Steam: https://steamcommunity.com/profiles/76561199019925778/');
      appendLine('  Email: Levk039@yandex.ru');
      appendLine('  Локация: Россия, UTC+2');
    },

    "system check"() {
      appendLine('ПРОВЕРКА СИСТЕМЫ');
      appendLine('Запуск диагностики...');
      appendLine('CPU: Intel/AMD x86_64 - OK');
      appendLine('RAM: 8GB+ - OK');
      appendLine('Storage: SSD/NVMe - OK');
      appendLine('');
      appendLine('СЕРВИСЫ:');
      appendLine('nginx    - running (веб-сервер)');
      appendLine('ssh      - running (удалённый доступ)');
      appendLine('docker   - running (контейнеризация)');
      appendLine('git      - available (контроль версий)');
      appendLine('');
      appendLine('СЕТЕВЫЕ СЕРВИСЫ:');
      appendLine('HTTP/HTTPS - порты 80/443 открыты');
      appendLine('SSH        - порт 22 доступен');
      appendLine('DNS        - разрешение имен работает');
      appendLine('');
      appendLine('СИСТЕМНЫЕ РЕСУРСЫ:');
      appendLine('Загрузка CPU: 5-15%');
      appendLine('Использование RAM: 30-60%');
      appendLine('Дисковое пространство: достаточно');
      appendLine('');
      appendLine('Все системы в норме');
      appendLine('Готов к работе!');
    },

    goto(arg) {
      if (!arg) { 
        appendLine('Использование: goto home|skills|projects|contact'); 
        appendLine('');
        appendLine('Доступные страницы:');
        appendLine('  home     - Главная страница с терминалом');
        appendLine('  skills   - Навыки и технологии');
        appendLine('  projects - Мои проекты');
        appendLine('  contact  - Контакты и форма обратной связи');
        return; 
      }
      
      const page = arg.trim().toLowerCase();
      const pageElements = document.querySelectorAll(`[data-page="${page}"]`);
      
      if (pageElements.length > 0) {
        appendLine(`Переход на страницу: ${page}`);
        setTimeout(() => {
          pageElements[0].click();
        }, 500);
      } else {
        appendLine(`Ошибка: Неизвестная страница "${page}"`);
        appendLine('');
        appendLine('Доступные страницы:');
        appendLine('  home     - Главная страница с терминалом');
        appendLine('  skills   - Навыки и технологии');
        appendLine('  projects - Мои проекты');
        appendLine('  contact  - Контакты и форма обратной связи');
      }
    }
  };

  // === ФУНКЦИИ ДЛЯ ИГР ===

  function startGuessGame() {
    const number = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;
    
    appendLine('🎯 Запуск игры "Угадай число"');
    appendLine('Я загадал число от 1 до 100.');
    appendLine('Попробуй угадать!');
    appendLine('Для выхода введите "exit"');
    
    activeGame = {
      type: 'guess',
      handler: function(raw) {
        const val = String(raw || '').trim().toLowerCase();
        
        if (val === 'exit') {
          appendLine(`🏁 Игра прервана. Загаданное число было: ${number}`);
          activeGame = null;
          return true;
        }
        
        const guess = parseInt(val);
        
        if (isNaN(guess)) {
          appendLine('❌ Пожалуйста, введите число от 1 до 100');
          return false;
        }
        
        if (guess < 1 || guess > 100) {
          appendLine('❌ Число должно быть от 1 до 100');
          return false;
        }
        
        attempts++;
        
        if (guess === number) {
          appendLine(`🎉 Поздравляю! Ты угадал число ${number} за ${attempts} попыток!`);
          activeGame = null;
          return true;
        } else if (guess < number) {
          appendLine('📈 Больше!');
        } else {
          appendLine('📉 Меньше!');
        }
        return false;
      }
    };
  }

  function startRPSGame() {
    const choices = ['камень', 'ножницы', 'бумага'];
    
    appendLine('✂️ Запуск игры "Камень-Ножницы-Бумага"');
    appendLine('Доступные варианты: камень, ножницы, бумага');
    appendLine('Для выхода введите "exit"');
    
    activeGame = {
      type: 'rps',
      handler: function(raw) {
        const val = String(raw || '').trim().toLowerCase();
        
        if (val === 'exit') {
          appendLine('🏁 Игра прервана');
          activeGame = null;
          return true;
        }
        
        if (!choices.includes(val)) {
          appendLine('❌ Доступные варианты: камень, ножницы, бумага');
          return false;
        }
        
        const computerChoice = choices[Math.floor(Math.random() * 3)];
        appendLine(`🤖 Компьютер выбрал: ${computerChoice}`);
        
        if (val === computerChoice) {
          appendLine('🤝 Ничья!');
        } else if (
          (val === 'камень' && computerChoice === 'ножницы') ||
          (val === 'ножницы' && computerChoice === 'бумага') ||
          (val === 'бумага' && computerChoice === 'камень')
        ) {
          appendLine('🎉 Ты выиграл!');
        } else {
          appendLine('💻 Компьютер выиграл!');
        }
        
        appendLine('Сыграем еще? Введите: камень, ножницы, бумага или exit для выхода');
        return false;
      }
    };
  }

  // === ОСНОВНАЯ ЛОГИКА ТЕРМИНАЛА ===

  function handleCommand(raw) {
    const val = String(raw || '').trim();
    if (!val) return;
    
    appendLine(`lev@LevGamer39:${currentDir === '/home/lev' ? '~' : currentDir}$ ${val}`, 'prompt-line');
    
    // Добавляем команду в историю (если не пустая и не повтор предыдущей)
    if (val && commandHistory[commandHistory.length - 1] !== val) {
      commandHistory.push(val);
      if (commandHistory.length > 50) {
        commandHistory = commandHistory.slice(-50);
      }
      saveHistory();
    }
    
    historyIndex = commandHistory.length;
    
    // Проверяем активную игру
    if (activeGame && activeGame.handler) {
      const gameFinished = activeGame.handler(val);
      if (!gameFinished) {
        return; // Игра продолжается, не обрабатываем как команду
      }
    }
    
    const parts = val.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');
    
    if (commands[cmd]) { 
      commands[cmd](arg); 
      return; 
    }

    appendLine(`Команда не найдена: ${val}`);
    appendLine('Введите "help" для списка доступных команд.');
  }

  // Обработчики клавиш
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleCommand(input.value);
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      // Стрелка вверх - предыдущая команда
      e.preventDefault();
      if (commandHistory.length > 0) {
        historyIndex = Math.max(0, historyIndex - 1);
        input.value = commandHistory[historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      // Стрелка вниз - следующая команда
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex = Math.min(commandHistory.length, historyIndex + 1);
        input.value = commandHistory[historyIndex] || '';
      } else {
        historyIndex = commandHistory.length;
        input.value = '';
      }
    } else if (e.key === 'Tab') {
      // Tab - автодополнение
      e.preventDefault();
      input.value = autocomplete(input.value);
    }
  });

  // Фокус на input при клике на терминал
  out.addEventListener('click', () => {
    input.focus();
  });

  // initial welcome (only if empty)
  if (out.children.length === 0) {
    appendLine('Добро пожаловать в терминал LevGamer39!');
    appendLine('Backend-разработчик | C++/C#/Python | Linux | Docker');
    appendLine('');
    appendLine('Для начала работы введите "help" для списка команд.');
    appendLine('Попробуйте Linux команды: ls, cd, pwd, cat, whoami');
    appendLine('');
  }
})();