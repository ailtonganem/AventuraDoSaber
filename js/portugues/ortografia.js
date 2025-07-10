window.AventuraDoSaber = window.AventuraDoSaber || {};

window.AventuraDoSaber.ortografia = {
    DADOS_CONTEUDO: [
        { p: 'CA_A', c: 'S', i: ['Z', 'X'] }, { p: 'GI_AFA', c: 'R', i: ['L', 'RR'] },
        { p: 'VI_GEM', c: 'A', i: ['E', 'O'] }, { p: '_EITO', c: 'J', i: ['G'] },
        { p: 'MA_Ã', c: 'Ç', i: ['SS', 'S'] }, { p: 'PA_OCA', c: 'Ç', i: ['S', 'SS'] },
        { p: 'EXER_ÍCIO', c: 'C', i: ['S', 'SS'] }, { p: 'CHI_ELO', c: 'N', i: ['M'] },
        { p: 'TE_OURO', c: 'S', i: ['Z', 'X'] }, { p: 'CA_AROLA', c: 'SS', i: ['Ç'] }
    ],

    DADOS: {
        ortografia: { nome: "Ortografia", icone: "✍️", atividades: { tesouro: { nome: "Tesouro Ortográfico", icone: "💎" } } }
    },

    gerarProblema(trilha, atividade) {
        const pAtual = this.DADOS_CONTEUDO[Math.floor(Math.random() * this.DADOS_CONTEUDO.length)];
        const opts = [pAtual.c, ...pAtual.i];
        return { enunciado: pAtual.p.replace('_', '<span class="lacuna"></span>'), opcoes: opts, respostaCorreta: pAtual.c };
    }
};
