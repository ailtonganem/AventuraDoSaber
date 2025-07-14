/*
 * Arquivo: js/main.js
 * Projeto: Aventura do Saber
 * Descrição: Lógica principal do jogo, incluindo a cena de gameplay.
 * Versão: 1.4
 */

// A classe GameScene encapsula a lógica e os dados da nossa tela de jogo.
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    /**
     * Função de pré-carregamento (preload) da cena.
     */
    preload() {
        console.log("GameScene: Preload");
        this.load.json('questoes_mat', 'data/matematica.json');
    }

    /**
     * Função de criação (create) da cena.
     */
    create() {
        console.log("GameScene: Create");

        this.questoes = this.cache.json.get('questoes_mat');
        this.currentQuestionIndex = 0;
        this.score = 0;
        
        // Exibe a pontuação na tela
        const scoreX = this.cameras.main.width - 20;
        const scoreY = 20;
        this.scoreText = this.add.text(scoreX, scoreY, 'Pontos: 0', {
            fontSize: '28px',
            fill: '#FFFFFF',
            fontFamily: '"Poppins"'
        }).setOrigin(1, 0); // Alinha o texto à direita e no topo

        this.questionGroup = this.add.group();
        this.alternativeTexts = [];

        this.displayCurrentQuestion();
    }

    /**
     * Exibe a pergunta e as alternativas atuais na tela.
     */
    displayCurrentQuestion() {
        this.questionGroup.clear(true, true);
        this.alternativeTexts = [];

        const questionData = this.questoes[this.currentQuestionIndex];
        const centerX = this.cameras.main.centerX;
        const startY = this.cameras.main.height * 0.20;

        const questionText = this.add.text(centerX, startY, questionData.pergunta, {
            fontSize: '28px',
            fill: '#FFFFFF',
            fontFamily: '"Poppins"',
            align: 'center',
            wordWrap: { width: this.cameras.main.width - 100 }
        }).setOrigin(0.5);

        this.questionGroup.add(questionText);

        let positionY = startY + 150;

        questionData.alternativas.forEach((alternativa, index) => {
            const alternativaText = this.add.text(centerX, positionY, alternativa, {
                fontSize: '24px',
                fill: '#DDDDDD',
                fontFamily: '"Poppins"',
                backgroundColor: '#1a1a52',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            alternativaText.on('pointerdown', () => this.selectAnswer(index));
            alternativaText.on('pointerover', () => alternativaText.setFill('#FFFF00'));
            alternativaText.on('pointerout', () => alternativaText.setFill('#DDDDDD'));
            
            this.questionGroup.add(alternativaText);
            this.alternativeTexts.push(alternativaText);
            positionY += 70;
        });
    }

    /**
     * Lógica executada quando o jogador seleciona uma resposta.
     * @param {number} selectedIndex - O índice da alternativa que foi clicada.
     */
    selectAnswer(selectedIndex) {
        // Desativa a interação com todas as alternativas para evitar cliques múltiplos
        this.alternativeTexts.forEach(text => text.disableInteractive());

        const questionData = this.questoes[this.currentQuestionIndex];
        const selectedText = this.alternativeTexts[selectedIndex];
        const correctText = this.alternativeTexts[questionData.respostaCorreta];

        if (selectedIndex === questionData.respostaCorreta) {
            console.log("RESPOSTA CORRETA!");
            this.score += questionData.pontos;
            selectedText.setBackgroundColor('#008000'); // Verde para acerto
        } else {
            console.log("RESPOSTA INCORRETA!");
            const pointsToLose = Math.round(questionData.pontos * 0.30);
            this.score = Math.max(0, this.score - pointsToLose); // Garante que a pontuação não seja negativa
            
            selectedText.setBackgroundColor('#FF0000'); // Vermelho para erro
            correctText.setBackgroundColor('#008000'); // Mostra a correta em verde
        }
        
        this.scoreText.setText(`Pontos: ${this.score}`);

        // Aguarda 2 segundos e depois vai para a próxima pergunta
        this.time.delayedCall(2000, this.goToNextQuestion, [], this);
    }

    /**
     * Avança para a próxima pergunta ou encerra o quiz.
     */
    goToNextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questoes.length) {
            this.displayCurrentQuestion();
        } else {
            this.endQuiz();
        }
    }

    /**
     * Exibe a tela de fim de jogo.
     */
    endQuiz() {
        console.log("Fim de Jogo!");
        this.questionGroup.clear(true, true);
        this.scoreText.setVisible(false); // Esconde a pontuação do canto

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.add.text(centerX, centerY - 50, 'Fim de Jogo!', {
            fontSize: '48px',
            fill: '#FFFFFF',
            fontFamily: '"Poppins"'
        }).setOrigin(0.5);

        this.add.text(centerX, centerY + 50, `Pontuação Final: ${this.score}`, {
            fontSize: '32px',
            fill: '#FFFF00',
            fontFamily: '"Poppins"'
        }).setOrigin(0.5);
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
    parent: 'game-container',
    backgroundColor: '#000033',
    scene: [GameScene]
};

// Inicializa o jogo
const game = new Phaser.Game(config);
