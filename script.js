// Quiz Game - Main JavaScript
class QuizGame {
    constructor() {
        // Game State
        this.gameState = {
            screen: 'start', // start, quiz, results, highscores
            playerName: 'Player',
            category: 'general',
            difficulty: 'medium',
            mode: 'timed',
            score: 0,
            lives: 3,
            currentQuestion: 0,
            totalQuestions: 10,
            timeLeft: 15,
            timerInterval: null,
            selectedOption: null,
            correctAnswers: 0,
            wrongAnswers: 0,
            powerUps: {
                fiftyFifty: 1,
                extraTime: 1,
                doublePoints: 1
            },
            skipsLeft: 3,
            hintsUsed: 0,
            startTime: null,
            totalTime: 0,
            isAnswerSubmitted: false,
            questions: [],
            achievements: []
        };

        // Sound Effects
        this.sounds = {
            correct: document.getElementById('correctSound'),
            wrong: document.getElementById('wrongSound'),
            click: document.getElementById('clickSound'),
            timer: document.getElementById('timerSound')
        };

        // DOM Elements
        this.elements = {
            // Screens
            startScreen: document.querySelector('.start-screen'),
            quizScreen: document.querySelector('.quiz-screen'),
            resultsScreen: document.querySelector('.results-screen'),
            highScoresScreen: document.querySelector('.high-scores-screen'),
            
            // Start Screen
            playerNameInput: document.getElementById('playerName'),
            difficultySelect: document.getElementById('difficulty'),
            categoryCards: document.querySelectorAll('.category-card'),
            modeOptions: document.querySelectorAll('input[name="mode"]'),
            startBtn: document.getElementById('startBtn'),
            highScoresBtn: document.getElementById('highScoresBtn'),
            
            // Quiz Screen
            currentPlayer: document.getElementById('currentPlayer'),
            currentCategory: document.getElementById('currentCategory'),
            timer: document.getElementById('timer'),
            score: document.getElementById('score'),
            questionCount: document.getElementById('questionCount'),
            lives: document.getElementById('lives'),
            progressBar: document.getElementById('progressBar'),
            qNum: document.getElementById('qNum'),
            questionText: document.getElementById('questionText'),
            questionDifficulty: document.getElementById('questionDifficulty'),
            optionsContainer: document.getElementById('optionsContainer'),
            hintBtn: document.getElementById('hintBtn'),
            skipBtn: document.getElementById('skipBtn'),
            submitBtn: document.getElementById('submitBtn'),
            quitBtn: document.getElementById('quitBtn'),
            
            // Power Ups
            powerUp50: document.getElementById('powerUp50'),
            powerUpTime: document.getElementById('powerUpTime'),
            powerUpDouble: document.getElementById('powerUpDouble'),
            
            // Results Screen
            finalScore: document.getElementById('finalScore'),
            correctAnswers: document.getElementById('correctAnswers'),
            wrongAnswers: document.getElementById('wrongAnswers'),
            timeUsed: document.getElementById('timeUsed'),
            accuracy: document.getElementById('accuracy'),
            performanceFill: document.getElementById('performanceFill'),
            achievementsGrid: document.getElementById('achievementsGrid'),
            leaderboard: document.getElementById('leaderboard'),
            playAgainBtn: document.getElementById('playAgainBtn'),
            shareBtn: document.getElementById('shareBtn'),
            homeBtn: document.getElementById('homeBtn'),
            
            // High Scores Screen
            scoresTableBody: document.getElementById('scoresTableBody'),
            personalStats: document.getElementById('personalStats'),
            clearScoresBtn: document.getElementById('clearScoresBtn'),
            backToHomeBtn: document.getElementById('backToHomeBtn'),
            
            // Modal & Toast
            confirmModal: document.getElementById('confirmModal'),
            modalMessage: document.getElementById('modalMessage'),
            modalConfirm: document.getElementById('modalConfirm'),
            modalCancel: document.getElementById('modalCancel'),
            toast: document.getElementById('toast'),
            toastMessage: document.getElementById('toastMessage')
        };

        // Initialize Quiz
        this.init();
    }

    init() {
        // Load questions from API or use default
        this.loadQuestions();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load high scores from localStorage
        this.loadHighScores();
        
        // Set default category
        this.setCategory('general');
    }

    loadQuestions() {
        // This would typically come from an API
        // For now, we'll use sample questions
        const questionBank = {
            general: [
                {
                    question: "What is the capital of France?",
                    options: ["London", "Berlin", "Paris", "Madrid"],
                    answer: 2,
                    explanation: "Paris is the capital and most populous city of France."
                },
                {
                    question: "Which planet is known as the Red Planet?",
                    options: ["Venus", "Mars", "Jupiter", "Saturn"],
                    answer: 1,
                    explanation: "Mars is often called the Red Planet due to its reddish appearance."
                }
            ],
            science: [
                {
                    question: "What is the chemical symbol for water?",
                    options: ["H2O", "CO2", "O2", "NaCl"],
                    answer: 0,
                    explanation: "H2O is the chemical formula for water, indicating two hydrogen atoms and one oxygen atom."
                },
                {
                    question: "What force keeps us on the ground?",
                    options: ["Magnetism", "Gravity", "Friction", "Inertia"],
                    answer: 1,
                    explanation: "Gravity is the force that attracts objects with mass toward each other."
                }
            ],
            history: [
                {
                    question: "Who was the first president of the United States?",
                    options: ["Thomas Jefferson", "Abraham Lincoln", "George Washington", "John Adams"],
                    answer: 2,
                    explanation: "George Washington served as the first president from 1789 to 1797."
                }
            ],
            tech: [
                {
                    question: "What does HTML stand for?",
                    options: [
                        "Hyper Text Markup Language",
                        "High Tech Modern Language",
                        "Hyper Transfer Markup Language",
                        "Home Tool Markup Language"
                    ],
                    answer: 0,
                    explanation: "HTML stands for Hyper Text Markup Language, the standard markup language for web pages."
                }
            ],
            movies: [
                {
                    question: "Which movie features the quote 'You talking to me?'",
                    options: ["Scarface", "Taxi Driver", "Goodfellas", "The Godfather"],
                    answer: 1,
                    explanation: "This iconic line is spoken by Robert De Niro's character Travis Bickle in Taxi Driver."
                }
            ],
            sports: [
                {
                    question: "How many players are on a soccer team during a match?",
                    options: ["9", "10", "11", "12"],
                    answer: 2,
                    explanation: "A soccer team consists of 11 players on the field, including the goalkeeper."
                }
            ]
        };

        // For a real project, you would fetch from an API
        // const response = await fetch('https://opentdb.com/api.php?amount=50');
        // const data = await response.json();
        
        this.questionBank = questionBank;
    }

    setupEventListeners() {
        // Start Screen
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.highScoresBtn.addEventListener('click', () => this.showScreen('highscores'));
        
        this.elements.categoryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.setCategory(category);
            });
        });

        // Quiz Screen
        this.elements.submitBtn.addEventListener('click', () => this.submitAnswer());
        this.elements.skipBtn.addEventListener('click', () => this.skipQuestion());
        this.elements.hintBtn.addEventListener('click', () => this.useHint());
        this.elements.quitBtn.addEventListener('click', () => this.showQuitConfirm());

        // Power Ups
        this.elements.powerUp50.addEventListener('click', () => this.usePowerUp('fiftyFifty'));
        this.elements.powerUpTime.addEventListener('click', () => this.usePowerUp('extraTime'));
        this.elements.powerUpDouble.addEventListener('click', () => this.usePowerUp('doublePoints'));

        // Results Screen
        this.elements.playAgainBtn.addEventListener('click', () => this.restartGame());
        this.elements.shareBtn.addEventListener('click', () => this.shareScore());
        this.elements.homeBtn.addEventListener('click', () => this.showScreen('start'));

        // High Scores Screen
        this.elements.clearScoresBtn.addEventListener('click', () => this.clearHighScores());
        this.elements.backToHomeBtn.addEventListener('click', () => this.showScreen('start'));

        // Modal
        this.elements.modalCancel.addEventListener('click', () => this.hideModal());
        this.elements.modalConfirm.addEventListener('click', () => {
            if (this.pendingAction === 'quit') {
                this.endGame();
            }
            this.hideModal();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.gameState.screen === 'quiz') {
                if (e.key >= '1' && e.key <= '4') {
                    const index = parseInt(e.key) - 1;
                    this.selectOption(index);
                } else if (e.key === 'Enter') {
                    this.submitAnswer();
                } else if (e.key === ' ') {
                    e.preventDefault();
                    this.skipQuestion();
                }
            }
        });
    }

    setCategory(category) {
        this.gameState.category = category;
        
        // Update UI
        this.elements.categoryCards.forEach(card => {
            if (card.dataset.category === category) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    startGame() {
        // Get player info
        this.gameState.playerName = this.elements.playerNameInput.value || 'Player';
        this.gameState.difficulty = this.elements.difficultySelect.value;
        
        // Get selected mode
        const selectedMode = document.querySelector('input[name="mode"]:checked');
        this.gameState.mode = selectedMode ? selectedMode.value : 'timed';
        
        // Reset game state
        this.gameState.score = 0;
        this.gameState.lives = this.gameState.mode === 'survival' ? 3 : 1;
        this.gameState.currentQuestion = 0;
        this.gameState.correctAnswers = 0;
        this.gameState.wrongAnswers = 0;
        this.gameState.selectedOption = null;
        this.gameState.isAnswerSubmitted = false;
        this.gameState.skipsLeft = 3;
        this.gameState.hintsUsed = 0;
        this.gameState.totalTime = 0;
        this.gameState.achievements = [];
        
        // Reset power-ups
        this.gameState.powerUps = {
            fiftyFifty: 1,
            extraTime: 1,
            doublePoints: 1
        };
        
        // Generate questions based on category
        this.generateQuestions();
        
        // Update UI
        this.elements.currentPlayer.textContent = this.gameState.playerName;
        this.elements.currentCategory.innerHTML = `<i class="fas fa-tag"></i> ${this.gameState.category.charAt(0).toUpperCase() + this.gameState.category.slice(1)}`;
        
        // Show quiz screen
        this.showScreen('quiz');
        
        // Start first question
        this.loadQuestion();
        
        // Play click sound
        this.playSound('click');
    }

    generateQuestions() {
        const categoryQuestions = this.questionBank[this.gameState.category] || this.questionBank.general;
        const numQuestions = this.gameState.mode === 'marathon' ? 20 : 10;
        
        // Shuffle and select questions
        const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5);
        this.gameState.questions = shuffled.slice(0, numQuestions);
        this.gameState.totalQuestions = this.gameState.questions.length;
    }

    loadQuestion() {
        const question = this.gameState.questions[this.gameState.currentQuestion];
        
        if (!question) {
            this.endGame();
            return;
        }
        
        // Reset state
        this.gameState.selectedOption = null;
        this.gameState.isAnswerSubmitted = false;
        this.gameState.timeLeft = 15;
        
        // Update UI
        this.elements.qNum.textContent = this.gameState.currentQuestion + 1;
        this.elements.questionCount.textContent = `${this.gameState.currentQuestion + 1}/${this.gameState.totalQuestions}`;
        this.elements.questionText.textContent = question.question;
        
        // Update difficulty badge
        this.elements.questionDifficulty.textContent = this.gameState.difficulty.charAt(0).toUpperCase() + this.gameState.difficulty.slice(1);
        this.elements.questionDifficulty.className = 'difficulty-badge ' + this.gameState.difficulty;
        
        // Clear options
        this.elements.optionsContainer.innerHTML = '';
        
        // Create option elements
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = `
                <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                <div class="option-text">${option}</div>
            `;
            optionElement.addEventListener('click', () => this.selectOption(index));
            this.elements.optionsContainer.appendChild(optionElement);
        });
        
        // Update buttons
        this.elements.submitBtn.disabled = true;
        this.elements.submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Answer';
        
        // Update progress bar
        const progress = ((this.gameState.currentQuestion + 1) / this.gameState.totalQuestions) * 100;
        this.elements.progressBar.style.width = `${progress}%`;
        
        // Update skip button
        this.elements.skipBtn.innerHTML = `<i class="fas fa-forward"></i> Skip (${this.gameState.skipsLeft} left)`;
        this.elements.skipBtn.disabled = this.gameState.skipsLeft === 0;
        
        // Start timer
        this.startTimer();
        
        // Enable hint button after delay
        this.elements.hintBtn.disabled = true;
        this.elements.hintBtn.innerHTML = '<i class="fas fa-lightbulb"></i> Hint (Available in 10s)';
        
        setTimeout(() => {
            if (this.gameState.screen === 'quiz') {
                this.elements.hintBtn.disabled = false;
                this.elements.hintBtn.innerHTML = '<i class="fas fa-lightbulb"></i> Get Hint';
            }
        }, 10000);
        
        // Update power-up buttons
        this.updatePowerUpButtons();
        
        // Record start time
        this.gameState.startTime = Date.now();
    }

    selectOption(index) {
        if (this.gameState.isAnswerSubmitted) return;
        
        // Play click sound
        this.playSound('click');
        
        // Remove selection from all options
        const options = document.querySelectorAll('.option');
        options.forEach(opt => opt.classList.remove('selected'));
        
        // Add selection to clicked option
        options[index].classList.add('selected');
        this.gameState.selectedOption = index;
        
        // Enable submit button
        this.elements.submitBtn.disabled = false;
    }

    startTimer() {
        // Clear existing timer
        if (this.gameState.timerInterval) {
            clearInterval(this.gameState.timerInterval);
        }
        
        // Update timer display
        this.elements.timer.textContent = this.gameState.timeLeft;
        
        // Start countdown
        this.gameState.timerInterval = setInterval(() => {
            this.gameState.timeLeft--;
            this.elements.timer.textContent = this.gameState.timeLeft;
            
            // Play warning sound when time is low
            if (this.gameState.timeLeft === 5) {
                this.playSound('timer');
            }
            
            // Time's up
            if (this.gameState.timeLeft <= 0) {
                clearInterval(this.gameState.timerInterval);
                this.timeUp();
            }
        }, 1000);
    }

    timeUp() {
        if (this.gameState.isAnswerSubmitted) return;
        
        // Mark as submitted
        this.gameState.isAnswerSubmitted = true;
        
        // Show correct answer
        const question = this.gameState.questions[this.gameState.currentQuestion];
        const options = document.querySelectorAll('.option');
        options[question.answer].classList.add('correct');
        
        // Play wrong sound
        this.playSound('wrong');
        
        // Update stats
        this.gameState.wrongAnswers++;
        
        // Update lives for survival mode
        if (this.gameState.mode === 'survival') {
            this.gameState.lives--;
            this.elements.lives.textContent = this.gameState.lives;
            
            if (this.gameState.lives <= 0) {
                setTimeout(() => this.endGame(), 1500);
                return;
            }
        }
        
        // Move to next question after delay
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }

    submitAnswer() {
        if (this.gameState.selectedOption === null || this.gameState.isAnswerSubmitted) return;
        
        // Mark as submitted
        this.gameState.isAnswerSubmitted = true;
        
        // Stop timer
        clearInterval(this.gameState.timerInterval);
        
        // Calculate time taken
        const timeTaken = 15 - this.gameState.timeLeft;
        this.gameState.totalTime += timeTaken;
        
        const question = this.gameState.questions[this.gameState.currentQuestion];
        const options = document.querySelectorAll('.option');
        
        // Check answer
        if (this.gameState.selectedOption === question.answer) {
            // Correct answer
            options[this.gameState.selectedOption].classList.add('correct');
            
            // Calculate points (faster answers get more points)
            let points = 100;
            if (timeTaken < 5) points = 150;
            else if (timeTaken < 10) points = 100;
            else points = 50;
            
            // Apply double points power-up
            if (this.gameState.powerUps.doublePoints > 0) {
                points *= 2;
                this.gameState.powerUps.doublePoints--;
            }
            
            // Update score
            this.gameState.score += points;
            this.gameState.correctAnswers++;
            
            // Update UI
            this.elements.score.textContent = this.gameState.score;
            
            // Play correct sound
            this.playSound('correct');
            
            // Update button text
            this.elements.submitBtn.innerHTML = '<i class="fas fa-check"></i> Correct!';
            
        } else {
            // Wrong answer
            options[this.gameState.selectedOption].classList.add('wrong');
            options[question.answer].classList.add('correct');
            
            // Update stats
            this.gameState.wrongAnswers++;
            
            // Update lives for survival mode
            if (this.gameState.mode === 'survival') {
                this.gameState.lives--;
                this.elements.lives.textContent = this.gameState.lives;
            }
            
            // Play wrong sound
            this.playSound('wrong');
            
            // Update button text
            this.elements.submitBtn.innerHTML = '<i class="fas fa-times"></i> Incorrect';
        }
        
        // Disable options
        options.forEach(opt => {
            opt.classList.add('disabled');
            opt.style.pointerEvents = 'none';
        });
        
        // Move to next question after delay
        setTimeout(() => {
            if (this.gameState.mode === 'survival' && this.gameState.lives <= 0) {
                this.endGame();
            } else {
                this.nextQuestion();
            }
        }, 2000);
    }

    skipQuestion() {
        if (this.gameState.skipsLeft <= 0) return;
        
        // Play click sound
        this.playSound('click');
        
        // Use a skip
        this.gameState.skipsLeft--;
        this.elements.skipBtn.innerHTML = `<i class="fas fa-forward"></i> Skip (${this.gameState.skipsLeft} left)`;
        this.elements.skipBtn.disabled = this.gameState.skipsLeft === 0;
        
        // Move to next question
        this.nextQuestion();
    }

    useHint() {
        if (this.gameState.hintsUsed >= 3 || this.gameState.isAnswerSubmitted) return;
        
        // Play click sound
        this.playSound('click');
        
        const question = this.gameState.questions[this.gameState.currentQuestion];
        const options = document.querySelectorAll('.option');
        const wrongOptions = [];
        
        // Find wrong options
        options.forEach((opt, index) => {
            if (index !== question.answer && !opt.classList.contains('selected')) {
                wrongOptions.push(index);
            }
        });
        
        // Remove one wrong option
        if (wrongOptions.length > 0) {
            const randomIndex = Math.floor(Math.random() * wrongOptions.length);
            const optionToRemove = wrongOptions[randomIndex];
            options[optionToRemove].classList.add('disabled');
            options[optionToRemove].style.opacity = '0.3';
            options[optionToRemove].style.pointerEvents = 'none';
            
            this.gameState.hintsUsed++;
            this.elements.hintBtn.disabled = true;
            this.elements.hintBtn.innerHTML = '<i class="fas fa-lightbulb"></i> Hint Used';
            
            // Show toast notification
            this.showToast('Hint used! One wrong option removed.');
        }
    }

    usePowerUp(powerUp) {
        if (this.gameState.powerUps[powerUp] <= 0 || this.gameState.isAnswerSubmitted) return;
        
        // Play click sound
        this.playSound('click');
        
        switch (powerUp) {
            case 'fiftyFifty':
                this.useFiftyFifty();
                break;
            case 'extraTime':
                this.useExtraTime();
                break;
            case 'doublePoints':
                this.useDoublePoints();
                break;
        }
        
        // Update power-up count
        this.gameState.powerUps[powerUp]--;
        this.updatePowerUpButtons();
    }

    useFiftyFifty() {
        const question = this.gameState.questions[this.gameState.currentQuestion];
        const options = document.querySelectorAll('.option');
        const wrongOptions = [];
        
        // Find wrong options
        options.forEach((opt, index) => {
            if (index !== question.answer && !opt.classList.contains('selected')) {
                wrongOptions.push(index);
            }
        });
        
        // Remove two wrong options
        for (let i = 0; i < 2 && wrongOptions.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * wrongOptions.length);
            const optionToRemove = wrongOptions.splice(randomIndex, 1)[0];
            options[optionToRemove].classList.add('disabled');
            options[optionToRemove].style.opacity = '0.3';
            options[optionToRemove].style.pointerEvents = 'none';
        }
        
        this.showToast('50:50 used! Two wrong options removed.');
    }

    useExtraTime() {
        this.gameState.timeLeft += 10;
        this.elements.timer.textContent = this.gameState.timeLeft;
        this.showToast('+10 seconds added to the timer!');
    }

    useDoublePoints() {
        this.showToast('Next correct answer will give double points!');
    }

    updatePowerUpButtons() {
        this.elements.powerUp50.disabled = this.gameState.powerUps.fiftyFifty <= 0;
        this.elements.powerUpTime.disabled = this.gameState.powerUps.extraTime <= 0;
        this.elements.powerUpDouble.disabled = this.gameState.powerUps.doublePoints <= 0;
        
        this.elements.powerUp50.innerHTML = `<i class="fas fa-ban"></i> 50:50 (${this.gameState.powerUps.fiftyFifty})`;
        this.elements.powerUpTime.innerHTML = `<i class="fas fa-clock"></i> +10s (${this.gameState.powerUps.extraTime})`;
        this.elements.powerUpDouble.innerHTML = `<i class="fas fa-gem"></i> x2 (${this.gameState.powerUps.doublePoints})`;
    }

    nextQuestion() {
        this.gameState.currentQuestion++;
        
        if (this.gameState.currentQuestion >= this.gameState.totalQuestions) {
            this.endGame();
        } else {
            this.loadQuestion();
        }
    }

    endGame() {
        // Clear timer
        if (this.gameState.timerInterval) {
            clearInterval(this.gameState.timerInterval);
        }
        
        // Calculate final statistics
        const accuracy = this.gameState.totalQuestions > 0 
            ? Math.round((this.gameState.correctAnswers / this.gameState.totalQuestions) * 100)
            : 0;
        
        // Update results screen
        this.elements.finalScore.textContent = this.gameState.score;
        this.elements.correctAnswers.textContent = this.gameState.correctAnswers;
        this.elements.wrongAnswers.textContent = this.gameState.wrongAnswers;
        this.elements.timeUsed.textContent = `${this.gameState.totalTime}s`;
        this.elements.accuracy.textContent = `${accuracy}%`;
        
        // Update performance meter
        const performance = (this.gameState.score / (this.gameState.totalQuestions * 150)) * 100;
        this.elements.performanceFill.style.width = `${Math.min(100, performance)}%`;
        
        // Check achievements
        this.checkAchievements();
        
        // Save score
        this.saveHighScore();
        
        // Load leaderboard
        this.loadLeaderboard();
        
        // Show results screen
        this.showScreen('results');
        
        // Play completion sound
        this.playSound('correct');
    }

    checkAchievements() {
        const achievements = [];
        
        if (this.gameState.score >= 1000) {
            achievements.push({
                title: "Quiz Master",
                description: "Score 1000+ points",
                icon: "fas fa-crown"
            });
        }
        
        if (this.gameState.accuracy === 100) {
            achievements.push({
                title: "Perfect Score",
                description: "Get all questions right",
                icon: "fas fa-star"
            });
        }
        
        if (this.gameState.totalTime < 60) {
            achievements.push({
                title: "Speed Demon",
                description: "Complete quiz in under 60 seconds",
                icon: "fas fa-bolt"
            });
        }
        
        if (this.gameState.correctAnswers >= 5 && this.gameState.hintsUsed === 0) {
            achievements.push({
                title: "No Help Needed",
                description: "Answer 5+ questions without hints",
                icon: "fas fa-brain"
            });
        }
        
        // Update achievements grid
        this.elements.achievementsGrid.innerHTML = '';
        achievements.forEach(achievement => {
            const achievementElement = document.createElement('div');
            achievementElement.className = 'achievement';
            achievementElement.innerHTML = `
                <i class="${achievement.icon}"></i>
                <h4>${achievement.title}</h4>
                <p>${achievement.description}</p>
            `;
            this.elements.achievementsGrid.appendChild(achievementElement);
        });
    }

    saveHighScore() {
        const highScores = JSON.parse(localStorage.getItem('quizHighScores') || '[]');
        
        const scoreData = {
            player: this.gameState.playerName,
            score: this.gameState.score,
            category: this.gameState.category,
            difficulty: this.gameState.difficulty,
            date: new Date().toISOString().split('T')[0],
            time: this.gameState.totalTime,
            correct: this.gameState.correctAnswers,
            total: this.gameState.totalQuestions
        };
        
        highScores.push(scoreData);
        
        // Sort by score (highest first)
        highScores.sort((a, b) => b.score - a.score);
        
        // Keep only top 50 scores
        const topScores = highScores.slice(0, 50);
        
        localStorage.setItem('quizHighScores', JSON.stringify(topScores));
    }

    loadHighScores() {
        const highScores = JSON.parse(localStorage.getItem('quizHighScores') || '[]');
        this.highScores = highScores;
        return highScores;
    }

    loadLeaderboard() {
        const highScores = this.loadHighScores();
        
        // Clear existing leaderboard
        this.elements.leaderboard.innerHTML = '';
        
        // Add top 10 scores
        const topScores = highScores.slice(0, 10);
        
        if (topScores.length === 0) {
            this.elements.leaderboard.innerHTML = '<div class="text-center">No high scores yet!</div>';
            return;
        }
        
        topScores.forEach((score, index) => {
            const entry = document.createElement('div');
            entry.className = 'leaderboard-entry';
            entry.innerHTML = `
                <div class="leaderboard-rank">${index + 1}</div>
                <div class="leaderboard-player">
                    <i class="fas fa-user"></i>
                    <span>${score.player}</span>
                </div>
                <div class="leaderboard-score">${score.score}</div>
            `;
            this.elements.leaderboard.appendChild(entry);
        });
    }

    clearHighScores() {
        if (confirm('Are you sure you want to clear all high scores? This action cannot be undone.')) {
            localStorage.removeItem('quizHighScores');
            this.loadHighScores();
            this.showToast('All high scores have been cleared!');
            setTimeout(() => location.reload(), 1000);
        }
    }

    showScreen(screen) {
        // Hide all screens
        this.elements.startScreen.classList.remove('active');
        this.elements.quizScreen.classList.remove('active');
        this.elements.resultsScreen.classList.remove('active');
        this.elements.highScoresScreen.classList.remove('active');
        
        // Show selected screen
        switch (screen) {
            case 'start':
                this.elements.startScreen.classList.add('active');
                break;
            case 'quiz':
                this.elements.quizScreen.classList.add('active');
                break;
            case 'results':
                this.elements.resultsScreen.classList.add('active');
                break;
            case 'highscores':
                this.elements.highScoresScreen.classList.add('active');
                this.loadHighScoresTable();
                break;
        }
        
        this.gameState.screen = screen;
    }

    loadHighScoresTable() {
        const highScores = this.loadHighScores();
        const tbody = this.elements.scoresTableBody;
        
        tbody.innerHTML = '';
        
        if (highScores.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">No high scores yet. Play a game to get on the leaderboard!</td>
                </tr>
            `;
            return;
        }
        
        highScores.forEach((score, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${score.player}</td>
                <td>${score.score}</td>
                <td>${score.category.charAt(0).toUpperCase() + score.category.slice(1)}</td>
                <td>${score.difficulty.charAt(0).toUpperCase() + score.difficulty.slice(1)}</td>
                <td>${score.date}</td>
            `;
            tbody.appendChild(row);
        });
    }

    showQuitConfirm() {
        this.pendingAction = 'quit';
        this.elements.modalMessage.textContent = 'Are you sure you want to quit the quiz? Your progress will be lost.';
        this.elements.confirmModal.classList.add('active');
    }

    hideModal() {
        this.elements.confirmModal.classList.remove('active');
        this.pendingAction = null;
    }

    showToast(message) {
        this.elements.toastMessage.textContent = message;
        this.elements.toast.classList.add('show');
        
        setTimeout(() => {
            this.elements.toast.classList.remove('show');
        }, 3000);
    }

    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(e => console.log('Audio play failed:', e));
        }
    }

    restartGame() {
        this.showScreen('start');
    }

    shareScore() {
        const text = `I scored ${this.gameState.score} points on QuizMaster Pro! Can you beat my score?`;
        
        if (navigator.share) {
            navigator.share({
                title: 'QuizMaster Pro Score',
                text: text,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(text);
            this.showToast('Score copied to clipboard!');
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new QuizGame();
    
    // Make game globally accessible for debugging
    window.quizGame = game;
});