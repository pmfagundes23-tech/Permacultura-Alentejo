// Tipos partilhados por toda a aplicação "Permacultura Alentejo"

export type CamadaGrupo =
  | "Dossel"
  | "Sub-dossel"
  | "Arbusto"
  | "Herbácea"
  | "Raiz"
  | "Cobertura"
  | "Trepadeira";

export type ToleranciaSeca = "Extrema" | "Muito Alta" | "Alta" | "Média" | "Baixa";

export interface Planta {
  id: number;
  nome_comum: string;
  nome_cientifico: string;
  /** Zonas de permacultura (1 a 5) onde a planta se enquadra melhor */
  zona_permacultura: number[];
  /** Descrição detalhada da camada (ex: "Árvore Média", "Cactácea") */
  camada: string;
  /** Agrupamento da camada para efeitos de filtro (as 7 camadas da permacultura) */
  camada_grupo: CamadaGrupo;
  tolerancia_seca: ToleranciaSeca;
  necessidade_rega: string;
  funcoes_ecologicas: string[];
  usos_humanos: string[];
  epoca_plantio: string;
}

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

export type TipoTroca = "Sementes" | "Mudas" | "Ajuda em Mutirões";

export interface HortaComunitaria {
  id: string;
  nome: string;
  concelho: string;
  tipo_troca: TipoTroca[];
  descricao: string;
  criado_em: string;
  /** Coordenadas relativas (%) dentro do mapa estilizado, 0-100 */
  x: number;
  y: number;
}

export type AbaId = "oraculo" | "plantas" | "guias" | "mapa";
