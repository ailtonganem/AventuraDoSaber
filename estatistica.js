window.AventuraDoSaber = window.AventuraDoSaber || {};

window.AventuraDoSaber.estatistica = {
    DADOS: {
        graficos: { nome: "Gráficos", icone: "📊", atividades: { detetive: { nome: "Detetive dos Gráficos", icone: "🕵️" } } }
    },

    gerarProblema(trilha, atividade) {
        if (atividade === 'detetive') return this.gerarProblemaGrafico();
    },

    gerarProblemaGrafico() {
        const temas = [
            { item: 'Fruta', plural: 'frutas', opcoes: ['Maçã', 'Banana', 'Uva', 'Laranja'] },
            { item: 'Animal', plural: 'animais', opcoes: ['Cachorro', 'Gato', 'Pássaro', 'Peixe'] },
            { item: 'Brinquedo', plural: 'brinquedos', opcoes: ['Bola', 'Boneca', 'Carrinho', 'Jogo'] }
        ];
        const temaEscolhido = temas[Math.floor(Math.random() * temas.length)];
        
        let dadosGrafico = [];
        let maiorValor = 0;
        let itemMaiorValor = '';

        temaEscolhido.opcoes.forEach(opcao => {
            const valor = Math.floor(Math.random() * 8) + 1; // Valores de 1 a 8
            dadosGrafico.push({ label: opcao, valor: valor });
            if (valor > maiorValor) {
                maiorValor = valor;
                itemMaiorValor = opcao;
            }
        });

        const respostaCorreta = itemMaiorValor;
        const enunciado = `Analisando os votos para o(a) ${temaEscolhido.item.toLowerCase()} favorito(a), qual foi o mais votado?`;

        let graficoHTML = '<div class="container-grafico">';
        dadosGrafico.forEach(dado => {
            const alturaBarra = (dado.valor / 10) * 100; // Altura em % (máx 10)
            graficoHTML += `
                <div class="barra-grafico">
                    <div class="barra" style="height: ${alturaBarra}%;">${dado.valor}</div>
                    <div class="label-barra">${dado.label}</div>
                </div>
            `;
        });
        graficoHTML += '</div>';

        return {
            tipo: 'multipla_escolha',
            enunciado: enunciado,
            objetosHTML: graficoHTML,
            opcoes: temaEscolhido.opcoes,
            respostaCorreta: respostaCorreta
        };
    }
};