window.AventuraDoSaber = window.AventuraDoSaber || {};

/**
 * Módulo de Geografia
 * Estuda o espaço geográfico, a relação entre o ser humano e o ambiente,
 * e as características do planeta.
 */
window.AventuraDoSaber.geografia = {
    // DADOS contém a estrutura de trilhas e atividades da matéria.
    DADOS: {
        brasil_regioes: { 
            nome: "Regiões do Brasil", 
            icone: "🗺️", 
            atividades: { 
                capitais: { nome: "Adivinhe a Capital", icone: "📍" } 
            } 
        },
        planeta_terra: {
            nome: "Planeta Terra",
            icone: "🌎",
            atividades: {
                oceanos: { nome: "Oceanos do Mundo", icone: "🌊" }
            }
        }
    },

    /**
     * Gera uma pergunta com base na trilha e atividade selecionadas.
     * @param {string} trilha - A chave da trilha (ex: 'brasil_regioes').
     * @param {string} atividade - A chave da atividade (ex: 'capitais').
     * @returns {object} - O objeto do problema para o jogo.
     */
    gerarProblema(trilha, atividade) {
        if (trilha === 'brasil_regioes') {
            return {
                tipo: 'multipla_escolha',
                enunciado: 'Qual é a capital do estado da Bahia?',
                opcoes: ['Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'São Paulo'],
                respostaCorreta: 'Salvador'
            };
        }
        if (trilha === 'planeta_terra') {
             return {
                tipo: 'multipla_escolha',
                enunciado: 'Qual é o maior oceano do mundo?',
                opcoes: ['Atlântico', 'Índico', 'Ártico', 'Pacífico'],
                respostaCorreta: 'Pacífico'
            };
        }
        // Retorno padrão
        return {
            tipo: 'multipla_escolha',
            enunciado: 'Onde o sol nasce?',
            opcoes: ['Leste', 'Oeste', 'Norte', 'Sul'],
            respostaCorreta: 'Leste'
        };
    }
};
