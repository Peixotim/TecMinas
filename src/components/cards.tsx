import Image from "next/image";
import { PlusCircle, Check } from "lucide-react"; // Using a cleaner check icon
import Link from "next/link";
import { slugify } from "@/utils/slugify";

export interface CardPageProps {
  title: string;
  description: string;
  category: string;
  maisClicado: boolean;
  lancamentos: boolean;
  flag: string;
  benneficies: string[];
  img?: {
    src: string;
    alt: string;
  };
  // Color props are not used directly but kept for type consistency
  bgColorFlag: string;
  bgColorCategory: string;
  bgColorHover: string;
}

export default function CardPage({
  title,
  description,
  flag,
  benneficies,
  category,
  img,
  maisClicado,
  lancamentos,
}: CardPageProps) {
  return (
    // CONTAINER: Updated hover effects, border, and rounding to match the design system
    <div className="group relative flex h-full w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-red-500/10">
      {/* "LANÇAMENTO" BANNER: Colors refined for better contrast and branding */}
      {lancamentos && (
        <div className="pointer-events-none absolute top-0 left-0 z-20 h-32 w-32 overflow-hidden">
          <div className="absolute top-0 left-0 flex h-8 w-[170%] items-center justify-center bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg transform -translate-x-1/4 translate-y-4 -rotate-45">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white drop-shadow-sm">
              ⭐ Lançamento
            </span>
          </div>
        </div>
      )}

      {/* IMAGE SECTION */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={img?.src || "/images/placeholder.jpeg"} // Using a standard placeholder
          alt={img?.alt || "Imagem do curso"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* FLAG: Style maintained for a modern look */}
        {flag && (
          <span className="absolute top-3 right-3 rounded-full bg-black/30 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
            {flag}
          </span>
        )}
      </div>

      {/* CONTENT SECTION */}
      <div className="relative z-10 flex flex-grow flex-col justify-between p-5 font-sans">
        <div>
          {/* TAGS: Colors aligned with the brand palette */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
              {category}
            </span>
            {maisClicado && (
              <span className="inline-block rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                🔥 Mais Procurado
              </span>
            )}
          </div>

          {/* TITLE: Typography and colors updated */}
          <h2 className="mb-2 text-lg font-bold leading-tight text-zinc-800 transition-colors duration-300 group-hover:text-red-700 sm:text-xl">
            {title}
          </h2>

          {/* DESCRIPTION: Limited to 3 lines for consistency, colors updated */}
          <p className="mb-4 text-sm leading-relaxed text-zinc-600 line-clamp-3">
            {description}
          </p>

          {/* BENEFITS LIST: Cleaner icon and consistent text colors */}
          <ul className="mb-6 space-y-2 text-sm text-zinc-600">
            {benneficies.slice(0, 2).map(
              (
                item,
                i // Showing only the first 2 benefits for a cleaner look
              ) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                  <span>{item}</span>
                </li>
              )
            )}
          </ul>
        </div>

        {/* BUTTON: Style unified with the primary CTA button from other components */}
        <div className="mt-auto">
          {/* CORREÇÃO APLICADA AQUI: O link volta a usar a 'category' */}
          <Link
            href={`/cursos/${slugify(category)}`}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-700 py-3 text-base font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-300 ease-in-out hover:scale-[1.03] hover:bg-red-800 hover:shadow-xl hover:shadow-red-500/30"
          >
            <PlusCircle size={20} />
            Ver Detalhes
          </Link>
        </div>
      </div>
    </div>
  );
}
