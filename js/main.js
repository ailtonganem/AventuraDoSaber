document.addEventListener('DOMContentLoaded', async () => {
    // --- Módulos do Jogo e Configurações ---
    const JOGOS = window.AventuraDoSaber;
    const CONFIG = window.AventuraDoSaber.config;

    // --- Módulos do Firebase ---
    const { initializeApp } = window.firebase;
    const { getAuth, signInAnonymously, signInWithCustomToken } = window.firebase;
    const { getFirestore, setLogLevel, doc, getDoc, setDoc, updateDoc, deleteDoc, collection, onSnapshot, addDoc } = window.firebase.firestore;

    // --- Variáveis Globais ---
    let auth, db, userId, appId;
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
    const botaoPerfilJogadorEl = document.getElementById('botao-perfil-jogador');
    const lojaContainerEl = document.getElementById('loja-container');
    const avatarBaseEl = document.getElementById('avatar-base');
    const avatarCabecaEl = document.getElementById('avatar-acessorio-cabeca');
    const avatarRostoEl = document.getElementById('avatar-acessorio-rosto');
    const avatarCompanheiroEl = document.getElementById('avatar-companheiro');
    const pontosProblemaEl = document.getElementById('pontos-problema');
    const botaoAjudaEl = document.getElementById('botao-ajuda');
    const botaoPularEl = document.getElementById('botao-pular');
    const inputNomePerfilEl = document.getElementById('input-nome-perfil');
    const inputIdadePerfilEl = document.getElementById('input-idade-perfil');
    const botaoSalvarPerfilEl = document.getElementById('botao-salvar-perfil');
    const avatarBasePerfilEl = document.getElementById('avatar-base-perfil');
    const avatarCabecaPerfilEl = document.getElementById('avatar-cabeca-perfil');
    const avatarRostoPerfilEl = document.getElementById('avatar-rosto-perfil');
    const avatarCompanheiroPerfilEl = document.getElementById('avatar-companheiro-perfil');

    // --- Sons ---
    const somAcerto = new Audio('assets/sounds/acerto.mp3'); 
    const somErro = new Audio('assets/sounds/erro.mp3'); 
    const somClique = new Audio('assets/sounds/clique.mp3');

    // --- Estrutura de dados de todas as matérias do jogo ---
    const DADOS_JOGOS = {
        matematica: {
            nome: "Ilha dos Números", cor: "#0077be",
            trilhas: { ...JOGOS.operacoes.DADOS, ...JOGOS.fracoes.DADOS, ...JOGOS.geometria.DADOS, ...JOGOS.medidas.DADOS, ...JOGOS.resolucao_problemas.DADOS, ...JOGOS.estatistica.DADOS, ...JOGOS.probabilidade.DADOS },
            gerador: (trilha, atividade, idade) => JOGOS.operacoes.gerarProblema(trilha, atividade, idade)
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
    
    // --- DECLARAÇÃO DE FUNÇÕES ---
    // (Todas as funções são declaradas aqui antes de serem chamadas)

    const tocarSom = (som) => { som.currentTime = 0; som.play().catch(e => console.log("Erro ao tocar som:", e)); };
    const mascoteFala = (texto) => { balaoFala.textContent = texto; };
    const atualizarPontosDisplay = () => {
        pontosDisplay.textContent = estado.usuarioAtual ? estado.usuarioAtual.pontos : 0;
    };
    const definirCorAtiva = (cor) => { document.documentElement.style.setProperty('--cor-ativa', cor); };

    async function adicionarPontos(quantidade) {
        if (!estado.usuarioAtual) return;
        const novosPontos = Math.max(0, estado.usuarioAtual.pontos + quantidade);
        estado.usuarioAtual.pontos = novosPontos;
        atualizarPontosDisplay();
        const userDocRef = doc(db, `artifacts/${appId}/users`, estado.usuarioAtual.id);
        await updateDoc(userDocRef, { pontos: novosPontos });
    }

    function gerarBotoesDeOpcao(opcoes) {
        opcoesEl.innerHTML = '';
        const opcoesOrdenadas = [...opcoes].sort(() => Math.random() - 0.5);
        opcoesOrdenadas.forEach(opcao => {
            const botao = document.createElement('button');
            botao.className = 'botao-resposta';
            botao.innerHTML = opcao;
            botao.dataset.valor = opcao;
            botao.onclick = () => {
                const acertou = botao.dataset.valor == estado.problemaAtual.respostaCorreta;
                resolverProblema(acertou, botao);
            };
            opcoesEl.appendChild(botao);
        });
    }

    async function resolverProblema(acertou, botaoClicado = null) {
        if (!estado.jogoAtivo) return;
        estado.jogoAtivo = false;
        botaoAjudaEl.disabled = true;
        botaoPularEl.disabled = true;
        const pontos = estado.problemaAtual.pontos || 10;
        if (acertou) {
            tocarSom(somAcerto);
            await adicionarPontos(pontos);
            mascoteFala(`Correto! Você ganhou ${pontos} pontos!`);
            if(botaoClicado) botaoClicado.classList.add('correta');
        } else {
            tocarSom(somErro);
            const pontosPerdidos = Math.round(pontos / 2);
            await adicionarPontos(-pontosPerdidos);
            mascoteFala(`Ops! Você perdeu ${pontosPerdidos} pontos.`);
            if(botaoClicado) {
                botaoClicado.classList.add('incorreta');
                document.querySelectorAll('.botao-resposta').forEach(b => { 
                    if (b.dataset.valor == estado.problemaAtual.respostaCorreta) b.classList.add('correta'); 
                });
            }
        }
        setTimeout(gerarProblema, 2500);
    }

    function gerarProblema() {
        estado.jogoAtivo = true;
        const idade = estado.usuarioAtual ? estado.usuarioAtual.idade : 8;
        estado.problemaAtual = DADOS_JOGOS[estado.materiaAtual].gerador(estado.trilhaAtual, estado.atividadeAtual, idade);
        const problema = estado.problemaAtual;
        opcoesEl.innerHTML = '';
        pontosProblemaEl.textContent = `Vale: ⭐ ${problema.pontos || 10} pontos`;
        botaoAjudaEl.disabled = false;
        botaoPularEl.disabled = false;
        if (problema.objetosHTML) {
             enunciadoEl.innerHTML = problema.enunciado;
             opcoesEl.innerHTML = problema.objetosHTML;
        } else {
             enunciadoEl.innerHTML = problema.enunciado;
        }
        gerarBotoesDeOpcao(problema.opcoes);
    }

    function configurarBotoesVoltar() {
        const botoes = { 
            'voltar-para-mapa': () => { mostrarView('mapa-view'); definirCorAtiva('#555'); mascoteFala(`Para qual ilha vamos agora, ${estado.usuarioAtual.nome}?`); }, 
            'voltar-para-trilhas': () => mostrarTrilhas(estado.materiaAtual), 
            'voltar-para-atividades': () => mostrarAtividades(estado.trilhaAtual),
            'voltar-loja-para-mapa': () => { mostrarView('mapa-view'); definirCorAtiva('#555'); mascoteFala(`Vamos continuar a aventura, ${estado.usuarioAtual.nome}!`); },
            'voltar-perfil-para-mapa': () => { mostrarView('mapa-view'); definirCorAtiva('#555'); mascoteFala(`Vamos continuar a aventura, ${estado.usuarioAtual.nome}!`); },
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

    const mostrarView = (id) => { 
        estado.viewAtual = id; 
        allViews.forEach(v => v.classList.remove('active')); 
        document.getElementById(id).classList.add('active'); 
        configurarBotoesVoltar(); 
        const logadoNoMapa = estado.usuarioAtual && id === 'mapa-view';
        botaoLojaEl.style.display = logadoNoMapa ? 'flex' : 'none';
        botaoPerfilJogadorEl.style.display = logadoNoMapa ? 'flex' : 'none';
    };

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
        mostrarView('jogo-view'); 
        gerarProblema();
    }

    function renderizarAvatar() {
        const avatarBase = (estado.usuarioAtual && estado.usuarioAtual.avatar) ? estado.usuarioAtual.avatar : '🦉';
        avatarBaseEl.textContent = avatarBase;
        avatarCabecaEl.textContent = '';
        avatarRostoEl.textContent = '';
        avatarCompanheiroEl.textContent = '';
        document.body.style.backgroundImage = '';
        if (!estado.usuarioAtual) return;
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
        const nome = prompt("Qual é o seu nome, jovem aventureiro(a)?");
        if (!nome || nome.trim() === "") {
            mascoteFala("Para criar um perfil, preciso saber seu nome!");
            return;
        }
        let idadeInput = prompt(`Olá, ${nome.trim()}! Quantos anos você tem?`);
        let idade = parseInt(idadeInput, 10);
        if (isNaN(idade) || idade < 4 || idade > 12) {
            mascoteFala("Por favor, insira uma idade válida (entre 4 e 12 anos).");
            return;
        }
        let genero = prompt("Para o seu avatar, você escolhe 'menino' ou 'menina'?").toLowerCase();
        if (genero !== 'menino' && genero !== 'menina') {
            mascoteFala("Por favor, escolha 'menino' ou 'menina'.");
            return;
        }
        const novoUsuario = {
            nome: nome.trim(),
            idade: idade,
            avatar: genero === 'menina' ? '👩‍🎓' : '🧑‍🎓',
            pontos: 0,
            brindesComprados: []
        };
        await addDoc(collection(db, `artifacts/${appId}/users`), novoUsuario);
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

    async function comprarBrinde(brinde) {
        if (confirm(`Você quer gastar ${brinde.custo} pontos para comprar "${brinde.nome}"?`)) {
            const novosPontos = estado.usuarioAtual.pontos - brinde.custo;
            const novosBrindes = [...estado.usuarioAtual.brindesComprados, brinde.id];
            estado.usuarioAtual.pontos = novosPontos;
            estado.usuarioAtual.brindesComprados = novosBrindes;
            atualizarPontosDisplay();
            renderizarLoja();
            renderizarAvatar();
            const userDocRef = doc(db, `artifacts/${appId}/users`, estado.usuarioAtual.id);
            await updateDoc(userDocRef, {
                pontos: novosPontos,
                brindesComprados: novosBrindes
            });
            mascoteFala(`Parabéns! Você adquiriu ${brinde.nome}!`);
        }
    }

    function loginAdmin() {
        const senha = prompt("Digite a senha de administrador:");
        if (senha === "Admin") {
            estado.usuarioAtual = null;
            atualizarPontosDisplay();
            renderizarAvatar();
            botaoLojaEl.style.display = 'none';
            botaoPerfilJogadorEl.style.display = 'none';
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
                    <button data-id="${brinde.firestoreId}">Remover</button>
                </div>
            `;
            item.querySelector('button').addEventListener('click', () => removerBrinde(brinde.firestoreId));
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

    async function adicionarBrinde() {
        const nome = inputNomeBrindeEl.value.trim();
        const custo = parseInt(inputCustoBrindeEl.value, 10);
        if (!nome || isNaN(custo) || custo <= 0) {
            alert("Por favor, preencha o nome e um custo válido para o brinde.");
            return;
        }
        const novoBrinde = { id: Date.now(), nome, custo, tipo: 'custom', slot: 'rosto' };
        await addDoc(collection(db, `artifacts/${appId}/public/data/brindes`), novoBrinde);
        inputNomeBrindeEl.value = ''; inputCustoBrindeEl.value = '';
        mascoteFala("Novo brinde adicionado com sucesso!");
    }

    async function removerBrinde(firestoreId) {
        if (confirm("Tem certeza que deseja remover este brinde?")) {
            await deleteDoc(doc(db, `artifacts/${appId}/public/data/brindes`, firestoreId));
            mascoteFala("Brinde removido.");
        }
    }
    
    async function removerUsuario(id) {
        if (confirm("Tem certeza que deseja remover este usuário? Todo o progresso dele será perdido.")) {
            await deleteDoc(doc(db, `artifacts/${appId}/users`, id));
            mascoteFala("Usuário removido.");
        }
    }

    function mostrarPerfil() {
        if (!estado.usuarioAtual) return;
        tocarSom(somClique);
        inputNomePerfilEl.value = estado.usuarioAtual.nome;
        inputIdadePerfilEl.value = estado.usuarioAtual.idade;
        renderizarAvatarPerfil();
        mostrarView('perfil-view');
        mascoteFala("Aqui você pode ver e editar seu perfil!");
    }

    function renderizarAvatarPerfil() {
        const avatarBase = (estado.usuarioAtual && estado.usuarioAtual.avatar) ? estado.usuarioAtual.avatar : '🦉';
        avatarBasePerfilEl.textContent = avatarBase;
        avatarCabecaPerfilEl.textContent = '';
        avatarRostoPerfilEl.textContent = '';
        avatarCompanheiroPerfilEl.textContent = '';
        if (!estado.usuarioAtual) return;
        estado.usuarioAtual.brindesComprados.forEach(brindeId => {
            const brinde = estado.brindes.find(b => b.id === brindeId);
            if (!brinde) return;
            const emoji = (brinde.nome.match(/(\p{Emoji_Presentation})/gu) || [''])[0];
            switch(brinde.slot) {
                case 'base': avatarBasePerfilEl.textContent = emoji; break;
                case 'cabeca': avatarCabecaPerfilEl.textContent = emoji; break;
                case 'rosto': avatarRostoPerfilEl.textContent = emoji; break;
                case 'companheiro': avatarCompanheiroPerfilEl.textContent = emoji; break;
            }
        });
    }

    async function salvarPerfil() {
        const novoNome = inputNomePerfilEl.value.trim();
        const novaIdade = parseInt(inputIdadePerfilEl.value, 10);
        if (!novoNome) {
            alert("O nome não pode ficar em branco!");
            return;
        }
        if (isNaN(novaIdade) || novaIdade < 4 || novaIdade > 12) {
            alert("Por favor, insira uma idade válida entre 4 e 12 anos.");
            return;
        }
        estado.usuarioAtual.nome = novoNome;
        estado.usuarioAtual.idade = novaIdade;
        const userDocRef = doc(db, `artifacts/${appId}/users`, estado.usuarioAtual.id);
        await updateDoc(userDocRef, {
            nome: novoNome,
            idade: novaIdade
        });
        mascoteFala("Seu perfil foi salvo com sucesso!");
        setTimeout(() => mostrarView('mapa-view'), 1500);
    }

    function mostrarLoja() {
        tocarSom(somClique);
        definirCorAtiva('#ffc107');
        renderizarLoja();
        mostrarView('loja-view');
        mascoteFala("Aqui você pode trocar seus pontos por prêmios!");
    }

    async function inicializarFirebase() {
        try {
            appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
            const app = initializeApp(firebaseConfig);
            db = getFirestore(app);
            auth = getAuth(app);
            setLogLevel('debug');
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                await signInWithCustomToken(auth, __initial_auth_token);
            } else {
                await signInAnonymously(auth);
            }
            userId = auth.currentUser?.uid || crypto.randomUUID();
            iniciarListenersFirestore();
        } catch (error) {
            console.error("Erro ao inicializar o Firebase:", error);
            mascoteFala("Erro de conexão! Não consigo salvar seu progresso.");
        }
    }

    function iniciarListenersFirestore() {
        const usersCollectionRef = collection(db, `artifacts/${appId}/users`);
        onSnapshot(usersCollectionRef, (snapshot) => {
            const usuariosTemp = [];
            snapshot.forEach(doc => {
                usuariosTemp.push({ ...doc.data(), id: doc.id });
            });
            estado.usuarios = usuariosTemp;
            renderizarPerfis();
            renderizarUsuariosAdmin();
        });
        const brindesCollectionRef = collection(db, `artifacts/${appId}/public/data/brindes`);
        onSnapshot(brindesCollectionRef, (snapshot) => {
            const brindesTemp = [];
            if (snapshot.empty) {
                CONFIG.BRINDES_PADRAO.forEach(async (brinde) => {
                    await addDoc(brindesCollectionRef, brinde);
                });
                brindesTemp = CONFIG.BRINDES_PADRAO;
            } else {
                snapshot.forEach((doc) => {
                    brindesTemp.push({ ...doc.data(), firestoreId: doc.id });
                });
            }
            estado.brindes = brindesTemp;
            renderizarBrindesAdmin();
            if (estado.viewAtual === 'loja-view') {
                renderizarLoja();
            }
        });
    }

    // --- Ponto de Entrada da Aplicação ---
    async function inicializarApp() {
        const params = new URLSearchParams(window.location.search);
        const path = params.get('p');
        if (path) {
            window.history.replaceState({}, document.title, "/" + path);
        }

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
        botaoPerfilJogadorEl.addEventListener('click', mostrarPerfil);
        botaoSalvarPerfilEl.addEventListener('click', salvarPerfil);

        botaoAjudaEl.addEventListener('click', async () => {
            if (!estado.jogoAtivo || !estado.problemaAtual) return;
            const dica = estado.problemaAtual.dica || "Nenhuma dica para esta questão.";
            const custoDica = Math.round((estado.problemaAtual.pontos || 10) * 0.3);
            mascoteFala(`Dica: ${dica} (Custo: ${custoDica} pontos)`);
            await adicionarPontos(-custoDica);
            botaoAjudaEl.disabled = true;
        });

        botaoPularEl.addEventListener('click', () => {
            if (!estado.jogoAtivo) return;
            mascoteFala("Ok, vamos pular esta. Próxima pergunta!");
            gerarProblema();
        });

        await inicializarFirebase();
        
        mascoteFala("Olá! Bem-vindo(a) à Aventura do Saber!");
        renderizarAvatar();
        mostrarView('configuracoes-view');
    }

    inicializarApp();
});
