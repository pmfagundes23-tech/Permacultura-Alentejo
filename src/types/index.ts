// Tipos partilhados por toda a aplicação "Permacultura Alentejo"
//
// O esquema de dados das plantas e do terreno vive em `src/types/schema.ts`
// (Plant, Site, Principle, ...). Este ficheiro guarda apenas os tipos de UI
// que ainda não migraram para lá (Guia, Mensagem, AbaId).

export interface Guia {
  id: string;
  titulo: string;
  resumo: string;
  tempo_leitura_min: number;
  icone: string;
  conteudo_md: string;
}

export type PapelMensagem = "user" | "assistant";

export interface Mensagem {
  id: string;
  papel: PapelMensagem;
  conteudo: string;
  a_carregar?: boolean;
}

export type AbaId = "oraculo" | "plantas" | "guias" | "terreno";
