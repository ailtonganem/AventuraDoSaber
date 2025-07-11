/**
 * historia.js
 * Módulo de História
 * Concentra-se em explorar o passado, culturas e eventos importantes, 
 * estimulando o senso crítico e a compreensão da sociedade.
 * * Este arquivo foi convertido para o formato de módulo ES6.
 */

// DADOS contém a estrutura de trilhas e atividades da matéria.
export const DADOS_HISTORIA = {
    brasil_colonial: { 
        nome: "Brasil Colonial", 
        icone: "📜", 
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
};

/**
 * Gera uma pergunta com base na trilha e atividade selecionadas.
 * @param {string} trilha - A chave da trilha (ex: 'brasil_colonial').
 * @param {string} atividade - A chave da atividade (ex: 'chegada_portugueses').
 * @returns {object} - O objeto do problema para o jogo.
 */
export function gerarProblemaHistoria(trilha, atividade) {
    if (trilha === 'brasil_colonial' && atividade === 'chegada_portugueses') {
        return {
            tipo: 'multipla_escolha',
            enunciado: 'Quem é considerado o "descobridor" do Brasil em 1500?',
            opcoes: ['Pedro Álvares Cabral', 'Cristóvão Colombo', 'Vasco da Gama', 'Tiradentes'],
            respostaCorreta: 'Pedro Álvares Cabral',
            pontos: 15,
            dica: 'Ele era um navegador português que liderava uma grande expedição.'
        };
    }
    if (trilha === 'antiguidade' && atividade === 'egito_antigo') {
         return {
            tipo: 'multipla_escolha',
            enunciado: 'Qual civilização antiga construiu as pirâmides de Gizé?',
            opcoes: ['Gregos', 'Romanos', 'Egípcios', 'Maias'],
            respostaCorreta: 'Egípcios',
            pontos: 20,
            dica: 'Eles viviam às margens do Rio Nilo e tinham faraós como governantes.'
        };
    }
    
    // Retorno padrão
    return {
        tipo: 'multipla_escolha',
        enunciado: 'A invenção da escrita marcou o fim da Pré-História e o início da...',
        opcoes: ['Idade Média', 'História Antiga', 'Idade Moderna', 'Idade do Ferro'],
        respostaCorreta: 'História Antiga',
        pontos: 10,
        dica: 'É o período que vem logo depois da Pré-História.'
    };
}
