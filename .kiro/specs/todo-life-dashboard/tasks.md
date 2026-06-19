# Implementation Plan: To-Do List Life Dashboard

## Overview

Implementasi lengkap To-Do List Life Dashboard berdasarkan `requirements.md`. Seluruh aplikasi dibangun dengan HTML, CSS, dan Vanilla JavaScript murni — tanpa framework eksternal, tanpa backend server. Struktur file terdiri dari `index.html` di root, `css/style.css`, dan `js/app.js` dengan module pattern.

## Task Dependency Graph

```json
{
  "waves": [
    {
      "wave": 1,
      "tasks": ["1"],
      "description": "Setup struktur proyek — fondasi semua task berikutnya"
    },
    {
      "wave": 2,
      "tasks": ["2"],
      "description": "Layout dashboard — membutuhkan file dari wave 1"
    },
    {
      "wave": 3,
      "tasks": ["3"],
      "description": "StorageManager — harus selesai sebelum widget yang butuh persistensi"
    },
    {
      "wave": 4,
      "tasks": ["4", "5", "6", "7"],
      "description": "Implementasi keempat widget secara paralel setelah StorageManager siap"
    },
    {
      "wave": 5,
      "tasks": ["8"],
      "description": "Polish dan verifikasi end-to-end setelah semua widget selesai"
    }
  ]
}
```

## Tasks

- [x] 1. Setup struktur proyek
  - [x] 1.1 Buat file `index.html` dengan HTML boilerplate lengkap (doctype, charset UTF-8, viewport meta, title), serta tag `<link>` ke `css/style.css` dan tag `<script defer>` ke `js/app.js`
    _Requirements: R1, R13_
  - [x] 1.2 Buat file `css/style.css` dengan CSS variables di `:root` (warna, spacing, radius, shadow) dan reset/base styles (box-sizing, margin, font-family)
    _Requirements: R1, R13_
  - [x] 1.3 Buat file `js/app.js` dengan struktur module pattern yang memuat deklarasi objek: `StorageManager`, `GreetingWidget`, `FocusTimer`, `TodoList`, `QuickLinks`, dan blok inisialisasi `DOMContentLoaded`
    _Requirements: R13_

- [x] 2. Implementasi layout dashboard (`index.html` + `css/style.css`)
  - [x] 2.1 Buat grid layout dashboard menggunakan CSS Grid 2 kolom dengan 4 area widget section di dalam elemen `<main class="dashboard">`
    _Requirements: R1_
  - [x] 2.2 Tambah struktur HTML untuk semua 4 widget: `#greeting-widget`, `#focus-timer`, `#todo-list`, dan `#quick-links` lengkap dengan heading dan elemen kontainer konten
    _Requirements: R1, R2, R3, R4, R9_
  - [x] 2.3 Style widget cards dengan `background`, `border-radius`, `box-shadow`, dan `padding` yang konsisten menggunakan CSS variables
    _Requirements: R1_
  - [x] 2.4 Implementasi responsive layout menggunakan media query — 1 kolom di bawah 768px agar dapat digunakan di tablet dan layar kecil
    _Requirements: R1_

- [x] 3. Implementasi StorageManager (`js/app.js`)
  - [x] 3.1 Implementasi `StorageManager.getTasks()` yang membaca dan mem-parse JSON dari `localStorage` menggunakan kunci `todo-life-dashboard-tasks`, serta `saveTasks(tasks)` yang menyimpan array tasks sebagai JSON
    _Requirements: R8_
  - [x] 3.2 Implementasi `StorageManager.getLinks()` yang membaca dan mem-parse JSON dari `localStorage` menggunakan kunci `todo-life-dashboard-links`, serta `saveLinks(links)` yang menyimpan array links sebagai JSON
    _Requirements: R12_
  - [x] 3.3 Tambah blok `try/catch` pada setiap operasi `localStorage` dengan fallback ke array kosong `[]` ketika LocalStorage tidak tersedia atau melempar error
    _Requirements: R8, R12_

- [x] 4. Implementasi Greeting Widget (`js/app.js` + `css/style.css`)
  - [x] 4.1 Implementasi `GreetingWidget.formatTime()` yang mengembalikan string HH:MM dari Date saat ini, `formatDate()` yang mengembalikan format "Hari, DD Bulan YYYY" dalam Bahasa Indonesia, dan `getGreeting()` yang mengembalikan teks sapaan sesuai jam (Pagi 05–11, Siang 12–14, Sore 15–17, Malam 18–04)
    _Requirements: R2_
  - [x] 4.2 Implementasi `GreetingWidget.render()` yang memperbarui elemen DOM waktu, tanggal, dan sapaan, serta `init()` yang memanggil `render()` saat pertama kali lalu menggunakan `setInterval` 60.000 ms untuk pembaruan otomatis setiap menit
    _Requirements: R2_
  - [x] 4.3 Style Greeting Widget: tampilan jam dengan font besar dan menonjol, tanggal dengan ukuran sedang, dan teks sapaan dengan warna aksen — semua terpusat secara vertikal dalam widget card
    _Requirements: R2_

- [x] 5. Implementasi Focus Timer (`js/app.js` + `css/style.css`)
  - [x] 5.1 Implementasi `FocusTimer.start()` yang memulai `setInterval` 1 detik, `stop()` yang membersihkan interval, `reset()` yang menghentikan timer dan mengembalikan `timeLeft` ke 1500 detik (25:00), serta `tick()` yang mendekremen `timeLeft` dan memanggil `render()`
    _Requirements: R3_
  - [x] 5.2 Implementasi `FocusTimer.render()` yang memformat `timeLeft` ke MM:SS dan memperbarui elemen DOM display, serta `onComplete()` yang dipanggil saat `timeLeft === 0` untuk menampilkan notifikasi visual (contoh: mengubah warna display atau menampilkan pesan "Sesi selesai!")
    _Requirements: R3_
  - [x] 5.3 Implementasi `FocusTimer.updateButtons()` yang menonaktifkan tombol Start ketika timer berjalan (`isRunning === true`) dan menonaktifkan tombol Stop ketika timer tidak berjalan, serta `init()` yang memasang event listener untuk tombol Start, Stop, dan Reset
    _Requirements: R3_
  - [x] 5.4 Style Focus Timer: display MM:SS dengan font monospace berukuran besar, tiga tombol kontrol sejajar horizontal, dan state notifikasi selesai (warna berbeda atau animasi pulse)
    _Requirements: R3_

- [x] 6. Implementasi To-Do List (`js/app.js` + `css/style.css`)
  - [x] 6.1 Implementasi `TodoList.addTask(text)` yang membuat objek task baru `{ id, text, done: false }` dan menambahkannya ke array tasks, `save()` yang memanggil `StorageManager.saveTasks()`, `renderAll()` yang mengosongkan dan me-render ulang seluruh daftar, serta `renderItem(task)` yang membuat elemen DOM untuk satu task
    _Requirements: R4, R8_
  - [x] 6.2 Implementasi `TodoList.toggleTask(id)` yang membalik nilai `done` pada task yang sesuai lalu memanggil `save()` dan `renderAll()`, serta `deleteTask(id)` yang menghapus task dari array lalu memanggil `save()` dan `renderAll()`
    _Requirements: R6, R7_
  - [x] 6.3 Implementasi inline edit: `editTask(id)` yang mengganti elemen teks task dengan input field yang sudah terisi, tombol konfirmasi yang memperbarui `task.text` (hanya jika input tidak kosong) dan keluar dari mode edit, serta tombol batal yang mengembalikan tampilan normal
    _Requirements: R5_
  - [x] 6.4 Implementasi `TodoList.init()` yang membaca tasks dari `StorageManager.getTasks()` saat inisialisasi, memanggil `renderAll()`, dan memasang event listener pada form input untuk menambah task melalui tombol atau tombol Enter — mencegah submit jika input kosong dan mengosongkan input setelah berhasil ditambah
    _Requirements: R4, R8_
  - [x] 6.5 Style Todo List: form input dengan tombol tambah sejajar, list items dengan checkbox dan teks di kiri serta tombol edit/hapus di kanan, state `done` dengan teks tercoret (`text-decoration: line-through`) dan warna berbeda, serta transisi saat status berubah
    _Requirements: R4, R5, R6, R7_

- [x] 7. Implementasi Quick Links (`js/app.js` + `css/style.css`)
  - [x] 7.1 Implementasi `QuickLinks.addLink(label, url)` yang memvalidasi bahwa label dan url tidak kosong, menambahkan prefix `https://` secara otomatis jika url tidak diawali `http://` atau `https://`, lalu membuat objek link `{ id, label, url }` dan menambahkannya ke array links
    _Requirements: R9_
  - [x] 7.2 Implementasi `QuickLinks.deleteLink(id)` yang menghapus link dari array lalu memanggil `save()` dan `renderAll()`, `renderAll()` yang mengosongkan dan me-render ulang grid link, serta `renderItem(link)` yang membuat elemen tombol pintasan dengan label dan atribut `href` yang dibuka di tab baru (`target="_blank"`)
    _Requirements: R10, R11_
  - [x] 7.3 Implementasi `QuickLinks.init()` yang membaca links dari `StorageManager.getLinks()` saat inisialisasi, memanggil `renderAll()`, dan memasang event listener pada form input label dan URL untuk menambah link — mencegah submit jika salah satu field kosong
    _Requirements: R9, R12_
  - [x] 7.4 Style Quick Links: grid tombol pintasan (2–3 kolom, `auto-fill`), setiap tombol dengan posisi `relative` agar tombol hapus kecil dapat diposisikan sebagai overlay di sudut, serta warna tombol yang menarik dan mudah diklik
    _Requirements: R9, R10, R11_

- [x] 8. Polish dan final touches (`css/style.css`)
  - [x] 8.1 Tambah transisi dan animasi halus untuk semua interaksi: `transition` pada hover tombol dan card, efek focus pada input field, dan animasi masuk item baru di todo list dan quick links
    _Requirements: R1_
  - [x] 8.2 Verifikasi semua fitur bekerja secara end-to-end: tambah/edit/hapus/toggle task, tambah/hapus link, timer start/stop/reset/complete, dan greeting memperbarui tiap menit
    _Requirements: R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12_
  - [x] 8.3 Pastikan tidak ada `console.error` saat aplikasi dibuka via `file://` — periksa semua selector DOM tidak null sebelum diakses dan semua `localStorage` operation dalam try/catch
    _Requirements: R1, R13_

## Notes

- Semua task menggunakan Vanilla JavaScript (ES6+) — tidak boleh ada import library eksternal.
- `StorageManager` (Task 3) harus selesai sebelum mengimplementasi fitur yang bergantung pada persistensi (Task 6, 7).
- Gunakan `Date.now()` atau `crypto.randomUUID()` untuk generate ID unik pada task dan link.
- Saat testing via `file://`, pastikan tidak ada request ke URL eksternal yang menyebabkan CORS error.
- Setiap `setInterval` harus disimpan dalam variabel agar bisa di-`clearInterval` dengan benar.
