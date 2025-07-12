/**
 * main.js
 * Ponto de entrada e orquestrador principal da aplicação "Aventura do Saber".
 * Versão 3.2 - Simplificação da estrutura de arquivos e correção final dos caminhos de importação.
 */

// --- Módulos de Configuração e Matérias ---
import { BRINDES_PADRAO } from './config.js';
import { DADOS_CIENCIAS, gerarProblemaCiencias } from './ciencias.js';
import { DADOS_GEOGRAFIA, gerarProblemaGeografia } from './geografia.js';
import { DADOS_HISTORIA, gerarProblemaHistoria } from './historia.js';
import { DADOS_INGLES, gerarProblemaIngles } from './ingles.js';
import { DADOS_ORTOGRAFIA, gerarProblemaOrtografia } from './ortografia.js';
import { DADOS_OPERACOES, gerarProblemaOperacoes } from './operacoes.js';
import { DADOS_FRACOES, gerarProblemaFracoes } from './fracoes.js';
import { DADOS_GEOMETRIA, gerarProblemaGeometria } from './geometria.js';
import { DADOS_MEDIDAS, gerarProblemaMedidas } from './medidas.js';
import { DADOS_ESTATISTICA, gerarProblemaEstatistica } from './estatistica.js';
import { DADOS_PROBABILIDADE, gerarProblemaProbabilidade } from './probabilidade.js';
import { DADOS_RESOLUCAO_PROBLEMAS, gerarProblemaResolucaoProblemas } from './resolucao_problemas.js';


document.addEventListener('DOMContentLoaded', () => {

    // --- Variáveis Globais do App ---
    let estado = {
        viewAtual: 'configuracoes-view',
        materiaAtual: null,
        trilhaAtual: null,
        atividadeAtual: null,
        problemaAtual: null,
        jogoAtivo: false,
        usuarioAtual: null,
        usuarios: [],
        brindes: []
    };

    // --- Estrutura de dados consolidada de todas as matérias ---
    const DADOS_JOGOS = {
        matematica: {
            nome: "Ilha dos Números", cor: "#0077be",
            trilhas: {
                ...DADOS_OPERACOES, ...DADOS_FRACOES, ...DADOS_GEOMETRIA,
                ...DADOS_MEDIDAS, ...DADOS_ESTATISTICA, ...DADOS_PROBABILIDADE,
                ...DADOS_RESOLUCAO_PROBLEMAS
            },
            gerador: (trilha, atividade, idade) => {
                if (trilha in DADOS_OPERACOES) return gerarProblemaOperacoes(trilha, idade);
                if (trilha in DADOS_FRACOES) return gerarProblemaFracoes(trilha, atividade);
                if (trilha in DADOS_GEOMETRIA) return gerarProblemaGeometria(trilha, atividade);
                if (trilha in DADOS_MEDIDAS) return gerarProblemaMedidas(trilha, atividade);
                if (trilha in DADOS_ESTATISTICA) return gerarProblemaEstatistica(trilha, atividade);
                if (trilha in DADOS_PROBABILIDADE) return gerarProblemaProbabilidade(trilha, atividade);
                if (trilha in DADOS_RESOLUCAO_PROBLEMAS) return gerarProblemaResolucaoProblemas(trilha, atividade);
                return null;
            }
        },
        portugues: {
            nome: "Ilha das Palavras", cor: "#c94c4c",
            trilhas: { ...DADOS_ORTOGRAFIA },
            gerador: (trilha, atividade) => gerarProblemaOrtografia(trilha, atividade)
        },
        ciencias: {
            nome: "Ilha das Descobertas", cor: "#4CAF50",
            trilhas: { ...DADOS_CIENCIAS },
            gerador: (trilha, atividade) => gerarProblemaCiencias(trilha, atividade)
        },
        historia: {
            nome: "Ilha do Tempo", cor: "#A0522D",
            trilhas: { ...DADOS_HISTORIA },
            gerador: (trilha, atividade) => gerarProblemaHistoria(trilha, atividade)
        },
        geografia: {
            nome: "Ilha do Mundo", cor: "#20B2AA",
            trilhas: { ...DADOS_GEOGRAFIA },
            gerador: (trilha, atividade) => gerarProblemaGeografia(trilha, atividade)
        },
        ingles: {
            nome: "The English Island", cor: "#6f42c1",
            trilhas: { ...DADOS_INGLES },
            gerador: (trilha, atividade) => gerarProblemaIngles(trilha, atividade)
        }
    };

    // --- Elementos da DOM (Cache) ---
    const allViews = document.querySelectorAll('.view');
    const pontosDisplay = document.getElementById('pontos-display');
    const balaoFala = document.getElementById('balao-fala');
    const enunciadoEl = document.getElementById('enunciado-problema');
    const opcoesEl = document.getElementById('opcoes-resposta');
    const listaBrindesAdminEl = document.getElementById('lista-brindes-admin');
    const inputNomeBrindeEl = document.getElementById('input-nome-brinde');
    const inputCustoBrindeEl = document.getElementById('input-custo-brinde');
    const botaoAddBrindeEl = document.getElementById('botao-add-brinde');
    const perfisContainerEl = document.querySelector('.perfis-container');
    const listaUsuariosAdminEl = document.getElementById('lista-usuarios-admin');
    const botaoLojaEl = document.getElementById('botao-loja');
    const botaoPerfilJogadorEl = document.getElementById('botao-perfil-jogador');
    const lojaContainerEl = document.getElementById('loja-container');
    const pontosProblemaEl = document.getElementById('pontos-problema');
    const botaoAjudaEl = document.getElementById('botao-ajuda');
    const botaoPularEl = document.getElementById('botao-pular');
    const inputNomePerfilEl = document.getElementById('input-nome-perfil');
    const inputIdadePerfilEl = document.getElementById('input-idade-perfil');
    const botaoSalvarPerfilEl = document.getElementById('botao-salvar-perfil');
    // Elementos do Modal
    const modalOverlayEl = document.getElementById('modal-overlay');
    const modalTitleEl = document.getElementById('modal-title');
    const modalTextEl = document.getElementById('modal-text');
    const modalInputEl = document.getElementById('modal-input');
    const modalFooterEl = document.getElementById('modal-footer');


    // --- Sons ---
    const somAcerto = new Audio('assets/sounds/acerto.mp3');
    const somErro = new Audio('assets/sounds/erro.mp3');
    const somClique = new Audio('assets/sounds/clique.mp3');

    // ==========================================================================
    // --- LÓGICA DE DADOS LOCAL (LocalStorage) ---
    // ==========================================================================

    /**
     * Salva os dados dos usuários e brindes no LocalStorage.
     */
    function salvarDadosLocalmente() {
        try {
            localStorage.setItem('aventuraSaberUsuarios', JSON.stringify(estado.usuarios));
            localStorage.setItem('aventuraSaberBrindes', JSON.stringify(estado.brindes));
        } catch (error) {
            console.error("Erro ao salvar dados no LocalStorage:", error);
            mascoteFala("Ops, não consegui salvar seu progresso!");
        }
    }

    /**
     * Carrega os dados de usuários e brindes do LocalStorage.
     */
    function carregarDadosLocais() {
        try {
            const usuariosSalvos = localStorage.getItem('aventuraSaberUsuarios');
            const brindesSalvos = localStorage.getItem('aventuraSaberBrindes');

            if (usuariosSalvos) {
                estado.usuarios = JSON.parse(usuariosSalvos);
            } else {
                estado.usuarios = []; // Começa sem usuários se for a primeira vez
            }

            if (brindesSalvos) {
                estado.brindes = JSON.parse(brindesSalvos);
            } else {
                // Se não houver brindes salvos, carrega os padrões do config.js
                estado.brindes = BRINDES_PADRAO;
                salvarDadosLocalmente(); // Salva os brindes padrão para futuras sessões
            }
        } catch (error) {
            console.error("Erro ao carregar dados do LocalStorage:", error);
            estado.usuarios = [];
            estado.brindes = BRINDES_PADRAO;
        }
    }


    // ==========================================================================
    // --- FUNÇÕES DE LÓGICA E UTILIDADES ---
    // ==========================================================================

    const tocarSom = (som) => { som.currentTime = 0; som.play().catch(e => console.log("Erro ao tocar som:", e)); };
    const mascoteFala = (texto) => { if (balaoFala) balaoFala.textContent = texto; };
    const atualizarPontosDisplay = () => {
        if (pontosDisplay) pontosDisplay.textContent = estado.usuarioAtual ? estado.usuarioAtual.pontos : 0;
    };
    const definirCorAtiva = (cor) => { document.documentElement.style.setProperty('--cor-ativa', cor); };

    /**
     * Adiciona ou remove pontos do usuário atual e salva o estado.
     * @param {number} quantidade - A quantidade de pontos a ser adicionada (pode ser negativa).
     */
    function adicionarPontos(quantidade) {
        if (!estado.usuarioAtual) return;
        const novosPontos = Math.max(0, estado.usuarioAtual.pontos + quantidade);
        estado.usuarioAtual.pontos = novosPontos;
        atualizarPontosDisplay();
        
        // Atualiza o usuário na lista principal e salva
        const index = estado.usuarios.findIndex(u => u.id === estado.usuarioAtual.id);
        if (index !== -1) {
            estado.usuarios[index] = estado.usuarioAtual;
            salvarDadosLocalmente();
        }
    }

    // ==========================================================================
    // --- NOVO SISTEMA DE MODAIS ---
    // ==========================================================================

    function exibirModal(config) {
        return new Promise(resolve => {
            modalTitleEl.textContent = config.title;
            modalTextEl.textContent = config.text;
            modalInputEl.style.display = config.showInput ? 'block' : 'none';
            modalInputEl.value = '';
            modalFooterEl.innerHTML = '';

            config.buttons.forEach(btnConfig => {
                const button = document.createElement('button');
                button.className = `modal-button ${btnConfig.class}`;
                button.textContent = btnConfig.text;
                button.onclick = () => {
                    modalOverlayEl.classList.remove('active');
                    if (config.showInput) {
                        resolve(btnConfig.value === 'cancel' ? null : modalInputEl.value);
                    } else {
                        resolve(btnConfig.value);
                    }
                };
                modalFooterEl.appendChild(button);
            });

            modalOverlayEl.classList.add('active');
            if (config.showInput) {
                modalInputEl.focus();
            }
        });
    }

    async function exibirAlerta(mensagem, titulo = "Atenção") {
        await exibirModal({
            title: titulo,
            text: mensagem,
            buttons: [{ text: 'OK', class: 'primary', value: true }]
        });
    }

    async function exibirConfirmacao(pergunta, titulo = "Confirmar") {
        const resultado = await exibirModal({
            title: titulo,
            text: pergunta,
            buttons: [
                { text: 'Sim', class: 'confirm', value: true },
                { text: 'Não', class: 'cancel', value: false }
            ]
        });
        return resultado;
    }

    async function exibirPrompt(pergunta, titulo = "Entrada de Dados") {
        const resultado = await exibirModal({
            title: titulo,
            text: pergunta,
            showInput: true,
            buttons: [
                { text: 'Confirmar', class: 'confirm', value: 'confirm' },
                { text: 'Cancelar', class: 'cancel', value: 'cancel' }
            ]
        });
        return resultado !== 'cancel' ? modalInputEl.value : null;
    }


    // ==========================================================================
    // --- LÓGICA DO JOGO ---
    // ==========================================================================

    function gerarProblema() {
        estado.jogoAtivo = true;
        const idade = estado.usuarioAtual ? estado.usuarioAtual.idade : 8;
        const gerador = DADOS_JOGOS[estado.materiaAtual]?.gerador;
        
        if (typeof gerador !== 'function') {
            console.error("Gerador de problemas não encontrado para a matéria:", estado.materiaAtual);
            mascoteFala("Ops! Não encontrei um gerador de desafios para esta matéria.");
            mostrarView('atividades-view');
            return;
        }

        estado.problemaAtual = gerador(estado.trilhaAtual, estado.atividadeAtual, idade);
        
        const problema = estado.problemaAtual;
        if (!problema) {
            console.error("Não foi possível gerar um problema para:", estado.materiaAtual, estado.trilhaAtual, estado.atividadeAtual);
            mascoteFala("Ops! Tive um probleminha para criar o desafio. Tente outro!");
            mostrarView('atividades-view');
            return;
        }

        opcoesEl.innerHTML = '';
        pontosProblemaEl.textContent = `Vale: ⭐ ${problema.pontos || 10} pontos`;
        botaoAjudaEl.disabled = false;
        botaoPularEl.disabled = false;
        opcoesEl.className = 'opcoes-resposta';

        enunciadoEl.innerHTML = problema.enunciado;
        if (problema.opcoes && !problema.objetosHTML) {
             gerarBotoesDeOpcao(problema.opcoes);
        } else if (problema.objetosHTML) {
             opcoesEl.innerHTML = problema.objetosHTML;
             const layoutMap = {
                 'keypad_input': 'layout-keypad',
                 'drag_classificacao': 'layout-classificacao',
                 'relogio_interativo': 'layout-relogio',
                 'drag_drop_dinheiro': 'layout-dinheiro',
                 'clique_em_objetos': 'layout-objetos',
                 'multipla_escolha': 'layout-solido'
             };
             if (layoutMap[problema.tipo]) {
                 opcoesEl.classList.add(layoutMap[problema.tipo]);
             }
             if (problema.tipo === 'multipla_escolha' && problema.opcoes) {
                gerarBotoesDeOpcao(problema.opcoes);
             }
        }
    }

    function gerarBotoesDeOpcao(opcoes) {
        const containerParaBotoes = document.createElement('div');
        containerParaBotoes.className = 'botoes-container-multipla-escolha';

        const opcoesEmbaralhadas = [...opcoes].sort(() => Math.random() - 0.5);
        opcoesEmbaralhadas.forEach(opcao => {
            const botao = document.createElement('button');
            botao.className = 'botao-resposta';
            botao.innerHTML = opcao;
            botao.dataset.valor = String(opcao);
            botao.onclick = () => {
                const acertou = String(botao.dataset.valor) === String(estado.problemaAtual.respostaCorreta);
                resolverProblema(acertou, botao);
            };
            containerParaBotoes.appendChild(botao);
        });
        opcoesEl.appendChild(containerParaBotoes);
    }

    async function resolverProblema(acertou, botaoClicado = null) {
        if (!estado.jogoAtivo) return;
        estado.jogoAtivo = false;
        botaoAjudaEl.disabled = true;
        botaoPularEl.disabled = true;
        
        const pontos = estado.problemaAtual.pontos || 10;

        if (acertou) {
            tocarSom(somAcerto);
            adicionarPontos(pontos);
            mascoteFala(`Correto! Você ganhou ${pontos} pontos!`);
            if (botaoClicado) botaoClicado.classList.add('correta');
        } else {
            tocarSom(somErro);
            const pontosPerdidos = Math.round(pontos / 2);
            adicionarPontos(-pontosPerdidos);
            mascoteFala(`Ops! A resposta correta era ${estado.problemaAtual.respostaCorreta}. Você perdeu ${pontosPerdidos} pontos.`);
            if (botaoClicado) {
                botaoClicado.classList.add('incorreta');
                document.querySelectorAll('.botao-resposta').forEach(b => {
                    if (String(b.dataset.valor) === String(estado.problemaAtual.respostaCorreta)) b.classList.add('correta');
                });
            }
        }

        setTimeout(gerarProblema, 2500);
    }


    // ==========================================================================
    // --- NAVEGAÇÃO E RENDERIZAÇÃO DE VIEWS ---
    // ==========================================================================

    const mostrarView = (id) => {
        estado.viewAtual = id;
        allViews.forEach(v => v.classList.remove('active'));
        const viewAtiva = document.getElementById(id);
        if(viewAtiva) {
            viewAtiva.classList.add('active');
        } else {
            console.error(`View com id "${id}" não encontrada.`);
            document.getElementById('mapa-view').classList.add('active');
        }
        
        const logadoNoMapa = estado.usuarioAtual && id === 'mapa-view';
        botaoLojaEl.style.display = logadoNoMapa ? 'flex' : 'none';
        botaoPerfilJogadorEl.style.display = logadoNoMapa ? 'flex' : 'none';
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
        mascoteFala(`O que vamos praticar em ${dadosMateria.nome}?`);
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
        mascoteFala("Escolha um desafio divertido!");
    }

    function iniciarJogo(atividade) {
        tocarSom(somClique);
        estado.atividadeAtual = atividade;
        const dadosAtividade = DADOS_JOGOS[estado.materiaAtual].trilhas[estado.trilhaAtual].atividades[atividade];
        document.getElementById('titulo-jogo').textContent = dadosAtividade.nome;
        mostrarView('jogo-view');
        gerarProblema();
    }

    // ==========================================================================
    // --- LÓGICA DE USUÁRIOS, PERFIL E AVATAR ---
    // ==========================================================================

    function renderizarAvatar() {
        const user = estado.usuarioAtual;
        const base = user ? user.avatar : '🧑‍🎓';
        const brindes = user ? user.brindesComprados : [];

        const avatarBaseEl = document.getElementById('avatar-base');
        const avatarCabecaEl = document.getElementById('avatar-acessorio-cabeca');
        const avatarRostoEl = document.getElementById('avatar-acessorio-rosto');
        const avatarCompanheiroEl = document.getElementById('avatar-companheiro');
        
        const avatarBasePerfilEl = document.getElementById('avatar-base-perfil');
        const avatarCabecaPerfilEl = document.getElementById('avatar-cabeca-perfil');
        const avatarRostoPerfilEl = document.getElementById('avatar-rosto-perfil');
        const avatarCompanheiroPerfilEl = document.getElementById('avatar-companheiro-perfil');

        if (avatarBaseEl) avatarBaseEl.textContent = base;
        if (avatarBasePerfilEl) avatarBasePerfilEl.textContent = base;
        
        const elementsToClear = [
            avatarCabecaEl, avatarRostoEl, avatarCompanheiroEl, 
            avatarCabecaPerfilEl, avatarRostoPerfilEl, avatarCompanheiroPerfilEl
        ];
        elementsToClear.forEach(el => { if (el) el.textContent = ''; });
        
        document.body.style.backgroundImage = '';

        if (!user) return;

        brindes.forEach(brindeId => {
            const brinde = estado.brindes.find(b => b.id === brindeId);
            if (!brinde) return;
            const emoji = (brinde.nome.match(/(\p{Emoji_Presentation}|\p{Emoji_Modifier_Base}|\p{Emoji_Modifier})/gu) || [''])[0];

            switch (brinde.slot) {
                case 'base':
                    if (avatarBaseEl) avatarBaseEl.textContent = emoji;
                    if (avatarBasePerfilEl) avatarBasePerfilEl.textContent = emoji;
                    break;
                case 'cabeca':
                    if (avatarCabecaEl) avatarCabecaEl.textContent = emoji;
                    if (avatarCabecaPerfilEl) avatarCabecaPerfilEl.textContent = emoji;
                    break;
                case 'rosto':
                    if (avatarRostoEl) avatarRostoEl.textContent = emoji;
                    if (avatarRostoPerfilEl) avatarRostoPerfilEl.textContent = emoji;
                    break;
                case 'companheiro':
                    if (avatarCompanheiroEl) avatarCompanheiroEl.textContent = emoji;
                    if (avatarCompanheiroPerfilEl) avatarCompanheiroPerfilEl.textContent = emoji;
                    break;
                case 'fundo':
                    if (brinde.nome.includes('Estrelas')) document.body.style.backgroundImage = 'linear-gradient(to bottom, #2c3e50, #4ca1af)';
                    if (brinde.nome.includes('Submarino')) document.body.style.backgroundImage = 'linear-gradient(to bottom, #0077be, #87ceeb)';
                    if (brinde.nome.includes('Espacial')) document.body.style.backgroundImage = 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)';
                    break;
            }
        });
    }

    function renderizarPerfis() {
        if (!perfisContainerEl) return;
        perfisContainerEl.innerHTML = '';
        
        const adminButton = document.createElement('button');
        adminButton.className = 'botao-perfil';
        adminButton.id = 'botao-admin';
        adminButton.innerHTML = `<span class="perfil-icone">👑</span><span class="perfil-nome">Administrador</span>`;
        adminButton.addEventListener('click', () => { tocarSom(somClique); loginAdmin(); });
        perfisContainerEl.appendChild(adminButton);

        estado.usuarios.forEach(usuario => {
            const perfilButton = document.createElement('button');
            perfilButton.className = 'botao-perfil';
            perfilButton.innerHTML = `<span class="perfil-icone">${usuario.avatar || '🧑‍🎓'}</span><span class="perfil-nome">${usuario.nome}</span>`;
            perfilButton.addEventListener('click', () => selecionarUsuario(usuario.id));
            perfisContainerEl.appendChild(perfilButton);
        });

        const novoUsuarioButton = document.createElement('button');
        novoUsuarioButton.className = 'botao-perfil novo-usuario';
        novoUsuarioButton.innerHTML = `<span class="perfil-icone">➕</span><span class="perfil-nome">Novo Jogador</span>`;
        novoUsuarioButton.addEventListener('click', criarNovoUsuario);
        perfisContainerEl.appendChild(novoUsuarioButton);
    }

    async function criarNovoUsuario() {
        tocarSom(somClique);
        const nome = await exibirPrompt("Qual é o seu nome, jovem aventureiro(a)?", "Novo Jogador");
        if (!nome || nome.trim() === "") {
            mascoteFala("Para criar um perfil, preciso saber seu nome!");
            return;
        }

        const idadeInput = await exibirPrompt(`Olá, ${nome.trim()}! Quantos anos você tem?`, "Idade");
        if (idadeInput === null) return;
        const idade = parseInt(idadeInput, 10);
        if (isNaN(idade) || idade < 4 || idade > 12) {
            mascoteFala("Por favor, insira uma idade válida entre 4 e 12 anos.");
            await exibirAlerta("Idade inválida. Por favor, insira um número entre 4 e 12.");
            return;
        }

        const generoInput = await exibirPrompt("Para o seu avatar, você escolhe 'menino' ou 'menina'?", "Avatar");
        if (generoInput === null) return;
        const genero = generoInput.toLowerCase();
        if (genero !== 'menino' && genero !== 'menina') {
            mascoteFala("Por favor, escolha 'menino' ou 'menina'.");
            await exibirAlerta("Opção inválida. Por favor, digite 'menino' ou 'menina'.");
            return;
        }

        const novoUsuario = {
            id: 'user_' + Date.now(), // ID único local
            nome: nome.trim(),
            idade: idade,
            avatar: genero === 'menina' ? '👩‍🎓' : '🧑‍🎓',
            pontos: 0,
            brindesComprados: []
        };

        estado.usuarios.push(novoUsuario);
        salvarDadosLocalmente();
        renderizarPerfis();
        mascoteFala(`Seja bem-vindo(a), ${nome.trim()}!`);
    }

    function selecionarUsuario(id) {
        tocarSom(somClique);
        const usuario = estado.usuarios.find(u => u.id === id);
        if (usuario) {
            estado.usuarioAtual = usuario;
            atualizarPontosDisplay();
            renderizarAvatar();
            mascoteFala(`Olá, ${usuario.nome}! Pronto(a) para a aventura?`);
            mostrarView('mapa-view');
        }
    }

    async function loginAdmin() {
        const senha = await exibirPrompt("Digite a senha de administrador:", "Senha de Administrador");
        if (senha === "Admin123") {
            estado.usuarioAtual = null;
            atualizarPontosDisplay();
            renderizarAvatar();
            botaoLojaEl.style.display = 'none';
            botaoPerfilJogadorEl.style.display = 'none';
            renderizarBrindesAdmin();
            renderizarUsuariosAdmin();
            mascoteFala("Olá, Administrador! Gerenciando dados locais.");
            mostrarView('admin-view');
        } else if (senha !== null) {
            mascoteFala("Senha incorreta. Acesso negado.");
            await exibirAlerta("Senha incorreta!", "Acesso Negado");
        }
    }
    
    async function salvarPerfil() {
        const novoNome = inputNomePerfilEl.value.trim();
        const novaIdade = parseInt(inputIdadePerfilEl.value, 10);
        if (!novoNome) {
            await exibirAlerta("O nome não pode ficar em branco!");
            return;
        }
        if (isNaN(novaIdade) || novaIdade < 4 || novaIdade > 12) {
            await exibirAlerta("Por favor, insira uma idade válida entre 4 e 12 anos.");
            return;
        }

        const index = estado.usuarios.findIndex(u => u.id === estado.usuarioAtual.id);
        if (index !== -1) {
            estado.usuarios[index].nome = novoNome;
            estado.usuarios[index].idade = novaIdade;
            estado.usuarioAtual = estado.usuarios[index]; // Atualiza o usuário atual no estado
            salvarDadosLocalmente();
            mascoteFala("Seu perfil foi salvo com sucesso!");
            setTimeout(() => mostrarView('mapa-view'), 1500);
        } else {
            mascoteFala("Ops! Não consegui encontrar seu perfil para salvar.");
        }
    }


    // ==========================================================================
    // --- LÓGICA DA LOJA E ADMINISTRAÇÃO ---
    // ==========================================================================

    function renderizarLoja() {
        lojaContainerEl.innerHTML = '';
        estado.brindes.forEach(brinde => {
            const item = document.createElement('div');
            item.className = 'item-loja';
            const jaComprou = estado.usuarioAtual.brindesComprados.includes(brinde.id);
            const podeComprar = estado.usuarioAtual.pontos >= brinde.custo;
            let icone = brinde.nome.match(/(\p{Emoji_Presentation}|\p{Emoji_Modifier_Base}|\p{Emoji_Modifier})/gu);
            icone = icone ? icone[0] : '🎁';

            item.innerHTML = `
                <div class="item-loja-icone">${icone}</div>
                <div class="item-loja-nome">${brinde.nome.replace(/(\p{Emoji_Presentation}|\p{Emoji_Modifier_Base}|\p{Emoji_Modifier})/gu, '').trim()}</div>
                <div class="item-loja-custo">⭐ ${brinde.custo}</div>
            `;

            if (jaComprou) {
                item.classList.add('comprado');
            } else if (!podeComprar) {
                item.classList.add('desabilitado');
            } else {
                item.addEventListener('click', () => comprarBrinde(brinde));
            }
            lojaContainerEl.appendChild(item);
        });
    }

    async function comprarBrinde(brinde) {
        const confirmou = await exibirConfirmacao(`Você quer gastar ${brinde.custo} pontos para comprar "${brinde.nome}"?`, "Confirmar Compra");
        if (confirmou) {
            estado.usuarioAtual.pontos -= brinde.custo;
            estado.usuarioAtual.brindesComprados.push(brinde.id);
            
            const index = estado.usuarios.findIndex(u => u.id === estado.usuarioAtual.id);
            if (index !== -1) {
                estado.usuarios[index] = estado.usuarioAtual;
                salvarDadosLocalmente();
            }
            
            atualizarPontosDisplay();
            renderizarLoja();
            renderizarAvatar();
            mascoteFala(`Parabéns! Você adquiriu ${brinde.nome}!`);
        }
    }

    function renderizarBrindesAdmin() {
        listaBrindesAdminEl.innerHTML = '';
        if (estado.brindes.length === 0) {
            listaBrindesAdminEl.innerHTML = '<p>Nenhum brinde cadastrado.</p>';
            return;
        }
        estado.brindes.forEach(brinde => {
            const item = document.createElement('div');
            item.className = 'item-lista-admin';
            item.innerHTML = `
                <span>${brinde.nome}</span>
                <div>
                    <span class="custo-brinde">⭐ ${brinde.custo}</span>
                    <button data-id="${brinde.id}">Remover</button>
                </div>
            `;
            item.querySelector('button').addEventListener('click', () => removerBrinde(brinde.id));
            listaBrindesAdminEl.appendChild(item);
        });
    }
    
    function renderizarUsuariosAdmin() {
        listaUsuariosAdminEl.innerHTML = '';
        if (estado.usuarios.length === 0) {
            listaUsuariosAdminEl.innerHTML = '<p>Nenhum usuário cadastrado.</p>';
            return;
        }
        estado.usuarios.forEach(usuario => {
            const item = document.createElement('div');
            item.className = 'item-lista-admin';
            item.innerHTML = `
                <span>${usuario.nome} (Pontos: ⭐ ${usuario.pontos})</span>
                <button data-id="${usuario.id}">Remover</button>
            `;
            item.querySelector('button').addEventListener('click', () => removerUsuario(usuario.id));
            listaUsuariosAdminEl.appendChild(item);
        });
    }

    async function adicionarBrinde() {
        const nome = inputNomeBrindeEl.value.trim();
        const custo = parseInt(inputCustoBrindeEl.value, 10);
        if (!nome || isNaN(custo) || custo <= 0) {
            await exibirAlerta("Por favor, preencha o nome e um custo válido para o brinde.");
            return;
        }
        const novoBrinde = { id: 'brinde_' + Date.now(), nome, custo, tipo: 'custom', slot: 'rosto' };
        estado.brindes.push(novoBrinde);
        salvarDadosLocalmente();
        renderizarBrindesAdmin();
        inputNomeBrindeEl.value = '';
        inputCustoBrindeEl.value = '';
        mascoteFala("Novo brinde adicionado com sucesso!");
    }

    async function removerBrinde(id) {
        if (await exibirConfirmacao("Tem certeza que deseja remover este brinde?", "Remover Brinde")) {
            estado.brindes = estado.brindes.filter(b => b.id !== id);
            salvarDadosLocalmente();
            renderizarBrindesAdmin();
            mascoteFala("Brinde removido.");
        }
    }
    
    async function removerUsuario(id) {
        if (await exibirConfirmacao("Tem certeza que deseja remover este usuário? Todo o progresso dele será perdido.", "Remover Usuário")) {
            estado.usuarios = estado.usuarios.filter(u => u.id !== id);
            salvarDadosLocalmente();
            renderizarUsuariosAdmin();
            renderizarPerfis();
            mascoteFala("Usuário removido.");
        }
    }

    // ==========================================================================
    // --- INICIALIZAÇÃO DA APLICAÇÃO ---
    // ==========================================================================

    function inicializarApp() {
        carregarDadosLocais();
        
        // Configura a navegação pelas ilhas
        document.getElementById('ilha-matematica').addEventListener('click', () => mostrarTrilhas('matematica'));
        document.getElementById('ilha-portugues').addEventListener('click', () => mostrarTrilhas('portugues'));
        document.getElementById('ilha-ciencias').addEventListener('click', () => mostrarTrilhas('ciencias'));
        document.getElementById('ilha-historia').addEventListener('click', () => mostrarTrilhas('historia'));
        document.getElementById('ilha-geografia').addEventListener('click', () => mostrarTrilhas('geografia'));
        document.getElementById('ilha-ingles').addEventListener('click', () => mostrarTrilhas('ingles'));
        
        // Configura botões do HUD
        document.getElementById('botao-configuracoes').addEventListener('click', () => {
            tocarSom(somClique);
            definirCorAtiva('#888');
            estado.usuarioAtual = null; // Desloga o usuário
            atualizarPontosDisplay();
            renderizarAvatar();
            renderizarPerfis(); // Atualiza a lista de perfis
            mostrarView('configuracoes-view');
            mascoteFala("Quem está jogando agora?");
        });
        botaoLojaEl.addEventListener('click', () => {
            tocarSom(somClique);
            definirCorAtiva('#ffc107');
            renderizarLoja();
            mostrarView('loja-view');
            mascoteFala("Aqui você pode trocar seus pontos por prêmios!");
        });
        botaoPerfilJogadorEl.addEventListener('click', () => {
            tocarSom(somClique);
            if (!estado.usuarioAtual) return;
            inputNomePerfilEl.value = estado.usuarioAtual.nome;
            inputIdadePerfilEl.value = estado.usuarioAtual.idade;
            renderizarAvatar();
            mostrarView('perfil-view');
            mascoteFala("Aqui você pode ver e editar seu perfil!");
        });
        
        // Configura botões de ação
        botaoAddBrindeEl.addEventListener('click', adicionarBrinde);
        botaoSalvarPerfilEl.addEventListener('click', salvarPerfil);
        botaoAjudaEl.addEventListener('click', async () => {
            if (!estado.jogoAtivo || !estado.problemaAtual) return;
            const dica = estado.problemaAtual.dica || "Nenhuma dica para esta questão.";
            const custoDica = Math.round((estado.problemaAtual.pontos || 10) * 0.3);
            mascoteFala(`Dica: ${dica} (Custo: ${custoDica} pontos)`);
            adicionarPontos(-custoDica);
            botaoAjudaEl.disabled = true;
        });
        botaoPularEl.addEventListener('click', () => {
            if (!estado.jogoAtivo) return;
            mascoteFala("Ok, vamos pular esta. Próxima pergunta!");
            gerarProblema();
        });

        // Delegação de eventos para os botões de "voltar"
        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('botao-voltar')) {
                tocarSom(somClique);
                const id = e.target.id;
                if (id === 'voltar-para-mapa' || id === 'voltar-loja-para-mapa' || id === 'voltar-perfil-para-mapa') {
                    mostrarView('mapa-view');
                    definirCorAtiva('#555');
                    if(estado.usuarioAtual) mascoteFala(`Vamos continuar a aventura, ${estado.usuarioAtual.nome}!`);
                } else if (id === 'voltar-para-trilhas') {
                    mostrarTrilhas(estado.materiaAtual);
                } else if (id === 'voltar-para-atividades') {
                    mostrarAtividades(estado.trilhaAtual);
                } else if (id === 'voltar-config-para-mapa') {
                    if (estado.usuarioAtual) {
                        mostrarView('mapa-view');
                        mascoteFala(`Vamos continuar a aventura, ${estado.usuarioAtual.nome}!`);
                    } else {
                        renderizarPerfis();
                        mostrarView('configuracoes-view');
                        mascoteFala("Quem está jogando agora?");
                    }
                } else if (id === 'voltar-admin-para-config') {
                    renderizarPerfis();
                    mostrarView('configuracoes-view');
                    mascoteFala("Quem está jogando agora?");
                }
            }
        });
        
        mascoteFala("Olá! Bem-vindo(a) à Aventura do Saber!");
        renderizarAvatar();
        renderizarPerfis();
        mostrarView('configuracoes-view');
    }

    // --- Ponto de Entrada ---
    inicializarApp();
});
