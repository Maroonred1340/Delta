// 게임 데이터
const words = [
    '사과', '바나나', '포도', '딸기', '수박', '귤', '복숭아', '배',
    '자동차', '버스', '기차', '비행기', '배', '오토바이', '택시', '트럭',
    '집', '건물', '학교', '병원', '은행', '가게', '영화관', '카페',
    '책', '펜', '종이', '노트', '책상', '의자', '창문', '문',
    '날씨', '하늘', '구름', '비', '눈', '바람', '번개', '무지개',
    '컴퓨터', '마우스', '키보드', '모니터', '프린터', '스피커', '헤드폰', '폰',
    '음악', '노래', '영화', '게임', '스포츠', '요리', '그림', '춤',
    '기쁨', '슬픔', '행복', '분노', '놀람', '두려움', '사랑', '미움'
];

// 게임 상태
let gameState = {
    isRunning: false,
    timeRemaining: 60,
    correctWords: 0,
    wrongWords: 0,
    totalWordsShown: 0,
    currentWord: '',
    bestScore: localStorage.getItem('bestScore') || 0
};

// DOM 요소
const startBtn = document.getElementById('startBtn');
const retryBtn = document.getElementById('retryBtn');
const homeBtn = document.getElementById('homeBtn');
const userInput = document.getElementById('userInput');
const currentWordDisplay = document.getElementById('currentWord');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const correctCountDisplay = document.getElementById('correctCount');
const wrongCountDisplay = document.getElementById('wrongCount');
const bestScoreDisplay = document.getElementById('bestScore');

const mainScreen = document.getElementById('mainScreen');
const gameScreen = document.getElementById('gameScreen');
const resultScreen = document.getElementById('resultScreen');

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    bestScoreDisplay.textContent = gameState.bestScore;
});

// 이벤트 리스너
startBtn.addEventListener('click', startGame);
retryBtn.addEventListener('click', startGame);
homeBtn.addEventListener('click', goHome);
userInput.addEventListener('input', handleInput);

// 게임 시작
function startGame() {
    // 상태 초기화
    gameState = {
        isRunning: true,
        timeRemaining: 60,
        correctWords: 0,
        wrongWords: 0,
        totalWordsShown: 0,
        currentWord: '',
        bestScore: gameState.bestScore
    };

    // 화면 전환
    mainScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    gameScreen.classList.add('active');

    // UI 초기화
    userInput.value = '';
    userInput.focus();
    updateDisplay();
    showNewWord();

    // 타이머 시작
    startTimer();
}

// 새로운 단어 표시
function showNewWord() {
    gameState.currentWord = words[Math.floor(Math.random() * words.length)];
    gameState.totalWordsShown++;
    currentWordDisplay.textContent = gameState.currentWord;
    userInput.value = '';
}

// 입력 처리
function handleInput(e) {
    const input = e.target.value;

    // 스페이스바로 제출
    if (input.includes(' ')) {
        checkWord();
        userInput.value = '';
    }
}

// 단어 확인
function checkWord() {
    const input = userInput.value.trim();

    if (input === gameState.currentWord) {
        gameState.correctWords++;
    } else if (input !== '') {
        gameState.wrongWords++;
    }

    updateDisplay();
    showNewWord();
}

// 타이머
function startTimer() {
    const timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        timerDisplay.textContent = gameState.timeRemaining;

        if (gameState.timeRemaining <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

// 게임 종료
function endGame() {
    gameState.isRunning = false;
    userInput.disabled = true;

    // 최고 기록 갱신
    const wpm = Math.round((gameState.correctWords / 60) * 60);
    if (wpm > gameState.bestScore) {
        gameState.bestScore = wpm;
        localStorage.setItem('bestScore', gameState.bestScore);
    }

    // 결과 화면 표시
    showResults();
}

// 결과 표시
function showResults() {
    const wpm = Math.round((gameState.correctWords / 60) * 60);
    const accuracy = gameState.totalWordsShown > 0 
        ? Math.round((gameState.correctWords / gameState.totalWordsShown) * 100)
        : 0;

    document.getElementById('finalWPM').textContent = wpm;
    document.getElementById('finalAccuracy').textContent = accuracy + '%';
    document.getElementById('finalCorrect').textContent = gameState.correctWords;
    document.getElementById('finalWrong').textContent = gameState.wrongWords;

    gameScreen.classList.remove('active');
    resultScreen.classList.add('active');
    userInput.disabled = false;
}

// UI 업데이트
function updateDisplay() {
    const wpm = gameState.timeRemaining > 0 
        ? Math.round((gameState.correctWords / (60 - gameState.timeRemaining)) * 60)
        : 0;
    const accuracy = gameState.totalWordsShown > 0
        ? Math.round((gameState.correctWords / gameState.totalWordsShown) * 100)
        : 100;

    wpmDisplay.textContent = isNaN(wpm) ? 0 : wpm;
    accuracyDisplay.textContent = accuracy;
    correctCountDisplay.textContent = gameState.correctWords;
    wrongCountDisplay.textContent = gameState.wrongWords;
}

// 메인 화면으로 돌아가기
function goHome() {
    resultScreen.classList.remove('active');
    mainScreen.classList.add('active');
    userInput.disabled = false;
    bestScoreDisplay.textContent = gameState.bestScore;
}