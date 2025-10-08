"use client";

import Link from "next/link";
import Image from "next/image";
import { Dot, ArrowLeft } from "lucide-react";

// Paleta TecMinas (ajuste se tiver o guia oficial)
const RED = "#D7262D";
const RED_DARK = "#B71B22";
const SLATE = "#0F172A"; // títulos
const SOFT = "#F6F7F9"; // fundo leve

export default function PageSistecMecTecMinas() {
  return (
    <main className="min-h-screen bg-white text-slate-700">
      {/* Voltar */}
      <div className="container mx-auto max-w-7xl px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 pt-6 text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> <b>Voltar</b>
        </Link>
      </div>

      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        {/* fundo geométrico em vermelho */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-red-700" />
          <div className="absolute -right-24 top-0 h-[120%] w-[55%] -skew-x-6 rounded-l-[3rem] bg-white backdrop-blur-sm" />
          <div className="absolute left-8 top-10 h-40 w-40 rounded-full  blur-2xl" />
        </div>

        <div className="container mx-auto max-w-7xl px-6 py-14 sm:py-20">
          <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Coluna esquerda */}
            <div className="text-white">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-wide">
                <Dot className="h-3 w-3 fill-current" />
                Educação Técnica Credenciada
              </span>

              <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-[-0.02em] sm:text-5xl">
                Somos{" "}
                <span className="underline decoration-white/50 underline-offset-4">
                  Aprovados pelo SISTEC–MEC
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-white/90">
                Transparência que gera confiança: a TecMinas possui{" "}
                <strong className="text-white">registro e conformidade</strong>{" "}
                no <strong>SISTEC/MEC</strong>. Sua certificação tem validade
                nacional e pode ser conferida publicamente.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="https://sistec.mec.gov.br/consultapublicaunidadeensino"
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-2xl px-6 py-3 font-semibold text-white shadow-lg transition hover:translate-y-[-1px]"
                  style={{ backgroundColor: RED }}
                >
                  Verificar no SISTEC
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              {/* badges de confiança */}
              <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-3">
                {[
                  "Credenciada pelo MEC",
                  "Consulta pública no SISTEC",
                  "Provas 100% online",
                ].map((b) => (
                  <li
                    key={b}
                    className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 ring-1 ring-white/20"
                  >
                    <CheckSolid className="h-5 w-5 text-white" />
                    <span className="text-white/90">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coluna direita: Selo + métricas + captura SISTEC */}
            <div className="relative">
              {/* Cartão com selo */}
              <div className="rounded-3xl bg-white p-6 shadow-[0_18px_48px_-12px_rgba(15,23,42,0.25)] ring-1 ring-slate-200">
                <div className="flex items-center gap-4">
                  <SealSistec className="h-16 w-16" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Selo de Conformidade
                    </p>
                    <p className="text-xl font-bold" style={{ color: SLATE }}>
                      Aprovação SISTEC–MEC
                    </p>
                  </div>
                </div>

                <dl className="mt-6 grid grid-cols-3 gap-3">
                  <Stat label="Alunos Certificados" value="500+" />
                  <Stat label="Taxa de Aprovação" value="98%" />
                  <Stat
                    label="Avaliação Média"
                    value={
                      <span className="inline-flex items-center">
                        5<span className="ml-1">★</span>
                      </span>
                    }
                  />
                </dl>
                <p className="mt-5 text-xs text-slate-500">
                  Todos os certificados seguem os requisitos legais e podem ser
                  conferidos oficialmente.
                </p>
              </div>

              {/* Captura / mock SISTEC */}
              <figure className="mt-4 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
                <Image
                  src="/Sistec.webp"
                  alt="Portal SISTEC/MEC — Consulta Pública (Unidade de Ensino)"
                  width={960}
                  height={600}
                  sizes="(min-width: 560px) 430px, 100vw"
                  className="h-auto w-full object-cover"
                  priority
                />
                <figcaption className="flex items-center justify-between gap-3 px-4 py-2 text-[12px] text-slate-600">
                  <span>Portal SISTEC/MEC — Consulta Pública</span>
                  <Link
                    href="https://sistec.mec.gov.br/consultapublicaunidadeensino"
                    target="_blank"
                    className="font-semibold text-slate-800 hover:underline"
                  >
                    Verificar agora
                  </Link>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* COMO CONSULTAR */}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-6">
          <div
            className="rounded-3xl p-6 md:p-8 ring-1"
            style={{ backgroundColor: SOFT, borderColor: "#E5E7EB" }}
          >
            <h2
              className="text-center text-2xl font-extrabold tracking-[-0.01em] sm:text-3xl"
              style={{ color: SLATE }}
            >
              Como confirmar nossa{" "}
              <span style={{ color: RED }}>aprovação no MEC</span>
            </h2>

            <p className="mx-auto mt-3 max-w-3xl text-center text-slate-600">
              Em poucos passos, você confere nossa situação cadastral direto na
              base oficial do Ministério da Educação.
            </p>

            <ol className="mx-auto mt-6 max-w-3xl space-y-4">
              {[
                <>
                  Acesse o portal{" "}
                  <Link
                    href="https://sistec.mec.gov.br/consultapublicaunidadeensino"
                    className="font-semibold hover:underline"
                    style={{ color: RED }}
                    target="_blank"
                  >
                    SISTEC/MEC
                  </Link>
                </>,
                <>
                  Clique em{" "}
                  <strong>Consulta Pública de Instituição de Ensino</strong>
                </>,
                <>
                  Selecione <strong>Pará</strong> e a cidade de{" "}
                  <strong>Marabá</strong>
                </>,
                <>
                  Procure por{" "}
                  <strong>
                    SISTEMA DE ENSINO INTEGRADO - MARABÁ [ 57209 ]
                  </strong>{" "}
                  e visualize os detalhes
                </>,
              ].map((content, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: RED }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-slate-700">{content}</span>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex flex-col items-center gap-3">
              <Link
                href="https://sistec.mec.gov.br/consultapublicaunidadeensino"
                target="_blank"
                className="inline-flex items-center justify-center rounded-2xl px-6 py-3 font-semibold text-white shadow transition hover:translate-y-[-1px]"
                style={{ backgroundColor: RED }}
              >
                Verificar agora no MEC
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <p className="text-center text-sm text-slate-500">
                Dúvidas? Nosso time está pronto para ajudar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-12">
        <div className="container mx-auto max-w-6xl px-6">
          <h2
            className="mb-6 text-center text-3xl font-extrabold tracking-[-0.01em]"
            style={{ color: SLATE }}
          >
            Perguntas <span style={{ color: RED }}>Frequentes</span>
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm open:border-red-100 open:bg-red-50/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                  <span className="font-semibold text-slate-800 group-open:text-slate-900">
                    {f.q}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-1 py-0.5 text-xs text-slate-500 group-open:bg-white group-open:text-slate-700">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="pb-16">
        <div className="container mx-auto max-w-7xl px-6">
          <div
            className="flex flex-col items-center justify-between gap-4 rounded-3xl p-6 sm:flex-row"
            style={{
              background:
                "linear-gradient(135deg, rgba(247,247,247,1) 0%, rgba(255,255,255,1) 100%)",
              boxShadow: "0 18px 48px -12px rgba(15,23,42,.15)",
            }}
          >
            <p className="text-center text-lg font-semibold text-slate-900 sm:text-left">
              Pronto para validar sua formação com{" "}
              <span style={{ color: RED }}>certificação oficial</span>?
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:justify-end">
              <Link
                href="https://sistec.mec.gov.br/consultapublicaunidadeensino"
                target="_blank"
                className="inline-flex items-center justify-center rounded-2xl px-6 py-3 font-semibold text-white shadow transition hover:translate-y-[-1px]"
                style={{ backgroundColor: RED }}
              >
                Verificar no SISTEC
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ========== componentes visuais ========== */

function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckSolid({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20Zm4.3 7.7-5 5a1 1 0 01-1.4 0l-2-2a1 1 0 111.4-1.4l1.3 1.3 4.3-4.3a1 1 0 111.4 1.4Z" />
    </svg>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
      <div className="text-2xl font-extrabold" style={{ color: RED }}>
        {value}
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">
        {label}
      </div>
    </div>
  );
}

function SealSistec(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0%" stopColor={RED} />
          <stop offset="100%" stopColor={RED_DARK} />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#g)" />
      <circle
        cx="60"
        cy="60"
        r="49"
        fill="#fff"
        stroke="#FFE3E3"
        strokeWidth="3"
      />
      <path
        d="M38 64l14 12 30-34"
        fill="none"
        stroke={RED}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const FAQ = [
  {
    q: "O que é o SISTEC–MEC?",
    a: "É o sistema oficial do MEC que registra e acompanha instituições e cursos técnicos. A consulta pública permite verificar a regularidade da TecMinas.",
  },
  {
    q: "O diploma tem validade nacional?",
    a: "Sim. Estando a instituição regular no SISTEC/MEC, os certificados emitidos cumprem os requisitos legais e têm reconhecimento nacional.",
  },
  {
    q: "Como faço para conferir a TecMinas no SISTEC?",
    a: "Basta acessar o portal do SISTEC/MEC, escolher a consulta pública de unidade de ensino e buscar por TecMinas na sua localidade.",
  },
  {
    q: "As avaliações são presenciais?",
    a: "A TecMinas prioriza processos online (conforme regimento) e orienta o aluno em todas as etapas para garantir segurança e transparência.",
  },
];
