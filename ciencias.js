window.AventuraDoSaber = window.AventuraDoSaber || {};

/**
 * Módulo de Ciências
 * Investigação do mundo natural, envolvendo física, química e biologia, 
 * com foco em experimentos e observação.
 */
window.AventuraDoSaber.ciencias = {
    // DADOS contém a estrutura de trilhas e atividades da matéria.
    DADOS: {
        corpo_humano: { 
            nome: "Corpo Humano", 
            icone: "�", 
            atividades: { 
                sistemas: { nome: "Sistemas do Corpo", icone: "🧠" } 
            } 
        },
        seres_vivos: {
            nome: "Seres Vivos",
            icone: "🌿",
            atividades: {
                cadeia_alimentar: { nome: "Cadeia Alimentar", icone: "🦁" }
            }
        }
    },

    /**
     * Gera uma pergunta com base na trilha e atividade selecionadas.
     * @param {string} trilha - A chave da trilha (ex: 'corpo_humano').
     * @param {string} atividade - A chave da atividade (ex: 'sistemas').
     * @returns {object} - O objeto do problema para o jogo.
     */
    gerarProblema(trilha, atividade) {
        if (trilha === 'corpo_humano') {
            return {
                tipo: 'multipla_escolha',
                enunciado: 'Qual órgão é responsável por bombear o sangue para todo o corpo?',
                opcoes: ['Cérebro', 'Pulmões', 'Coração', 'Estômago'],
                respostaCorreta: 'Coração'
            };
        }
        if (trilha === 'seres_vivos') {
             return {
                tipo: 'multipla_escolha',
                enunciado: 'Qual destes seres vivos é considerado um produtor na cadeia alimentar?',
                opcoes: ['Leão', 'Gafanhoto', 'Planta', 'Cobra'],
                respostaCorreta: 'Planta'
            };
        }
        // Retorno padrão
        return {
            tipo: 'multipla_escolha',
            enunciado: 'Qual processo as plantas usam para produzir seu próprio alimento?',
            opcoes: ['Respiração', 'Fotossíntese', 'Digestão', 'Erosão'],
            respostaCorreta: 'Fotossíntese'
        };
    }
};
