'use strict';

// ============================================================
// StorageManager
// ============================================================
const StorageManager = {
  KEYS: {
    TASKS: 'todo-life-dashboard-tasks',
    LINKS: 'todo-life-dashboard-links',
  },

  getTasks() {
    try {
      const data = localStorage.getItem(this.KEYS.TASKS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveTasks(tasks) {
    try {
      localStorage.setItem(this.KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      // Storage unavailable — silently fail, keep in-memory state
    }
  },

  getLinks() {
    try {
      const data = localStorage.getItem(this.KEYS.LINKS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveLinks(links) {
    try {
      localStorage.setItem(this.KEYS.LINKS, JSON.stringify(links));
    } catch (e) {
      // Storage unavailable — silently fail, keep in-memory state
    }
  },
};

// ============================================================
// ThemeManager
// ============================================================
const ThemeManager = {
  STORAGE_KEY: 'todo-life-dashboard-theme',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    // Default: light (card putih). Dark mode diaktifkan saat saved === 'dark'
    if (saved === 'dark') this.applyDark();
    else this.applyLight();

    const btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', () => this.toggle());
  },

  applyLight() {
    document.body.classList.remove('dark-mode');
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = '🌙';
    try { localStorage.setItem(this.STORAGE_KEY, 'light'); } catch(e) {}
  },

  applyDark() {
    document.body.classList.add('dark-mode');
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = '☀️';
    try { localStorage.setItem(this.STORAGE_KEY, 'dark'); } catch(e) {}
  },

  toggle() {
    if (document.body.classList.contains('dark-mode')) this.applyLight();
    else this.applyDark();
  },
};

// ============================================================
// GreetingWidget
// ============================================================
const GreetingWidget = {
  intervalId: null,
  NAME_KEY: 'todo-life-dashboard-username',

  getName() {
    try { return localStorage.getItem(this.NAME_KEY) || ''; } catch(e) { return ''; }
  },

  saveName(name) {
    try { localStorage.setItem(this.NAME_KEY, name); } catch(e) {}
  },

  formatTime(date) {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  },

  formatDate(date) {
    const days   = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const dayName = days[date.getDay()];
    const day     = date.getDate();
    const month   = months[date.getMonth()];
    const year    = date.getFullYear();
    return `${dayName}, ${day} ${month} ${year}`;
  },

  getGreeting(hour) {
    if (hour >= 5  && hour <= 11) return 'Good Morning ☀️';
    if (hour >= 12 && hour <= 14) return 'Good Afternoon 🌤️';
    if (hour >= 15 && hour <= 17) return 'Good Evening 🌅';
    return 'Good Night 🌙';
  },

  getTimeTheme(hour) {
    if (hour === 4)                       return 'dawn';
    if (hour >= 5  && hour <= 11)         return 'morning';
    if (hour >= 12 && hour <= 14)         return 'afternoon';
    if (hour >= 15 && hour <= 17)         return 'evening';
    if (hour >= 18 && hour <= 20)         return 'dusk';
    return 'night'; // 21–03
  },

  applyTimeTheme(hour) {
    document.body.setAttribute('data-time-theme', this.getTimeTheme(hour));
  },

  render() {
    const now    = new Date();
    const hour   = now.getHours();
    const timeEl = document.getElementById('greeting-time');
    const dateEl = document.getElementById('greeting-date');
    const textEl = document.getElementById('greeting-text');
    if (timeEl) timeEl.textContent = this.formatTime(now);
    if (dateEl) dateEl.textContent = this.formatDate(now);
    if (textEl) {
      const greeting = this.getGreeting(hour);
      const name     = this.getName();
      textEl.textContent = name ? `${greeting}, ${name}!` : greeting;
    }
    // Update background theme every render (every minute)
    this.applyTimeTheme(hour);
  },

  init() {
    this.render();
    this.intervalId = setInterval(() => this.render(), 60000);

    // Pre-fill input with saved name
    const nameInput = document.getElementById('greeting-name-input');
    if (nameInput) nameInput.value = this.getName();

    // Save button
    const saveBtn = document.getElementById('greeting-name-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (nameInput) {
          this.saveName(nameInput.value.trim());
          this.render();
        }
      });
    }

    // Enter key on name input
    if (nameInput) {
      nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.saveName(nameInput.value.trim());
          this.render();
          nameInput.blur();
        }
      });
    }
  },
};

// ============================================================
// FocusTimer
// ============================================================
const FocusTimer = {
  DURATION: 25 * 60, // 1500 seconds
  timeLeft: 25 * 60,
  intervalId: null,
  isRunning: false,

  render() {
    const min     = String(Math.floor(this.timeLeft / 60)).padStart(2, '0');
    const sec     = String(this.timeLeft % 60).padStart(2, '0');
    const display = document.getElementById('timer-display');
    if (display) display.textContent = `${min}:${sec}`;
  },

  updateButtons() {
    const startBtn = document.getElementById('timer-start');
    const stopBtn  = document.getElementById('timer-stop');
    if (startBtn) startBtn.disabled = this.isRunning;
    if (stopBtn)  stopBtn.disabled  = !this.isRunning;
  },

  onComplete() {
    const notification = document.getElementById('timer-notification');
    const display      = document.getElementById('timer-display');
    if (notification) notification.classList.remove('hidden');
    if (display)      display.classList.add('timer__display--done');
  },

  tick() {
    if (this.timeLeft > 0) {
      this.timeLeft -= 1;
      this.render();
    }
    if (this.timeLeft === 0) {
      this.stop();
      this.onComplete();
    }
  },

  start() {
    if (this.isRunning || this.timeLeft === 0) return;
    const notification = document.getElementById('timer-notification');
    if (notification) notification.classList.add('hidden');
    const display = document.getElementById('timer-display');
    if (display) display.classList.remove('timer__display--done');
    this.isRunning = true;
    this.intervalId = setInterval(() => this.tick(), 1000);
    this.updateButtons();
  },

  stop() {
    if (!this.isRunning) return;
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isRunning  = false;
    this.updateButtons();
  },

  reset() {
    this.stop();
    this.timeLeft = this.DURATION;
    this.render();
    const notification = document.getElementById('timer-notification');
    if (notification) notification.classList.add('hidden');
    const display = document.getElementById('timer-display');
    if (display) display.classList.remove('timer__display--done');
    this.updateButtons();
  },

  init() {
    this.render();
    this.updateButtons();
    const startBtn = document.getElementById('timer-start');
    const stopBtn  = document.getElementById('timer-stop');
    const resetBtn = document.getElementById('timer-reset');
    if (startBtn) startBtn.addEventListener('click', () => this.start());
    if (stopBtn)  stopBtn.addEventListener('click',  () => this.stop());
    if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
  },
};

// ============================================================
// TodoList
// ============================================================
const TodoList = {
  tasks: [],
  _dupTimeout: null,

  save() {
    StorageManager.saveTasks(this.tasks);
  },

  addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Prevent duplicate tasks (case-insensitive)
    const isDuplicate = this.tasks.some(
      t => t.text.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      this.showDuplicateWarning(trimmed);
      return;
    }

    this.tasks.push({ id: Date.now().toString(), text: trimmed, done: false });
    this.save();
    this.renderAll();
  },

  showDuplicateWarning(text) {
    const input = document.getElementById('todo-input');
    if (!input) return;

    // Highlight input as error
    input.classList.add('todo__input--duplicate');
    input.setCustomValidity('Task already exists!');

    // Show inline warning
    let warning = document.getElementById('todo-duplicate-warning');
    if (!warning) {
      warning = document.createElement('p');
      warning.id = 'todo-duplicate-warning';
      warning.className = 'todo__duplicate-warning';
      const form = document.getElementById('todo-form');
      if (form) form.insertAdjacentElement('afterend', warning);
    }
    warning.textContent = `⚠️ "${text}" is already in your list!`;
    warning.classList.remove('hidden');

    // Auto-hide after 2.5s
    clearTimeout(this._dupTimeout);
    this._dupTimeout = setTimeout(() => {
      if (warning) warning.classList.add('hidden');
      if (input) {
        input.classList.remove('todo__input--duplicate');
        input.setCustomValidity('');
      }
    }, 2500);
  },

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.done = !task.done;
      this.save();
      this.renderAll();
    }
  },

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.save();
    this.renderAll();
  },

  updateTask(id, newText) {
    const trimmed = newText.trim();
    if (!trimmed) return;
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.text = trimmed;
      this.save();
      this.renderAll();
    }
  },

  renderItem(task) {
    const li = document.createElement('li');
    li.className = 'todo__item' + (task.done ? ' todo__item--done' : '');
    li.dataset.id = task.id;

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo__checkbox';
    checkbox.checked = task.done;
    checkbox.setAttribute('aria-label', 'Mark as done');
    checkbox.addEventListener('change', () => this.toggleTask(task.id));

    // Text span
    const span = document.createElement('span');
    span.className = 'todo__text';
    span.textContent = task.text;

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.type      = 'button';
    editBtn.className = 'todo__btn todo__btn--edit';
    editBtn.textContent = '✏️';
    editBtn.setAttribute('aria-label', 'Edit task');
    editBtn.addEventListener('click', () => this.enterEditMode(li, task));

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.type      = 'button';
    deleteBtn.className = 'todo__btn todo__btn--delete';
    deleteBtn.textContent = '🗑️';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

    li.append(checkbox, span, editBtn, deleteBtn);
    return li;
  },

  enterEditMode(li, task) {
    li.innerHTML = '';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'todo__edit-input';
    input.value = task.text;

    const confirmBtn = document.createElement('button');
    confirmBtn.type       = 'button';
    confirmBtn.className  = 'todo__btn todo__btn--confirm';
    confirmBtn.textContent = '✔️';
    confirmBtn.setAttribute('aria-label', 'Confirm edit');

    const cancelBtn = document.createElement('button');
    cancelBtn.type       = 'button';
    cancelBtn.className  = 'todo__btn todo__btn--cancel';
    cancelBtn.textContent = '✖️';
    cancelBtn.setAttribute('aria-label', 'Cancel edit');

    const confirm = () => {
      const newText = input.value.trim();
      if (newText) this.updateTask(task.id, newText);
      else this.renderAll(); // revert
    };

    confirmBtn.addEventListener('click', confirm);
    cancelBtn.addEventListener('click', () => this.renderAll());
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter')  confirm();
      if (e.key === 'Escape') this.renderAll();
    });

    li.append(input, confirmBtn, cancelBtn);
    input.focus();
  },

  renderAll() {
    const list = document.getElementById('todo-list');
    if (!list) return;
    list.innerHTML = '';
    this.tasks.forEach(task => list.appendChild(this.renderItem(task)));
  },

  init() {
    this.tasks = StorageManager.getTasks();
    this.renderAll();

    const form  = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input && input.value.trim()) {
          this.addTask(input.value);
          input.value = '';
        } else if (input) {
          input.focus();
        }
      });
    }
  },
};

// ============================================================
// QuickLinks
// ============================================================
const QuickLinks = {
  links: [],

  save() {
    StorageManager.saveLinks(this.links);
  },

  addLink(label, url) {
    const trimLabel = label.trim();
    let   trimUrl   = url.trim();
    if (!trimLabel || !trimUrl) return;
    // Auto-prefix https://
    if (!/^https?:\/\//i.test(trimUrl)) {
      trimUrl = 'https://' + trimUrl;
    }
    this.links.push({ id: Date.now().toString(), label: trimLabel, url: trimUrl });
    this.save();
    this.renderAll();
  },

  deleteLink(id) {
    this.links = this.links.filter(l => l.id !== id);
    this.save();
    this.renderAll();
  },

  renderItem(link) {
    const wrapper = document.createElement('li');
    wrapper.className = 'link__item';

    const anchor = document.createElement('a');
    anchor.href   = link.url;
    anchor.target = '_blank';
    anchor.rel    = 'noopener noreferrer';
    anchor.className   = 'link__btn';
    anchor.textContent = link.label;
    anchor.setAttribute('aria-label', `Open ${link.label} in new tab`);

    const deleteBtn = document.createElement('button');
    deleteBtn.type        = 'button';
    deleteBtn.className   = 'link__delete';
    deleteBtn.textContent = '×';
    deleteBtn.setAttribute('aria-label', `Remove ${link.label}`);
    deleteBtn.addEventListener('click', () => this.deleteLink(link.id));

    wrapper.append(anchor, deleteBtn);
    return wrapper;
  },

  renderAll() {
    const grid = document.getElementById('links-grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (this.links.length === 0) {
      const empty = document.createElement('li');
      empty.className   = 'links__empty';
      empty.setAttribute('role', 'listitem');
      empty.textContent = 'No links yet. Add your favourite websites!';
      grid.appendChild(empty);
      return;
    }
    this.links.forEach(link => grid.appendChild(this.renderItem(link)));
  },

  init() {
    this.links = StorageManager.getLinks();
    this.renderAll();

    const form       = document.getElementById('links-form');
    const labelInput = document.getElementById('links-label');
    const urlInput   = document.getElementById('links-url');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const label = labelInput ? labelInput.value : '';
        const url   = urlInput   ? urlInput.value   : '';
        if (label.trim() && url.trim()) {
          this.addLink(label, url);
          if (labelInput) labelInput.value = '';
          if (urlInput)   urlInput.value   = '';
        }
      });
    }
  },
};

// ============================================================
// Initialisation
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  GreetingWidget.init();
  FocusTimer.init();
  TodoList.init();
  QuickLinks.init();
});
