"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search, Droplets, Sprout, X } from "lucide-react";
import { PLANTAS, CAMADAS_GRUPO, NIVEIS_SECA, ZONAS_PERMACULTURA } from "@/data/plantas";
import { CamadaGrupo, Planta, ToleranciaSeca } from "@/types";

export default function ExploradorPlantas() {
  const [pesquisa, setPesquisa] = useState("");
  const [camadasAtivas, setCamadasAtivas] = useState<CamadaGrupo[]>([]);
  const [secaAtiva, setSecaAtiva] = useState<ToleranciaSeca[]>([]);
  const [zonaAtiva, setZonaAtiva] = useState<number[]>([]);
  const [expandidoId, setExpandidoId] = useState<number | null>(null);

  function alternar<T>(lista: T[], valor: T, setLista: (v: T[]) => void) {
    setLista(lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor]);
  }

  const plantasFiltradas = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();
    return PLANTAS.filter((planta) => {
      const bateTermo =
        !termo ||
        planta.nome_comum.toLowerCase().includes(termo) ||
        planta.nome_cientifico.toLowerCase().includes(termo);
      const bateCamada = camadasAtivas.length === 0 || camadasAtivas.includes(planta.camada_grupo);
      const bateSeca = secaAtiva.length === 0 || secaAtiva.includes(planta.tolerancia_seca);
      const bateZona =
        zonaAtiva.length === 0 || planta.zona_permacultura.some((z) => zonaAtiva.includes(z));
      return bateTermo && bateCamada && bateSeca && bateZona;
    });
  }, [pesquisa, camadasAtivas, secaAtiva, zonaAtiva]);

  const filtrosAtivos = camadasAtivas.length + secaAtiva.length + zonaAtiva.length;

  function limparFiltros() {
    setCamadasAtivas([]);
    setSecaAtiva([]);
    setZonaAtiva([]);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-3 border-b border-terra/15 bg-bege px-4 py-3">
        {/* Pesquisa */}
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

        {/* Filtros */}
        <GrupoFiltro
          titulo="Camada"
          opcoes={CAMADAS_GRUPO}
          selecionados={camadasAtivas}
          onToggle={(v) => alternar(camadasAtivas, v as CamadaGrupo, setCamadasAtivas)}
        />
        <GrupoFiltro
          titulo="Tolerância à Seca"
          opcoes={NIVEIS_SECA}
          selecionados={secaAtiva}
          onToggle={(v) => alternar(secaAtiva, v as ToleranciaSeca, setSecaAtiva)}
        />
        <GrupoFiltro
          titulo="Zona Permacultural"
          opcoes={ZONAS_PERMACULTURA.map((z) => `Zona ${z}`)}
          selecionados={zonaAtiva.map((z) => `Zona ${z}`)}
          onToggle={(rotulo) => {
            const zona = Number(rotulo.replace("Zona ", ""));
            alternar(zonaAtiva, zona, setZonaAtiva);
          }}
        />

        <div className="flex items-center justify-between text-xs text-terra-dark/60">
          <span>
            {plantasFiltradas.length} de {PLANTAS.length} espécies
          </span>
          {filtrosAtivos > 0 && (
            <button onClick={limparFiltros} className="font-medium text-terra underline">
              Limpar filtros ({filtrosAtivos})
            </button>
          )}
        </div>
      </div>

      {/* Lista de cards */}
      <div className="flex-1 space-y-2.5 overflow-y-auto px-4 py-3">
        {plantasFiltradas.length === 0 && (
          <p className="mt-8 text-center text-sm text-terra-dark/50">
            Nenhuma planta encontrada com estes filtros. 🌵
          </p>
        )}
        {plantasFiltradas.map((planta) => (
          <CardPlanta
            key={planta.id}
            planta={planta}
            expandido={expandidoId === planta.id}
            onClick={() => setExpandidoId(expandidoId === planta.id ? null : planta.id)}
          />
        ))}
      </div>
    </div>
  );
}

function GrupoFiltro({
  titulo,
  opcoes,
  selecionados,
  onToggle,
}: {
  titulo: string;
  opcoes: string[];
  selecionados: string[];
  onToggle: (opcao: string) => void;
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
                ativo
                  ? "border-oliva bg-oliva text-bege"
                  : "border-terra/20 bg-white text-terra-dark/70"
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

const CORES_SECA: Record<ToleranciaSeca, string> = {
  Extrema: "bg-terra text-bege",
  "Muito Alta": "bg-terra-light text-bege",
  Alta: "bg-oliva text-bege",
  Média: "bg-areia text-terra-dark",
  Baixa: "bg-areia text-terra-dark",
};

function CardPlanta({
  planta,
  expandido,
  onClick,
}: {
  planta: Planta;
  expandido: boolean;
  onClick: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl2 border border-terra/10 bg-white shadow-soft">
      <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-oliva/10">
          <Sprout className="h-5 w-5 text-oliva" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-terra-dark">{planta.nome_comum}</p>
          <p className="truncate text-xs italic text-terra-dark/50">{planta.nome_cientifico}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${CORES_SECA[planta.tolerancia_seca]}`}
        >
          {planta.tolerancia_seca}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-terra-dark/40 transition-transform ${
            expandido ? "rotate-180" : ""
          }`}
        />
      </button>

      {expandido && (
        <div className="space-y-3 border-t border-terra/10 bg-areia/40 px-4 py-3 text-sm">
          <div className="flex flex-wrap gap-2">
            <Etiqueta texto={`Camada: ${planta.camada}`} />
            <Etiqueta texto={`Zonas: ${planta.zona_permacultura.join(", ")}`} />
          </div>

          <div className="flex items-start gap-2 text-terra-dark/80">
            <Droplets className="mt-0.5 h-4 w-4 shrink-0 text-oliva" />
            <span>
              <strong className="text-terra-dark">Rega:</strong> {planta.necessidade_rega}
            </span>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-terra-dark/50">
              Funções ecológicas
            </p>
            <ul className="list-inside list-disc space-y-0.5 text-terra-dark/80">
              {planta.funcoes_ecologicas.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-terra-dark/50">
              Usos humanos
            </p>
            <ul className="list-inside list-disc space-y-0.5 text-terra-dark/80">
              {planta.usos_humanos.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </div>

          <p className="text-terra-dark/80">
            <strong className="text-terra-dark">Época de plantio:</strong> {planta.epoca_plantio}
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
