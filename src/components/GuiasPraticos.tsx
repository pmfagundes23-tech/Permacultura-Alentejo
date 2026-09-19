"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronDown, ChevronLeft, Clock, Compass, Flame } from "lucide-react";
import { GUIAS } from "@/data/guias";
import { ETICAS, PRINCIPIOS } from "@/data/principios";
import { Guia } from "@/types";
import { Principle } from "@/types/schema";

type SubAba = "guias" | "bussola";

export default function GuiasPraticos() {
  const [subAba, setSubAba] = useState<SubAba>("guias");
  const [guiaAberto, setGuiaAberto] = useState<Guia | null>(null);

  if (guiaAberto) {
    return <LeitorGuia guia={guiaAberto} onVoltar={() => setGuiaAberto(null)} />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex gap-1.5 border-b border-terra/15 bg-bege px-4 pb-3 pt-3">
        <SeletorBotao ativo={subAba === "guias"} onClick={() => setSubAba("guias")}>
          📖 Guias Práticos
        </SeletorBotao>
        <SeletorBotao ativo={subAba === "bussola"} onClick={() => setSubAba("bussola")}>
          🧭 Bússola
        </SeletorBotao>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {subAba === "guias" ? (
          <ListaGuias onAbrir={setGuiaAberto} />
        ) : (
          <Bussola />
        )}
      </div>
    </div>
  );
}

function SeletorBotao({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition ${
        ativo ? "bg-oliva text-bege shadow-soft" : "bg-white text-terra-dark/60"
      }`}
    >
      {children}
    </button>
  );
}

function ListaGuias({ onAbrir }: { onAbrir: (g: Guia) => void }) {
  return (
    <>
      <p className="mb-3 text-sm text-terra-dark/60">
        Manuais práticos e diretos para aplicar permacultura no terreno, adaptados ao clima do
        Alentejo.
      </p>
      <div className="space-y-3">
        {GUIAS.map((guia) => (
          <button
            key={guia.id}
            onClick={() => onAbrir(guia)}
            className="flex w-full items-start gap-3 rounded-xl2 border border-terra/10 bg-white p-4 text-left shadow-soft transition active:scale-[0.99]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-oliva/10 text-xl">
              {guia.icone}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold leading-snug text-terra-dark">{guia.titulo}</h3>
              <p className="mt-1 text-xs leading-relaxed text-terra-dark/60">{guia.resumo}</p>
              <div className="mt-2 flex items-center gap-1 text-[11px] text-terra-dark/45">
                <Clock className="h-3 w-3" />
                <span>{guia.tempo_leitura_min} min de leitura</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

function LeitorGuia({ guia, onVoltar }: { guia: Guia; onVoltar: () => void }) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b border-terra/15 bg-bege px-3 py-2.5">
        <button
          onClick={onVoltar}
          className="flex h-9 w-9 items-center justify-center rounded-full text-terra-dark active:bg-terra/10"
          aria-label="Voltar à lista de guias"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-terra-dark">{guia.titulo}</p>
          <div className="flex items-center gap-1 text-[11px] text-terra-dark/50">
            <Clock className="h-3 w-3" />
            <span>{guia.tempo_leitura_min} min</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-4 flex items-start gap-2 rounded-xl2 border border-terra/20 bg-terra/5 px-3 py-2.5 text-xs text-terra-dark/80">
          <Flame className="mt-0.5 h-4 w-4 shrink-0 text-terra" />
          <span>
            Este guia inclui recomendações de segurança contra incêndios rurais. Segue sempre a
            legislação local de faixas de gestão de combustível do teu concelho.
          </span>
        </div>
        <article className="guia-conteudo text-sm text-terra-dark">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{guia.conteudo_md}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}

function Bussola() {
  const [expandidoId, setExpandidoId] = useState<string | null>(null);

  return (
    <>
      <div className="mb-4 flex items-start gap-2 rounded-xl2 border border-oliva/20 bg-oliva/5 px-3 py-2.5 text-xs text-terra-dark/80">
        <Compass className="mt-0.5 h-4 w-4 shrink-0 text-oliva" />
        <span>
          As 3 éticas e os 12 princípios de David Holmgren — a base de pensamento por trás de
          qualquer decisão de desenho em permacultura, aplicados ao Alentejo.
        </span>
      </div>

      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-terra-dark/50">
        As 3 Éticas
      </h2>
      <div className="mb-5 space-y-2.5">
        {ETICAS.map((etica) => (
          <CartaoPrincipio
            key={etica.id}
            principio={etica}
            expandido={expandidoId === etica.id}
            onClick={() => setExpandidoId(expandidoId === etica.id ? null : etica.id)}
            destaque
          />
        ))}
      </div>

      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-terra-dark/50">
        Os 12 Princípios
      </h2>
      <div className="space-y-2.5 pb-2">
        {PRINCIPIOS.map((principio) => (
          <CartaoPrincipio
            key={principio.id}
            principio={principio}
            expandido={expandidoId === principio.id}
            onClick={() => setExpandidoId(expandidoId === principio.id ? null : principio.id)}
          />
        ))}
      </div>
    </>
  );
}

function CartaoPrincipio({
  principio,
  expandido,
  onClick,
  destaque = false,
}: {
  principio: Principle;
  expandido: boolean;
  onClick: () => void;
  destaque?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl2 border bg-white shadow-soft ${
        destaque ? "border-oliva/30" : "border-terra/10"
      }`}
    >
      <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base ${
            destaque ? "bg-oliva/15" : "bg-terra/10"
          }`}
        >
          {principio.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-terra-dark/40">
            {principio.type === "ética" ? "Ética" : `Princípio ${principio.number}`}
          </p>
          <p className="truncate text-sm font-semibold text-terra-dark">{principio.name_pt}</p>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-terra-dark/40 transition-transform ${
            expandido ? "rotate-180" : ""
          }`}
        />
      </button>

      {expandido && (
        <div className="space-y-3 border-t border-terra/10 bg-areia/40 px-4 py-3 text-sm text-terra-dark/80">
          <p>{principio.short_description}</p>
          {principio.provocation && (
            <p className="italic text-oliva-dark">"{principio.provocation}"</p>
          )}
          {principio.alentejo_example && (
            <p>
              <strong className="text-terra-dark">No Alentejo:</strong> {principio.alentejo_example}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
