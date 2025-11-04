// js/terminal.js — привязка к уже существующему DOM (не создаёт элементы)
(function(){
  // Получаем элементы, если их нет — выходим без создания ничего
  const out = document.getElementById('terminal-output');
  const input = document.getElementById('terminal-input');

  if (!out || !input) {
    // консоль не на странице — ничего не делаем
    return;
  }

  // Функция добавления строки в вывод
  function appendLine(text, cls) {
    const el = document.createElement('div');
    el.textContent = text;
    if (cls) el.className = cls;
    out.appendChild(el);
    out.scrollTop = out.scrollHeight;
  }

  // Набор команд
  const commands = {
    help() {
      appendLine('Доступные команды: help, projects, open projects, info, system check, clear, goto <page>');
    },
    projects() {
      appendLine('ArchARM System — дистрибутив для ARM');
      appendLine('System Dashboard — веб-панель мониторинга');
      appendLine('Embedded Tools — утилиты для микроконтроллеров');
    },
    "open projects"() {
      appendLine('Открываю Projects...');
      setTimeout(()=> window.location.href = 'projects', 250);
    },
    info() {
      appendLine('LevGamer39 — C++/C# dev, backend, embedded, ARM.');
    },
    "system check"() {
      appendLine('Запуск проверки системы...');
      appendLine('CPU: OK');
      appendLine('RAM: OK');
      appendLine('Services: nginx (running), ssh (running)');
      appendLine('Все системы в норме ✔');
    },
    clear() {
      out.innerHTML = '';
    },
    goto(arg) {
      if (!arg) { appendLine('Использование: goto index|projects|skills|contact'); return; }
      const map = {index:'/', projects:'projects', skills:'skills', contact:'contact'};
      const page = arg.trim();
      if (map[page]) {
        appendLine(`Переход: ${map[page]}`);
        setTimeout(()=> location.href = map[page], 200);
      } else appendLine('Неизвестная страница: ' + page);
    }
  };

  function handleCommand(raw) {
    const val = String(raw || '').trim();
    if (!val) return;
    appendLine(`lev@LevGamer39:~$ ${val}`, 'prompt-line');
    const low = val.toLowerCase();

    if (commands[low]) { commands[low](); return; }

    // split for commands with args
    const parts = low.split(' ');
    const cmd = parts[0];
    const arg = parts.slice(1).join(' ');
    if (commands[cmd]) { commands[cmd](arg); return; }

    appendLine(`Команда не найдена: ${val}. Введите help.`);
  }

  // Enter обработчик
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleCommand(input.value);
      input.value = '';
    }
  });

  // initial welcome (only if empty)
  if (out.children.length === 0) {
    appendLine('LevGamer39 — привет. Введите "help" для списка команд.');
  }
})();
