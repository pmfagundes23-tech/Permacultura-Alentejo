"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, User } from "lucide-react";
import { Mensagem } from "@/types";
import { PERGUNTAS_RAPIDAS } from "@/data/systemPrompt";

const MENSAGEM_BOAS_VINDAS: Mensagem = {
  id: "boas-vindas",
  papel: "assistant",
  conteudo:
    "Olá! 🌱 Sou o Oráculo Permacultural da Permacultura Alentejo. Pergunta-me sobre água, solo, zoneamento ou plantas — respondo sempre em 3 passos práticos e adaptados ao clima do Alentejo. Podes usar uma das perguntas rápidas abaixo ou escrever a tua própria pergunta.",
};

function novoId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function OraculoChat() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([MENSAGEM_BOAS_VINDAS]);
  const [texto, setTexto] = useState("");
  const [aEnviar, setAEnviar] = useState(false);
  const fimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, aEnviar]);

  async function enviarMensagem(conteudo: string) {
    const texto_limpo = conteudo.trim();
    if (!texto_limpo || aEnviar) return;

    const mensagemUser: Mensagem = { id: novoId(), papel: "user", conteudo: texto_limpo };
    const historico = [...mensagens, mensagemUser];
    setMensagens(historico);
    setTexto("");
    setAEnviar(true);

    try {
      const resposta = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historico.map((m) => ({ role: m.papel, content: m.conteudo })),
        }),
      });

      if (!resposta.ok) throw new Error("Falha na resposta do Oráculo");
      const dados = await resposta.json();

      setMensagens((atual) => [
        ...atual,
        { id: novoId(), papel: "assistant", conteudo: dados.reply as string },
      ]);
    } catch (erro) {
      setMensagens((atual) => [
        ...atual,
        {
          id: novoId(),
          papel: "assistant",
          conteudo:
            "⚠️ Não foi possível ligar ao Oráculo agora. Verifica a tua ligação e tenta novamente.",
        },
      ]);
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Perguntas rápidas */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3">
        {PERGUNTAS_RAPIDAS.map((pergunta) => (
          <button
            key={pergunta}
            type="button"
            disabled={aEnviar}
            onClick={() => enviarMensagem(pergunta)}
            className="shrink-0 whitespace-nowrap rounded-full border border-oliva/30 bg-white px-3 py-1.5 text-xs font-medium text-oliva-dark shadow-soft transition active:scale-95 disabled:opacity-50"
          >
            {pergunta}
          </button>
        ))}
      </div>

      {/* Lista de mensagens */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-3">
        {mensagens.map((m) => (
          <BolhaMensagem key={m.id} mensagem={m} />
        ))}
        {aEnviar && <BolhaACarregar />}
        <div ref={fimRef} />
      </div>

      {/* Caixa de input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          enviarMensagem(texto);
        }}
        className="flex items-end gap-2 border-t border-terra/15 bg-bege px-3 py-3"
      >
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              enviarMensagem(texto);
            }
          }}
          rows={1}
          placeholder="Escreve a tua pergunta sobre permacultura..."
          className="max-h-24 flex-1 resize-none rounded-2xl border border-terra/20 bg-white px-4 py-2.5 text-sm text-terra-dark outline-none focus:border-oliva"
        />
        <button
          type="submit"
          disabled={aEnviar || !texto.trim()}
          aria-label="Enviar mensagem"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-oliva text-bege shadow-soft transition active:scale-95 disabled:opacity-40"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}

function BolhaMensagem({ mensagem }: { mensagem: Mensagem }) {
  const isUser = mensagem.papel === "user";
  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-terra text-bege" : "bg-oliva text-bege"
        }`}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
      </div>
      <div
        className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-soft ${
          isUser
            ? "rounded-br-sm bg-terra text-bege"
            : "rounded-bl-sm bg-white text-terra-dark"
        }`}
      >
        {mensagem.conteudo}
      </div>
    </div>
  );
}

function BolhaACarregar() {
  return (
    <div className="flex items-end gap-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-oliva text-bege">
        <Sparkles className="h-3.5 w-3.5" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-soft">
        <span className="dot-bounce h-1.5 w-1.5 rounded-full bg-oliva" style={{ animationDelay: "0ms" }} />
        <span className="dot-bounce h-1.5 w-1.5 rounded-full bg-oliva" style={{ animationDelay: "150ms" }} />
        <span className="dot-bounce h-1.5 w-1.5 rounded-full bg-oliva" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
