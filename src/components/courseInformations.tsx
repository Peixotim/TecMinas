"use client";

// --- Importações (sem alterações, mas adicionei Lucide para o botão voltar) ---
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle,
  Award,
  Users,
  Target,
  Info,
  ChevronLeft,
} from "lucide-react"; // Adicionado ChevronLeft
import { slugify } from "@/utils/slugify";
import { CourseCardProps } from "./courseCards";
import { useState, useCallback } from "react";
import Modal from "./modalContactsCourses/modal";
import SubscriptionForm from "./modalContactsCourses/SubscriptionForm";

// --- Interfaces (sem alterações) ---
export interface CourseSection {
  title: string;
  content: string;
}
export interface CourseInformationsProps {
  title: string;
  sections: CourseSection[];
  img?: { src: string; alt: string };
  whatYouWillLearn?: string[];
  depoiments?: { texto: string; autor: string; cargo: string };
}
interface ComponentProps {
  course: CourseInformationsProps;
  cardData?: CourseCardProps;
}

// --- Componente Principal Refatorado ---
export default function CourseInformations({
  course,
  cardData,
}: ComponentProps) {
  const categorySlug = cardData ? slugify(cardData.subTitle) : "";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<"form" | "loading" | "success">(
    "form"
  );

  const openModal = () => {
    setFormStatus("form");
    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus("loading");
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Enviando os seguintes dados para a API:", data);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setFormStatus("success");
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
      alert(
        "Houve um problema ao enviar sua inscrição. Por favor, tente novamente."
      );
      setFormStatus("form");
    }
  };

  return (
    // FUNDO: Trocado para o nosso padrão premium 'zinc-50'
    <div className="relative bg-zinc-50 min-h-screen text-zinc-800 font-sans overflow-hidden">
      {/* EFEITO DE FUNDO: Gradiente sutil com a nova cor da marca */}
      <div
        className="absolute top-0 left-0 w-full h-1/2 bg-gradient-radial from-red-500/5 via-zinc-50/5 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto p-4 sm:p-6 md:p-8 z-10">
        {/* BOTÃO VOLTAR: Estilo unificado com a outra página para consistência */}
        <Link
          href={"/"}
          className="group mb-8 inline-flex items-center gap-1.5 text-zinc-600 hover:text-red-700 transition-colors duration-300 font-semibold"
        >
          <ChevronLeft
            size={20}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          Voltar para Inicio
        </Link>

        {/* CARD PRINCIPAL: Fundo branco para contraste e sombra mais suave */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <header className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="flex flex-col gap-4">
              {/* DESTAQUE: Usando a cor de destaque da marca */}
              <span className="font-semibold text-red-700">
                {cardData?.subTitle}
              </span>
              {/* TIPOGRAFIA: 'font-bold' em vez de 'extrabold' para mais elegância */}
              <h1 className="text-4xl sm:text-5xl font-bold text-zinc-800 tracking-tight">
                {course.title}
              </h1>
              <p className="text-lg text-zinc-600">
                Transforme sua carreira com um curso prático, focado no mercado
                e com certificado reconhecido.
              </p>
              {cardData && (
                <div className="flex items-center gap-2 text-amber-500 mt-2">
                  {Array.from({ length: cardData.rating }).map((_, index) => (
                    <span key={index} className="text-2xl">
                      ★
                    </span>
                  ))}
                  <span className="text-sm text-zinc-500 font-medium">
                    ({cardData.rating}.0 de 5 estrelas)
                  </span>
                </div>
              )}
            </div>

            <div className="relative">
              {course.img && (
                <div className="aspect-video md:aspect-square relative rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={course.img.src}
                    alt={course.img.alt}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
              )}
              {/* BOTÃO CTA: Cor principal da marca, com sombra e efeito de hover mais sofisticados */}
              <button
                onClick={openModal}
                className="mt-6 w-full flex flex-col items-center justify-center gap-1 bg-red-700 text-white p-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.03]"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle size={22} />
                  <span>Quero me Inscrever</span>
                </div>
                <span className="text-xs font-normal opacity-80">
                  Vagas limitadas!
                </span>
              </button>
            </div>
          </header>
        </div>

        <main className="mt-16 md:mt-20 space-y-8">
          {/* CARDS DE CONTEÚDO: Fundo branco e sombra suave */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
            {/* HIERARQUIA VISUAL: Ícone com a cor de destaque, texto com a cor principal */}
            <h2 className="text-3xl font-bold text-zinc-800 mb-4 flex items-center gap-3">
              <Info className="text-red-700" /> Sobre o Curso
            </h2>
            <p className="text-zinc-600 leading-relaxed">
              Este curso foi desenhado para fornecer um conhecimento aprofundado
              e prático sobre **{course.title}**. Com uma abordagem focada em
              projetos reais, você desenvolverá as habilidades essenciais que o
              mercado de trabalho exige. Nossa metodologia combina teoria e
              prática para garantir uma experiência de aprendizado completa e
              eficaz.
            </p>
          </div>

          {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-zinc-800 mb-6 flex items-center gap-3">
                <Award className="text-red-700" /> O que você vai aprender
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {course.whatYouWillLearn.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle
                      className="text-red-700 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-zinc-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {course.sections.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg"
            >
              <h2 className="text-3xl font-bold text-zinc-800 mb-4 flex items-center gap-3">
                {section.title.includes("Objetivo") ? (
                  <Target className="text-red-700" />
                ) : (
                  <Users className="text-red-700" />
                )}
                {section.title}
              </h2>
              <p className="text-zinc-600 leading-relaxed">{section.content}</p>
            </div>
          ))}

          {course.depoiments && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
              <blockquote className="text-center">
                <p className="text-xl italic text-zinc-800">
                  `{course.depoiments.texto}`
                </p>
                <footer className="mt-6">
                  <p className="font-bold text-red-700">
                    {course.depoiments.autor}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {course.depoiments.cargo}
                  </p>
                </footer>
              </blockquote>
            </div>
          )}
        </main>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <SubscriptionForm
          status={formStatus}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          selectedContent={course.title}
        />
      </Modal>
    </div>
  );
}
