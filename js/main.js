document.addEventListener('DOMContentLoaded', async () => {
    // --- Módulos do Jogo e Configurações ---
    const JOGOS = window.AventuraDoSaber;
    const CONFIG = window.AventuraDoSaber.config;

    // --- Módulos do Firebase (disponibilizados pelo index.html) ---
    const { initializeApp } = window.firebase;
    const { getAuth, signInAnonymously, signInWithCustomToken } = window.firebase;
    const { getFirestore, setLogLevel, doc, getDoc, setDoc, updateDoc, deleteDoc, collection, onSnapshot, addDoc } = window.firebase.firestore;

    // --- Variáveis Globais do Firebase ---
    let auth, db, userId, appId;

    // --- Estrutura de dados de todas as matérias do jogo ---
    const DADOS_JOGOS = {
        matematica: {
            nome: "Ilha dos Números", cor: "#0077be",
            trilhas: { ...JOGOS.operacoes.DADOS, ...JOGOS.fracoes.DADOS, ...JOGOS.geometria.DADOS, ...JOGOS.medidas.DADOS, ...JOGOS.resolucao_problemas.DADOS, ...JOGOS.estatistica.DADOS, ...JOGOS.probabilidade.DADOS },
            gerador: (trilha, atividade, idade) => {
                if (trilha in JOGOS.operacoes.DADOS) return JOGOS.operacoes.gerarProblema(trilha, atividade, idade);
                if (trilha in JOGOS.fracoes.DADOS) return JOGOS.fracoes.gerarProblema(trilha, atividade, idade);
                // Adicionar chamadas para outros geradores de matemática aqui...
                return JOGOS.operacoes.gerarProblema(trilha, atividade, idade); // Fallback
            }
        },
        // ... (outras matérias)
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
    const pontosProblemaEl = document.getElementById('pontos-problema');
    const botaoAjudaEl = document.getElementById('botao-ajuda');
    const botaoPularEl = document.getElementById('botao-pular');

    // --- Estado da Aplicação (agora sincronizado com o Firestore) ---
    let estado = { 
        viewAtual: 'configuracoes-view', 
        materiaAtual: null, 
        trilhaAtual: null, 
        atividadeAtual: null, 
        problemaAtual: null,
        jogoAtivo: false, 
        usuarioAtual: null, // Guarda o objeto do usuário logado
        usuarios: [], // Cache local dos usuários para renderização
        brindes: []  // Cache local dos brindes para renderização
    };

    // --- Sons ---
    const somAcerto = new Audio('assets/sounds/acerto.mp3'); 
    const somErro = new Audio('assets/sounds/erro.mp3'); 
    const somClique = new Audio('assets/sounds/clique.mp3');

    // --- Lógica de Pontuação e Jogo ---
    async function adicionarPontos(quantidade) {
        if (!estado.usuarioAtual) return;
        
        const novosPontos = Math.max(0, estado.usuarioAtual.pontos + quantidade);
        estado.usuarioAtual.pontos = novosPontos; // Atualiza o estado local para UI imediata
        atualizarPontosDisplay();

        // Atualiza o banco de dados em segundo plano
        const userDocRef = doc(db, `artifacts/${appId}/users/${estado.usuarioAtual.id}/profile`, 'data');
        await updateDoc(userDocRef, { pontos: novosPontos });
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
        
        // ... (lógica de tipos de problema continua a mesma)
        gerarBotoesDeOpcao(problema.opcoes);
    }

    function gerarBotoesDeOpcao(opcoes) {
        opcoesEl.innerHTML = ''; // Limpa opções anteriores
        const opcoesOrdenadas = [...opcoes].sort(() => Math.random() - 0.5);
        opcoesOrdenadas.forEach(opcao => {
            const botao = document.createElement('button');
            botao.className = 'botao-resposta';
            botao.innerHTML = opcao; // Usar innerHTML para emojis
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

    // --- Funções de UI e Navegação ---
    const mostrarView = (id) => { 
        estado.viewAtual = id; 
        allViews.forEach(v => v.classList.remove('active')); 
        document.getElementById(id).classList.add('active'); 
        configurarBotoesVoltar(); 
        botaoLojaEl.style.display = estado.usuarioAtual && id === 'mapa-view' ? 'flex' : 'none';
    };
    const definirCorAtiva = (cor) => { document.documentElement.style.setProperty('--cor-ativa', cor); };
    const tocarSom = (som) => { som.currentTime = 0; som.play().catch(e => console.log("Erro ao tocar som:", e)); };
    const mascoteFala = (texto) => { balaoFala.textContent = texto; };
    const atualizarPontosDisplay = () => {
        pontosDisplay.textContent = estado.usuarioAtual ? estado.usuarioAtual.pontos : 0;
    };

    // --- Lógica de Usuários e Avatar com Firestore ---
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

        const novoUsuario = {
            id: crypto.randomUUID(), // ID único
            nome: nome.trim(),
            idade: idade,
            pontos: 0,
            brindesComprados: []
        };

        // Salva o novo usuário no Firestore
        const userDocRef = doc(db, `artifacts/${appId}/users/${novoUsuario.id}/profile`, 'data');
        await setDoc(userDocRef, novoUsuario);

        mascoteFala(`Seja bem-vindo(a), ${nome.trim()}!`);
        // O onSnapshot irá atualizar a UI automaticamente
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
    
    function renderizarAvatar() {
        // ... (lógica de renderização do avatar continua a mesma)
    }

    // --- Lógica da Loja com Firestore ---
    async function comprarBrinde(brinde) {
        if (confirm(`Você quer gastar ${brinde.custo} pontos para comprar "${brinde.nome}"?`)) {
            const novosPontos = estado.usuarioAtual.pontos - brinde.custo;
            const novosBrindes = [...estado.usuarioAtual.brindesComprados, brinde.id];

            // Atualiza estado local para UI imediata
            estado.usuarioAtual.pontos = novosPontos;
            estado.usuarioAtual.brindesComprados = novosBrindes;
            atualizarPontosDisplay();
            renderizarLoja();
            renderizarAvatar();

            // Atualiza o banco de dados
            const userDocRef = doc(db, `artifacts/${appId}/users/${estado.usuarioAtual.id}/profile`, 'data');
            await updateDoc(userDocRef, {
                pontos: novosPontos,
                brindesComprados: novosBrindes
            });

            mascoteFala(`Parabéns! Você adquiriu ${brinde.nome}!`);
        }
    }

    // --- Lógica de Administração com Firestore ---
    async function adicionarBrinde() {
        const nome = inputNomeBrindeEl.value.trim();
        const custo = parseInt(inputCustoBrindeEl.value, 10);
        if (!nome || isNaN(custo) || custo <= 0) {
            alert("Por favor, preencha o nome e um custo válido para o brinde.");
            return;
        }
        const novoBrinde = { id: Date.now(), nome, custo, tipo: 'custom', slot: 'rosto' };
        
        // Adiciona o novo brinde no Firestore
        await addDoc(collection(db, `artifacts/${appId}/public/data/brindes`), novoBrinde);

        inputNomeBrindeEl.value = ''; inputCustoBrindeEl.value = '';
        mascoteFala("Novo brinde adicionado com sucesso!");
    }

    async function removerBrinde(id) {
        if (confirm("Tem certeza que deseja remover este brinde?")) {
            await deleteDoc(doc(db, `artifacts/${appId}/public/data/brindes`, id));
            mascoteFala("Brinde removido.");
        }
    }
    
    async function removerUsuario(id) {
        if (confirm("Tem certeza que deseja remover este usuário? Todo o progresso dele será perdido.")) {
            await deleteDoc(doc(db, `artifacts/${appId}/users/${id}/profile`, 'data'));
            mascoteFala("Usuário removido.");
        }
    }

    // --- Inicialização e Configuração do Firebase ---
    async function inicializarFirebase() {
        try {
            // Usa as variáveis globais fornecidas pelo ambiente do Canvas
            appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
            
            const app = initializeApp(firebaseConfig);
            db = getFirestore(app);
            auth = getAuth(app);
            setLogLevel('debug'); // Para facilitar a depuração

            // Autentica o usuário
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                await signInWithCustomToken(auth, __initial_auth_token);
            } else {
                await signInAnonymously(auth);
            }
            userId = auth.currentUser?.uid || crypto.randomUUID();
            console.log("Firebase inicializado e usuário autenticado:", userId);

            // Inicia os listeners para carregar dados em tempo real
            iniciarListenersFirestore();

        } catch (error) {
            console.error("Erro ao inicializar o Firebase:", error);
            mascoteFala("Erro de conexão! Não consigo salvar seu progresso.");
        }
    }

    function iniciarListenersFirestore() {
        // Listener para a coleção de usuários
        const usersCollectionRef = collection(db, `artifacts/${appId}/users`);
        onSnapshot(usersCollectionRef, (snapshot) => {
            const usuariosTemp = [];
            snapshot.forEach(userDoc => {
                // Acessa o documento de perfil dentro da subcoleção de cada usuário
                const profileCollectionRef = collection(db, `artifacts/${appId}/users/${userDoc.id}/profile`);
                onSnapshot(profileCollectionRef, (profileSnapshot) => {
                    profileSnapshot.forEach(profileDoc => {
                        const userData = profileDoc.data();
                        // Remove o usuário antigo se existir e adiciona o novo
                        const index = usuariosTemp.findIndex(u => u.id === userData.id);
                        if(index > -1) usuariosTemp[index] = userData;
                        else usuariosTemp.push(userData);
                    });
                    estado.usuarios = usuariosTemp;
                    renderizarPerfis();
                    //renderizarUsuariosAdmin();
                });
            });
        });

        // Listener para a coleção de brindes
        const brindesCollectionRef = collection(db, `artifacts/${appId}/public/data/brindes`);
        onSnapshot(brindesCollectionRef, (snapshot) => {
            const brindesTemp = [];
            snapshot.forEach((doc) => {
                brindesTemp.push({ ...doc.data(), firestoreId: doc.id });
            });
            estado.brindes = brindesTemp;
            //renderizarBrindesAdmin();
            if (estado.viewAtual === 'loja-view') {
                renderizarLoja(); // Atualiza a loja se estiver aberta
            }
        });
    }

    // --- Ponto de Entrada da Aplicação ---
    async function inicializarApp() {
        // ... (lógica de roteamento e eventos de clique)

        await inicializarFirebase(); // Espera o Firebase inicializar

        // Eventos de clique e outras inicializações da UI
        document.getElementById('ilha-matematica').addEventListener('click', () => mostrarTrilhas('matematica'));
        // ... outros eventos
        
        mascoteFala("Olá! Bem-vindo(a) à Aventura do Saber!");
        renderizarAvatar();
        mostrarView('configuracoes-view');
    }

    inicializarApp();
});
