# Design Document — To-Do List Life Dashboard

## Overview

To-Do List Life Dashboard adalah aplikasi web satu halaman (Single Page Application) statis yang dibangun sepenuhnya dengan HTML, CSS, dan Vanilla JavaScript. Tidak ada framework, tidak ada build step, tidak ada backend.

**Arsitektur Teknis:**

```
Browser
  └── index.html  (entry point)
        ├── css/style.css     (semua styling)
        └── js/app.js         (semua logika)
```

Aplikasi bekerja langsung via `file://` maupun web server statis sederhana. Seluruh state disimpan di **Local Storage** browser sehingga data persisten tanpa server. Kode JavaScript menggunakan **Module Pattern** (object literal) agar setiap widget memiliki namespace tersendiri, mencegah polusi global scope.

---

## Architecture

### File Structure

```
CodingCamp-15June26-putuyogi/
├── index.html          ← satu-satunya file HTML (entry point)
├── css/
│   └── style.css       ← semua styling dashboard
├── js/
│   └── app.js          ← semua logika JavaScript
└── README.md
```

- Tidak ada subdirektori tambahan.
- Tidak ada dependensi eksternal (CDN, npm, dsb.).
- Semua asset dikelola secara lokal.

### JavaScript Module Architecture

Seluruh kode dibungkus dalam satu file `js/app.js` menggunakan **object literal module pattern**. Tidak ada variabel global yang mencemari `window`.

```js
const StorageManager = { /* ... */ };
const GreetingWidget = { /* ... */ };
const FocusTimer     = { /* ... */ };
const TodoList       = { /* ... */ };
const QuickLinks     = { /* ... */ };

document.addEventListener('DOMContentLoaded', () => {
  GreetingWidget.init();
  FocusTimer.init();
  TodoList.init();
  QuickLinks.init();
});
```

Tidak menggunakan ES Modules (`import/export`) agar bekerja langsung via `file://` tanpa web server.

### CSS Architecture

- **Satu file CSS** (`css/style.css`) tanpa preprocessor.
- Menggunakan **CSS Custom Properties** (variabel CSS) di `:root` untuk konsistensi tema.
- Layout dashboard menggunakan **CSS Grid** (grid dua kolom), layout internal tiap widget menggunakan **Flexbox**.
- Nama kelas mengikuti konvensi **BEM** secara longgar untuk keterbacaan.

```css
:root {
  /* Warna */
  --color-bg:          #1a1a2e;
  --color-surface:     #16213e;
  --color-primary:     #0f3460;
  --color-accent:      #e94560;
  --color-text:        #eaeaea;
  --color-text-muted:  #a0a0b0;
  --color-done:        #4caf50;

  /* Tipografi */
  --font-family:       'Segoe UI', system-ui, sans-serif;
  --font-size-base:    16px;
  --font-size-large:   clamp(2.5rem, 6vw, 4rem);

  /* Spacing */
  --spacing-sm:   8px;
  --spacing-md:   16px;
  --spacing-lg:   24px;

  /* Border & Shadow */
  --border-radius:  12px;
  --box-shadow:     0 4px 20px rgba(0, 0, 0, 0.3);
}
```

Layout grid dashboard:

```css
.dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  min-height: 100vh;
}

/* Responsif: 1 kolom di layar kecil */
@media (max-width: 768px) {
  .dashboard { grid-template-columns: 1fr; }
}
```

### HTML Structure

Satu file `index.html` dengan empat section widget utama.

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Life Dashboard</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <div class="dashboard">

    <!-- Widget 1: Greeting -->
    <section class="widget widget--greeting" id="widget-greeting">
      <p class="greeting__time" id="greeting-time">HH:MM</p>
      <p class="greeting__date" id="greeting-date">Hari, DD Bulan YYYY</p>
      <h1 class="greeting__text" id="greeting-text">Selamat Pagi</h1>
    </section>

    <!-- Widget 2: Focus Timer -->
    <section class="widget widget--timer" id="widget-timer">
      <h2 class="widget__title">Focus Timer</h2>
      <p class="timer__display" id="timer-display">25:00</p>
      <div class="timer__controls">
        <button id="timer-start">Start</button>
        <button id="timer-stop" disabled>Stop</button>
        <button id="timer-reset">Reset</button>
      </div>
      <p class="timer__notification hidden" id="timer-notification">
        ✅ Sesi selesai! Saatnya istirahat.
      </p>
    </section>

    <!-- Widget 3: To-Do List -->
    <section class="widget widget--todo" id="widget-todo">
      <h2 class="widget__title">To-Do List</h2>
      <form class="todo__form" id="todo-form">
        <input type="text" id="todo-input" placeholder="Tambah tugas baru..." autocomplete="off" />
        <button type="submit">Tambah</button>
      </form>
      <ul class="todo__list" id="todo-list"></ul>
    </section>

    <!-- Widget 4: Quick Links -->
    <section class="widget widget--links" id="widget-links">
      <h2 class="widget__title">Quick Links</h2>
      <form class="links__form" id="links-form">
        <input type="text" id="links-label" placeholder="Label (contoh: GitHub)" />
        <input type="url"  id="links-url"   placeholder="URL (contoh: https://...)" />
        <button type="submit">Tambah</button>
      </form>
      <div class="links__grid" id="links-grid"></div>
    </section>

  </div>
  <script src="js/app.js"></script>
</body>
</html>
```

### Browser Compatibility

**Target Browser:** Chrome 90+, Firefox 88+, Edge 90+, Safari 14+

| Fitur | Dukungan |
|---|---|
| `localStorage` | Chrome 4+, Firefox 3.5+, Edge 12+, Safari 4+ |
| CSS Grid | Chrome 57+, Firefox 52+, Edge 16+, Safari 10.1+ |
| CSS Custom Properties | Chrome 49+, Firefox 31+, Edge 15+, Safari 9.1+ |
| `setInterval` / `clearInterval` | Semua browser modern |
| `Date` object | Semua browser modern |
| `JSON.parse` / `JSON.stringify` | Semua browser modern |

Tidak menggunakan fitur eksperimental. Tidak memerlukan polyfill. Notifikasi timer menggunakan perubahan DOM visual (bukan Notification API) agar konsisten di semua browser.

---

## Components and Interfaces

### StorageManager

Modul utilitas terpusat untuk semua operasi Local Storage.

```js
const StorageManager = {
  KEYS: {
    TASKS: 'todo-life-dashboard-tasks',
    LINKS: 'todo-life-dashboard-links',
  },
  getTasks()       → Task[]        // baca dari localStorage
  saveTasks(tasks) → void          // tulis ke localStorage
  getLinks()       → Link[]        // baca dari localStorage
  saveLinks(links) → void          // tulis ke localStorage
};
```

Fallback: jika key tidak ada, `getItem()` mengembalikan `null` dan fallback `'[]'` memastikan `JSON.parse()` selalu menghasilkan array kosong.

### GreetingWidget

Menampilkan waktu real-time, tanggal, dan sapaan. Update setiap menit via `setInterval`.

```
GreetingWidget
  ├── init()          → render pertama kali + mulai setInterval 60 detik
  ├── render()        → update DOM: waktu, tanggal, sapaan
  ├── formatTime(d)   → "HH:MM" dengan padStart(2, '0')
  ├── formatDate(d)   → "Senin, 16 Juni 2025" (locale id-ID)
  └── getGreeting(h)  → string sapaan berdasarkan jam
```

Logika sapaan:
- 05–11 → "Selamat Pagi"
- 12–14 → "Selamat Siang"
- 15–17 → "Selamat Sore"
- 18–04 → "Selamat Malam"

### FocusTimer

Countdown timer 25 menit. State timer (running/stopped) disimpan di memori, tidak perlu persisten.

```
FocusTimer
  ├── init()           → pasang event listener tombol
  ├── start()          → mulai setInterval 1 detik, updateButtons()
  ├── stop()           → clearInterval, pertahankan nilai, updateButtons()
  ├── reset()          → clearInterval, remaining = 1500, render(), updateButtons()
  ├── tick()           → remaining--, render(); jika 0 → stop() + onComplete()
  ├── render()         → format MM:SS → #timer-display
  ├── onComplete()     → hapus class 'hidden' dari #timer-notification
  └── updateButtons()  → toggle disabled: Start↔Stop berdasarkan intervalId
```

### TodoList

CRUD penuh untuk task, berkomunikasi dengan StorageManager.

```
TodoList
  ├── init()              → load storage, renderAll(), pasang listener form
  ├── addTask(text)       → push task baru, save(), renderAll(), kosongkan input
  ├── editTask(id, text)  → update task.text, save(), renderAll()
  ├── toggleTask(id)      → flip task.done, save(), renderAll()
  ├── deleteTask(id)      → filter tasks, save(), renderAll()
  ├── renderAll()         → kosongkan #todo-list, renderItem() tiap task
  ├── renderItem(task)    → buat <li>: checkbox + teks + tombol edit + hapus
  └── save()              → StorageManager.saveTasks(this.tasks)
```

Event Handling TodoList:

| Event | Target | Handler |
|---|---|---|
| `submit` | `#todo-form` | `addTask()` |
| `change` | checkbox task | `toggleTask(id)` |
| `click` | tombol edit | masuk mode edit inline |
| `click` | tombol hapus | `deleteTask(id)` |

### QuickLinks

Manajemen link favorit, berkomunikasi dengan StorageManager.

```
QuickLinks
  ├── init()               → load storage, renderAll(), pasang listener form
  ├── addLink(label, url)  → validasi, auto-prefix https://, push, save(), renderAll()
  ├── deleteLink(id)       → filter links, save(), renderAll()
  ├── renderAll()          → kosongkan #links-grid, renderItem() tiap link
  ├── renderItem(link)     → buat <div>: <a target="_blank"> + tombol hapus
  └── save()               → StorageManager.saveLinks(this.links)
```

Event Handling QuickLinks:

| Event | Target | Handler |
|---|---|---|
| `submit` | `#links-form` | `addLink()` |
| `click` | tombol hapus link | `deleteLink(id)` |
| `click` | tombol link (`<a>`) | buka URL di tab baru |

---

## Data Models

### Task

```json
{
  "id":   "string",   // Date.now().toString() — unique identifier
  "text": "string",   // deskripsi tugas
  "done": false       // boolean: status selesai (true) / belum (false)
}
```

**Contoh:**
```json
{ "id": "1718500000001", "text": "Belajar CSS Grid", "done": false }
```

### Link

```json
{
  "id":    "string",  // Date.now().toString() — unique identifier
  "label": "string",  // teks yang ditampilkan di tombol pintasan
  "url":   "string"   // URL lengkap (selalu diawali https:// atau http://)
}
```

**Contoh:**
```json
{ "id": "1718500001001", "label": "GitHub", "url": "https://github.com" }
```

### Local Storage Schema

| Kunci | Tipe Nilai | Contoh |
|---|---|---|
| `todo-life-dashboard-tasks` | JSON array of Task | `[{"id":"...","text":"...","done":false}]` |
| `todo-life-dashboard-links` | JSON array of Link | `[{"id":"...","label":"...","url":"..."}]` |

---

## Correctness Properties

### Property 1: Greeting time range

`getGreeting(hour)` harus mengembalikan salah satu dari empat string sapaan yang valid (`"Selamat Pagi"`, `"Selamat Siang"`, `"Selamat Sore"`, `"Selamat Malam"`) untuk setiap nilai jam 0–23 tanpa exception.

**Validates: Requirements 2.3, 2.4, 2.5, 2.6**

### Property 2: Timer tidak pernah negatif

`remaining` tidak pernah turun di bawah 0. Setelah `reset()` dipanggil, `remaining` selalu kembali tepat ke 1500 (25 × 60 detik).

**Validates: Requirements 3.1, 3.5**

### Property 3: Task ID unik

Dua task yang ditambahkan dalam waktu berbeda selalu memiliki `id` berbeda karena menggunakan `Date.now().toString()` sebagai identifier.

**Validates: Requirements 4.2**

### Property 4: Persistensi tasks round-trip

Setelah `saveTasks(tasks)` dipanggil, memanggil `getTasks()` selalu mengembalikan array yang identik secara struktural dengan array yang disimpan.

**Validates: Requirements 8.1, 8.3**

### Property 5: Persistensi links round-trip

Setelah `saveLinks(links)` dipanggil, memanggil `getLinks()` selalu mengembalikan array yang identik secara struktural dengan array yang disimpan.

**Validates: Requirements 12.1, 12.3**

### Property 6: Auto-prefix URL

Jika URL yang dimasukkan tidak diawali `http://` atau `https://`, `addLink()` selalu menambahkan prefix `https://` sebelum menyimpan ke storage.

**Validates: Requirements 9.3**

### Property 7: Input kosong tidak mengubah state

`addTask('')` dan `addLink('', '')` tidak pernah menambahkan elemen baru ke array tasks/links maupun memicu perubahan di Local Storage.

**Validates: Requirements 4.4, 9.4**

### Property 8: Toggle task idempoten ganda

Memanggil `toggleTask(id)` dua kali berturut-turut pada task yang sama selalu mengembalikan status `done` task tersebut ke nilai semula (idempoten dalam dua langkah).

**Validates: Requirements 6.2, 6.3**

---

## Error Handling

| Skenario | Penanganan |
|---|---|
| Local Storage kosong / belum ada data | Fallback `'[]'` pada `JSON.parse()` → array kosong, tidak ada error |
| `localStorage` tidak tersedia (private mode sebagian browser) | Wrap `getItem`/`setItem` dalam `try/catch`; fallback ke array in-memory |
| Input task kosong | Guard `if (!text) return` di `addTask()` |
| Input link kosong (label atau URL) | Guard `if (!label \|\| !url) return` di `addLink()` |
| URL tanpa prefix | Auto-prefix `https://` sebelum menyimpan |
| Timer sudah mencapai 00:00 | `tick()` memanggil `stop()` sebelum `remaining` bisa negatif |

---

## Testing Strategy

Karena proyek ini adalah file statis murni tanpa build step, pengujian dilakukan secara **manual** menggunakan browser DevTools.

### Skenario Uji Manual

**Greeting Widget**
- [ ] Buka dashboard, verifikasi waktu tampil dalam format HH:MM
- [ ] Verifikasi tanggal tampil dalam format "Hari, DD Bulan YYYY"
- [ ] Ubah jam sistem ke 06:00 → verifikasi "Selamat Pagi"
- [ ] Ubah jam sistem ke 13:00 → verifikasi "Selamat Siang"
- [ ] Ubah jam sistem ke 16:00 → verifikasi "Selamat Sore"
- [ ] Ubah jam sistem ke 20:00 → verifikasi "Selamat Malam"

**Focus Timer**
- [ ] Klik Start → timer mulai mundur, tombol Start disabled
- [ ] Klik Stop → timer berhenti, nilai tersisa dipertahankan
- [ ] Klik Reset → timer kembali ke 25:00
- [ ] Biarkan timer berjalan hingga 00:00 → notifikasi visual muncul

**To-Do List**
- [ ] Tambah task → tampil di daftar, tersimpan di Local Storage
- [ ] Edit task → teks berubah, tersimpan
- [ ] Centang task → teks dicoret, status `done: true`
- [ ] Hapus task → hilang dari daftar dan Local Storage
- [ ] Refresh halaman → semua task masih ada

**Quick Links**
- [ ] Tambah link dengan URL lengkap → tombol muncul
- [ ] Tambah link tanpa `https://` → prefix otomatis ditambahkan
- [ ] Klik tombol link → URL terbuka di tab baru
- [ ] Hapus link → tombol hilang dari tampilan dan Local Storage
- [ ] Refresh halaman → semua link masih ada
