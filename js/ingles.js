window.AventuraDoSaber = window.AventuraDoSaber || {};

/**
 * Módulo de Inglês
 * Introdução ao vocabulário básico e estruturas simples da língua inglesa.
 */
window.AventuraDoSaber.ingles = {
    // DADOS contém a estrutura de trilhas e atividades da matéria.
    DADOS: {
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
    },

    /**
     * Gera uma pergunta com base na trilha e atividade selecionadas.
     * @param {string} trilha - A chave da trilha (ex: 'colors').
     * @param {string} atividade - A chave da atividade (ex: 'what_color').
     * @returns {object} - O objeto do problema para o jogo.
     */
    gerarProblema(trilha, atividade) {
        if (trilha === 'colors') {
            return {
                tipo: 'multipla_escolha',
                enunciado: 'Which option means "Amarelo" in English?',
                opcoes: ['Blue', 'Red', 'Green', 'Yellow'],
                respostaCorreta: 'Yellow'
            };
        }
        if (trilha === 'animals') {
             return {
                tipo: 'multipla_escolha',
                enunciado: 'What is the English word for "Cachorro"?',
                opcoes: ['Cat', 'Dog', 'Bird', 'Fish'],
                respostaCorreta: 'Dog'
            };
        }
        // Retorno padrão
        return {
            tipo: 'multipla_escolha',
            enunciado: 'How do you say "Olá" in English?',
            opcoes: ['Bye', 'Thanks', 'Hello', 'Sorry'],
            respostaCorreta: 'Hello'
        };
    }
};
