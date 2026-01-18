// Data Hiragana Dasar (Hepburn Romanization)
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
let activeMode = 'flip'; // 'flip' atau 'quiz'
let isAnswerReveal = false; // Status apakah jawaban sedang dibuka di quiz

// DOM Elements
const cardElement = document.getElementById('flashcard');
const containerElement = document.getElementById('cardContainer');
const kanaDisplay = document.getElementById('kana-display');
const romajiDisplay = document.getElementById('romaji-display');
const counterDisplay = document.getElementById('counter-display');
const btnNext = document.getElementById('btnNext');
const instructionText = document.getElementById('instruction');

// Quiz Elements
const quizArea = document.getElementById('quizArea');
const quizInput = document.getElementById('quizInput');
const feedbackMsg = document.getElementById('feedbackMsg');
const modeBtns = document.querySelectorAll('.mode-btn');

// --- Core Logic ---

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function init() {
    currentDeck = [...hiraganaBasic];
    shuffle(currentDeck);
    currentIndex = 0;
    renderCard();
    updateUIState();
}

// Ganti Mode (Dipanggil dari HTML onclick)
window.setMode = function(mode) {
    activeMode = mode;
    
    // Update tombol aktif
    modeBtns.forEach(btn => btn.classList.remove('active'));
    if(mode === 'flip') modeBtns[0].classList.add('active');
    else modeBtns[1].classList.add('active');

    // Reset kartu ke kondisi awal saat ganti mode
    cardElement.classList.remove('is-flipped');
    isAnswerReveal = false;
    
    // Reset Input
    quizInput.value = '';
    feedbackMsg.textContent = '';
    
    updateUIState();
    
    // Fokus ke input kalau pilih quiz
    if(mode === 'quiz') setTimeout(() => quizInput.focus(), 100);
}

function updateUIState() {
    if (activeMode === 'flip') {
        quizArea.classList.add('hidden');
        instructionText.textContent = "Klik kartu untuk balik";
        containerElement.style.pointerEvents = "auto"; // Bisa diklik
    } else {
        quizArea.classList.remove('hidden');
        instructionText.textContent = "Ketik jawaban & tekan Enter";
        containerElement.style.pointerEvents = "none"; // Kartu gak bisa diklik curang
    }
}

function renderCard() {
    const data = currentDeck[currentIndex];
    kanaDisplay.textContent = data.k;
    romajiDisplay.textContent = data.r;
    counterDisplay.textContent = `${currentIndex + 1} / ${currentDeck.length}`;
    
    // Reset state per kartu
    cardElement.classList.remove('is-flipped');
    isAnswerReveal = false;
    quizInput.value = '';
    feedbackMsg.textContent = '';
    feedbackMsg.className = 'feedback';
    
    if(activeMode === 'quiz') quizInput.focus();
}

// --- Flip Mode Actions ---
containerElement.addEventListener('click', () => {
    if (activeMode === 'flip') {
        cardElement.classList.toggle('is-flipped');
    }
});

// --- Quiz Mode Logic ---
quizInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

function checkAnswer() {
    if (isAnswerReveal) {
        nextCard(); // Kalau sudah jawab (benar/salah), enter jadi tombol Next
        return;
    }

    const userAnswer = quizInput.value.trim().toUpperCase();
    const correctAnswer = currentDeck[currentIndex].r;

    if (userAnswer === correctAnswer) {
        // BENAR
        feedbackMsg.textContent = "BENAR! 🎉";
        feedbackMsg.classList.add('text-success');
        cardElement.classList.add('is-flipped'); // Tunjukkan jawaban
        isAnswerReveal = true;
        
        // Auto next setelah 1 detik biar cepat
        setTimeout(() => nextCard(), 1000); 
    } else {
        // SALAH
        feedbackMsg.textContent = `SALAH! Jawaban: ${correctAnswer}`;
        feedbackMsg.classList.add('text-error');
        cardElement.classList.add('is-flipped'); // Tunjukkan jawaban asli
        
        // Shake animation effect (opsional, simple visual cue)
        quizInput.classList.add('error-shake');
        setTimeout(() => quizInput.classList.remove('error-shake'), 300);
        
        isAnswerReveal = true; // User harus tekan spasi/tombol next manual
    }
}

// --- Navigation ---
function nextCard() {
    // Animasi tutup kartu dulu
    if (cardElement.classList.contains('is-flipped')) {
        cardElement.classList.remove('is-flipped');
        setTimeout(advanceIndex, 200);
    } else {
        advanceIndex();
    }
}

function advanceIndex() {
    currentIndex++;
    if (currentIndex >= currentDeck.length) {
        alert("Satu putaran selesai! Mengacak ulang...");
        shuffle(currentDeck);
        currentIndex = 0;
    }
    renderCard();
}

// Button & Global Keys
btnNext.addEventListener('click', (e) => {
    e.stopPropagation();
    nextCard();
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        // Kalau fokus di input, jangan preventDefault (biar bisa spasi di input kalau perlu, 
        // tapi hiragana romaji gak pake spasi sih).
        // Kita preventDefault biar halaman gak scroll ke bawah.
        if(document.activeElement !== quizInput) {
            e.preventDefault();
            nextCard();
        }
    }
});

// Set Dynamic Year
document.getElementById('year').textContent = new Date().getFullYear();

// Start
init();