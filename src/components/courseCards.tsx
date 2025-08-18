import Link from "next/link";
import Image from "next/image";
import { PlusCircle } from "lucide-react";
import { slugify } from "@/utils/slugify";

// --- Interface de Props ---
// ADIÇÃO: Adicionei a prop 'flag' para tornar a etiqueta dinâmica
export interface CourseCardProps {
  title: string;
  subTitle: string; // A categoria do curso
  img?: {
    src: string;
    alt: string;
  };
  rating: number;
  flag?: string; // Ex: "🔥 Últimas Vagas", "⭐ Lançamento"
}

// --- Componente Funcional com Estilo Premium ---
export default function CourseCard({
  title,
  subTitle,
  img,
  rating,
  flag, // Adicionada a nova prop
}: CourseCardProps) {
  return (
    // --- Contêiner Principal do Card ---
    // CORES: Sombra de hover agora usa a cor da marca (vermelho)
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-red-500/10">
      {/* --- Seção da Imagem --- */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={img?.src || "/images/placeholder.jpg"} // Melhor ter um placeholder padrão
          alt={img?.alt || "Imagem do curso"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* FLAG DINÂMICA: Agora a etiqueta vem dos dados do curso */}
        {flag && (
          <span className="absolute top-3 left-3 rounded-full bg-red-700 px-3 py-1 text-xs font-semibold text-white shadow-md">
            {flag}
          </span>
        )}
      </div>

      {/* --- Seção de Conteúdo --- */}
      <div className="flex flex-grow flex-col p-6">
        {/* Categoria e Avaliação */}
        <div className="mb-3 flex items-center justify-between">
          {/* COR: Categoria agora usa o vermelho da marca */}
          <p className="text-sm font-medium text-red-700">{subTitle}</p>
          {/* DETALHE PREMIUM: Trocado para 'amber' para um tom de dourado mais rico */}
          <div className="flex items-center gap-1 text-amber-500">
            {Array.from({ length: rating }).map((_, index) => (
              <span key={index} className="text-base">
                ★
              </span>
            ))}
          </div>
        </div>

        {/* TÍTULO: Cores alinhadas com a identidade visual */}
        <h2 className="mb-3 text-xl font-bold leading-snug text-zinc-800 transition-colors duration-300 group-hover:text-red-700">
          {title}
        </h2>

        {/* DESCRIÇÃO: Cor de texto consistente */}
        <p className="text-sm text-zinc-600 font-medium">
          Curso reconhecido nacionalmente. Avance na sua carreira com
          flexibilidade!
        </p>

        {/* Elemento para empurrar o botão para o final do card */}
        <div className="flex-grow" />

        {/* Botão de Ação */}
        <Link
          href={`/cursos/${slugify(title)}`}
          // BOTÃO: Estilo de CTA primário, consistente com o resto do site
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-300 hover:scale-105 hover:bg-red-800 hover:shadow-xl hover:shadow-red-500/30"
        >
          <PlusCircle size={20} className="flex-shrink-0" />
          Ver Mais Detalhes
        </Link>
      </div>
    </div>
  );
}
