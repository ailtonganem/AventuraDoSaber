// Garante que o objeto global AventuraDoSaber exista
window.AventuraDoSaber = window.AventuraDoSaber || {};

// Adiciona os dados de OPERAÇÕES ao nosso objeto global
window.AventuraDoSaber.operacoes = {
    DADOS: {
        adicao: { nome: "Adição", icone: "➕", atividades: { classico: { nome: "Desafio Clássico", icone: "🎯" } } },
        subtracao: { nome: "Subtração", icone: "➖", atividades: { classico: { nome: "Desafio Clássico", icone: "🎯" } } },
        multiplicacao: { nome: "Multiplicação", icone: "✖️", atividades: { classico: { nome: "Desafio Clássico", icone: "🎯" } } },
        divisao: { nome: "Divisão", icone: "➗", atividades: { classico: { nome: "Desafio Clássico", icone: "🎯" } } }
    },

    /**
     * Gera uma pergunta com base na trilha, atividade e idade do jogador.
     * @param {string} trilha - A chave da trilha (ex: 'adicao').
     * @param {string} atividade - A chave da atividade (ex: 'classico').
     * @param {number} idade - A idade do jogador atual.
     * @returns {object} - O objeto do problema para o jogo.
     */
    gerarProblema(trilha, atividade, idade = 8) { // idade padrão de 8 anos
        if (atividade === 'classico') return this.gerarProblemaClassico(trilha, idade);
    },

    gerarProblemaClassico(trilha, idade) {
        const opMap = { adicao: '+', subtracao: '-', multiplicacao: '×', divisao: '÷' };
        const op = opMap[trilha];
        let n1, n2, r, pontos, dica;

        // A dificuldade e os pontos agora dependem da idade
        switch (op) {
            case '+': 
                if (idade <= 6) { // 4-6 anos
                    n1 = Math.floor(Math.random() * 10) + 1;
                    n2 = Math.floor(Math.random() * 10) + 1;
                    pontos = 10;
                } else if (idade <= 9) { // 7-9 anos
                    n1 = Math.floor(Math.random() * 50) + 10;
                    n2 = Math.floor(Math.random() * 50) + 10;
                    pontos = 15;
                } else { // 10-12 anos
                    n1 = Math.floor(Math.random() * 150) + 20;
                    n2 = Math.floor(Math.random() * 150) + 20;
                    pontos = 20;
                }
                r = n1 + n2;
                dica = `Tente somar as dezenas primeiro.`;
                break;
            case '-': 
                if (idade <= 6) {
                    n1 = Math.floor(Math.random() * 15) + 5;
                    n2 = Math.floor(Math.random() * (n1 - 1)) + 1;
                    pontos = 10;
                } else if (idade <= 9) {
                    n1 = Math.floor(Math.random() * 80) + 20;
                    n2 = Math.floor(Math.random() * (n1 - 10)) + 10;
                    pontos = 15;
                } else {
                    n1 = Math.floor(Math.random() * 200) + 50;
                    n2 = Math.floor(Math.random() * (n1 - 20)) + 20;
                    pontos = 20;
                }
                r = n1 - n2;
                dica = `Pense em quanto falta para ${n2} chegar em ${n1}.`;
                break;
            case '×':
                if (idade <= 7) {
                    n1 = Math.floor(Math.random() * 4) + 2; // Tabuadas do 2, 3, 4, 5
                    n2 = Math.floor(Math.random() * 4) + 2;
                    pontos = 20;
                } else if (idade <= 9) {
                    n1 = Math.floor(Math.random() * 8) + 2; // Tabuadas até 10
                    n2 = Math.floor(Math.random() * 8) + 2;
                    pontos = 25;
                } else {
                    n1 = Math.floor(Math.random() * 10) + 2; // Tabuadas até 12
                    n2 = Math.floor(Math.random() * 10) + 2;
                    pontos = 30;
                }
                r = n1 * n2;
                dica = `Lembre-se da tabuada do ${n1}.`;
                break;
            case '÷':
                if (idade <= 8) {
                    n2 = Math.floor(Math.random() * 4) + 2;
                    r = Math.floor(Math.random() * 5) + 1;
                    pontos = 25;
                } else if (idade <= 10) {
                    n2 = Math.floor(Math.random() * 8) + 2;
                    r = Math.floor(Math.random() * 8) + 2;
                    pontos = 30;
                } else {
                    n2 = Math.floor(Math.random() * 10) + 2;
                    r = Math.floor(Math.random() * 10) + 2;
                    pontos = 35;
                }
                n1 = n2 * r;
                dica = `Qual número multiplicado por ${n2} resulta em ${n1}?`;
                break;
        }
        
        const p = `${n1} ${op} ${n2}`;
        let opts = new Set([r]);
        while(opts.size < 4) {
            const variacao = Math.ceil(r * 0.1) + 1; // Variação baseada na resposta
            let optInc = (Math.random() > 0.5) ? r + variacao : r - variacao;
            optInc = Math.max(0, Math.round(optInc)); // Garante que seja positivo e inteiro
            if(optInc !== r) opts.add(optInc);
        }

        return { 
            tipo: 'multipla_escolha', 
            enunciado: `${p} = ?`, 
            opcoes: Array.from(opts), 
            respostaCorreta: r, 
            pontos: pontos, 
            dica: dica 
        };
    }
};
