import { DADOS_ORTOGRAFIA, gerarProblemaOrtografia } from './portugues/ortografia.js';

export const DADOS_PORTUGUES = {
    nome: "Ilha das Palavras",
    cor: "#c94c4c",
    trilhas: {
        ...DADOS_ORTOGRAFIA,
    }
};

export function gerarProblemaPortugues(trilha, atividade) {
    if (trilha in DADOS_ORTOGRAFIA) {
        return gerarProblemaOrtografia(trilha, atividade);
    }
}
