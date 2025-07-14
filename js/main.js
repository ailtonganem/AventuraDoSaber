/*
 * Arquivo: js/main.js
 * Projeto: Aventura do Saber
 * Descrição: Lógica principal do jogo, incluindo cenas de menu e gameplay.
 * Versão: 1.7
 */

// Cena do Menu Principal (com lógica para usuário novo e recorrente)
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.image('avatar_menino', 'assets/images/avatars/avatar_menino.png');
        this.load.image('avatar_menina', 'assets/images/avatars/avatar_menina.png');
    }

    create() {
        const savedData = localStorage.getItem('aventuraSaberUser');

        if (savedData) {
            this.showWelcomeBackScreen(JSON.parse(savedData));
        } else {
            this.showRegistrationScreen();
        }
    }

    showWelcomeBackScreen(userData) {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.add.text(centerX, centerY - 200, `Bem-vindo(a) de volta, ${userData.name}!`, {
            fontSize: '40px', fill: '#FFFFFF', fontFamily: '"Poppins"'
        }).setOrigin(0.5);

        this.add.image(centerX, centerY - 50, userData.avatar).setScale(0.5);
        this.add.text(centerX, centerY + 50, `Pontuação atual: ${userData.score}`, {
            fontSize: '24px', fill: '#FFFF00', fontFamily: '"Poppins"'
        }).setOrigin(0.5);

        // Botão Continuar
        const continueButton = this.add.text(centerX, centerY + 150, 'Continuar Jogo', {
            fontSize: '28px', fill: '#FFFFFF', backgroundColor: '#28a745', padding: {x: 20, y: 10}, fontFamily: '"Poppins"'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        continueButton.on('pointerdown', () => {
            this.scene.start('GameScene', userData);
        });

        // Botão Começar Novo Jogo
        const resetButton = this.add.text(centerX, centerY + 220, 'Começar Novo Jogo', {
            fontSize: '22px', fill: '#DDDDDD', backgroundColor: '#dc3545', padding: {x: 15, y: 8}, fontFamily: '"Poppins"'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        resetButton.on('pointerdown', () => {
            localStorage.removeItem('aventuraSaberUser');
            this.scene.restart(); // Reinicia a cena de menu, que agora mostrará a tela de cadastro
        });
    }

    showRegistrationScreen() {
        this.selectedAvatarKey = null;
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.add.text(centerX, centerY - 250, 'Aventura do Saber', { fontSize: '48px', fill: '#FFFFFF', fontFamily: '"Poppins"' }).setOrigin(0.5);
        this.add.text(centerX, centerY - 150, 'Escolha seu avatar:', { fontSize: '24px', fill: '#DDDDDD', fontFamily: '"Poppins"' }).setOrigin(0.5);

        const avatarMenino = this.add.image(centerX - 100, centerY - 50, 'avatar_menino').setScale(0.5).setInteractive({ useHandCursor: true });
        const avatarMenina = this.add.image(centerX + 100, centerY - 50, 'avatar_menina').setScale(0.5).setInteractive({ useHandCursor: true });
        
        avatarMenino.on('pointerdown', () => { this.selectedAvatarKey = 'avatar_menino'; avatarMenino.setTint(0x00ff00); avatarMenina.clearTint(); });
        avatarMenina.on('pointerdown', () => { this.selectedAvatarKey = 'avatar_menina'; avatarMenina.setTint(0x00ff00); avatarMenino.clearTint(); });

        const formHtml = `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
                <input type="text" name="playerName" placeholder="Digite seu nome aqui" style="font-size: 20px; padding: 10px; width: 250px; border-radius: 5px; border: none; text-align: center; font-family: Poppins;">
                <button type="submit" style="font-size: 22px; padding: 10px 30px; border-radius: 5px; border: none; background-color: #28a745; color: white; cursor: pointer;">Jogar</button>
            </div>`;
        const form = this.add.dom(centerX, centerY + 100).createFromHTML(formHtml);
        const feedbackText = this.add.text(centerX, centerY + 170, '', { fontSize: '18px', fill: '#ff4d4d' }).setOrigin(0.5);

        form.addListener('click');
        form.on('click', (event) => {
            if (event.target.type === 'submit') {
                const playerNameInput = form.getChildByName('playerName');
                const playerName = playerNameInput.value.trim();

                if (playerName && this.selectedAvatarKey) {
                    const userData = { name: playerName, score: 0, avatar: this.selectedAvatarKey };
                    localStorage.setItem('aventuraSaberUser', JSON.stringify(userData));
                    this.scene.start('GameScene', userData);
                } else if (!playerName) {
                    feedbackText.setText('Por favor, digite seu nome!');
                } else {
                    feedbackText.setText('Por favor, escolha um avatar!');
                }
            }
        });
    }
}


// Cena Principal do Jogo (Quiz)
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    init(data) {
        this.playerName = data.name || 'Convidado';
        this.avatarKey = data.avatar || 'avatar_menino';
        this.score = data.score || 0;
    }

    preload() {
        this.load.json('questoes_mat', 'data/matematica.json');
        this.load.image(this.avatarKey, `assets/images/avatars/${this.avatarKey}.png`);
    }

    create() {
        this.add.image(50, 45, this.avatarKey).setScale(0.3);
        this.add.text(90, 35, `Jogador: ${this.playerName}`, { fontSize: '24px', fill: '#FFFFFF', fontFamily: '"Poppins"' }).setOrigin(0, 0.5);
        this.scoreText = this.add.text(this.cameras.main.width - 20, 20, `Pontos: ${this.score}`, { fontSize: '24px', fill: '#FFFFFF', fontFamily: '"Poppins"' }).setOrigin(1, 0);
        this.questoes = this.cache.json.get('questoes_mat');
        this.currentQuestionIndex = 0;
        this.questionGroup = this.add.group();
        this.alternativeTexts = [];
        this.displayCurrentQuestion();
    }

    displayCurrentQuestion() {
        this.questionGroup.clear(true, true);
        this.alternativeTexts = [];
        const questionData = this.questoes[this.currentQuestionIndex];
        const centerX = this.cameras.main.centerX;
        const startY = this.cameras.main.height * 0.25;

        const questionText = this.add.text(centerX, startY, questionData.pergunta, { fontSize: '28px', fill: '#FFFFFF', fontFamily: '"Poppins"', align: 'center', wordWrap: { width: this.cameras.main.width - 100 } }).setOrigin(0.5);
        this.questionGroup.add(questionText);

        let positionY = startY + 150;
        questionData.alternativas.forEach((alternativa, index) => {
            const alternativaText = this.add.text(centerX, positionY, alternativa, { fontSize: '24px', fill: '#DDDDDD', fontFamily: '"Poppins"', backgroundColor: '#1a1a52', padding: { x: 20, y: 10 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            alternativaText.on('pointerdown', () => this.selectAnswer(index));
            alternativaText.on('pointerover', () => alternativaText.setFill('#FFFF00'));
            alternativaText.on('pointerout', () => alternativaText.setFill('#DDDDDD'));
            this.questionGroup.add(alternativaText);
            this.alternativeTexts.push(alternativaText);
            positionY += 70;
        });
    }

    selectAnswer(selectedIndex) {
        this.alternativeTexts.forEach(text => text.disableInteractive());
        const questionData = this.questoes[this.currentQuestionIndex];
        const selectedText = this.alternativeTexts[selectedIndex];
        const correctText = this.alternativeTexts[questionData.respostaCorreta];
        if (selectedIndex === questionData.respostaCorreta) {
            this.score += questionData.pontos;
            selectedText.setBackgroundColor('#008000');
        } else {
            const pointsToLose = Math.round(questionData.pontos * 0.30);
            this.score = Math.max(0, this.score - pointsToLose);
            selectedText.setBackgroundColor('#FF0000');
            correctText.setBackgroundColor('#008000');
        }
        this.scoreText.setText(`Pontos: ${this.score}`);
        this.time.delayedCall(2000, this.goToNextQuestion, [], this);
    }

    goToNextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questoes.length) {
            this.displayCurrentQuestion();
        } else {
            this.endQuiz();
        }
    }

    endQuiz() {
        const userData = { name: this.playerName, score: this.score, avatar: this.avatarKey };
        localStorage.setItem('aventuraSaberUser', JSON.stringify(userData));
        console.log("Pontuação final salva:", userData);

        this.questionGroup.clear(true, true);
        this.scoreText.setVisible(false);
        this.add.text(this.cameras.main.width - 20, 20, `Jogador: ${this.playerName}`).setOrigin(1,0).setVisible(false);
        this.add.image(50, 45, this.avatarKey).setVisible(false);

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        this.add.text(centerX, centerY - 50, 'Fim de Jogo!', { fontSize: '48px', fill: '#FFFFFF', fontFamily: '"Poppins"' }).setOrigin(0.5);
        this.add.text(centerX, centerY + 50, `Pontuação Final: ${this.score}`, { fontSize: '32px', fill: '#FFFF00', fontFamily: '"Poppins"' }).setOrigin(0.5);
    }
}


// Configuração principal do jogo Phaser
const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 720
    },
    dom: {
        createContainer: true
    },
    parent: 'game-container',
    backgroundColor: '#000033',
    scene: [MainMenuScene, GameScene]
};

const game = new Phaser.Game(config);
