Aventura do Saber
Bem-vindo ao repositório do projeto "Aventura do Saber"!

🚀 Sobre o Projeto
A "Aventura do Saber" é uma aplicação web educacional e interativa, projetada para auxiliar no aprendizado de crianças de forma lúdica e divertida. O projeto abrange diversas matérias, como Português, Matemática, Ciências, História, Geografia e Inglês, através de jogos e desafios.

O sistema conta com:

Perfis de Usuário: Cada jogador tem seu próprio progresso e pontuação.

Sistema de Pontos: Os jogadores ganham pontos ao acertar as questões, com diferentes valores por dificuldade.

Loja de Brindes: Um local para trocar os pontos por itens de personalização de avatar.

Painel de Administração: Uma área protegida por senha para gerenciar usuários e brindes.

🛠️ Como Executar
Este projeto foi desenvolvido para ser hospedado em qualquer servidor web estático, com preferência para o GitHub Pages.

Clone o repositório:

git clone https://github.com/seu-usuario/AventuraDoSaber.git

Navegue até a pasta do projeto:

cd AventuraDoSaber

Abra o arquivo index.html em seu navegador de preferência. Para uma melhor experiência e para que todas as funcionalidades (como o localStorage) operem corretamente, é recomendado usar um servidor local. Uma maneira simples de fazer isso é com a extensão "Live Server" do VS Code.

⚙️ Estrutura do Projeto
index.html: Arquivo principal da aplicação.

style.css: Folha de estilos principal.

404.html: Arquivo de fallback para roteamento no GitHub Pages.

README.md: Este arquivo.

/js: Pasta contendo toda a lógica da aplicação.

main.js: O orquestrador principal do jogo.

config.js: Configurações globais, como a lista de brindes.

/matematica, /portugues, etc.: Módulos de conteúdo para cada matéria.

/assets: Pasta para recursos como sons e imagens.
