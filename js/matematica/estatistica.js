/**
 * estatistica.js
 * Módulo para problemas de estatística, como leitura de gráficos.
 * * Este arquivo foi convertido para o formato de módulo ES6.
 */

// DADOS contém a estrutura de trilhas e atividades da matéria.
export const DADOS_ESTATISTICA = {
    graficos: { nome: "Gráficos", icone: "📊", atividades: { detetive: { nome: "Detetive dos Gráficos", icone: "🕵️" } } }
};

// --- Funções Auxiliares (não exportadas) ---

function _gerarProblemaGrafico() {
    const temas = [
        { item: 'Fruta', plural: 'frutas', opcoes: ['Maçã', 'Banana', 'Uva', 'Laranja'] },
        { item: 'Animal', plural: 'animais', opcoes: ['Cachorro', 'Gato', 'Pássaro', 'Peixe'] },
        { item: 'Brinquedo', plural: 'brinquedos', opcoes: ['Bola', 'Boneca', 'Carrinho', 'Jogo'] }
    ];
    const temaEscolhido = temas[Math.floor(Math.random() * temas.length)];
    
    let dadosGrafico = [];
    let maiorValor = 0;
    let itemMaiorValor = '';

    // Gera valores aleatórios para cada opção do tema
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

    // Cria o HTML para o gráfico de barras
    let graficoHTML = '<div class="container-grafico">';
    dadosGrafico.forEach(dado => {
        const alturaBarra = (dado.valor / 10) * 100; // Altura em % (baseado em um máximo de 10)
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
        respostaCorreta: respostaCorreta,
        pontos: 20,
        dica: 'A barra mais alta no gráfico representa a opção com mais votos.'
    };
}

/**
 * Ponto de entrada para gerar problemas de estatística.
 * @param {string} trilha - A chave da trilha.
 * @param {string} atividade - A chave da atividade.
 * @returns {object} O objeto do problema para o jogo.
 */
export function gerarProblemaEstatistica(trilha, atividade) {
    if (atividade === 'detetive') return _gerarProblemaGrafico();

    // Retorno padrão
    return _gerarProblemaGrafico();
}
