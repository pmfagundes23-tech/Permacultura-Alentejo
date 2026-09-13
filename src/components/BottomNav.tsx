"use client";

import { Sparkles, Leaf, BookOpen, MapPin } from "lucide-react";
import { AbaId } from "@/types";

interface ItemNav {
  id: AbaId;
  label: string;
  Icon: typeof Sparkles;
  emoji: string;
}

const ITENS: ItemNav[] = [
  { id: "oraculo", label: "Oráculo", Icon: Sparkles, emoji: "🔮" },
  { id: "plantas", label: "Plantas", Icon: Leaf, emoji: "🌿" },
  { id: "guias", label: "Guias", Icon: BookOpen, emoji: "📖" },
  { id: "mapa", label: "Mapa", Icon: MapPin, emoji: "🗺️" },
];

export default function BottomNav({
  abaAtiva,
  onChange,
}: {
  abaAtiva: AbaId;
  onChange: (aba: AbaId) => void;
}) {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-terra/15 bg-bege/95 backdrop-blur">
      <div className="mx-auto flex max-w-lg items-stretch justify-between px-1">
        {ITENS.map(({ id, label, Icon }) => {
          const ativo = id === abaAtiva;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={ativo ? "page" : undefined}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors ${
                ativo ? "text-oliva" : "text-terra-dark/50"
              }`}
            >
              <span
                className={`flex h-8 w-11 items-center justify-center rounded-full transition-colors ${
                  ativo ? "bg-oliva/15" : ""
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={ativo ? 2.4 : 2} />
              </span>
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
