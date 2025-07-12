/**
 * main.js
 * Ponto de entrada e orquestrador principal da aplicação "Aventura do Saber".
 * Versão 6.0 - Reformulação completa do sistema.
 * - Remoção do sistema de perfis, pontos e loja.
 * - Implementação de geração de problemas via API de IA em tempo real.
 * - Foco total na experiência de aprendizado direto.
 */

// SDK do Google AI
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// ATENÇÃO: Substitua pela sua API Key do Google AI Studio.
const API_KEY = "AIzaSyD8jX6FlIKta7T-0pGeNAplTUmO4bQ4uu0"; 
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

document.addEventListener('DOMContentLoaded', () => {

    // --- Estado Simplificado do App ---
    let estado = {
        viewAtual: 'mapa-view', // Inicia diretamente no mapa
        materiaAtual: null,
        trilhaAtual: null,
        atividadeAtual: null,
        problemaAtual: null,
        jogoAtivo: false,
    };

    // --- Estrutura de dados simplificada (apenas para menus) ---
    const DADOS_JOGOS = {
        matematica: {
            nome: "Ilha dos Números", cor: "#0077be",
            trilhas: {
                adicao: { nome: "Adição", icone: "➕", atividades: { classico: { nome: "Desafio Clássico", icone: "🎯" } } },
                subtracao: { nome: "Subtração", icone: "➖", atividades: { classico: { nome: "Desafio Clássico", icone: "🎯" } } },
                multiplicacao: { nome: "Multiplicação", icone: "✖️", atividades: { classico: { nome: "Desafio Clássico", icone: "🎯" } } },
                divisao: { nome: "Divisão", icone: "➗", atividades: { classico: { nome: "Desafio Clássico", icone: "🎯" } } },
                fracoes_conceito: { nome: "Frações", icone: "🍕", atividades: { qual_e_a_fracao: { nome: "Qual é a Fração?", icone: "🤔" } } },
            }
        },
        portugues: {
            nome: "Ilha das Palavras", cor: "#c94c4c",
            trilhas: {
                ortografia: { nome: "Ortografia", icone: "✍️", atividades: { tesouro: { nome: "Complete a Palavra", icone: "💎" } } }
            },
        },
        ciencias: {
            nome: "Ilha das Descobertas", cor: "#4CAF50",
            trilhas: {
                corpo_humano: { nome: "Corpo Humano", icone: "🧑‍⚕️", atividades: { sistemas: { nome: "Sistemas do Corpo", icone: "🧠" } } },
                seres_vivos: { nome: "Seres Vivos", icone: "🌱", atividades: { cadeia_alimentar: { nome: "Cadeia Alimentar", icone: "🦁" } } }
            }
        },
    };

    // --- Elementos da DOM (Cache) ---
    const allViews = document.querySelectorAll('.view');
    const balaoFala = document.getElementById('balao-fala');
    const enunciadoEl = document.getElementById('enunciado-problema');
    const opcoesEl = document.getElementById('opcoes-resposta');
    const pontosProblemaEl = document.getElementById('pontos-problema');
    const botaoAjudaEl = document.getElementById('botao-ajuda');
    const botaoPularEl = document.getElementById('botao-pular');

    // --- Sons ---
    const somAcerto = new Audio('assets/sounds/acerto.mp3');
    const somErro = new Audio('assets/sounds/erro.mp3');
    const somClique = new Audio('assets/sounds/clique.mp3');

    // ==========================================================================
    // --- FUNÇÕES DE LÓGICA E UTILIDADES ---
    // ==========================================================================

    const tocarSom = (som) => { som.currentTime = 0; som.play().catch(e => console.log("Erro ao tocar som:", e)); };
    const mascoteFala = (texto, instantaneo = false) => {
        if (!balaoFala) return;
        if (instantaneo) {
            balaoFala.textContent = texto;
            return;
        }
        // Efeito de digitação
        balaoFala.textContent = '';
        let i = 0;
        const speed = 30; // ms
        function typeWriter() {
            if (i < texto.length) {
                balaoFala.textContent += texto.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        typeWriter();
    };
    const definirCorAtiva = (cor) => { document.documentElement.style.setProperty('--cor-ativa', cor); };

    // ==========================================================================
    // --- LÓGICA DO JOGO COM API ---
    // ==========================================================================

    /**
     * Gera um problema educacional usando a API do Google Gemini.
     */
    async function gerarProblemaViaAPI() {
        const dadosMateria = DADOS_JOGOS[estado.materiaAtual];
        const dadosTrilha = dadosMateria.trilhas[estado.trilhaAtual];
        const dadosAtividade = dadosTrilha.atividades[estado.atividadeAtual];

        mascoteFala("Estou criando um novo desafio...");
        enunciadoEl.innerHTML = "Pensando em uma boa pergunta...";
        opcoesEl.innerHTML = '<div class="loader"></div>'; // Mostra um spinner
        
        const prompt = `
            Crie um problema educacional para uma criança de 8 anos.
            O tema é: ${dadosMateria.nome} - ${dadosTrilha.nome} - ${dadosAtividade.nome}.
            O problema deve ser do tipo múltipla escolha.
            Retorne sua resposta APENAS em formato JSON, sem nenhum texto ou formatação adicional.
            O JSON deve ter EXATAMENTE a seguinte estrutura:
            {
              "enunciado": "Texto da pergunta aqui.",
              "opcoes": ["Opção 1", "Opção 2", "Opção 3", "Opção 4"],
              "respostaCorreta": "A opção correta, exatamente como aparece em 'opcoes'."
            }
            As opções devem conter a resposta correta. O enunciado deve ser claro e direto.
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = await response.text();
            
            // Limpa o texto para garantir que é um JSON válido
            const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const problema = JSON.parse(jsonText);

            if (!problema.enunciado || !problema.opcoes || !problema.respostaCorreta) {
                throw new Error("JSON retornado pela API está incompleto.");
            }

            estado.problemaAtual = problema;
            estado.jogoAtivo = true;

            mascoteFala("Pronto! Qual a resposta correta?", true);
            enunciadoEl.innerHTML = problema.enunciado;
            gerarBotoesDeOpcao(problema.opcoes);

        } catch (error) {
            console.error("Erro ao gerar problema com a API:", error);
            mascoteFala("Ops! Tive um problema para criar a pergunta. Vamos tentar de novo.");
            enunciadoEl.textContent = "Erro ao carregar o desafio. Clique em Pular para tentar novamente.";
            opcoesEl.innerHTML = '';
            estado.jogoAtivo = true; // Permite pular
        }
    }

    function gerarBotoesDeOpcao(opcoes) {
        opcoesEl.innerHTML = '';
        const opcoesEmbaralhadas = [...opcoes].sort(() => Math.random() - 0.5);
        opcoesEmbaralhadas.forEach(opcao => {
            const botao = document.createElement('button');
            botao.className = 'botao-resposta';
            botao.innerHTML = opcao;
            botao.dataset.valor = String(opcao);
            botao.onclick = () => {
                if (!estado.jogoAtivo) return;
                const acertou = String(botao.dataset.valor).trim() === String(estado.problemaAtual.respostaCorreta).trim();
                resolverProblema(acertou, botao);
            };
            opcoesEl.appendChild(botao);
        });
    }

    function resolverProblema(acertou, botaoClicado = null) {
        if (!estado.jogoAtivo) return;
        estado.jogoAtivo = false;
        
        if (acertou) {
            tocarSom(somAcerto);
            mascoteFala("Isso mesmo! Resposta correta!");
            if (botaoClicado) botaoClicado.classList.add('correta');
        } else {
            tocarSom(somErro);
            mascoteFala(`Quase! A resposta correta era "${estado.problemaAtual.respostaCorreta}".`);
            if (botaoClicado) {
                botaoClicado.classList.add('incorreta');
                document.querySelectorAll('.botao-resposta').forEach(b => {
                    if (String(b.dataset.valor).trim() === String(estado.problemaAtual.respostaCorreta).trim()) {
                        b.classList.add('correta');
                    }
                });
            }
        }

        setTimeout(gerarProblemaViaAPI, 3000); // Gera a próxima pergunta
    }


    // ==========================================================================
    // --- NAVEGAÇÃO E RENDERIZAÇÃO DE VIEWS ---
    // ==========================================================================

    const mostrarView = (id) => {
        estado.viewAtual = id;
        allViews.forEach(v => v.classList.remove('active'));
        const viewAtiva = document.getElementById(id);
        if (viewAtiva) {
            viewAtiva.classList.add('active');
        } else {
            document.getElementById('mapa-view').classList.add('active'); // Fallback
        }
    };

    function mostrarTrilhas(materia) {
        tocarSom(somClique);
        estado.materiaAtual = materia;
        const dadosMateria = DADOS_JOGOS[materia];
        definirCorAtiva(dadosMateria.cor);
        document.getElementById('trilhas-titulo').textContent = dadosMateria.nome;
        const container = document.getElementById('trilhas-container');
        container.innerHTML = '';
        for (const [chaveTrilha, trilha] of Object.entries(dadosMateria.trilhas)) {
            const botao = document.createElement('button');
            botao.className = 'menu-botao';
            botao.innerHTML = `<span class="icone">${trilha.icone}</span> ${trilha.nome}`;
            botao.onclick = () => mostrarAtividades(chaveTrilha);
            container.appendChild(botao);
        }
        mostrarView('trilhas-view');
        mascoteFala(`Ótima escolha! O que vamos ver em ${dadosMateria.nome}?`);
    }

    function mostrarAtividades(trilha) {
        tocarSom(somClique);
        estado.trilhaAtual = trilha;
        const dadosTrilha = DADOS_JOGOS[estado.materiaAtual].trilhas[trilha];
        document.getElementById('atividades-titulo').textContent = dadosTrilha.nome;
        const container = document.getElementById('atividades-container');
        container.innerHTML = '';
        for (const [chaveAtividade, atividade] of Object.entries(dadosTrilha.atividades)) {
            const botao = document.createElement('button');
            botao.className = 'menu-botao';
            botao.onclick = () => iniciarJogo(chaveAtividade);
            botao.innerHTML = `<span class="icone">${atividade.icone}</span> ${atividade.nome}`;
            container.appendChild(botao);
        }
        mostrarView('atividades-view');
        mascoteFala("Escolha um desafio!");
    }

    function iniciarJogo(atividade) {
        tocarSom(somClique);
        estado.atividadeAtual = atividade;
        const dadosAtividade = DADOS_JOGOS[estado.materiaAtual].trilhas[estado.trilhaAtual].atividades[atividade];
        document.getElementById('titulo-jogo').textContent = dadosAtividade.nome;
        mostrarView('jogo-view');
        gerarProblemaViaAPI();
    }
    
    // ==========================================================================
    // --- INICIALIZAÇÃO DA APLICAÇÃO ---
    // ==========================================================================

    function inicializarApp() {
        // Event Listeners para as Ilhas
        document.getElementById('ilha-matematica').addEventListener('click', () => mostrarTrilhas('matematica'));
        document.getElementById('ilha-portugues').addEventListener('click', () => mostrarTrilhas('portugues'));
        document.getElementById('ilha-ciencias').addEventListener('click', () => mostrarTrilhas('ciencias'));
        
        // Botões de ação do Jogo
        botaoPularEl.addEventListener('click', () => {
            if (!estado.jogoAtivo) return;
            mascoteFala("Ok, vamos pular esta. Próxima pergunta!");
            gerarProblemaViaAPI();
        });
        botaoAjudaEl.style.display = 'none'; // Botão de ajuda removido por enquanto

        // Delegação de eventos para os botões de "voltar"
        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('botao-voltar')) {
                tocarSom(somClique);
                const id = e.target.id;
                if (id === 'voltar-para-mapa') {
                    mostrarView('mapa-view');
                    definirCorAtiva('#555');
                    mascoteFala("Para qual ilha vamos agora?");
                } else if (id === 'voltar-para-trilhas') {
                    mostrarTrilhas(estado.materiaAtual);
                } else if (id === 'voltar-para-atividades') {
                    mostrarView('mapa-view');
                    definirCorAtiva('#555');
                    mascoteFala("Vamos escolher outra matéria!");
                }
            }
        });
        
        mascoteFala("Olá! Bem-vindo(a) à Aventura do Saber! Escolha uma ilha para começar.");
        definirCorAtiva('#555');
        mostrarView('mapa-view');
    }

    // --- Ponto de Entrada ---
    inicializarApp();
});
