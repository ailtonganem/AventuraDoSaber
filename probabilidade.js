window.AventuraDoSaber = window.AventuraDoSaber || {};

window.AventuraDoSaber.probabilidade = {
    DADOS: {
        chances: { nome: "Chances", icone: "🎲", atividades: { roleta: { nome: "Roleta da Sorte", icone: "🎡" } } }
    },

    gerarProblema(trilha, atividade) {
        if (atividade === 'roleta') return this.gerarProblemaRoleta();
    },

    gerarProblemaRoleta() {
        const cores = [
            { nome: 'Azul', cor: '#0077be' },
            { nome: 'Amarelo', cor: '#ffc107' },
            { nome: 'Verde', cor: '#5cb85c' },
            { nome: 'Vermelho', cor: '#d9534f' }
        ];
        
        let secoes = [];
        let contagemCores = { Azul: 0, Amarelo: 0, Verde: 0, Vermelho: 0 };
        const totalSecoes = 8;

        for (let i = 0; i < totalSecoes; i++) {
            const corAleatoria = cores[Math.floor(Math.random() * cores.length)];
            secoes.push(corAleatoria);
            contagemCores[corAleatoria.nome]++;
        }

        let maiorContagem = 0;
        let corMaisProvavel = '';
        for (const [cor, contagem] of Object.entries(contagemCores)) {
            if (contagem > maiorContagem) {
                maiorContagem = contagem;
                corMaisProvavel = cor;
            }
        }
        
        // Garante que haja uma única cor mais provável para não confundir
        const coresComMaiorContagem = Object.values(contagemCores).filter(c => c === maiorContagem);
        if (coresComMaiorContagem.length > 1) {
            return this.gerarProblemaRoleta(); // Recomeça se houver empate
        }
        
        const respostaCorreta = corMaisProvavel;
        const enunciado = `Ao girar a roleta, qual cor tem a <strong>maior chance</strong> de ser sorteada?`;

        let gradiente = 'conic-gradient(';
        let anguloAtual = 0;
        const anguloPorSecao = 360 / totalSecoes;
        secoes.forEach(secao => {
            gradiente += `${secao.cor} ${anguloAtual}deg ${anguloAtual + anguloPorSecao}deg,`;
            anguloAtual += anguloPorSecao;
        });
        gradiente = gradiente.slice(0, -1) + ')'; // Remove a última vírgula

        const jogoHTML = `
            <div class="container-roleta">
                <div class="roleta" style="background: ${gradiente};">
                    <div class="seta-roleta"></div>
                </div>
            </div>
        `;

        return {
            tipo: 'multipla_escolha',
            enunciado: enunciado,
            objetosHTML: jogoHTML,
            opcoes: cores.map(c => c.nome),
            respostaCorreta: respostaCorreta
        };
    }
};