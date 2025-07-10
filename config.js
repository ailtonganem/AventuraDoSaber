window.AventuraDoSaber = window.AventuraDoSaber || {};

// Este arquivo centraliza as configurações padrão do jogo.
window.AventuraDoSaber.config = {

    /**
     * Lista de brindes padrão disponíveis na loja.
     * Estes são carregados na primeira vez que o jogo é iniciado
     * ou quando não há dados salvos.
     * - id: Identificador único.
     * - nome: Nome do brinde (incluindo emoji).
     * - custo: Quantidade de pontos necessários.
     * - tipo: Categoria do brinde (avatar, tema, companheiro).
     * - slot: Em qual camada do avatar o item é equipado.
     */
    BRINDES_PADRAO: [
        // Tier 1 - Básico
        { id: 1, nome: 'Óculos Descolados 😎', custo: 250, tipo: 'avatar', slot: 'rosto' },
        { id: 2, nome: 'Boné Colorido 🧢', custo: 300, tipo: 'avatar', slot: 'cabeca' },
        { id: 3, nome: 'Fundo de Estrelas ✨', custo: 350, tipo: 'tema', slot: 'fundo' },

        // Tier 2 - Intermediário
        { id: 4, nome: 'Chapéu de Mago 🎩', custo: 500, tipo: 'avatar', slot: 'cabeca' },
        { id: 5, nome: 'Capa de Herói 🦸', custo: 600, tipo: 'avatar', slot: 'base' }, // Substitui o avatar base
        { id: 6, nome: 'Mascote Robô 🤖', custo: 750, tipo: 'companheiro', slot: 'companheiro' },
        { id: 7, nome: 'Tema Submarino 🐠', custo: 800, tipo: 'tema', slot: 'fundo' },

        // Tier 3 - Avançado
        { id: 8, nome: 'Coroa Real 👑', custo: 1200, tipo: 'avatar', slot: 'cabeca' },
        { id: 9, nome: 'Asas de Anjo 👼', custo: 1500, tipo: 'avatar', slot: 'base' }, // Substitui o avatar base
        { id: 10, nome: 'Mascote Dragão 🐉', custo: 2000, tipo: 'companheiro', slot: 'companheiro' },
        { id: 11, nome: 'Tema Espacial 🚀', custo: 2500, tipo: 'tema', slot: 'fundo' }
    ]
};
