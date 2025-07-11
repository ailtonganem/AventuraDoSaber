/**
 * resolucao_problemas.js
 * Módulo para problemas que envolvem interpretação de texto e aplicação de operações matemáticas.
 * * Este arquivo foi convertido para o formato de módulo ES6.
 */

// DADOS contém a estrutura de trilhas e atividades da matéria.
export const DADOS_RESOLUCAO_PROBLEMAS = {
    resolucao_problemas: { nome: "Resolvendo Problemas", icone: "🧠", atividades: { aventura_dia: { nome: "Aventura do Dia", icone: "🏞️" } } }
};

// Lista de templates de problemas para serem preenchidos com números aleatórios.
const PROBLEMAS = [
    { texto: 'Em uma cesta há [N1] laranjas e em outra há [N2] maçãs. Quantas frutas há nas duas cestas?', operacao: '+', pergunta: 'Total de frutas:', dica: 'Para achar o total, você precisa juntar as quantidades.' },
    { texto: 'Maria tinha [N1] figurinhas e ganhou mais [N2] de seu amigo. Com quantas figurinhas Maria ficou?', operacao: '+', pergunta: 'Total de figurinhas:', dica: 'Se ela ganhou mais, a quantidade aumentou. Use a adição.' },
    { texto: 'Um aquário tem [N1] peixes. Se comprarmos mais [N2] peixes, quantos peixes o aquário terá?', operacao: '+', pergunta: 'Total de peixes:', dica: 'Junte o número de peixes que já existiam com os novos.' },
    { texto: 'João tinha [N1] balões, mas [N2] estouraram. Quantos balões sobraram?', operacao: '-', pergunta: 'Balões restantes:', dica: 'Se alguns estouraram, a quantidade diminuiu. Use a subtração.' },
    { texto: 'Havia [N1] biscoitos no pote. Se comermos [N2], quantos biscoitos restarão?', operacao: '-', pergunta: 'Biscoitos restantes:', dica: 'Para saber quantos sobraram, retire os que foram comidos do total.' },
    { texto: 'Uma caixa tem [N1] lápis de cor. Se [N2] lápis forem perdidos, quantos sobrarão?', operacao: '-', pergunta: 'Lápis restantes:', dica: 'A quantidade inicial de lápis diminuiu. Qual operação usamos?' },
    { texto: 'Uma caixa de bombons tem [N1] fileiras com [N2] bombons em cada uma. Quantos bombons há na caixa?', operacao: '×', pergunta: 'Total de bombons:', dica: 'É a soma de [N2] bombons, [N1] vezes. A multiplicação pode ajudar.' },
    { texto: 'Em uma festa, há [N1] mesas com [N2] cadeiras cada. Quantas pessoas podem se sentar?', operacao: '×', pergunta: 'Total de lugares:', dica: 'Multiplique o número de mesas pelo número de cadeiras em cada uma.' },
    { texto: 'Um livro tem [N1] páginas por capítulo. Se o livro tem [N2] capítulos, qual o total de páginas?', operacao: '×', pergunta: 'Total de páginas:', dica: 'Pense em [N2] grupos de [N1] páginas.' },
    { texto: 'Queremos dividir [N1] doces igualmente entre [N2] crianças. Quantos doces cada uma receberá?', operacao: '÷', pergunta: 'Doces por criança:', dica: 'Use a divisão para repartir os doces igualmente.' },
    { texto: 'Uma professora tem [N1] adesivos para distribuir para seus [N2] alunos. Quantos adesivos cada aluno ganha?', operacao: '÷', pergunta: 'Adesivos por aluno:', dica: 'Divida o total de adesivos pelo número de alunos.' },
];

/**
 * Ponto de entrada para gerar problemas de Resolução de Problemas.
 * @param {string} trilha - A chave da trilha.
 * @param {string} atividade - A chave da atividade.
 * @returns {object} O objeto do problema para o jogo.
 */
export function gerarProblemaResolucaoProblemas(trilha, atividade) {
    const template = PROBLEMAS[Math.floor(Math.random() * PROBLEMAS.length)];
    let n1, n2, resposta, pontos;

    switch (template.operacao) {
        case '+':
            n1 = Math.floor(Math.random() * 50) + 10;
            n2 = Math.floor(Math.random() * 50) + 10;
            resposta = n1 + n2;
            pontos = 20;
            break;
        case '-':
            n1 = Math.floor(Math.random() * 50) + 50;
            n2 = Math.floor(Math.random() * 49) + 1;
            resposta = n1 - n2;
            pontos = 20;
            break;
        case '×':
            n1 = Math.floor(Math.random() * 8) + 2;
            n2 = Math.floor(Math.random() * 8) + 2;
            resposta = n1 * n2;
            pontos = 25;
            break;
        case '÷':
            n2 = Math.floor(Math.random() * 8) + 2;
            resposta = Math.floor(Math.random() * 8) + 2;
            n1 = n2 * resposta;
            pontos = 25;
            break;
    }

    const enunciado = template.texto.replace('[N1]', `<strong>${n1}</strong>`).replace('[N2]', `<strong>${n2}</strong>`);
    const pergunta = `<p>${template.pergunta}</p>`;
    
    const keypadHTML = `
        <div class="container-keypad">
            <div class="display-keypad" id="display-keypad"></div>
            <div class="botoes-keypad">
                <button data-key="7">7</button> <button data-key="8">8</button> <button data-key="9">9</button>
                <button data-key="4">4</button> <button data-key="5">5</button> <button data-key="6">6</button>
                <button data-key="1">1</button> <button data-key="2">2</button> <button data-key="3">3</button>
                <button data-key="apagar">⬅</button> <button data-key="0">0</button> <button data-key="ok">OK</button>
            </div>
        </div>
    `;

    return {
        tipo: 'keypad_input',
        enunciado: `${enunciado} ${pergunta}`,
        objetosHTML: keypadHTML,
        respostaCorreta: resposta,
        pontos: pontos,
        dica: template.dica
    };
}
