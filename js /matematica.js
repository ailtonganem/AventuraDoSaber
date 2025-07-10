// Importa os dados do conteúdo específico de 'operações'
import { DADOS_OPERACOES, gerarProblemaOperacoes } from './matematica/operacoes.js';
// Futuramente: import { DADOS_FRACOES, gerarProblemaFracoes } from './matematica/fracoes.js';

// Monta o objeto completo da matéria
export const DADOS_MATEMATICA = {
    nome: "Ilha dos Números",
    cor: "#0077be",
    trilhas: {
        ...DADOS_OPERACOES,
        // Futuramente: ...DADOS_FRACOES
    }
};

// Esta função decide qual gerador de problemas chamar
export function gerarProblemaMatematica(trilha, atividade) {
    // Verifica a qual conteúdo a trilha pertence
    if (trilha in DADOS_OPERACOES) {
        return gerarProblemaOperacoes(trilha, atividade);
    }
    // Futuramente: if (trilha in DADOS_FRACOES) { ... }
}
