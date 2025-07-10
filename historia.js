window.AventuraDoSaber = window.AventuraDoSaber || {};

/**
 * Módulo de História
 * Concentra-se em explorar o passado, culturas e eventos importantes, 
 * estimulando o senso crítico e a compreensão da sociedade.
 */
window.AventuraDoSaber.historia = {
    // DADOS contém a estrutura de trilhas e atividades da matéria.
    DADOS: {
        brasil_colonial: { 
            nome: "Brasil Colonial", 
            icone: "�", 
            atividades: { 
                chegada_portugueses: { nome: "A Chegada dos Portugueses", icone: "⛵" } 
            } 
        },
        antiguidade: {
            nome: "Antiguidade",
            icone: "🏛️",
            atividades: {
                egito_antigo: { nome: "Egito Antigo", icone: "🏺" }
            }
        }
    },

    /**
     * Gera uma pergunta com base na trilha e atividade selecionadas.
     * @param {string} trilha - A chave da trilha (ex: 'brasil_colonial').
     * @param {string} atividade - A chave da atividade (ex: 'chegada_portugueses').
     * @returns {object} - O objeto do problema para o jogo.
     */
    gerarProblema(trilha, atividade) {
        // Este é um exemplo simples. No futuro, podemos ter um banco de perguntas.
        if (trilha === 'brasil_colonial') {
            return {
                tipo: 'multipla_escolha',
                enunciado: 'Quem é considerado o "descobridor" do Brasil em 1500?',
                opcoes: ['Pedro Álvares Cabral', 'Cristóvão Colombo', 'Vasco da Gama', 'Tiradentes'],
                respostaCorreta: 'Pedro Álvares Cabral'
            };
        }
        if (trilha === 'antiguidade') {
             return {
                tipo: 'multipla_escolha',
                enunciado: 'Qual civilização antiga construiu as pirâmides de Gizé?',
                opcoes: ['Gregos', 'Romanos', 'Egípcios', 'Maias'],
                respostaCorreta: 'Egípcios'
            };
        }
        // Retorno padrão caso a trilha não seja encontrada
        return {
            tipo: 'multipla_escolha',
            enunciado: 'Qual a sua matéria favorita?',
            opcoes: ['História', 'Geografia', 'Ciências', 'Matemática'],
            respostaCorreta: 'História'
        };
    }
};
