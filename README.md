# 🌈 Funky Snake Game (Bright & Colorful Pop Art Edition)

Sebuah modifikasi modern dan *fresh* dari game klasik Snake. Berbeda dengan game ular konvensional yang didominasi warna gelap, proyek ini mengusung tema **Bright & Colorful Pop Art** dengan latar belakang cerah, kontras tinggi, border tegas, serta efek visual ledakan partikel pelangi yang interaktif.

Proyek ini dibangun menggunakan **HTML5 Canvas dan Vanilla JavaScript**, menjadikannya materi pembelajaran yang sangat baik untuk memahami manipulasi grafis 2D, sistem koordinat grid, dan penanganan *game loop*.

---

## 🚀 Fitur Utama

*   **Pop Art & Bright UI:** Desain antarmuka modern dengan skema warna cerah (Putih, Merah Muda, Kuning, dan Hijau Mint) yang dikombinasikan dengan border hitam tegas khas gaya seni Pop Art.
*   **Rainbow Particle Explosion:** Setiap kali ular berhasil memakan umpan, sistem akan memicu animasi ledakan 20 partikel pelangi acak yang bergerak menyebar dan memudar secara asinkronus.
*   **Smooth Grid Collision Detection:** Pergerakan ular dikunci dalam koordinat grid $20 \times 20$ piksel untuk memastikan deteksi tabrakan dinding dan ekor bekerja dengan akurat tanpa adanya *glitch*.
*   **Perfect Edge Clipping:** Menggunakan optimasi CSS `overflow: hidden` pada pembungkus canvas dan pembersihan frame `ctx.clearRect()` untuk memastikan komponen grafis terpotong rapi mengikuti sudut melengkung (*rounded corners*) panel UI.
*   **Dual Controller System:** Mendukung fleksibilitas kontrol penuh menggunakan tombol arah **Panah (Arrow Keys)** maupun tombol **WASD** pada keyboard.

---

## 📂 Struktur Folder Proyek

```text
├── index.html       # Struktur dashboard skor, tombol reset, dan wadah canvas
├── style.css        # Variabel warna cerah pastel, layout fleksibel, dan gaya pop art
└── script.js        # Logika siklus game, rendering grafis 2D, dan manajemen partikel
