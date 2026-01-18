// Data Hiragana Dasar (Seion)
const hiraganaBasic = [
    { r: 'A', k: 'あ' }, { r: 'I', k: 'い' }, { r: 'U', k: 'う' }, { r: 'E', k: 'え' }, { r: 'O', k: 'お' },
    { r: 'KA', k: 'か' }, { r: 'KI', k: 'き' }, { r: 'KU', k: 'く' }, { r: 'KE', k: 'け' }, { r: 'KO', k: 'こ' },
    { r: 'SA', k: 'さ' }, { r: 'SHI', k: 'し' }, { r: 'SU', k: 'す' }, { r: 'SE', k: 'せ' }, { r: 'SO', k: 'そ' },
    { r: 'TA', k: 'た' }, { r: 'CHI', k: 'ち' }, { r: 'TSU', k: 'つ' }, { r: 'TE', k: 'て' }, { r: 'TO', k: 'と' },
    { r: 'NA', k: 'な' }, { r: 'NI', k: 'に' }, { r: 'NU', k: 'ぬ' }, { r: 'NE', k: 'ね' }, { r: 'NO', k: 'の' },
    { r: 'HA', k: 'は' }, { r: 'HI', k: 'ひ' }, { r: 'FU', k: 'ふ' }, { r: 'HE', k: 'へ' }, { r: 'HO', k: 'ほ' },
    { r: 'MA', k: 'ま' }, { r: 'MI', k: 'み' }, { r: 'MU', k: 'む' }, { r: 'ME', k: 'め' }, { r: 'MO', k: 'も' },
    { r: 'YA', k: 'や' }, { r: 'YU', k: 'ゆ' }, { r: 'YO', k: 'よ' },
    { r: 'RA', k: 'ら' }, { r: 'RI', k: 'り' }, { r: 'RU', k: 'る' }, { r: 'RE', k: 'れ' }, { r: 'RO', k: 'ろ' },
    { r: 'WA', k: 'わ' }, { r: 'WO', k: 'を' },
    { r: 'N', k: 'ん' }
];

// State Aplikasi
let currentDeck = [];
let currentIndex = 0;

// Selector Elemen DOM
const cardElement = document.getElementById('flashcard');
const containerElement = document.getElementById('cardContainer');
const kanaDisplay = document.getElementById('kana-display');
const romajiDisplay = document.getElementById('romaji-display');
const counterDisplay = document.getElementById('counter-display');
const btnNext = document.getElementById('btnNext');

// Fungsi Acak (Fisher-Yates Shuffle)
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Inisialisasi
function init() {
    // Copy data biar data asli tidak rusak saat di-shuffle
    currentDeck = [...hiraganaBasic];
    shuffle(currentDeck);
    currentIndex = 0;
    renderCard();
}

function renderCard() {
    const data = currentDeck[currentIndex];
    kanaDisplay.textContent = data.k;
    romajiDisplay.textContent = data.r;
    counterDisplay.textContent = `${currentIndex + 1} / ${currentDeck.length}`;
}

function flipCard() {
    cardElement.classList.toggle('is-flipped');
}

function nextCard() {
    // Jika kartu masih "terbuka" (menampilkan romaji), tutup dulu baru ganti
    if (cardElement.classList.contains('is-flipped')) {
        cardElement.classList.remove('is-flipped');
        
        // Tunggu animasi tutup (0.2s) selesai baru ganti teks
        setTimeout(() => {
            advanceIndex();
        }, 200);
    } else {
        // Efek visual 'shake' atau ganti langsung
        advanceIndex();
    }
}

function advanceIndex() {
    currentIndex++;
    // Jika habis, acak ulang (Infinite Loop)
    if (currentIndex >= currentDeck.length) {
        alert("Satu putaran selesai! Mengacak ulang...");
        shuffle(currentDeck);
        currentIndex = 0;
    }
    renderCard();
}

// --- Event Listeners ---

// Klik area kartu untuk balik
containerElement.addEventListener('click', flipCard);

// Klik tombol Next
btnNext.addEventListener('click', (e) => {
    e.stopPropagation(); // Mencegah event bubbling ke container (biar gak flip)
    nextCard();
});

// Keyboard Shortcut (Spasi)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault(); // Mencegah scroll halaman saat spasi
        nextCard();
    }
});

// Mulai aplikasi
init();