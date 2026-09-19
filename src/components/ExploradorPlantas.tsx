"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Compass, Droplets, Gauge, Search, Sprout, X } from "lucide-react";
import { PLANTS } from "@/data/plantas-v2";
import { ComputedSpeciesMatch, DroughtTolerance, Month, Plant, PlantFunction, PlantLayer } from "@/types/schema";
import { RascunhoSite, carregarSite, siteTemDadosUteis } from "@/lib/site-storage";
import { computeAllMatches } from "@/lib/speciesMatch";

const LAYER_OPTIONS: PlantLayer[] = [
  "dossel",
  "sub-bosque",
  "arbustiva",
  "herbácea",
  "cobertura do solo",
  "rizosfera (raiz)",
  "trepadeira",
];

const DROUGHT_OPTIONS: DroughtTolerance[] = ["muito alta", "alta", "média", "baixa", "nenhuma"];

const FUNCTION_OPTIONS: PlantFunction[] = [
  "alimento humano",
  "fixadora de azoto",
  "quebra-vento",
  "acumuladora dinâmica",
  "atrai polinizadores",
  "atrai predadores de pragas",
  "repelente de pragas",
  "cobertura do solo",
  "forragem para animais",
  "medicinal",
  "lenha",
  "material de construção",
  "fixação de solo e controlo de erosão",
  "quebra-fogo",
  "planta pioneira",
  "sombra",
];

const NOMES_MES: Record<Month, string> = {
  1: "Janeiro",
  2: "Fevereiro",
  3: "Março",
  4: "Abril",
  5: "Maio",
  6: "Junho",
  7: "Julho",
  8: "Agosto",
  9: "Setembro",
  10: "Outubro",
  11: "Novembro",
  12: "Dezembro",
};
const MESES: Month[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function mesesDePlantio(planta: Plant): Month[] {
  const c = planta.calendar;
  if (!c) return [];
  const todos = [...(c.sow_direct ?? []), ...(c.sow_nursery ?? []), ...(c.transplant ?? [])];
  return Array.from(new Set(todos));
}

export default function ExploradorPlantas() {
  const [pesquisa, setPesquisa] = useState("");
  const [estratosAtivos, setEstratosAtivos] = useState<PlantLayer[]>([]);
  const [funcoesAtivas, setFuncoesAtivas] = useState<PlantFunction[]>([]);
  const [secaAtiva, setSecaAtiva] = useState<DroughtTolerance[]>([]);
  const [mesAtivo, setMesAtivo] = useState<Month | null>(null);
  const [expandidoId, setExpandidoId] = useState<string | null>(null);
  const [site, setSite] = useState<RascunhoSite>({});
  const [siteCarregado, setSiteCarregado] = useState(false);

  useEffect(() => {
    setSite(carregarSite());
    setSiteCarregado(true);
  }, []);

  const temPerfilUtil = siteCarregado && siteTemDadosUteis(site);

  const compatibilidades = useMemo<Map<string, ComputedSpeciesMatch> | null>(() => {
    if (!temPerfilUtil) return null;
    return computeAllMatches(site, PLANTS);
  }, [temPerfilUtil, site]);

  // Usa a forma funcional do setState (em vez de capturar a lista atual por
  // closure) para nunca perder um toque que chegue enquanto outro ainda
  // está a ser processado — importante em ecrãs tácteis.
  function alternar<T>(valor: T, setLista: React.Dispatch<React.SetStateAction<T[]>>) {
    setLista((atual) => (atual.includes(valor) ? atual.filter((v) => v !== valor) : [...atual, valor]));
  }

  const plantasFiltradas = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();
    const filtradas = PLANTS.filter((planta) => {
      const bateTermo =
        !termo ||
        planta.common_name_pt.toLowerCase().includes(termo) ||
        planta.scientific_name.toLowerCase().includes(termo);
      const bateEstrato = estratosAtivos.length === 0 || estratosAtivos.includes(planta.layer);
      const bateFuncao = funcoesAtivas.length === 0 || planta.functions.some((f) => funcoesAtivas.includes(f));
      const bateSeca = secaAtiva.length === 0 || secaAtiva.includes(planta.drought_tolerance);
      const bateMes = mesAtivo === null || mesesDePlantio(planta).includes(mesAtivo);
      return bateTermo && bateEstrato && bateFuncao && bateSeca && bateMes;
    });

    if (!compatibilidades) return filtradas;

    return [...filtradas].sort((a, b) => {
      const scoreA = compatibilidades.get(a.id)?.score ?? 0;
      const scoreB = compatibilidades.get(b.id)?.score ?? 0;
      return scoreB - scoreA;
    });
  }, [pesquisa, estratosAtivos, funcoesAtivas, secaAtiva, mesAtivo, compatibilidades]);

  const filtrosAtivos = estratosAtivos.length + funcoesAtivas.length + secaAtiva.length + (mesAtivo ? 1 : 0);

  function limparFiltros() {
    setEstratosAtivos([]);
    setFuncoesAtivas([]);
    setSecaAtiva([]);
    setMesAtivo(null);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="space-y-3 border-b border-terra/15 bg-bege px-4 py-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-terra-dark/40" />
          <input
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            placeholder="Pesquisar por nome comum ou científico..."
            className="w-full rounded-full border border-terra/20 bg-white py-2.5 pl-9 pr-9 text-sm text-terra-dark outline-none focus:border-oliva"
          />
          {pesquisa && (
            <button
              onClick={() => setPesquisa("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-terra-dark/40"
              aria-label="Limpar pesquisa"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <GrupoFiltro
          titulo="Estrato"
          opcoes={LAYER_OPTIONS}
          selecionados={estratosAtivos}
          onToggle={(v) => alternar(v, setEstratosAtivos)}
        />
        <GrupoFiltro
          titulo="Função"
          opcoes={FUNCTION_OPTIONS}
          selecionados={funcoesAtivas}
          onToggle={(v) => alternar(v, setFuncoesAtivas)}
        />
        <GrupoFiltro
          titulo="Tolerância à Seca"
          opcoes={DROUGHT_OPTIONS}
          selecionados={secaAtiva}
          onToggle={(v) => alternar(v, setSecaAtiva)}
        />

        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-terra-dark/50">
            Época de plantio
          </p>
          <div className="flex flex-wrap gap-1.5">
            {MESES.map((mes) => {
              const ativo = mesAtivo === mes;
              return (
                <button
                  key={mes}
                  type="button"
                  onClick={() => setMesAtivo(ativo ? null : mes)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                    ativo ? "border-oliva bg-oliva text-bege" : "border-terra/20 bg-white text-terra-dark/70"
                  }`}
                >
                  {NOMES_MES[mes].slice(0, 3)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-terra-dark/60">
          <span>
            {plantasFiltradas.length} de {PLANTS.length} espécies
          </span>
          {filtrosAtivos > 0 && (
            <button onClick={limparFiltros} className="font-medium text-terra underline">
              Limpar filtros ({filtrosAtivos})
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-2.5 overflow-y-auto px-4 py-3">
        {!temPerfilUtil && siteCarregado && (
          <div className="mb-1 flex items-start gap-2 rounded-xl2 border border-oliva/20 bg-oliva/5 px-3 py-2.5 text-xs text-terra-dark/80">
            <Compass className="mt-0.5 h-4 w-4 shrink-0 text-oliva" />
            <span>
              Preenche o teu <strong>Perfil do Terreno</strong> (aba 🧭 Terreno) para veres aqui a
              compatibilidade de cada espécie com o teu sítio real.
            </span>
          </div>
        )}
        {temPerfilUtil && (
          <div className="mb-1 flex items-start gap-2 rounded-xl2 border border-oliva/20 bg-oliva/5 px-3 py-2.5 text-xs text-terra-dark/80">
            <Gauge className="mt-0.5 h-4 w-4 shrink-0 text-oliva" />
            <span>
              Lista ordenada pela compatibilidade com o teu Perfil do Terreno. Toca numa planta
              para veres o porquê da pontuação.
            </span>
          </div>
        )}

        {plantasFiltradas.length === 0 && (
          <p className="mt-8 text-center text-sm text-terra-dark/50">
            Nenhuma planta encontrada com estes filtros. 🌵
          </p>
        )}
        {plantasFiltradas.map((planta) => (
          <CardPlanta
            key={planta.id}
            planta={planta}
            match={compatibilidades?.get(planta.id) ?? null}
            expandido={expandidoId === planta.id}
            onClick={() => setExpandidoId(expandidoId === planta.id ? null : planta.id)}
          />
        ))}
      </div>
    </div>
  );
}

function GrupoFiltro<T extends string>({
  titulo,
  opcoes,
  selecionados,
  onToggle,
}: {
  titulo: string;
  opcoes: T[];
  selecionados: T[];
  onToggle: (opcao: T) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-terra-dark/50">
        {titulo}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {opcoes.map((opcao) => {
          const ativo = selecionados.includes(opcao);
          return (
            <button
              key={opcao}
              type="button"
              onClick={() => onToggle(opcao)}
              className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                ativo ? "border-oliva bg-oliva text-bege" : "border-terra/20 bg-white text-terra-dark/70"
              }`}
            >
              {opcao}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const CORES_SECA: Record<DroughtTolerance, string> = {
  "muito alta": "bg-terra text-bege",
  alta: "bg-terra-light text-bege",
  média: "bg-oliva text-bege",
  baixa: "bg-areia text-terra-dark",
  nenhuma: "bg-areia text-terra-dark",
};

function corCompatibilidade(score: number): string {
  if (score >= 75) return "bg-oliva text-bege";
  if (score >= 50) return "bg-terra-light text-bege";
  return "bg-terra text-bege";
}

function CardPlanta({
  planta,
  match,
  expandido,
  onClick,
}: {
  planta: Plant;
  match: ComputedSpeciesMatch | null;
  expandido: boolean;
  onClick: () => void;
}) {
  const meses = mesesDePlantio(planta);
  return (
    <div className="overflow-hidden rounded-xl2 border border-terra/10 bg-white shadow-soft">
      <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-oliva/10">
          <Sprout className="h-5 w-5 text-oliva" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-terra-dark">{planta.common_name_pt}</p>
          <p className="truncate text-xs italic text-terra-dark/50">{planta.scientific_name}</p>
        </div>
        {match ? (
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${corCompatibilidade(match.score)}`}>
            {match.score}% compatível
          </span>
        ) : (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${CORES_SECA[planta.drought_tolerance]}`}
          >
            {planta.drought_tolerance}
          </span>
        )}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-terra-dark/40 transition-transform ${
            expandido ? "rotate-180" : ""
          }`}
        />
      </button>

      {expandido && (
        <div className="space-y-3 border-t border-terra/10 bg-areia/40 px-4 py-3 text-sm">
          {match && (
            <div className="rounded-lg border border-oliva/25 bg-oliva/5 p-3">
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-oliva-dark">
                <Gauge className="h-3.5 w-3.5" /> Porque {match.score}% de compatibilidade
              </p>
              <ul className="list-inside list-disc space-y-1 text-terra-dark/80">
                {match.reasons.map((razao, i) => (
                  <li key={i}>{razao}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Etiqueta texto={`Estrato: ${planta.layer}`} />
            {planta.recommended_zone && planta.recommended_zone.length > 0 && (
              <Etiqueta texto={`Zonas: ${planta.recommended_zone.join(", ")}`} />
            )}
            {planta.protected_status && <Etiqueta texto="⚠️ Espécie protegida (ICNF)" />}
          </div>

          {planta.water_need && (
            <div className="flex items-start gap-2 text-terra-dark/80">
              <Droplets className="mt-0.5 h-4 w-4 shrink-0 text-oliva" />
              <span>
                <strong className="text-terra-dark">Necessidade de água:</strong> {planta.water_need}
              </span>
            </div>
          )}

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-terra-dark/50">
              Funções no sistema
            </p>
            <ul className="list-inside list-disc space-y-0.5 text-terra-dark/80">
              {planta.functions.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>

          {meses.length > 0 && (
            <p className="text-terra-dark/80">
              <strong className="text-terra-dark">Época de plantio:</strong>{" "}
              {meses
                .sort((a, b) => a - b)
                .map((m) => NOMES_MES[m])
                .join(", ")}
            </p>
          )}

          {planta.maintenance_level && (
            <p className="text-terra-dark/80">
              <strong className="text-terra-dark">Manutenção:</strong> {planta.maintenance_level}
            </p>
          )}

          <p className="text-[11px] text-terra-dark/45">
            Fontes: {planta.sources.join(" · ")}
            {planta.confidence === "a confirmar" && " (valores a confirmar)"}
          </p>
        </div>
      )}
    </div>
  );
}

function Etiqueta({ texto }: { texto: string }) {
  return (
    <span className="rounded-md bg-oliva/10 px-2 py-1 text-xs font-medium text-oliva-dark">
      {texto}
    </span>
  );
}
