/**
 * ingles.js
 * Módulo de Inglês
 * Introdução ao vocabulário básico e estruturas simples da língua inglesa.
 * * Este arquivo foi convertido para o formato de módulo ES6.
 */

// DADOS contém a estrutura de trilhas e atividades da matéria.
export const DADOS_INGLES = {
    colors: { 
        nome: "Colors", 
        icone: "🎨", 
        atividades: { 
            what_color: { nome: "What color is this?", icone: "🖌️" } 
        } 
    },
    animals: {
        nome: "Animals",
        icone: "🐾",
        atividades: {
            what_animal: { nome: "What animal is this?", icone: "❓" }
        }
    }
};

// Banco de perguntas para tornar o jogo mais dinâmico
const PERGUNTAS_CORES = [
    { pt: 'Amarelo', en: 'Yellow', opcoes: ['Blue', 'Red', 'Green', 'Yellow'] },
    { pt: 'Azul', en: 'Blue', opcoes: ['Blue', 'Orange', 'Purple', 'White'] },
    { pt: 'Vermelho', en: 'Red', opcoes: ['Pink', 'Red', 'Black', 'Yellow'] },
    { pt: 'Verde', en: 'Green', opcoes: ['Green', 'Gray', 'Brown', 'Blue'] }
];

const PERGUNTAS_ANIMAIS = [
    { pt: 'Cachorro', en: 'Dog', opcoes: ['Cat', 'Dog', 'Bird', 'Fish'] },
    { pt: 'Gato', en: 'Cat', opcoes: ['Lion', 'Tiger', 'Cat', 'Dog'] },
    { pt: 'Pássaro', en: 'Bird', opcoes: ['Fish', 'Monkey', 'Bird', 'Snake'] },
    { pt: 'Peixe', en: 'Fish', opcoes: ['Shark', 'Whale', 'Dolphin', 'Fish'] }
];

/**
 * Gera uma pergunta com base na trilha e atividade selecionadas.
 * @param {string} trilha - A chave da trilha (ex: 'colors').
 * @param {string} atividade - A chave da atividade (ex: 'what_color').
 * @returns {object} - O objeto do problema para o jogo.
 */
export function gerarProblemaIngles(trilha, atividade) {
    if (trilha === 'colors') {
        const pergunta = PERGUNTAS_CORES[Math.floor(Math.random() * PERGUNTAS_CORES.length)];
        return {
            tipo: 'multipla_escolha',
            enunciado: `Which option means "${pergunta.pt}" in English?`,
            opcoes: pergunta.opcoes.sort(() => Math.random() - 0.5), // Embaralha as opções
            respostaCorreta: pergunta.en,
            pontos: 15,
            dica: 'Think about the colors of the rainbow.'
        };
    }
    if (trilha === 'animals') {
        const pergunta = PERGUNTAS_ANIMAIS[Math.floor(Math.random() * PERGUNTAS_ANIMAIS.length)];
        return {
            tipo: 'multipla_escolha',
            enunciado: `What is the English word for "${pergunta.pt}"?`,
            opcoes: pergunta.opcoes.sort(() => Math.random() - 0.5), // Embaralha as opções
            respostaCorreta: pergunta.en,
            pontos: 15,
            dica: 'It is a very common pet.'
        };
    }
    
    // Retorno padrão
    return {
        tipo: 'multipla_escolha',
        enunciado: 'How do you say "Olá" in English?',
        opcoes: ['Bye', 'Thanks', 'Hello', 'Sorry'],
        respostaCorreta: 'Hello',
        pontos: 10,
        dica: 'It is a common greeting.'
    };
}
