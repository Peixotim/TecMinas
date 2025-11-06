"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "./lib/utils";
import { motion, useScroll } from "framer-motion";
import Modal from "./modalContactsCourses/modal";
import SubscriptionForm from "./modalContactsCourses/SubscriptionForm";
import { submitSubscription } from "./lib/api";


import {
  trackLead,
  trackCompleteRegistration,

} from "./lib/metaEvents"; // Funções do Servidor
import { getClientBrowserData } from "./lib/metaClient"; // Helper do Cliente

const menuItems = [
  { name: "Início", href: "#inicio" },
  { name: "Sobre Nós", href: "#sobrenos" },
  { name: "Cursos", href: "#cursos" },
  { name: "Contato", href: "#contato" },
  { name: "SISTEC-MEC", href: "/sistec" },
];

export const Header = () => {
  const [menuState, setMenuState] = useState(false);
  const [hidden, setHidden] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<"form" | "loading" | "success">(
    "form"
  );

  // 2. FUNÇÃO 'openModal' ATUALIZADA
  const openModal = () => {
    setFormStatus("form");
    setIsModalOpen(true);
  
 
  };

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  // 3. FUNÇÃO 'handleFormSubmit' ATUALIZADA
  const handleFormSubmit = async (formData: FormData) => {
    setFormStatus("loading");

    try {
      // Coleta dados do formulário
      const name = (formData.get("name") as string) || "";
      const email = (formData.get("email") as string) || "";
      const whatsappRaw = (formData.get("whatsapp") as string) || "";
      const whatsappClean = whatsappRaw.replace(/\D/g, "");

      // Coleta dados do navegador
      const clientData = getClientBrowserData();

      // Combina todos os dados do usuário para a Meta
      const userData = {
        first_name: name,
        phone: whatsappRaw,
        email: email,
        external_id: whatsappClean,
        fbp: clientData.fbp, // Dado de melhoria
        fbc: clientData.fbc, // Dado de melhoria
      };

      // Dados para seu banco de dados
      const subscriptionData = {
        name: name,
        phone: whatsappClean,
        areaOfInterest: "Area Desejada",
        enterpriseId: Number(process.env.NEXT_PUBLIC_ENTERPRISE_ID) || 3,
      };

      // Opcional: trackEvent("Lead");
      await trackLead(
        userData,
        undefined, // Sem custom data
        clientData.event_source_url, // Dado de melhoria
        clientData.user_agent // Dado de melhoria
      );

      await submitSubscription(subscriptionData);

      // Opcional: trackEvent("CompleteRegistration");
      await trackCompleteRegistration(
        userData,
        undefined, // Sem custom data
        clientData.event_source_url, // Dado de melhoria
        clientData.user_agent // Dado de melhoria
      );

      setFormStatus("success");
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
      alert("Houve um problema. Tente novamente.");
      setFormStatus("form");
    }
  };

  const { scrollY } = useScroll();
  React.useEffect(() => {
    let lastScroll = 0;
    return scrollY.on("change", (latest) => {
      setHidden(latest > lastScroll && latest > 80);
      lastScroll = latest;
    });
  }, [scrollY]);

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed top-0 left-0 z-50 w-full"
      >
        <nav
          data-state={menuState ? "active" : undefined}
          className={cn(
            "backdrop-blur-2xl bg-white/80 dark:bg-black/60 border-b border-zinc-200 dark:border-zinc-800 shadow-sm"
          )}
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex items-center justify-between py-4">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-3"
              >
                <div className="relative w-40 h-20">
                  <Image
                    src="/tecminasImagem.png"
                    alt="TecMinas Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>

              <ul className="hidden lg:flex gap-10 font-medium text-[16px]">
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="relative text-zinc-700 dark:text-zinc-200 hover:text-red-600 transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="hidden lg:flex">
                <Button
                  onClick={openModal}
                  className="rounded-full bg-white text-black transitions hover:text-white hover:bg-green-600 px-6 shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </Button>
              </div>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="lg:hidden relative z-50"
              >
                {menuState ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {menuState && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800 shadow-md px-6 py-6"
            >
              <ul className="space-y-6 text-lg font-medium">
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuState(false)}
                      className="block text-zinc-700 dark:text-zinc-200 hover:text-red-600 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button
                  onClick={() => {
                    openModal();
                    setMenuState(false);
                  }}
                  className="w-full rounded-full bg-red-600 hover:bg-red-700 shadow-lg text-white"
                >
                  WhatsApp
                </Button>
              </div>
            </motion.div>
          )}
        </nav>
      </motion.header>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        modalType="subscription"
        courseName="Area Desejada"
      >
        <SubscriptionForm
          status={formStatus}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          selectedContent="Area Desejada"
        />
      </Modal>
    </>
  );
};