"use client";

import { useState } from "react";
import { AbaId } from "@/types";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import OraculoChat from "@/components/OraculoChat";
import ExploradorPlantas from "@/components/ExploradorPlantas";
import GuiasPraticos from "@/components/GuiasPraticos";
import PerfilTerreno from "@/components/PerfilTerreno";

export default function Home() {
  const [aba, setAba] = useState<AbaId>("oraculo");

  return (
    <div className="mx-auto flex h-dvh max-w-lg flex-col bg-bege">
      <Header aba={aba} />

      <main className="min-h-0 flex-1 pb-16">
        {aba === "oraculo" && <OraculoChat />}
        {aba === "plantas" && <ExploradorPlantas />}
        {aba === "guias" && <GuiasPraticos />}
        {aba === "terreno" && <PerfilTerreno />}
      </main>

      <BottomNav abaAtiva={aba} onChange={setAba} />
    </div>
  );
}
