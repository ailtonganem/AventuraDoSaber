/**
 * geometria.js
 * Módulo para problemas de geometria, incluindo figuras planas, sólidos, área e perímetro.
 * * Este arquivo foi convertido para o formato de módulo ES6.
 */

// DADOS contém a estrutura de trilhas e atividades da matéria.
export const DADOS_GEOMETRIA = {
    figuras_planas: { nome: "Figuras Planas", icone: "💠", atividades: { caca_formas: { nome: "Caça-Formas", icone: "🔎" } } },
    figuras_solidas: { nome: "Figuras Sólidas", icone: "🧊", atividades: { desfile_3d: { nome: "Desfile 3D", icone: "🏆" } } },
    perimetro: { nome: "Perímetro", icone: "📏", atividades: { cerca_terreno: { nome: "Cercando o Terreno", icone: "🚧" } } },
    area: { nome: "Área", icone: "🟩", atividades: { preenche_mosaico: { nome: "Preenchendo o Mosaico", icone: "🎨" } } }
};

// --- Funções Auxiliares (não exportadas) ---

function _gerarProblemaCacaFormas() {
    const formas = [
        { nome: 'CÍRCULO', classe: 'circulo' },
        { nome: 'QUADRADO', classe: 'quadrado' },
        { nome: 'TRIÂNGULO', classe: 'triangulo' }
    ];
    const formaAlvo = formas[Math.floor(Math.random() * formas.length)];
    const enunciado = `Clique em todos os <strong>${formaAlvo.nome}S</strong>!`;
    let objetosHTML = '', contadorResposta = 0;
    const totalFormas = Math.floor(Math.random() * 5) + 8; // Entre 8 e 12 formas
    for (let i = 0; i < totalFormas; i++) {
        const formaAleatoria = formas[Math.floor(Math.random() * formas.length)];
        const tamanho = Math.floor(Math.random() * 50) + 40;
        const posX = Math.random() * 85;
        const posY = Math.random() * 75;
        const cor = `hsl(${Math.random() * 360}, 80%, 60%)`;
        objetosHTML += `<div class="forma-geometrica ${formaAleatoria.classe}" data-forma="${formaAleatoria.classe}" style="width:${tamanho}px; height:${tamanho}px; top:${posY}%; left:${posX}%; background-color:${cor}; border-bottom-color:${cor};"></div>`;
        if (formaAleatoria.classe === formaAlvo.classe) {
            contadorResposta++;
        }
    }
    // Garante que haja pelo menos 2 formas alvo para clicar
    if (contadorResposta < 2) {
        return _gerarProblemaCacaFormas();
    }
    return {
        tipo: 'clique_em_objetos',
        enunciado: enunciado,
        objetosHTML: objetosHTML,
        respostaCorreta: contadorResposta,
        classeAlvo: formaAlvo.classe,
        pontos: 30,
        dica: 'Preste atenção na forma pedida no enunciado e ignore as outras.'
    };
}

function _gerarProblemaSolidos() {
    const solidos = [
        { nome: 'Cubo', classe: 'cubo' }, { nome: 'Esfera', classe: 'esfera' },
        { nome: 'Cilindro', classe: 'cilindro' }, { nome: 'Cone', classe: 'cone' }
    ];
    const solidoAlvo = solidos[Math.floor(Math.random() * solidos.length)];
    const enunciado = `Qual o nome desta figura sólida?`;
    
    // O visual do sólido é criado aqui, mas o HTML completo dele está no CSS
    const jogoHTML = `<div class="container-solido"><div class="solido ${solidoAlvo.classe}"><div></div><div></div><div></div><div></div><div></div><div></div></div></div>`;

    let opcoes = new Set([solidoAlvo.nome]);
    while(opcoes.size < 4) {
        const opcaoIncorreta = solidos[Math.floor(Math.random() * solidos.length)].nome;
        opcoes.add(opcaoIncorreta);
    }

    return {
        tipo: 'multipla_escolha',
        enunciado: enunciado,
        objetosHTML: jogoHTML,
        opcoes: Array.from(opcoes),
        respostaCorreta: solidoAlvo.nome,
        pontos: 20,
        dica: 'Pense em objetos do dia a dia. Parece um dado, uma bola, uma lata ou um chapéu de festa?'
    };
}

function _gerarProblemaPerimetro() {
    const largura = Math.floor(Math.random() * 5) + 3; // 3 a 7
    const altura = Math.floor(Math.random() * 5) + 3; // 3 a 7
    const resposta = 2 * (largura + altura);
    const enunciado = `Qual o perímetro (a soma de todos os lados) desta figura? Cada quadradinho tem lado 1.`;
    
    let malhaHTML = `<div class="malha-geometrica malha-perimetro" style="grid-template-columns: repeat(${largura}, 1fr); grid-template-rows: repeat(${altura}, 1fr);">`;
    for (let i = 0; i < largura * altura; i++) {
        malhaHTML += `<div class="quadrado-malha"></div>`;
    }
    malhaHTML += `</div>`;

    const keypadHTML = `<div class="container-keypad"><div class="display-keypad" id="display-keypad"></div><div class="botoes-keypad"><button data-key="7">7</button><button data-key="8">8</button><button data-key="9">9</button><button data-key="4">4</button><button data-key="5">5</button><button data-key="6">6</button><button data-key="1">1</button><button data-key="2">2</button><button data-key="3">3</button><button data-key="apagar">⬅</button><button data-key="0">0</button><button data-key="ok">OK</button></div></div>`;
    
    return {
        tipo: 'keypad_input',
        enunciado: enunciado,
        objetosHTML: malhaHTML + keypadHTML,
        respostaCorreta: resposta,
        pontos: 25,
        dica: `Some os ${largura} de cima, os ${largura} de baixo, os ${altura} de um lado e os ${altura} do outro.`
    };
}

function _gerarProblemaArea() {
    const largura = Math.floor(Math.random() * 4) + 4; // 4 a 7
    const altura = Math.floor(Math.random() * 4) + 4; // 4 a 7
    const resposta = largura * altura;
    const enunciado = `Qual a área desta figura? (conte os quadradinhos)`;
    
    let malhaHTML = `<div class="malha-geometrica malha-area" style="grid-template-columns: repeat(${largura}, 1fr); grid-template-rows: repeat(${altura}, 1fr);">`;
    for (let i = 0; i < largura * altura; i++) {
        malhaHTML += `<div class="quadrado-malha preenchido"></div>`;
    }
    malhaHTML += `</div>`;

    const keypadHTML = `<div class="container-keypad"><div class="display-keypad" id="display-keypad"></div><div class="botoes-keypad"><button data-key="7">7</button><button data-key="8">8</button><button data-key="9">9</button><button data-key="4">4</button><button data-key="5">5</button><button data-key="6">6</button><button data-key="1">1</button><button data-key="2">2</button><button data-key="3">3</button><button data-key="apagar">⬅</button><button data-key="0">0</button><button data-key="ok">OK</button></div></div>`;
    
    return {
        tipo: 'keypad_input',
        enunciado: enunciado,
        objetosHTML: malhaHTML + keypadHTML,
        respostaCorreta: resposta,
        pontos: 25,
        dica: `Para calcular a área de um retângulo, você pode multiplicar a largura pela altura.`
    };
}


/**
 * Ponto de entrada para gerar problemas de geometria.
 * @param {string} trilha - A chave da trilha.
 * @param {string} atividade - A chave da atividade.
 * @returns {object} O objeto do problema para o jogo.
 */
export function gerarProblemaGeometria(trilha, atividade) {
    if (atividade === 'caca_formas') return _gerarProblemaCacaFormas();
    if (atividade === 'desfile_3d') return _gerarProblemaSolidos();
    if (atividade === 'cerca_terreno') return _gerarProblemaPerimetro();
    if (atividade === 'preenche_mosaico') return _gerarProblemaArea();

    // Retorno padrão
    return _gerarProblemaCacaFormas();
}
