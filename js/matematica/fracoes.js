/**
 * fracoes.js
 * Módulo para problemas envolvendo frações.
 * * Este arquivo foi convertido para o formato de módulo ES6.
 */

// DADOS contém a estrutura de trilhas e atividades da matéria.
export const DADOS_FRACOES = {
    fracoes_conceito: { nome: "O que é Fração?", icone: "🍕", atividades: { qual_e_a_fracao: { nome: "Qual é a Fração?", icone: "🤔" } } },
    tipos_fracoes: { nome: "Tipos de Frações", icone: "📚", atividades: { classificador: { nome: "Classificador de Pizzas", icone: "📥" } } },
    fracoes_equivalentes: { nome: "Frações Equivalentes", icone: "⚖️", atividades: { balanca: { nome: "Balança da Equivalência", icone: "🟰" } } }
};

// --- Funções Auxiliares (não exportadas) ---

// Gera o HTML para a representação visual de uma fração.
function _gerarVisualFracao(numerador, denominador) {
    let visual = '<div class="fracao-visual">';
    for (let i = 0; i < denominador; i++) {
        visual += `<div class="parte ${i < numerador ? 'preenchida' : ''}"></div>`;
    }
    visual += '</div>';
    return visual;
}

// Gera um problema sobre o conceito básico de frações.
function _gerarProblemaConceito() {
    const d = Math.floor(Math.random() * 7) + 2; // Denominador entre 2 e 8
    const n = Math.floor(Math.random() * (d - 1)) + 1; // Numerador menor que o denominador
    const respostaCorreta = `${n}/${d}`;
    const enunciado = `Que fração representa a parte colorida?<br>${_gerarVisualFracao(n, d)}`;
    
    let opcoes = new Set([respostaCorreta]);
    while (opcoes.size < 4) {
        const nIncorreto = Math.floor(Math.random() * (d - 1)) + 1;
        const dIncorreto = Math.floor(Math.random() * 7) + 2;
        const opcaoIncorreta = (Math.random() > 0.5) ? `${nIncorreto}/${d}` : `${n}/${dIncorreto}`;
        if (opcaoIncorreta !== respostaCorreta) {
            opcoes.add(opcaoIncorreta);
        }
    }
    return {
        tipo: 'multipla_escolha',
        enunciado: enunciado,
        opcoes: Array.from(opcoes),
        respostaCorreta: respostaCorreta,
        pontos: 15,
        dica: 'O número de baixo (denominador) é o total de partes. O de cima (numerador) é quantas partes foram coloridas.'
    };
}

// Gera um problema sobre tipos de frações (própria, imprópria, mista).
function _gerarProblemaTipos() {
    const tipos = ['propria', 'impropria', 'mista'];
    const tipoAlvo = tipos[Math.floor(Math.random() * tipos.length)];
    let n, d, i = 0, fracaoDisplay = '';

    switch (tipoAlvo) {
        case 'propria':
            d = Math.floor(Math.random() * 5) + 3;
            n = Math.floor(Math.random() * (d - 1)) + 1;
            fracaoDisplay = `<sup>${n}</sup>⁄<sub>${d}</sub>`;
            break;
        case 'impropria':
            d = Math.floor(Math.random() * 4) + 2;
            n = d + Math.floor(Math.random() * 4) + 1;
            fracaoDisplay = `<sup>${n}</sup>⁄<sub>${d}</sub>`;
            break;
        case 'mista':
            d = Math.floor(Math.random() * 5) + 3;
            n = Math.floor(Math.random() * (d - 1)) + 1;
            i = Math.floor(Math.random() * 2) + 1;
            fracaoDisplay = `${i} <sup>${n}</sup>⁄<sub>${d}</sub>`;
            break;
    }
    const enunciado = `Arraste a fração para a caixa correta!`;
    const objetosHTML = `<div class="container-classificacao"><div class="item-classificavel" draggable="true">${fracaoDisplay}</div><div class="caixas-destino"><div class="caixa-classificacao" data-tipo="propria"><span>Própria</span></div><div class="caixa-classificacao" data-tipo="impropria"><span>Imprópria</span></div><div class="caixa-classificacao" data-tipo="mista"><span>Mista</span></div></div></div>`;
    
    return {
        tipo: 'drag_classificacao',
        enunciado: enunciado,
        objetosHTML: objetosHTML,
        respostaCorreta: tipoAlvo,
        pontos: 25,
        dica: 'Fração própria: o de cima é menor. Imprópria: o de cima é maior. Mista: tem um número inteiro junto.'
    };
}

// Gera um problema sobre frações equivalentes.
function _gerarProblemaEquivalentes() {
    const bases = [[1, 2], [1, 3], [1, 4], [2, 3]];
    const base = bases[Math.floor(Math.random() * bases.length)];
    const multiplicador = Math.floor(Math.random() * 3) + 2; // 2, 3 ou 4

    const n1 = base[0], d1 = base[1];
    const n2 = n1 * multiplicador, d2 = d1 * multiplicador;

    const visualFracao = _gerarVisualFracao(n1, d1);
    const respostaCorreta = `${n2}/${d2}`;
    
    const enunciado = `Qual fração é equivalente e equilibra a balança?
        <div class="balanca-container">
            <div class="prato-balanca">${visualFracao} <span><sup>${n1}</sup>⁄<sub>${d1}</sub></span></div>
            <div class="pivo-balanca"></div>
            <div class="prato-balanca" id="prato-direito">?</div>
        </div>`;
    
    let opcoes = new Set([respostaCorreta]);
    while (opcoes.size < 4) {
        const numIncorreto = n2 + (Math.random() > 0.5 ? 1 : -1);
        const denIncorreto = d2 + (Math.random() > 0.5 ? 1 : -1);
        if (numIncorreto > 0 && denIncorreto > 0) {
            opcoes.add(`${numIncorreto}/${denIncorreto}`);
        }
    }
    
    return {
        tipo: 'multipla_escolha',
        enunciado: enunciado,
        opcoes: Array.from(opcoes),
        respostaCorreta: respostaCorreta,
        pontos: 20,
        dica: 'Para achar uma fração equivalente, multiplique o número de cima e o de baixo pelo mesmo número.'
    };
}

/**
 * Ponto de entrada principal para gerar problemas de frações.
 * Decide qual tipo de problema gerar com base na atividade.
 * @param {string} trilha - A chave da trilha (ex: 'fracoes_conceito').
 * @param {string} atividade - A chave da atividade (ex: 'qual_e_a_fracao').
 * @returns {object} - O objeto do problema para o jogo.
 */
export function gerarProblemaFracoes(trilha, atividade) {
    if (atividade === 'qual_e_a_fracao') return _gerarProblemaConceito();
    if (atividade === 'classificador') return _gerarProblemaTipos();
    if (atividade === 'balanca') return _gerarProblemaEquivalentes();

    // Retorno padrão caso a atividade não seja encontrada
    return _gerarProblemaConceito();
}
