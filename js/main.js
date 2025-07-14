/*
 * Arquivo: js/main.js
 * Projeto: Aventura do Saber
 * Descrição: Lógica principal do jogo, incluindo cenas de menu e gameplay.
 * Versão: 1.5
 */

// Cena do Menu Principal (Login/Cadastro)
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.add.text(centerX, centerY - 150, 'Aventura do Saber', {
            fontSize: '48px', fill: '#FFFFFF', fontFamily: '"Poppins"'
        }).setOrigin(0.5);

        this.add.text(centerX, centerY - 50, 'Digite seu nome para começar:', {
            fontSize: '24px', fill: '#DDDDDD', fontFamily: '"Poppins"'
        }).setOrigin(0.5);

        // Cria um elemento de formulário HTML sobreposto ao canvas do Phaser
        const formHtml = `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
                <input type="text" name="playerName" placeholder="Seu nome aqui" style="font-size: 20px; padding: 10px; width: 250px; border-radius: 5px; border: none; text-align: center; font-family: Poppins;">
                <button type="submit" style="font-size: 22px; padding: 10px 30px; border-radius: 5px; border: none; background-color: #28a745; color: white; cursor: pointer;">Jogar</button>
            </div>
        `;
        const form = this.add.dom(centerX, centerY + 30).createFromHTML(formHtml);

        // Adiciona um listener para o clique no botão "Jogar"
        form.addListener('click');
        form.on('click', (event) => {
            if (event.target.type === 'submit') {
                const playerNameInput = form.getChildByName('playerName');
                const playerName = playerNameInput.value.trim();

                if (playerName) {
                    console.log(`Jogador ${playerName} iniciou o jogo.`);
                    // Salva os dados do jogador no localStorage
                    localStorage.setItem('aventuraSaberUser', JSON.stringify({ name: playerName, score: 0 }));
                    // Inicia a cena do jogo, passando o nome do jogador
                    this.scene.start('GameScene', { playerName: playerName });
                } else {
                    // Feedback visual se o nome estiver vazio
                    playerNameInput.style.border = '2px solid red';
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
    
    // O método init é chamado quando a cena é iniciada, recebendo dados da cena anterior
    init(data) {
        this.playerName = data.playerName || 'Convidado';
    }

    preload() {
        this.load.json('questoes_mat', 'data/matematica.json');
    }

    create() {
        this.questoes = this.cache.json.get('questoes_mat');
        this.currentQuestionIndex = 0;
        this.score = 0;
        
        // Exibe o nome do jogador e a pontuação
        this.add.text(20, 20, `Jogador: ${this.playerName}`, { fontSize: '24px', fill: '#FFFFFF', fontFamily: '"Poppins"' }).setOrigin(0, 0);
        this.scoreText = this.add.text(this.cameras.main.width - 20, 20, 'Pontos: 0', { fontSize: '24px', fill: '#FFFFFF', fontFamily: '"Poppins"' }).setOrigin(1, 0);

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

        const questionText = this.add.text(centerX, startY, questionData.pergunta, {
            fontSize: '28px', fill: '#FFFFFF', fontFamily: '"Poppins"', align: 'center', wordWrap: { width: this.cameras.main.width - 100 }
        }).setOrigin(0.5);
        this.questionGroup.add(questionText);

        let positionY = startY + 150;
        questionData.alternativas.forEach((alternativa, index) => {
            const alternativaText = this.add.text(centerX, positionY, alternativa, {
                fontSize: '24px', fill: '#DDDDDD', fontFamily: '"Poppins"', backgroundColor: '#1a1a52', padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

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
        // Salva a pontuação final no localStorage
        const userData = JSON.parse(localStorage.getItem('aventuraSaberUser'));
        userData.score = this.score;
        localStorage.setItem('aventuraSaberUser', JSON.stringify(userData));
        console.log("Pontuação final salva:", userData);

        this.questionGroup.clear(true, true);
        this.scoreText.setVisible(false);

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
    // Habilita o uso de elementos DOM no Phaser
    dom: {
        createContainer: true
    },
    parent: 'game-container',
    backgroundColor: '#000033',
    // Define a ordem das cenas. A primeira da lista é a que inicia.
    scene: [MainMenuScene, GameScene]
};

const game = new Phaser.Game(config);
