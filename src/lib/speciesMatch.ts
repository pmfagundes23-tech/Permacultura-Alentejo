import { ComputedSpeciesMatch, DroughtTolerance, Plant, Site } from "@/types/schema";
import { RascunhoSite } from "@/lib/site-storage";

// computed.species_match — compatibilidade de 0 a 100 entre o Perfil do
// Terreno e cada espécie, sempre com as razões visíveis (nunca uma lista
// sem justificação, conforme a regra da especificação).
//
// Motor baseado em regras simples e explicáveis — não é machine learning,
// é o mesmo tipo de raciocínio que o Oráculo usa, só que aplicado
// diretamente aos dados estruturados do terreno.

const NIVEL_SECA: Record<DroughtTolerance, number> = {
  nenhuma: 0,
  baixa: 1,
  média: 2,
  alta: 3,
  "muito alta": 4,
};

export function computeSpeciesMatch(site: RascunhoSite, plant: Plant): ComputedSpeciesMatch {
  // Bloqueio legal — nunca recomendar uma espécie proibida por lei.
  if (plant.invasive_status === "proibida por lei") {
    return {
      plant_id: plant.id,
      score: 0,
      reasons: [
        "Espécie legalmente proibida em Portugal (Decreto-Lei n.º 92/2019) — não deve ser usada no desenho.",
      ],
    };
  }

  let score = 70; // ponto de partida neutro
  const reasons: string[] = [];
  const nivelSeca = NIVEL_SECA[plant.drought_tolerance];

  // --- Água: a variável mais decisiva no Alentejo -------------------------
  const semAguaDisponivel = site.dries_in_summer === "sim" && (!site.irrigation || site.irrigation === "nenhuma");

  if (semAguaDisponivel) {
    if (nivelSeca <= 1) {
      score -= 45;
      reasons.push(
        `O teu terreno seca no verão e não tem rega instalada — esta espécie tem tolerância à seca "${plant.drought_tolerance}", risco alto de perda sem intervenção.`
      );
    } else if (nivelSeca === 2) {
      score -= 15;
      reasons.push(
        "Tolerância à seca média — pode sofrer em anos de verão mais severo, mesmo sem rega instalada."
      );
    } else {
      score += 15;
      reasons.push(
        `Tolerância à seca "${plant.drought_tolerance}" bem adequada a um terreno sem rega disponível no verão.`
      );
    }
  } else if (site.rainfall_annual_mm !== undefined) {
    if (site.rainfall_annual_mm < 500) {
      if (nivelSeca <= 1) {
        score -= 30;
        reasons.push(
          `Precipitação anual baixa no teu terreno (${site.rainfall_annual_mm} mm) para uma espécie com tolerância à seca "${plant.drought_tolerance}".`
        );
      } else {
        score += 8;
        reasons.push(`Tolerância à seca compatível com a precipitação anual do terreno (${site.rainfall_annual_mm} mm).`);
      }
    } else if (site.rainfall_annual_mm >= 700 && nivelSeca <= 1) {
      score += 5;
      reasons.push(`Precipitação anual generosa (${site.rainfall_annual_mm} mm) — compatível mesmo com pouca tolerância à seca.`);
    }
  }

  // --- Solo -----------------------------------------------------------------
  if (site.soil_texture && site.soil_texture !== "não sei" && plant.soil_texture_preferred?.length) {
    if (plant.soil_texture_preferred.includes(site.soil_texture)) {
      score += 8;
      reasons.push(`A textura do solo do terreno (${site.soil_texture}) está entre as preferidas desta espécie.`);
    } else {
      score -= 12;
      reasons.push(
        `Prefere solos ${plant.soil_texture_preferred.join("/")}, diferente do solo "${site.soil_texture}" indicado no perfil.`
      );
    }
  }

  // --- Exposição solar --------------------------------------------------
  if (site.aspect && plant.sun) {
    if (site.aspect === "norte" && plant.sun === "sol pleno") {
      score -= 10;
      reasons.push("Precisa de sol pleno, mas a encosta virada a norte recebe menos radiação direta.");
    }
    if (site.aspect === "sul" && plant.sun === "sombra") {
      score -= 10;
      reasons.push("Prefere sombra, mas a encosta virada a sul do teu terreno é muito exposta ao sol.");
    }
    if (site.aspect === "sul" && plant.sun === "sol pleno" && nivelSeca >= 3) {
      score += 5;
      reasons.push("Boa combinação: espécie resistente à seca numa encosta sul, quente e ensolarada.");
    }
  }

  // --- Frio / geada -------------------------------------------------------
  if (plant.min_temp_c !== undefined && plant.min_temp_c > -2 && (site.first_frost || site.last_frost)) {
    score -= 10;
    reasons.push(`Sensível ao frio (mínimo tolerado ${plant.min_temp_c}°C) — protege-a nas noites de geada.`);
  }

  // --- Manutenção vs. presença no terreno ---------------------------------
  if (plant.maintenance_level === "alta" && site.presence === "uma vez por mês ou menos") {
    score -= 20;
    reasons.push("Exige manutenção frequente, mas a tua presença no terreno é pouco frequente.");
  } else if (plant.maintenance_level === "baixa" && site.presence === "uma vez por mês ou menos") {
    score += 6;
    reasons.push("Manutenção baixa — adequada a quem visita o terreno com pouca frequência.");
  }

  // --- Objetivos da pessoa -------------------------------------------------
  if (site.goal?.includes("regeneração do solo e da paisagem") && plant.functions.includes("fixadora de azoto")) {
    score += 8;
    reasons.push("Fixadora de azoto — apoia diretamente o teu objetivo de regeneração do solo.");
  }
  if (site.goal?.includes("autoconsumo alimentar") && plant.functions.includes("alimento humano")) {
    score += 8;
    reasons.push("Produz alimento humano — alinhado com o teu objetivo de autoconsumo.");
  }
  if (site.goal?.includes("biodiversidade") && plant.functions.includes("atrai polinizadores")) {
    score += 5;
    reasons.push("Atrai polinizadores — contribui para o teu objetivo de biodiversidade.");
  }
  if (
    site.fire_risk &&
    (site.fire_risk === "alto" || site.fire_risk === "muito alto") &&
    plant.functions.includes("quebra-fogo")
  ) {
    score += 6;
    reasons.push(`O teu terreno tem risco de incêndio "${site.fire_risk}" — esta espécie ajuda como quebra-fogo.`);
  }

  // --- Nota informativa (não penaliza) ------------------------------------
  if (plant.protected_status) {
    reasons.push("Espécie protegida por lei (ICNF) — corte e poda exigem autorização.");
  }

  if (reasons.length === 0) {
    reasons.push(
      "Ainda não há dados suficientes no teu Perfil do Terreno para ajustar esta pontuação — score de base pela tolerância à seca geral da espécie."
    );
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  return { plant_id: plant.id, score, reasons };
}

export function computeAllMatches(site: RascunhoSite, plants: Plant[]): Map<string, ComputedSpeciesMatch> {
  const mapa = new Map<string, ComputedSpeciesMatch>();
  for (const plant of plants) {
    mapa.set(plant.id, computeSpeciesMatch(site, plant));
  }
  return mapa;
}

/** Re-exporta o tipo Site apenas para conveniência de quem importar deste módulo. */
export type { Site };
