import {
  Access,
  Aspect,
  BudgetRange,
  Earthwork,
  ExistingStructure,
  ExperienceLevel,
  FarmAnimal,
  FireRisk,
  Goal,
  GroundCover,
  IrrigationType,
  Presence,
  Season,
  Erosion,
  SoilTexture,
  Stoniness,
  WaterSource,
  WindDirection,
  YesNoUnknown,
} from "@/types/schema";

// Listas de opções para os campos enum/multiselect do Perfil do Terreno.
// Mantidas à parte do schema.ts porque os tipos TypeScript não existem em
// tempo de execução — o formulário precisa destes arrays reais.

export const ASPECT_OPTIONS: Aspect[] = [
  "plano",
  "norte",
  "nordeste",
  "este",
  "sudeste",
  "sul",
  "sudoeste",
  "oeste",
  "noroeste",
];

export const ACCESS_OPTIONS: Access[] = ["estrada alcatroada", "caminho de terra", "sem acesso motorizado"];

export const EXISTING_STRUCTURE_OPTIONS: ExistingStructure[] = [
  "casa",
  "anexo",
  "armazém",
  "estufa",
  "muros",
  "vedação",
  "poço coberto",
  "nenhuma",
];

export const WIND_DIRECTION_OPTIONS: WindDirection[] = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];

export const SEASON_OPTIONS: Season[] = ["inverno", "primavera", "verão", "outono"];

export const FIRE_RISK_OPTIONS: FireRisk[] = ["baixo", "médio", "alto", "muito alto"];

export const WATER_SOURCE_OPTIONS: WaterSource[] = [
  "poço",
  "furo",
  "rede pública",
  "charca",
  "ribeira ou linha de água",
  "água da chuva captada",
  "nenhuma",
];

export const YES_NO_UNKNOWN_OPTIONS: YesNoUnknown[] = ["sim", "não", "não sei"];

export const EARTHWORK_OPTIONS: Earthwork[] = [
  "valas de infiltração (swales)",
  "socalcos",
  "charca",
  "represa",
  "nenhuma",
];

export const IRRIGATION_OPTIONS: IrrigationType[] = ["nenhuma", "gota-a-gota", "aspersão", "manual"];

export const SOIL_TEXTURE_OPTIONS: SoilTexture[] = [
  "arenoso",
  "franco-arenoso",
  "franco",
  "franco-argiloso",
  "argiloso",
  "não sei",
];

export const STONINESS_OPTIONS: Stoniness[] = ["nenhuma", "pouca", "moderada", "muita"];

export const EROSION_OPTIONS: Erosion[] = ["nenhuma", "ligeira", "sulcos visíveis", "ravinas"];

export const GROUND_COVER_OPTIONS: GroundCover[] = [
  "pastagem",
  "mato baixo",
  "esteval",
  "solo nu",
  "cultura instalada",
  "pomar",
];

export const GOAL_OPTIONS: Goal[] = [
  "autoconsumo alimentar",
  "rendimento comercial",
  "regeneração do solo e da paisagem",
  "refúgio e lazer",
  "biodiversidade",
  "ainda a explorar",
];

export const PRESENCE_OPTIONS: Presence[] = [
  "vivo lá",
  "vou várias vezes por semana",
  "fins de semana",
  "uma vez por mês ou menos",
];

export const EXPERIENCE_LEVEL_OPTIONS: ExperienceLevel[] = [
  "nenhuma",
  "alguma jardinagem",
  "experiência agrícola",
  "formação em permacultura",
];

export const BUDGET_RANGE_OPTIONS: BudgetRange[] = ["mínimo", "até 5.000€", "5.000€ a 20.000€", "mais de 20.000€"];

export const FARM_ANIMAL_OPTIONS: FarmAnimal[] = [
  "galinhas",
  "patos",
  "ovelhas",
  "cabras",
  "porcos",
  "abelhas",
  "cavalos",
  "nenhum",
];
