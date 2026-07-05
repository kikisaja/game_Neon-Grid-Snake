// --- KONFIGURASI CANVAS ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --- ELEMEN UI DOM ---
const elSkor = document.getElementById("current-score");
const elHighScore = document.getElementById("high-score");
const btnRestart = document.getElementById("btn-restart");

// --- PENGATURAN UKURAN GRID GAME ---
const UKURAN_KOTAK = 20; 
const JUMLAH_GRID = canvas.width / UKURAN_KOTAK; 

// --- STATE UTAMA GAME ---
let ular = [];
let umpan = { x: 0, y: 0 };
let arahX = 0;
let arahY = -1;
let skor = 0;
let skorTertinggi = 0;
let gameLoopInterval = null;
let gameBerjalan = false;

// Wadah efek partikel pelangi
let partikelArray = [];

// --- STRUKTUR DATA CLASS PARTIKEL WARNA-WARNI CERAH ---
class Partikel {
    constructor(x, y, warna) {
        this.x = x;
        this.y = y;
        this.warna = warna;
        this.kecepatanX = (Math.random() - 0.5) * 6;
        this.kecepatanY = (Math.random() - 0.5) * 6;
        this.ukuran = Math.random() * 4 + 3;
        this.opacity = 1;
        this.kecepatanPudar = 0.025;
    }

    update() {
        this.x += this.kecepatanX;
        this.y += this.kecepatanY;
        this.opacity -= this.kecepatanPudar;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.warna;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.ukuran, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// --- FUNGSI 1: START/RESET GAME ---
function inisialisasiGame() {
    ular = [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 }
    ];
    
    arahX = 0;
    arahY = -1; 
    skor = 0;
    elSkor.innerText = skor;
    partikelArray = [];
    
    acakPosisiUmpan();
    
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(updateDanRender, 110); // Kecepatan gerak stabil halus
    gameBerjalan = true;
    btnRestart.innerText = "Reset Kontes 🔄";
}

// --- FUNGSI 2: ACAK POSISI MAKANAN ---
function acakPosisiUmpan() {
    umpan.x = Math.floor(Math.random() * JUMLAH_GRID);
    umpan.y = Math.floor(Math.random() * JUMLAH_GRID);

    ular.forEach(bagian => {
        if (bagian.x === umpan.x && bagian.y === umpan.y) {
            acakPosisiUmpan();
        }
    });
}

// --- FUNGSI 3: LEDAKAN PARTIKEL PELANGI ---
function buatLedakanPartikel(koordinatX, koordinatY) {
    const paletPelangi = ['#ff477e', '#ff70a6', '#ff97b7', '#00f0ff', '#ffb703', '#06d6a0'];
    for (let i = 0; i < 20; i++) {
        const warnaAcak = paletPelangi[Math.floor(Math.random() * paletPelangi.length)];
        const pixelX = koordinatX * UKURAN_KOTAK + UKURAN_KOTAK / 2;
        const pixelY = koordinatY * UKURAN_KOTAK + UKURAN_KOTAK / 2;
        partikelArray.push(new Partikel(pixelX, pixelY, warnaAcak));
    }
}

// --- FUNGSI 4: LOOPING JALANNYA PERMAINAN ---
function updateDanRender() {
    // 1. Bersihkan Canvas dengan Warna Pastel Cerah Terang
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Gambar Garis Grid Background Tipis Transparan
    ctx.strokeStyle = "rgba(30, 41, 59, 0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i < JUMLAH_GRID; i++) {
        ctx.beginPath(); ctx.moveTo(i * UKURAN_KOTAK, 0); ctx.lineTo(i * UKURAN_KOTAK, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * UKURAN_KOTAK); ctx.lineTo(canvas.width, i * UKURAN_KOTAK); ctx.stroke();
    }

    if (!gameBerjalan) {
        tampilkanLayarSelesai();
        return;
    }

    // 3. Update Posisi Kepala Ular
    const kepalaBaru = { x: ular[0].x + arahX, y: ular[0].y + arahY };

    // Deteksi Tabrakan Batas Pinggir / Tubuh Sendiri
    if (kepalaBaru.x < 0 || kepalaBaru.x >= JUMLAH_GRID || kepalaBaru.y < 0 || kepalaBaru.y >= JUMLAH_GRID || cekTabrakanTubuh(kepalaBaru)) {
        gameBerjalan = false;
        if (skor > skorTertinggi) {
            skorTertinggi = skor;
            elHighScore.innerText = skorTertinggi;
        }
        return;
    }

    ular.unshift(kepalaBaru);

    // Deteksi Jika Ular Memakan Makanan
    if (kepalaBaru.x === umpan.x && kepalaBaru.y === umpan.y) {
        skor += 10;
        elSkor.innerText = skor;
        buatLedakanPartikel(umpan.x, umpan.y);
        acakPosisiUmpan();
    } else {
        ular.pop();
    }

    // 4. GAMBAR MAKANAN (BUAH MERAH POP ART)
    ctx.fillStyle = "#ff477e";
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(umpan.x * UKURAN_KOTAK + UKURAN_KOTAK/2, umpan.y * UKURAN_KOTAK + UKURAN_KOTAK/2, UKURAN_KOTAK/2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 5. GAMBAR ULAR BERGRADASI WARNA-WARNI (MINT GREEN & CYAN)
    ular.forEach((bagian, indeks) => {
        // Kepala berwarna biru cerah, badannya hijau mint ceria
        ctx.fillStyle = indeks === 0 ? "#00f0ff" : "#06d6a0";
        ctx.strokeStyle = "#1e293b"; // Border hitam solid khas pop art
        ctx.lineWidth = 2;
        
        ctx.fillRect(bagian.x * UKURAN_KOTAK, bagian.y * UKURAN_KOTAK, UKURAN_KOTAK, UKURAN_KOTAK);
        ctx.strokeRect(bagian.x * UKURAN_KOTAK, bagian.y * UKURAN_KOTAK, UKURAN_KOTAK, UKURAN_KOTAK);
    });

    // 6. ANIMASIKAN PARTIKEL EFEK LEDAKAN
    partikelArray.forEach((partikel, indeks) => {
        if (partikel.opacity <= 0) {
            partikelArray.splice(indeks, 1);
        } else {
            partikel.update();
            partikel.draw();
        }
    });
}

function cekTabrakanTubuh(koordinatKepala) {
    for (let i = 1; i < ular.length; i++) {
        if (ular[i].x === koordinatKepala.x && ular[i].y === koordinatKepala.y) return true;
    }
    return false;
}

function tampilkanLayarSelesai() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ff477e";
    ctx.font = "bold 32px 'Segoe UI'";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER 💥", canvas.width / 2, canvas.height / 2 - 10);

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 16px 'Segoe UI'";
    ctx.fillText(`Skor Akhir Anda: ${skor} Poin`, canvas.width / 2, canvas.height / 2 + 25);
}

// --- CONTROLLER BUTTON ARROW & WASD ---
window.addEventListener("keydown", event => {
    const key = event.key;
    if ((key === "ArrowUp" || key === "w" || key === "W") && arahY !== 1) {
        arahX = 0; arahY = -1;
    } else if ((key === "ArrowDown" || key === "s" || key === "S") && arahY !== -1) {
        arahX = 0; arahY = 1;
    } else if ((key === "ArrowLeft" || key === "a" || key === "A") && arahX !== 1) {
        arahX = -1; arahY = 0;
    } else if ((key === "ArrowRight" || key === "d" || key === "D") && arahX !== -1) {
        arahX = 1; arahY = 0;
    }
});

btnRestart.addEventListener("click", inisialisasiGame);

// Render dasar awal canvas kosong bersih
ctx.fillStyle = "#fafafa";
ctx.fillRect(0, 0, canvas.width, canvas.height);
