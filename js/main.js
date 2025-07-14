/*
 * Arquivo: js/main.js
 * Projeto: Aventura do Saber
 * Descrição: Ponto de entrada do JavaScript, configuração e inicialização do jogo Phaser.
 * Versão: 1.1
 */

// Configuração básica do jogo Phaser
const config = {
    // Tipo de renderização. Phaser.AUTO escolhe automaticamente entre WebGL e Canvas 2D.
    type: Phaser.AUTO,
    
    // Dimensões da tela do jogo em pixels.
    width: 800,
    height: 600,
    
    // O elemento HTML pai onde o canvas do jogo será inserido.
    parent: 'game-container',
    
    // Cor de fundo do canvas.
    backgroundColor: '#000033', // Um azul bem escuro, como um céu noturno.
    
    // Uma lista de cenas do jogo. Por enquanto, teremos apenas uma cena de boot.
    // As cenas são os diferentes estados ou telas do nosso jogo (menu, jogo, loja, etc).
    scene: {
        preload: preload,
        create: create
    }
};

// Cria uma nova instância do jogo Phaser com a configuração definida.
const game = new Phaser.Game(config);

/**
 * Função de pré-carregamento (preload) da cena.
 * O Phaser executa esta função primeiro para carregar todos os assets (imagens, sons, etc).
 */
function preload() {
    console.log("Fase de Preload: Carregando assets...");

    // Carrega o arquivo JSON com as questões de matemática.
    // 'questoes_mat' é a chave que usaremos para acessar esses dados depois.
    this.load.json('questoes_mat', 'data/matematica.json');
}

/**
 * Função de criação (create) da cena.
 * O Phaser executa esta função após o preload. É aqui que montamos a cena,
 * adicionando personagens, textos e configurando a lógica.
 */
function create() {
    console.log("Fase de Create: Montando a cena...");
    
    // Adiciona um texto simples no centro da tela para confirmar que a cena foi criada.
    this.add.text(400, 300, 'Aventura do Saber', { 
        fontSize: '48px', 
        fill: '#FFFFFF',
        fontFamily: '"Poppins"'
    }).setOrigin(0.5); // setOrigin(0.5) centraliza o texto em sua coordenada.

    // Pega os dados do JSON carregado do cache do Phaser.
    const questoes = this.cache.json.get('questoes_mat');

    // Exibe os dados carregados no console do navegador para verificação.
    console.log("Questões de Matemática carregadas:", questoes);

    // Adiciona um texto na tela para confirmar visualmente que as questões foram carregadas.
    this.add.text(400, 350, `Foram carregadas ${questoes.length} questões.`, { 
        fontSize: '24px', 
        fill: '#00FF00', // Verde para indicar sucesso
        fontFamily: '"Poppins"'
    }).setOrigin(0.5);
}
