document.addEventListener('DOMContentLoaded', () => {
    const JOGOS = window.AventuraDoSaber;
    const CONFIG = window.AventuraDoSaber.config;
    
    // Objeto principal que define todas as matérias e seus dados
    const DADOS_JOGOS = {
        matematica: {
            nome: "Ilha dos Números", cor: "#0077be",
            trilhas: { 
                ...JOGOS.operacoes.DADOS, 
                ...JOGOS.fracoes.DADOS, 
                ...JOGOS.geometria.DADOS, 
                ...JOGOS.medidas.DADOS, 
                ...JOGOS.resolucao_problemas.DADOS,
                ...JOGOS.estatistica.DADOS,
                ...JOGOS.probabilidade.DADOS
            },
            gerador: (trilha, atividade) => {
                if (trilha in JOGOS.operacoes.DADOS) return JOGOS.operacoes.gerarProblema(trilha, atividade);
                if (trilha in JOGOS.fracoes.DADOS) return JOGOS.fracoes.gerarProblema(trilha, atividade);
                if (trilha in JOGOS.geometria.DADOS) return JOGOS.geometria.gerarProblema(trilha, atividade);
                if (trilha in JOGOS.medidas.DADOS) return JOGOS.medidas.gerarProblema(trilha, atividade);
                if (trilha in JOGOS.resolucao_problemas.DADOS) return JOGOS.resolucao_problemas.gerarProblema(trilha, atividade);
                if (trilha in JOGOS.estatistica.DADOS) return JOGOS.estatistica.gerarProblema(trilha, atividade);
                if (trilha in JOGOS.probabilidade.DADOS) return JOGOS.probabilidade.gerarProblema(trilha, atividade);
            }
        },
        portugues: {
            nome: "Ilha das Palavras", cor: "#c94c4c",
            trilhas: { ...JOGOS.ortografia.DADOS },
            gerador: (trilha, atividade) => JOGOS.ortografia.gerarProblema(trilha, atividade)
        },
        ciencias: {
            nome: "Ilha das Descobertas", cor: "#4CAF50",
            trilhas: { ...JOGOS.ciencias.DADOS },
            gerador: (trilha, atividade) => JOGOS.ciencias.gerarProblema(trilha, atividade)
        },
        historia: {
            nome: "Ilha do Tempo", cor: "#A0522D",
            trilhas: { ...JOGOS.historia.DADOS },
            gerador: (trilha, atividade) => JOGOS.historia.gerarProblema(trilha, atividade)
        },
        geografia: {
            nome: "Ilha do Mundo", cor: "#20B2AA",
            trilhas: { ...JOGOS.geografia.DADOS },
            gerador: (trilha, atividade) => JOGOS.geografia.gerarProblema(trilha, atividade)
        },
        ingles: {
            nome: "The English Island", cor: "#6f42c1",
            trilhas: { ...JOGOS.ingles.DADOS },
            gerador: (trilha, atividade) => JOGOS.ingles.gerarProblema(trilha, atividade)
        }
    };

    // --- Elementos da DOM ---
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
    const lojaContainerEl = document.getElementById('loja-container');
    const avatarBaseEl = document.getElementById('avatar-base');
    const avatarCabecaEl = document.getElementById('avatar-acessorio-cabeca');
    const avatarRostoEl = document.getElementById('avatar-acessorio-rosto');
    const avatarCompanheiroEl = document.getElementById('avatar-companheiro');


    // --- Estado da Aplicação ---
    let estado = { 
        viewAtual: 'configuracoes-view', 
        materiaAtual: null, 
        trilhaAtual: null, 
        atividadeAtual: null, 
        respostaCorreta: null, 
        jogoAtivo: false, 
        acertosAtuais: 0, 
        classeAlvo: '',
        usuarioAtual: null,
        usuarios: [],
        brindes: [] 
    };

    // --- Sons ---
    const somAcerto = new Audio('assets/sounds/acerto.mp3'); 
    const somErro = new Audio('assets/sounds/erro.mp3'); 
    const somClique = new Audio('assets/sounds/clique.mp3');

    // --- Lógica Principal do Jogo ---
    function adicionarPontos(quantidade) {
        if (estado.usuarioAtual) {
            estado.usuarioAtual.pontos += quantidade;
            atualizarPontosDisplay();
            salvarEstado();
        }
    }

    function gerarProblema() {
        estado.jogoAtivo = true;
        // Acessa o gerador da matéria atual de forma dinâmica
        const problema = DADOS_JOGOS[estado.materiaAtual].gerador(estado.trilhaAtual, estado.atividadeAtual);
        opcoesEl.innerHTML = '';
        
        if (problema.objetosHTML) {
             enunciadoEl.innerHTML = problema.enunciado;
             opcoesEl.innerHTML = problema.objetosHTML;
        } else {
             enunciadoEl.innerHTML = problema.enunciado;
        }
        
        estado.respostaCorreta = problema.respostaCorreta;

        switch (problema.tipo) {
            case 'drag_classificacao': 
                opcoesEl.className = 'layout-classificacao'; 
                configurarJogoClassificacao(); 
                break;
            case 'keypad_input': 
                opcoesEl.className = 'layout-keypad';
                configurarJogoKeypad(); 
                break;
            case 'drag_drop_dinheiro':
                opcoesEl.className = 'layout-dinheiro';
                configurarJogoDinheiro();
                break;
            case 'relogio_interativo': 
                opcoesEl.className = 'layout-relogio';
                configurarJogoRelogio(); 
                break;
            case 'clique_em_objetos': 
                opcoesEl.className = 'layout-objetos'; 
                estado.classeAlvo = problema.classeAlvo; 
                configurarJogoDeClique(); 
                break;
            default:
                opcoesEl.className = (estado.atividadeAtual === 'vf') ? 'vf-layout' : ''; 
                gerarBotoesDeOpcao(problema.opcoes); 
                break;
        }
        mascoteFala("Vamos lá, você consegue!");
    };
    
    function configurarJogoClassificacao() {
        const item = document.querySelector('.item-classificavel'); 
        const caixas = document.querySelectorAll('.caixa-classificacao');
        item.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', 'fracao'); });
        caixas.forEach(caixa => {
            caixa.addEventListener('dragover', (e) => { e.preventDefault(); caixa.classList.add('drag-over'); });
            caixa.addEventListener('dragleave', () => { caixa.classList.remove('drag-over'); });
            caixa.addEventListener('drop', (e) => {
                e.preventDefault(); 
                caixa.classList.remove('drag-over'); 
                if (!estado.jogoAtivo) return;
                if (caixa.dataset.tipo === estado.respostaCorreta) {
                    estado.jogoAtivo = false; tocarSom(somAcerto); mascoteFala("Classificação perfeita!");
                    adicionarPontos(10);
                    caixa.style.backgroundColor = 'var(--cor-sucesso)'; item.style.display = 'none';
                    setTimeout(gerarProblema, 2000);
                } else {
                    tocarSom(somErro); mascoteFala("Opa, essa não é a caixa certa!");
                    caixa.style.borderColor = 'var(--cor-erro)'; setTimeout(() => { caixa.style.borderColor = '#ccc'; }, 1500);
                }
            });
        });
    }

    function configurarJogoKeypad() {
        const display = document.getElementById('display-keypad'); 
        const botoes = document.querySelectorAll('.botoes-keypad button');
        botoes.forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.key;
                if (key === 'ok') { verificarRespostaKeypad(display.textContent); } 
                else if (key === 'apagar') { display.textContent = display.textContent.slice(0, -1); } 
                else if (display.textContent.length < 6) { display.textContent += key; }
            });
        });
    }

    function verificarRespostaKeypad(respostaUsuario) {
        if (!estado.jogoAtivo || respostaUsuario === '') return;
        if (parseInt(respostaUsuario, 10) === estado.respostaCorreta) {
            estado.jogoAtivo = false; tocarSom(somAcerto); mascoteFala("Que raciocínio rápido! Parabéns!");
            adicionarPontos(15);
            const container = document.querySelector('.container-keypad') || document.querySelector('.malha-geometrica');
            if (container) container.style.borderColor = 'var(--cor-sucesso)'; 
            setTimeout(gerarProblema, 2000);
        } else {
            tocarSom(somErro); mascoteFala("Hmm, essa não é a resposta. Leia com atenção!");
            const container = document.querySelector('.container-keypad') || document.querySelector('.malha-geometrica');
            if (container) container.style.borderColor = 'var(--cor-erro)';
            setTimeout(() => { if (estado.jogoAtivo && container) container.style.borderColor = '#ccc'; }, 1500);
        }
    }
    
    function configurarJogoDinheiro() {
        const bandeja = document.getElementById('bandeja-pagamento');
        const totalPagoEl = bandeja.querySelector('.total-pago');
        const dinheiros = document.querySelectorAll('.dinheiro');
        const btnVerificar = document.getElementById('btn-verificar');

        let totalAtual = 0;
        const textoLabel = (estado.atividadeAtual === 'dando_troco') ? 'Troco' : 'Total';
        totalPagoEl.textContent = `${textoLabel}: R$ 0,00`;

        dinheiros.forEach(dinheiro => {
            dinheiro.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', dinheiro.dataset.valor);
            });
        });
        bandeja.addEventListener('dragover', (e) => e.preventDefault());
        bandeja.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!estado.jogoAtivo) return;
            const valor = parseInt(e.dataTransfer.getData('text/plain'), 10);
            totalAtual += valor;
            totalPagoEl.textContent = `${textoLabel}: ${(totalAtual / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
        });
        btnVerificar.addEventListener('click', () => {
            if (!estado.jogoAtivo) return;
            if (totalAtual === estado.respostaCorreta) {
                estado.jogoAtivo = false; tocarSom(somAcerto); mascoteFala("Valor exato! Perfeito!");
                adicionarPontos(25);
                bandeja.style.borderColor = 'var(--cor-sucesso)';
                setTimeout(gerarProblema, 2000);
            } else {
                tocarSom(somErro); mascoteFala("O valor não está correto. Vamos tentar de novo!");
                totalAtual = 0; totalPagoEl.textContent = `${textoLabel}: R$ 0,00`;
                bandeja.style.borderColor = 'var(--cor-erro)';
                setTimeout(() => { if (estado.jogoAtivo) bandeja.style.borderColor = 'var(--cor-ativa)'; }, 1500);
            }
        });
    }

    function configurarJogoRelogio() {
        const ponteiroHora = document.getElementById('ponteiro-hora'); 
        const ponteiroMinuto = document.getElementById('ponteiro-minuto');
        const btnVerificar = document.getElementById('btn-verificar-relogio'); 
        const faceRelogio = document.querySelector('.relogio-face');
        let anguloHora = 0; let anguloMinuto = 0;
        function atualizarPonteiro(p, a) { p.style.transform = `translateX(-50%) rotate(${a}deg)`; }
        function arrastarPonteiro(p, e) {
            e.preventDefault(); const rect = faceRelogio.getBoundingClientRect();
            const cX = rect.left + rect.width / 2; const cY = rect.top + rect.height / 2;
            const mX = e.clientX || e.touches[0].clientX; const mY = e.clientY || e.touches[0].clientY;
            let aG = Math.atan2(mY - cY, mX - cX) * (180 / Math.PI) + 90;
            if (aG < 0) aG += 360;
            if (p === ponteiroMinuto) { anguloMinuto = Math.round(aG / 6) * 6; atualizarPonteiro(ponteiroMinuto, anguloMinuto); } 
            else { anguloHora = Math.round(aG / 30) * 30; atualizarPonteiro(ponteiroHora, anguloHora); }
        }
        function iniciarArrasto(p) {
            const mover = (e) => arrastarPonteiro(p, e);
            const parar = () => { document.removeEventListener('mousemove', mover); document.removeEventListener('mouseup', parar); document.removeEventListener('touchmove', mover); document.removeEventListener('touchend', parar); };
            document.addEventListener('mousemove', mover); document.addEventListener('mouseup', parar); document.addEventListener('touchmove', mover); document.addEventListener('touchend', parar);
        }
        ponteiroHora.addEventListener('mousedown', () => iniciarArrasto(ponteiroHora)); ponteiroMinuto.addEventListener('mousedown', () => iniciarArrasto(ponteiroMinuto));
        ponteiroHora.addEventListener('touchstart', () => iniciarArrasto(ponteiroHora)); ponteiroMinuto.addEventListener('touchstart', () => iniciarArrasto(ponteiroMinuto));
        btnVerificar.addEventListener('click', () => {
            if (!estado.jogoAtivo) return;
            let hA = Math.round(anguloHora / 30); if (hA === 0) hA = 12;
            let mA = Math.round(anguloMinuto / 6); if (mA === 60) mA = 0;
            const { hora, minuto } = estado.respostaCorreta;
            if (hA === hora && mA === minuto) {
                estado.jogoAtivo = false; tocarSom(somAcerto); mascoteFala("Hora certa! Excelente!");
                adicionarPontos(20);
                faceRelogio.style.borderColor = 'var(--cor-sucesso)'; setTimeout(gerarProblema, 2000);
            } else { tocarSom(somErro); mascoteFala("Quase! Verifique os ponteiros."); faceRelogio.style.borderColor = 'var(--cor-erro)'; setTimeout(() => { if(estado.jogoAtivo) faceRelogio.style.borderColor = 'var(--cor-ativa)'; }, 1500); }
        });
    }

    function configurarJogoDeClique() {
        estado.acertosAtuais = 0;
        document.querySelectorAll('.forma-geometrica').forEach(forma => {
            if (forma.classList.contains('triangulo')) { forma.style.borderBottomColor = forma.style.backgroundColor; }
            forma.addEventListener('click', () => {
                if (!estado.jogoAtivo || forma.classList.contains('encontrado')) return;
                if (forma.dataset.forma === estado.classeAlvo) {
                    tocarSom(somAcerto); forma.classList.add('encontrado'); estado.acertosAtuais++;
                    if (estado.acertosAtuais === estado.respostaCorreta) {
                        estado.jogoAtivo = false; mascoteFala("Incrível! Você encontrou todos!");
                        adicionarPontos(15);
                        setTimeout(gerarProblema, 2000);
                    }
                } else { tocarSom(somErro); }
            });
        });
    }
    
    // --- Navegação e UI ---
    const mostrarView = (id) => { 
        estado.viewAtual = id; 
        allViews.forEach(v => v.classList.remove('active')); 
        document.getElementById(id).classList.add('active'); 
        configurarBotoesVoltar(); 
        botaoLojaEl.style.display = estado.usuarioAtual && id === 'mapa-view' ? 'flex' : 'none';
    };
    const definirCorAtiva = (cor) => { document.documentElement.style.setProperty('--cor-ativa', cor); };
    
    function mostrarTrilhas(materia) {
        tocarSom(somClique); estado.materiaAtual = materia; const dadosMateria = DADOS_JOGOS[materia];
        definirCorAtiva(dadosMateria.cor); document.getElementById('trilhas-titulo').textContent = dadosMateria.nome;
        const container = document.getElementById('trilhas-container'); container.innerHTML = '';
        for (const [chaveTrilha, trilha] of Object.entries(dadosMateria.trilhas)) {
            const botao = document.createElement('button'); botao.className = 'menu-botao';
            botao.innerHTML = `<span class="icone">${trilha.icone}</span> ${trilha.nome}`;
            botao.onclick = () => mostrarAtividades(chaveTrilha); container.appendChild(botao);
        }
        mostrarView('trilhas-view'); mascoteFala(`O que vamos praticar em ${dadosMateria.nome}?`);
    }

    function mostrarAtividades(trilha) {
        tocarSom(somClique); estado.trilhaAtual = trilha; const dadosTrilha = DADOS_JOGOS[estado.materiaAtual].trilhas[trilha];
        document.getElementById('atividades-titulo').textContent = dadosTrilha.nome;
        const container = document.getElementById('atividades-container'); container.innerHTML = '';
        for (const [chaveAtividade, atividade] of Object.entries(dadosTrilha.atividades)) {
            const botao = document.createElement('button'); botao.className = 'menu-botao';
            botao.onclick = () => iniciarJogo(chaveAtividade);
            botao.innerHTML = `<span class="icone">${atividade.icone}</span> ${atividade.nome}`;
            container.appendChild(botao);
        }
        mostrarView('atividades-view'); mascoteFala("Escolha um desafio divertido!");
    }

    function iniciarJogo(atividade) {
        tocarSom(somClique); estado.atividadeAtual = atividade;
        const dadosAtividade = DADOS_JOGOS[estado.materiaAtual].trilhas[estado.trilhaAtual].atividades[atividade];
        document.getElementById('titulo-jogo').textContent = dadosAtividade.nome;
        document.getElementById('jogo-view').dataset.trilha = estado.trilhaAtual;
        mostrarView('jogo-view'); gerarProblema();
    }

    function gerarBotoesDeOpcao(opcoes) {
        let container = opcoesEl;
        if (container.querySelector('.container-solido') || container.querySelector('.container-grafico') || container.querySelector('.container-roleta')) {
            const botoesContainer = document.createElement('div');
            botoesContainer.className = 'botoes-resposta-container';
            opcoesEl.appendChild(botoesContainer);
            container = botoesContainer;
        }

        const opcoesOrdenadas = (estado.atividadeAtual === 'vf') ? opcoes : [...opcoes].sort(() => Math.random() - 0.5);
        opcoesOrdenadas.forEach(opcao => {
            const botao = document.createElement('button'); botao.className = 'botao-resposta';
            botao.textContent = opcao;
            if (opcao === "Verdadeiro") botao.innerHTML = 'Verdadeiro 👍'; if (opcao === "Falso") botao.innerHTML = 'Falso 👎';
            botao.dataset.valor = opcao; botao.onclick = () => verificarRespostaMultiplaEscolha(botao);
            container.appendChild(botao);
        });
    }

    function verificarRespostaMultiplaEscolha(botaoClicado) {
        if (!estado.jogoAtivo) return; estado.jogoAtivo = false; const eCorreta = botaoClicado.dataset.valor == estado.respostaCorreta;
        if (eCorreta) {
            tocarSom(somAcerto); mascoteFala("Isso mesmo! Você é fera!");
            adicionarPontos((estado.atividadeAtual === 'vf') ? 5 : 10);
            botaoClicado.classList.add('correta');
        } else {
            tocarSom(somErro); mascoteFala("Opa, essa não estava certa."); botaoClicado.classList.add('incorreta');
            document.querySelectorAll('.botao-resposta').forEach(b => { if (b.dataset.valor == estado.respostaCorreta) b.classList.add('correta'); });
        }
        setTimeout(gerarProblema, 1800);
    }
    
    const tocarSom = (som) => { som.currentTime = 0; som.play().catch(e => console.log("Erro ao tocar som:", e)); };
    const mascoteFala = (texto) => { balaoFala.textContent = texto; };
    const atualizarPontosDisplay = () => {
        pontosDisplay.textContent = estado.usuarioAtual ? estado.usuarioAtual.pontos : 0;
    };
    
    // --- Lógica de Estado, Usuários e Brindes ---
    function salvarEstado() {
        const dadosParaSalvar = {
            usuarios: estado.usuarios,
            brindes: estado.brindes
        };
        localStorage.setItem('aventuraSaberEstado', JSON.stringify(dadosParaSalvar));
    }
    
    function carregarEstado() {
        const estadoSalvo = localStorage.getItem('aventuraSaberEstado');
        if (estadoSalvo) { 
            const dadosSalvos = JSON.parse(estadoSalvo);
            estado.usuarios = dadosSalvos.usuarios || [];
            estado.brindes = dadosSalvos.brindes || [];
        }
        
        if (estado.brindes.length === 0) {
            estado.brindes = CONFIG.BRINDES_PADRAO;
        }
        renderizarPerfis();
        renderizarBrindesAdmin();
        renderizarUsuariosAdmin();
    }
    
    // --- Lógica de Usuários e Avatar ---
    function renderizarAvatar() {
        avatarBaseEl.textContent = '🧑‍🎓';
        avatarCabecaEl.textContent = '';
        avatarRostoEl.textContent = '';
        avatarCompanheiroEl.textContent = '';
        document.body.style.backgroundImage = '';

        if (!estado.usuarioAtual) {
            avatarBaseEl.textContent = '🦉';
            return;
        }

        estado.usuarioAtual.brindesComprados.forEach(brindeId => {
            const brinde = estado.brindes.find(b => b.id === brindeId);
            if (!brinde) return;

            const emoji = (brinde.nome.match(/(\p{Emoji_Presentation})/gu) || [''])[0];

            switch(brinde.slot) {
                case 'base': avatarBaseEl.textContent = emoji; break;
                case 'cabeca': avatarCabecaEl.textContent = emoji; break;
                case 'rosto': avatarRostoEl.textContent = emoji; break;
                case 'companheiro': avatarCompanheiroEl.textContent = emoji; break;
                case 'fundo': 
                    if (brinde.nome.includes('Estrelas')) document.body.style.backgroundImage = 'linear-gradient(to bottom, #2c3e50, #4ca1af)';
                    if (brinde.nome.includes('Submarino')) document.body.style.backgroundImage = 'linear-gradient(to bottom, #0077be, #87ceeb)';
                    if (brinde.nome.includes('Espacial')) document.body.style.backgroundImage = 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)';
                    break;
            }
        });
    }

    function renderizarPerfis() {
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
            perfilButton.innerHTML = `<span class="perfil-icone">🧑‍🎓</span><span class="perfil-nome">${usuario.nome}</span>`;
            perfilButton.addEventListener('click', () => selecionarUsuario(usuario.id));
            perfisContainerEl.appendChild(perfilButton);
        });

        const novoUsuarioButton = document.createElement('button');
        novoUsuarioButton.className = 'botao-perfil novo-usuario';
        novoUsuarioButton.innerHTML = `<span class="perfil-icone">➕</span><span class="perfil-nome">Novo Jogador</span>`;
        novoUsuarioButton.addEventListener('click', criarNovoUsuario);
        perfisContainerEl.appendChild(novoUsuarioButton);
    }

    function criarNovoUsuario() {
        tocarSom(somClique);
        const nome = prompt("Qual é o seu nome, jovem aventureiro(a)?");
        if (nome && nome.trim() !== "") {
            const novoUsuario = {
                id: Date.now(),
                nome: nome.trim(),
                pontos: 0,
                brindesComprados: []
            };
            estado.usuarios.push(novoUsuario);
            salvarEstado();
            renderizarPerfis();
            renderizarUsuariosAdmin();
            mascoteFala(`Seja bem-vindo(a), ${nome.trim()}!`);
        } else {
            mascoteFala("Para criar um perfil, preciso saber seu nome!");
        }
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

    // --- Lógica da Loja ---
    function mostrarLoja() {
        tocarSom(somClique);
        definirCorAtiva('#ffc107');
        renderizarLoja();
        mostrarView('loja-view');
        mascoteFala("Aqui você pode trocar seus pontos por prêmios!");
    }

    function renderizarLoja() {
        lojaContainerEl.innerHTML = '';
        estado.brindes.forEach(brinde => {
            const item = document.createElement('div');
            item.className = 'item-loja';
            
            const jaComprou = estado.usuarioAtual.brindesComprados.includes(brinde.id);
            const podeComprar = estado.usuarioAtual.pontos >= brinde.custo;

            let icone = brinde.nome.match(/(\p{Emoji_Presentation})/gu);
            icone = icone ? icone[0] : '🎁';

            item.innerHTML = `
                <div class="item-loja-icone">${icone}</div>
                <div class="item-loja-nome">${brinde.nome.replace(/(\p{Emoji_Presentation})/gu, '').trim()}</div>
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

    function comprarBrinde(brinde) {
        if (confirm(`Você quer gastar ${brinde.custo} pontos para comprar "${brinde.nome}"?`)) {
            estado.usuarioAtual.pontos -= brinde.custo;
            estado.usuarioAtual.brindesComprados.push(brinde.id);
            salvarEstado();
            atualizarPontosDisplay();
            renderizarLoja();
            renderizarAvatar();
            mascoteFala(`Parabéns! Você adquiriu ${brinde.nome}!`);
        }
    }

    // --- Lógica de Administração ---
    function loginAdmin() {
        const senha = prompt("Digite a senha de administrador:");
        if (senha === "Admin") {
            estado.usuarioAtual = null;
            atualizarPontosDisplay();
            renderizarAvatar();
            botaoLojaEl.style.display = 'none';
            mascoteFala("Olá, Administrador! O que vamos configurar hoje?");
            mostrarView('admin-view');
        } else if (senha !== null) {
            mascoteFala("Senha incorreta. Acesso negado.");
            alert("Senha incorreta!");
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
                <span>${usuario.nome}</span>
                <div>
                    <span class="custo-brinde">⭐ ${usuario.pontos}</span>
                    <button data-id="${usuario.id}">Remover</button>
                </div>
            `;
            item.querySelector('button').addEventListener('click', () => removerUsuario(usuario.id));
            listaUsuariosAdminEl.appendChild(item);
        });
    }

    function adicionarBrinde() {
        const nome = inputNomeBrindeEl.value.trim();
        const custo = parseInt(inputCustoBrindeEl.value, 10);

        if (!nome || isNaN(custo) || custo <= 0) {
            alert("Por favor, preencha o nome e um custo válido para o brinde.");
            return;
        }

        const novoBrinde = { id: Date.now(), nome: nome, custo: custo, tipo: 'custom', slot: 'rosto' };
        estado.brindes.push(novoBrinde);
        inputNomeBrindeEl.value = ''; inputCustoBrindeEl.value = '';
        salvarEstado();
        renderizarBrindesAdmin();
        mascoteFala("Novo brinde adicionado com sucesso!");
    }

    function removerBrinde(id) {
        if (confirm("Tem certeza que deseja remover este brinde?")) {
            estado.brindes = estado.brindes.filter(brinde => brinde.id !== id);
            salvarEstado();
            renderizarBrindesAdmin();
            mascoteFala("Brinde removido.");
        }
    }

    function removerUsuario(id) {
        if (confirm("Tem certeza que deseja remover este usuário? Todo o progresso dele será perdido.")) {
            estado.usuarios = estado.usuarios.filter(usuario => usuario.id !== id);
            salvarEstado();
            renderizarPerfis();
            renderizarUsuariosAdmin();
            mascoteFala("Usuário removido.");
        }
    }

    // --- Configuração dos Eventos ---
    function configurarBotoesVoltar() {
        const botoes = { 
            'voltar-para-mapa': () => { mostrarView('mapa-view'); definirCorAtiva('#555'); mascoteFala(`Para qual ilha vamos agora, ${estado.usuarioAtual.nome}?`); }, 
            'voltar-para-trilhas': () => mostrarTrilhas(estado.materiaAtual), 
            'voltar-para-atividades': () => mostrarAtividades(estado.trilhaAtual),
            'voltar-loja-para-mapa': () => { mostrarView('mapa-view'); definirCorAtiva('#555'); mascoteFala(`Vamos continuar a aventura, ${estado.usuarioAtual.nome}!`); },
            'voltar-config-para-mapa': () => { 
                if (estado.usuarioAtual) {
                    mostrarView('mapa-view');
                    mascoteFala(`Vamos continuar a aventura, ${estado.usuarioAtual.nome}!`);
                } else {
                    mostrarView('configuracoes-view');
                    mascoteFala("Quem está jogando agora?");
                }
            },
            'voltar-admin-para-config': () => { mostrarView('configuracoes-view'); mascoteFala("Quem está jogando agora?"); }
        };
        for (const [id, acao] of Object.entries(botoes)) {
            const btn = document.getElementById(id); 
            if (btn) {
                const novoBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(novoBtn, btn);
                novoBtn.addEventListener('click', () => { tocarSom(somClique); acao(); });
            }
        }
    }

    function inicializarApp() {
        // Eventos de Navegação Principal
        document.getElementById('ilha-matematica').addEventListener('click', () => mostrarTrilhas('matematica'));
        document.getElementById('ilha-portugues').addEventListener('click', () => mostrarTrilhas('portugues'));
        document.getElementById('ilha-ciencias').addEventListener('click', () => mostrarTrilhas('ciencias'));
        document.getElementById('ilha-historia').addEventListener('click', () => mostrarTrilhas('historia'));
        document.getElementById('ilha-geografia').addEventListener('click', () => mostrarTrilhas('geografia'));
        document.getElementById('ilha-ingles').addEventListener('click', () => mostrarTrilhas('ingles'));
        
        document.getElementById('botao-configuracoes').addEventListener('click', () => {
            tocarSom(somClique);
            definirCorAtiva('#888');
            estado.usuarioAtual = null;
            atualizarPontosDisplay();
            renderizarAvatar();
            mostrarView('configuracoes-view');
            mascoteFala("Vamos ver quem está pronto para a aventura!");
        });
        
        botaoAddBrindeEl.addEventListener('click', adicionarBrinde);
        botaoLojaEl.addEventListener('click', mostrarLoja);

        carregarEstado(); 
        definirCorAtiva('#555');
        mascoteFala("Olá! Bem-vindo(a) à Aventura do Saber!");
        renderizarAvatar();
        mostrarView('configuracoes-view');
    }

    inicializarApp();
});
