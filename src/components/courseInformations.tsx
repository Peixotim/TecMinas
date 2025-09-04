// Salve em: seu arquivo CourseInformations.tsx (nenhuma alteração necessária)

"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ChevronLeft } from "lucide-react";
import { useState, useCallback } from "react";
import Modal from "./modalContactsCourses/modal";
import SubscriptionForm from "./modalContactsCourses/SubscriptionForm";
import { CourseCardProps } from "./courseCards";
import { submitSubscription } from "./lib/api";

// --- Interfaces ---
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

// --- Componente Principal ---
export default function CourseInformations({
  course,
  cardData,
}: ComponentProps) {
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

    try {
      const formData = new FormData(event.currentTarget);

      const data = {
        fullerName: formData.get("name") as string,
        phone: (formData.get("whatsapp") as string).replace(/\D/g, ""),
        areaOfInterest: formData.get("interestArea") as string,
        enterpriseId: 1, // Lembre-se de definir o ID correto aqui
      };

      await submitSubscription(data);

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
    <div className="relative bg-zinc-50 min-h-screen text-zinc-800 font-sans overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-1/2 bg-gradient-radial from-red-500/5 via-zinc-50/5 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto p-4 sm:p-6 md:p-8 z-10">
        <Link
          href={"/"}
          className="group mb-8 inline-flex items-center gap-1.5 text-zinc-600 hover:text-red-700 transition-colors duration-300 font-semibold"
        >
          <ChevronLeft
            size={20}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          Voltar para Início
        </Link>
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <header className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="flex flex-col gap-4">
              <span className="font-semibold text-red-700">
                {cardData?.subTitle}
              </span>
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
          {/* O resto do seu JSX aqui */}
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
