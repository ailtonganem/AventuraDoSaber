// Garante que o objeto global AventuraDoSaber exista
window.AventuraDoSaber = window.AventuraDoSaber || {};

// Adiciona os dados de OPERAÇÕES ao nosso objeto global
window.AventuraDoSaber.operacoes = {
    DADOS: {
        adicao: { nome: "Adição", icone: "➕", atividades: { classico: { nome: "Desafio Clássico", icone: "🎯" }, vf: { nome: "Verdadeiro ou Falso?", icone: "👍" } } },
        subtracao: { nome: "Subtração", icone: "➖", atividades: { classico: { nome: "Desafio Clássico", icone: "🎯" }, vf: { nome: "Verdadeiro ou Falso?", icone: "👍" } } },
        multiplicacao: { nome: "Multiplicação", icone: "✖️", atividades: { classico: { nome: "Desafio Clássico", icone: "🎯" }, vf: { nome: "Verdadeiro ou Falso?", icone: "👍" } } },
        divisao: { nome: "Divisão", icone: "➗", atividades: { classico: { nome: "Desafio Clássico", icone: "🎯" }, vf: { nome: "Verdadeiro ou Falso?", icone: "👍" } } }
    },

    gerarProblema(trilha, atividade) {
        if (atividade === 'classico') return this.gerarProblemaClassico(trilha);
        if (atividade === 'vf') return this.gerarProblemaVF(trilha);
    },

    gerarProblemaClassico(trilha) {
        const opMap = { adicao: '+', subtracao: '-', multiplicacao: '×', divisao: '÷' };
        const op = opMap[trilha];
        let n1, n2, p, r;
        switch (op) {
            case '+': n1 = Math.floor(Math.random()*50)+1; n2 = Math.floor(Math.random()*50)+1; r = n1+n2; break;
            case '-': n1 = Math.floor(Math.random()*50)+1; n2 = Math.floor(Math.random()*50)+1; if (n1<n2) [n1,n2]=[n2,n1]; r = n1-n2; break;
            case '×': n1 = Math.floor(Math.random()*10)+1; n2 = Math.floor(Math.random()*10)+1; r = n1*n2; break;
            case '÷': n2 = Math.floor(Math.random()*9)+2; r = Math.floor(Math.random()*9)+2; n1 = n2*r; break;
        }
        p = `${n1} ${op} ${n2}`;
        let opts = new Set([r]);
        while(opts.size < 4) {
            const v = Math.floor(Math.random()*5)+1;
            let optInc = (Math.random()>0.5) ? r+v : r-v;
            if(optInc>0 && optInc!==r) opts.add(optInc);
        }
        return { enunciado: `${p} = ?`, opcoes: Array.from(opts), respostaCorreta: r };
    },

    gerarProblemaVF(trilha) {
        const opMap = { adicao: '+', subtracao: '-', multiplicacao: '×', divisao: '÷' };
        const op = opMap[trilha];
        let n1, n2, rC, rM;
        switch (op) {
            case '+': n1 = Math.floor(Math.random()*20)+1; n2 = Math.floor(Math.random()*20)+1; rC = n1+n2; break;
            case '-': n1 = Math.floor(Math.random()*20)+1; n2 = Math.floor(Math.random()*20)+1; if (n1<n2) [n1,n2]=[n2,n1]; rC = n1-n2; break;
            case '×': n1 = Math.floor(Math.random()*10)+1; n2 = Math.floor(Math.random()*5)+1; rC = n1*n2; break;
            case '÷': n2 = Math.floor(Math.random()*9)+2; rC = Math.floor(Math.random()*9)+2; n1 = n2*rC; break;
        }
        const eVdd = Math.random()>0.5;
        if(eVdd) rM = rC;
        else {
            const v = Math.floor(Math.random()*3)+1;
            rM = (Math.random()>0.5) ? rC+v : rC-v;
            if(rM<=0) rM=rC+v;
        }
        const p = `${n1} ${op} ${n2} = ${rM}`;
        return { enunciado: p, opcoes: ["Verdadeiro", "Falso"], respostaCorreta: eVdd ? "Verdadeiro" : "Falso" };
    }
};