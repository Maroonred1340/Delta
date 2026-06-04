// Game data
const words = [
    'apple', 'banana', 'grape', 'strawberry', 'watermelon', 'orange', 'peach', 'pear',
    'car', 'bus', 'train', 'airplane', 'ship', 'motorcycle', 'taxi', 'truck',
    'house', 'building', 'school', 'hospital', 'bank', 'store', 'cinema', 'cafe',
    'book', 'pen', 'paper', 'notebook', 'desk', 'chair', 'window', 'door',
    'weather', 'sky', 'cloud', 'rain', 'snow', 'wind', 'thunder', 'rainbow',
    'computer', 'mouse', 'keyboard', 'monitor', 'printer', 'speaker', 'headphone', 'phone',
    'music', 'song', 'movie', 'game', 'sport', 'cooking', 'art', 'dance',
    'happy', 'sad', 'joy', 'angry', 'surprise', 'fear', 'love', 'hate'
];

// Stage settings (time in seconds)
const stages = [
    { level: 1, time: 20, name: 'Easy' },
    { level: 2, time: 30, name: 'Normal' },
    { level: 3, time: 40, name: 'Hard' }
];

// Game state
let gameState = {
    isRunning: false,
    currentStage: 0,
    stageTime: 0,
    timeRemaining: 0,
    correctWords: 0,
    wrongWords: 0,
    totalWordsShown: 0,
    currentWord: '',
    bestScore: localStorage.getItem('bestScore') || 0,
    stageResults: []
};

// DOM elements
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    bestScoreDisplay.textContent = gameState.bestScore;
});

// Event listeners
startBtn.addEventListener('click', startGame);
retryBtn.addEventListener('click', startGame);
homeBtn.addEventListener('click', goHome);
userInput.addEventListener('input', handleInput);

// Start game
function startGame() {
    // Reset state
    gameState = {
        isRunning: true,
        currentStage: 0,
        stageTime: stages[0].time,
        timeRemaining: stages[0].time,
        correctWords: 0,
        wrongWords: 0,
        totalWordsShown: 0,
        currentWord: '',
        bestScore: gameState.bestScore,
        stageResults: []
    };

    // Switch screens
    mainScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    gameScreen.classList.add('active');

    // Initialize UI
    userInput.value = '';
    userInput.focus();
    updateDisplay();
    showNewWord();
    showStageIndicator();

    // Start timer
    startTimer();
}

// Show stage indicator
function showStageIndicator() {
    const stage = stages[gameState.currentStage];
    console.log(`\n=== DELTA: Stage ${stage.level} - ${stage.name} Started! ===\n`);
}

// Show new word
function showNewWord() {
    gameState.currentWord = words[Math.floor(Math.random() * words.length)];
    gameState.totalWordsShown++;
    currentWordDisplay.textContent = gameState.currentWord;
    userInput.value = '';
}

// Handle input
function handleInput(e) {
    const input = e.target.value;

    // Submit on space
    if (input.includes(' ')) {
        checkWord();
        userInput.value = '';
    }
}

// Check word
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

// Timer
function startTimer() {
    const timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        timerDisplay.textContent = gameState.timeRemaining;

        if (gameState.timeRemaining <= 0) {
            clearInterval(timerInterval);
            completeStage();
        }
    }, 1000);
}

// Complete stage
function completeStage() {
    const stage = stages[gameState.currentStage];
    const wpm = gameState.correctWords;
    
    // Save stage results
    gameState.stageResults.push({
        level: stage.level,
        correct: gameState.correctWords,
        wrong: gameState.wrongWords,
        wpm: wpm
    });

    console.log(`\n=== DELTA: Stage ${stage.level} Completed! ===`);
    console.log(`Correct: ${gameState.correctWords}, Wrong: ${gameState.wrongWords}\n`);

    // Check if next stage exists
    if (gameState.currentStage < stages.length - 1) {
        // Move to next stage
        gameState.currentStage++;
        gameState.stageTime = stages[gameState.currentStage].time;
        gameState.timeRemaining = stages[gameState.currentStage].time;
        gameState.correctWords = 0;
        gameState.wrongWords = 0;
        gameState.totalWordsShown = 0;
        
        updateDisplay();
        showNewWord();
        showStageIndicator();
        startTimer();
    } else {
        // All stages completed
        endGame();
    }
}

// End game
function endGame() {
    gameState.isRunning = false;
    userInput.disabled = true;

    // Update best score (based on total correct words)
    const totalCorrect = gameState.stageResults.reduce((sum, stage) => sum + stage.correct, 0);
    if (totalCorrect > gameState.bestScore) {
        gameState.bestScore = totalCorrect;
        localStorage.setItem('bestScore', gameState.bestScore);
    }

    console.log(`\n=== DELTA: Game Over! ===\n`);
    
    // Show results
    showResults();
}

// Show results
function showResults() {
    const totalCorrect = gameState.stageResults.reduce((sum, stage) => sum + stage.correct, 0);
    const totalWrong = gameState.stageResults.reduce((sum, stage) => sum + stage.wrong, 0);
    const totalShown = totalCorrect + totalWrong || 1;
    const accuracy = Math.round((totalCorrect / totalShown) * 100);

    document.getElementById('finalWPM').textContent = totalCorrect;
    document.getElementById('finalAccuracy').textContent = accuracy + '%';
    document.getElementById('finalCorrect').textContent = totalCorrect;
    document.getElementById('finalWrong').textContent = totalWrong;

    gameScreen.classList.remove('active');
    resultScreen.classList.add('active');
    userInput.disabled = false;
    
    console.log(`Total Correct: ${totalCorrect}, Accuracy: ${accuracy}%`);
    console.log(`\n=== DELTA ===\n`);
}

// Update display
function updateDisplay() {
    const accuracy = gameState.totalWordsShown > 0
        ? Math.round((gameState.correctWords / gameState.totalWordsShown) * 100)
        : 100;

    const stage = stages[gameState.currentStage];
    
    wpmDisplay.textContent = gameState.correctWords;
    accuracyDisplay.textContent = accuracy;
    correctCountDisplay.textContent = gameState.correctWords;
    wrongCountDisplay.textContent = gameState.wrongWords;
    
    // Update timer display with stage info
    const timerParent = timerDisplay.parentElement;
    timerParent.innerHTML = `<span>Stage ${stage.level}</span><span id="timer">${gameState.timeRemaining}</span>s`;
    document.getElementById('timer').textContent = gameState.timeRemaining;
}

// Go home
function goHome() {
    resultScreen.classList.remove('active');
    mainScreen.classList.add('active');
    userInput.disabled = false;
    bestScoreDisplay.textContent = gameState.bestScore;
    console.log(`\n=== DELTA: Going Home ===\n`);
}