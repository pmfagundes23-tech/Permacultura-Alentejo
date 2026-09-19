"use client";

import { Leaf } from "lucide-react";
import { AbaId } from "@/types";

const TITULOS: Record<AbaId, { titulo: string; subtitulo: string }> = {
  oraculo: { titulo: "Oráculo Permacultural", subtitulo: "Pergunta, o Alentejo responde" },
  plantas: { titulo: "Explorador de Plantas", subtitulo: "50 espécies resilientes à seca" },
  guias: { titulo: "Guias Práticos", subtitulo: "Água, solo e cobertura no terreno" },
  terreno: { titulo: "Meu Terreno", subtitulo: "O teu perfil de sítio, passo a passo" },
};

export default function Header({ aba }: { aba: AbaId }) {
  const { titulo, subtitulo } = TITULOS[aba];

  return (
    <header className="safe-top sticky top-0 z-30 bg-oliva text-bege shadow-soft">
      <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bege/15">
          <Leaf className="h-5 w-5 text-bege" strokeWidth={2.2} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[11px] uppercase tracking-wide text-bege/70">
            Permacultura Alentejo
          </p>
          <h1 className="truncate text-base font-semibold leading-tight">{titulo}</h1>
        </div>
      </div>
      <p className="mx-auto max-w-lg px-4 pb-2 text-xs text-bege/70">{subtitulo}</p>
    </header>
  );
}
