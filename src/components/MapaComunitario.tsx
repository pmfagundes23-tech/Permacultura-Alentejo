"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, Plus, Sprout, Users, X } from "lucide-react";
import { HortaComunitaria, TipoTroca } from "@/types";
import { CONCELHOS_ALENTEJO, posicaoDoConcelho } from "@/data/concelhos";

const CHAVE_LOCALSTORAGE = "permacultura-alentejo:hortas";

const TIPOS_TROCA: TipoTroca[] = ["Sementes", "Mudas", "Ajuda em Mutirões"];

const CORES_TROCA: Record<TipoTroca, string> = {
  Sementes: "bg-oliva",
  Mudas: "bg-terra",
  "Ajuda em Mutirões": "bg-terra-light",
};

const HORTAS_SEMENTE: HortaComunitaria[] = [
  {
    id: "seed-evora",
    nome: "Horta Comunitária de Évora",
    concelho: "Évora",
    tipo_troca: ["Sementes", "Ajuda em Mutirões"],
    descricao: "Grupo local de trocas de sementes crioulas e mutirões mensais de plantio.",
    criado_em: new Date("2025-01-15").toISOString(),
    ...posicaoDoConcelho("Évora"),
  },
  {
    id: "seed-beja",
    nome: "Projeto Terra Fértil",
    concelho: "Beja",
    tipo_troca: ["Mudas"],
    descricao: "Viveiro comunitário de mudas de árvores nativas resistentes à seca.",
    criado_em: new Date("2025-02-03").toISOString(),
    ...posicaoDoConcelho("Beja"),
  },
  {
    id: "seed-serpa",
    nome: "Coletivo Raízes de Serpa",
    concelho: "Serpa",
    tipo_troca: ["Sementes", "Mudas"],
    descricao: "Banco de sementes locais e partilha de mudas de oliveira e figueira.",
    criado_em: new Date("2025-02-20").toISOString(),
    ...posicaoDoConcelho("Serpa"),
  },
  {
    id: "seed-odemira",
    nome: "Permacultura Costa Vicentina",
    concelho: "Odemira",
    tipo_troca: ["Ajuda em Mutirões"],
    descricao: "Rede de mutirões para construção de swales e sistemas de captação de água.",
    criado_em: new Date("2025-03-10").toISOString(),
    ...posicaoDoConcelho("Odemira"),
  },
  {
    id: "seed-portalegre",
    nome: "Horta do Monte Serra",
    concelho: "Portalegre",
    tipo_troca: ["Sementes", "Mudas", "Ajuda em Mutirões"],
    descricao: "Terreno demonstrativo de permacultura aberto à comunidade aos sábados.",
    criado_em: new Date("2025-03-22").toISOString(),
    ...posicaoDoConcelho("Portalegre"),
  },
];

function carregarHortas(): HortaComunitaria[] {
  if (typeof window === "undefined") return HORTAS_SEMENTE;
  try {
    const guardado = window.localStorage.getItem(CHAVE_LOCALSTORAGE);
    if (!guardado) {
      window.localStorage.setItem(CHAVE_LOCALSTORAGE, JSON.stringify(HORTAS_SEMENTE));
      return HORTAS_SEMENTE;
    }
    const parsed = JSON.parse(guardado) as HortaComunitaria[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : HORTAS_SEMENTE;
  } catch {
    return HORTAS_SEMENTE;
  }
}

export default function MapaComunitario() {
  const [hortas, setHortas] = useState<HortaComunitaria[]>([]);
  const [selecionada, setSelecionada] = useState<HortaComunitaria | null>(null);
  const [formularioAberto, setFormularioAberto] = useState(false);

  useEffect(() => {
    setHortas(carregarHortas());
  }, []);

  function guardarHortas(novaLista: HortaComunitaria[]) {
    setHortas(novaLista);
    try {
      window.localStorage.setItem(CHAVE_LOCALSTORAGE, JSON.stringify(novaLista));
    } catch {
      // localStorage indisponível (ex: modo privado) — a app continua a funcionar em memória.
    }
  }

  function adicionarHorta(nova: Omit<HortaComunitaria, "id" | "criado_em" | "x" | "y">) {
    const { x, y } = posicaoDoConcelho(nova.concelho);
    const registo: HortaComunitaria = {
      ...nova,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      criado_em: new Date().toISOString(),
      x,
      y,
    };
    guardarHortas([registo, ...hortas]);
    setFormularioAberto(false);
    setSelecionada(registo);
  }

  const hortasOrdenadas = useMemo(
    () => [...hortas].sort((a, b) => (a.criado_em < b.criado_em ? 1 : -1)),
    [hortas]
  );

  return (
    <div className="h-full overflow-y-auto px-4 py-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-terra-dark/60">
          {hortas.length} projetos registados pela comunidade no Alentejo.
        </p>
        <button
          onClick={() => setFormularioAberto(true)}
          className="flex items-center gap-1.5 rounded-full bg-oliva px-3.5 py-2 text-xs font-semibold text-bege shadow-soft active:scale-95"
        >
          <Plus className="h-4 w-4" /> Registar Horta
        </button>
      </div>

      <MapaEstilizado
        hortas={hortas}
        selecionadaId={selecionada?.id ?? null}
        onSelecionar={setSelecionada}
      />

      {selecionada && (
        <PainelHorta horta={selecionada} onFechar={() => setSelecionada(null)} />
      )}

      <h2 className="mb-2 mt-5 text-sm font-semibold text-terra-dark">Lista de Projetos</h2>
      <div className="space-y-2.5 pb-2">
        {hortasOrdenadas.map((horta) => (
          <button
            key={horta.id}
            onClick={() => setSelecionada(horta)}
            className="flex w-full items-start gap-3 rounded-xl2 border border-terra/10 bg-white p-3.5 text-left shadow-soft active:scale-[0.99]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terra/10">
              <Sprout className="h-4 w-4 text-terra" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-terra-dark">{horta.nome}</p>
              <p className="text-xs text-terra-dark/50">{horta.concelho}</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {horta.tipo_troca.map((t) => (
                  <span
                    key={t}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium text-bege ${CORES_TROCA[t]}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      {formularioAberto && (
        <FormularioHorta onCancelar={() => setFormularioAberto(false)} onSubmeter={adicionarHorta} />
      )}
    </div>
  );
}

function MapaEstilizado({
  hortas,
  selecionadaId,
  onSelecionar,
}: {
  hortas: HortaComunitaria[];
  selecionadaId: string | null;
  onSelecionar: (h: HortaComunitaria) => void;
}) {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl2 border border-terra/15 shadow-soft">
      {/* Fundo estilizado a representar o terreno do Alentejo */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="terreno" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E6DFD5" />
            <stop offset="55%" stopColor="#D9CBA8" />
            <stop offset="100%" stopColor="#c9b98f" />
          </linearGradient>
          <pattern id="grelha" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M8 0H0V8" fill="none" stroke="#8B4513" strokeOpacity="0.08" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#terreno)" />
        <rect width="100" height="100" fill="url(#grelha)" />
        {/* "Silhueta" orgânica sugerindo a região do Alentejo */}
        <path
          d="M12 20 Q 30 5, 55 8 Q 80 10, 92 28 Q 98 45, 88 62 Q 82 78, 62 90 Q 40 98, 22 88 Q 6 78, 8 55 Q 5 35, 12 20 Z"
          fill="#556B2F"
          fillOpacity="0.08"
          stroke="#556B2F"
          strokeOpacity="0.25"
          strokeWidth="0.6"
        />
      </svg>

      {/* Marcadores */}
      {hortas.map((horta) => {
        const ativo = horta.id === selecionadaId;
        return (
          <button
            key={horta.id}
            onClick={() => onSelecionar(horta)}
            style={{ left: `${horta.x}%`, top: `${horta.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-full transition-transform ${
              ativo ? "z-10 scale-125" : "z-0"
            }`}
            aria-label={horta.nome}
          >
            <MapPin
              className={`h-6 w-6 drop-shadow ${ativo ? "fill-terra text-terra-dark" : "fill-oliva text-oliva-dark"}`}
              strokeWidth={1.5}
            />
          </button>
        );
      })}

      <div className="absolute bottom-2 left-2 rounded-md bg-white/85 px-2 py-1 text-[10px] font-medium text-terra-dark/70">
        🗺️ Mapa estilizado — Alentejo
      </div>
    </div>
  );
}

function PainelHorta({ horta, onFechar }: { horta: HortaComunitaria; onFechar: () => void }) {
  return (
    <div className="relative mt-3 rounded-xl2 border border-oliva/25 bg-white p-4 shadow-soft">
      <button
        onClick={onFechar}
        className="absolute right-3 top-3 text-terra-dark/40"
        aria-label="Fechar"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-oliva" />
        <h3 className="text-sm font-semibold text-terra-dark">{horta.nome}</h3>
      </div>
      <p className="mt-0.5 text-xs text-terra-dark/50">{horta.concelho}</p>
      <p className="mt-2 text-sm text-terra-dark/80">{horta.descricao}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {horta.tipo_troca.map((t) => (
          <span
            key={t}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium text-bege ${CORES_TROCA[t]}`}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function FormularioHorta({
  onCancelar,
  onSubmeter,
}: {
  onCancelar: () => void;
  onSubmeter: (v: Omit<HortaComunitaria, "id" | "criado_em" | "x" | "y">) => void;
}) {
  const [nome, setNome] = useState("");
  const [concelho, setConcelho] = useState(CONCELHOS_ALENTEJO[3]?.nome ?? "Évora");
  const [tipos, setTipos] = useState<TipoTroca[]>([]);
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState("");

  function alternarTipo(tipo: TipoTroca) {
    setTipos((atual) => (atual.includes(tipo) ? atual.filter((t) => t !== tipo) : [...atual, tipo]));
  }

  function submeter(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || tipos.length === 0) {
      setErro("Preenche o nome e escolhe pelo menos um tipo de troca.");
      return;
    }
    onSubmeter({ nome: nome.trim(), concelho, tipo_troca: tipos, descricao: descricao.trim() });
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center">
      <form
        onSubmit={submeter}
        className="safe-bottom max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-bege p-5 shadow-soft sm:rounded-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-terra-dark">Registar a Minha Horta / Terreno</h2>
          <button type="button" onClick={onCancelar} aria-label="Fechar formulário">
            <X className="h-5 w-5 text-terra-dark/50" />
          </button>
        </div>

        <div className="space-y-4">
          <Campo label="Nome do Responsável / Projeto">
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Horta da Quinta do Monte"
              className="w-full rounded-lg border border-terra/20 bg-white px-3 py-2.5 text-sm text-terra-dark outline-none focus:border-oliva"
            />
          </Campo>

          <Campo label="Concelho">
            <select
              value={concelho}
              onChange={(e) => setConcelho(e.target.value)}
              className="w-full rounded-lg border border-terra/20 bg-white px-3 py-2.5 text-sm text-terra-dark outline-none focus:border-oliva"
            >
              {CONCELHOS_ALENTEJO.map((c) => (
                <option key={c.nome} value={c.nome}>
                  {c.nome}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="O que oferece/procura para troca">
            <div className="flex flex-wrap gap-2">
              {TIPOS_TROCA.map((tipo) => {
                const ativo = tipos.includes(tipo);
                return (
                  <button
                    type="button"
                    key={tipo}
                    onClick={() => alternarTipo(tipo)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      ativo ? "border-oliva bg-oliva text-bege" : "border-terra/20 bg-white text-terra-dark/70"
                    }`}
                  >
                    {tipo}
                  </button>
                );
              })}
            </div>
          </Campo>

          <Campo label="Descrição (opcional)">
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              placeholder="Conta brevemente o que fazem ou o que procuram..."
              className="w-full resize-none rounded-lg border border-terra/20 bg-white px-3 py-2.5 text-sm text-terra-dark outline-none focus:border-oliva"
            />
          </Campo>

          {erro && <p className="text-xs font-medium text-terra">{erro}</p>}

          <button
            type="submit"
            className="w-full rounded-full bg-oliva py-3 text-sm font-semibold text-bege shadow-soft active:scale-[0.98]"
          >
            Guardar no Mapa Comunitário
          </button>
        </div>
      </form>
    </div>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-terra-dark/50">
        {label}
      </span>
      {children}
    </label>
  );
}
