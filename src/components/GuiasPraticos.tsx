"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronLeft, Clock, Flame } from "lucide-react";
import { GUIAS } from "@/data/guias";
import { Guia } from "@/types";

export default function GuiasPraticos() {
  const [guiaAberto, setGuiaAberto] = useState<Guia | null>(null);

  if (guiaAberto) {
    return <LeitorGuia guia={guiaAberto} onVoltar={() => setGuiaAberto(null)} />;
  }

  return (
    <div className="h-full overflow-y-auto px-4 py-4">
      <p className="mb-3 text-sm text-terra-dark/60">
        Manuais práticos e diretos para aplicar permacultura no terreno, adaptados ao clima do
        Alentejo.
      </p>
      <div className="space-y-3">
        {GUIAS.map((guia) => (
          <button
            key={guia.id}
            onClick={() => setGuiaAberto(guia)}
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
    </div>
  );
}

function LeitorGuia({ guia, onVoltar }: { guia: Guia; onVoltar: () => void }) {
  return (
    <div className="flex h-full flex-col">
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
