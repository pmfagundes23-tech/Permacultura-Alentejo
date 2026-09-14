// Novo modelo de dados do projeto "Ferramenta de desenho em permacultura —
// Alentejo", conforme a especificação fornecida.
//
// Convenção de código (definida na especificação): chaves e identificadores
// em inglês (snake_case nas chaves de dados), todo o texto visível ao
// utilizador em português de Portugal (guardado à parte, em `src/data/`).
//
// Este ficheiro é aditivo — não substitui `src/types/index.ts` (ainda em uso
// pelo Explorador de Plantas, Guias e Oráculo atuais). A migração dos
// componentes existentes para este novo esquema acontece em etapas
// seguintes, para não partir o que já funciona.
//
// Fases do roadmap onde cada bloco entra em uso:
//   Fase 1 (agora):      Site, Plant, Principle, ComputedSpeciesMatch
//   Fase 2 (mais tarde): Design, ComputedWaterBudget, ComputedSunPath,
//                        ComputedSectors, ComputedSuggestedZones
//   Fase 3 (mais tarde): Observation, ComputedMonthlyTask

// ---------------------------------------------------------------------------
// Tipos geográficos auxiliares
// ---------------------------------------------------------------------------

export interface GeoPoint {
  type: "Point";
  /** [longitude, latitude], convenção GeoJSON */
  coordinates: [number, number];
}

export interface GeoPolygon {
  type: "Polygon";
  coordinates: number[][][];
}

/** Array com 12 posições, índice 0 = Janeiro ... índice 11 = Dezembro */
export type MonthlyArray = number[];

/** Um mês do ano, 1 (Janeiro) a 12 (Dezembro) */
export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** Data anual recorrente sem ano, formato "MM-DD" (ex: primeira geada) */
export type DateMMDD = string;

// ---------------------------------------------------------------------------
// site — Perfil do terreno
// ---------------------------------------------------------------------------

export type Aspect =
  | "norte"
  | "nordeste"
  | "este"
  | "sudeste"
  | "sul"
  | "sudoeste"
  | "oeste"
  | "noroeste"
  | "plano";

export type Access = "estrada alcatroada" | "caminho de terra" | "sem acesso motorizado";

export type ExistingStructure =
  | "casa"
  | "anexo"
  | "armazém"
  | "estufa"
  | "muros"
  | "vedação"
  | "poço coberto"
  | "nenhuma";

export type WindDirection = "N" | "NE" | "E" | "SE" | "S" | "SO" | "O" | "NO";

export type Season = "inverno" | "primavera" | "verão" | "outono";

export type FireRisk = "baixo" | "médio" | "alto" | "muito alto";

export type WaterSource =
  | "poço"
  | "furo"
  | "rede pública"
  | "charca"
  | "ribeira ou linha de água"
  | "água da chuva captada"
  | "nenhuma";

export type YesNoUnknown = "sim" | "não" | "não sei";

export type Earthwork = "valas de infiltração (swales)" | "socalcos" | "charca" | "represa" | "nenhuma";

export type IrrigationType = "nenhuma" | "gota-a-gota" | "aspersão" | "manual";

export type SoilTexture =
  | "arenoso"
  | "franco-arenoso"
  | "franco"
  | "franco-argiloso"
  | "argiloso"
  | "não sei";

export type Stoniness = "nenhuma" | "pouca" | "moderada" | "muita";

export type Erosion = "nenhuma" | "ligeira" | "sulcos visíveis" | "ravinas";

export type GroundCover = "pastagem" | "mato baixo" | "esteval" | "solo nu" | "cultura instalada" | "pomar";

export interface OtherTreeEntry {
  species_id: string;
  count: number;
  approximate_age?: number;
  condition?: string;
}

export type Goal =
  | "autoconsumo alimentar"
  | "rendimento comercial"
  | "regeneração do solo e da paisagem"
  | "refúgio e lazer"
  | "biodiversidade"
  | "ainda a explorar";

export type Presence = "vivo lá" | "vou várias vezes por semana" | "fins de semana" | "uma vez por mês ou menos";

export type ExperienceLevel = "nenhuma" | "alguma jardinagem" | "experiência agrícola" | "formação em permacultura";

export type BudgetRange = "mínimo" | "até 5.000€" | "5.000€ a 20.000€" | "mais de 20.000€";

export type FarmAnimal = "galinhas" | "patos" | "ovelhas" | "cabras" | "porcos" | "abelhas" | "cavalos" | "nenhum";

export interface Site {
  id: string;

  // Identificação
  name: string;
  created_at: string;
  notes?: string;

  // Localização e forma
  latitude: number;
  longitude: number;
  boundary?: GeoPolygon;
  area_ha?: number;
  altitude_m?: number;
  slope_percent?: number;
  aspect?: Aspect;
  access?: Access[];
  existing_structures?: ExistingStructure[];

  // Clima (idealmente auto-preenchido a partir de lat/long — fase 2)
  rainfall_annual_mm?: number;
  rainfall_monthly_mm?: MonthlyArray;
  temp_max_monthly_c?: MonthlyArray;
  temp_min_monthly_c?: MonthlyArray;
  hardiness_zone?: string;
  first_frost?: DateMMDD;
  last_frost?: DateMMDD;
  dominant_wind_direction?: WindDirection;
  wind_season?: Season[];
  fire_risk?: FireRisk;

  // Água — variável limitante no Alentejo
  water_sources?: WaterSource[];
  water_flow_lh?: number;
  dries_in_summer?: YesNoUnknown;
  storage_liters?: number;
  roof_area_m2?: number;
  existing_earthworks?: Earthwork[];
  irrigation?: IrrigationType;

  // Solo
  soil_texture?: SoilTexture;
  ph?: number;
  depth_cm?: number;
  stoniness?: Stoniness;
  organic_matter_percent?: number;
  compaction?: boolean;
  erosion?: Erosion;
  indicator_plants?: string[]; // referencia Plant.id

  // Vegetação existente
  cork_oak_count?: number; // sobreiro — espécie protegida (ICNF)
  holm_oak_count?: number; // azinheira — espécie protegida (ICNF)
  other_trees?: OtherTreeEntry[];
  ground_cover?: GroundCover[];
  invasive_species_present?: string[]; // referencia Plant.id com invasive_status = "proibida por lei"

  // Sobre a pessoa e os seus objetivos
  goal?: Goal[];
  hours_per_week?: number;
  presence?: Presence;
  experience_level?: ExperienceLevel;
  budget_range?: BudgetRange;
  animals_current?: FarmAnimal[];
  animals_wanted?: FarmAnimal[];
}

// ---------------------------------------------------------------------------
// plant — Base de dados de espécies (novo esquema)
// ---------------------------------------------------------------------------

export type PlantLayer =
  | "emergente"
  | "dossel"
  | "sub-bosque"
  | "arbustiva"
  | "herbácea"
  | "cobertura do solo"
  | "rizosfera (raiz)"
  | "trepadeira";

export type LifeCycle = "anual" | "bienal" | "perene herbácea" | "arbusto" | "árvore";

export type PlantFunction =
  | "alimento humano"
  | "fixadora de azoto"
  | "quebra-vento"
  | "acumuladora dinâmica"
  | "atrai polinizadores"
  | "atrai predadores de pragas"
  | "repelente de pragas"
  | "cobertura do solo"
  | "forragem para animais"
  | "medicinal"
  | "lenha"
  | "material de construção"
  | "fixação de solo e controlo de erosão"
  | "quebra-fogo"
  | "planta pioneira"
  | "sombra";

export type WaterNeed = "muito baixa" | "baixa" | "média" | "alta";

export type DroughtTolerance = "nenhuma" | "baixa" | "média" | "alta" | "muito alta";

export type SunExposure = "sol pleno" | "meia-sombra" | "sombra";

export type WindTolerance = "baixa" | "média" | "alta";

export type SaltTolerance = "baixa" | "média" | "alta";

export type Propagation = "semente" | "estaca" | "enxertia" | "divisão de touceira" | "mergulhia" | "rebentos";

export type MaintenanceLevel = "baixa" | "média" | "alta";

export type RegionalStatus = "nativa" | "adaptada e tradicional" | "exótica sem risco" | "exótica a usar com cuidado";

export type InvasiveStatus = "não invasora" | "com potencial invasor" | "proibida por lei";

export type Confidence = "verificada" | "a confirmar";

export interface PlantCalendar {
  sow_direct?: Month[];
  sow_nursery?: Month[];
  transplant?: Month[];
  flowering?: Month[];
  harvest?: Month[];
  pruning?: Month[];
}

export interface Plant {
  id: string;
  common_name_pt: string;
  common_name_alt?: string[];
  scientific_name: string;
  family?: string;

  layer: PlantLayer;
  mature_height_m: number;
  mature_spread_m: number;
  life_cycle?: LifeCycle;
  lifespan_years?: number;

  functions: PlantFunction[];

  water_need?: WaterNeed;
  water_need_mm_year?: number;
  drought_tolerance: DroughtTolerance;
  sun?: SunExposure;
  soil_texture_preferred?: SoilTexture[];
  ph_range?: [number, number];
  min_temp_c?: number;
  max_temp_c?: number;
  wind_tolerance?: WindTolerance;
  salt_tolerance?: SaltTolerance;

  calendar?: PlantCalendar;
  years_to_production?: number;
  spacing_m?: number;
  propagation?: Propagation[];
  maintenance_level?: MaintenanceLevel;

  companions?: string[]; // Plant.id
  antagonists?: string[]; // Plant.id
  guilds?: string[]; // Guild.id (futuro)

  recommended_zone?: number[]; // 0 a 5

  regional_status?: RegionalStatus;
  invasive_status?: InvasiveStatus;
  protected_status?: boolean;

  photo_url?: string;
  photo_credit?: string;
  sources: string[];
  confidence?: Confidence;
}

// ---------------------------------------------------------------------------
// principle — Bússola (3 éticas + 12 princípios de Holmgren)
// ---------------------------------------------------------------------------

export type PrincipleType = "ética" | "princípio";

export interface Principle {
  id: string;
  type: PrincipleType;
  number: number;
  name_pt: string;
  short_description: string;
  provocation?: string;
  alentejo_example?: string;
  linked_decisions?: string[];
  icon?: string;
}

// ---------------------------------------------------------------------------
// design — O desenho do terreno (simulador, fase 2)
// ---------------------------------------------------------------------------

export type PlantingStatus = "planeado" | "plantado" | "estabelecido" | "perdido";

export interface Planting {
  plant_id: string;
  position: GeoPoint;
  quantity: number;
  planned_date?: string;
  status: PlantingStatus;
  notes?: string;
}

export interface DesignZone {
  zone_number: 0 | 1 | 2 | 3 | 4 | 5;
  polygon: GeoPolygon;
}

export type WaterElementType = "vala de infiltração" | "charca" | "represa" | "socalco" | "cisterna" | "linha de rega";

export interface WaterElement {
  type: WaterElementType;
  geometry: GeoPoint | GeoPolygon;
  capacity_liters?: number;
}

export interface DesignStructure {
  type: string;
  geometry: GeoPoint | GeoPolygon;
  notes?: string;
}

export interface Design {
  id: string;
  site_id: string;
  name: string;
  version: number;
  plantings: Planting[];
  zones: DesignZone[];
  water_elements: WaterElement[];
  structures: DesignStructure[];
}

// ---------------------------------------------------------------------------
// observation — Caderno de campo (fase 3)
// ---------------------------------------------------------------------------

export type ObservationCategory =
  | "água"
  | "solo"
  | "vegetação"
  | "fauna"
  | "vento"
  | "sol e sombra"
  | "geada"
  | "problema"
  | "outro";

export interface Observation {
  id: string;
  site_id: string;
  date: string;
  position?: GeoPoint;
  category: ObservationCategory;
  note: string;
  photos?: string[];
  synced: boolean;
}

// ---------------------------------------------------------------------------
// computed — Valores derivados automaticamente
// ---------------------------------------------------------------------------

/** Fase 1 — a primeira funcionalidade "inteligente" real da ferramenta. */
export interface ComputedSpeciesMatch {
  plant_id: string;
  score: number; // 0 a 100
  reasons: string[]; // frases explicando o porquê do score, sempre visíveis
}

/** Fase 2 */
export interface ComputedWaterBudget {
  monthly_balance_liters: number[]; // 12 posições, positivo = sobra, negativo = défice
  critical_months: Month[];
}

/** Fase 2 */
export interface ComputedSunPath {
  solstice_winter: { azimuth_deg: number; altitude_deg: number }[];
  solstice_summer: { azimuth_deg: number; altitude_deg: number }[];
}

/** Fase 2 */
export interface ComputedSectors {
  sun: string;
  wind: string;
  water: string;
  fire: string;
  access: string;
}

/** Fase 2 */
export interface ComputedSuggestedZones {
  zones: DesignZone[];
  rationale: string;
}

/** Fase 3 */
export interface ComputedMonthlyTask {
  month: Month;
  plant_id: string;
  task: "semear" | "plantar" | "podar" | "colher" | "regar";
  notes?: string;
}
