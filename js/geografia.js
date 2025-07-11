/**
 * geografia.js
 * Módulo de Geografia
 * Estuda o espaço geográfico, a relação entre o ser humano e o ambiente,
 * e as características do planeta.
 * * Este arquivo foi convertido para o formato de módulo ES6.
 */

// DADOS contém a estrutura de trilhas e atividades da matéria.
export const DADOS_GEOGRAFIA = {
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
};

/**
 * Gera uma pergunta com base na trilha e atividade selecionadas.
 * @param {string} trilha - A chave da trilha (ex: 'brasil_regioes').
 * @param {string} atividade - A chave da atividade (ex: 'capitais').
 * @returns {object} - O objeto do problema para o jogo.
 */
export function gerarProblemaGeografia(trilha, atividade) {
    if (trilha === 'brasil_regioes' && atividade === 'capitais') {
        const estados = [
            { estado: 'Bahia', capital: 'Salvador' },
            { estado: 'São Paulo', capital: 'São Paulo' },
            { estado: 'Rio de Janeiro', capital: 'Rio de Janeiro' },
            { estado: 'Minas Gerais', capital: 'Belo Horizonte' },
            { estado: 'Pernambuco', capital: 'Recife' },
            { estado: 'Ceará', capital: 'Fortaleza' }
        ];
        const todasCapitais = estados.map(e => e.capital);
        const estadoEscolhido = estados[Math.floor(Math.random() * estados.length)];
        
        let opcoes = new Set([estadoEscolhido.capital]);
        while(opcoes.size < 4) {
            const capitalAleatoria = todasCapitais[Math.floor(Math.random() * todasCapitais.length)];
            opcoes.add(capitalAleatoria);
        }

        return {
            tipo: 'multipla_escolha',
            enunciado: `Qual é a capital do estado de ${estadoEscolhido.estado}?`,
            opcoes: Array.from(opcoes),
            respostaCorreta: estadoEscolhido.capital,
            pontos: 20,
            dica: 'É uma cidade famosa por seu carnaval e história.'
        };
    }
    if (trilha === 'planeta_terra' && atividade === 'oceanos') {
         return {
            tipo: 'multipla_escolha',
            enunciado: 'Qual é o maior oceano do mundo?',
            opcoes: ['Atlântico', 'Índico', 'Ártico', 'Pacífico'],
            respostaCorreta: 'Pacífico',
            pontos: 15,
            dica: 'Ele banha a costa oeste da América e a costa leste da Ásia.'
        };
    }
    
    // Retorno padrão
    return {
        tipo: 'multipla_escolha',
        enunciado: 'O movimento de rotação da Terra é responsável por criar...',
        opcoes: ['Os dias e as noites', 'As estações do ano', 'Os continentes', 'As marés'],
        respostaCorreta: 'Os dias e as noites',
        pontos: 10,
        dica: 'Pense no que acontece quando a Terra gira em torno de si mesma.'
    };
}
