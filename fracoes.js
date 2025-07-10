window.AventuraDoSaber = window.AventuraDoSaber || {};

window.AventuraDoSaber.fracoes = {
    DADOS: {
        fracoes_conceito: { nome: "O que é Fração?", icone: "🍕", atividades: { qual_e_a_fracao: { nome: "Qual é a Fração?", icone: "🤔" } } },
        tipos_fracoes: { nome: "Tipos de Frações", icone: "📚", atividades: { classificador: { nome: "Classificador de Pizzas", icone: "📥" } } },
        fracoes_equivalentes: { nome: "Frações Equivalentes", icone: "⚖️", atividades: { balanca: { nome: "Balança da Equivalência", icone: "🟰" } } }
    },

    // Função interna para reutilizar a criação do visual da fração
    _gerarVisualFracao(numerador, denominador) {
        let visual = '<div class="fracao-visual">';
        for (let i = 0; i < denominador; i++) {
            visual += `<div class="parte ${i < numerador ? 'preenchida' : ''}"></div>`;
        }
        visual += '</div>';
        return visual;
    },

    gerarProblema(trilha, atividade) {
        if (atividade === 'qual_e_a_fracao') return this.gerarProblemaConceito();
        if (atividade === 'classificador') return this.gerarProblemaTipos();
        if (atividade === 'balanca') return this.gerarProblemaEquivalentes();
    },

    gerarProblemaConceito() {
        // ... (código existente, sem alterações)
        const d = Math.floor(Math.random()*7)+2; const n = Math.floor(Math.random()*(d-1))+1;
        const rC = `${n}/${d}`;
        const e = `Que fração representa a parte colorida?<br>${this._gerarVisualFracao(n,d)}`;
        let o = new Set([rC]);
        while(o.size < 4){ const nI=Math.floor(Math.random()*(d-1))+1; const dI=Math.floor(Math.random()*7)+2; const oI=(Math.random()>0.5)?`${nI}/${d}`:`${n}/${dI}`; if(oI!==rC){o.add(oI);} }
        return { tipo: 'multipla_escolha', enunciado: e, opcoes: Array.from(o), respostaCorreta: rC };
    },

    gerarProblemaTipos() {
        // ... (código existente, sem alterações)
        const tipos = ['propria', 'impropria', 'mista']; const tipoAlvo = tipos[Math.floor(Math.random()*tipos.length)];
        let n, d, i=0, fD='';
        switch(tipoAlvo){
            case 'propria': d=Math.floor(Math.random()*5)+3; n=Math.floor(Math.random()*(d-1))+1; fD=`<sup>${n}</sup>⁄<sub>${d}</sub>`; break;
            case 'impropria': d=Math.floor(Math.random()*4)+2; n=d+Math.floor(Math.random()*4)+1; fD=`<sup>${n}</sup>⁄<sub>${d}</sub>`; break;
            case 'mista': d=Math.floor(Math.random()*5)+3; n=Math.floor(Math.random()*(d-1))+1; i=Math.floor(Math.random()*2)+1; fD=`${i} <sup>${n}</sup>⁄<sub>${d}</sub>`; break;
        }
        const e = `Arraste a fração para a caixa correta!`;
        const jH = `<div class="container-classificacao"><div class="item-classificavel" draggable="true">${fD}</div><div class="caixas-destino"><div class="caixa-classificacao" data-tipo="propria"><span>Própria</span></div><div class="caixa-classificacao" data-tipo="impropria"><span>Imprópria</span></div><div class="caixa-classificacao" data-tipo="mista"><span>Mista</span></div></div></div>`;
        return { tipo: 'drag_classificacao', enunciado: e, objetosHTML: jH, respostaCorreta: tipoAlvo };
    },

    // NOVA FUNÇÃO para frações equivalentes
    gerarProblemaEquivalentes() {
        const bases = [[1, 2], [1, 3], [1, 4], [2, 3]];
        const base = bases[Math.floor(Math.random() * bases.length)];
        const multiplicador = Math.floor(Math.random() * 3) + 2; // 2, 3 ou 4

        const n1 = base[0], d1 = base[1];
        const n2 = n1 * multiplicador, d2 = d1 * multiplicador;

        const visualFracao = this._gerarVisualFracao(n1, d1);
        const respostaCorreta = `${n2}/${d2}`;
        
        const enunciado = `
            Qual fração é equivalente e equilibra a balança?
            <div class="balanca-container">
                <div class="prato-balanca">${visualFracao} <span><sup>${n1}</sup>⁄<sub>${d1}</sub></span></div>
                <div class="pivo-balanca"></div>
                <div class="prato-balanca" id="prato-direito">?</div>
            </div>
        `;
        
        let opcoes = new Set([respostaCorreta]);
        while(opcoes.size < 4) {
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
            respostaCorreta: respostaCorreta
        };
    }
};