/**
 * ciencias.js
 * Módulo de Ciências
 * Investigação do mundo natural, envolvendo física, química e biologia, 
 * com foco em experimentos e observação.
 * * Este arquivo foi convertido para o formato de módulo ES6.
 */

// DADOS contém a estrutura de trilhas e atividades da matéria.
export const DADOS_CIENCIAS = {
    corpo_humano: { 
        nome: "Corpo Humano", 
        icone: "🧑‍⚕️", 
        atividades: { 
            sistemas: { nome: "Sistemas do Corpo", icone: "🧠" } 
        } 
    },
    seres_vivos: {
        nome: "Seres Vivos",
        icone: "�",
        atividades: {
            cadeia_alimentar: { nome: "Cadeia Alimentar", icone: "🦁" }
        }
    }
};

/**
 * Gera uma pergunta com base na trilha e atividade selecionadas.
 * @param {string} trilha - A chave da trilha (ex: 'corpo_humano').
 * @param {string} atividade - A chave da atividade (ex: 'sistemas').
 * @returns {object} - O objeto do problema para o jogo.
 */
export function gerarProblemaCiencias(trilha, atividade) {
    if (trilha === 'corpo_humano' && atividade === 'sistemas') {
        return {
            tipo: 'multipla_escolha',
            enunciado: 'Qual órgão é responsável por bombear o sangue para todo o corpo?',
            opcoes: ['Cérebro', 'Pulmões', 'Coração', 'Estômago'],
            respostaCorreta: 'Coração',
            pontos: 15,
            dica: 'Ele bate sem parar dentro do seu peito.'
        };
    }
    if (trilha === 'seres_vivos' && atividade === 'cadeia_alimentar') {
         return {
            tipo: 'multipla_escolha',
            enunciado: 'Qual destes seres vivos é considerado um PRODUTOR na cadeia alimentar?',
            opcoes: ['Leão', 'Gafanhoto', 'Planta', 'Cobra'],
            respostaCorreta: 'Planta',
            pontos: 20,
            dica: 'Produtores são seres que fabricam o próprio alimento, geralmente usando a luz do sol.'
        };
    }
    
    // Retorno padrão caso a combinação não seja encontrada
    return {
        tipo: 'multipla_escolha',
        enunciado: 'Qual processo as plantas usam para produzir seu próprio alimento?',
        opcoes: ['Respiração', 'Fotossíntese', 'Digestão', 'Erosão'],
        respostaCorreta: 'Fotossíntese',
        pontos: 15,
        dica: 'É um processo que usa a luz do sol para transformar gás carbônico em energia.'
    };
}
