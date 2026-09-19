import { Site } from "@/types/schema";

// Leitura/escrita partilhada do Perfil do Terreno (localStorage), usada
// tanto pelo formulário (PerfilTerreno) como por quem consome o perfil
// para gerar recomendações (ExploradorPlantas, species_match).

export const CHAVE_LOCALSTORAGE_SITE = "permacultura-alentejo:site";

export type RascunhoSite = Partial<Site>;

export function novoRascunhoSite(): RascunhoSite {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    created_at: new Date().toISOString(),
  };
}

export function carregarSite(): RascunhoSite {
  if (typeof window === "undefined") return novoRascunhoSite();
  try {
    const guardado = window.localStorage.getItem(CHAVE_LOCALSTORAGE_SITE);
    if (!guardado) return novoRascunhoSite();
    const parsed = JSON.parse(guardado) as RascunhoSite;
    return parsed && typeof parsed === "object" ? parsed : novoRascunhoSite();
  } catch {
    return novoRascunhoSite();
  }
}

export function guardarSite(site: RascunhoSite) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHAVE_LOCALSTORAGE_SITE, JSON.stringify(site));
  } catch {
    // localStorage indisponível — os dados ficam só em memória nesta sessão.
  }
}

/** Um perfil só é considerado "com dados suficientes" para pontuar plantas
 * quando tem pelo menos um sinal relevante para as regras do species_match. */
export function siteTemDadosUteis(site: RascunhoSite): boolean {
  return Boolean(
    site.rainfall_annual_mm !== undefined ||
      site.dries_in_summer !== undefined ||
      site.soil_texture !== undefined ||
      site.aspect !== undefined ||
      site.irrigation !== undefined ||
      (site.goal && site.goal.length > 0) ||
      site.presence !== undefined
  );
}
