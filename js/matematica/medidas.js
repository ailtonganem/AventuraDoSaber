/**
 * medidas.js
 * Módulo para problemas de medidas, como horas e dinheiro.
 * * Este arquivo foi convertido para o formato de módulo ES6.
 */

// DADOS contém a estrutura de trilhas e atividades da matéria.
export const DADOS_MEDIDAS = {
    leitura_horas: { nome: "Leitura de Horas", icone: "⏰", atividades: { acerte_relogio: { nome: "Acerte o Relógio", icone: "⏱️" } } },
    dinheiro: { 
        nome: "Nosso Dinheiro", 
        icone: "💰", 
        atividades: { 
            desafio_caixa: { nome: "Desafio do Caixa", icone: "🛒" }, // Jogo de pagar
            dando_troco: { nome: "Dando o Troco", icone: "💸" }     // Jogo de dar o troco
        } 
    }
};

// --- Funções Auxiliares (não exportadas) ---

function _gerarProblemaRelogio() {
    const hora = Math.floor(Math.random() * 12) + 1;
    const minuto = (Math.floor(Math.random() * 12)) * 5;
    const horaFormatada = String(hora).padStart(2, '0');
    const minutoFormatado = String(minuto).padStart(2, '0');
    const enunciado = `Ajuste o relógio para: <strong>${horaFormatada}:${minutoFormatado}</strong>`;
    const relogioHTML = `<div class="relogio-container"><div class="relogio-face"><div class="ponto-central"></div><div class="ponteiro" id="ponteiro-hora"></div><div class="ponteiro" id="ponteiro-minuto"></div><div class="numero numero-12">12</div><div class="numero numero-1">1</div><div class="numero numero-2">2</div><div class="numero numero-3">3</div><div class="numero numero-4">4</div><div class="numero numero-5">5</div><div class="numero numero-6">6</div><div class="numero numero-7">7</div><div class="numero numero-8">8</div><div class="numero numero-9">9</div><div class="numero numero-10">10</div><div class="numero numero-11">11</div></div></div><button id="btn-verificar-relogio" class="botao-resposta">Verificar</button>`;
    
    return {
        tipo: 'relogio_interativo',
        enunciado: enunciado,
        objetosHTML: relogioHTML,
        respostaCorreta: { hora, minuto },
        pontos: 30,
        dica: 'O ponteiro pequeno marca as horas e o grande marca os minutos. Cada número no relógio representa 5 minutos.'
    };
}

// Template reutilizável para os jogos de dinheiro
function _templateJogoDinheiro(enunciado, respostaCorreta, textoBotao, dica) {
    const dinheiroDisponivel = [
        { valor: 1000, tipo: 'nota', display: 'R$ 10' }, { valor: 500, tipo: 'nota', display: 'R$ 5' },
        { valor: 200, tipo: 'nota', display: 'R$ 2' }, { valor: 100, tipo: 'moeda', display: 'R$ 1' },
        { valor: 50, tipo: 'moeda', display: '50¢' }, { valor: 25, tipo: 'moeda', display: '25¢' },
        { valor: 10, tipo: 'moeda', display: '10¢' }, { valor: 5, tipo: 'moeda', display: '5¢' }
    ];

    let carteiraHTML = '<div class="carteira">';
    dinheiroDisponivel.forEach(d => {
        carteiraHTML += `<div class="dinheiro ${d.tipo}" draggable="true" data-valor="${d.valor}">${d.display}</div>`;
    });
    carteiraHTML += '</div>';

    const jogoHTML = `<div class="container-caixa">${carteiraHTML}<div class="bandeja-pagamento" id="bandeja-pagamento"><span class="total-pago">Total: R$ 0,00</span></div></div><button id="btn-verificar" class="botao-resposta">${textoBotao}</button>`;

    return {
        tipo: 'drag_drop_dinheiro',
        enunciado: enunciado,
        objetosHTML: jogoHTML,
        respostaCorreta: respostaCorreta,
        pontos: 35,
        dica: dica
    };
}

// Jogo original de pagar a conta
function _gerarProblemaCaixa() {
    const pecas = [1000, 500, 200, 100, 50, 25, 10, 5];
    let precoEmCentavos = 0;
    const minPreco = 200, maxPreco = 1500;
    while (precoEmCentavos < minPreco) {
        const pecaAleatoria = pecas[Math.floor(Math.random() * pecas.length)];
        if (precoEmCentavos + pecaAleatoria <= maxPreco) precoEmCentavos += pecaAleatoria;
    }
    const precoFormatado = (precoEmCentavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const enunciado = `O item custa <strong>${precoFormatado}</strong>. Arraste o valor exato para a bandeja!`;
    const dica = 'Vá somando as notas e moedas na bandeja até o total ser igual ao preço do item.';
    return _templateJogoDinheiro(enunciado, precoEmCentavos, "Pagar", dica);
}

// Novo jogo de dar o troco
function _gerarProblemaTroco() {
    const pecas = [1000, 500, 200, 100, 50, 25, 10, 5];
    let precoEmCentavos = 0, notaPaga = 0, trocoCorreto = 0, trocoEhFormavel = false;
    
    while (!trocoEhFormavel) {
        precoEmCentavos = 0;
        const numPecas = Math.floor(Math.random() * 4) + 3;
        for (let i = 0; i < numPecas; i++) {
            precoEmCentavos += pecas[Math.floor(Math.random() * pecas.length)];
        }
        if (precoEmCentavos < 1800) { notaPaga = 2000; }
        else if (precoEmCentavos < 4800) { notaPaga = 5000; }
        else { notaPaga = 10000; }
        if (notaPaga <= precoEmCentavos) continue;
        trocoCorreto = notaPaga - precoEmCentavos;
        let trocoRestante = trocoCorreto;
        for (const peca of pecas) {
            trocoRestante -= Math.floor(trocoRestante / peca) * peca;
        }
        if (trocoRestante === 0) trocoEhFormavel = true;
    }
    
    const precoFormatado = (precoEmCentavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const notaPagaFormatada = (notaPaga / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const enunciado = `<div class="enunciado-troco"><span>O item custa: <strong>${precoFormatado}</strong></span><span>O cliente pagou com: <strong>${notaPagaFormatada}</strong></span><hr><span>Monte o troco correto na bandeja!</span></div>`;
    const dica = 'Primeiro, calcule quanto é o troco (valor pago - preço). Depois, monte esse valor com as peças.';
    return _templateJogoDinheiro(enunciado, trocoCorreto, "Entregar Troco", dica);
}

/**
 * Ponto de entrada para gerar problemas de medidas.
 * @param {string} trilha - A chave da trilha.
 * @param {string} atividade - A chave da atividade.
 * @returns {object} O objeto do problema para o jogo.
 */
export function gerarProblemaMedidas(trilha, atividade) {
    if (atividade === 'acerte_relogio') return _gerarProblemaRelogio();
    if (atividade === 'desafio_caixa') return _gerarProblemaCaixa();
    if (atividade === 'dando_troco') return _gerarProblemaTroco();

    // Retorno padrão
    return _gerarProblemaRelogio();
}
