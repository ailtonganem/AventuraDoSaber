window.AventuraDoSaber = window.AventuraDoSaber || {};

window.AventuraDoSaber.resolucao_problemas = {
    // Lista de templates de problemas
    PROBLEMAS: [
        { texto: 'Em uma cesta há [N1] laranjas e em outra há [N2] maçãs. Quantas frutas há nas duas cestas?', operacao: '+', pergunta: 'Total de frutas:' },
        { texto: 'Maria tinha [N1] figurinhas e ganhou mais [N2] de seu amigo. Com quantas figurinhas Maria ficou?', operacao: '+', pergunta: 'Total de figurinhas:' },
        { texto: 'Um aquário tem [N1] peixes. Se comprarmos mais [N2] peixes, quantos peixes o aquário terá?', operacao: '+', pergunta: 'Total de peixes:' },
        { texto: 'João tinha [N1] balões, mas [N2] estouraram. Quantos balões sobraram?', operacao: '-', pergunta: 'Balões restantes:' },
        { texto: 'Havia [N1] biscoitos no pote. Se comermos [N2], quantos biscoitos restarão?', operacao: '-', pergunta: 'Biscoitos restantes:' },
        { texto: 'Uma caixa tem [N1] lápis de cor. Se [N2] lápis forem perdidos, quantos sobrarão?', operacao: '-', pergunta: 'Lápis restantes:' },
        { texto: 'Uma caixa de bombons tem [N1] fileiras com [N2] bombons em cada uma. Quantos bombons há na caixa?', operacao: '×', pergunta: 'Total de bombons:' },
        { texto: 'Em uma festa, há [N1] mesas com [N2] cadeiras cada. Quantas pessoas podem se sentar?', operacao: '×', pergunta: 'Total de lugares:' },
        { texto: 'Um livro tem [N1] páginas por capítulo. Se o livro tem [N2] capítulos, qual o total de páginas?', operacao: '×', pergunta: 'Total de páginas:' },
        { texto: 'Queremos dividir [N1] doces igualmente entre [N2] crianças. Quantos doces cada uma receberá?', operacao: '÷', pergunta: 'Doces por criança:' },
        { texto: 'Uma professora tem [N1] adesivos para distribuir para seus [N2] alunos. Quantos adesivos cada aluno ganha?', operacao: '÷', pergunta: 'Adesivos por aluno:' },
    ],

    DADOS: {
        resolucao_problemas: { nome: "Resolvendo Problemas", icone: "🧠", atividades: { aventura_dia: { nome: "Aventura do Dia", icone: "🏞️" } } }
    },

    gerarProblema(trilha, atividade) {
        const template = this.PROBLEMAS[Math.floor(Math.random() * this.PROBLEMAS.length)];
        let n1, n2, resposta;

        switch (template.operacao) {
            case '+': n1 = Math.floor(Math.random() * 50) + 10; n2 = Math.floor(Math.random() * 50) + 10; resposta = n1 + n2; break;
            case '-': n1 = Math.floor(Math.random() * 50) + 50; n2 = Math.floor(Math.random() * 49) + 1; resposta = n1 - n2; break;
            case '×': n1 = Math.floor(Math.random() * 8) + 2; n2 = Math.floor(Math.random() * 8) + 2; resposta = n1 * n2; break;
            case '÷': n2 = Math.floor(Math.random() * 8) + 2; resposta = Math.floor(Math.random() * 8) + 2; n1 = n2 * resposta; break;
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
            respostaCorreta: resposta
        };
    }
};