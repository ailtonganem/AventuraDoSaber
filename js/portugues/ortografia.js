/**
 * ortografia.js
 * Módulo para problemas de ortografia da língua portuguesa.
 * * Este arquivo foi convertido para o formato de módulo ES6.
 */

// DADOS contém a estrutura de trilhas e atividades da matéria.
export const DADOS_ORTOGRAFIA = {
    ortografia: { nome: "Ortografia", icone: "✍️", atividades: { tesouro: { nome: "Tesouro Ortográfico", icone: "💎" } } }
};

// Banco de dados de palavras para os desafios de ortografia.
const DADOS_CONTEUDO = [
    { p: 'CA_A', c: 'S', i: ['Z', 'X'], dica: 'É o lugar onde moramos.' },
    { p: 'GI_AFA', c: 'R', i: ['L', 'RR'], dica: 'É um animal com um pescoço muito longo.' },
    { p: 'VI_GEM', c: 'A', i: ['E', 'O'], dica: 'É o ato de ir para outro lugar, como nas férias.' },
    { p: '_EITO', c: 'J', i: ['G'], dica: 'É o modo como algo é feito.' },
    { p: 'MA_Ã', c: 'Ç', i: ['SS', 'S'], dica: 'É uma fruta vermelha ou verde, muito comum.' },
    { p: 'PA_OCA', c: 'Ç', i: ['S', 'SS'], dica: 'É um doce de amendoim, típico de festas juninas.' },
    { p: 'EXER_ÍCIO', c: 'C', i: ['S', 'SS'], dica: 'É o que fazemos para treinar o corpo ou a mente.' },
    { p: 'CHI_ELO', c: 'N', i: ['M'], dica: 'É um calçado aberto que usamos em casa ou na praia.' },
    { p: 'TE_OURO', c: 'S', i: ['Z', 'X'], dica: 'É um conjunto de riquezas escondido por piratas.' },
    { p: 'CA_AROLA', c: 'SS', i: ['Ç'], dica: 'É um tipo de panela funda.' }
];

/**
 * Ponto de entrada para gerar problemas de Ortografia.
 * @param {string} trilha - A chave da trilha.
 * @param {string} atividade - A chave da atividade.
 * @returns {object} O objeto do problema para o jogo.
 */
export function gerarProblemaOrtografia(trilha, atividade) {
    const problemaAtual = DADOS_CONTEUDO[Math.floor(Math.random() * DADOS_CONTEUDO.length)];
    const opcoes = [problemaAtual.c, ...problemaAtual.i];
    
    return {
        tipo: 'multipla_escolha',
        enunciado: problemaAtual.p.replace('_', '<span class="lacuna"></span>'),
        opcoes: opcoes.sort(() => Math.random() - 0.5), // Embaralha as opções
        respostaCorreta: problemaAtual.c,
        pontos: 15,
        dica: problemaAtual.dica
    };
}
