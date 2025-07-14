/*
 * Arquivo: js/main.js
 * Projeto: Aventura do Saber
 * Descrição: Lógica principal do jogo, incluindo a cena de gameplay.
 * Versão: 1.3
 */

// A classe GameScene encapsula a lógica e os dados da nossa tela de jogo.
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    /**
     * Função de pré-carregamento (preload) da cena.
     * Carrega todos os assets necessários para esta cena.
     */
    preload() {
        console.log("GameScene: Preload");
        this.load.json('questoes_mat', 'data/matematica.json');
    }

    /**
     * Função de criação (create) da cena.
     * Executada uma vez, após o preload, para montar a cena.
     */
    create() {
        console.log("GameScene: Create");

        // Armazena as questões carregadas em uma propriedade da cena
        this.questoes = this.cache.json.get('questoes_mat');
        this.currentQuestionIndex = 0;

        // Grupo para manter os elementos da pergunta atual (texto e alternativas)
        // Isso facilita a limpeza da tela ao passar para a próxima pergunta.
        this.questionGroup = this.add.group();

        this.displayCurrentQuestion();
    }

    /**
     * Exibe a pergunta e as alternativas atuais na tela.
     */
    displayCurrentQuestion() {
        // Limpa quaisquer elementos de pergunta anteriores
        this.questionGroup.clear(true, true);

        // Pega a pergunta atual do nosso array de questões
        const questionData = this.questoes[this.currentQuestionIndex];
        
        // Pega as dimensões da câmera para centralizar os elementos dinamicamente
        const centerX = this.cameras.main.centerX;
        const startY = this.cameras.main.height * 0.20; // Posição Y inicial (20% do topo)

        // Exibe o texto da pergunta
        const questionText = this.add.text(centerX, startY, questionData.pergunta, {
            fontSize: '28px',
            fill: '#FFFFFF',
            fontFamily: '"Poppins"',
            align: 'center',
            wordWrap: { width: this.cameras.main.width - 100 } // Largura baseada no tamanho da tela
        }).setOrigin(0.5);

        this.questionGroup.add(questionText);

        // Posição inicial Y para a primeira alternativa
        let positionY = startY + 150;

        // Cria um objeto de texto para cada alternativa
        questionData.alternativas.forEach((alternativa, index) => {
            const alternativaText = this.add.text(centerX, positionY, alternativa, {
                fontSize: '24px',
                fill: '#DDDDDD', // Cor padrão para as alternativas
                fontFamily: '"Poppins"',
                backgroundColor: '#1a1a52',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            // Lógica de interação
            alternativaText.on('pointerdown', () => {
                this.selectAnswer(index);
            });

            // Efeito visual ao passar o mouse
            alternativaText.on('pointerover', () => {
                alternativaText.setFill('#FFFF00'); // Amarelo
            });

            alternativaText.on('pointerout', () => {
                alternativaText.setFill('#DDDDDD'); // Volta para a cor padrão
            });
            
            this.questionGroup.add(alternativaText);
            positionY += 70; // Incrementa a posição Y para a próxima alternativa
        });
    }

    /**
     * Lógica executada quando o jogador seleciona uma resposta.
     * @param {number} selectedIndex - O índice da alternativa que foi clicada.
     */
    selectAnswer(selectedIndex) {
        const questionData = this.questoes[this.currentQuestionIndex];
        
        if (selectedIndex === questionData.respostaCorreta) {
            console.log("RESPOSTA CORRETA!");
            // Futuramente aqui entrará a lógica de adicionar pontos.
        } else {
            console.log("RESPOSTA INCORRETA!");
            // Futuramente aqui entrará a lógica de perder pontos.
        }
    }
}

// Configuração principal do jogo Phaser
const config = {
    type: Phaser.AUTO,
    // Adiciona o gerenciador de escala para responsividade
    scale: {
        mode: Phaser.Scale.FIT, // Ajusta o jogo à tela mantendo a proporção
        autoCenter: Phaser.Scale.CENTER_BOTH, // Centraliza o jogo na tela
        width: 1280, // Largura base do jogo para referência de proporção
        height: 720  // Altura base do jogo para referência de proporção
    },
    parent: 'game-container',
    backgroundColor: '#000033',
    // Agora o jogo usa a nossa classe de cena
    scene: [GameScene]
};

// Inicializa o jogo
const game = new Phaser.Game(config);
