# Requirements Document

## Introduction

To-Do List Life Dashboard adalah sebuah web app dashboard satu halaman yang ringan dan intuitif. Dashboard ini membantu pengguna mengelola aktivitas harian mereka melalui empat widget utama: Greeting (salam dan waktu), Focus Timer (timer Pomodoro 25 menit), To-Do List (manajemen tugas), dan Quick Links (akses cepat ke website favorit). Seluruh data disimpan di browser menggunakan Local Storage tanpa memerlukan backend server. Aplikasi dibangun dengan HTML, CSS, dan Vanilla JavaScript murni agar tetap sederhana, cepat, dan mudah digunakan.

---

## Glossary

- **Dashboard**: Halaman utama aplikasi yang menampilkan semua widget dalam satu tampilan.
- **Widget**: Komponen UI mandiri yang menampilkan fungsionalitas tertentu (Greeting, Focus Timer, To-Do List, Quick Links).
- **Greeting_Widget**: Widget yang menampilkan waktu, tanggal, dan sapaan berdasarkan waktu hari.
- **Focus_Timer**: Widget countdown timer 25 menit yang mendukung sesi kerja terfokus (teknik Pomodoro).
- **Todo_List**: Widget manajemen tugas yang memungkinkan pengguna menambah, mengedit, menyelesaikan, dan menghapus tugas.
- **Quick_Links**: Widget yang menampilkan dan mengelola tombol pintasan ke website favorit pengguna.
- **Local_Storage**: Web Storage API bawaan browser untuk menyimpan data secara persisten di sisi klien.
- **Storage_Manager**: Modul JavaScript yang menangani semua operasi baca/tulis ke Local Storage.
- **Task**: Sebuah item tugas dalam Todo_List yang memiliki teks deskripsi dan status (selesai/belum selesai).
- **Link**: Sebuah item pintasan dalam Quick_Links yang memiliki label dan URL.

---

## Requirements

### Requirement 1: Tampilan Dashboard Utama

**User Story:** Sebagai pengguna, saya ingin melihat semua widget dalam satu halaman, sehingga saya dapat mengakses semua fitur tanpa perlu berpindah halaman.

#### Acceptance Criteria

1. THE Dashboard SHALL menampilkan keempat widget (Greeting_Widget, Focus_Timer, Todo_List, Quick_Links) secara bersamaan dalam satu halaman.
2. THE Dashboard SHALL memiliki layout yang responsif sehingga dapat digunakan pada berbagai ukuran layar desktop dan tablet.
3. THE Dashboard SHALL memuat semua widget dalam waktu kurang dari 2 detik pada koneksi lokal (file://).
4. THE Dashboard SHALL bekerja tanpa error pada browser modern: Chrome, Firefox, Edge, dan Safari.

---

### Requirement 2: Greeting Widget

**User Story:** Sebagai pengguna, saya ingin melihat waktu, tanggal, dan sapaan yang relevan, sehingga saya selalu tahu konteks waktu saat menggunakan dashboard.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL menampilkan jam dan menit saat ini dalam format HH:MM yang diperbarui setiap menit.
2. THE Greeting_Widget SHALL menampilkan nama hari, tanggal, bulan, dan tahun saat ini (contoh: "Senin, 16 Juni 2025").
3. WHEN waktu saat ini berada antara 05:00–11:59, THE Greeting_Widget SHALL menampilkan teks sapaan "Selamat Pagi".
4. WHEN waktu saat ini berada antara 12:00–14:59, THE Greeting_Widget SHALL menampilkan teks sapaan "Selamat Siang".
5. WHEN waktu saat ini berada antara 15:00–17:59, THE Greeting_Widget SHALL menampilkan teks sapaan "Selamat Sore".
6. WHEN waktu saat ini berada antara 18:00–04:59, THE Greeting_Widget SHALL menampilkan teks sapaan "Selamat Malam".

---

### Requirement 3: Focus Timer

**User Story:** Sebagai pengguna, saya ingin menggunakan timer 25 menit, sehingga saya dapat bekerja dalam sesi terfokus menggunakan teknik Pomodoro.

#### Acceptance Criteria

1. THE Focus_Timer SHALL menampilkan hitungan mundur dengan format MM:SS, dimulai dari nilai 25:00.
2. WHEN pengguna menekan tombol Start, THE Focus_Timer SHALL memulai hitungan mundur dari nilai waktu yang sedang ditampilkan.
3. WHILE Focus_Timer sedang berjalan, THE Focus_Timer SHALL memperbarui tampilan MM:SS setiap detik.
4. WHEN pengguna menekan tombol Stop, THE Focus_Timer SHALL menghentikan hitungan mundur dan mempertahankan nilai waktu yang tersisa.
5. WHEN pengguna menekan tombol Reset, THE Focus_Timer SHALL menghentikan hitungan mundur dan mengembalikan tampilan ke 25:00.
6. WHEN hitungan mundur mencapai 00:00, THE Focus_Timer SHALL menampilkan notifikasi visual atau audio kepada pengguna bahwa sesi telah selesai.
7. WHILE Focus_Timer sedang berjalan, THE Focus_Timer SHALL menonaktifkan tombol Start untuk mencegah duplikasi interval.
8. WHILE Focus_Timer tidak berjalan, THE Focus_Timer SHALL menonaktifkan tombol Stop.

---

### Requirement 4: To-Do List — Menambah Tugas

**User Story:** Sebagai pengguna, saya ingin menambahkan tugas baru ke daftar, sehingga saya dapat mencatat hal-hal yang perlu saya kerjakan.

#### Acceptance Criteria

1. THE Todo_List SHALL menyediakan input field untuk memasukkan teks deskripsi tugas baru.
2. WHEN pengguna memasukkan teks dan mengonfirmasi (menekan tombol tambah atau menekan Enter), THE Todo_List SHALL menambahkan Task baru ke daftar dengan status belum selesai.
3. WHEN pengguna mengonfirmasi penambahan tugas, THE Todo_List SHALL mengosongkan input field.
4. IF input field kosong saat pengguna mencoba menambahkan tugas, THEN THE Todo_List SHALL tidak menambahkan Task dan input field SHALL tetap dalam fokus.
5. WHEN Task baru berhasil ditambahkan, THE Storage_Manager SHALL menyimpan daftar tugas yang diperbarui ke Local Storage.

---

### Requirement 5: To-Do List — Mengedit Tugas

**User Story:** Sebagai pengguna, saya ingin mengedit teks tugas yang sudah ada, sehingga saya dapat memperbarui deskripsi tugas jika ada perubahan.

#### Acceptance Criteria

1. THE Todo_List SHALL menyediakan mekanisme untuk memasuki mode edit pada setiap Task (contoh: tombol edit atau double-click pada teks).
2. WHEN pengguna memasuki mode edit, THE Todo_List SHALL menampilkan input field yang sudah terisi dengan teks Task saat ini.
3. WHEN pengguna mengonfirmasi perubahan teks, THE Todo_List SHALL memperbarui teks Task dengan nilai baru dan keluar dari mode edit.
4. IF input field edit kosong saat pengguna mengonfirmasi, THEN THE Todo_List SHALL mempertahankan teks Task yang lama.
5. WHEN teks Task berhasil diperbarui, THE Storage_Manager SHALL menyimpan daftar tugas yang diperbarui ke Local Storage.

---

### Requirement 6: To-Do List — Menandai Tugas Selesai

**User Story:** Sebagai pengguna, saya ingin menandai tugas sebagai selesai, sehingga saya dapat melacak kemajuan pekerjaan saya.

#### Acceptance Criteria

1. THE Todo_List SHALL menampilkan checkbox atau kontrol toggle pada setiap Task.
2. WHEN pengguna mencentang checkbox Task yang belum selesai, THE Todo_List SHALL mengubah status Task menjadi selesai dan memberikan penanda visual berbeda (contoh: teks dicoret atau warna berbeda).
3. WHEN pengguna mencentang checkbox Task yang sudah selesai, THE Todo_List SHALL mengubah status Task kembali menjadi belum selesai.
4. WHEN status Task berubah, THE Storage_Manager SHALL menyimpan daftar tugas yang diperbarui ke Local Storage.

---

### Requirement 7: To-Do List — Menghapus Tugas

**User Story:** Sebagai pengguna, saya ingin menghapus tugas dari daftar, sehingga saya dapat membersihkan tugas yang sudah tidak relevan.

#### Acceptance Criteria

1. THE Todo_List SHALL menyediakan tombol hapus pada setiap Task.
2. WHEN pengguna menekan tombol hapus pada sebuah Task, THE Todo_List SHALL menghapus Task tersebut dari daftar secara permanen.
3. WHEN Task berhasil dihapus, THE Storage_Manager SHALL menyimpan daftar tugas yang diperbarui ke Local Storage.

---

### Requirement 8: To-Do List — Persistensi Data

**User Story:** Sebagai pengguna, saya ingin tugas saya tetap tersimpan setelah menutup dan membuka kembali browser, sehingga saya tidak kehilangan daftar tugas saya.

#### Acceptance Criteria

1. WHEN Dashboard pertama kali dimuat, THE Todo_List SHALL membaca data tugas dari Local Storage dan menampilkan semua Task yang tersimpan.
2. IF tidak ada data tugas di Local Storage saat Dashboard dimuat, THEN THE Todo_List SHALL menampilkan daftar kosong tanpa error.
3. THE Storage_Manager SHALL menyimpan seluruh daftar Task sebagai array JSON di Local Storage menggunakan kunci yang tetap (contoh: `todo-life-dashboard-tasks`).

---

### Requirement 9: Quick Links — Menambah Link

**User Story:** Sebagai pengguna, saya ingin menambahkan pintasan ke website favorit saya, sehingga saya dapat mengaksesnya dengan cepat dari dashboard.

#### Acceptance Criteria

1. THE Quick_Links SHALL menyediakan form atau dialog untuk memasukkan label dan URL dari Link baru.
2. WHEN pengguna mengisi label dan URL lalu mengonfirmasi, THE Quick_Links SHALL menambahkan tombol pintasan baru ke tampilan widget.
3. IF URL yang dimasukkan tidak diawali dengan `http://` atau `https://`, THEN THE Quick_Links SHALL menambahkan prefix `https://` secara otomatis sebelum menyimpan.
4. IF label atau URL kosong saat pengguna mencoba menambahkan Link, THEN THE Quick_Links SHALL tidak menambahkan Link.
5. WHEN Link baru berhasil ditambahkan, THE Storage_Manager SHALL menyimpan daftar link yang diperbarui ke Local Storage.

---

### Requirement 10: Quick Links — Menggunakan Link

**User Story:** Sebagai pengguna, saya ingin membuka website favorit dengan satu klik, sehingga saya dapat berpindah ke website yang saya inginkan dengan cepat.

#### Acceptance Criteria

1. THE Quick_Links SHALL menampilkan setiap Link sebagai tombol yang dapat diklik dengan label yang terlihat jelas.
2. WHEN pengguna mengklik tombol Link, THE Quick_Links SHALL membuka URL yang terkait di tab browser baru.

---

### Requirement 11: Quick Links — Menghapus Link

**User Story:** Sebagai pengguna, saya ingin menghapus pintasan yang sudah tidak saya butuhkan, sehingga daftar Quick Links tetap relevan dan rapi.

#### Acceptance Criteria

1. THE Quick_Links SHALL menyediakan mekanisme untuk menghapus setiap Link (contoh: tombol hapus kecil pada setiap tombol pintasan).
2. WHEN pengguna memilih untuk menghapus sebuah Link, THE Quick_Links SHALL menghapus tombol pintasan tersebut dari tampilan.
3. WHEN Link berhasil dihapus, THE Storage_Manager SHALL menyimpan daftar link yang diperbarui ke Local Storage.

---

### Requirement 12: Quick Links — Persistensi Data

**User Story:** Sebagai pengguna, saya ingin pintasan saya tetap tersimpan setelah menutup dan membuka kembali browser, sehingga saya tidak perlu mengisi ulang daftar Quick Links.

#### Acceptance Criteria

1. WHEN Dashboard pertama kali dimuat, THE Quick_Links SHALL membaca data link dari Local Storage dan menampilkan semua Link yang tersimpan.
2. IF tidak ada data link di Local Storage saat Dashboard dimuat, THEN THE Quick_Links SHALL menampilkan area kosong atau pesan panduan tanpa error.
3. THE Storage_Manager SHALL menyimpan seluruh daftar Link sebagai array JSON di Local Storage menggunakan kunci yang tetap (contoh: `todo-life-dashboard-links`).

---

### Requirement 13: Struktur File dan Kode

**User Story:** Sebagai developer, saya ingin proyek memiliki struktur file yang bersih dan terorganisir, sehingga kode mudah dibaca dan dipelihara.

#### Acceptance Criteria

1. THE Dashboard SHALL diimplementasikan dengan tepat satu file HTML di direktori root proyek.
2. THE Dashboard SHALL menggunakan tepat satu file CSS yang ditempatkan di dalam direktori `css/`.
3. THE Dashboard SHALL menggunakan tepat satu file JavaScript yang ditempatkan di dalam direktori `js/`.
4. THE Dashboard SHALL berfungsi penuh sebagai file statis tanpa memerlukan server backend atau proses build.
5. THE Dashboard SHALL tidak menggunakan framework JavaScript eksternal (seperti React, Vue, Angular).
